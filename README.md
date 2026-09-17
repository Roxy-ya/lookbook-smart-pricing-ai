# LookBook Smart Pricing AI

LookBook Smart Pricing AI è un'applicazione web full-stack che utilizza l'intelligenza artificiale per stimare il prezzo di vendita di capi e accessori second-hand.

L'utente carica una fotografia del prodotto, specifica categoria, brand e stato del capo e riceve una valutazione AI composta da:

- prezzo consigliato;
- range minimo e massimo realistico;
- motivazione della stima;
- consigli personalizzati per migliorare la vendita.

---

## Demo online

L'applicazione è disponibile online:

- **Frontend:** https://lookbook-smart-pricing-ai.netlify.app
- **Backend API:** https://lookbook-smart-pricing-ai-backend.onrender.com
- **Repository GitHub:** https://github.com/Roxy-ya/lookbook-smart-pricing-ai
- **GitHub Actions:** https://github.com/Roxy-ya/lookbook-smart-pricing-ai/actions

> Il backend utilizza un'istanza gratuita su Render, quindi la prima richiesta dopo un periodo di inattività potrebbe richiedere qualche secondo in più.

---

## Obiettivo del progetto

LookBook Smart Pricing AI nasce per semplificare l'esperienza di vendita all'interno di un marketplace di moda second-hand.

L'obiettivo è aiutare l'utente a definire un prezzo realistico e coerente con:

- categoria del prodotto;
- brand;
- stato del capo;
- caratteristiche visive rilevate dall'immagine.

Il progetto è stato successivamente utilizzato come base per realizzare un ciclo DevOps completo, comprendente containerizzazione, CI/CD, gestione dei secrets, deploy automatico e monitoraggio.

---

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

---

# Stack tecnologico

## Frontend

- React
- TypeScript
- Vite
- CSS
- Nginx per il container di produzione

## Backend

- Node.js
- Express
- TypeScript
- Multer
- OpenAI API

## Database

- Supabase
- PostgreSQL

## DevOps

- Docker
- Docker Compose
- GitHub
- GitHub Actions
- Netlify
- Render

## Monitoring

- UptimeRobot
- Sentry

---

# Architettura applicativa

```text
Browser
   |
   v
React + TypeScript
   |
   | multipart/form-data
   | foto + categoria + brand + stato + sessionId
   |
   v
Node.js / Express
   |
   +--> Validazione input e immagine
   |
   +--> Conversione immagine
   |
   +--> Recupero storico da Supabase
   |
   +--> OpenAI API
   |      |
   |      +--> System Prompt
   |      +--> User Message
   |      +--> Immagine
   |      +--> Structured Output
   |
   +--> Validazione della risposta AI
   |
   +--> Salvataggio su Supabase
   |
   v
React
   |
   v
Risultato mostrato all'utente
```

---

# Architettura DevOps

```text
Developer
   |
   | git push
   v
GitHub
   |
   v
GitHub Actions - CI
   |
   +--> Frontend lint
   +--> Frontend build
   +--> Backend build
   +--> Docker build frontend
   +--> Docker build backend
   |
   | solo se la CI termina con successo
   v
GitHub Actions - CD
   |
   +-------------------------+
   |                         |
   v                         v
Netlify                   Render
Frontend                  Backend
   |                         |
   +-----------+-------------+
               |
               v
        Applicazione pubblica
               |
        +------+------+
        |             |
        v             v
   Supabase        OpenAI API
```

GitHub Actions controlla il processo di rilascio.

Gli auto-deploy nativi di Netlify e Render sono disabilitati per evitare deploy duplicati.

---

# Struttura del repository

```text
lookbook-smart-pricing-ai/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# Ambienti

Il progetto prevede tre ambienti logici: Development, Staging e Production.

## Development

L'ambiente di development viene eseguito localmente.

Frontend e backend possono essere avviati tramite Docker Compose.

Componenti:

- frontend React + TypeScript;
- backend Node.js + Express;
- OpenAI API;
- Supabase/PostgreSQL.

URL locali:

```text
Frontend:
http://localhost:8080

