// ===== Page entrance fade + inter-page curtain transition =====
// Body starts with .page-fade-init (opacity:0, set directly in the HTML so
// there is no flash of unstyled content). This script removes it and plays
// a fade-in. It also intercepts clicks on internal links to play a brief
// curtain wipe before navigating, so moving between pages feels continuous
// rather than an abrupt reload. Everything here is progressive enhancement:
// if this script doesn't run, .page-fade-init is never added by anything
// else that matters, but to be safe we also force-show the body on a timer.
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;

  function showBody(){
    body.classList.remove('page-fade-init');
    body.classList.add('page-fade-in');
  }
  if(reduceMotion){ showBody(); }
  else { requestAnimationFrame(()=> requestAnimationFrame(showBody)); }
  // Safety net in case rAF is throttled (e.g. background tab restore).
  setTimeout(showBody, 500);

  if(reduceMotion) return;

  const overlay = document.createElement('div');
  overlay.id = 'page-transition-overlay';
  document.body.appendChild(overlay);

  document.addEventListener('click', function(e){
    if(e.defaultPrevented || e.button !== 0) return;
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a');
    if(!a || !a.getAttribute) return;
    if(a.target === '_blank' || a.hasAttribute('download')) return;
    const href = a.getAttribute('href');
    if(!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    let url;
    try{ url = new URL(href, window.location.href); } catch(err){ return; }
    if(url.origin !== window.location.origin) return;
    // Same-page anchor jump (including plain "#") — let the browser handle it.
    if(url.pathname === window.location.pathname && url.hash) return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(()=>{ window.location.href = url.href; }, 380);
  });

  // Bfcache restores can leave the overlay visible — make sure it's gone.
  window.addEventListener('pageshow', function(e){
    overlay.classList.remove('active');
    if(e.persisted) showBody();
  });
})();


// ===== Navbar scroll state =====
const nav = document.querySelector('.navbar');
function onScroll(){
  if(!nav) return;
  if(window.scrollY > 12){ nav.classList.add('scrolled'); }
  else{ nav.classList.remove('scrolled'); }
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ===== Mobile nav =====
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const closeBtn = document.querySelector('.close-btn');
if(hamburger && mobileNav){
  hamburger.addEventListener('click', ()=> mobileNav.classList.add('open'));
}
if(closeBtn && mobileNav){
  closeBtn.addEventListener('click', ()=> mobileNav.classList.remove('open'));
}
document.querySelectorAll('.mobile-nav-links a').forEach(a=>{
  a.addEventListener('click', ()=> mobileNav && mobileNav.classList.remove('open'));
});

// ===== Scroll reveal =====
// IMPORTANT: only THIS script hides/reveals sections. We add the
// "js-reveal" class here (not in a separate inline <head> script) so
// hiding and revealing are gated on the exact same code path. If this
// file fails to load or run for any reason (blocked script, restricted
// local/temp-folder browsing, etc.), .reveal elements are never hidden
// in the first place — see the CSS default in styles.css.
document.documentElement.classList.add('js-reveal');
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.12});
  revealEls.forEach(el=> io.observe(el));
  // Safety fallback: if the observer never fires (some restricted/local
  // file environments don't trigger it reliably), force-reveal everything
  // after a short delay so content is never permanently invisible.
  setTimeout(()=>{
    revealEls.forEach(el=> el.classList.add('in'));
  }, 1000);
} else {
  revealEls.forEach(el=> el.classList.add('in'));
}

// ===== Marquee duplication (seamless loop) =====
document.querySelectorAll('.marquee-track').forEach(track=>{
  track.innerHTML += track.innerHTML;
});

// ===== Header search toggle (all pages) =====
(function(){
  const toggle = document.getElementById('navSearchToggle');
  const panel = document.getElementById('navSearchPanel');
  const input = document.getElementById('navSearchInput');
  const form = document.getElementById('navSearchForm');
  if(!toggle || !panel) return;

  function closePanel(){
    panel.classList.remove('open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded','false');
  }
  function openPanel(){
    panel.classList.add('open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded','true');
    if(input){ setTimeout(()=>input.focus(), 60); }
  }

  toggle.addEventListener('click', (e)=>{
    e.stopPropagation();
    if(panel.classList.contains('open')){ closePanel(); } else { openPanel(); }
  });
  document.addEventListener('click', (e)=>{
    if(panel.classList.contains('open') && !panel.contains(e.target) && !toggle.contains(e.target)){
      closePanel();
    }
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ closePanel(); }
  });
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const q = (input && input.value || '').trim();
      window.location.href = 'products.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    });
  }
})();

