// /api/clients
//   GET    -> list cadets
//   POST   { name } -> add cadet
//   DELETE { id }   -> remove cadet
const { supa, checkAuth, json, readBody } = require('./_lib');

module.exports = async (req, res) => {
  if (!checkAuth(req)) return json(res, 401, { ok: false, error: 'unauthorized' });

  try {
    const db = supa();
    if (req.method === 'GET') {
      const { data, error } = await db.from('clients').select('*').order('created_at', { ascending: true });
      if (error) throw error;
      return json(res, 200, { ok: true, clients: data });
    }
    if (req.method === 'POST') {
      const { name } = await readBody(req);
      if (!name || !name.trim()) return json(res, 400, { ok: false, error: 'name required' });
      const { data, error } = await db.from('clients').insert({ name: name.trim() }).select().single();
      if (error) throw error;
      return json(res, 200, { ok: true, client: data });
    }
    if (req.method === 'DELETE') {
      const { id } = await readBody(req);
      const { error } = await db.from('clients').delete().eq('id', id);
      if (error) throw error;
      return json(res, 200, { ok: true });
    }
    return json(res, 405, { ok: false });
  } catch (e) {
    return json(res, 500, { ok: false, error: String(e.message || e) });
  }
};
