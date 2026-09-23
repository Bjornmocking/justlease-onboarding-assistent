# Justlease Sales Onboarding

AI-onboarding-portal voor nieuwe salesmedewerkers bij Justlease: een chatbot om
vragen te stellen over het verkoopdraaiboek en de voorwaarden, en een
kennistoets om jezelf te testen — zodat je zo min mogelijk collega's hoeft
lastig te vallen om door te kunnen werken.

## Eigen inhoud toevoegen

- [`data/onboarding-content.md`](data/onboarding-content.md) — algemene inleiding.
  Voeg hier interne verkoopscripts, objection-handling of FAQ's toe.
- [`data/bronnen/`](data/bronnen) — de officiële Justlease-documenten
  (voorwaarden, verzekeringen, innameprotocol, etc.), overgenomen van
  [justlease.nl/voorwaarden](https://justlease.nl/voorwaarden). Voeg hier
  gerust `.md`-bestanden toe voor extra documenten; ze worden automatisch
  meegenomen als context voor zowel de chatbot als de kennistoets, en
  verschijnen als apart onderwerp in de toets.

Elk `.md`-bestand ergens onder `data/` wordt gebruikt. Zolang die map
(bijna) leeg is, laat de assistent weten dat er nog geen documentatie is.

## Functionaliteit

- **Chatbot** (`api/chat.js`): zoekt per vraag de best passende passages uit de
  brondocumenten (`lib/retrieval.js`, BM25) en stuurt alleen die mee naar Gemini.
  Zo blijft het verbruik laag (~10 KB per vraag i.p.v. de hele kennisbank).
  Geeft aan wanneer iets niet in de bron staat.
- **Kennistoets** (`api/quiz.js`): genereert een meerkeuzetoets (3-10 vragen)
  over alle onderwerpen of één specifiek document (op een willekeurige selectie
  passages, dus elke toets is anders), met directe feedback en uitleg per vraag.

## Techniek

- Statische frontend: `index.html`, `styles.css`, `script.js`, `quiz.js` —
  donker thema in Justlease-huisstijl (navy `#0938A1`, oranje `#FF8B1F`,
  lettertypes Oswald + Roboto Condensed)
- Serverless functions (Vercel, Node.js) die de Gemini API aanroepen, met
  `lib/content.js` als gedeelde module om alle brondocumenten te laden
- API-key wordt uitsluitend via de environment variable `GEMINI_API_KEY`
  aangeleverd, nooit in code of Git

## Lokaal draaien

```bash
npm install -g vercel
vercel dev
```

Maak lokaal een `.env` bestand (gebaseerd op `.env.example`) met je eigen
`GEMINI_API_KEY`. Dit bestand wordt genegeerd door Git.

## Deployen

1. Push deze repo naar GitHub.
2. Importeer het project in Vercel (of gebruik de al gekoppelde Git-integratie).
3. Zet in de Vercel projectinstellingen de environment variable
   `GEMINI_API_KEY` met je Gemini API-key.
4. Deploy.
