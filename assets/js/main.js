/* =============================================================
   main.js — componenti condivisi e comportamenti del sito.
   Nessuna dipendenza esterna. Tutto il markup usa classi Tailwind.
   ============================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var S = window.SITE;
  var CONSENSO_KEY = "vs-consenso-cookie"; // "accettati" | "essenziali"

  /* ---------------------------------------------------------------
     Utility
     --------------------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var PAGINE = [
    { href: "index.html",    label: "Home" },
    { href: "su-di-me.html", label: "Su di me" },
    { href: "servizi.html",  label: "Servizi" },
    { href: "info.html",     label: "Info" },
    { href: "contatti.html", label: "Contatti" },
  ];

  function paginaCorrente() {
    var f = location.pathname.split("/").pop();
    return !f || f === "" ? "index.html" : f;
  }

  /* ---------------------------------------------------------------
     Icone (SVG inline, nessuna richiesta di rete)
     --------------------------------------------------------------- */
  var ICONE = {
    telefono:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-full w-full">' +
      '<path d="M6.6 3h3l1.5 4.2-2 1.4a12.6 12.6 0 0 0 6.3 6.3l1.4-2L21 14.4v3a2.6 2.6 0 0 1-2.9 2.6A17.6 17.6 0 0 1 4 5.9 2.6 2.6 0 0 1 6.6 3Z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-full w-full">' +
      '<rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>',
    whatsapp:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-full w-full">' +
      '<path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.53 3.76 1.45 5.32L2 22.5l5.48-1.6a9.8 9.8 0 0 0 4.56 1.13h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.48 2 12.04 2Zm0 17.86h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.9.83-3.02-.2-.31a8.15 8.15 0 0 1-1.25-4.36c0-4.51 3.68-8.18 8.2-8.18a8.14 8.14 0 0 1 8.19 8.19c0 4.51-3.67 8.1-8.19 8.1Zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.08-.39-.12-.55.13-.17.24-.64.79-.78.95-.14.17-.29.19-.53.07-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.13-.14.17-.24.25-.41.09-.16.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.02s.86 2.34.98 2.5c.12.17 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.19 1.1.16 1.52.1.46-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.46-.29Z"/></svg>',
    posizione:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="h-full w-full">' +
      '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
    instagram:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="h-full w-full">' +
      '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    facebook:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-full w-full">' +
      '<path d="M14 8.5V6.9c0-.8.2-1.2 1.3-1.2H17V2.6h-2.6C11.2 2.6 10 4 10 6.6v1.9H8v3.1h2V21h4v-9.4h2.7l.3-3.1H14Z"/></svg>',
    linkedin:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-full w-full">' +
      '<path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05a4.2 4.2 0 0 1 3.78-2.08c4.04 0 4.79 2.66 4.79 6.12V21h-4v-4.94c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.28-1.9 2.61V21h-4V9.75Z"/></svg>',
  };

  /* ---------------------------------------------------------------
     Componente: logo

     Marchio ufficiale (testo vettorializzato). Due file, uno per fondo
     chiaro e uno per fondo scuro: un SVG caricato via <img> non eredita
     il colore del testo, quindi serve la variante gia' colorata.
     --------------------------------------------------------------- */
  function logo(scuro, classi) {
    var file = scuro ? "assets/img/logo-chiaro.svg" : "assets/img/logo.svg";
    return (
      '<a href="index.html" class="block shrink-0 transition-opacity hover:opacity-80" aria-label="' +
      esc(S.nome) + ' \u2014 torna alla home">' +
      '<img src="' + file + '" width="672" height="182" ' +
      'alt="' + esc(S.nome) + ', ' + esc(S.ruolo) + '" ' +
      'class="h-auto ' + (classi || "w-44 sm:w-52") + '">' +
      "</a>"
    );
  }

  /* ---------------------------------------------------------------
     Componente: header
     --------------------------------------------------------------- */
  function header() {
    var corrente = paginaCorrente();

    var linkDesktop = PAGINE.slice(0, 4).map(function (p) {
      var attivo = p.href === corrente;
      return (
        '<a href="' + p.href + '" ' + (attivo ? 'aria-current="page" ' : "") +
        'class="relative py-2 text-sm font-medium transition-colors ' +
        (attivo ? "text-verde-700" : "text-grigio hover:text-verde-700") +
        '">' + esc(p.label) +
        '<span class="absolute inset-x-0 -bottom-0.5 h-px origin-left bg-ocra transition-transform duration-300 ' +
        (attivo ? "scale-x-100" : "scale-x-0") + '"></span></a>'
      );
    }).join("");

    return (
      '<header class="sticky top-0 z-50 border-b border-verde-100/70 bg-crema/90 backdrop-blur-md">' +
      '<div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">' +
      logo(false) +
      '<nav class="hidden items-center gap-9 md:flex" aria-label="Navigazione principale">' +
      linkDesktop +
      '<a href="contatti.html" class="rounded-full bg-verde-700 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-verde-800 hover:shadow-lift">Contattami</a>' +
      "</nav>" +
      '<button type="button" id="apri-menu" class="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-verde-800 md:hidden" aria-label="Apri il menu" aria-expanded="false" aria-controls="menu-mobile">' +
      '<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>' +
      "</button></div></header>"
    );
  }

  /* ---------------------------------------------------------------
     Componente: pannello del menu mobile

     Va montato come figlio diretto di <body>, MAI dentro <header>:
     l'header usa `backdrop-blur`, e una proprieta' di filtro crea un
     "containing block" per i discendenti in position:fixed. Dentro
     l'header, `inset-0` si calcolerebbe sui suoi 80px di altezza
     invece che sullo schermo, e il pannello coprirebbe solo la fascia
     superiore lasciando intravedere la pagina sotto.
     --------------------------------------------------------------- */
  function menuMobilePannello() {
    var corrente = paginaCorrente();

    var linkMobile = PAGINE.map(function (p, i) {
      var attivo = p.href === corrente;
      return (
        '<a href="' + p.href + '" ' + (attivo ? 'aria-current="page" ' : "") +
        'class="border-b border-verde-800/40 py-4 font-display text-2xl ' +
        (attivo ? "text-ocra-light" : "text-white/90 hover:text-ocra-light") +
        '" style="transition-delay:' + (i * 45) + 'ms">' + esc(p.label) + "</a>"
      );
    }).join("");

    return (
      '<div id="menu-mobile" class="invisible fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-verde-900 opacity-0 transition-all duration-300 md:hidden" role="dialog" aria-modal="true" aria-label="Menu di navigazione">' +
      '<div class="flex h-20 shrink-0 items-center justify-between px-5">' + logo(true, "w-40") +
      '<button type="button" id="chiudi-menu" class="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-white" aria-label="Chiudi il menu">' +
      '<svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>' +
      "</button></div>" +
      '<nav class="flex flex-1 flex-col px-5 pb-10 pt-4" aria-label="Navigazione mobile">' + linkMobile +
      '<a href="' + S.contatti.whatsappUrl + '" target="_blank" rel="noopener" class="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-ocra px-6 py-3.5 font-semibold text-verde-950">' +
      '<span class="h-5 w-5">' + ICONE.whatsapp + "</span>Scrivimi su WhatsApp</a>" +
      "</nav></div>"
    );
  }

  /* ---------------------------------------------------------------
     Componente: footer
     --------------------------------------------------------------- */
  function footer() {
    var social = [
      ["instagram", S.social.instagram, "Instagram"],
      ["facebook", S.social.facebook, "Facebook"],
      ["linkedin", S.social.linkedin, "LinkedIn"],
    ].filter(function (s) { return s[1]; })
     .map(function (s) {
        return (
          '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener" aria-label="' + s[2] +
          '" class="flex h-10 w-10 items-center justify-center rounded-full border border-verde-700 p-2.5 text-verde-200 transition hover:border-ocra hover:text-ocra-light">' +
          ICONE[s[0]] + "</a>"
        );
     }).join("");

    var linkUtili = PAGINE.map(function (p) {
      return '<li><a href="' + p.href + '" class="text-verde-200/85 transition hover:text-ocra-light">' + esc(p.label) + "</a></li>";
    }).join("");

    return (
      '<footer class="bg-verde-900 text-verde-100">' +
      '<div class="mx-auto max-w-6xl px-5 py-16 sm:px-8">' +
      '<div class="grid gap-12 md:grid-cols-3">' +

      "<div>" + logo(true, "w-52") +
      '<p class="mt-5 max-w-xs text-sm leading-relaxed text-verde-200/85">Percorsi nutrizionali personalizzati, costruiti sulle tue esigenze e sul tuo stile di vita.</p>' +
      (social ? '<div class="mt-6 flex gap-3">' + social + "</div>" : "") +
      "</div>" +

      '<div><h2 class="text-xs font-semibold uppercase tracking-widest2 text-ocra-light">Link utili</h2>' +
      '<ul class="mt-5 space-y-3 text-sm">' + linkUtili + "</ul></div>" +

      '<div><h2 class="text-xs font-semibold uppercase tracking-widest2 text-ocra-light">Contatti</h2>' +
      '<ul class="mt-5 space-y-3 text-sm">' +
      '<li><a href="tel:' + esc(S.contatti.telefonoIntl) + '" class="flex items-center gap-3 text-verde-200/85 transition hover:text-ocra-light"><span class="h-4 w-4 shrink-0">' + ICONE.telefono + "</span>" + esc(S.contatti.telefono) + "</a></li>" +
      '<li><a href="mailto:' + esc(S.contatti.email) + '" class="flex items-start gap-3 break-all text-verde-200/85 transition hover:text-ocra-light"><span class="mt-0.5 h-4 w-4 shrink-0">' + ICONE.mail + "</span>" + esc(S.contatti.email) + "</a></li>" +
      '<li><a href="' + S.contatti.whatsappUrl + '" target="_blank" rel="noopener" class="flex items-center gap-3 text-verde-200/85 transition hover:text-ocra-light"><span class="h-4 w-4 shrink-0">' + ICONE.whatsapp + "</span>WhatsApp</a></li>" +
      '<li class="flex items-start gap-3 text-verde-200/85"><span class="mt-0.5 h-4 w-4 shrink-0">' + ICONE.posizione + "</span>" + esc(S.studio.indirizzoCompleto) + "</li>" +
      "</ul></div></div>" +

      '<div class="mt-14 flex flex-col gap-4 border-t border-verde-800 pt-8 text-xs text-verde-200/70 sm:flex-row sm:items-center sm:justify-between">' +
      "<p>&copy; " + S.anno + " " + esc(S.nome) + " &middot; P.IVA " + esc(S.piva) + "</p>" +
      '<nav class="flex flex-wrap gap-x-6 gap-y-2" aria-label="Note legali">' +
      '<a href="privacy.html" class="transition hover:text-ocra-light">Privacy Policy</a>' +
      '<a href="cookie.html" class="transition hover:text-ocra-light">Cookie Policy</a>' +
      '<a href="termini.html" class="transition hover:text-ocra-light">Termini e Condizioni</a>' +
      '<button type="button" data-riapri-cookie class="transition hover:text-ocra-light">Preferenze cookie</button>' +
      "</nav></div></div></footer>"
    );
  }

  /* ---------------------------------------------------------------
     Componente: banner cookie
     --------------------------------------------------------------- */
  function bannerCookie() {
    return (
      '<div id="banner-cookie" class="fixed inset-x-0 bottom-0 z-[60] translate-y-full opacity-0 transition-all duration-500" role="dialog" aria-live="polite" aria-label="Preferenze cookie">' +
      '<div class="mx-auto m-4 max-w-3xl rounded-2xl border border-verde-100 bg-white p-6 shadow-lift sm:p-7">' +
      '<h2 class="font-display text-lg text-verde-900">Rispettiamo la tua privacy</h2>' +
      '<p class="mt-2 text-sm leading-relaxed text-grigio">Questo sito usa solo cookie tecnici necessari al funzionamento. Con il tuo consenso carichiamo anche la mappa di Google Maps nella pagina Contatti, che comporta il trasferimento di dati a un fornitore terzo. Puoi cambiare idea in qualsiasi momento dal link &laquo;Preferenze cookie&raquo; nel footer. Maggiori dettagli nella <a href="cookie.html" class="font-medium text-verde-700 underline underline-offset-2">Cookie Policy</a>.</p>' +
      '<div class="mt-5 flex flex-col gap-3 sm:flex-row">' +
      '<button type="button" data-consenso="accettati" class="rounded-full bg-verde-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-verde-800">Accetta tutti</button>' +
      '<button type="button" data-consenso="essenziali" class="rounded-full border border-verde-200 px-6 py-3 text-sm font-semibold text-verde-800 transition hover:bg-verde-50">Solo essenziali</button>' +
      "</div></div></div>"
    );
  }

  /* ---------------------------------------------------------------
     Montaggio dei componenti
     --------------------------------------------------------------- */
  function monta() {
    var slotHeader = document.querySelector("[data-header]");
    var slotFooter = document.querySelector("[data-footer]");
    if (slotHeader) slotHeader.outerHTML = header();
    if (slotFooter) slotFooter.outerHTML = footer();

    // Fuori dall'header, altrimenti il backdrop-blur lo intrappola (vedi sopra)
    document.body.insertAdjacentHTML("beforeend", menuMobilePannello());
    document.body.insertAdjacentHTML("beforeend", bannerCookie());

    // Segnaposto testuali riempiti da config.js
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var val = el.getAttribute("data-site").split(".").reduce(function (o, k) {
        return o == null ? o : o[k];
      }, S);
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-href]").forEach(function (el) {
      var tipo = el.getAttribute("data-href");
      if (tipo === "tel") el.href = "tel:" + S.contatti.telefonoIntl;
      else if (tipo === "mail") el.href = "mailto:" + S.contatti.email;
      else if (tipo === "whatsapp") { el.href = S.contatti.whatsappUrl; el.target = "_blank"; el.rel = "noopener"; }
      else if (tipo === "maps") {
        el.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(S.studio.mapsQuery);
        el.target = "_blank"; el.rel = "noopener";
      }
    });
  }

  /* ---------------------------------------------------------------
     Fotografie opzionali (definite in config.js)
     --------------------------------------------------------------- */
  function immagini() {
    var I = S.immagini || {};
    document.querySelectorAll("[data-foto]").forEach(function (el) {
      var url = I[el.getAttribute("data-foto")];
      if (!url) return;

      /* Lo sfondo decorativo definito nel CSS resta come strato inferiore:
         se la foto manca o tarda a caricarsi, il riquadro non resta vuoto. */
      var sotto = getComputedStyle(el).backgroundImage;
      var overlay = el.getAttribute("data-foto-overlay");
      el.style.backgroundImage =
        (overlay ? overlay + ", " : "") +
        "url('" + url + "')" +
        (sotto && sotto !== "none" ? ", " + sotto : "");

      el.classList.add("ha-foto");

      // Punto di messa a fuoco, es. data-foto-posizione="center 22%"
      var pos = el.getAttribute("data-foto-posizione");
      if (pos) el.style.backgroundPosition = pos;

      var alt = el.getAttribute("data-foto-alt");
      if (alt) { el.setAttribute("role", "img"); el.setAttribute("aria-label", alt); }
    });
  }

  /* ---------------------------------------------------------------
     Menu mobile
     --------------------------------------------------------------- */
  function menuMobile() {
    var apri = document.getElementById("apri-menu");
    var chiudi = document.getElementById("chiudi-menu");
    var pannello = document.getElementById("menu-mobile");
    if (!apri || !pannello) return;

    function set(aperto) {
      pannello.classList.toggle("invisible", !aperto);
      pannello.classList.toggle("opacity-0", !aperto);
      document.body.classList.toggle("menu-aperto", aperto);
      apri.setAttribute("aria-expanded", String(aperto));
      if (aperto) chiudi.focus(); else apri.focus();
    }
    apri.addEventListener("click", function () { set(true); });
    chiudi.addEventListener("click", function () { set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !pannello.classList.contains("invisible")) set(false);
    });
  }

  /* ---------------------------------------------------------------
     Rivelazione al scroll
     --------------------------------------------------------------- */
  function reveal() {
    var elementi = document.querySelectorAll(".reveal");
    if (!elementi.length) return;
    if (!("IntersectionObserver" in window)) {
      elementi.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var obs = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (v.isIntersecting) { v.target.classList.add("is-visible"); obs.unobserve(v.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    elementi.forEach(function (el) { obs.observe(el); });
  }

  /* ---------------------------------------------------------------
     Consenso cookie + mappa
     --------------------------------------------------------------- */
  function leggiConsenso() {
    try { return localStorage.getItem(CONSENSO_KEY); } catch (e) { return null; }
  }
  function scriviConsenso(v) {
    try { localStorage.setItem(CONSENSO_KEY, v); } catch (e) { /* storage non disponibile */ }
  }

  function caricaMappa() {
    var box = document.querySelector("[data-mappa]");
    if (!box || box.dataset.caricata) return;
    box.dataset.caricata = "1";
    var src = "https://www.google.com/maps?q=" + encodeURIComponent(S.studio.mapsQuery) + "&output=embed";
    box.innerHTML =
      '<iframe title="Mappa dello studio" src="' + src +
      '" class="h-full w-full border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>';
  }

  function scaricaMappa() {
    var box = document.querySelector("[data-mappa]");
    if (!box) return;
    box.innerHTML = "";
    delete box.dataset.caricata;
  }

  function cookie() {
    var banner = document.getElementById("banner-cookie");
    var scelta = leggiConsenso();

    function mostra() {
      banner.classList.remove("translate-y-full", "opacity-0");
    }
    function nascondi() {
      banner.classList.add("translate-y-full", "opacity-0");
    }

    if (!scelta) setTimeout(mostra, 900);
    if (scelta === "accettati") caricaMappa();

    banner.querySelectorAll("[data-consenso]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-consenso");
        scriviConsenso(v);
        nascondi();
        if (v === "accettati") caricaMappa(); else scaricaMappa();
        aggiornaSegnapostoMappa();
      });
    });

    document.querySelectorAll("[data-riapri-cookie]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); mostra(); });
    });

    // Pulsante "carica la mappa" dentro al segnaposto
    document.querySelectorAll("[data-accetta-mappa]").forEach(function (b) {
      b.addEventListener("click", function () {
        scriviConsenso("accettati");
        caricaMappa();
        nascondi();
        aggiornaSegnapostoMappa();
      });
    });

    aggiornaSegnapostoMappa();
  }

  function aggiornaSegnapostoMappa() {
    var seg = document.querySelector("[data-mappa-segnaposto]");
    if (seg) seg.hidden = leggiConsenso() === "accettati";
  }

  /* ---------------------------------------------------------------
     Modulo di richiesta appuntamento (Web3Forms)

     L'invio avviene via fetch verso Web3Forms, che recapita la richiesta
     alla casella di posta dello studio. La chiave pubblica e l'oggetto
     dell'email sono definiti in config.js.
     --------------------------------------------------------------- */
  var telInput = null;   // istanza di intl-tel-input, se disponibile
  var captchaId = null;  // id del widget hCaptcha, per poterlo resettare

  /* hCaptcha viene caricato in modo asincrono: lo si disegna appena la
     libreria è pronta, senza bloccare il resto della pagina. */
  function captcha() {
    var box = document.getElementById("captcha");
    if (!box || !S.form.hcaptchaSitekey) return;
    box.setAttribute("data-sitekey", S.form.hcaptchaSitekey);

    var tentativi = 0;
    (function attendi() {
      if (window.hcaptcha && typeof window.hcaptcha.render === "function") {
        try {
          captchaId = window.hcaptcha.render("captcha", {
            sitekey: S.form.hcaptchaSitekey,
            theme: "light",
          });
        } catch (e) { /* già disegnato */ }
        return;
      }
      if (++tentativi < 120) setTimeout(attendi, 100);
    })();
  }

  function resetCaptcha() {
    if (window.hcaptcha && captchaId !== null) {
      try { window.hcaptcha.reset(captchaId); } catch (e) { /* ignora */ }
    }
  }

  function campoTelefono() {
    var input = document.getElementById("telefono");
    if (!input || typeof window.intlTelInput !== "function") return;

    telInput = window.intlTelInput(input, {
      initialCountry: S.form.paesePredefinito || "it",
      preferredCountries: S.form.paesiPreferiti || ["it"],
      formatOnDisplay: true,
      separateDialCode: true,
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@18.3.0/build/js/utils.js",
    });

    // Il selettore della bandiera sostituisce il bordo sinistro del campo
    input.closest(".iti").classList.add("iti--campo-sito");
  }

  function modulo() {
    var form = document.getElementById("modulo-appuntamento");
    if (!form) return;

    var esito = document.getElementById("esito-modulo");
    var conferma = document.getElementById("modulo-inviato");
    var bottone = form.querySelector('button[type="submit"]');
    var etichetta = bottone ? bottone.textContent : "Invia";

    // Campi tecnici valorizzati da config.js, così restano in un solo posto
    var chiave = form.querySelector('input[name="access_key"]');
    var oggetto = form.querySelector('input[name="subject"]');
    if (chiave) chiave.value = S.form.accessKey || "";
    if (oggetto) oggetto.value = S.form.oggetto || "Richiesta dal sito";

    campoTelefono();
    captcha();

    function messaggio(testo, ok) {
      esito.hidden = false;
      esito.textContent = testo;
      esito.className =
        "mt-5 rounded-xl border px-4 py-3 text-sm " +
        (ok ? "border-verde-200 bg-verde-50 text-verde-800"
            : "border-ocra/40 bg-ocra-light/25 text-ocra-dark");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      esito.hidden = true;

      if (!form.reportValidity()) return;

      // Numero di telefono in formato internazionale (+39...), non solo le cifre
      var input = document.getElementById("telefono");
      if (telInput && input) {
        if (typeof telInput.isValidNumber === "function" && !telInput.isValidNumber()) {
          messaggio("Il numero di telefono non sembra valido: controlla il prefisso e le cifre.", false);
          input.focus();
          return;
        }
        input.value = telInput.getNumber() || input.value;
      }

      if (!S.form.accessKey) {
        messaggio(
          "Il modulo non è ancora configurato. Scrivimi direttamente a " +
          S.contatti.email + " oppure chiama il " + S.contatti.telefono + ".", false);
        return;
      }

      // Verifica anti-spam: hCaptcha inserisce il token in un campo del modulo
      var token = form.querySelector('[name="h-captcha-response"]');
      if (S.form.hcaptchaSitekey && (!token || !token.value)) {
        messaggio("Completa la verifica anti-spam qui sopra prima di inviare la richiesta.", false);
        var riquadro = document.getElementById("captcha");
        if (riquadro) riquadro.scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }

      bottone.disabled = true;
      bottone.textContent = "Invio in corso…";

      fetch(S.form.endpoint, { method: "POST", body: new FormData(form) })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .then(function (dati) {
          if (dati && dati.success === false) throw new Error(dati.message || "invio rifiutato");
          form.reset();
          form.hidden = true;
          conferma.hidden = false;
          conferma.setAttribute("tabindex", "-1");
          conferma.focus();
        })
        .catch(function () {
          // Il token hCaptcha è monouso: va rigenerato prima di riprovare
          resetCaptcha();
          messaggio(
            "Non è stato possibile inviare la richiesta. Puoi scrivermi direttamente a " +
            S.contatti.email + " oppure chiamare il " + S.contatti.telefono + ".", false);
        })
        .finally(function () {
          bottone.disabled = false;
          bottone.textContent = etichetta;
        });
    });
  }

  /* ---------------------------------------------------------------
     Avvio
     --------------------------------------------------------------- */
  function avvia() {
    monta();
    immagini();
    menuMobile();
    reveal();
    cookie();
    modulo();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
