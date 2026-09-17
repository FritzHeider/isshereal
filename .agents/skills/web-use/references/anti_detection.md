# Anti-Detection & Headless Chrome Stealth

## Strategies Applied

1. **Native Chrome Binary**:
   - Uses macOS Google Chrome via `channel="chrome"`, which presents genuine GPU vendor strings, codecs, and WebGL extensions unlike bare Chromium.

2. **Webdriver Masking**:
   ```javascript
   Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
   ```

3. **Navigator Properties**:
   - Plugins list populated (`navigator.plugins.length > 0`).
   - Languages set to `['en-US', 'en']`.
   - `window.chrome` runtime defined.

4. **Realistic Desktop Viewport**:
   - 1280x800 with 1.0 device scale factor.

5. **Pacing & Navigation**:
   - Wait for `domcontentloaded` followed by 2-3s delay to allow initial XHR and hydration scripts to finish.
