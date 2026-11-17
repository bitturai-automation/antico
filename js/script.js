// ==========================================================================
// ANTICO FLOW SYSTEM — HOMEPAGE SCRIPT
// Vanilla JavaScript only (no frameworks / libraries)
// ==========================================================================
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ======================================================================
    // HEADER — scroll state + scroll progress bar
    // ======================================================================
    var header = document.getElementById("siteHeader");
    var progress = document.getElementById("scrollProgress");

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("scrolled", y > 40);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    }
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ======================================================================
    // MOBILE MENU
    // ======================================================================
    var navToggle = document.getElementById("navToggle");
    var mobilePanel = document.getElementById("mobilePanel");

    function closeMobilePanel() {
      if (!mobilePanel) return;
      mobilePanel.classList.remove("open");
      if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    if (navToggle && mobilePanel) {
      navToggle.addEventListener("click", function () {
        var isOpen = mobilePanel.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        document.body.style.overflow = isOpen ? "hidden" : "";
      });
      mobilePanel.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", closeMobilePanel);
      });
    }

    // ======================================================================
    // HEADER SEARCH
    // ======================================================================
    var searchToggle = document.getElementById("searchToggle");
    var searchPanel = document.getElementById("searchPanel");
    var searchForm = document.getElementById("searchForm");
    var searchInput = document.getElementById("searchInput");
    var searchMsg = document.getElementById("searchMsg");

    function setSearch(open) {
      if (!searchPanel || !searchToggle) return;
      searchPanel.classList.toggle("open", open);
      searchPanel.setAttribute("aria-hidden", open ? "false" : "true");
      searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        closeMobilePanel();
        if (searchInput) searchInput.focus();
      } else if (searchMsg) {
        searchMsg.textContent = "";
      }
    }

    if (searchToggle && searchPanel) {
      searchToggle.addEventListener("click", function () {
        setSearch(!searchPanel.classList.contains("open"));
      });
      if (navToggle) navToggle.addEventListener("click", function () {
        if (searchPanel.classList.contains("open")) setSearch(false);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && searchPanel.classList.contains("open")) {
          setSearch(false);
          searchToggle.focus();
        }
      });
      if (searchForm) searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = (searchInput.value || "").trim().toLowerCase();
        if (!q) return;
        var candidates = document.querySelectorAll(
          "main section:not(#hero) h2, main section:not(#hero) h3, main section:not(#hero) h4, main section:not(#hero) p, main section:not(#hero) li"
        );
        var hit = null;
        for (var i = 0; i < candidates.length; i++) {
          var el = candidates[i];
          if (el.offsetParent !== null && el.textContent.toLowerCase().indexOf(q) !== -1) {
            hit = el;
            break;
          }
        }
        if (hit) {
          var headerH = header ? header.offsetHeight : 0;
          var top = hit.getBoundingClientRect().top + window.pageYOffset - headerH - 90;
          setSearch(false);
          window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
        } else if (searchMsg) {
          searchMsg.textContent = "No results found for \u201c" + searchInput.value.trim() + "\u201d.";
        }
      });
    }

    // ======================================================================
    // SCROLL REVEAL — IntersectionObserver
    // ======================================================================
    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce) and (min-width: 981px)"
    ).matches;
    var revealEls = document.querySelectorAll(
      ".reveal, .reveal-scale, .reveal-left"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });

      // Introduction accent line + staggered paragraphs
      var introLine = document.querySelector(".intro-line");
      var introBody = document.querySelector(".intro-body");
      if (introLine || introBody) {
        var io2 = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) {
                if (introLine) introLine.classList.add("is-visible");
                if (introBody) introBody.classList.add("is-visible");
                io2.disconnect();
              }
            });
          },
          { threshold: 0.35 }
        );
        io2.observe(introLine || introBody);
      }

      // Requirement flow nodes + connectors
      var reqNodes = document.querySelectorAll(".req-node, .req-connector");
      if (reqNodes.length) {
        var io3 = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io3.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.4 }
        );
        reqNodes.forEach(function (el) {
          io3.observe(el);
        });
      }
    }

    // ======================================================================
    // APPLICATION SWITCHER (desktop split view)
    // ======================================================================
    var appItems = document.querySelectorAll(".app-item");
    var appImgs = document.querySelectorAll(".app-visual-img");
    var appCaptionTitle = document.getElementById("appCaptionTitle");

    var appData = [
      {
        title: "Chemical Processing",
        text: "Lined pipes, fittings and valves engineered to handle aggressive acids, alkalis and solvents in continuous process lines.",
      },
      {
        title: "Pharmaceutical",
        text: "High-purity fluoropolymer linings suited to sensitive pharmaceutical transfer and processing requirements.",
      },
      {
        title: "Petrochemical",
        text: "Corrosion-resistant flow systems built for the pressures and chemistries of petrochemical operations.",
      },
      {
        title: "Fertilizer",
        text: "Durable lined equipment engineered for the highly corrosive media common in fertilizer production.",
      },
      {
        title: "Specialty Chemicals",
        text: "Custom-engineered flow solutions for specialty chemical processes with demanding compatibility needs.",
      },
      {
        title: "Process Manufacturing",
        text: "Reliable, leak-free flow control supporting continuous process manufacturing lines.",
      },
    ];

    var currentApp = "0";
    var captionTimer = null;
    var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    var appCaption = document.querySelector(".app-caption");

    function activateApp(idx) {
      if (idx === currentApp) return;
      currentApp = idx;
      appItems.forEach(function (i) {
        i.setAttribute("aria-selected", i.getAttribute("data-app") === idx ? "true" : "false");
      });
      appImgs.forEach(function (img) {
        img.classList.toggle("active", img.getAttribute("data-app") === idx);
      });
      if (appData[idx] && appCaptionTitle && appCaption) {
        // brief fade/slide out, swap text, fade/slide back in
        appCaption.classList.add("is-changing");
        clearTimeout(captionTimer);
        captionTimer = setTimeout(function () {
          appCaptionTitle.textContent = appData[idx].title;
          appCaption.classList.remove("is-changing");
        }, 180);
      }
    }

    appItems.forEach(function (item) {
      var idx = item.getAttribute("data-app");
      // Desktop: hover activates. Touch/tablet: tap (click) activates.
      item.addEventListener("mouseenter", function () {
        if (canHover.matches) activateApp(idx);
      });
      item.addEventListener("click", function () { activateApp(idx); });
      item.addEventListener("focus", function () { activateApp(idx); }); // keyboard users
    });

    // ======================================================================
    // APPLICATION ACCORDION (mobile)
    // ======================================================================
    var accItems = document.querySelectorAll(".acc-item");
    accItems.forEach(function (item) {
      var trigger = item.querySelector(".acc-trigger");
      if (!trigger) return;
      trigger.addEventListener("click", function () {
        var isOpen = item.getAttribute("aria-expanded") === "true";
        accItems.forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
        });
        item.setAttribute("aria-expanded", isOpen ? "false" : "true");
      });
    });

    // ======================================================================
    // CERTIFICATE MODAL
    // ======================================================================
    var certTriggers = document.querySelectorAll("[data-cert-trigger]");
    var modalOverlay = document.getElementById("certModal");
    var modalTitle = document.getElementById("certModalTitle");
    var modalText = document.getElementById("certModalText");
    var modalImg = document.getElementById("certModalImg");
    var modalClose = document.getElementById("certModalClose");
    var lastFocused = null;

    function openModal(title, text, img) {
      if (!modalOverlay) return;
      if (modalImg) {
        if (img) { modalImg.src = img; modalImg.alt = title; modalImg.hidden = false; }
        else { modalImg.removeAttribute("src"); modalImg.hidden = true; }
      }
      modalOverlay.classList.toggle("has-img", !!img);
      if (modalTitle) modalTitle.textContent = title;
      if (modalText) modalText.textContent = text;
      lastFocused = document.activeElement;
      modalOverlay.classList.add("open");
      modalOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (modalClose) modalClose.focus();
    }

    function closeModal() {
      if (!modalOverlay) return;
      modalOverlay.classList.remove("open");
      modalOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    certTriggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        var title = trigger.getAttribute("data-cert-title") || "";
        var text = trigger.getAttribute("data-cert-text") || "";
        openModal(title, text, trigger.getAttribute("data-cert-img") || "");
      });
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) closeModal();
      });
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("open")) {
        closeModal();
      }
    });
  });
})();

