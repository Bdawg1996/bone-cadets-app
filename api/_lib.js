// Shared helpers for the serverless API functions.
// Nothing secret lives in code — the passcode and DB keys come from
// Vercel Environment Variables at runtime.

const { createClient } = require('@supabase/supabase-js');

let _client = null;
function supa() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY; // service role — server side only, never shipped to browser
  if (!url || !key) throw new Error('Supabase env vars missing');
  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// Constant-time-ish passcode check. The passcode is only ever compared
// on the server; it is never sent to the browser.
function checkAuth(req) {
  const expected = process.env.APP_PASSCODE;
  if (!expected) return false;
  const got = req.headers['x-passcode'] || '';
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}

async function readBody(req) {
  if (req.body) return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  return await new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => (d += c));
    req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

module.exports = { supa, checkAuth, json, readBody };
