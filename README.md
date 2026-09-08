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