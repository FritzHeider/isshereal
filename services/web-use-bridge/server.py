#!/usr/bin/env python3
"""Web-Use Bridge Server for Cloud Run

Production HTTP server that runs Playwright Chromium to scrape live
social media profiles. Designed for Google Cloud Run deployment.

Endpoints:
  GET /health           → {"status": "ok"}
  GET /scrape?handle=X&platform=instagram → live profile JSON
"""

import json
import os
import re
import sys
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import parse_qs, urlparse
from typing import Any, Dict

# ── Shared utilities ──────────────────────────────────────────────────────

API_KEY = os.environ.get("API_KEY", "")


def parse_count(val_str: str) -> int:
    if not val_str:
        return 0
    val_str = val_str.strip().replace(',', '')
    match = re.search(r'([\d.]+)\s*([KMBkmb])?', val_str)
    if not match:
        return 0
    num = float(match.group(1))
    mult = match.group(2)
    if mult:
        mult = mult.upper()
        if mult == 'K':
            return int(num * 1_000)
        elif mult == 'M':
            return int(num * 1_000_000)
        elif mult == 'B':
            return int(num * 1_000_000_000)
    return int(num)


def clean_handle(handle: str) -> str:
    cleaned = re.sub(
        r'^https?://(www\.)?(instagram\.com|tiktok\.com|youtube\.com/@?)/?',
        '', handle, flags=re.IGNORECASE
    )
    cleaned = cleaned.lstrip('@').split('/')[0].split('?')[0].strip().lower()
    return cleaned


# ── Scraper functions ─────────────────────────────────────────────────────

