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
| Indirizzo dello studio | ✅ Via Giuseppina, 21 — 26100 Cremona (CR) |
| `studio.orari` | ⚠️ testo generico, da confermare |
| Link social (Facebook, Instagram, LinkedIn) | ✅ inseriti |
| Logo | ✅ marchio ufficiale, due varianti (vedi sotto) |
| Foto della dott.ssa (homepage + Su di me) | ✅ inserita e collegata |
| `immagini.hero` (sfondo homepage) | ❌ opzionale — ora sfondo decorativo |

### 2. Logo

Il marchio ufficiale è in `assets/img/`, in due varianti generate dallo stesso
file originale:

| File | Colore | Dove |
| --- | --- | --- |
| `logo.svg` | verde scuro `#0F2C23` | header, su fondo crema |
| `logo-chiaro.svg` | crema `#FBF8F3` | footer e menu mobile, su fondo verde |

Servono due file perché un SVG caricato con `<img>` non eredita il colore del
testo della pagina: il colore deve essere già dentro al file.

Rispetto all'originale ho tolto il rettangolo di sfondo (così il logo poggia
sul fondo della pagina invece che su un riquadro bianco), ritagliato la tela
sull'ingombro reale del testo — da 850×550 a 672×182, proporzioni 3,69:1 — e
ridotto la precisione delle curve a un decimale: −22% di peso, nessuna
differenza visibile nemmeno ingrandendo.

**Per sostituire il logo in futuro** basta rimpiazzare i due file mantenendo
gli stessi nomi e proporzioni simili. Se cambia molto la forma, vanno riviste
le larghezze in `main.js`, funzione `logo()`.

### 3. Fotografie

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

### 4. Modulo di richiesta appuntamento — ✅ già funzionante

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

### 5. Testi legali

Le tre pagine sono **pubblicate e internamente coerenti**: non contengono più
segnaposto né note redazionali. Dove un dato non era noto, la clausola è stata
formulata in modo veritiero e generale invece di lasciare uno spazio vuoto.

**Restano comunque da validare da un avvocato o da un consulente privacy.** Il
sito tratta dati sanitari nell'ambito dell'attività professionale: non è un
adempimento formale.

#### Clausole da precisare quando la dott.ssa fornisce i dati

Oggi il testo rimanda genericamente a quanto comunicato «in sede di visita».
Sostituire con i valori reali migliora la trasparenza verso il paziente:

| Documento | Sezione | Da precisare |
| --- | --- | --- |
| Privacy | §7 | Termine di conservazione delle cartelle nutrizionali |
| Termini | §6 | Ore di preavviso richieste per la disdetta |
| Termini | §6 | Conseguenze della mancata presentazione senza preavviso |
| Termini | §7 | Modalità di pagamento accettate |

Non sono invece rimasti buchi: il foro competente segue la regola di legge del
consumatore, e l'hosting è indicato (GitHub, Inc. — GitHub Pages).

### 6. Cookie e contenuti di terze parti

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

### 7. Tailwind: dal CDN al CSS compilato

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

---

## Cache degli asset (`?v=`)

CSS e JavaScript sono richiamati con un numero di versione:

```html
<script src="assets/js/main.js?v=20260905"></script>
```

Serve perché GitHub Pages e i browser mettono in cache gli asset a lungo: senza
questo parametro, chi ha già visitato il sito continuerebbe a usare la versione
vecchia di `main.js` anche dopo un aggiornamento, e vedrebbe il sito rotto o
con i vecchi contenuti.

**Dopo ogni modifica a `main.js`, `config.js`, `tw.js` o `site.css`, cambia il
numero in tutte le pagine.** In una riga:

```bash
cd ~/Desktop/sito-valentina-sanzeni && sed -i '' "s/?v=[0-9]\{8\}/?v=$(date +%Y%m%d)/g" *.html
```

Le immagini non hanno il parametro: quando cambiano, di norma cambia anche il
nome del file.
