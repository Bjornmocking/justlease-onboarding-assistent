const { loadAllContent, isContentEmpty, getTopics, loadTopicContent } = require('../lib/content');
const { callGemini } = require('../lib/gemini');


function buildSystemInstruction(sourceContent) {
  return [
    'Je maakt kennistoetsen voor nieuwe salesmedewerkers bij Justlease, op basis van de brondocumentatie hieronder.',
    'Genereer meerkeuzevragen die praktische kennis testen die een sales-medewerker echt nodig heeft in gesprekken met klanten.',
    'Elke vraag heeft precies 4 antwoordopties, waarvan er precies 1 correct is.',
    'Baseer vragen en antwoorden uitsluitend op de brondocumentatie. Verzin geen feiten.',
    'Geef bij elke vraag een korte uitleg (1-2 zinnen) waarom het antwoord correct is.',
    'Schrijf in het Nederlands, kort en praktisch.',
    'Antwoord uitsluitend met JSON in exact dit formaat: {"questions":[{"question":string,"options":[string,string,string,string],"correctIndex":0-3,"explanation":string}]}',
    '',
    '--- BRONDOCUMENTATIE ---',
    sourceContent,
    '--- EINDE BRONDOCUMENTATIE ---',
  ].join('\n');
}

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const topics = getTopics().map((t) => ({ id: t.id, title: t.title }));
      res.status(200).json({ topics });
    } catch (err) {
      console.error('Quiz topics error:', err);
      res.status(500).json({ error: 'Kon onderwerpen niet laden.' });
    }
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { topic, count } = req.body || {};
  const questionCount = Math.min(Math.max(parseInt(count, 10) || 5, 3), 10);

  const sourceContent =
    topic && topic !== 'all' ? loadTopicContent(topic) : loadAllContent();

  if (!sourceContent || isContentEmpty(sourceContent)) {
    res.status(200).json({
      questions: [],
      notice:
        'Er is nog geen brondocumentatie ingeladen om een toets van te maken.',
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
    const response = await callGemini(apiKey, {
          systemInstruction: {
            parts: [{ text: buildSystemInstruction(sourceContent) }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Genereer een kennistoets van precies ${questionCount} meerkeuzevragen.`,
                },
              ],
            },
          ],
        });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API error:', response.status, errorBody);
      res.status(502).json({ error: 'De AI-service gaf een fout terug. Probeer het later opnieuw.' });
      return;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';

    let quiz;
    try {
      quiz = JSON.parse(text.replace(/^\s*```(?:json)?\s*|\s*```\s*$/g, '').trim());
    } catch (err) {
      console.error('Failed to parse quiz JSON:', text);
      res.status(502).json({ error: 'Kon de gegenereerde toets niet verwerken.' });
      return;
    }

    res.status(200).json(quiz);
  } catch (err) {
    console.error('Quiz handler error:', err);
    res.status(500).json({ error: 'Er ging iets mis bij het genereren van de toets.' });
  }
};
