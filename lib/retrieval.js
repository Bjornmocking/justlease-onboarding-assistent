const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const CHUNK_TARGET = 1800;
const MIN_CHUNK = 250;

const STOPWORDS = new Set(
  'de het een en van in op te dat die is zijn was wordt worden voor met als aan bij ook niet om er maar dan of naar uit door over wat hoe wie waar wanneer welke kan moet mag mogen heeft hebben deze dit ze je jij u we wij ik hij zij hun haar onder tot zoals indien dus nog wel geen'.split(' ')
);

function listMarkdownFiles(dir) {
  let results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(listMarkdownFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) results.push(full);
  }
  return results;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .match(/[a-z0-9]+/g)
    ?.filter((t) => t.length >= 3 && !STOPWORDS.has(t))
    .map((t) => t.slice(0, 6)) || [];
}

function splitIntoChunks(text) {
  const paragraphs = text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/[ \t]+/g, ' ')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const chunks = [];
  let current = '';
  for (const p of paragraphs) {
    if (current && current.length + p.length > CHUNK_TARGET) {
      chunks.push(current);
      current = '';
    }
    current += (current ? '\n\n' : '') + p;
  }
  if (current) chunks.push(current);
  return chunks;
}

let cache = null;

function getIndex() {
  if (cache) return cache;
  const chunks = [];
  for (const file of listMarkdownFiles(DATA_DIR).sort()) {
    const raw = fs.readFileSync(file, 'utf-8');
    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const id = path.basename(file, '.md');
    const title = titleMatch ? titleMatch[1].trim() : id;
    splitIntoChunks(raw).forEach((text) => {
      const terms = tokenize(text);
      const tf = new Map();
      terms.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      chunks.push({ id, title, text, tf, length: terms.length || 1 });
    });
  }
  const df = new Map();
  chunks.forEach((c) => c.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const avgLength = chunks.reduce((sum, c) => sum + c.length, 0) / (chunks.length || 1);
  cache = { chunks, df, avgLength };
  return cache;
}

function format(chunk) {
  return `[Bron: ${chunk.title}]\n${chunk.text}`;
}

function retrieve(question, { topK = 8, maxChars = 22000 } = {}) {
  const { chunks, df, avgLength } = getIndex();
  const queryTerms = [...new Set(tokenize(question))];
  const k1 = 1.5;
  const b = 0.75;
  const scored = chunks
    .map((chunk) => {
      let score = 0;
      for (const term of queryTerms) {
        const f = chunk.tf.get(term);
        if (!f) continue;
        const idf = Math.log(1 + (chunks.length - df.get(term) + 0.5) / (df.get(term) + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * chunk.length) / avgLength)));
      }
      return { chunk, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, topK);

  let total = 0;
  const picked = [];
  for (const { chunk } of scored) {
    if (total + chunk.text.length > maxChars) break;
    picked.push(format(chunk));
    total += chunk.text.length;
  }
  return picked.join('\n\n---\n\n');
}

function sample(topicId, { maxChars = 16000 } = {}) {
  const { chunks } = getIndex();
  const pool = chunks
    .filter((c) => (!topicId || topicId === 'all' || c.id === topicId) && c.text.length >= MIN_CHUNK)
    .map((chunk) => ({ chunk, r: Math.random() }))
    .sort((a, b) => a.r - b.r);
  const picked = [];
  let total = 0;
  for (const { chunk } of pool) {
    if (total + chunk.text.length > maxChars) continue;
    picked.push(chunk);
    total += chunk.text.length;
  }
  return picked.map(format).join('\n\n---\n\n');
}

function hasContent() {
  return getIndex().chunks.length > 0;
}

module.exports = { retrieve, sample, hasContent };
