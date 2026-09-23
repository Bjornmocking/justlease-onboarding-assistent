const crypto = require('crypto');
const { listUnanswered, removeUnanswered, storageConfigured } = require('../lib/log');

function tokenMatches(provided, expected) {
  const a = crypto.createHash('sha256').update(String(provided || '')).digest();
  const b = crypto.createHash('sha256').update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken) {
    res.status(503).json({ error: 'ADMIN_TOKEN is nog niet ingesteld in Vercel.' });
    return;
  }

  const header = req.headers.authorization || '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!tokenMatches(provided, adminToken)) {
    res.status(401).json({ error: 'Ongeldige beheercode.' });
    return;
  }

  if (!storageConfigured()) {
    res.status(200).json({
      storage: false,
      items: [],
      note: 'Er is nog geen opslag gekoppeld. Vragen worden nu alleen in de Vercel-logs vastgelegd.',
    });
    return;
  }

  try {
    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || '';
      const removed = await removeUnanswered(id);
      res.status(removed ? 200 : 404).json({ removed });
      return;
    }
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    res.status(200).json({ storage: true, items: await listUnanswered() });
  } catch (err) {
    console.error('Beheer-fout:', err);
    res.status(500).json({ error: 'Kon de lijst niet ophalen.' });
  }
};