/* About — subtle pointer tilt for the 3D pipe */
(function(){
  var box=document.querySelector('.intro-visual');
  if(!box||window.matchMedia('(prefers-reduced-motion: reduce)').matches||!window.matchMedia('(hover:hover)').matches)return;
  box.addEventListener('mousemove',function(e){
    var r=box.getBoundingClientRect();
    box.style.setProperty('--tx',((e.clientX-r.left)/r.width-.5)*16);
    box.style.setProperty('--ty',((e.clientY-r.top)/r.height-.5)*-10);
  });
  box.addEventListener('mouseleave',function(){box.style.setProperty('--tx',0);box.style.setProperty('--ty',0);});
})();

/* ==========================================================================
   SITE-WIDE MOTION LAYER — staggers, split titles, scroll-spy, hero parallax
   ========================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce) and (min-width: 981px)").matches;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;

  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function index(list, prop) { list.forEach(function (el, i) { el.style.setProperty(prop, i); }); }

  doc.classList.add("js-anim");

  // ---- Stagger indexes (CSS reads --n / --i) ----
  index(all(".product-grid .p-card"), "--n");
  index(all(".app-item"), "--i");
  index(all(".req-node"), "--i");
  index(all(".cd-card"), "--n");
  index(all(".req-connector"), "--i");
  all(".bl-list").forEach(function (ul) { index(all("li", ul), "--i"); });

  // ---- Split section titles into words for a masked rise ----
  if (!reduce) {
    all("h2.section-title").forEach(function (h) {
      var words = h.textContent.trim().split(/\s+/);
      h.textContent = "";
      words.forEach(function (word, i) {
        var mask = document.createElement("span");
        var inner = document.createElement("span");
        mask.className = "w";
        inner.style.setProperty("--wi", i);
        inner.textContent = word;
        mask.appendChild(inner);
        h.appendChild(mask);
        if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
      });
      h.classList.add("split");
    });
  }

  // ---- Generic staggered reveal: footer + mobile accordion ----
  var up = [];
  all(".footer-top > div").forEach(function (el, i) { el.classList.add("a-up"); el.style.setProperty("--i", i); up.push(el); });
  var ft = document.querySelector(".footer-top");
  if (ft) up.push(ft);
  var fb = document.querySelector(".footer-bottom");
  if (fb) { fb.classList.add("a-up"); fb.style.setProperty("--i", 3); up.push(fb); }
  all(".acc-item").forEach(function (el, i) { el.classList.add("a-up"); el.style.setProperty("--i", i); up.push(el); });

  if (reduce || !hasIO) {
    up.forEach(function (el) { el.classList.add("a-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("a-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    up.forEach(function (el) { io.observe(el); });
  }

  // Elements that need .is-visible but had no .reveal class in the markup
  if (hasIO && !reduce) {
    var extra = all(".clients-placeholder-note, .cert-note, .intro-visual, h2.split, .eyebrow");
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io2.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    extra.forEach(function (el) { io2.observe(el); });
  }

  // ---- Scroll-spy: highlight the nav link for the section in view ----
  var links = all("nav.main-nav a[href^='#']");
  if (hasIO && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var secs = Object.keys(map).map(function (id) { return document.getElementById(id); }).filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-current"); });
        if (map[e.target.id]) map[e.target.id].classList.add("is-current");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { spy.observe(s); });
    var heroEl = document.getElementById("hero");
    if (heroEl) new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) links.forEach(function (a) { a.classList.remove("is-current"); });
    }, { threshold: 0.5 }).observe(heroEl);
  }

  // ---- Hero: gentle parallax + fade as you scroll away ----
  var heroContent = document.querySelector(".hero-content");
  var hero = document.getElementById("hero");
  if (heroContent && hero && !reduce) {
    var ticking = false;
    var update = function () {
      var y = window.scrollY || 0;
      var h = hero.offsetHeight || 1;
      if (y < h) {
        heroContent.style.setProperty("--hp", (y * 0.16).toFixed(1) + "px");
        heroContent.style.setProperty("--ho", Math.max(0, 1 - y / (h * 0.85)).toFixed(3));
      }
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
  }

  // ---- Product cards: cursor-follow spotlight (desktop only) ----
  if (canHover && !reduce) {
    all(".p-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }
})();

/* ==========================================================================
   ABOUT — words light up one by one as the paragraph scrolls through view
   ========================================================================== */
