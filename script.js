const LAST_UPDATED = '24 september 2026';

const DOCUMENTS = [
  {
    title: 'Algemene voorwaarden Keurmerk Private Lease',
    version: '1 december 2017',
    desc: 'De basisvoorwaarden voor elke private lease-overeenkomst.',
    url: 'https://portal.justlease.nl/app/uploads/2018/06/Algemene-voorwaarden-Keurmerk-Private-Lease-01-12-2017.pdf',
  },
  {
    title: 'Aanvullende voorwaarden Justlease',
    version: 'januari 2026',
    desc: 'Leidend. Eigen bijdrage, opzegging, vervangend vervoer en schade.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2026/01/Justlease-aanvullende-voorwaarden-versie-jan2026.docx.pdf',
  },
  {
    title: 'Kredietcheck: aan te leveren documenten',
    version: 'november 2025',
    desc: 'Welke documenten een klant moet aanleveren bij een aanvraag.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/10/Justlease_Aanleveren-documenten.pdf',
  },
  {
    title: 'Innameprotocol',
    version: 'januari 2026',
    desc: 'Hoe schade en staat van de auto worden beoordeeld bij inleveren.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2026/02/Innamehandleiding-Justlease-2026.pdf',
  },
  {
    title: 'Verzekeringskaart WA + Casco',
    version: 'versie 20.25 (2025)',
    desc: 'Korte samenvatting van de dekking.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/IPID-NL-Version-MTPLMODv20.25.pdf',
  },
  {
    title: 'Verzekeringskaart aanvullende verzekeringen',
    version: 'versie 20.25 (2025)',
    desc: 'Korte samenvatting van de aanvullende dekking.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/AVNLLDPA20.25-Aanvullende-verzekeringen-SVI-POI-documents-PL.pdf',
  },
  {
    title: 'Algemene verzekeringsvoorwaarden',
    version: 'versie 20.25 (2025)',
    desc: 'Volledige voorwaarden WA en Casco.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/Verzekeringsvoorwaarden-AVNL-MTPLMOD-20.25-PL.pdf',
  },
  {
    title: 'Aanvullende verzekeringsvoorwaarden',
    version: 'versie 20.25 (2025)',
    desc: 'Volledige voorwaarden aanvullende verzekeringen.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/AVNLLDPA20.25.0-Aanvullende-voorwaarden-Greenval-Policy-Conditions-NL.pdf',
  },
];

const SUGGESTIONS = [
  'Wat moet een klant aanleveren voor de kredietcheck?',
  'Wie doet de levering van de auto?',
  'Wat is de eigen bijdrage bij schade?',
  'Wat zijn de voordelen van private lease?',
  'Nieuw of occasion leasen?',
  'Wat gebeurt er als een contractpartner overlijdt?',
];

const STATS = [
  { value: '2011', label: 'Justlease.nl opgericht' },
  { value: '1 dec 2022', label: 'Onderdeel van Arval BNP Paribas' },
  { value: '± 20.000', label: 'tevreden klanten op de weg' },
  { value: '± 120', label: 'medewerkers bij Justlease' },
  { value: '8+', label: 'gemiddelde klantbeoordeling' },
  { value: '45+ jaar', label: 'lease-ervaring' },
];

const TIMELINE = [
  { year: '1869', text: 'Johannes Bernardus Terberg start een smederij in het Utrechtse dorp Benschop, later aangevuld met een benzinepomp en rijwielhandel.' },
  { year: '1965', text: 'De eerste dealervestiging van Terberg in Utrecht opent. Er volgen meer vestigingen voor personenwagens.' },
  { year: '2011', text: 'Door de komst van het internet wordt Justlease.nl opgericht. Klanten kunnen zelf online een leasecontract afsluiten en beheren.' },
  { year: '2012', text: 'Justlease introduceert Private Lease voor particulieren, als eerste in Nederland.' },
  { year: '2019', text: 'Terberg Leasing en Business Lease Nederland fuseren tot Terberg Business Lease Group, met Justlease als label.' },
  { year: '2022', text: 'Arval tekent op 8 september de overname van Terberg Business Lease Group en rondt die af op 1 december. Justlease is sindsdien onderdeel van Arval, en daarmee van BNP Paribas. Arval had in Nederland daarna meer dan 100.000 geleasede voertuigen.' },
];

