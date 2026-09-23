const MODELS = [process.env.GEMINI_MODEL, 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.7-flash', 'gemini-3.6-flash'].filter(Boolean);
const RETRYABLE = new Set([404, 429, 500, 503]);
const ATTEMPTS_PER_MODEL = 1;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGemini(apiKey, body) {
  let response;
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) return response;
      if (!RETRYABLE.has(response.status)) return response;
      const errText = await response.clone().text();
      console.error(`Gemini ${model} attempt ${attempt} failed with ${response.status}: ${errText.slice(0, 300)}`);
      if (response.status === 404) break;
      await sleep(1000 * attempt);
    }
  }
  return response;
}

module.exports = { callGemini };
