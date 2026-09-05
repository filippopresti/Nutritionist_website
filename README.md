# Sito — Dott.ssa Valentina Sanzeni, Biologa Nutrizionista

Sito statico in HTML, JavaScript e Tailwind CSS. Nessun framework, nessuna build
obbligatoria: si può aprire in un browser o caricare su qualsiasi hosting statico.

---

## Struttura

```
sito-valentina-sanzeni/
├── index.html         Homepage
├── su-di-me.html      Su di me
├── servizi.html       Servizi
├── info.html          Info: prima visita, controlli, documenti, modulo di prenotazione
├── contatti.html      Contatti, mappa, dati professionali
├── privacy.html       Privacy Policy
├── cookie.html        Cookie Policy
├── termini.html       Termini e Condizioni
└── assets/
    ├── css/site.css   Solo ciò che Tailwind non copre (tipografia legale, animazioni)
    ├── js/config.js   ⇦ UNICO file da modificare per contatti, indirizzo, social, foto
    ├── js/tw.js       Design token di Tailwind (colori, font, ombre)
    ├── js/main.js     Header, footer, banner cookie, menu mobile, modulo, mappa
    └── img/           Fotografie (vuota: le foto sono opzionali)
```

Header, footer e banner cookie sono **componenti JavaScript** definiti in
`assets/js/main.js` e montati in ogni pagina tramite i segnaposto
`<div data-header>` e `<div data-footer>`. Modificandoli lì si aggiornano
tutte le pagine in una volta sola.

## Avvio in locale

```bash
python3 -m http.server 8811 --directory sito-valentina-sanzeni
```

Poi apri <http://localhost:8811>.

---

## Cosa va completato prima della pubblicazione

### 1. `assets/js/config.js`

| Voce | Stato |
| --- | --- |
| Telefono, email, WhatsApp | ✅ già inseriti (dal brief) |
| Partita IVA | ✅ già inserita |
| **Indirizzo dello studio** | ❌ **da inserire** — ora è `Via da definire, 00` |
| `studio.mapsQuery` | ❌ da aggiornare con l'indirizzo reale (usato da mappa e pulsante Maps) |
| `studio.orari` | ⚠️ testo generico, da confermare |
| Link social (Facebook, Instagram, LinkedIn) | ❌ da inserire — finché sono vuoti le icone non compaiono |
| Foto della dott.ssa (homepage + Su di me) | ✅ inserita e collegata |
| `immagini.hero` (sfondo homepage) | ❌ opzionale — ora sfondo decorativo |

### 2. Fotografie

Le foto sono **facoltative**: se non impostate, il sito mostra sfondi decorativi
al posto loro (nessuna immagine rotta). Per aggiungerle:

1. copia i file in `assets/img/` (consigliato: JPEG, lato lungo ~1800 px, sotto i 300 KB);
2. indica il percorso in `config.js`:

```js
immagini: {
  hero: "assets/img/hero.jpg",
  ritratto: "assets/img/valentina.jpg",
  studio: "assets/img/studio.jpg",
},
```

### 3. Modulo di richiesta appuntamento — ✅ già funzionante

Il modulo nella pagina Info invia tramite **Web3Forms**, che recapita la
richiesta alla casella Gmail dello studio. Endpoint e chiave sono in `config.js`
(sezione `form`), così restano in un solo punto invece che sparsi nell'HTML.

Campi inviati: nome, cognome, email, telefono, obiettivo principale,
preferenza di contatto, messaggio, consenso privacy.

Cosa è stato aggiunto rispetto alla versione originale del modulo:

- **Prefisso internazionale corretto.** Con `separateDialCode: true` il prefisso
  sta fuori dal campo di testo, quindi il numero inviato risultava senza `+39`.
  Ora, prima dell'invio, il numero viene normalizzato in formato internazionale
  (`+393331234567`) e validato con `isValidNumber()`.
- **Anti-spam su due livelli**: il campo trappola `botcheck` nativo di Web3Forms
  e il widget **hCaptcha**, che l'utente deve completare prima di inviare. Se il
  captcha non è risolto la richiesta viene bloccata prima ancora di partire; se
  l'invio fallisce il token viene rigenerato automaticamente, così si può
  riprovare senza ricaricare la pagina.

  > ⚠️ **hCaptcha va attivato anche nelle impostazioni della chiave su
  > Web3Forms.** Se sulla chiave è disattivato, il token viene semplicemente
  > ignorato dal server e il modulo resta di fatto esposto agli spam-bot, pur
  > mostrando il widget. Le due cose vanno tenute allineate.
- **Gestione degli errori**: se l'invio fallisce compare un messaggio con
  telefono ed email alternativi, invece di un `alert()` del browser.
- **Avviso sui dati sanitari**: il modulo chiede esplicitamente di non inserire
  patologie, terapie o referti, che sono dati particolari ai sensi dell'art. 9
  GDPR e non vanno raccolti tramite un form web.