Backend:
http://localhost:3000
```

Il backend espone inoltre una route di verifica:

```text
GET http://localhost:3000
```

che restituisce:

```json
{
  "message": "LookBook Smart Pricing AI backend is running"
}
```

---

## Staging

Lo staging rappresenta la fase di verifica prima del rilascio in produzione.

Le modifiche possono essere validate tramite Pull Request verso `main`.

La pipeline CI viene eseguita anche sulle Pull Request e verifica automaticamente:

- linting del frontend;
- build del frontend;
- build del backend;
- validità delle immagini Docker.

Il deploy in produzione non viene eseguito se i controlli CI non terminano con successo.

---

## Production

L'ambiente di produzione utilizza:

- **Netlify** per il frontend;
- **Render** per il backend;
- **Supabase/PostgreSQL** per la persistenza dei dati;
- **OpenAI API** per la generazione delle valutazioni.

URL frontend:

```text
https://lookbook-smart-pricing-ai.netlify.app
```

URL backend:

```text
https://lookbook-smart-pricing-ai-backend.onrender.com
```

---

# Containerizzazione con Docker

Frontend e backend sono containerizzati separatamente.

## Frontend

Il frontend utilizza un Dockerfile multi-stage.

La prima fase utilizza Node.js per:

- installare le dipendenze;
- compilare TypeScript;
- eseguire la build Vite.

La seconda fase utilizza Nginx per servire i file statici generati nella cartella `dist`.

Flusso:

```text
React + TypeScript
        |
        v
Node.js build
        |
        v
npm run build
        |
        v
dist/
        |
        v
Nginx
```

---

## Backend

Anche il backend utilizza una build multi-stage.

La prima fase:

- installa le dipendenze;
- compila TypeScript;
- genera la cartella `dist`.

La seconda fase:

- utilizza Node.js;
- installa soltanto le dipendenze necessarie alla produzione;
- esegue il backend compilato.

Flusso:

```text
TypeScript
    |
    v
npm run build
    |
    v
dist/
    |
    v
Node.js
    |
    v
Express API
```

---

# Avvio locale con Docker Compose

Per avviare frontend e backend contemporaneamente:

```bash
docker compose up --build
```

L'applicazione sarà disponibile su:

```text
Frontend:
http://localhost:8080

Backend:
http://localhost:3000
```

Per arrestare l'applicazione:

```bash
docker compose down
```

Per visualizzare i container attivi:

```bash
docker ps
```

Per visualizzare le immagini Docker:

```bash
docker images
```

---

# Build manuale delle immagini Docker

## Frontend

Dalla cartella `frontend`:

```bash
docker build -t lookbook-frontend .
```

Avvio manuale:

```bash
docker run --rm -p 8080:80 --name lookbook-frontend lookbook-frontend
```

---

## Backend

Dalla cartella `backend`:

```bash
docker build -t lookbook-backend .
```

Avvio manuale utilizzando il file `.env`:

```bash
docker run --rm -p 3000:3000 --env-file .env --name lookbook-backend lookbook-backend
```

---

# Variabili d'ambiente

I secrets non vengono salvati nel repository.

Il progetto utilizza file `.env` locali, esclusi da Git tramite `.gitignore`.

## Backend

Il file:

```text
backend/.env
```

deve contenere:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Nel repository è disponibile solamente:

```text
backend/.env.example
```

che contiene i nomi delle variabili ma nessuna credenziale reale.

---

## Frontend

Il frontend utilizza:

```env
VITE_API_URL=
```

Il relativo file di esempio è:

```text
frontend/.env.example
```

In produzione `VITE_API_URL` contiene l'URL pubblico del backend Render.

---

# Sicurezza e gestione dei secrets

I file `.env` reali non vengono inclusi nel repository.

Sono state effettuate verifiche tramite Git per assicurarsi che i secrets non risultino tracciati né presenti nella history del repository.

Esempi dei controlli effettuati:

```bash
git check-ignore -v backend/.env
```

```bash
git ls-files -- backend/.env frontend/.env .env
```

```bash
git log --all --full-history -- backend/.env
```

Le verifiche hanno confermato che i file `.env` reali non sono presenti nella history Git.

Per la pipeline CI/CD vengono utilizzati GitHub Repository Secrets.

Secrets configurati:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
RENDER_DEPLOY_HOOK_URL
```

È inoltre configurata la Repository Variable:

```text
VITE_API_URL
```

`VITE_API_URL` non contiene informazioni sensibili e identifica solamente l'endpoint pubblico del backend.

I valori dei secrets non vengono salvati nei file YAML e non sono visibili nei log delle pipeline.

---

# Continuous Integration

La Continuous Integration viene gestita tramite GitHub Actions.

Workflow:

```text
.github/workflows/ci.yml
```

La pipeline CI viene avviata automaticamente:

- ad ogni push su `main`;
- ad ogni Pull Request verso `main`.

La pipeline contiene tre job principali.

## Frontend - Lint & Build

Esegue:

```bash
npm ci
npm run lint
npm run build
```

