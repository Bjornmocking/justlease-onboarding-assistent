const crypto = require('crypto');

const KEY = 'onbeantwoord';
const MAX_ITEMS = 1000;

function config() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function command(args) {
  const { url, token } = config();
  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!response.ok) throw new Error(`Opslag gaf status ${response.status}`);
  return (await response.json()).result;
}

function withTimeout(promise, ms) {
  return Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);
}

async function logUnanswered({ question, reason, answer }) {
  const entry = {
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    question: String(question).slice(0, 500),
    reason,
    answer: answer ? String(answer).slice(0, 300) : '',
  };
  console.log('[onbeantwoord]', JSON.stringify(entry));
  if (!config()) return;
  try {
    await withTimeout(
      command(['LPUSH', KEY, JSON.stringify(entry)]).then(() => command(['LTRIM', KEY, 0, MAX_ITEMS - 1])),
      2500
    );
  } catch (err) {
    console.error('Vastleggen mislukt:', err.message);
  }
}

async function listUnanswered() {
  const raw = await command(['LRANGE', KEY, 0, -1]);
  return raw.map((s) => {
    try {
      return JSON.parse(s);
    } catch (err) {
      return null;
    }
  }).filter(Boolean);
}

async function removeUnanswered(id) {
  const raw = await command(['LRANGE', KEY, 0, -1]);
  const match = raw.find((s) => {
    try {
      return JSON.parse(s).id === id;
    } catch (err) {
      return false;
    }
  });
  if (!match) return false;
  await command(['LREM', KEY, 1, match]);
  return true;
}

module.exports = { logUnanswered, listUnanswered, removeUnanswered, storageConfigured: () => Boolean(config()) };
