# Justlease Onboarding Assistent

AI-onboarding-assistent voor nieuwe salesmedewerkers bij Justlease. Stel een vraag
over het verkoopdraaiboek en krijg een antwoord gebaseerd op de meegeleverde
brondocumentatie.

## Eigen inhoud toevoegen

Vul [`data/onboarding-content.md`](data/onboarding-content.md) met het
Justlease-verkoopdraaiboek of ander onboardingmateriaal. Zolang dit bestand
(bijna) leeg is, laat de assistent weten dat er nog geen documentatie is
ingeladen. Zodra er tekst in staat, gebruikt de assistent dit automatisch als
context om vragen te beantwoorden.

## Techniek

- Statische frontend: `index.html`, `styles.css`, `script.js` (donker thema)
- Serverless function `api/chat.js` (Vercel, Node.js) die de Gemini API
  aanroept met de inhoud van `data/onboarding-content.md` als context
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
2. Importeer het project in Vercel.
3. Zet in de Vercel projectinstellingen de environment variable
   `GEMINI_API_KEY` met je Gemini API-key.
4. Deploy.
