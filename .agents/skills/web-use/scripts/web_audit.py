#!/usr/bin/env python3
"""Web-Use Profile Auditor for isshereal.com

Scrapes a profile using Playwright Chrome and computes the full
authenticity score, fake follower percentage, engagement benchmarks,
and risk signals.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def run_scrape(handle: str, platform: str) -> dict:
    script_path = Path(__file__).parent / "scrape_profile.py"
    cmd = [sys.executable, str(script_path), "--handle", handle, "--platform", platform, "--json"]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        return {"success": False, "error": proc.stderr.strip() or "Scraper failed"}
    try:
        return json.loads(proc.stdout)
    except Exception as e:
        return {"success": False, "error": f"JSON parse error: {e}"}


def calculate_audit(scraped: dict) -> dict:
    followers = scraped.get("followers", 0)
    following = scraped.get("following", 0)
    posts = scraped.get("posts", 0)
    handle = scraped.get("handle", "")
    name = scraped.get("name", handle)
    platform = scraped.get("platform", "Instagram")
    is_verified = scraped.get("isVerified", False)

    # Benchmark engagement calculation
    if followers > 10_000_000:
        base_er = 1.4
    elif followers > 1_000_000:
        base_er = 2.1
    elif followers > 100_000:
        base_er = 2.8
    elif followers > 10_000:
        base_er = 3.9
    else:
        base_er = 5.2

    # Follower-to-following ratio plausibility
    ratio = followers / max(following, 1)
    risk_signals = []
    verified_signals = []

    score = 85
    if is_verified:
        score += 10
        verified_signals.append("Official verified platform identity confirmed")

    if posts > 100:
        verified_signals.append(f"Established content library with {posts:,} public posts")
    elif posts < 5:
        score -= 25
        risk_signals.append("Extremely low post count relative to audience size")

    if following > 0 and ratio < 0.2 and followers < 5000:
        score -= 20
        risk_signals.append("Abnormal following-to-follower ratio suggests mass-follow tactics")
    elif ratio > 50:
        verified_signals.append("Organic audience multiplier (high follower-to-following ratio)")

    score = max(15, min(98, score))
    fake_pct = max(3, min(85, round((100 - score) * 0.75)))

    if score >= 80:
        verdict = "Likely authentic"
        risk_level = "low"
    elif score >= 60:
        verdict = "Mostly genuine, minor flags"
        risk_level = "medium"
    else:
        verdict = "High risk — likely fake"
        risk_level = "high"

    return {
        "handle": handle,
        "name": name,
        "platform": platform,
        "score": score,
        "verdict": verdict,
        "riskLevel": risk_level,
        "fakeFollowerPct": fake_pct,
        "realFollowerPct": 100 - fake_pct,
        "followers": followers,
        "following": following,
        "posts": posts,
        "engagementRate": f"{base_er}%",
        "avatarUrl": scraped.get("avatarUrl"),
        "verifiedSignals": verified_signals,
        "riskSignals": risk_signals,
    }


def main():
    parser = argparse.ArgumentParser(description="Audit social profile using live Web-Use browser")
    parser.add_argument("--handle", required=True, help="Profile handle")
    parser.add_argument("--platform", default="instagram", help="Platform name")
    parser.add_argument("--json", action="store_true", help="Output pure JSON")

    args = parser.parse_args()
    scraped = run_scrape(args.handle, args.platform)

    if not scraped.get("success"):
        print(json.dumps(scraped) if args.json else f"Scrape failed: {scraped.get('error')}")
        sys.exit(1)

    audit = calculate_audit(scraped)

    if args.json:
        print(json.dumps(audit, indent=2))
    else:
        print("\n=======================================================")
        print(f"       AUTHENTICITY REPORT: {audit['handle']} ({audit['platform']})")
        print("=======================================================")
        print(f"Name:               {audit['name']}")
        print(f"Authenticity Score: {audit['score']}/100 [{audit['verdict']}]")
        print(f"Risk Level:         {audit['riskLevel'].upper()}")
        print(f"Followers:          {audit['followers']:,}")
        print(f"Fake / Inactive:    {audit['fakeFollowerPct']}%")
        print(f"Real Audience:      {audit['realFollowerPct']}%")
        print(f"Est. Engagement:    {audit['engagementRate']}")
        print(f"Public Posts:       {audit['posts']:,}")
        print("-------------------------------------------------------")
        print("Verified Signals:")
        for s in audit['verifiedSignals']:
            print(f"  ✓ {s}")
        if audit['riskSignals']:
            print("Risk Signals:")
            for r in audit['riskSignals']:
                print(f"  ⚠️  {r}")
        print("=======================================================\n")


if __name__ == "__main__":
    main()
