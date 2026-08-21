/* Top Car Wash — logique du site statique (aucune dépendance hors EmailJS). */
(function () {
  "use strict";

  var DATA = window.TCW_DATA;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (n) { return Math.round(n) + " €"; };

  var state = {
    vehicle: "citadine",
    washType: "interieur",
    addons: {},
    date: "",
    time: "",
    promoApplied: null,
    contactPref: "email",
    marketing: false,
    sending: false
  };

  function washesFor(vid) {
    if (vid === "moto") return DATA.motoWashes.slice();
    var supp = DATA.supplements[vid] || 0;
    return DATA.washes.map(function (w) {
      return { id: w.id, name: w.name, price: w.price + supp };
    });
  }

  function currentWash() {
    var list = washesFor(state.vehicle);
    var found = list.filter(function (w) { return w.id === state.washType; })[0];
    return found || list[0];
  }

  function addonSum() {
    return DATA.addons.reduce(function (t, a) {
      return t + (state.addons[a.id] ? a.price : 0);
    }, 0);
  }

  function calc() {
    var w = currentWash();
    var extras = addonSum();
    var subtotal = (w ? w.price : 0) + extras;
    var rate = state.promoApplied ? (DATA.promos[state.promoApplied] || 0) : 0;
    var discount = Math.round(extras * rate);
    return { wash: w, subtotal: subtotal, discount: discount, total: subtotal - discount };
  }

  function frDate() {
    if (!state.date) return "";
    try {
      return new Date(state.date + "T00:00:00").toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
    } catch (e) { return state.date; }
  }

  /* ---------- étape 2 : formules dépendant du véhicule ---------- */
  var washesEl = $("#washes");

  function renderWashes() {
    var list = washesFor(state.vehicle);
    if (!list.some(function (w) { return w.id === state.washType; })) state.washType = list[0].id;
    washesEl.innerHTML = list.map(function (w) {
      return '<button class="opt opt--wash' + (w.id === state.washType ? " is-selected" : "") +
        '" type="button" data-wash="' + w.id + '" aria-pressed="' + (w.id === state.washType) + '">' +
        '<span class="opt__name">' + w.name + "</span>" +
        '<span class="opt__price">' + money(w.price) + "</span></button>";
    }).join("");
  }

  washesEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-wash]");
    if (!btn) return;
    state.washType = btn.getAttribute("data-wash");
    renderWashes();
    refresh();
  });

  /* ---------- étape 1 : véhicule ---------- */
  $("#vehicles").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-vehicle]");
    if (!btn) return;
    state.vehicle = btn.getAttribute("data-vehicle");
    $$("#vehicles [data-vehicle]").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", String(on));
    });
    renderWashes();
    refresh();
  });

  /* ---------- étape 3 : options ---------- */
  $("#addons").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-addon]");
    if (!btn) return;
    var id = btn.getAttribute("data-addon");
    state.addons[id] = !state.addons[id];
    btn.classList.toggle("is-selected", !!state.addons[id]);
    btn.setAttribute("aria-pressed", String(!!state.addons[id]));
    refresh();
  });

  /* ---------- étape 4 : date & heure ---------- */
  var dateEl = $("#date");
  var timeEl = $("#time");
  dateEl.min = new Date().toISOString().slice(0, 10);
  dateEl.addEventListener("change", function () { state.date = dateEl.value; refresh(); });
  timeEl.addEventListener("change", function () { state.time = timeEl.value; refresh(); });

  /* ---------- étape 5 : coordonnées ---------- */
  var emailEl = $("#email");
  var phoneEl = $("#phone");
  emailEl.addEventListener("input", refresh);
  phoneEl.addEventListener("input", refresh);

  $("#prefs").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-pref]");
    if (!btn) return;
    state.contactPref = btn.getAttribute("data-pref");
    $$("#prefs [data-pref]").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", String(on));
    });
  });

  var marketingEl = $("#marketing");
  marketingEl.addEventListener("click", function () {
    state.marketing = !state.marketing;
    marketingEl.classList.toggle("is-checked", state.marketing);
    marketingEl.setAttribute("aria-pressed", String(state.marketing));
  });

  /* ---------- étape 6 : code promo ---------- */
  var promoEl = $("#promo");
  var promoMsg = $("#promo-msg");

  $("#promo-apply").addEventListener("click", function () {
    var code = (promoEl.value || "").trim().toUpperCase();
    promoMsg.hidden = false;
    if (!code) {
      state.promoApplied = null;
      promoMsg.hidden = true;
    } else if (DATA.promos[code] != null) {
      state.promoApplied = code;
      promoMsg.textContent = "Code appliqué : -" + Math.round(DATA.promos[code] * 100) + " % sur les options";
      promoMsg.className = "promo-msg is-ok";
    } else {
      state.promoApplied = null;
      promoMsg.textContent = "Code promo invalide";
      promoMsg.className = "promo-msg is-bad";
    }
    refresh();
  });

  /* ---------- totaux + validation ---------- */
  var confirmBtn = $("#confirm");
  var noteEl = $("#form-note");
  var errorEl = $("#send-error");
  var cfg = DATA.emailjs || {};
  var emailjsReady = !!(cfg.publicKey && cfg.serviceId && cfg.templateId);

  noteEl.textContent = emailjsReady
    ? "Votre demande est envoyée directement à Top Car Wash. Réponse par email ou SMS."
    : "En confirmant, votre application mail s'ouvre avec la demande pré-remplie à envoyer à " + DATA.business.email + ".";

  function isValid() {
    return /.+@.+\..+/.test(emailEl.value) &&
      (phoneEl.value || "").trim().length >= 6 &&
      !!state.date && !!state.time && !!state.washType;
  }

  function refresh() {
    var r = calc();
    $("#subtotal").textContent = money(r.subtotal);
    $("#total").textContent = money(r.total);
    var row = $("#discount-row");
    if (r.discount > 0) {
      row.hidden = false;
      $("#promo-name").textContent = state.promoApplied;
      $("#discount").textContent = "-" + money(r.discount);
    } else {
      row.hidden = true;
    }
    var ok = isValid();
    confirmBtn.disabled = !ok || state.sending;
    confirmBtn.textContent = state.sending
      ? "Envoi en cours…"
      : (ok ? "Confirmer le rendez-vous" : "Complétez votre demande");
  }

  /* ---------- envoi ---------- */
  function buildMessage() {
    var r = calc();
    var chosen = DATA.addons.filter(function (a) { return state.addons[a.id]; });
    var vehName = (DATA.vehicles.filter(function (v) { return v.id === state.vehicle; })[0] || {}).name || "—";
    var lines = [
      "Type de véhicule : " + vehName,
      "Type de lavage : " + r.wash.name + " (" + money(r.wash.price) + ")",
      "Options : " + (chosen.length
        ? chosen.map(function (a) { return a.name + " (+" + money(a.price) + ")"; }).join(", ")
        : "Aucune"),
      "Date : " + frDate(),
      "Heure : " + state.time,
      "Sous-total : " + money(r.subtotal)
    ];
    if (state.promoApplied && r.discount > 0) {
      lines.push("Code promo : " + state.promoApplied + " (-" + money(r.discount) + ")");
    }
    lines.push("Total : " + money(r.total));
    var contact = [
      "Email : " + emailEl.value,
      "Téléphone : " + phoneEl.value,
      "Préférence de contact : " + (state.contactPref === "sms" ? "SMS" : "Email"),
      "Consentement communications marketing : " + (state.marketing ? "Oui" : "Non")
    ];
    return "Bonjour,\n\nJe souhaite prendre rendez-vous pour un lavage :\n\n" +
      lines.join("\n") + "\n\nMes coordonnées :\n" + contact.join("\n") +
      "\n\nMerci de me confirmer le créneau ou de me proposer un autre horaire.\n";
  }

  function renderSummary() {
    var r = calc();
    var chosen = DATA.addons.filter(function (a) { return state.addons[a.id]; });
    var vehName = (DATA.vehicles.filter(function (v) { return v.id === state.vehicle; })[0] || {}).name || "—";
    var rows = [
      ["Véhicule", vehName],
      ["Type de lavage", r.wash.name],
      ["Options", chosen.length ? chosen.map(function (a) { return a.name; }).join(", ") : "Aucune"],
      ["Date", frDate()],
      ["Heure", state.time],
      ["Contact", emailEl.value + " · " + phoneEl.value],
      ["Préférence", state.contactPref === "sms" ? "SMS" : "Email"]
    ];
    if (state.promoApplied && r.discount > 0) rows.push(["Code promo", state.promoApplied]);
    rows.push(["Total", money(r.total)]);
    $("#summary").innerHTML = rows.map(function (p) {
      return '<div class="summary__row"><dt>' + p[0] + "</dt><dd>" + p[1] + "</dd></div>";
    }).join("");
  }

  function showConfirmation() {
    renderSummary();
    $("#booking").hidden = true;
    $("#confirmation").hidden = false;
  }

  $("#booking").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!isValid() || state.sending) return;
    if ($("#honeypot").value) return; // robot
    errorEl.hidden = true;

    var subject = "Demande de rendez-vous — Top Car Wash";
    var body = buildMessage();

    if (emailjsReady && window.emailjs) {
      state.sending = true;
      refresh();
      window.emailjs.send(cfg.serviceId, cfg.templateId, {
        to_email: DATA.business.email,
        reply_to: emailEl.value,
        from_name: emailEl.value,
        phone: phoneEl.value,
        contact_pref: state.contactPref === "sms" ? "SMS" : "Email",
        marketing: state.marketing ? "Oui" : "Non",
        subject: subject,
        message: body
      }, { publicKey: cfg.publicKey }).then(function () {
        state.sending = false;
        refresh();
        showConfirmation();
      }).catch(function () {
        state.sending = false;
        refresh();
        errorEl.textContent = "L'envoi a échoué. Appelez-nous au " + DATA.business.phone + " ou réessayez.";
        errorEl.hidden = false;
      });
      return;
    }

    window.location.href = "mailto:" + DATA.business.email +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    showConfirmation();
  });

  $("#reset").addEventListener("click", function () {
    state.addons = {};
    state.date = ""; state.time = ""; state.promoApplied = null;
    state.contactPref = "email"; state.marketing = false;
    state.vehicle = "citadine"; state.washType = "interieur";
    dateEl.value = ""; timeEl.value = ""; promoEl.value = "";
    emailEl.value = ""; phoneEl.value = "";
    promoMsg.hidden = true;
    marketingEl.classList.remove("is-checked");
    marketingEl.setAttribute("aria-pressed", "false");
    $$("#addons [data-addon]").forEach(function (b) {
      b.classList.remove("is-selected");
      b.setAttribute("aria-pressed", "false");
    });
    $$("#vehicles [data-vehicle]").forEach(function (b) {
      var on = b.getAttribute("data-vehicle") === "citadine";
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", String(on));
    });
    $$("#prefs [data-pref]").forEach(function (b) {
      var on = b.getAttribute("data-pref") === "email";
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", String(on));
    });
    renderWashes();
    refresh();
    $("#confirmation").hidden = true;
    $("#booking").hidden = false;
  });

  /* ---------- galerie avant / après ---------- */
  var compare = $("#compare");
  var range = $("#compare-range");
  range.addEventListener("input", function () {
    compare.style.setProperty("--reveal", range.value + "%");
  });

  $("#cats").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cat]");
    if (!btn) return;
    var id = btn.getAttribute("data-cat");
    $$("#cats [data-cat]").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });
    $$(".compare__pane").forEach(function (p) {
      p.classList.toggle("is-active", p.getAttribute("data-cat") === id);
    });
  });

  /* ---------- fenêtre pro ---------- */
  var proModal = $("#pro-modal");
  $$("[data-pro-open]").forEach(function (b) {
    b.addEventListener("click", function () { proModal.hidden = false; });
  });
  $$("[data-pro-close]").forEach(function (b) {
    b.addEventListener("click", function () { proModal.hidden = true; });
  });
  proModal.addEventListener("click", function (e) {
    if (e.target === proModal) proModal.hidden = true;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") proModal.hidden = true;
  });

  /* ---------- bannière cookies ---------- */
  var cookies = $("#cookies");
  var KEY = "tcw-cookie-consent";
  try {
    if (!localStorage.getItem(KEY)) cookies.hidden = false;
  } catch (e) { cookies.hidden = false; }

  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    cookies.hidden = true;
  }
  $("#cookies-accept").addEventListener("click", function () { setConsent("accepted"); });
  $("#cookies-refuse").addEventListener("click", function () { setConsent("refused"); });

  /* ---------- init ---------- */
  renderWashes();
  refresh();
})();
