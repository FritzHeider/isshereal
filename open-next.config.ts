import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = defineCloudflareConfig() as any;
config.buildCommand = 'npx next build';

export default config;

