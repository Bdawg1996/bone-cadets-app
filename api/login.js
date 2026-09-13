// POST /api/login  { passcode }
// Verifies the passcode against the APP_PASSCODE env var, server-side.
// On success returns ok:true; the frontend then stores the passcode
// locally and sends it as the x-passcode header on future calls.
const { checkAuth, json, readBody } = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'POST only' });
  let body;
  try { body = await readBody(req); } catch { return json(res, 400, { ok: false }); }
  // reuse checkAuth by faking the header from the body
  const fakeReq = { headers: { 'x-passcode': (body && body.passcode) || '' } };
  if (checkAuth(fakeReq)) return json(res, 200, { ok: true });
  return json(res, 401, { ok: false, error: 'Wrong passcode' });
};
