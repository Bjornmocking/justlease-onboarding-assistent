const PASS_PERCENTAGE = 80;

// Elke vraag: eerste optie in `options` is het juiste antwoord; de volgorde wordt bij het tonen gehusseld.
const QUESTIONS = [
  {
    question: 'Welk rijbewijs moet een klant aanleveren bij zijn aanvraag?',
    options: [
      'Een geldig Europees rijbewijs (voor- en achterkant)',
      'Alleen de voorkant van een Nederlands rijbewijs',
      'Een rijbewijs mag ook verlopen zijn',
      'Een rijbewijs hoeft pas bij aflevering getoond te worden',
    ],
    explanation: 'Voor- en achterkant van een geldig Europees rijbewijs zijn altijd nodig. Bij aflevering moet het rijbewijs ook getoond worden.',
    source: 'Kredietcheck: aan te leveren documenten',
  },
  {
    question: 'Hoe oud mag de loonstrook of het bankafschrift met salaris maximaal zijn?',
    options: ['Maximaal twee maanden', 'Maximaal zes maanden', 'Maximaal een jaar', 'De leeftijd maakt niet uit'],
    explanation: 'Loonstrook en bankafschrift met salarisbijschrijving mogen niet ouder zijn dan twee maanden.',
    source: 'Kredietcheck: aan te leveren documenten',
  },
  {
    question: 'Een klant heeft een tijdelijk contract. Wat moet hij naast de loonstrook aanleveren?',
    options: [
      'Een actuele werkgeversverklaring (maximaal drie maanden oud)',
      'Een kopie van de aangifte inkomstenbelasting',
      'Een uittreksel van de Kamer van Koophandel',
      'Niets extra',
    ],
    explanation: 'Bij een tijdelijk contract is naast de loonstrook een actuele werkgeversverklaring nodig, niet ouder dan drie maanden.',
    source: 'Kredietcheck: aan te leveren documenten',
  },
  {
    question: 'Een zzp-er wil leasen. Aan welke voorwaarde moet zijn onderneming voldoen?',
    options: [
      'De onderneming bestaat langer dan 12 maanden',
      'De onderneming bestaat langer dan 3 maanden',
      'De onderneming heeft minimaal 2 werknemers',
      'Er zijn geen voorwaarden voor zzp-ers',
    ],
    explanation: 'De onderneming van een zzp-er moet langer dan 12 maanden bestaan.',
    source: 'Kredietcheck: aan te leveren documenten',
  },
  {
    question: 'Wat zijn de extra\'s van het Comfort Pakket ten opzichte van het Standaard Pakket?',
    options: [
      'Een lagere eigen bijdrage bij schade: 325 euro in plaats van 475 euro',
      'Een auto uit een hoger segment',
      'Onbeperkt kilometers',
      'Gratis winterbanden',
    ],
    explanation: 'Het Comfort Pakket verlaagt de eigen bijdrage bij schade van 475 naar 325 euro (bij 3 of meer schades in een jaar: 650 in plaats van 950 euro). Bij het Zorgeloos Pakket is dat 175 euro.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Een klant heeft schade aan de auto. Binnen hoeveel uur moet hij contact opnemen met Justlease?',
    options: ['Binnen 48 uur', 'Binnen 7 dagen', 'Binnen 14 dagen', 'Pas bij het inleveren van de auto'],
    explanation: 'De klant neemt binnen 48 uur na de schade contact op en stuurt binnen 48 uur een Europees schadeformulier in.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Hoe lang heeft een klant bedenktijd nadat Justlease het ondertekende leasecontract heeft ontvangen?',
    options: ['14 dagen', '3 dagen', '30 dagen', 'Er is geen bedenktijd'],
    explanation: 'Binnen 14 dagen kan de klant de overeenkomst zonder kosten ontbinden. De auto wordt pas opgehaald als de bedenktijd voorbij is, tenzij de klant afstand doet van de bedenktijd.',
    source: 'Algemene voorwaarden Keurmerk Private Lease',
  },
  {
    question: 'Een klant wil tussentijds opzeggen. Wat rekent Justlease dan?',
    options: [
      '50% van de resterende termijnbedragen',
      'Alle resterende termijnbedragen',
      'Een vast bedrag van 500 euro',
      'Niets, tussentijds opzeggen is gratis',
    ],
    explanation: 'Bij voortijdige beëindiging geldt een vaste opzeggingsvergoeding van 50% van de resterende termijnbedragen, met een opzegtermijn van één maand. Een verzoek gaat naar klantenservice@justlease.nl.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Hoe hoog mag een waarborgsom maximaal zijn?',
    options: ['3 maal het termijnbedrag', '1 maal het termijnbedrag', '12 maal het termijnbedrag', 'Er is geen maximum'],
    explanation: 'Een waarborgsom is niet hoger dan 3 maal het termijnbedrag en staat vermeld in het leasecontract.',
    source: 'Algemene voorwaarden Keurmerk Private Lease',
  },
  {
    question: 'Waar moet een klant onderhoud en reparatie van de auto laten uitvoeren?',
    options: [
      'Bij een BOVAG-onderhoudsbedrijf',
      'Bij elke garage naar keuze',
      'Alleen bij een Justlease-vestiging',
      'De klant doet het onderhoud zelf',
    ],
    explanation: 'De klant moet de auto tijdig aanbieden bij een BOVAG-onderhoudsbedrijf.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Bij het inleveren zit er een klein deukje in de auto. Wanneer wordt dat gezien als acceptabele gebruikersschade?',
    options: [
      'Als het niet groter is dan een 2-euromunt, niet door de lak heen is en niet gevouwen is',
      'Alleen als er helemaal geen deuk in zit',
      'Als het kleiner is dan 10 centimeter, ook als de lak beschadigd is',
      'Deukjes zijn altijd voor rekening van de klant',
    ],
    explanation: 'Kleine deukjes door deurinslag en parkeerbeschadiging zijn acceptabel als ze niet groter zijn dan een 2-euromunt, niet door de lak heen zijn, niet gevouwen zijn en er maximaal één per carrosseriedeel is.',
    source: 'Innameprotocol',
  },
  {
    question: 'Waar vindt een klant de groene kaart van de auto?',
    options: ['In de MyLeez-app', 'Op de website justlease.nl', 'Bij de gemeente', 'Per post bij de verzekeraar'],
    explanation: 'De groene kaart staat in de MyLeez-app.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Op wiens naam staat het voertuig?',
    options: ['Arval B.V. (Justlease is een handelsnaam van Arval)', 'De klant', 'De dealer', 'De verzekeraar Greenval'],
    explanation: 'Het voertuig staat op naam van Arval B.V. Justlease is een handelsnaam van Arval B.V.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Een klant vraagt wanneer en hoe zijn nieuwe auto wordt geleverd. Wie pakt dit op?',
    options: ['Klantenservice', 'Sales', 'De financiële afdeling', 'De klant regelt dit zelf met de dealer'],
    explanation: 'Alles tot en met het afronden van de aanvraag is sales. De levering van de auto hoort bij klantenservice.',
    source: 'Werkwijze Justlease Sales (intern)',
  },
  {
    question: 'De auto van een klant rijdt al, maar hij wil zijn contract verlengen. Wie pakt dit op?',
    options: ['Sales', 'Klantenservice', 'De financiële afdeling', 'Niemand, verlengen kan alleen bij het einde van het contract'],
    explanation: 'Verlengingen vallen onder sales, ook als de auto al rijdt. Twijfelt de klant bij een aflopend contract over een nieuwe auto, doorrijden of inleveren, dan is dat ook een salesgesprek. Kiest hij voor inleveren, dan is het klantenservice.',
    source: 'Werkwijze Justlease Sales (intern)',
  },
];

