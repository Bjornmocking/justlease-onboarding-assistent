const { logUnanswered } = require('../lib/log');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { question, answer } = req.body || {};
  if (typeof question !== 'string' || !question.trim() || question.length > 1000) {
    res.status(400).json({ error: 'Vraag ontbreekt.' });
    return;
  }
  await logUnanswered({
    question,
    reason: 'onjuist',
    answer: typeof answer === 'string' ? answer : '',
  });
  res.status(200).json({ ok: true });
};
