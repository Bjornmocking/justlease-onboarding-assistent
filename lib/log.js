const TABLE = 'onbeantwoord';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/+$/, ''), key } : null;
}

async function request(method, query, body) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${TABLE}${query}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(`Opslag gaf status ${response.status}`);
  return method === 'GET' ? response.json() : null;
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
}

async function logUnanswered({ question, reason, answer }) {
  const entry = {
    question: String(question).slice(0, 500),
    reason,
    answer: answer ? String(answer).slice(0, 300) : '',
  };
  console.log('[onbeantwoord]', JSON.stringify(entry));
  if (!config()) return;
  try {
    await withTimeout(request('POST', '', entry), 2500);
  } catch (err) {
    console.error('Vastleggen mislukt:', err.message);
  }
}

async function listUnanswered() {
  const rows = await request('GET', '?select=id,created_at,question,reason,answer&order=created_at.desc&limit=1000');
  return rows.map((r) => ({ id: r.id, time: r.created_at, question: r.question, reason: r.reason, answer: r.answer }));
}

async function removeUnanswered(id) {
  if (!UUID.test(id)) return false;
  await request('DELETE', `?id=eq.${id}`);
  return true;
}

module.exports = { logUnanswered, listUnanswered, removeUnanswered, storageConfigured: () => Boolean(config()) };
