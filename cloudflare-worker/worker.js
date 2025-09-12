// Cloudflare Worker: counter-proxy
// Purpose: Proxy requests to CounterAPI and return CORS-enabled JSON without exposing your API key.
// IMPORTANT: Do NOT put your API key in this file. Bind a secret named COUNTER_TOKEN in Cloudflare Workers dashboard

addEventListener('fetch', event => {
  event.respondWith(handle(event.request))
})

async function handle(req) {
  // Replace the API_URL path if your counter uses a different path or version
  const API_URL = 'https://api.counterapi.dev/counters/790'
  // In Cloudflare Workers, bind your secret as an environment variable named COUNTER_TOKEN
  const API_TOKEN = typeof COUNTER_TOKEN !== 'undefined' ? COUNTER_TOKEN : null

  const headers = {}
  if (API_TOKEN) headers['Authorization'] = 'Bearer ' + API_TOKEN

  try {
    const res = await fetch(API_URL, { method: 'GET', headers })
    const body = await res.text()

    // Forward content-type from origin when possible
    const contentType = res.headers.get('content-type') || 'application/json'

    return new Response(body, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'proxy_error', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    })
  }
}