// ===== Homepage hero search box =====
(function(){
  const form = document.getElementById('heroSearchForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const qInput = document.getElementById('heroSearchInput');
    const catSelect = document.getElementById('heroSearchCategory');
    const q = (qInput && qInput.value || '').trim();
    const cat = catSelect ? catSelect.value : 'all';
    const params = new URLSearchParams();
    if(cat && cat !== 'all') params.set('category', cat);
    if(q) params.set('q', q);
    window.location.href = 'products.html' + (params.toString() ? ('?' + params.toString()) : '');
  });
})();

// ===== Mobile nav search =====
(function(){
  const form = document.getElementById('mobileSearchForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const input = document.getElementById('mobileSearchInput');
    const q = (input && input.value || '').trim();
    window.location.href = 'products.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
  });
})();

// ===== Product filter + search (products.html) =====
(function(){
  const grid = document.getElementById('product-grid');
  if(!grid) return;
  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const chips = document.querySelectorAll('.filter-chip');
  const search = document.getElementById('product-search');
  const emptyState = document.getElementById('empty-state');
  const countLabel = document.getElementById('result-count');
  let activeCat = 'all';

  function applyFilters(){
    const q = (search && search.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card=>{
      const cat = card.dataset.category;
      const name = card.dataset.name.toLowerCase();
      const matchesCat = activeCat === 'all' || cat === activeCat;
      const matchesSearch = !q || name.includes(q);
      const show = matchesCat && matchesSearch;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    if(emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    if(countLabel) countLabel.textContent = visible + (visible === 1 ? ' product' : ' products');
  }

  chips.forEach(chip=>{
    chip.addEventListener('click', ()=>{
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.filter;
      applyFilters();
    });
  });
  if(search){ search.addEventListener('input', applyFilters); }

  // Pre-fill from query string, e.g. products.html?category=valves&q=ball+valve
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('category');
  const presearch = params.get('q');
  if(presearch && search){ search.value = presearch; }
  if(preselect){
    const chip = Array.from(chips).find(c=>c.dataset.filter === preselect);
    if(chip){
      chips.forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.filter;
    }
  }
  applyFilters();
})();

// ===== Product detail tabs =====
(function(){
  const tabBtns = document.querySelectorAll('.tab-btn');
  if(!tabBtns.length) return;
  tabBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });
})();

// ===== Contact form (demo submit — no backend) =====
(function(){
  const form = document.getElementById('rfq-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    form.style.display = 'none';
    const success = document.getElementById('form-success');
    if(success) success.classList.add('show');
  });
})();

// ===== Animated counters (numbers section) =====
(function(){
  const counters = document.querySelectorAll('[data-count]');
  if(!counters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      const target = el.dataset.count;
      const numMatch = target.match(/[\d.]+/);
      if(!numMatch){ io.unobserve(el); return; }
      const num = parseFloat(numMatch[0]);
      const suffix = target.replace(numMatch[0], '');
      let cur = 0;
      const steps = 40;
      const inc = num/steps;
      const timer = setInterval(()=>{
        cur += inc;
        if(cur >= num){ cur = num; clearInterval(timer); }
        el.textContent = (Number.isInteger(num) ? Math.round(cur) : cur.toFixed(1)) + suffix;
      }, 30);
      io.unobserve(el);
    });
  }, {threshold:.4});
  counters.forEach(el=> io.observe(el));
})();

// ===== Product media toggle (Photo / Diagram) =====
(function(){
  document.querySelectorAll('.pd-media').forEach(function(media){
    const tabs = media.querySelectorAll('.pd-media-tab');
    const imgs = media.querySelectorAll('.pd-media-img');
    tabs.forEach(function(tab){
      tab.addEventListener('click', function(){
        const target = tab.dataset.target;
        tabs.forEach(t=> t.classList.toggle('active', t===tab));
        imgs.forEach(function(img){
          img.classList.toggle('active', img.dataset.view === target);
        });
      });
    });
  });
})();

// ===== 3D mouse-tilt (hero visuals, product/industry cards, images) =====
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(pointer:fine)').matches) return; // skip touch devices

  function bindTilt(el, max, scale){
    el.classList.add('tilt-el');
    let raf = null;
    el.addEventListener('mouseenter', ()=> el.classList.add('tilting'));
    el.addEventListener('mousemove', function(e){
      if(raf) return;
      raf = requestAnimationFrame(function(){
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;    // 0..1
        const rx = (0.5 - py) * (max * 2);
        const ry = (px - 0.5) * (max * 2);
        el.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' + scale + ')';
        raf = null;
      });
    });
    el.addEventListener('mouseleave', function(){
      el.classList.remove('tilting');
      el.style.transform = '';
    });
  }

  const targets = [
    ['.hero-visual .frame', 7, 1.025],
    ['.product-card', 4, 1.015],
    ['.industry-card', 5, 1.02],
    ['.split-media img, .story-media img', 4, 1.015],
    ['.pd-media-img.active, .pd-gallery-main', 5, 1.015],
    ['.qnode', 4, 1.02],
    ['.process-icon', 10, 1.08]
  ];
  targets.forEach(function(t){
    document.querySelectorAll(t[0]).forEach(function(el){ bindTilt(el, t[1], t[2]); });
  });
})();

