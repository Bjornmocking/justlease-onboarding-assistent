const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const BRONNEN_DIR = path.join(DATA_DIR, 'bronnen');

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
    if (entry.isDirectory()) {
      results = results.concat(listMarkdownFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function loadAllContent() {
  const files = listMarkdownFiles(DATA_DIR).sort();
  return files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n\n---\n\n');
}

function isContentEmpty(raw) {
  const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, '');
  return withoutComments.trim().length === 0;
}

function extractTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

function getTopics() {
  const files = listMarkdownFiles(BRONNEN_DIR).sort();
  return files.map((full) => {
    const id = path.basename(full, '.md');
    const content = fs.readFileSync(full, 'utf-8');
    return { id, title: extractTitle(content, id), path: full };
  });
}

function loadTopicContent(id) {
  const topic = getTopics().find((t) => t.id === id);
  if (!topic) return null;
  return fs.readFileSync(topic.path, 'utf-8');
}

module.exports = { loadAllContent, isContentEmpty, getTopics, loadTopicContent };
