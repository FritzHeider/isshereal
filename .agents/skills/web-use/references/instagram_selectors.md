# Instagram Scraping & Selectors Reference

## Target URLs
- Public Profile: `https://www.instagram.com/<handle>/`

## Metadata & DOM Selectors
1. **OpenGraph Description**:
   - Selector: `meta[property="og:description"]`, `meta[name="description"]`
   - Content Format: `{followers} Followers, {following} Following, {posts} Posts - See Instagram photos and videos from {name} (@{handle})`
   - Regex: `([\d.,KMBkmb]+)\s+Followers,\s*([\d.,KMBkmb]+)\s+Following,\s*([\d.,KMBkmb]+)\s+Posts`

2. **OpenGraph Title**:
   - Selector: `meta[property="og:title"]`
   - Content Format: `{name} (@{handle}) • Instagram photos and videos`

3. **OpenGraph Profile Image**:
   - Selector: `meta[property="og:image"]`
   - Yields high-resolution CDN avatar image directly.

4. **JSON-LD Structured Data**:
   - Selector: `script[type="application/ld+json"]`
   - Fields: `name`, `description`, `interactionStatistic` (userInteractionCount).

5. **Verified Badge**:
   - Indicators: `aria-label="Verified"`, `title="Verified"`, or svg verified check badge.
