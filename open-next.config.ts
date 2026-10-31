import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// Prerendered pages are served straight from the static assets; cache
// interception answers them without booting the Next server, which keeps
// requests inside the Workers CPU limit.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
}) as any;
config.buildCommand = 'npx next build';

export default config;
