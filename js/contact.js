// ==========================================================================
// ANTICO — Request a Quote form
// No backend is bundled with this static site. By default the form opens the
// visitor's email app with the request pre-filled (mailto). To post to a form
// service instead (Formspree, Getform, your own API), set ENDPOINT below.
// ==========================================================================
(function () {
  "use strict";
  var ENDPOINT = "";                                   // e.g. "https://formspree.io/f/xxxxxxx"
  var TO = "mkt.anticoflowsystem@gmail.com";

  var form = document.getElementById("quoteForm");
  if (!form) return;
  var status = document.getElementById("quoteStatus");
  var btn = form.querySelector(".ct-submit");
  var PRODUCTS = window.ANTICO_PRODUCTS || {};

  // ---- prefill from ?product= / ?category= ----
  try {
    var q = new URLSearchParams(location.search);
    var pid = q.get("product"), cat = q.get("category");
    if (pid && PRODUCTS[pid]) {
      var msg = "I would like a quote for: " + PRODUCTS[pid][0] + ".\n";
      if (q.get("size")) msg += "Size: " + q.get("size") + "\n";
      if (q.get("lining")) msg += "Lining: " + q.get("lining") + "\n";
      if (q.get("qty")) msg += "Quantity: " + q.get("qty") + "\n";
      form.elements.message.value = msg;
      var ln = q.get("lining");
      if (ln && form.elements.lining) form.elements.lining.value = ln;
      cat = PRODUCTS[pid][1];
    }
    if (cat) {
      var chip = form.querySelector('input[data-cat="' + cat + '"]');
      if (chip) chip.checked = true;
    }
  } catch (e) {}

  function setErr(input, msg) {
    var f = input.closest(".ct-field");
    if (!f) return;
    f.classList.toggle("has-err", !!msg);
    var s = f.querySelector(".ct-err");
    if (s) s.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }
  function validate() {
    var el = form.elements, ok = true, first = null;
    function bad(i, m) { setErr(i, m); if (!first) first = i; ok = false; }
    ["name", "company"].forEach(function (n) {
      setErr(el[n], ""); if (!el[n].value.trim()) bad(el[n], "Please fill this in.");
    });
    setErr(el.email, "");
    if (!el.email.value.trim()) bad(el.email, "Please enter your email.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.email.value.trim())) bad(el.email, "That email doesn't look right.");
    setErr(el.phone, "");
    if (el.phone.value.trim() && !/^[+\d][\d\s().-]{6,}$/.test(el.phone.value.trim())) bad(el.phone, "Enter a valid phone number.");
    if (first) first.focus();
    return ok;
  }
  form.addEventListener("input", function (e) { if (e.target.closest(".has-err")) setErr(e.target, ""); });

  function collect() {
    var v = function (n) { return (form.elements[n].value || "").trim(); };
    var cats = [].slice.call(form.querySelectorAll('input[name="categories"]:checked')).map(function (c) { return c.value; });
    return [
      ["Name", v("name")], ["Company", v("company")], ["Email", v("email")], ["Phone", v("phone")],
      ["Industry", v("industry")], ["Looking for", cats.join(", ")], ["Media / chemical", v("media")],
      ["Temperature & pressure", v("duty")], ["Size range & quantity", v("size")], ["Lining", v("lining")],
      ["Message", v("message")]
    ].filter(function (r) { return r[1]; });
  }
  function asText(rows) { return rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n"); }
  function say(html, cls) { status.className = "ct-status show " + (cls || ""); status.innerHTML = html; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) { say("Please fix the highlighted fields.", "is-err"); return; }
    var rows = collect(), body = asText(rows);
    var subject = "Quote request: " + form.elements.company.value.trim();

    if (ENDPOINT) {
      btn.disabled = true; say("Sending…");
      var payload = {}; rows.forEach(function (r) { payload[r[0]] = r[1]; });
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { if (!r.ok) throw new Error(); say("<b>Thank you.</b> Your request has been sent. Our team will get back to you.", "is-ok"); form.reset(); })
        .catch(function () { say("Something went wrong. Please email <a href=\"mailto:" + TO + "\">" + TO + "</a> or call +91 90237 90640.", "is-err"); })
        .then(function () { btn.disabled = false; });
      return;
    }

    // mailto fallback
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    say("<b>Your email app should now open with this request ready to send.</b> If nothing opened, <button class=\"ct-copy\" type=\"button\">copy the details</button> and email them to <a href=\"mailto:" + TO + "\">" + TO + "</a>, or call <a href=\"tel:+919023790640\">+91 90237 90640</a>.", "is-ok");
    var c = status.querySelector(".ct-copy");
    if (c) c.addEventListener("click", function () {
      var done = function () { c.textContent = "copied"; };
      if (navigator.clipboard) navigator.clipboard.writeText(subject + "\n\n" + body).then(done, done); else done();
    });
  });
})();
