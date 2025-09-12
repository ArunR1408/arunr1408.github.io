CounterAPI integration helper

This README explains how to get your CounterAPI counter (workspace "VC", counter id 790) working with your static site and gives two secure proxy options to avoid exposing the API key in client-side code.

Summary of the problem
- Some CounterAPI endpoints require authentication or have CORS restrictions; calling them directly from a browser may be blocked or expose your API key.
- This repo includes `vc.html`, a diagnostic page where you can paste an API URL/token and test the endpoint.

Quick test (diagnostic page)
1. Open `vc.html` in a browser.
2. Paste `https://api.counterapi.dev/counters/790` into the API URL field and click Test/Retry.
3. If the server returns JSON with a numeric field (value/count/total) you should see the count.
4. If it returns 401/403, paste your token into the API Token field and check Use token, then Test again.
5. If the browser shows a CORS error, use one of the proxy options below.

Proxy options (recommended for production)

A) Cloudflare Worker (recommended / simplest deploy)
1. Create a new Worker in the Cloudflare dashboard.
2. Upload the file `cloudflare-worker/worker.js` or paste its contents.
3. Set a Worker secret binding named `COUNTER_TOKEN` to your API key (do NOT commit the key in the repo):
   - Secret name: `COUNTER_TOKEN`
   - Secret value: your API key (e.g. `ut_plxef9C0M8qETG...`)
4. Deploy the worker and copy its URL (for example `https://vc-proxy.example.workers.dev`).
5. On your site, fetch that worker URL and parse JSON — it will return the counter JSON and include CORS headers.

Cloudflare worker returns the CounterAPI response directly with the same body + CORS headers so your static site can safely request it.

B) Netlify Function
1. Add `netlify/functions/counter-proxy.js` (file included in this repo) into your project.
2. In Netlify dashboard, set an environment variable `COUNTERAPI_TOKEN` with your API key.
3. Deploy the site. The function will be available at `/.netlify/functions/counter-proxy` or `https://<your-site>/.netlify/functions/counter-proxy`.
4. From your site, fetch that function URL and parse the JSON in the same way as above.

Client usage (after worker/function is deployed)
- Fetch the proxy endpoint and read the numeric field (example):
```javascript
fetch('https://your-proxy-url.example.com/')
  .then(r => r.json())
  .then(j => {
    const n = j.value ?? j.count ?? j.total ?? j
    document.getElementById('count').textContent = String(n || 0)
  })
  .catch(console.error)
```

If you want me to:
- Create a ready-to-deploy Cloudflare Worker or Netlify Function in this repo and guide you through binding the secret and deploying, I can produce the exact commands and step-by-step UI actions.
- Or, if you prefer, test your endpoint in `vc.html` and paste `Status` + `Raw` output here and I'll interpret the API response and produce the exact minimal client-side snippet to render it (if CORS permits).

Security note
- Never commit API keys into the repo. Use provider secret bindings or environment variables to store keys.
