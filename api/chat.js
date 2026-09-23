const { loadAllContent, isContentEmpty } = require('../lib/content');

const MODEL = 'gemini-2.0-flash';

function buildSystemInstruction(sourceContent) {
  return [
    'Je bent een onboarding-assistent voor nieuwe salesmedewerkers bij Justlease.',
    'Je beantwoordt vragen over het verkoopdraaiboek en de Justlease-voorwaarden uitsluitend op basis van de brondocumentatie hieronder.',
    'Antwoord kort en praktisch, gericht op iemand die net begint.',
    'Als het antwoord niet in de brondocumentatie staat, geef dat expliciet aan in plaats van iets te verzinnen.',
    'Verwijs waar relevant naar het onderliggende document (bijvoorbeeld "zie de Aanvullende Voorwaarden Justlease").',
    '',
    '--- BRONDOCUMENTATIE ---',
    sourceContent,
    '--- EINDE BRONDOCUMENTATIE ---',
  ].join('\n');
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

  const sourceContent = loadAllContent();

  if (isContentEmpty(sourceContent)) {
    res.status(200).json({
      answer:
        'Er is nog geen brondocumentatie ingeladen. Zodra het Justlease-verkoopdraaiboek is toegevoegd aan de data-map, kan ik hier vragen over beantwoorden.',
    });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server is niet correct geconfigureerd: GEMINI_API_KEY ontbreekt.',
    });
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: buildSystemInstruction(sourceContent) }],
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: question }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API error:', response.status, errorBody);
      res.status(502).json({ error: 'De AI-service gaf een fout terug. Probeer het later opnieuw.' });
      return;
    }

    const data = await response.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      'Ik kon geen antwoord genereren op basis van de brondocumentatie.';

    res.status(200).json({ answer });
  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het verwerken van je vraag.' });
  }
};
