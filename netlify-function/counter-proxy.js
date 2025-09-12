// Netlify Function: counter-proxy
// Place this file under netlify/functions/counter-proxy.js in your repo
// IMPORTANT: Set the environment variable COUNTERAPI_TOKEN in your Netlify site settings

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

exports.handler = async function(event, context) {
  const API_URL = 'https://api.counterapi.dev/counters/790'
  const API_TOKEN = process.env.COUNTERAPI_TOKEN || null

  const headers = {}
  if (API_TOKEN) headers['Authorization'] = 'Bearer ' + API_TOKEN

  try {
    const res = await fetch(API_URL, { method: 'GET', headers })
    const text = await res.text()
    const contentType = res.headers.get('content-type') || 'application/json'

    return {
      statusCode: res.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
      },
      body: text
    }
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'proxy_error', detail: String(err) })
    }
  }
}
