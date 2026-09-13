// Shared helpers for the serverless API functions.
// Secrets come from Vercel Environment Variables at runtime — never in code.

const { createClient } = require('@supabase/supabase-js');

let _client = null;
function supa() {
  if (_client) return _client;
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_KEY || '').trim();
  if (!url) throw new Error('SUPABASE_URL env var is empty or missing');
  if (!key) throw new Error('SUPABASE_SERVICE_KEY env var is empty or missing');
  if (!/^https:\/\/.+\.supabase\.co\/?$/.test(url)) {
    throw new Error('SUPABASE_URL looks wrong: "' + url + '" (should be https://xxxx.supabase.co)');
  }
  _client = createClient(url.replace(/\/$/, ''), key, { auth: { persistSession: false } });
  return _client;
}

// Passcode compare. Trims whitespace so a stray space can't break auth.
function checkAuth(req) {
  const expected = (process.env.APP_PASSCODE || '').trim();
  if (!expected) return false;
  const got = String(req.headers['x-passcode'] || '').trim();
  return got.length > 0 && got === expected;
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
