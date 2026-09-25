interface Env {
  LINKS_KV: KVNamespace;
  ANALYTICS_KV: KVNamespace;
}

interface LinkData {
  slug: string;
  target: string;
  createdAt: number;
}

interface LinkStats {
  totalClicks: number;
  clicksPerDay: Record<string, number>;
  referrers: Record<string, number>;
  countries: Record<string, number>;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (path.startsWith('/api/links')) {
      if (request.method === 'POST') {
        const apiKey = request.headers.get('X-API-Key');
        if (apiKey !== 'secret-api-key') {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }

        try {
          const body = await request.json() as { slug?: string, target?: string };
          if (!body.target) {
            return new Response('Missing target URL', { status: 400, headers: corsHeaders });
          }

          let slug = body.slug;
          if (!slug) {
            slug = Math.random().toString(36).substring(2, 8);
          }

          const linkData: LinkData = {
            slug,
            target: body.target,
            createdAt: Date.now()
          };

          await env.LINKS_KV.put(`link:${slug}`, JSON.stringify(linkData));

          return new Response(JSON.stringify(linkData), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } catch (e) {
          return new Response('Bad Request', { status: 400, headers: corsHeaders });
        }
      }

      if (request.method === 'GET' && path === '/api/links') {
        const list = await env.LINKS_KV.list({ prefix: 'link:' });
        const links = [];
        for (const key of list.keys) {
          const data = await env.LINKS_KV.get(key.name);
          if (data) links.push(JSON.parse(data));
        }
        return new Response(JSON.stringify({ links }), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      const matchStats = path.match(/^\/api\/links\/([^\/]+)\/stats$/);
      if (request.method === 'GET' && matchStats) {
        const slug = matchStats[1];
        const statsStr = await env.ANALYTICS_KV.get(`stats:${slug}`);
        const stats: LinkStats = statsStr ? JSON.parse(statsStr) : { totalClicks: 0, clicksPerDay: {}, referrers: {}, countries: {} };
        return new Response(JSON.stringify(stats), { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    }

    const slug = path.substring(1);
    if (!slug) {
      return new Response('Link Shortener API', { headers: corsHeaders });
    }

    const linkStr = await env.LINKS_KV.get(`link:${slug}`);
    if (!linkStr) {
      return new Response('Link Not Found', { status: 404, headers: corsHeaders });
    }

    const linkData: LinkData = JSON.parse(linkStr);

    ctx.waitUntil(recordClick(env, slug, request));

    return Response.redirect(linkData.target, 302);
  }
};

async function recordClick(env: Env, slug: string, request: Request) {
  const timestamp = Date.now();
  const country = request.headers.get('cf-ipcountry') || 'Unknown';
  const referrer = request.headers.get('referer') || 'Direct';

  const dateStr = new Date(timestamp).toISOString().split('T')[0];

  const statsStr = await env.ANALYTICS_KV.get(`stats:${slug}`);
  const stats: LinkStats = statsStr ? JSON.parse(statsStr) : { totalClicks: 0, clicksPerDay: {}, referrers: {}, countries: {} };

  stats.totalClicks++;
  stats.clicksPerDay[dateStr] = (stats.clicksPerDay[dateStr] || 0) + 1;
  
  const sortedDays = Object.keys(stats.clicksPerDay).sort().reverse();
  if (sortedDays.length > 7) {
    const daysToRemove = sortedDays.slice(7);
    for (const d of daysToRemove) {
      delete stats.clicksPerDay[d];
    }
  }

  let refDomain = referrer;
  try { if (referrer !== 'Direct') refDomain = new URL(referrer).hostname; } catch(e){}
  
  stats.referrers[refDomain] = (stats.referrers[refDomain] || 0) + 1;
  stats.countries[country] = (stats.countries[country] || 0) + 1;

  await env.ANALYTICS_KV.put(`stats:${slug}`, JSON.stringify(stats));
}