// ===== Mega menu (Products + Industries nav) =====
(function(){
  const items = document.querySelectorAll('.nav-item-mega');
  if(!items.length) return;

  items.forEach(function(item){
    const trigger = item.querySelector('.nav-mega-trigger');
    const catBtns = item.querySelectorAll('.mega-cat');
    const panels = item.querySelectorAll('.mega-panel');

    function activatePanel(key){
      catBtns.forEach(b=> b.classList.toggle('active', b.dataset.panel === key));
      panels.forEach(p=> p.classList.toggle('active', p.dataset.panel === key));
    }
    catBtns.forEach(function(btn){
      btn.addEventListener('mouseenter', function(){ activatePanel(btn.dataset.panel); });
      btn.addEventListener('click', function(e){
        e.preventDefault();
        activatePanel(btn.dataset.panel);
      });
    });

    // On desktop, hover already opens the dropdown via CSS, so a click on
    // the "Products"/"Industries" text should just navigate to that page
    // like a normal link. On touch/small screens (no hover), the first tap
    // opens the dropdown instead of navigating immediately; tapping the
    // already-open trigger (or its arrow) navigates through.
    trigger.addEventListener('click', function(e){
      if(!window.matchMedia('(min-width:1024px)').matches && !item.classList.contains('open')){
        e.preventDefault();
        items.forEach(i=> i.classList.remove('open'));
        item.classList.add('open');
      }
    });
    document.addEventListener('click', function(e){
      if(!item.contains(e.target)) item.classList.remove('open');
    });
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') items.forEach(i=> i.classList.remove('open'));
  });
})();

// ===== Homepage product carousel (auto-play + prev/next buttons) =====
(function(){
  var carousel = document.querySelector('.pcarousel');
  if(!carousel) return;
  var track = carousel.querySelector('.pcarousel-track');
  var prevBtn = carousel.querySelector('.pcarousel-prev');
  var nextBtn = carousel.querySelector('.pcarousel-next');
  var cards = Array.from(track.children);
  if(!cards.length) return;

  function cardStep(){
    var card = cards[0];
    var style = window.getComputedStyle(track);
    var gap = parseFloat(style.columnGap || style.gap || 0) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function atStart(){ return track.scrollLeft <= 4; }
  function atEnd(){ return track.scrollLeft >= track.scrollWidth - track.clientWidth - 4; }

  function updateButtons(){
    if(prevBtn) prevBtn.disabled = atStart();
    if(nextBtn) nextBtn.disabled = atEnd();
  }

  function goNext(){
    if(atEnd()){
      track.scrollTo({left:0, behavior:'smooth'});
    } else {
      track.scrollBy({left:cardStep(), behavior:'smooth'});
    }
  }
  function goPrev(){
    if(atStart()){
      track.scrollTo({left:track.scrollWidth, behavior:'smooth'});
    } else {
      track.scrollBy({left:-cardStep(), behavior:'smooth'});
    }
  }

  if(nextBtn) nextBtn.addEventListener('click', function(){ goNext(); resetAutoplay(); });
  if(prevBtn) prevBtn.addEventListener('click', function(){ goPrev(); resetAutoplay(); });

  track.addEventListener('scroll', function(){
    window.requestAnimationFrame(updateButtons);
  }, {passive:true});

  // Autoplay: advance every 4s, pause on hover/touch/focus
  var AUTOPLAY_MS = 4000;
  var timer = null;
  function startAutoplay(){
    stopAutoplay();
    timer = setInterval(goNext, AUTOPLAY_MS);
  }
  function stopAutoplay(){
    if(timer){ clearInterval(timer); timer = null; }
  }
  function resetAutoplay(){
    startAutoplay();
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', stopAutoplay, {passive:true});
  carousel.addEventListener('touchend', function(){ setTimeout(startAutoplay, 2000); });
  track.addEventListener('focusin', stopAutoplay);
  track.addEventListener('focusout', startAutoplay);

  document.addEventListener('visibilitychange', function(){
    if(document.hidden) stopAutoplay(); else startAutoplay();
  });

  updateButtons();
  startAutoplay();
})();

/* ===== FAQ accordion — only one item open at a time ===== */
(function(){
  const faqItems = document.querySelectorAll('.faq-list .faq-item');
  if(!faqItems.length) return;
  faqItems.forEach(item=>{
    item.addEventListener('toggle', function(){
      if(item.open){
        faqItems.forEach(other=>{
          if(other !== item) other.open = false;
        });
      }
    });
  });
})();
