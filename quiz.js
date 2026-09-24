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
  {
    question: 'Een klant heeft in één kalenderjaar 3 of meer niet-verhaalbare schades gehad. Wat gebeurt er met zijn eigen bijdrage?',
    options: [
      'Die wordt hoger: 950 euro bij het Standaard Pakket, voor het resterende deel van de leaseperiode',
      'Die blijft hetzelfde',
      'De klant hoeft dan niets meer te betalen',
      'Het contract wordt direct beëindigd',
    ],
    explanation: 'Bij 3 of meer niet-verhaalbare schades in één kalenderjaar geldt een hogere eigen bijdrage voor het resterende deel van de leaseperiode: 950 euro bij het Standaard Pakket, 650 bij Comfort en 350 bij Zorgeloos.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'De auto van een klant staat in de garage voor onderhoud. Wie betaalt de eerste 48 uur vervangend vervoer, als de klant niet de optie "direct vervangend vervoer" heeft?',
    options: ['De klant', 'Justlease', 'De garage', 'De verzekeraar'],
    explanation: 'Bij onderhoud en reparatie zijn de kosten van vervangend vervoer voor de eerste 48 uur voor rekening van de klant. Heeft hij de optie "direct vervangend vervoer" gekozen, dan zijn die 48 uur inbegrepen. Let op: op de website staan andere termijnen; de voorwaarden zijn leidend.',
    source: 'Aanvullende voorwaarden Justlease',
  },
  {
    question: 'Een klant vraagt of een leasecontract een BKR-registratie geeft. Wat is het juiste antwoord?',
    options: [
      'Ja, ook bij Justlease. De registratie blijft 5 jaar na het einde van het contract zichtbaar',
      'Nee, private lease is geen lening en wordt niet geregistreerd',
      'Alleen als de klant een betalingsachterstand heeft',
      'Ja, maar hij verdwijnt zodra de auto is ingeleverd',
    ],
    explanation: 'Een leasecontract geeft een BKR-registratie, ook bij Justlease. Die kan invloed hebben op een hypotheekaanvraag. De registratie blijft 5 jaar na het einde van het contract zichtbaar, met een einddatum erbij.',
    source: 'justlease.nl, voor- en nadelen (opgehaald 24 september 2026)',
  },
  {
    question: 'Een klant vraagt of private lease een lening is. Wat zeg je?',
    options: [
      'Nee, Justlease blijft eigenaar van de auto',
      'Ja, de klant leent het bedrag van de auto',
      'Ja, en de klant wordt na afloop eigenaar',
      'Dat hangt af van de looptijd',
    ],
    explanation: 'Private lease is geen lening. Justlease blijft altijd eigenaar van de leaseauto. Er is wel een BKR-registratie.',
    source: 'justlease.nl, voor- en nadelen (opgehaald 24 september 2026)',
  },
  {
    question: 'Hoe vaak kan een klant zijn kilometerbundel kosteloos aanpassen?',
    options: ['Eén keer per kwartaal', 'Eén keer per jaar', 'Zo vaak als hij wil', 'Alleen aan het einde van het contract'],
    explanation: 'Blijkt dat de klant meer of minder rijdt, dan kan hij het aantal kilometers één keer per kwartaal kosteloos aanpassen.',
    source: 'justlease.nl, private lease bij Justlease (opgehaald 23 september 2026)',
  },
  {
    question: 'Wat kan een klant doen als hij zijn baan verliest tijdens het contract?',
    options: [
      'Gebruikmaken van de contractannuleringsoptie',
      'Niets, het contract loopt gewoon door',
      'De auto direct terugbrengen zonder gevolgen',
      'Het contract laten overnemen door Justlease',
    ],
    explanation: 'Justlease biedt een contractannuleringsoptie: bij ontslag kan de klant van de auto af.',
    source: 'justlease.nl, voor- en nadelen (opgehaald 24 september 2026)',
  },
  {
    question: 'Een klant twijfelt tussen een nieuwe auto en een occasion en wil zo snel mogelijk rijden. Wat past het beste?',
    options: [
      'Een occasion: levertijd ongeveer 6 weken en een scherper tarief',
      'Een nieuwe auto: die is altijd sneller geleverd',
      'Het maakt niet uit, de levertijd is gelijk',
      'Een occasion: die wordt binnen een week geleverd',
    ],
    explanation: 'Een occasion heeft een levertijd van ongeveer 6 weken en een scherper tarief dan nieuw. Een nieuwe auto past bij wie een gloednieuwe auto wil, kan wachten en een lang contract prima vindt.',
    source: 'justlease.nl, nieuw of occasion (opgehaald 24 september 2026)',
  },
  {
    question: 'Een klant vraagt of hij 5 euro korting krijgt omdat hij drie keer pech had. Wat doe je?',
    options: [
      'Voorleggen aan een senior, die beslist over korting',
      'Zelf 5 euro korting toezeggen',
      'Zeggen dat dit nooit kan',
      'De klant doorverwijzen naar klantenservice',
    ],
    explanation: 'Je beslist nooit zelf over korting of tegemoetkoming. Dat beslist een senior. Zeg ook niets toe wat niet zwart op wit in de voorwaarden staat.',
    source: 'Werkwijze Justlease Sales (intern)',
  },
];

const quizContainer = document.getElementById('quiz-container');
const progressEl = document.getElementById('quiz-progress');
const lastEl = document.getElementById('quiz-last');
const STORAGE_KEY = 'justlease-quiz-laatste';
let currentQuiz = [];

function answeredCount() {
  return currentQuiz.filter((_, i) => quizContainer.querySelector(`input[name="question-${i}"]:checked`)).length;
}

function updateProgress() {
  progressEl.textContent = `Beantwoord: ${answeredCount()} van ${currentQuiz.length}`;
}

function showLastResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      lastEl.hidden = true;
      return;
    }
    const r = JSON.parse(raw);
    lastEl.textContent = `Laatste poging op deze computer: ${r.correct} van ${r.total} goed (${r.percentage}%), ${r.passed ? 'geslaagd' : 'nog niet geslaagd'}, op ${r.date}.`;
    lastEl.hidden = false;
  } catch (err) {
    lastEl.hidden = true;
  }
}

function saveResult(result) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch (err) {
    // Opslaan is een extraatje; zonder opslag werkt de quiz gewoon.
  }
}

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
  quizContainer.onchange = updateProgress;
  updateProgress();
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
    const firstOpen = currentQuiz.findIndex((_, i) => !quizContainer.querySelector(`input[name="question-${i}"]:checked`));
    const block = quizContainer.querySelector(`.quiz-question[data-index="${firstOpen}"]`);
    if (block) block.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
  progressEl.textContent = '';
  saveResult({
    correct: correctCount,
    total: currentQuiz.length,
    percentage,
    passed,
    date: new Date().toLocaleDateString('nl-NL'),
  });
  showLastResult();

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

showLastResult();
renderQuiz();
