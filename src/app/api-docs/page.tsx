import { Code2, Key, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          API Documentation
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Integrate Isshereal's powerful profile auditing capabilities directly into your application.
        </p>
      </div>

      <div className="space-y-12">
        {/* API Overview */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Overview</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            The Isshereal API allows you to programmatically audit social media profiles to determine authenticity, engagement rates, and bot risks. The API is RESTful and returns JSON-encoded responses.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-4 flex gap-3 text-blue-800 dark:text-blue-300 text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <p>Our API is currently in beta. Rate limits apply to all unauthenticated requests. Enterprise plans with API keys are coming soon.</p>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-slate-600 dark:text-slate-400">
              <Code2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Endpoints</h2>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center gap-4">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-lg text-sm font-bold w-fit">GET</span>
              <code className="text-slate-800 dark:text-slate-200 font-mono text-sm">/api/audit</code>
              <span className="text-slate-500 dark:text-slate-400 text-sm">Audit a profile</span>
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Query Parameters</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="pb-3 font-medium">Parameter</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium">Required</th>
                      <th className="pb-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 font-mono text-slate-700 dark:text-slate-300">handle</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">string</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-medium">Yes</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">The username or handle to audit (e.g., 'cristiano')</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-slate-700 dark:text-slate-300">platform</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">string</td>
                      <td className="py-3 text-emerald-600 dark:text-emerald-400 font-medium">Yes</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">Platform name ('instagram', 'tiktok', 'twitter', 'youtube')</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono flex justify-between">
              <span>Example Request</span>
              <span>cURL</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono leading-relaxed">
<code>curl -X GET "https://isshereal.com/api/audit?handle=cristiano&amp;platform=instagram" \
  -H "Accept: application/json"</code>
              </pre>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-xs text-slate-400 font-mono flex justify-between">
              <span>Example Response</span>
              <span>JSON</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm text-emerald-400 font-mono leading-relaxed">
<code>{`{
  "handle": "cristiano",
  "platform": "instagram",
  "score": 98,
  "engagementRate": "2.4",
  "realFollowersPercentage": "94.2",
  "followersCount": 624000000,
  "riskSignals": [],
  "timestamp": "2024-03-20T12:00:00Z"
}`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg mt-8">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Key className="w-48 h-48 transform translate-x-1/4 -translate-y-1/4" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Coming Soon: API Keys</h2>
              <p className="text-emerald-50 mb-8 text-lg leading-relaxed">
                We are launching enterprise plans with dedicated API keys, higher rate limits, webhooks, and bulk auditing capabilities.
              </p>
              
              <Link href="/contact">
                <button className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                  Request Early Access
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