> **La chiave `accessKey` di Web3Forms è pubblica per progettazione**: sta nel
> codice della pagina ed è visibile a chiunque apra il sito. Non è una password
> e non dà accesso all'account: serve solo a indirizzare i messaggi. Chi la
> trova può però inviare messaggi attraverso il modulo. Se dovessero arrivare
> spam, si rigenera la chiave dalla dashboard di Web3Forms e si sostituisce in
> `config.js`. Per una protezione più forte, Web3Forms offre l'integrazione con
> hCaptcha.
>
> Chiavi **private**, password o token di altri servizi non vanno mai messi in
> `config.js` né in nessun altro file JavaScript.

Da valutare con il consulente privacy: Web3Forms tratta i dati dei visitatori
per conto dello studio, quindi serve un accordo di responsabile del trattamento
(DPA) — il servizio lo mette a disposizione. È già citato nella Privacy Policy.

### 4. Testi legali

`privacy.html`, `cookie.html` e `termini.html` sono **basi redazionali complete
ma generiche**. Ogni pagina contiene riquadri gialli intitolati *«Nota per il
titolare del sito»* con l'elenco dei punti da compilare (fornitore di hosting,
tempi di conservazione, condizioni di disdetta, foro competente…).

**Vanno lette e validate da un avvocato o da un consulente privacy prima della
pubblicazione, e i riquadri gialli vanno rimossi.** Il sito tratta dati
sanitari nell'ambito dell'attività professionale: non è un adempimento formale.

### 5. Cookie e contenuti di terze parti

- Il banner blocca **Google Maps** finché l'utente non dà il consenso: al suo posto
  compare un segnaposto con un pulsante «Carica la mappa». Questo è il
  comportamento corretto secondo le linee guida del Garante.
- La scelta è salvata nel `localStorage` del browser (chiave `vs-consenso-cookie`)
  e si può cambiare dal link «Preferenze cookie» nel footer.
- **Da migliorare prima della pubblicazione:** il sito carica i caratteri da
  Google Fonts e Tailwind da CDN. Entrambi comunicano l'IP del visitatore a un
  fornitore terzo. Per evitarlo:
  - scarica i font (Playfair Display, Montserrat, Parisienne) e servili dal
    proprio dominio, sostituendo il `<link>` a `fonts.googleapis.com` con un
    `@font-face` locale;
  - sostituisci il CDN di Tailwind con un CSS compilato (vedi sotto);
  - la libreria `intl-tel-input` (caricata da jsDelivr nella pagina Info) può
    essere scaricata e servita dal proprio dominio allo stesso modo.

### 6. Tailwind: dal CDN al CSS compilato

Il CDN di Tailwind (`cdn.tailwindcss.com`) è pensato per prototipi: compila gli
stili nel browser a ogni caricamento. Per la versione pubblica conviene generare
un foglio di stile statico:

```bash
npx tailwindcss -i input.css -o assets/css/tailwind.css --minify
```

con un `tailwind.config.js` che riprenda i token già presenti in
`assets/js/tw.js`. Poi si sostituiscono i due `<script>` in testa a ogni pagina
con `<link rel="stylesheet" href="assets/css/tailwind.css">`.
Il sito diventa più veloce e smette di dipendere da un dominio esterno.

---

## Prima di mettere il sito online

Il sito sarà accessibile da internet: valgono le regole interne sul deployment.
Prima di pubblicare, verifica che:

- l'hosting scelto sia un servizio approvato, con DPA/contratto in essere e non
  un account personale o un piano gratuito;
- il dominio sia servito in **HTTPS**;
- eventuali credenziali (accesso all'hosting, servizio del modulo) siano
  create appositamente per questo progetto e non riutilizzate;
- il codice sia in un repository **privato**, se destinato a essere mantenuto nel tempo;
- i riquadri gialli nelle pagine legali siano stati rimossi e i testi validati.

---

## Accessibilità e SEO — già previsti

- Struttura semantica (`header`, `main`, `nav`, `section`, `article`, `footer`),
  un solo `h1` per pagina, gerarchia dei titoli coerente.
- Focus visibile su tutti gli elementi interattivi, menu mobile chiudibile con `Esc`.
- Rispetto di `prefers-reduced-motion`: le animazioni si disattivano per chi le ha disabilitate.
- `title` e `meta description` specifici per pagina; pagine legali in `noindex`.
- Le animazioni di comparsa sono un miglioramento progressivo: senza JavaScript
  i contenuti restano visibili.

Da aggiungere quando il dominio è noto: `robots.txt`, `sitemap.xml`, tag
canonical e i dati strutturati Schema.org (`LocalBusiness` / `Nutritionist`),
utili per comparire nelle ricerche locali su Cremona.
