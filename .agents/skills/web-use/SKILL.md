---
name: web-use
description: >-
  Automates real browser sessions using Playwright and installed Chrome to inspect,
  scrape, and audit live social media profiles (Instagram, TikTok, YouTube, X, dating apps, marketplaces).
  Use this skill whenever verifying or auditing Instagram accounts, extracting live follower/post/engagement
  metrics, bypassing social media login/bot walls, or enriching profiles for isshereal.com.
---

# Web-Use Skill: Real Browser Forensics & Social Scraper

The `web-use` skill equips the assistant and developers with headless browser automation powered by Playwright and macOS Google Chrome. It allows bypassing client-side JavaScript hydration walls, bot detectors, and login prompts to extract authentic public metrics from Instagram, TikTok, YouTube, and X.

---

## Capabilities

1. **Live Instagram Profile Extraction**:
   - Extracts exact follower count, following count, post count, display name, biography, and profile image URL.
   - Bypasses Instagram's aggressive `og:description` scraping restrictions by rendering the live page in Google Chrome.
2. **TikTok & YouTube Hydration**:
   - Inspects live video channels, subscriber counts, and engagement velocity.
3. **Structured JSON Output**:
   - Direct integration into `isshereal.com`'s authenticity scoring engine.

---

## Quick Start CLI Usage

To scrape any Instagram profile live from the terminal:

```bash
# Scrape an Instagram profile
python3 .agents/skills/web-use/scripts/scrape_profile.py --handle nike --platform instagram --json

# Scrape an Instagram profile with verbose output
python3 .agents/skills/web-use/scripts/scrape_profile.py --handle cristiano --platform instagram

# Run a full authenticity audit on a live account
python3 .agents/skills/web-use/scripts/web_audit.py --handle selenagomez --platform instagram
```

---

## Scripts Reference

- [`scripts/scrape_profile.py`](./scripts/scrape_profile.py): Core Playwright scraper using installed Chrome (`channel="chrome"`). Outputs normalized metrics.
- [`scripts/web_audit.py`](./scripts/web_audit.py): End-to-end auditing script that scrapes live data and runs the statistical audit engine formulas.

---

## Step-by-Step Procedure for Auditing Social Accounts

### 1. Scrape the Account
Run `scrape_profile.py` with the target handle:
```bash
python3 .agents/skills/web-use/scripts/scrape_profile.py --handle <username> --platform instagram --json
```

Expected JSON schema:
```json
{
  "success": true,
  "platform": "Instagram",
  "handle": "@nike",
  "name": "Nike",
  "followers": 291000000,
  "following": 268,
  "posts": 1665,
  "avatarUrl": "https://...",
  "bio": "Just Do It.",
  "isVerified": true
}
```

### 2. Compute Authenticity Metrics
Pass the scraped numbers directly into `isshereal.com`'s local audit engine or use `scripts/web_audit.py`:
```bash
python3 .agents/skills/web-use/scripts/web_audit.py --handle <username> --platform instagram
```

### 3. Troubleshooting & Fallbacks
- If Instagram presents an aggressive interstitial login wall:
  - The scraper automatically falls back to meta-tag parsing (`og:description`, `og:title`, `<script type="application/ld+json">`).
  - See [`references/instagram_selectors.md`](./references/instagram_selectors.md) for selector fallbacks.
  - See [`references/anti_detection.md`](./references/anti_detection.md) for user agent rotation and stealth flags.
