const topicSelect = document.getElementById('topic-select');
const generateButton = document.getElementById('generate-quiz-button');
const quizContainer = document.getElementById('quiz-container');

let currentQuiz = null;

async function loadTopics() {
  try {
    const response = await fetch('/api/quiz');
    const data = await response.json();
    (data.topics || []).forEach((topic) => {
      const option = document.createElement('option');
      option.value = topic.id;
      option.textContent = topic.title;
      topicSelect.appendChild(option);
    });
  } catch (err) {
    // Topic list is a nice-to-have; silently ignore failures.
  }
}

function renderLoading() {
  quizContainer.innerHTML = '<p class="quiz-loading">Toets wordt gegenereerd...</p>';
}

function renderError(message) {
  quizContainer.innerHTML = `<p class="quiz-loading">${message}</p>`;
}

function renderQuiz(quiz) {
  currentQuiz = quiz;
  quizContainer.innerHTML = '';

  if (!quiz.questions || quiz.questions.length === 0) {
    quizContainer.innerHTML = `<p class="quiz-placeholder">${
      quiz.notice || 'Geen vragen beschikbaar.'
    }</p>`;
    return;
  }

  quiz.questions.forEach((q, qIndex) => {
    const block = document.createElement('div');
    block.className = 'quiz-question';
    block.dataset.index = qIndex;

    const title = document.createElement('div');
    title.className = 'quiz-question-title';
    title.textContent = `${qIndex + 1}. ${q.question}`;
    block.appendChild(title);

    q.options.forEach((option, oIndex) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question-${qIndex}`;
      radio.value = oIndex;

      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));
      block.appendChild(label);
    });

    quizContainer.appendChild(block);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'button';
  submitButton.className = 'quiz-submit';
  submitButton.textContent = 'Controleer antwoorden';
  submitButton.addEventListener('click', gradeQuiz);
  quizContainer.appendChild(submitButton);
}

function gradeQuiz() {
  if (!currentQuiz) return;
  let correctCount = 0;

  currentQuiz.questions.forEach((q, qIndex) => {
    const block = quizContainer.querySelector(`.quiz-question[data-index="${qIndex}"]`);
    const selected = block.querySelector(`input[name="question-${qIndex}"]:checked`);
    const selectedIndex = selected ? parseInt(selected.value, 10) : -1;
    const options = block.querySelectorAll('.quiz-option');

    if (selectedIndex === q.correctIndex) correctCount += 1;

    options.forEach((optionEl, oIndex) => {
      optionEl.querySelector('input').disabled = true;
      if (oIndex === q.correctIndex) {
        optionEl.classList.add('correct');
      } else if (oIndex === selectedIndex) {
        optionEl.classList.add('incorrect');
      }
    });

    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.textContent = q.explanation;
    block.appendChild(explanation);
  });

  const submitButton = quizContainer.querySelector('.quiz-submit');
  submitButton.remove();

  const score = document.createElement('div');
  score.className = 'quiz-score';
  score.textContent = `Score: ${correctCount} / ${currentQuiz.questions.length}`;
  quizContainer.prepend(score);

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.className = 'quiz-retry';
  retryButton.textContent = 'Nieuwe toets';
  retryButton.addEventListener('click', generateQuiz);
  quizContainer.appendChild(retryButton);
}

async function generateQuiz() {
  renderLoading();
  generateButton.disabled = true;

  try {
    const response = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topicSelect.value, count: 5 }),
    });

    const data = await response.json();

    if (!response.ok) {
      renderError(data.error || 'Er ging iets mis bij het genereren van de toets.');
    } else {
      renderQuiz(data);
    }
  } catch (err) {
    renderError('Kon geen verbinding maken met de assistent.');
  } finally {
    generateButton.disabled = false;
  }
}

generateButton.addEventListener('click', generateQuiz);
loadTopics();