def scrape_instagram(page, handle: str) -> Dict[str, Any]:
    """Scrape Instagram profile using multiple strategies."""
    avatar_url_default = f"https://ui-avatars.com/api/?name={handle}&background=059669&color=ffffff&bold=true"

    # Strategy 0: Try the web profile info endpoint (no browser needed)
    try:
        import urllib.request
        import urllib.error

        # Instagram serves OG data to known crawlers
        crawlers = [
            ("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)", f"https://www.instagram.com/{handle}/"),
            ("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", f"https://www.instagram.com/{handle}/"),
            ("Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36", f"https://i.instagram.com/api/v1/users/web_profile_info/?username={handle}"),
        ]

        for ua, url in crawlers:
            try:
                req = urllib.request.Request(url, headers={
                    "User-Agent": ua,
                    "Accept-Language": "en-US,en;q=0.9",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "X-IG-App-ID": "936619743392459",
                })
                with urllib.request.urlopen(req, timeout=8) as resp:
                    body = resp.read().decode("utf-8", errors="replace")

                # Try JSON response (mobile API)
                if body.strip().startswith("{"):
                    data = json.loads(body)
                    user = data.get("data", {}).get("user", {})
                    if user:
                        return {
                            "success": True,
                            "platform": "Instagram",
                            "handle": f"@{handle}",
                            "name": user.get("full_name", handle),
                            "followers": user.get("edge_followed_by", {}).get("count", 0),
                            "following": user.get("edge_follow", {}).get("count", 0),
                            "posts": user.get("edge_owner_to_timeline_media", {}).get("count", 0),
                            "avatarUrl": user.get("profile_pic_url_hd", user.get("profile_pic_url", avatar_url_default)),
                            "bio": user.get("biography", ""),
                            "isVerified": user.get("is_verified", False),
                        }

                # Try HTML OG meta (crawler response)
                desc = re.search(r'content="([^"]*?Followers[^"]*?Following[^"]*?Posts[^"]*?)"', body)
                if desc:
                    stats = re.search(
                        r'([\d.,KMBkmb]+)\s+Followers,\s*([\d.,KMBkmb]+)\s+Following,\s*([\d.,KMBkmb]+)\s+Posts',
                        desc.group(1), re.IGNORECASE
                    )
                    if stats:
                        title_m = re.search(r'content="([^"]*?)\s*[\(•]', body)
                        img_m = re.search(r'og:image["\s]+content="([^"]+)"', body)
                        return {
                            "success": True,
                            "platform": "Instagram",
                            "handle": f"@{handle}",
                            "name": title_m.group(1).strip() if title_m else handle,
                            "followers": parse_count(stats.group(1)),
                            "following": parse_count(stats.group(2)),
                            "posts": parse_count(stats.group(3)),
                            "avatarUrl": (img_m.group(1).replace("&amp;", "&") if img_m else avatar_url_default),
                            "bio": "",
                            "isVerified": "verified" in body.lower(),
                        }
            except Exception:
                continue
    except Exception:
        pass

    # Strategy 1: Full Playwright browser render (fallback)
    url = f"https://www.instagram.com/{handle}/"
    page.goto(url, wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(2500)

    html_content = page.content()
    title = page.title()

    desc_match = re.findall(r'\"(?:og:description|description)\" content=\"([^\"]+)\"', html_content)
    title_match = re.findall(r'\"(?:og:title|title)\" content=\"([^\"]+)\"', html_content)
    img_match = re.findall(r'\"(?:og:image)\" content=\"([^\"]+)\"', html_content)

    followers = 0
    following = 0
    posts = 0
    name = handle
    avatar_url = f"https://ui-avatars.com/api/?name={handle}&background=059669&color=ffffff&bold=true"
    bio = ""
    is_verified = False

    if desc_match:
        raw_desc = desc_match[0]
        stats = re.search(
            r'([\d.,KMBkmb]+)\s+Followers,\s*([\d.,KMBkmb]+)\s+Following,\s*([\d.,KMBkmb]+)\s+Posts',
            raw_desc, re.IGNORECASE
        )
        if stats:
            followers = parse_count(stats.group(1))
            following = parse_count(stats.group(2))
            posts = parse_count(stats.group(3))

    if title_match:
        raw_title = title_match[0]
        name_part = re.match(r'^([^(•]+)', raw_title)
        if name_part:
            name = name_part.group(1).strip()

    if img_match:
        avatar_url = img_match[0].replace('&amp;', '&')

    # JSON-LD fallback
    json_ld_matches = re.findall(r'<script type="application/ld\+json">([^<]+)</script>', html_content)
    for jld in json_ld_matches:
        try:
            data = json.loads(jld)
            if isinstance(data, dict):
                if 'name' in data and name == handle:
                    name = data['name']
                if 'description' in data:
                    bio = data['description']
                if 'interactionStatistic' in data:
                    for stat in data['interactionStatistic']:
                        if 'userInteractionCount' in stat:
                            c = int(stat['userInteractionCount'])
                            if c > followers:
                                followers = c
        except Exception:
            pass

    if 'verified' in html_content.lower() or 'aria-label="Verified"' in html_content:
        is_verified = True

    return {
        "success": followers > 0 or posts > 0,
        "platform": "Instagram",
        "handle": f"@{handle}",
        "name": name,
        "followers": followers,
        "following": following,
        "posts": posts,
        "avatarUrl": avatar_url,
        "bio": bio,
        "isVerified": is_verified,
    }


def scrape_tiktok(page, handle: str) -> Dict[str, Any]:
    url = f"https://www.tiktok.com/@{handle}"
    page.goto(url, wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(3000)

    html_content = page.content()

    followers = 0
    following = 0
    likes = 0
    name = handle
    avatar_url = f"https://ui-avatars.com/api/?name={handle}&background=059669&color=ffffff&bold=true"

    desc_match = re.findall(r'\"(?:og:description|description)\" content=\"([^\"]+)\"', html_content)
    img_match = re.findall(r'\"(?:og:image)\" content=\"([^\"]+)\"', html_content)

    if desc_match:
        stats = re.search(
            r'([\d.,KMBkmb]+)\s+Followers,\s*([\d.,KMBkmb]+)\s+Following,\s*([\d.,KMBkmb]+)\s+Likes',
            desc_match[0], re.IGNORECASE
        )
        if stats:
            followers = parse_count(stats.group(1))
            following = parse_count(stats.group(2))
            likes = parse_count(stats.group(3))

    if img_match:
        avatar_url = img_match[0].replace('&amp;', '&')

    return {
        "success": followers > 0,
        "platform": "TikTok",
        "handle": f"@{handle}",
        "name": name,
        "followers": followers,
        "following": following,
        "likes": likes,
        "posts": 0,
        "avatarUrl": avatar_url,
        "isVerified": "verified" in html_content.lower(),
    }


def scrape_youtube(page, handle: str) -> Dict[str, Any]:
    url = f"https://www.youtube.com/@{handle}"
    page.goto(url, wait_until="domcontentloaded", timeout=15000)
    page.wait_for_timeout(2500)

    html_content = page.content()
    title = page.title()

    followers = 0
    posts = 0
    name = handle
    avatar_url = f"https://ui-avatars.com/api/?name={handle}&background=ef4444&color=ffffff&bold=true"

    sub_match = re.search(r'([\d.,KMBkmb]+)\s+subscribers', html_content, re.IGNORECASE)
    video_match = re.search(r'([\d.,KMBkmb]+)\s+videos', html_content, re.IGNORECASE)
    img_match = re.findall(r'\"(?:og:image)\" content=\"([^\"]+)\"', html_content)

    if sub_match:
        followers = parse_count(sub_match.group(1))
    if video_match:
        posts = parse_count(video_match.group(1))
    if img_match:
        avatar_url = img_match[0].replace('&amp;', '&')

    return {
        "success": followers > 0,
        "platform": "YouTube",
        "handle": f"@{handle}",
        "name": title.replace(' - YouTube', '').strip() or name,
        "followers": followers,
        "following": 0,
        "posts": posts,
        "avatarUrl": avatar_url,
        "isVerified": "badge-style-type-verified" in html_content.lower(),
    }


# ── Browser Pool ──────────────────────────────────────────────────────────

_browser = None
_playwright = None


def get_browser():
    global _browser, _playwright
    if _browser is None or not _browser.is_connected():
        from playwright.sync_api import sync_playwright
        _playwright = sync_playwright().start()
        _browser = _playwright.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--single-process",
            ],
        )
    return _browser


