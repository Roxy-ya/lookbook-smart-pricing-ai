# LookBook Smart Pricing AI

LookBook Smart Pricing AI è un'applicazione web che utilizza l'intelligenza artificiale per stimare il prezzo di vendita di capi e accessori second-hand.

L'utente carica una fotografia del prodotto, specifica categoria, brand e stato del capo e riceve una valutazione AI composta da:

- prezzo consigliato;
- range minimo e massimo realistico;
- motivazione della stima;
- consigli per migliorare la vendita.

## Demo online

L'applicazione è disponibile online:

- **Frontend:** https://lookbook-smart-pricing-ai.netlify.app
- **Backend API:** https://lookbook-smart-pricing-ai-backend.onrender.com

> Il backend utilizza un'istanza gratuita su Render, quindi la prima richiesta dopo un periodo di inattività potrebbe richiedere qualche secondo in più.

## Obiettivo

Il progetto nasce per semplificare l'esperienza di vendita all'interno di un marketplace di moda second-hand, aiutando gli utenti a definire un prezzo realistico e coerente con le caratteristiche del prodotto.

## Funzionalità

- Upload di immagini JPG, PNG e WEBP
- Validazione delle immagini fino a 5 MB
- Anteprima dell'immagine caricata
- Inserimento di categoria, brand e stato
- Analisi multimodale tramite Large Language Model
- Generazione di un prezzo consigliato
- Generazione di un range minimo/massimo
- Motivazione strutturata della valutazione
- Suggerimenti personalizzati per la vendita
- Structured Output tramite JSON Schema
- Validazione logica del prezzo restituito
- Persistenza delle valutazioni
- Memoria basata sulla sessione dell'utente
- Recupero delle ultime valutazioni come contesto per l'AI
- Gestione degli errori di upload, AI e database
- Interfaccia responsive

## Tecnologie utilizzate

### Frontend

- React
- TypeScript
- Vite
- CSS

### Backend

- Node.js
- Express
- TypeScript
- Multer
- OpenAI API

### Database

- Supabase
- PostgreSQL

## Architettura

```text
React
  |
  | multipart/form-data
  | foto + categoria + brand + stato + sessionId
  v
Node.js / Express
  |
  +--> Validazione input e immagine
  |
  +--> Conversione immagine in Base64
  |
  +--> Recupero storico da Supabase
  |
  +--> OpenAI
  |      |
  |      +--> System Prompt
  |      +--> User Message
  |      +--> Immagine
  |      +--> Structured Output
  |
  +--> Validazione della risposta
  |
  +--> Salvataggio su Supabase
  |
  v
React


## Progetto DevOps

Questo repository viene utilizzato per costruire un ciclo DevOps completo
per l'applicazione LookBook Smart Pricing AI.

Gli obiettivi del progetto sono:

- containerizzare frontend e backend tramite Docker;
- gestire l'ambiente locale tramite Docker Compose;
- separare configurazione e secrets dal codice sorgente;
- implementare una pipeline CI con GitHub Actions;
- automatizzare il deploy tramite una pipeline CD;
- distribuire il frontend su Netlify e il backend su Render;
- monitorare la disponibilità dell'applicazione tramite UptimeRobot;
- integrare Sentry per il monitoraggio degli errori.

## Ambienti

### Development

L'ambiente di development viene eseguito localmente tramite Docker.

Componenti:

- frontend React + TypeScript;
- backend Node.js + Express;
- OpenAI API;
- Supabase.

L'obiettivo è permettere l'avvio dell'applicazione completa tramite Docker Compose.

### Staging

L'ambiente di staging viene utilizzato per verificare le modifiche prima
del rilascio in produzione.

Per il frontend verranno utilizzate le Deploy Preview generate durante
il processo di sviluppo.

### Production

L'ambiente di produzione utilizza:

- Netlify per il frontend;
- Render per il backend;
- Supabase/PostgreSQL per la persistenza dei dati;
- OpenAI API per la generazione delle valutazioni.

Frontend pubblico:

https://lookbook-smart-pricing-ai.netlify.app

## CI/CD

Per l'automazione del ciclo DevOps viene utilizzato GitHub Actions.

La scelta è motivata dall'integrazione nativa con GitHub, dove è ospitato
il repository del progetto.

La pipeline verrà configurata per eseguire automaticamente:

1. installazione delle dipendenze;
2. linting del codice;
3. build del frontend;
4. build del backend;
5. build delle immagini Docker;
6. deploy automatico in produzione.

## Roadmap DevOps

- [x] Analisi dell'applicazione
- [x] Definizione degli ambienti
- [x] Scelta dello strumento CI/CD
- [ ] Containerizzazione frontend
- [ ] Containerizzazione backend
- [ ] Docker Compose
- [ ] Gestione secrets
- [ ] Pipeline CI
- [ ] Pipeline CD
- [ ] Deploy automatico
- [ ] Uptime monitoring
- [ ] Error tracking
- [ ] Documentazione finale