Se ESLint rileva un errore, il job fallisce e la pipeline viene interrotta.

---

## Backend - Build

Esegue:

```bash
npm ci
npm run build
```

Verifica quindi che il backend TypeScript possa essere compilato correttamente.

---

## Docker - Build Images

Questo job viene eseguito solo dopo il completamento con successo dei job frontend e backend.

Esegue:

```bash
docker build -t lookbook-frontend ./frontend
```

e:

```bash
docker build -t lookbook-backend ./backend
```

Il flusso è quindi:

```text
Frontend lint/build ----+
                        |
                        +----> Docker Build
                        |
Backend build ----------+
```

Se uno dei controlli precedenti fallisce, il job Docker non viene eseguito.

---

# Continuous Deployment

La Continuous Deployment viene gestita da:

```text
.github/workflows/cd.yml
```

La pipeline CD non parte direttamente ad ogni push.

Viene avviata soltanto dopo il completamento della pipeline CI e procede esclusivamente se:

```text
CI = success
branch = main
```

Questo impedisce il deploy di codice che non ha superato i controlli.

---

## Deploy backend su Render

Il backend viene distribuito tramite un Render Deploy Hook.

L'URL del Deploy Hook è memorizzato nel GitHub Secret:

```text
RENDER_DEPLOY_HOOK_URL
```

La pipeline utilizza lo SHA del commit validato dalla CI per avviare il deploy.

---

## Deploy frontend su Netlify

Il frontend viene:

1. recuperato dal commit che ha superato la CI;
2. compilato tramite Vite;
3. configurato con `VITE_API_URL`;
4. distribuito tramite Netlify CLI.

La pipeline utilizza:

```text
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

senza esporre i relativi valori nei log.

---

# Flusso CI/CD completo

```text
Developer
   |
   | git push main
   v
GitHub
   |
   v
CI
   |
   +--> npm ci
   +--> frontend lint
   +--> frontend build
   +--> backend build
   +--> Docker frontend build
   +--> Docker backend build
   |
   | SUCCESS
   v
CD
   |
   +--------------------------+
   |                          |
   v                          v
Render Deploy Hook       Netlify CLI
   |                          |
   v                          v
Backend Production       Frontend Production
```

Gli auto-deploy nativi di Netlify e Render sono disabilitati.

GitHub Actions rappresenta quindi l'unico punto di controllo del processo di rilascio.

---

# Monitoraggio

Il progetto prevede due livelli di monitoraggio.

## Uptime monitoring

Verrà utilizzato UptimeRobot per monitorare la disponibilità dell'applicazione pubblica.

Monitor previsti:

```text
Frontend:
https://lookbook-smart-pricing-ai.netlify.app

Backend:
https://lookbook-smart-pricing-ai-backend.onrender.com
```

Gli alert permetteranno di identificare eventuali periodi di indisponibilità dell'applicazione.

> Configurazione in corso.

---

## Error tracking

Sentry verrà integrato nel progetto per raccogliere errori applicativi e informazioni utili al debugging.

Durante il test verrà generato intenzionalmente almeno un errore per verificare:

- ricezione dell'evento;
- stack trace;
- ambiente;
- timestamp;
- informazioni utili alla diagnosi.

> Configurazione in corso.

---

# Gestione degli errori

L'applicazione distingue differenti tipologie di errore:

- validazione dell'immagine;
- dimensione o formato file non valido;
- errore OpenAI;
- errore Supabase;
- errore di comunicazione frontend/backend.

Durante i test Docker è stata inoltre verificata la gestione di un'indisponibilità temporanea di Supabase.

In quel caso il backend ha restituito:

```text
503 Service Unavailable
```

e l'interfaccia ha mostrato un messaggio comprensibile all'utente.

---

# Comandi principali

## Installazione frontend

```bash
cd frontend
npm ci
```

## Lint frontend

```bash
npm run lint
```

## Build frontend

```bash
npm run build
```

## Installazione backend

```bash
cd backend
npm ci
```

## Build backend

```bash
npm run build
```

## Avvio completo con Docker

Dalla root del repository:

```bash
docker compose up --build
```

## Arresto Docker Compose

```bash
docker compose down
```

## Log backend Docker Compose

```bash
docker compose logs backend
```

---

# Scelte progettuali DevOps

## GitHub Actions

È stato scelto GitHub Actions perché il codice sorgente è già ospitato su GitHub.

Questo permette di mantenere nello stesso ecosistema:

- repository;
- Pull Request;
- CI;
- CD;
- secrets;
- log delle pipeline.

---
