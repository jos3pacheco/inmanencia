(function () {
  var S = window.SITE;
  var W = window.WORKS;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function img(w) { return "img/" + w.slug + ".jpg"; }
  function workUrl(w) { return "obra.html?o=" + w.slug; }
  function money(n) { return "$" + n.toLocaleString("en-US"); }

  function waLink(w) {
    var text = 'Hola, estoy interesado en esta pieza: "' + w.title + '"';
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }

  function waGeneral() {
    var text = "Hola, me gustaría recibir más información sobre INMANENCIA.";
    return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(text);
  }

  var WA_ICON =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z"/></svg>';

  var SEAL_ICON =
    '<svg class="coa-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M9.5 9l1.7 1.7L14.5 7.4"/><path d="M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>';

  window.INM = { W: W, S: S, esc: esc, img: img, workUrl: workUrl, money: money, waLink: waLink, WA_ICON: WA_ICON };

  /* ---------- header & footer ---------- */
  var page = document.body.getAttribute("data-page") || "";
  var links = [
    ["inicio", "index.html", "Inicio"],
    ["galeria", "galeria.html", "Galería"],
    ["sobre", "sobre.html", "Sobre el artista"],
  ];

  var nav = links
    .map(function (l) {
      var cur = l[0] === page || (page === "obra" && l[0] === "galeria");
      return '<a href="' + l[1] + '"' + (cur ? ' aria-current="page"' : "") + ">" + l[2] + "</a>";
    })
    .join("");

  var header = document.getElementById("site-header");
  if (header) {
    header.innerHTML =
      '<div class="bar">' +
      '<a class="brand" href="index.html">INMANENCIA</a>' +
      '<nav class="nav" id="nav">' + nav + "</nav>" +
      '<a class="btn btn-sm nav-cta" href="' + waGeneral() + '" target="_blank" rel="noopener">Contacto</a>' +
      '<button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span></button>' +
      "</div>";
    var burger = document.getElementById("burger");
    burger.addEventListener("click", function () {
      var open = header.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML =
      '<div class="wrap foot">' +
      '<div><p class="brand">INMANENCIA</p><p class="muted">“' + esc(S.motto) + '”</p></div>' +
      '<div class="foot-links">' +
      '<a href="galeria.html">Galería</a>' +
      '<a href="sobre.html">Sobre el artista</a>' +
      '<a href="' + S.website + '" target="_blank" rel="noopener">sambondsphoto.com</a>' +
      '<a href="' + S.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="' + waGeneral() + '" target="_blank" rel="noopener">WhatsApp ' + S.whatsappLabel + "</a>" +
      "</div>" +
      '<p class="label muted">© ' + new Date().getFullYear() + " " + esc(S.artist) + ". Todos los derechos reservados.</p>" +
      "</div>";
  }

  /* ---------- cards ---------- */
  function card(w, i) {
    return (
      '<a class="card" href="' + workUrl(w) + '">' +
      '<span class="card-frame"><img src="' + img(w) + '" alt="' + esc(w.title) + '" loading="lazy"></span>' +
      '<span class="card-info"><span class="card-title">' + esc(w.title) + "</span>" +
      '<span class="label muted">' + esc(w.size) + " · " + money(w.price) + "</span></span>" +
      "</a>"
    );
  }

  var grid = document.getElementById("grid");
  if (grid) grid.innerHTML = W.map(card).join("");

  var featured = document.getElementById("featured");
  if (featured) {
    var pick = ["cuerpo-proyectado", "reverberacion", "el-balletista", "linea-de-vida", "silencio-con-forma", "animal-de-sombra"];
    featured.innerHTML = pick
      .map(function (s) { return W.filter(function (w) { return w.slug === s; })[0]; })
      .map(card)
      .join("");
  }

  /* ---------- obra detail ---------- */
  var detail = document.getElementById("detail");
  if (detail) {
    var slug = new URLSearchParams(location.search).get("o");
    var idx = -1;
    W.forEach(function (w, i) { if (w.slug === slug) idx = i; });
    if (idx < 0) {
      detail.innerHTML =
        '<div class="wrap narrow center"><h1 class="h2">Obra no encontrada</h1><p class="muted">La pieza que buscas no existe.</p><a class="btn" href="galeria.html">Ver la galería</a></div>';
    } else {
      var w = W[idx];
      var prev = W[(idx - 1 + W.length) % W.length];
      var next = W[(idx + 1) % W.length];
      document.title = w.title + " — INMANENCIA · Samuel Bonds";
      detail.innerHTML =
        '<div class="wrap detail-grid">' +
        '<figure class="detail-img"><img src="' + img(w) + '" alt="' + esc(w.title) + '"></figure>' +
        '<div class="detail-info">' +
        '<p class="label muted">Obra ' + String(idx + 1).padStart(2, "0") + " / " + W.length + "</p>" +
        '<h1 class="h1">' + esc(w.title) + "</h1>" +
        '<p class="muted">Fotografía · ' + esc(S.artist) + "</p>" +
        '<dl class="specs">' +
        "<div><dt class=\"label muted\">Medidas</dt><dd>" + esc(w.size) + "</dd></div>" +
        "<div><dt class=\"label muted\">Precio</dt><dd>" + money(w.price) + "</dd></div>" +
        "</dl>" +
        '<div class="coa">' + SEAL_ICON +
        "<p>Cada obra se entrega acompañada de una <strong>Carta de Autenticidad</strong> firmada por el artista, que certifica su autenticidad y su carácter de pieza única.</p>" +
        "</div>" +
        '<a class="btn" href="' + waLink(w) + '" target="_blank" rel="noopener">' + WA_ICON + " Consultar por WhatsApp</a>" +
        '<p class="label muted note">Se abrirá WhatsApp con un mensaje listo para enviar.</p>' +
        '<div class="pager">' +
        '<a href="' + workUrl(prev) + '"><span class="label muted">← Anterior</span><span>' + esc(prev.title) + "</span></a>" +
        '<a href="' + workUrl(next) + '" class="right"><span class="label muted">Siguiente →</span><span>' + esc(next.title) + "</span></a>" +
        "</div></div></div>";
    }
  }

  /* ---------- generic whatsapp links ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-wa-general]"), function (a) {
    a.href = waGeneral();
  });
})();
