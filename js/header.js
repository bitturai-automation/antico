// ==========================================================================
// ANTICO — SITE HEADER v2 (mega menus, mobile menu, search)
// Vanilla JS. Pairs with css/header.css and the markup injected on every page.
// ==========================================================================
(function () {
  "use strict";

  // ---- site-root aware URLs (pages live in /pages/..., see tools/layout.py) ----
  var ROOT = window.SITE_ROOT || "";
  var APPS = ["chemical-processing", "pharmaceutical", "petrochemical", "fertilizer", "specialty-chemicals", "process-manufacturing"];
  var PAGES = ["about", "contact", "blog", "privacy-policy", "terms-conditions"];
  function U(u) {
    var m = /^([^#?]*)([#?].*)?$/.exec(u), b = m[1], t = m[2] || "", p;
    if (b === "index.html") return ROOT + b + t;
    if (b === "products.html") return ROOT + "pages/products/index.html" + t;
    if ((p = /^product-(.+)\.html$/.exec(b))) return ROOT + "pages/products/" + p[1] + ".html" + t;
    p = b.replace(/\.html$/, "");
    if (/\.html$/.test(b) && APPS.indexOf(p) > -1) return ROOT + "pages/applications/" + b + t;
    if (/\.html$/.test(b) && PAGES.indexOf(p) > -1) return ROOT + "pages/" + b + t;
    return ROOT + u;
  }
  // [title, subtitle, url, type, image, keywords]
  var INDEX = [["PTFE Lined Spool Pipe","Pipes","product-spool-pipe.html","product","images/products/spool-pipe.png","ptfe pfa fep lined"],["PTFE Lined Jacketed Spool Pipe","Pipes","product-jacketed-spool-pipe.html","product","images/products/jacketed-spool-pipe.png","ptfe pfa fep lined"],["PTFE Lined Elbow 90°","Fittings","product-elbow-90.html","product","images/products/elbow-90.png","ptfe pfa fep lined"],["PTFE Lined Elbow 45°","Fittings","product-elbow-45.html","product","images/products/elbow-45.png","ptfe pfa fep lined"],["PTFE Lined Concentric Reducer","Fittings","product-concentric-reducer.html","product","images/products/concentric-reducer.png","ptfe pfa fep lined"],["PTFE Lined Eccentric Reducer","Fittings","product-eccentric-reducer.html","product","images/products/eccentric-reducer.png","ptfe pfa fep lined"],["PTFE Lined Reducing Flange","Fittings","product-reducing-flange.html","product","images/products/reducing-flange.png","ptfe pfa fep lined"],["PTFE Lined Blind Flange","Fittings","product-blind-flange.html","product","images/products/blind-flange.png","ptfe pfa fep lined"],["PTFE Lined Equal Tee","Fittings","product-equal-tee.html","product","images/products/equal-tee.png","ptfe pfa fep lined"],["PTFE Lined Unequal Tee","Fittings","product-unequal-tee.html","product","images/products/unequal-tee.png","ptfe pfa fep lined"],["PTFE Lined Instrument Tee","Fittings","product-instrument-tee.html","product","images/products/instrument-tee.png","ptfe pfa fep lined"],["PTFE Lined Unequal Lateral Tee","Fittings","product-unequal-lateral-tee.html","product","images/products/unequal-lateral-tee.png","ptfe pfa fep lined"],["PTFE Lined Equal Lateral Tee","Fittings","product-equal-lateral-tee.html","product","images/products/equal-lateral-tee.png","ptfe pfa fep lined"],["PTFE Lined Equal Cross","Fittings","product-equal-cross.html","product","images/products/equal-cross.png","ptfe pfa fep lined"],["PTFE Lined Unequal Cross","Fittings","product-unequal-cross.html","product","images/products/unequal-cross.png","ptfe pfa fep lined"],["PTFE Moulded High Pressure Bellow","Expansion Bellows","product-moulded-bellow.html","product","images/products/moulded-bellow.png","ptfe pfa fep lined"],["PTFE Machined High Pressure Bellow","Expansion Bellows","product-machined-bellow.html","product","images/products/machined-bellow.png","ptfe pfa fep lined"],["PTFE Lined Dip Pipe","Custom Engineered Equipment","product-dip-pipe.html","product","images/products/dip-pipe.png","ptfe pfa fep lined"],["PTFE Lined Closed Dip Pipe","Custom Engineered Equipment","product-closed-dip-pipe.html","product","images/products/closed-dip-pipe.png","ptfe pfa fep lined"],["PTFE Lined Curved Dip Pipe","Custom Engineered Equipment","product-curved-dip-pipe.html","product","images/products/curved-dip-pipe.png","ptfe pfa fep lined"],["PTFE Lined Dip Pipe with Sparger","Custom Engineered Equipment","product-dip-pipe-sparger.html","product","images/products/dip-pipe-sparger.png","ptfe pfa fep lined"],["PTFE Lined Dip Leg","Custom Engineered Equipment","product-dip-leg.html","product","images/products/dip-leg.png","ptfe pfa fep lined"],["PTFE Entry Pipe","Custom Engineered Equipment","product-entry-pipe.html","product","images/products/entry-pipe.png","ptfe pfa fep lined"],["PTFE Solid & Tapered Spacer","Custom Engineered Equipment","product-solid-tapered-spacer.html","product","images/products/solid-tapered-spacer.png","ptfe pfa fep lined"],["PTFE Lined Spacer","Custom Engineered Equipment","product-lined-spacer.html","product","images/products/lined-spacer.png","ptfe pfa fep lined"],["PTFE Lined Distance Piece","Custom Engineered Equipment","product-distance-piece.html","product","images/products/distance-piece.png","ptfe pfa fep lined"],["PTFE Lined Full Face Adapter Flange","Fittings","product-full-face-adapter-flange.html","product","images/products/full-face-adapter-flange.png","ptfe pfa fep lined"],["PTFE Lined Spectacle Blind","Fittings","product-spectacle-blind.html","product","images/products/spectacle-blind.png","ptfe pfa fep lined"],["PTFE Lined Y-Type Strainer","Custom Engineered Equipment","product-y-type-strainer.html","product","images/products/y-type-strainer.png","ptfe pfa fep lined"],["PTFE Lined Hose Nipple","Custom Engineered Equipment","product-hose-nipple.html","product","images/products/hose-nipple.png","ptfe pfa fep lined"],["PTFE Lined Hose Pipe","Pipes","product-hose-pipe.html","product","images/products/hose-pipe.png","ptfe pfa fep lined"],["PTFE Lined Header","Custom Engineered Equipment","product-header.html","product","images/products/header.png","ptfe pfa fep lined"],["PTFE Lined Envelope Gasket / PTFE Gasket","Custom Engineered Equipment","product-gasket.html","product","images/products/gasket-envelope.png","ptfe pfa fep lined"],["PTFE T-Bush for GLR Nozzles","Custom Engineered Equipment","product-t-bush.html","product","images/products/t-bush.png","ptfe pfa fep lined"],["PTFE Lined Ball Valve","Valves","product-ball-valve.html","product","images/products/ball-valve.png","ptfe pfa fep lined"],["PTFE Lined Butterfly Valve","Valves","product-butterfly-valve.html","product","images/products/butterfly-valve.png","ptfe pfa fep lined"],["PTFE Lined Non Return Valve","Valves","product-non-return-valve.html","product","images/products/non-return-valve.png","ptfe pfa fep lined"],["PTFE Lined Plug Valve","Valves","product-plug-valve.html","product","images/products/plug-valve.png","ptfe pfa fep lined"],["PTFE Lined Diaphragm Valve","Valves","product-diaphragm-valve.html","product","images/products/diaphragm-valve.png","ptfe pfa fep lined"],["PTFE Lined Flush Bottom Valve","Valves","product-flush-bottom-valve.html","product","images/products/flush-bottom-valve.png","ptfe pfa fep lined"],["PTFE Lined Swing Check Valve","Valves","product-swing-check-valve.html","product","images/products/swing-check-valve.png","ptfe pfa fep lined"],["PTFE Lined Double Window Sight Flow Indicator","Sight Flow Indicators","product-double-window-sfi.html","product","images/products/double-window-sfi.png","ptfe pfa fep lined"],["PTFE Lined Tubular Sight Flow Indicator","Sight Flow Indicators","product-tubular-sfi.html","product","images/products/tubular-sfi.png","ptfe pfa fep lined"],["Lined Pipes","Product category · 3 products","products.html?category=pipes","product","images/products/spool-pipe.png","Spool, jacketed and hose pipes"],["Lined Fittings","Product category · 15 products","products.html?category=fittings","product","images/products/elbow-90.png","Elbows, tees, reducers, flanges, crosses"],["Lined Valves","Product category · 7 products","products.html?category=valves","product","images/products/ball-valve.png","Ball, butterfly, plug, diaphragm, check"],["Expansion Bellows","Product category · 2 products","products.html?category=bellows","product","images/products/moulded-bellow.png","Moulded and machined high-pressure bellows"],["Sight Flow Indicators","Product category · 2 products","products.html?category=sight-flow","product","images/products/double-window-sfi.png","Double-window and tubular indicators"],["Custom Engineered","Product category · 14 products","products.html?category=custom","product","images/products/dip-pipe.png","Dip pipes, spacers, strainers, headers"],["Chemical Processing","Application · Aggressive acids, alkalis and solvents","chemical-processing.html","app","","industry application"],["Pharmaceutical","Application · High-purity transfer lines","pharmaceutical.html","app","","industry application"],["Petrochemical","Application · Built for high pressure and harsh chemistries","petrochemical.html","app","","industry application"],["Fertilizer","Application · Highly corrosive production media","fertilizer.html","app","","industry application"],["Specialty Chemicals","Application · Custom-engineered compatibility","specialty-chemicals.html","app","","industry application"],["Process Manufacturing","Application · Leak-free continuous process lines","process-manufacturing.html","app","","industry application"],["Products","All products","products.html","page","","catalogue range"],["About Us","Who we are and how we work","about.html","page","","company"],["Request a Quote","Send us your requirement","contact.html","page","","contact enquiry quote phone email"],["Product Catalogue (PDF)","Download the full catalogue","catalogue/Ablaze_Product_Catalogue.pdf","page","","download pdf"]];
  INDEX.forEach(function (it) { it[2] = U(it[2]); if (it[4]) it[4] = ROOT + it[4]; });

  var $ = function (id) { return document.getElementById(id); };
  var header = $("siteHeader");
  if (!header) return;
  var desktop = window.matchMedia("(min-width: 1024px)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  // ---- state ---------------------------------------------------------------
  var items = [].slice.call(header.querySelectorAll(".hdr-item[data-mega]"));
  var scrim = $("hdrScrim");
  var searchBtn = $("hdrSearchBtn"), searchPanel = $("hdrSearch");
  var searchForm = $("hdrSearchForm"), searchInput = $("hdrSearchInput"), results = $("hdrResults");
  var menuBtn = $("hdrMenuBtn"), mobile = $("hdrMobile");
  var openMega = null, openTimer = null, closeTimer = null;

  function megaOf(item) { return $(item.getAttribute("data-mega")); }

  function setMega(item) {
    clearTimeout(openTimer); clearTimeout(closeTimer);
    if (item === openMega) return;
    if (item && searchOpen()) setSearch(false);
    items.forEach(function (it) {
      var on = it === item, m = megaOf(it), b = it.querySelector(".hdr-chev");
      it.classList.toggle("is-open", on);
      if (m) m.classList.toggle("is-open", on);
      if (b) b.setAttribute("aria-expanded", on ? "true" : "false");
    });
    openMega = item || null;
    if (scrim) scrim.classList.toggle("show", !!item);
  }
  function closeMega() { setMega(null); }

  items.forEach(function (item) {
    var m = megaOf(item), chev = item.querySelector(".hdr-chev"), link = item.querySelector("a.hdr-link");
    function scheduleOpen() {
      if (!finePointer.matches || !desktop.matches) return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(function () { setMega(item); }, openMega ? 0 : 90);
    }
    function scheduleClose() {
      if (!finePointer.matches) return;
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
      closeTimer = setTimeout(closeMega, 170);
    }
    item.addEventListener("mouseenter", scheduleOpen);
    item.addEventListener("mouseleave", scheduleClose);
    if (m) { m.addEventListener("mouseenter", function () { clearTimeout(closeTimer); }); m.addEventListener("mouseleave", scheduleClose); }
    chev.addEventListener("click", function () { setMega(openMega === item ? null : item); });
    // Touch laptops/tablets: first tap on the link opens the menu instead of navigating
    link.addEventListener("click", function (e) {
      if (!finePointer.matches && desktop.matches && openMega !== item) { e.preventDefault(); setMega(item); }
    });
  });

  document.addEventListener("click", function (e) {
    if (openMega && !header.contains(e.target)) closeMega();
    if (searchOpen() && !header.contains(e.target)) setSearch(false);
  });
  if (scrim) scrim.addEventListener("click", function () { closeMega(); setSearch(false); });
  header.querySelectorAll(".mega a").forEach(function (a) { a.addEventListener("click", closeMega); });
  header.addEventListener("focusout", function (e) {
    if (openMega && e.relatedTarget && !header.contains(e.relatedTarget)) closeMega();
  });

  // ---- search ----------------------------------------------------------------
  function searchOpen() { return searchPanel && searchPanel.classList.contains("is-open"); }
  var ICONS = {
    product: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>',
    app: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l5 3V8l5 3V4h4v17"/></svg>',
    page: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z"/><path d="M14 3v5h5"/></svg>'
  };
  var ARROW = '<svg class="r-go" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hl(text, terms) {
    var out = esc(text);
    terms.forEach(function (t) {
      if (!t) return;
      out = out.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    });
    return out;
  }
  function suggestions() {
    var chips = [["Ball valve", "product-ball-valve.html"], ["Spool pipe", "product-spool-pipe.html"], ["Bellows", "products.html?category=bellows"], ["Pharmaceutical", "pharmaceutical.html"], ["Sight flow indicator", "products.html?category=sight-flow"]];
    return '<div class="hdr-results-label">Popular searches</div><div class="hdr-chips">' +
      chips.map(function (c) { return '<a href="' + U(c[1]) + '">' + c[0] + "</a>"; }).join("") + "</div>";
  }
  function find(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var scored = [];
    INDEX.forEach(function (it) {
      var hay = (it[0] + " " + it[1] + " " + it[5]).toLowerCase(), title = it[0].toLowerCase(), s = 0;
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return;
        s += title.indexOf(terms[i]) === 0 ? 4 : title.indexOf(terms[i]) > -1 ? 3 : 1;
      }
      scored.push([s + (it[3] === "product" ? 0 : 0.5), it]);
    });
    scored.sort(function (a, b) { return b[0] - a[0]; });
    return scored.slice(0, 7).map(function (x) { return x[1]; });
  }
  var active = -1;
  function render() {
    var q = searchInput.value.trim();
    active = -1;
    if (!q) { results.innerHTML = suggestions(); return; }
    var hits = find(q), terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!hits.length) { results.innerHTML = '<p class="hdr-empty">No results for “' + esc(q) + '”. Try a product name like “valve” or an industry like “pharmaceutical”.</p>'; return; }
    results.innerHTML = '<div class="hdr-results-label">' + hits.length + " result" + (hits.length > 1 ? "s" : "") + "</div><ul>" + hits.map(function (h) {
      var ic = h[4] ? '<img alt="" src="' + esc(h[4]) + '"/>' : ICONS[h[3]] || ICONS.page;
      return '<li><a href="' + esc(h[2]) + '"><span class="r-ic">' + ic + '</span><span><span class="r-t">' + hl(h[0], terms) + '</span><span class="r-s">' + esc(h[1]) + "</span></span>" + ARROW + "</a></li>";
    }).join("") + "</ul>";
  }
  function setSearch(open) {
    if (!searchPanel || !searchBtn) return;
    if (open) { closeMega(); if (mobile && mobile.classList.contains("is-open")) setMobile(false); }
    searchPanel.classList.toggle("is-open", open);
    searchPanel.setAttribute("aria-hidden", open ? "false" : "true");
    searchBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (scrim) scrim.classList.toggle("show", open && desktop.matches);
    if (open) { render(); setTimeout(function () { searchInput.focus(); }, 60); }
    else { searchInput.value = ""; }
  }
  if (searchBtn && searchPanel) {
    searchBtn.addEventListener("click", function () { setSearch(!searchOpen()); });
    searchInput.addEventListener("input", render);
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var links = results.querySelectorAll("ul a");
      var target = links[active] || links[0];
      if (target) window.location.href = target.getAttribute("href");
      else if (!searchInput.value.trim()) searchInput.focus();
    });
    searchInput.addEventListener("keydown", function (e) {
      var links = results.querySelectorAll("ul a");
      if (!links.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
      e.preventDefault();
      active = e.key === "ArrowDown" ? (active + 1) % links.length : (active - 1 + links.length) % links.length;
      links.forEach(function (l, i) { l.classList.toggle("is-active", i === active); });
      links[active].scrollIntoView({ block: "nearest" });
    });
    results.addEventListener("click", function (e) { if (e.target.closest("a")) setSearch(false); });
  }

  // ---- mobile menu -------------------------------------------------------------
  function setMobile(open) {
    if (!mobile || !menuBtn) return;
    if (open && searchOpen()) setSearch(false);
    mobile.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn && mobile) {
    menuBtn.addEventListener("click", function () { setMobile(!mobile.classList.contains("is-open")); });
    mobile.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMobile(false); }); });
    mobile.querySelectorAll(".hdr-m-acc").forEach(function (b) {
      b.addEventListener("click", function () {
        var panel = $(b.getAttribute("data-acc")), open = b.getAttribute("aria-expanded") !== "true";
        mobile.querySelectorAll(".hdr-m-acc").forEach(function (o) {
          var on = o === b && open;
          o.setAttribute("aria-expanded", on ? "true" : "false");
          $(o.getAttribute("data-acc")).classList.toggle("is-open", on);
        });
      });
    });
  }

  // ---- global keys / responsive / scroll ---------------------------------------
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (openMega) { var b = openMega.querySelector(".hdr-chev"); closeMega(); if (b) b.focus(); }
      else if (searchOpen()) { setSearch(false); searchBtn.focus(); }
      else if (mobile && mobile.classList.contains("is-open")) { setMobile(false); menuBtn.focus(); }
    } else if (e.key === "/" && !/^(input|textarea|select)$/i.test((e.target.tagName || "")) && !e.target.isContentEditable && searchBtn) {
      e.preventDefault(); setSearch(true);
    }
  });
  function onBreakpoint() {
    if (desktop.matches) setMobile(false); else closeMega();
    if (scrim && !searchOpen() && !openMega) scrim.classList.remove("show");
  }
  if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint); else if (desktop.addListener) desktop.addListener(onBreakpoint);
  window.addEventListener("scroll", function () { if (openMega && window.scrollY > 600) closeMega(); }, { passive: true });
})();