(function () {
  "use strict";
  var el = document.querySelector("[data-scroll-words]");
  if (!el) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce) and (min-width: 981px)").matches) return; // stays fully dark

  var text = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  var words = text.map(function (w, i) {
    var s = document.createElement("span");
    s.className = "sw";
    s.textContent = w;
    el.appendChild(s);
    if (i < text.length - 1) el.appendChild(document.createTextNode(" "));
    return s;
  });

  var FROM = [209, 214, 222];   // unread (light grey)
  var TO = [7, 26, 47];         // read (site navy)
  var last = [];
  var ticking = false;

  function paint() {
    ticking = false;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.82;          // paragraph top reaches here -> first word starts
    var end = vh * 0.38;            // paragraph bottom reaches here -> last word done
    var p = (start - r.top) / (start - end + r.height);
    p = Math.min(1, Math.max(0, p));
    var n = words.length;
    for (var i = 0; i < n; i++) {
      var t = Math.min(1, Math.max(0, p * n * 1.0 - i));
      t = Math.round(t * 20) / 20;
      if (last[i] === t) continue;
      last[i] = t;
      words[i].style.color = "rgb(" +
        Math.round(FROM[0] + (TO[0] - FROM[0]) * t) + "," +
        Math.round(FROM[1] + (TO[1] - FROM[1]) * t) + "," +
        Math.round(FROM[2] + (TO[2] - FROM[2]) * t) + ")";
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  paint();
})();

/* ==========================================================================
   RESPONSIVE HELPERS — keep the mobile menu in sync with screen changes
   (rotation, window resize, "desktop site" toggle)
   ========================================================================== */
(function () {
  var panel = document.getElementById("mobilePanel");
  var toggle = document.getElementById("navToggle");
  if (!panel || !toggle) return;
  var mq = window.matchMedia("(min-width: 981px)");
  function closeIfDesktop() {
    if (!mq.matches) return;
    panel.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (mq.addEventListener) mq.addEventListener("change", closeIfDesktop);
  else if (mq.addListener) mq.addListener(closeIfDesktop);
  window.addEventListener("orientationchange", closeIfDesktop);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      panel.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      toggle.focus();
    }
  });
})();
