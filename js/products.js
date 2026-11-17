// ==========================================================================
// PRODUCTS PAGE — renders the catalogue data (js/products-data.js)
// ==========================================================================
(function () {
  "use strict";
  var P = window.PRODUCTS || [], CATS = window.PRODUCT_CATEGORIES || {}, GRP = window.PRODUCT_GROUPS || {};
  var ROOT = window.SITE_ROOT || "";
  var IMG = ROOT + "images/products/";
  var ARROW = '<svg fill="none" height="15" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="15"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  var CAT_SHORT = { pipes: "PIPES & FITTINGS", valves: "VALVES" };

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function pageRef(p) {                       // printed catalogue page = PDF page - 2
    var a = Array.isArray(p.page) ? p.page : [p.page];
    var f = a[0] - 2, l = a[a.length - 1] - 2;
    return a.length > 1 ? "Catalogue pages " + f + "–" + l : "Catalogue page " + f;
  }
  function nbLine(p) {
    var b = p.variants ? p.variants[0].spec : p.spec, i;
    for (i = 0; i < b.length; i++) if (/^NB /.test(b[i])) return b[i];
    return "";
  }
  function lining(p) {
    var set = {}, out = [];
    (p.rows || []).forEach(function (r) { r.m.forEach(function (m) { set[m] = 1; }); });
    ["PTFE", "PFA", "FEP"].forEach(function (m) { if (set[m]) out.push(m); });
    return out;
  }
  function searchText(p) {
    var t = [p.name, CATS[p.cat]];
    (p.variants || [p]).forEach(function (b) {
      t = t.concat(b.spec || []);
      (b.mat || []).forEach(function (m) { t.push(m[0]); t = t.concat(m[1]); });
      (b.req || []).forEach(function (r) { t = t.concat(typeof r === "string" ? [r] : [r[0]].concat(r[1])); });
    });
    return t.join(" ").toLowerCase();
  }
  P.forEach(function (p) { p._s = searchText(p); });

  // ---------------- grid ----------------
  var root = document.getElementById("ppSections"), emptyEl = document.getElementById("ppEmpty");
  var state = { cat: "all", q: "" };

  function card(p) {
    var tags = lining(p).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");
    return '<a class="pc" href="' + p.id + '.html" aria-label="View details: ' + esc(p.name) + '">' +
      '<div class="pc-img"><img loading="lazy" decoding="async" alt="' + esc(p.name) + '" src="' + IMG + p.images[0] + '"/><div class="p-tech-line"></div></div>' +
      '<div class="p-body"><div class="p-eyebrow">' + pad(p.n) + " · " + GRP[p.grp].toUpperCase() + "</div>" +
      '<h3 class="p-title">' + esc(p.name) + "</h3>" +
      '<div class="pc-meta">' + esc(nbLine(p)) + "</div>" +
      '<div class="pc-tags">' + tags + "</div>" +
      '<span class="p-link">View Details ' + ARROW + "</span></div></a>";
  }

  function render() {
    var q = state.q.trim().toLowerCase(), html = "", shown = 0;
    Object.keys(GRP).forEach(function (k) {
      if (state.cat !== "all" && state.cat !== k) return;
      var list = P.filter(function (p) { return p.grp === k && (!q || p._s.indexOf(q) > -1); });
      if (!list.length) return;
      shown += list.length;
      html += '<section class="pp-section" id="cat-' + k + '"><div class="container"><div class="pp-sec-head"><div><div class="eyebrow">CATEGORY</div><h2>' + esc(GRP[k]) + "</h2></div><span>" + list.length + " product" + (list.length > 1 ? "s" : "") + '</span></div><div class="pp-grid">' + list.map(card).join("") + "</div></div></section>";
    });
    root.innerHTML = html;
    emptyEl.style.display = shown ? "none" : "block";
  }

  // chips
  var chips = document.getElementById("ppChips");
  function buildChips() {
    var h = '<button class="pp-chip" data-cat="all">All Products<small>' + P.length + "</small></button>";
    Object.keys(GRP).forEach(function (k) {
      h += '<button class="pp-chip" data-cat="' + k + '">' + esc(GRP[k]) + "<small>" + P.filter(function (p) { return p.grp === k; }).length + "</small></button>";
    });
    chips.innerHTML = h;
  }
  function setCat(c) {
    if (c !== "all" && !GRP[c]) c = "all";
    state.cat = c;
    [].forEach.call(chips.children, function (x) { x.classList.toggle("active", x.getAttribute("data-cat") === c); });
  }
  function jump(smooth) {
    var tb = document.getElementById("ppToolbar"), sec = document.getElementById("ppSections");
    var sticky = getComputedStyle(tb).position === "sticky";
    var off = 84 + (sticky ? tb.offsetHeight : 0);
    window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - off, behavior: smooth ? "smooth" : "auto" });
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".pp-chip"); if (!b) return;
    setCat(b.getAttribute("data-cat"));
    try { history.replaceState(null, "", state.cat === "all" ? location.pathname : "?category=" + state.cat); } catch (x) {}
    render();
    jump(true);
  });
  document.getElementById("ppSearch").addEventListener("input", function (e) { state.q = e.target.value; render(); });

  // ---------------- modal ----------------
  var modal = document.getElementById("pm"), body = document.getElementById("pmBody"), lastFocus = null, current = null;

  function listHtml(items) {
    return "<ul>" + items.map(function (i) {
      return typeof i === "string" ? "<li>" + esc(i) + "</li>" :
        "<li>" + esc(i[0]) + ":<ul>" + i[1].map(function (v) { return "<li>" + esc(v) + "</li>"; }).join("") + "</ul></li>";
    }).join("") + "</ul>";
  }
  function matHtml(mat) {
    return '<ul class="pm-mat">' + mat.map(function (m) {
      return "<li><b>" + esc(m[0]) + ":</b> " + m[1].map(esc).join("<br/>") + "</li>";
    }).join("") + "</ul>";
  }
  function blocks(b) {
    var h = "";
    if (b.spec && b.spec.length) h += '<div class="pm-blk"><h4>Specifications</h4>' + listHtml(b.spec) + "</div>";
    if (b.mat && b.mat.length) h += '<div class="pm-blk"><h4>Materials</h4>' + matHtml(b.mat) + "</div>";
    if (b.req && b.req.length) h += '<div class="pm-blk"><h4>Available on Request</h4>' + listHtml(b.req) + "</div>";
    return h;
  }
  function tableHtml(p) {
    var lin = p.lin || ["PTFE", "PFA", "FEP"];
    var th = p.cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + lin.map(function (l) { return "<th>" + l + "</th>"; }).join("");
    var tr = p.rows.map(function (r) {
      var td = r.c.map(function (c) { return "<td" + (/Requirement/.test(c) ? ' class="txt"' : "") + ">" + esc(c) + "</td>"; }).join("");
      td += lin.map(function (l) { return r.m.indexOf(l) > -1 ? '<td class="yes">•</td>' : "<td></td>"; }).join("");
      return "<tr>" + td + "</tr>";
    }).join("");
    return '<div class="pm-sizes"><h3>Sizes &amp; Dimensions <span style="font-weight:500;color:var(--muted);font-size:14px">(mm unless stated)</span></h3><div class="tbl-wrap"><table class="ptbl"><thead><tr>' + th + "</tr></thead><tbody>" + tr + '</tbody></table></div><p class="tbl-legend">“•” Applicable &nbsp;|&nbsp; blank = Not Applicable</p></div>';
  }
  function open(id, push) {
    var i = P.findIndex(function (p) { return p.id === id; }); if (i < 0) return;
    var p = P[i]; current = i;
    var figs = p.images.map(function (im, k) {
      var cap = p.variants ? p.variants[k] && p.variants[k].title : "Product image";
      return '<figure class="pm-fig"><img alt="' + esc(p.name) + '" src="' + IMG + im + '"/><figcaption>' + esc(cap || "Product image") + "</figcaption></figure>";
    }).join("");
    if (p.drawing) figs += '<figure class="pm-fig drw"><img loading="lazy" alt="Technical drawing — ' + esc(p.name) + '" src="' + IMG + p.drawing + '"/><figcaption>Technical drawing</figcaption></figure>';
    var info = "";
    if (p.variants) info = p.variants.map(function (v) { return '<div class="pm-variant"><h3>' + esc(v.title) + "</h3>" + blocks(v) + "</div>"; }).join("");
    else info = blocks(p);
    var prev = P[(i + P.length - 1) % P.length], next = P[(i + 1) % P.length];
    body.innerHTML = '<div class="pm-top"><div class="pm-gallery">' + figs + '</div><div class="pm-info"><div class="eyebrow">' + esc(GRP[p.grp]).toUpperCase() + "</div><h2 id=\"pmTitle\">" + esc(p.name) + '</h2><div class="pm-ref">' + esc(GRP[p.grp]) + " · " + esc(CATS[p.cat]) + " · " + pageRef(p) + "</div>" + info +
      '<div class="pm-actions"><a class="btn btn-primary" href="' + ROOT + 'pages/contact.html?product=' + encodeURIComponent(p.id) + '" data-close="1">Request a Quote <span class="btn-arrow">→</span></a></div></div></div>' +
      (p.rows ? tableHtml(p) : "") + (p.note ? '<div class="pm-note">' + esc(p.note) + "</div>" : "") +
      '<div class="pm-nav"><button type="button" data-go="' + prev.id + '">← ' + esc(prev.name) + '</button><button type="button" data-go="' + next.id + '">' + esc(next.name) + " →</button></div>";
    if (!modal.classList.contains("open")) { lastFocus = document.activeElement; modal.classList.add("open"); document.body.style.overflow = "hidden"; }
    document.getElementById("pmDialog").scrollTop = 0;
    document.getElementById("pmClose").focus({ preventScroll: true });
    if (push !== false) history.replaceState(null, "", "#" + id);
  }
  function close() {
    modal.classList.remove("open"); document.body.style.overflow = "";
    history.replaceState(null, "", location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close") || e.target.closest("#pmClose") || e.target.classList.contains("pm-back")) { close(); return; }
    var g = e.target.closest("[data-go]"); if (g) open(g.getAttribute("data-go"));
  });
  document.addEventListener("keydown", function (e) {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {   // keep focus inside dialog
      var f = modal.querySelectorAll('button,a[href],[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  function goHash() {   // old products.html#id links now open the product page
    var id = location.hash.slice(1);
    if (id && P.some(function (p) { return p.id === id; })) location.replace(id + ".html");
  }
  window.addEventListener("hashchange", goHash);

  // ---------------- technical info ----------------
  var fl = document.getElementById("flangeTable");
  if (fl && window.FLANGE_DIMS) {
    var hd = ["Size", "OD(±2)", "PCD(±2)", "RF(±2)", "No. of Holes", "Hole Dia.", "Lining Th."];
    fl.innerHTML = "<thead><tr>" + hd.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +
      window.FLANGE_DIMS.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";
  }

  buildChips();
  var qc = (new URLSearchParams(location.search)).get("category");
  setCat(qc || "all"); render();
  if (qc && GRP[qc]) setTimeout(function () { jump(false); }, 80);
  goHash();
})();
