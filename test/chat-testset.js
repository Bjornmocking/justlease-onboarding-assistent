// Gebruik: node test/chat-testset.js [basis-url]
// Stuurt veelgestelde vragen naar de chatbot en controleert of het antwoord de verwachte kernpunten bevat.
// Standaard tegen de live site. Let op: elke vraag gebruikt Gemini-quotum.

const BASE_URL = process.argv[2] || 'https://justlease-onboarding-assistent.vercel.app';
const DELAY_MS = 4000;

const ESCALATE = /senior|manager|ervaren collega/i;

const TESTS = [
  { q: 'Wat moet een klant aanleveren voor de kredietcheck?', all: [/rijbewijs/i, /bankafschrift/i], none: [/weet ik niet zeker|senior of manager/i] },
  { q: 'Hoe oud mag een loonstrook zijn?', all: [/twee maanden|2 maanden/i] },
  { q: 'Wat heeft een klant met een tijdelijk contract extra nodig?', all: [/werkgeversverklaring/i] },
  { q: 'Hoe lang moet de onderneming van een zzp-er bestaan?', all: [/12 maanden|twaalf maanden/i] },
  { q: 'Wat is het eigen risico bij het Comfort Pakket?', all: [/325/] },
  { q: 'Binnen hoeveel uur moet een klant schade melden?', all: [/48/], none: [/weet ik niet zeker|senior of manager/i] },
  { q: 'Hoeveel bedenktijd heeft een klant?', all: [/14 dagen/i], none: [/weet ik niet zeker|senior of manager/i] },
  { q: 'Wat kost tussentijds opzeggen?', all: [/50\s?%|50 procent/i] },
  { q: 'Waar moet de klant de auto laten onderhouden?', all: [/BOVAG/i] },
  { q: 'Wanneer is een deukje acceptabele gebruikersschade bij inleveren?', all: [/2-?\s?euromunt|twee euromunt/i] },
  { q: 'Waar staat de groene kaart?', all: [/MyLeez|My Leez/i] },
  { q: 'Sinds wanneer is Justlease onderdeel van Arval?', all: [/2022/] },
  { q: 'Wat gebeurt er met het contract als een van de twee contractpartners overlijdt?', all: [/kosteloos/i], none: [/weet ik niet zeker|senior of manager/i] },
  { q: 'Wat betekent hoofdelijk aansprakelijk bij een medecontractant?', all: [/volledig|hele|gehele/i] },
  // Servicepakketten
  { q: 'Wat is het eigen risico bij het Zorgeloos pakket?', all: [/175/] },
  { q: 'Bij welk servicepakket zit de ontslag annuleringsoptie?', all: [/zorgeloos/i], none: [/weet ik niet zeker/i] },
  { q: 'Vanaf wanneer is vervangend vervoer op kosten van Justlease bij het Comfort pakket?', all: [/24 uur/], none: [/weet ik niet zeker/i] },
  // Verkoopdraaiboek
  { q: 'Is private lease een lening?', all: [/eigenaar/i], none: [/weet ik niet zeker/i] },
  { q: 'Krijgt een klant een BKR-registratie bij een leasecontract?', all: [/BKR/, /\bja\b/i] },
  { q: 'Wat is de levertijd van een occasion?', all: [/6 weken|zes weken/i] },
  { q: 'Kan iemand met een negatieve BKR-codering leasen?', all: [ESCALATE], none: [/ja, dat kan|nee, dat kan niet|is niet mogelijk/i] },
  // Vervolgvraag met gespreksgeheugen
  {
    q: 'En wat als hij een tijdelijk contract heeft?',
    history: [
      { role: 'user', text: 'Wat moet een klant aanleveren voor de kredietcheck?' },
      { role: 'assistant', text: 'Een rijbewijs, bankafschriften en per inkomstenbron een loonstrook of specificatie.' },
    ],
    all: [/werkgeversverklaring/i],
  },
  // Werkverdeling
  { q: 'Een klant met een rijdende auto heeft een vraag over zijn lopende contract. Wie pakt dat op?', all: [/klantenservice/i], none: [/werkwijze/i] },
  { q: 'Wie doet de levering van de auto?', all: [/klantenservice/i] },
  { q: 'Een klant met een rijdende auto wil zijn contract verlengen. Wie pakt dat op?', all: [/sales/i] },
  { q: 'De klant twijfelt bij aflopend contract en kiest uiteindelijk voor inleveren. Bij wie hoort dat?', all: [/klantenservice/i] },
  // Grenzen
  { q: 'Een klant heeft drie keer pech gehad. Mag ik 5 euro korting op het leasebedrag geven?', all: [ESCALATE], none: [/ja, dat mag|je mag .*korting geven/i] },
  { q: 'Kan ik de klant garanderen dat zijn auto volgende week geleverd wordt?', all: [/niet garanderen|geen garantie|niet toezeggen|kun je .*niet/i], none: [/ja, dat kan|dat mag je gerust/i] },
  { q: 'Wat is de hoofdstad van Frankrijk?', all: [ESCALATE] },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ask(question, history) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

(async () => {
  let passed = 0;
  let errors = 0;
  const failures = [];
  for (const t of TESTS) {
    try {
      const { answer, sources } = await ask(t.q, t.history);
      const missing = (t.all || []).filter((re) => !re.test(answer));
      const forbidden = (t.none || []).filter((re) => re.test(answer));
      const ok = missing.length === 0 && forbidden.length === 0;
      console.log(`${ok ? 'OK   ' : 'FOUT '} ${t.q}`);
      if (ok) passed++;
      else failures.push({ q: t.q, answer, sources, missing: missing.map(String), forbidden: forbidden.map(String) });
    } catch (err) {
      errors++;
      console.log(`ERR   ${t.q} -> ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
  console.log(`\n${passed}/${TESTS.length} geslaagd, ${errors} technische fouten.`);
  failures.forEach((f) => {
    console.log(`\n--- ${f.q}\nAntwoord: ${f.answer}\nMist: ${f.missing.join(', ') || '-'} | Ongewenst: ${f.forbidden.join(', ') || '-'}`);
  });
  process.exit(passed === TESTS.length ? 0 : 1);
})();
