# Justlease Medewerkersportaal

Portaal voor nieuwe salesmedewerkers bij Justlease, in de huisstijl van justlease.nl
(wit, navy `#0938A1`, oranje `#FF8B1F`, Oswald + Roboto Condensed). Drie onderdelen:

- **Informatie**: overzicht van de belangrijkste documenten en een chatbot die vragen
  beantwoordt op basis van die documenten.
- **Kennisquiz**: één eindtoets met vaste vragen, zoals klanten ze aan de telefoon stellen.
- **Over Justlease**: geschiedenis, kerncijfers en wat we klanten bieden (gegevens bovenaan `script.js`).

## Inhoud aanpassen

- **Werkverdeling en grenzen** (sales/klantenservice, wat de assistent niet mag zeggen): [`data/werkwijze.md`](data/werkwijze.md). Dit bestand wordt bij elke vraag volledig meegegeven. De regels voor de assistent staan in `api/chat.js`.
- **Versiedatum en pagina's**: elk bronbestand in `data/bronnen/` heeft bovenaan `> Versiedatum: ...` en `<!--pagina-->` bij elke paginawissel. De chatbot toont die onder elk antwoord.
- **Documenten voor de chatbot**: `.md`-bestanden onder [`data/`](data), met de officiële
  documenten in [`data/bronnen/`](data/bronnen). Elk bestand wordt automatisch meegenomen.
  De documentenlijst op de pagina staat bovenaan [`script.js`](script.js).
- **Eindtoets**: de vragen staan bovenaan [`quiz.js`](quiz.js). Bij elke vraag is de eerste
  optie het juiste antwoord (de volgorde wordt bij het tonen gehusseld). Geslaagd bij 80%.
  Oefentoetsen kunnen later als extra lijst met vragen worden toegevoegd.

## Techniek

- Statische frontend: `index.html`, `styles.css`, `script.js`, `quiz.js`, `assets/logo.png`
- Serverless function `api/chat.js` (Vercel, Node.js). `lib/retrieval.js` zoekt per vraag de
  best passende passages (BM25) en `lib/gemini.js` roept de Gemini API aan, met herpogingen
  en reservemodellen.
- De quiz gebruikt geen AI en heeft dus geen API-key of quotum nodig.
- API-key uitsluitend via de environment variable `GEMINI_API_KEY`, nooit in code of Git.

## Testset chatbot

`node test/chat-testset.js` stuurt veelgestelde vragen naar de live chatbot en controleert de antwoorden (verbruikt Gemini-quotum). Voeg eigen vragen toe in `test/chat-testset.js`.

## Lokaal draaien

```bash
npm install -g vercel
vercel dev
```

Maak lokaal een `.env` (zie `.env.example`) met `GEMINI_API_KEY`. Wordt genegeerd door Git.

## Deployen

Push naar GitHub of run `vercel --prod`. Zet in Vercel (Settings, Environment Variables)
`GEMINI_API_KEY` en deploy daarna opnieuw.
