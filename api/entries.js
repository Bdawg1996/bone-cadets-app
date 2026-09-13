// /api/entries
//   GET               -> all entries (income, expense, mileage)
//   POST { entry }     -> upsert one entry
//   DELETE { id }      -> delete one entry
//
// entry shape:
//   { id, kind:'income'|'expense'|'mileage', date:'YYYY-MM-DD',
//     client_id, label, amount, miles }
const { supa, checkAuth, json, readBody } = require('./_lib');

module.exports = async (req, res) => {
  if (!checkAuth(req)) return json(res, 401, { ok: false, error: 'unauthorized' });
  const db = supa();

  try {
    if (req.method === 'GET') {
      const { data, error } = await db.from('entries').select('*').order('date', { ascending: false });
      if (error) throw error;
      return json(res, 200, { ok: true, entries: data });
    }
    if (req.method === 'POST') {
      const { entry } = await readBody(req);
      if (!entry || !entry.kind || !entry.date) return json(res, 400, { ok: false, error: 'bad entry' });
      const row = {
        id: entry.id,               // client-generated uuid so upsert is idempotent
        kind: entry.kind,
        date: entry.date,
        client_id: entry.client_id || null,
        label: entry.label || null,
        amount: entry.amount != null ? Number(entry.amount) : null,
        miles: entry.miles != null ? Number(entry.miles) : null
      };
      const { data, error } = await db.from('entries').upsert(row).select().single();
      if (error) throw error;
      return json(res, 200, { ok: true, entry: data });
    }
    if (req.method === 'DELETE') {
      const { id } = await readBody(req);
      const { error } = await db.from('entries').delete().eq('id', id);
      if (error) throw error;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { ok: false });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e.message || e) });
  }
};
