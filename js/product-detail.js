// ==========================================================================
// ANTICO — product detail page behaviour (gallery, size selector, quote link,
// section highlighting, scroll reveal). Data comes from window.PD (inline).
// ==========================================================================
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ---- gallery ------------------------------------------------------------
  var stageImg = $("pdStageImg");
  document.querySelectorAll(".pd-thumb").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".pd-thumb").forEach(function (x) { x.classList.remove("is-on"); });
      b.classList.add("is-on");
      stageImg.classList.add("is-swap");
      setTimeout(function () {
        stageImg.src = b.getAttribute("data-src");
        stageImg.alt = b.getAttribute("data-alt");
        stageImg.onload = function () { stageImg.classList.remove("is-swap"); };
        setTimeout(function () { stageImg.classList.remove("is-swap"); }, 400);
      }, 180);
    });
  });

  // ---- size selector / quote link ----------------------------------------
  var D = window.PD;
  if (D && D.rows && D.rows.length && $("pdDims")) {
    var n = D.sizeCols, rows = D.rows, cols = D.cols;
    var sels = [], i;
    for (i = 0; i < n; i++) sels.push($("pdSize" + i));
    var linBox = $("pdLinPick"), dims = $("pdDims"), qty = $("pdQty"), quote = $("pdQuote"), copied = $("pdCopied");
    var curRow = rows[0], curLin = "";

    function uniq(a) { return a.filter(function (v, k) { return a.indexOf(v) === k; }); }
    function fill(sel, vals, keep) {
      sel.innerHTML = vals.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + "</option>"; }).join("");
      if (keep && vals.indexOf(keep) > -1) sel.value = keep;
    }
    function build() {
      // first select lists every first-size value; later selects are filtered by earlier ones
      fill(sels[0], uniq(rows.map(function (r) { return r.c[0]; })), sels[0].value);
      for (var k = 1; k < n; k++) {
        var prev = rows.filter(function (r) { for (var j = 0; j < k; j++) if (r.c[j] !== sels[j].value) return false; return true; });
        fill(sels[k], uniq(prev.map(function (r) { return r.c[k]; })), sels[k].value);
      }
    }
    function pick() {
      var m = rows.filter(function (r) { for (var j = 0; j < n; j++) if (r.c[j] !== sels[j].value) return false; return true; });
      curRow = m[0] || rows[0];
    }
    function paint() {
      var html = "";
      for (var k = n; k < cols.length; k++) {
        var v = curRow.c[k];
        var num = /^[\d.,]+$/.test(String(v));
        html += '<div class="pd-dim"><small>' + esc(cols[k]) + "</small><strong>" + esc(v) + (num ? "<i>mm</i>" : "") + "</strong></div>";
      }
      dims.innerHTML = html;
      // lining
      var avail = (D.lin || []).filter(function (l) { return curRow.m.indexOf(l) > -1; });
      if (avail.indexOf(curLin) < 0) curLin = avail[0] || "";
      linBox.innerHTML = (D.lin || []).map(function (l) {
        var on = avail.indexOf(l) > -1;
        return '<label class="pd-lp' + (on ? "" : " is-off") + '"><input type="radio" name="pdLin" value="' + l + '"' + (l === curLin ? " checked" : "") + (on ? "" : " disabled") + "/><span>" + l + "</span></label>";
      }).join("");
      // table highlight
      var tb = $("pdTable");
      if (tb) {
        var idx = rows.indexOf(curRow);
        [].forEach.call(tb.tBodies[0].rows, function (tr, k) { tr.classList.toggle("is-sel", k === idx); });
      }
      link();
    }
    function label() {
      var s = [];
      for (var j = 0; j < n; j++) s.push(cols[j] + " " + curRow.c[j]);
      return s.join(", ");
    }
    function specText() {
      var t = D.name + " — " + label();
      if (curLin) t += ", " + curLin + " lined";
      for (var k = n; k < cols.length; k++) t += ", " + cols[k] + " " + curRow.c[k];
      if (qty.value) t += ", Qty " + qty.value;
      return t;
    }
    function link() {
      var q = new URLSearchParams();
      q.set("product", D.id);
      q.set("size", label());
      if (curLin) q.set("lining", curLin);
      if (qty.value) q.set("qty", qty.value);
      quote.setAttribute("href", (window.SITE_ROOT || "") + "pages/contact.html?" + q.toString());
    }
    sels.forEach(function (s, k) {
      s.addEventListener("change", function () {
        // re-filter later selects, then pick
        for (var m = k + 1; m < n; m++) {
          var prev = rows.filter(function (r) { for (var j = 0; j < m; j++) if (r.c[j] !== sels[j].value) return false; return true; });
          fill(sels[m], uniq(prev.map(function (r) { return r.c[m]; })), sels[m].value);
        }
        pick(); paint();
      });
    });
    linBox.addEventListener("change", function (e) { if (e.target.name === "pdLin") { curLin = e.target.value; link(); } });
    qty.addEventListener("input", link);
    $("pdCopy").addEventListener("click", function () {
      var t = specText();
      function done() { copied.textContent = "Copied. Paste it into your enquiry."; setTimeout(function () { copied.textContent = ""; }, 3000); }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function () { window.prompt("Copy this specification:", t); });
      else window.prompt("Copy this specification:", t);
    });

    // full table
    var tbl = $("pdTable");
    if (tbl) {
      var lin = D.lin || [];
      tbl.innerHTML = "<thead><tr>" + cols.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") + lin.map(function (l) { return "<th>" + l + "</th>"; }).join("") + "</tr></thead><tbody>" +
        rows.map(function (r) {
          return "<tr>" + r.c.map(function (c) { return "<td>" + esc(c) + "</td>"; }).join("") + lin.map(function (l) { return r.m.indexOf(l) > -1 ? '<td class="yes">•</td>' : "<td></td>"; }).join("") + "</tr>";
        }).join("") + "</tbody>";
    }
    build(); pick(); paint();
  }

  // ---- sub-nav highlight ----------------------------------------------------
  var links = [].slice.call(document.querySelectorAll(".pd-subnav a"));
  if (links.length && "IntersectionObserver" in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove("is-on"); });
        var a = map[e.target.id];
        if (a) { a.classList.add("is-on"); var bar = a.parentNode; if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: a.offsetLeft - 24, behavior: "smooth" }); }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll(".pd-sec").forEach(function (s) { if (s.id) io.observe(s); });
  }

  // ---- scroll reveal ----------------------------------------------------------
  var rv = document.querySelectorAll(".pd-feat,.pd-mat,.pd-lc,.pd-q,.pd-dl,.pd-steps li,.pd-faq,.pd-config,.pd-drawing");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ro.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rv.forEach(function (el, k) { el.classList.add("pd-rv"); el.style.transitionDelay = (k % 4) * 70 + "ms"; ro.observe(el); });
  }
})();