const OFFER = [
  'Auto en contract op maat: de klant kiest zelf welke opties hij wil',
  'Haal- en brengservice bij onderhoud',
  'Een vast maandbedrag dat niet verandert tijdens de looptijd',
  'Kilometerbundel die één keer per kwartaal kosteloos aan te passen is',
  '14 dagen bedenktijd',
  'Contractannuleringsoptie bij ontslag',
  'Het grootste Private Lease aanbod van Nederland, met Keurmerk Private Lease',
];

const ABOUT_SOURCES = [
  ['justlease.nl/over-justlease', 'https://justlease.nl/over-justlease'],
  ['Justlease bij Arval', 'https://justlease.nl/private-lease-bij-justlease'],
  ['Persbericht overname (Arval)', 'https://www.arval.com/arval-announces-closing-of-transaction-to-acquire-terberg-business-lease-group'],
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Documentenlijst
const docListEl = document.getElementById('doc-list');
DOCUMENTS.forEach((doc) => {
  const li = el('li');
  const a = el('a', null, doc.title);
  a.href = doc.url;
  a.target = '_blank';
  a.rel = 'noopener';
  li.append(a, el('div', 'doc-desc', `${doc.desc} Versie: ${doc.version}.`));
  docListEl.appendChild(li);
});

// Over Justlease
const statGrid = document.getElementById('stat-grid');
STATS.forEach((stat) => {
  const card = el('div', 'stat');
  card.append(el('div', 'stat-value', stat.value), el('div', 'stat-label', stat.label));
  statGrid.appendChild(card);
});

const timelineEl = document.getElementById('timeline');
TIMELINE.forEach((item) => {
  const li = el('li');
  li.append(el('div', 'timeline-year', item.year), el('div', null, item.text));
  timelineEl.appendChild(li);
});

const offerEl = document.getElementById('offer-list');
OFFER.forEach((text) => offerEl.appendChild(el('li', null, text)));

const aboutSources = document.getElementById('about-sources');
aboutSources.append('Bronnen: ');
ABOUT_SOURCES.forEach(([label, url], i) => {
  if (i > 0) aboutSources.append(', ');
  const a = el('a', null, label);
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  aboutSources.appendChild(a);
});

document.getElementById('last-updated').textContent = `Laatst bijgewerkt: ${LAST_UPDATED}`;

// Navigatie met vaste adressen per tabblad
const TAB_HASHES = { info: 'informatie', playbook: 'verkoopdraaiboek', quiz: 'kennisquiz', about: 'over-justlease' };
const navItems = document.querySelectorAll('.nav-item');
const panels = {
  info: document.getElementById('panel-info'),
  playbook: document.getElementById('panel-playbook'),
  quiz: document.getElementById('panel-quiz'),
  about: document.getElementById('panel-about'),
};

function showTab(tab, updateHash = true) {
  if (!panels[tab]) tab = 'info';
  navItems.forEach((b) => {
    const active = b.dataset.tab === tab;
    b.classList.toggle('active', active);
    if (active) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  Object.entries(panels).forEach(([key, panel]) => panel.classList.toggle('hidden', key !== tab));
  if (updateHash) history.replaceState(null, '', `#${TAB_HASHES[tab]}`);
  window.scrollTo(0, 0);
}

function tabFromHash() {
  const hash = window.location.hash.replace('#', '');
  return Object.keys(TAB_HASHES).find((k) => TAB_HASHES[k] === hash) || 'info';
}

navItems.forEach((btn) => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
document.querySelector('[data-tab-link]').addEventListener('click', (e) => {
  e.preventDefault();
  showTab('info');
});
window.addEventListener('hashchange', () => showTab(tabFromHash(), false));
showTab(tabFromHash(), false);

// Eenvoudige, veilige opmaak (vet, cursief, lijsten, alinea's) voor antwoorden van de assistent
function appendInline(parent, text) {
  const re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text))) {
    if (m.index > last) parent.append(text.slice(last, m.index));
    const token = m[0];
    const node = document.createElement(token.startsWith('**') ? 'strong' : 'em');
    node.textContent = token.startsWith('**') ? token.slice(2, -2) : token.slice(1, -1);
    parent.appendChild(node);
    last = m.index + token.length;
  }
  if (last < text.length) parent.append(text.slice(last));
}

function renderMarkdown(container, text) {
  let list = null;
  let listType = null;
  let para = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) {
      list = null;
      para = null;
      continue;
    }
    const bullet = line.match(/^\s*[*-]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (bullet || numbered) {
      const type = bullet ? 'ul' : 'ol';
      if (!list || listType !== type) {
        list = document.createElement(type);
        listType = type;
        container.appendChild(list);
      }
      para = null;
      const li = document.createElement('li');
      appendInline(li, (bullet || numbered)[1]);
      list.appendChild(li);
      continue;
    }
    list = null;
    if (!para) {
      para = document.createElement('p');
      container.appendChild(para);
    } else {
      para.appendChild(document.createElement('br'));
    }
    appendInline(para, line.trim());
  }
}