const quizContainer = document.getElementById('quiz-container');
let currentQuiz = [];

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderQuiz() {
  currentQuiz = QUESTIONS.map((q) => ({
    ...q,
    shuffled: shuffle(q.options.map((text, i) => ({ text, correct: i === 0 }))),
  }));
  quizContainer.innerHTML = '';

  currentQuiz.forEach((q, qIndex) => {
    const block = document.createElement('div');
    block.className = 'quiz-question';
    block.dataset.index = qIndex;

    const title = document.createElement('div');
    title.className = 'quiz-question-title';
    title.textContent = `${qIndex + 1}. ${q.question}`;
    block.appendChild(title);

    q.shuffled.forEach((option, oIndex) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `question-${qIndex}`;
      radio.value = oIndex;
      label.append(radio, document.createTextNode(option.text));
      block.appendChild(label);
    });

    quizContainer.appendChild(block);
  });

  const actions = document.createElement('div');
  actions.className = 'quiz-actions';
  const submit = document.createElement('button');
  submit.type = 'button';
  submit.className = 'btn';
  submit.textContent = 'Controleer antwoorden';
  submit.addEventListener('click', gradeQuiz);
  actions.appendChild(submit);
  quizContainer.appendChild(actions);
}

function gradeQuiz() {
  const unanswered = currentQuiz.filter(
    (_, i) => !quizContainer.querySelector(`input[name="question-${i}"]:checked`)
  ).length;
  if (unanswered > 0) {
    let warning = quizContainer.querySelector('.quiz-warning');
    if (!warning) {
      warning = document.createElement('div');
      warning.className = 'quiz-warning';
      quizContainer.querySelector('.quiz-actions').appendChild(warning);
    }
    warning.textContent = `Je hebt nog ${unanswered} ${unanswered === 1 ? 'vraag' : 'vragen'} niet beantwoord.`;
    return;
  }

  let correctCount = 0;
  currentQuiz.forEach((q, qIndex) => {
    const block = quizContainer.querySelector(`.quiz-question[data-index="${qIndex}"]`);
    const selected = block.querySelector(`input[name="question-${qIndex}"]:checked`);
    const selectedIndex = parseInt(selected.value, 10);
    if (q.shuffled[selectedIndex].correct) correctCount += 1;

    block.querySelectorAll('.quiz-option').forEach((el, oIndex) => {
      el.querySelector('input').disabled = true;
      if (q.shuffled[oIndex].correct) el.classList.add('correct');
      else if (oIndex === selectedIndex) el.classList.add('incorrect');
    });

    const explanation = document.createElement('div');
    explanation.className = 'quiz-explanation';
    explanation.textContent = `${q.explanation} (Bron: ${q.source})`;
    block.appendChild(explanation);
  });

  const percentage = Math.round((correctCount / currentQuiz.length) * 100);
  const passed = percentage >= PASS_PERCENTAGE;

  const result = document.createElement('div');
  result.className = 'quiz-result';
  const heading = document.createElement('h2');
  heading.textContent = passed ? 'Geslaagd' : 'Nog niet geslaagd';
  const detail = document.createElement('div');
  detail.textContent = `Je hebt ${correctCount} van de ${currentQuiz.length} vragen goed (${percentage}%). Je bent geslaagd bij ${PASS_PERCENTAGE}% of hoger.`;
  result.append(heading, detail);
  quizContainer.prepend(result);

  const actions = quizContainer.querySelector('.quiz-actions');
  actions.innerHTML = '';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'btn';
  retry.textContent = 'Opnieuw proberen';
  retry.addEventListener('click', () => {
    renderQuiz();
    window.scrollTo(0, 0);
  });
  actions.appendChild(retry);
  window.scrollTo(0, 0);
}

renderQuiz();
