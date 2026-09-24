const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const WERKWIJZE_FILE = path.join(DATA_DIR, 'werkwijze.md');
const CHUNK_TARGET = 1000;
const LEADING_BOOST = 1.7;
const PAGE_MARKER = '<!--pagina-->';

const STOPWORDS = new Set(
  'de het een en van in op te dat die is zijn was wordt worden voor met als aan bij ook niet om er maar dan of naar uit door over wat hoe wie waar wanneer welke kan moet mag mogen heeft hebben deze dit ze je jij u we wij ik hij zij hun haar onder tot zoals indien dus nog wel geen klant klanten laten moeten gaan kunnen'.split(' ')
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
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .match(/[a-z0-9]+/g)
      ?.filter((t) => t.length >= 3 && !STOPWORDS.has(t))
      .map((t) => t.slice(0, 6)) || []
  );
}

const SYNONYMS = {
  auto: ['voertuig'],
  wagen: ['voertuig'],
  leaseauto: ['voertuig'],
  kost: ['kosten'],
  maandprijs: ['leasetarief', 'inbegrepen', 'maandbedrag'],
  leaseprijs: ['leasetarief', 'inbegrepen', 'maandbedrag'],
  maandbedrag: ['leasetarief', 'inbegrepen'],
  leasebedrag: ['leasetarief', 'inbegrepen', 'maandbedrag'],
  voorloper: ['voorloopauto'],
  klacht: ['klachten', 'klachtenprocedure'],
  stopzetten: ['opzegging'],
  opzeggen: ['opzegging'],
  garage: ['onderhoudsbedrijf'],
  medecontractant: ['contractpartner', 'hoofdelijk', 'ondertekent'],
  medecontractanten: ['contractpartner', 'hoofdelijk', 'ondertekent'],
  contractant: ['contractpartner', 'hoofdelijk', 'ondertekent'],
  contractanten: ['contractpartner', 'hoofdelijk', 'ondertekent'],
};

function expandQuery(question) {
  const base = question.toLowerCase().match(/[a-zà-ÿ0-9]+/g) || [];
  const extra = base.flatMap((w) => SYNONYMS[w] || []);
  return question + ' ' + extra.join(' ');
}

function readMeta(raw, fallbackTitle) {
  const title = raw.match(/^#\s+(.+)$/m);
  const url = raw.match(/^>\s*Bron:\s*(\S+)/m);
  const version = raw.match(/^>\s*Versiedatum:\s*(.+)$/m);
  const rank = raw.match(/^>\s*Rang:\s*(.+)$/m);
  return {
    title: title ? title[1].trim() : fallbackTitle,
    url: url ? url[1] : null,
    version: version ? version[1].trim() : null,
    rank: rank ? rank[1].trim() : null,
  };
}

function cleanParagraph(p) {
  return p
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .filter((line) => !/^>\s*(Bron|Bronnen|Versiedatum|Rang|Automatisch)/.test(line))
    .join('\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function splitIntoChunks(raw) {
  const paged = raw.includes(PAGE_MARKER);
  const chunks = [];
  let current = '';
  let startPage = 1;
  let endPage = 1;
  let lastLength = Infinity;
  const flush = () => {
    if (current) chunks.push({ text: current, startPage: paged ? startPage : null, endPage: paged ? endPage : null });
    current = '';
  };
  raw.split(PAGE_MARKER).forEach((pageText, pageIndex) => {
    const page = pageIndex + 1;
    for (const paragraph of pageText.split(/\n\s*\n/)) {
      const p = cleanParagraph(paragraph);
      if (!p) continue;
      // Een korte alinea is meestal een kop: die blijft bij de tekst eronder.
      if (current && current.length + p.length > CHUNK_TARGET && lastLength >= 80) flush();
      if (!current) startPage = page;
      endPage = page;
      lastLength = p.length;
      current += (current ? '\n\n' : '') + p;
    }
  });
  flush();
  return chunks;
}

let cache = null;

function getIndex() {
  if (cache) return cache;
  const chunks = [];
  for (const file of listMarkdownFiles(DATA_DIR).sort()) {
    if (path.resolve(file) === path.resolve(WERKWIJZE_FILE)) continue;
    const raw = fs.readFileSync(file, 'utf-8');
    const meta = readMeta(raw, path.basename(file, '.md'));
    splitIntoChunks(raw).forEach((c) => {
      const terms = tokenize(c.text);
      const tf = new Map();
      terms.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      chunks.push({ ...meta, ...c, tf, length: terms.length || 1 });
    });
  }
  const df = new Map();
  chunks.forEach((c) => c.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
  const avgLength = chunks.reduce((sum, c) => sum + c.length, 0) / (chunks.length || 1);
  cache = { chunks, df, avgLength };
  return cache;
}

function pageLabel(chunk) {
  if (!chunk.startPage) return null;
  return chunk.startPage === chunk.endPage ? `p. ${chunk.startPage}` : `p. ${chunk.startPage}-${chunk.endPage}`;
}

function toSource(chunk) {
  return { title: chunk.title, url: chunk.url, version: chunk.version, pages: pageLabel(chunk) };
}

function getWerkwijze() {
  let raw;
  try {
    raw = fs.readFileSync(WERKWIJZE_FILE, 'utf-8');
  } catch (err) {
    return null;
  }
  const meta = readMeta(raw, 'Werkwijze Justlease Sales');
  const text = raw
    .split('\n')
    .filter((line) => !/^>\s*Versiedatum/.test(line))
    .join('\n')
    .trim();
  return { text, source: { title: 'Werkwijze Justlease Sales (intern)', url: null, version: meta.version, pages: null } };
}

function retrieve(question, { topK = 10, maxChars = 22000 } = {}) {
  const { chunks, df, avgLength } = getIndex();
  const queryTerms = [...new Set(tokenize(expandQuery(question)))];
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
      if (score > 0 && chunk.rank && /^LEIDEND/i.test(chunk.rank)) score *= LEADING_BOOST;
      return { chunk, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, topK);

  let total = 0;
  const passages = [];
  for (const { chunk } of scored) {
    if (total + chunk.text.length > maxChars) break;
    passages.push(chunk);
    total += chunk.text.length;
  }

  const context = passages
    .map((c, i) => {
      const parts = [`Passage ${i + 1}`, `Bron: ${c.title}`];
      if (c.version) parts.push(`versie: ${c.version}`);
      if (c.rank) parts.push(`RANG: ${c.rank}`);
      const page = pageLabel(c);
      if (page) parts.push(page);
      return `[${parts.join(' | ')}]\n${c.text}`;
    })
    .join('\n\n---\n\n');

  return { context, sources: passages.map(toSource) };
}

function overlapsWerkwijze(question) {
  const w = getWerkwijze();
  if (!w) return false;
  const terms = new Set(tokenize(w.text));
  return tokenize(question).some((t) => terms.has(t));
}

function hasContent() {
  return getIndex().chunks.length > 0 || Boolean(getWerkwijze());
}

module.exports = { retrieve, getWerkwijze, overlapsWerkwijze, hasContent };
