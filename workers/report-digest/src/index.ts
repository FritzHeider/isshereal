interface Env {
  DIGEST_KV: KVNamespace;
  SITE_URL: string;
}

interface ProfileStats {
  handle: string;
  platform: string;
  trustScore: number;
  auditsCount: number;
}

interface DigestData {
  date: string;
  totalAuditsServed: number;
  trendingProfiles: ProfileStats[];
  averageTrustScore: number;
}

async function generateDigest(env: Env): Promise<DigestData> {
  const dateStr = new Date().toISOString().split('T')[0];
  
  let trendingProfiles: ProfileStats[] = [];
  try {
    // In real app, fetch from `${env.SITE_URL}/api/top-creators`
    trendingProfiles = [
      { handle: 'nike', platform: 'instagram', trustScore: 98, auditsCount: 15420 },
      { handle: 'mrbeast', platform: 'youtube', trustScore: 99, auditsCount: 12300 },
      { handle: 'scammer', platform: 'tiktok', trustScore: 12, auditsCount: 5400 }
    ];
  } catch (e) {
    console.error("Failed to fetch profiles for digest", e);
  }

  const totalAuditsServed = trendingProfiles.reduce((acc, p) => acc + p.auditsCount, 0);
  const avgTrust = trendingProfiles.length > 0 ? trendingProfiles.reduce((acc, p) => acc + p.trustScore, 0) / trendingProfiles.length : 0;

  const digest: DigestData = {
    date: dateStr,
    totalAuditsServed,
    trendingProfiles,
    averageTrustScore: Math.round(avgTrust)
  };

  await env.DIGEST_KV.put(`digest:${dateStr}`, JSON.stringify(digest));
  await env.DIGEST_KV.put(`digest:latest`, JSON.stringify(digest));
  
  const feedStr = await env.DIGEST_KV.get('digest:feed');
  const feed: DigestData[] = feedStr ? JSON.parse(feedStr) : [];
  feed.unshift(digest);
  if (feed.length > 30) feed.length = 30;
  await env.DIGEST_KV.put('digest:feed', JSON.stringify(feed));

  return digest;
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(generateDigest(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    };

    if (path === '/digest/today') {
      const digestStr = await env.DIGEST_KV.get('digest:latest');
      if (!digestStr) return new Response('{"error": "No digest available"}', { status: 404, headers: corsHeaders });
      return new Response(digestStr, { headers: corsHeaders });
    }

    if (path === '/digest/feed') {
      const feedStr = await env.DIGEST_KV.get('digest:feed');
      return new Response(feedStr || '[]', { headers: corsHeaders });
    }

    if (path === '/digest/widget') {
      const digestStr = await env.DIGEST_KV.get('digest:latest');
      const digest: DigestData | null = digestStr ? JSON.parse(digestStr) : null;
      
      let profilesHtml = '';
      if (digest) {
        profilesHtml = digest.trendingProfiles.slice(0, 3).map(p => `
          <div class="flex justify-between items-center py-2 border-b border-emerald-100 last:border-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-emerald-900">@${p.handle}</span>
              <span class="text-xs text-emerald-500 uppercase">${p.platform}</span>
            </div>
            <div class="font-bold ${p.trustScore > 80 ? 'text-emerald-600' : p.trustScore > 50 ? 'text-yellow-600' : 'text-red-600'}">
              ${p.trustScore}%
            </div>
          </div>
        `).join('');
      }

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Isshereal Digest Widget</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-transparent m-0 p-0 font-sans">
  <div class="max-w-sm mx-auto bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm p-4">
    <div class="flex justify-between items-end mb-4">
      <h3 class="text-lg font-bold text-emerald-800 m-0">Top Audited Profiles</h3>
      <span class="text-xs text-emerald-600">${digest ? digest.date : 'N/A'}</span>
    </div>
    <div class="bg-white rounded p-3 shadow-inner">
      ${profilesHtml || '<p class="text-sm text-gray-500 text-center">No data available</p>'}
    </div>
    <div class="mt-3 text-center">
      <a href="https://isshereal.com" target="_blank" class="text-xs text-emerald-600 hover:text-emerald-800 font-medium">View full report at isshereal.com</a>
    </div>
  </div>
</body>
</html>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*' } });
    }

    const dateMatch = path.match(/^\/digest\/(\d{4}-\d{2}-\d{2})$/);
    if (dateMatch) {
      const date = dateMatch[1];
      const digestStr = await env.DIGEST_KV.get(`digest:${date}`);
      if (!digestStr) return new Response('{"error": "Digest not found"}', { status: 404, headers: corsHeaders });
      return new Response(digestStr, { headers: corsHeaders });
    }

    return new Response('Not Found', { status: 404 });
  }
};
