// GET /api/diag  — safe diagnostic. Never prints secret values, only whether
// they exist and pass a basic shape check, plus a live DB ping.
const { supa, json } = require('./_lib');

module.exports = async (req, res) => {
  const out = {
    APP_PASSCODE_set: !!(process.env.APP_PASSCODE && process.env.APP_PASSCODE.trim()),
    SUPABASE_URL_set: !!(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()),
    SUPABASE_URL_value: (process.env.SUPABASE_URL || '').trim() || '(empty)',
    SUPABASE_SERVICE_KEY_set: !!(process.env.SUPABASE_SERVICE_KEY && process.env.SUPABASE_SERVICE_KEY.trim()),
    SUPABASE_SERVICE_KEY_len: (process.env.SUPABASE_SERVICE_KEY || '').trim().length,
    db_ping: null,
    db_error: null
  };
  try {
    const { error } = await supa().from('clients').select('id').limit(1);
    if (error) { out.db_ping = 'failed'; out.db_error = error.message; }
    else out.db_ping = 'ok';
  } catch (e) {
    out.db_ping = 'threw';
    out.db_error = String(e.message || e);
  }
  return json(res, 200, out);
};
