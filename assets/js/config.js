/* =============================================================
   config.js — unico punto di configurazione del sito.
   Modifica SOLO questo file per aggiornare contatti, indirizzo,
   social e endpoint del modulo. Nessuna credenziale va qui:
   l'endpoint del form è un URL pubblico fornito dal servizio.
   ============================================================= */

window.SITE = {
  nome: "Dott.ssa Valentina Sanzeni",
  ruolo: "Biologa Nutrizionista",
  citta: "Cremona",
  albo: "Ordine Nazionale dei Biologi — Sez. A, rif. albo AA_101170",
  piva: "01850000199",

  contatti: {
    telefono: "344 6369631",
    telefonoIntl: "+393446369631",   // usato per tel: e WhatsApp
    email: "valentinasanzeni.nutrizionista@gmail.com",
    whatsappMessaggio: "Buongiorno Dott.ssa Sanzeni, vorrei informazioni per una visita nutrizionale.",
  },

  studio: {
    nome: "Studio di Nutrizione",
    via: "Via Giuseppina, 21",
    cap: "26100",
    citta: "Cremona",
    provincia: "CR",
    // Usata dalla mappa e dal pulsante "Apri in Google Maps"
    mapsQuery: "Via Giuseppina, 21, 26100 Cremona CR, Italia",
    orari: "Su appuntamento, dal lunedì al venerdì",
  },

  social: {
    // Lascia la stringa vuota per nascondere l'icona corrispondente.
    facebook: "https://www.facebook.com/valentina.sanzeni/",
    instagram: "https://www.instagram.com/valentinasanzeni.nutrizionista/",
    linkedin: "https://www.linkedin.com/in/valentina-sanzeni/",
  },

  /* Fotografie. Metti i file in assets/img/ e indica qui il percorso.
     Finché una voce resta vuota viene mostrato uno sfondo decorativo
     al posto della foto (nessun'immagine rotta, nessun errore 404). */
  immagini: {
    hero: "",                                 // sfondo della homepage (nessuna foto: resta lo sfondo decorativo)
    ritratto: "assets/img/valentina.jpg",     // homepage, sezione "Ciao! Sono la dott.ssa..."
    studio: "assets/img/valentina.jpg",       // pagina "Su di me"
  },

  form: {
    /* Il sito è statico e non può inviare email da solo: le richieste passano
       da Web3Forms, che le recapita alla casella Gmail dello studio.

       `accessKey` è la chiave pubblica di Web3Forms. È pensata per stare nel
       codice della pagina ed è quindi VISIBILE a chiunque apra il sito: non è
       una password e non dà accesso all'account, serve solo a indirizzare i
       messaggi alla casella giusta. Chi la trova può però inviare messaggi
       attraverso il modulo: se dovessero arrivare spam, la chiave si rigenera
       dalla dashboard di Web3Forms e si sostituisce qui.

       QUI NON VANNO MAI chiavi private, password o token di altri servizi. */
    endpoint: "https://api.web3forms.com/submit",
    accessKey: "ad17b918-e076-4cbd-a1e8-d76feafced43",

    // Oggetto dell'email che arriva nella casella dello studio
    oggetto: "Nuova richiesta di appuntamento dal sito",

    /* hCaptcha — protezione anti-spam del modulo.
       Questa è la chiave sito pubblica condivisa di Web3Forms: va nel codice
       della pagina, come per la access key. Se in futuro si apre un account
       hCaptcha proprio, si sostituisce con la propria sitekey.

       ⚠️ Perché funzioni, hCaptcha deve essere ATTIVO anche nelle impostazioni
       della chiave su Web3Forms, altrimenti il token viene semplicemente
       ignorato e il modulo resta esposto agli spam-bot. */
    hcaptchaSitekey: "50b2fe65-b00b-4b9e-ad62-3ba471098be2",

    /* Prefisso internazionale preselezionato nel campo telefono
       e paesi mostrati in cima all'elenco. */
    paesePredefinito: "it",
    paesiPreferiti: ["it", "ch", "de"],
  },

  // Anno mostrato nel footer
  get anno() { return new Date().getFullYear(); },
};

window.SITE.contatti.whatsappUrl =
  "https://wa.me/" +
  window.SITE.contatti.telefonoIntl.replace(/\D/g, "") +
  "?text=" +
  encodeURIComponent(window.SITE.contatti.whatsappMessaggio);

window.SITE.studio.indirizzoCompleto =
  window.SITE.studio.via + ", " + window.SITE.studio.cap + " " +
  window.SITE.studio.citta + " (" + window.SITE.studio.provincia + ")";
