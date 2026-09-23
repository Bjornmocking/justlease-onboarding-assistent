const MODELS = [process.env.GEMINI_MODEL || 'gemini-3.6-flash', 'gemini-flash-latest', 'gemini-2.5-flash'];
const RETRYABLE = new Set([404, 429, 500, 503]);
const ATTEMPTS_PER_MODEL = 2;

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
      console.error(`Gemini ${model} attempt ${attempt} failed with ${response.status}`);
      if (response.status === 404) break;
      await sleep(1000 * attempt);
    }
  }
  return response;
}

module.exports = { callGemini };
