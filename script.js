// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const panels = {
  chat: document.getElementById('panel-chat'),
  quiz: document.getElementById('panel-quiz'),
};

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    Object.entries(panels).forEach(([key, panel]) => {
      panel.classList.toggle('hidden', key !== btn.dataset.tab);
    });
  });
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

  const pending = addMessage('Bezig met antwoord...', 'pending');

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