// Chat
const chatEl = document.getElementById('chat');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');
const chipsEl = document.getElementById('chips');
const resetButton = document.getElementById('reset-chat');
const conversation = [];

function sourceBox(sources) {
  const box = el('div', 'message-sources');
  box.append('Bron: ');
  sources.forEach((src, i) => {
    if (i > 0) box.append('; ');
    let label;
    if (src.url) {
      label = el('a', null, src.title);
      label.href = src.url;
      label.target = '_blank';
      label.rel = 'noopener';
    } else {
      label = el('span', null, src.title);
    }
    box.appendChild(label);
    const details = [src.version && `versie: ${src.version}`, src.pages].filter(Boolean).join(', ');
    if (details) box.append(` (${details})`);
  });
  return box;
}

function answerActions(question, answer) {
  const bar = el('div', 'message-actions');

  const copy = el('button', 'link-button', 'Kopieer');
  copy.type = 'button';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(answer);
      copy.textContent = 'Gekopieerd';
    } catch (err) {
      copy.textContent = 'Kopiëren mislukt';
    }
  });

  const report = el('button', 'link-button', 'Antwoord niet correct? Meld het');
  report.type = 'button';
  report.addEventListener('click', async () => {
    report.disabled = true;
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }),
      });
      report.textContent = response.ok ? 'Gemeld, bedankt' : 'Melden mislukt';
    } catch (err) {
      report.textContent = 'Melden mislukt';
    }
  });

  bar.append(copy, report);
  return bar;
}

function addMessage(text, role, sources, question) {
  const node = el('div', `message ${role}`);
  if (role === 'assistant') renderMarkdown(node, text);
  else node.textContent = text;
  if (sources && sources.length) node.appendChild(sourceBox(sources));
  if (role === 'assistant' && question) node.appendChild(answerActions(question, text));
  chatEl.appendChild(node);
  chatEl.scrollTop = chatEl.scrollHeight;
  return node;
}

async function ask(question) {
  chipsEl.hidden = true;
  addMessage(question, 'user');
  inputEl.value = '';
  inputEl.disabled = true;
  sendButton.disabled = true;

  const pending = addMessage('Bezig met zoeken...', 'pending');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history: conversation.slice(-6) }),
    });
    const data = await response.json();
    pending.remove();

    if (!response.ok) {
      addMessage(data.error || 'Er ging iets mis.', 'error');
    } else {
      addMessage(data.answer, 'assistant', data.sources, question);
      conversation.push({ role: 'user', text: question }, { role: 'assistant', text: data.answer });
      resetButton.hidden = false;
    }
  } catch (err) {
    pending.remove();
    addMessage('Kon geen verbinding maken met de assistent.', 'error');
  } finally {
    inputEl.disabled = false;
    sendButton.disabled = false;
    inputEl.focus();
  }
}

SUGGESTIONS.forEach((text) => {
  const chip = el('button', 'chip', text);
  chip.type = 'button';
  chip.addEventListener('click', () => ask(text));
  chipsEl.appendChild(chip);
});

resetButton.addEventListener('click', () => {
  conversation.length = 0;
  while (chatEl.children.length > 1) chatEl.removeChild(chatEl.lastChild);
  chipsEl.hidden = false;
  resetButton.hidden = true;
  inputEl.focus();
});

formEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = inputEl.value.trim();
  if (question) ask(question);
});
