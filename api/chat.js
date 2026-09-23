const { retrieve, getWerkwijze, overlapsWerkwijze, hasContent } = require('../lib/retrieval');
const { callGemini } = require('../lib/gemini');

const ESCALATE =
  'Dit weet ik niet zeker. Leg deze vraag voor aan een senior of manager voordat je de klant iets toezegt.';

const NO_ANSWER = `Hier heb ik geen betrouwbare informatie over in de documenten, dus ik ga niet gokken. ${ESCALATE}`;

function buildSystemInstruction(passages, werkwijze) {
  return [
    'Je bent de onboarding-assistent voor nieuwe salesmedewerkers bij Justlease. Je helpt collega\'s, niet klanten. Antwoord kort en praktisch, in het Nederlands.',
    '',
    'BRONNEN EN WAARHEID',
    '- Gebruik uitsluitend de passages en de werkwijze hieronder. Verzin niets en gebruik geen algemene kennis over leasen.',
    '- Als de passages het antwoord niet bevatten, zeg dat eerlijk en verwijs naar een senior of manager.',
    '- Als bronnen elkaar tegenspreken, gaan de Aanvullende Voorwaarden Justlease (januari 2026) altijd voor. De Algemene Voorwaarden Keurmerk Private Lease zijn alleen het algemene kader. Geef het antwoord uit de Aanvullende Voorwaarden en vermeld kort dat het Keurmerk-document iets anders of algemener zegt, zodat de medewerker weet welke bron leidend is.',
    '- De werkwijze [W] bepaalt of een onderwerp bij sales, klantenservice of de financiële afdeling hoort. Noem dat expliciet als de vraag daarover gaat.',
    '',
    'GRENZEN',
    '- Tarieven en bedragen die in de passages staan mag je noemen.',
    '- Je beslist nooit over korting, tegemoetkoming of uitzonderingen voor een klant, ook niet als de klant er goede redenen voor heeft (bijvoorbeeld na herhaalde pech). Dat beslist een senior.',
    '- Je doet alleen een harde toezegging als het letterlijk zwart op wit in de passages staat. Geef geen juridische oordelen.',
    '- Bij twijfel: zeg wat je wel weet, zeg eerlijk dat je het niet zeker weet en raad aan het voor te leggen aan een ervaren collega, senior of manager.',
    `- Gebruik de zin "${ESCALATE}" ALLEEN als je echt twijfelt: de passages bevatten het antwoord niet, de bronnen spreken elkaar tegen zonder dat de voorrangsregel het oplost, of de vraag gaat over korting, uitzonderingen of een toezegging die niet in de bronnen staat.`,
    '- Staat het antwoord duidelijk in de passages, geef het dan stellig en zonder deze zin en zonder enige andere opmerking dat je het niet zeker weet.',
    '',
    'AFSLUITING',
    'Sluit je antwoord af met een aparte laatste regel in exact dit formaat: BRONNEN: 1, 3 (de nummers van de passages die je echt gebruikt hebt; W voor de werkwijze; "BRONNEN: geen" als je er geen gebruikt).',
    '',
    werkwijze ? '--- WERKWIJZE [W] ---\n' + werkwijze.text + '\n--- EINDE WERKWIJZE ---' : '',
    '',
    '--- PASSAGES ---',
    passages || '(Geen passages gevonden.)',
    '--- EINDE PASSAGES ---',
  ].join('\n');
}

function extractSources(rawAnswer, passageSources, werkwijze) {
  const match = rawAnswer.match(/\n?\s*BRONNEN:\s*([^\n]*)\s*$/i);
  const answer = rawAnswer.replace(/\n?\s*BRONNEN:\s*[^\n]*\s*$/i, '').trim();
  if (!match) return { answer, sources: passageSources.slice(0, 2) };
  const sources = [];
  for (const token of match[1].split(/[,\s]+/)) {
    if (/^w$/i.test(token) && werkwijze) sources.push(werkwijze.source);
    else if (/^\d+$/.test(token) && passageSources[parseInt(token, 10) - 1]) {
      sources.push(passageSources[parseInt(token, 10) - 1]);
    }
  }
  const seen = new Set();
  const unique = sources.filter((s) => {
    const key = `${s.title}|${s.pages}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { answer, sources: unique };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { question } = req.body || {};
  if (!question || typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'Vraag ontbreekt.' });
    return;
  }

  if (!hasContent()) {
    res.status(200).json({
      answer:
        'Er is nog geen brondocumentatie ingeladen. Zodra het Justlease-verkoopdraaiboek is toegevoegd aan de data-map, kan ik hier vragen over beantwoorden.',
      sources: [],
    });
    return;
  }

  const { context, sources: passageSources } = retrieve(question);
  if (passageSources.length === 0 && !overlapsWerkwijze(question)) {
    res.status(200).json({ answer: NO_ANSWER, sources: [] });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server is niet correct geconfigureerd: GEMINI_API_KEY ontbreekt.',
    });
    return;
  }

  const werkwijze = getWerkwijze();

  try {
    const response = await callGemini(apiKey, {
      systemInstruction: { parts: [{ text: buildSystemInstruction(context, werkwijze) }] },
      contents: [{ role: 'user', parts: [{ text: question }] }],
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API error:', response.status, errorBody);
      res.status(502).json({ error: 'De AI-service gaf een fout terug. Probeer het later opnieuw.' });
      return;
    }

    const data = await response.json();
    const raw =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      'Ik kon geen antwoord genereren op basis van de brondocumentatie.';

    res.status(200).json(extractSources(raw, passageSources, werkwijze));
  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het verwerken van je vraag.' });
  }
};