def do_scrape(handle: str, platform: str) -> Dict[str, Any]:
    browser = get_browser()
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
        device_scale_factor=1,
    )
    page = context.new_page()
    page.add_init_script("""
        Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
        Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
        window.chrome = window.chrome || {runtime: {}};
    """)

    try:
        if platform == "tiktok":
            result = scrape_tiktok(page, handle)
        elif platform == "youtube":
            result = scrape_youtube(page, handle)
        else:
            result = scrape_instagram(page, handle)
    finally:
        context.close()

    return result


# ── HTTP Server ───────────────────────────────────────────────────────────

class BridgeHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/health":
            self._json_response(200, {"status": "ok", "service": "web-use-bridge"})
            return

        if parsed.path == "/scrape":
            # API key check
            if API_KEY:
                auth = self.headers.get("Authorization", "")
                if auth != f"Bearer {API_KEY}":
                    self._json_response(401, {"error": "Unauthorized"})
                    return

            params = parse_qs(parsed.query)
            handle = params.get("handle", [""])[0]
            platform = params.get("platform", ["instagram"])[0].lower()

            if not handle:
                self._json_response(400, {"error": "Missing handle query param"})
                return

            handle = clean_handle(handle)
            if not handle or not re.match(r'^[a-zA-Z0-9_.]+$', handle):
                self._json_response(400, {"error": "Invalid handle format"})
                return

            start = time.time()
            try:
                result = do_scrape(handle, platform)
                result["scrapeDurationMs"] = int((time.time() - start) * 1000)
                self._json_response(200, result)
            except Exception as e:
                self._json_response(500, {
                    "success": False,
                    "error": str(e),
                    "handle": handle,
                })
            return

        self._json_response(404, {"error": "Not found"})

    def _json_response(self, status: int, data: dict):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        sys.stderr.write(f"[web-use-bridge] {format % args}\n")


def main():
    port = int(os.environ.get("PORT", 8080))
    host = os.environ.get("HOST", "0.0.0.0")

    # Pre-warm the browser on startup
    print(f"Pre-warming Chromium browser...")
    get_browser()
    print(f"Browser ready.")

    server = HTTPServer((host, port), BridgeHandler)
    print(f"Web-Use Bridge Server listening on http://{host}:{port}")
    print(f"  GET /health")
    print(f"  GET /scrape?handle=<username>&platform=instagram|tiktok|youtube")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
        server.server_close()


if __name__ == "__main__":
    main()
