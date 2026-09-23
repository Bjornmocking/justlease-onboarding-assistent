const DOCUMENTS = [
  {
    title: 'Algemene voorwaarden Keurmerk Private Lease',
    desc: 'De basisvoorwaarden voor elke private lease-overeenkomst.',
    url: 'https://portal.justlease.nl/app/uploads/2018/06/Algemene-voorwaarden-Keurmerk-Private-Lease-01-12-2017.pdf',
  },
  {
    title: 'Aanvullende voorwaarden Justlease',
    desc: 'Eigen bijdrage, opzegging, vervangend vervoer en schade (januari 2026).',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2026/01/Justlease-aanvullende-voorwaarden-versie-jan2026.docx.pdf',
  },
  {
    title: 'Kredietcheck: aan te leveren documenten',
    desc: 'Welke documenten een klant moet aanleveren bij een aanvraag.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/10/Justlease_Aanleveren-documenten.pdf',
  },
  {
    title: 'Innameprotocol',
    desc: 'Hoe schade en staat van de auto worden beoordeeld bij inleveren.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2026/02/Innamehandleiding-Justlease-2026.pdf',
  },
  {
    title: 'Verzekeringskaart WA + Casco',
    desc: 'Korte samenvatting van de dekking.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/IPID-NL-Version-MTPLMODv20.25.pdf',
  },
  {
    title: 'Verzekeringskaart aanvullende verzekeringen',
    desc: 'Korte samenvatting van de aanvullende dekking.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/AVNLLDPA20.25-Aanvullende-verzekeringen-SVI-POI-documents-PL.pdf',
  },
  {
    title: 'Algemene verzekeringsvoorwaarden',
    desc: 'Volledige voorwaarden WA en Casco.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/Verzekeringsvoorwaarden-AVNL-MTPLMOD-20.25-PL.pdf',
  },
  {
    title: 'Aanvullende verzekeringsvoorwaarden',
    desc: 'Volledige voorwaarden aanvullende verzekeringen.',
    url: 'https://website-justlease-nl-api.justlease.nl/uploads/2025/01/AVNLLDPA20.25.0-Aanvullende-voorwaarden-Greenval-Policy-Conditions-NL.pdf',
  },
];

const docListEl = document.getElementById('doc-list');
DOCUMENTS.forEach((doc) => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = doc.url;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = doc.title;
  const desc = document.createElement('div');
  desc.className = 'doc-desc';
  desc.textContent = doc.desc;
  li.append(a, desc);
  docListEl.appendChild(li);
});

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const panels = {
  info: document.getElementById('panel-info'),
  quiz: document.getElementById('panel-quiz'),
};

function showTab(tab) {
  navItems.forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  Object.entries(panels).forEach(([key, panel]) => {
    panel.classList.toggle('hidden', key !== tab);
  });
  window.scrollTo(0, 0);
}

navItems.forEach((btn) => btn.addEventListener('click', () => showTab(btn.dataset.tab)));
document.querySelector('[data-tab-link]').addEventListener('click', (e) => {
  e.preventDefault();
  showTab('info');
});

// Chat
const chatEl = document.getElementById('chat');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('question-input');
const sendButton = document.getElementById('send-button');

function addMessage(text, role) {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  el.textContent = text;
  chatEl.appendChild(el);
  chatEl.scrollTop = chatEl.scrollHeight;
  return el;
}

formEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  const question = inputEl.value.trim();
  if (!question) return;

  addMessage(question, 'user');
  inputEl.value = '';
  inputEl.disabled = true;
  sendButton.disabled = true;

  const pending = addMessage('Bezig met zoeken...', 'pending');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    pending.remove();

    if (!response.ok) {
      addMessage(data.error || 'Er ging iets mis.', 'error');
    } else {
      addMessage(data.answer, 'assistant');
    }
  } catch (err) {
    pending.remove();
    addMessage('Kon geen verbinding maken met de assistent.', 'error');
  } finally {
    inputEl.disabled = false;
    sendButton.disabled = false;
    inputEl.focus();
  }
});
