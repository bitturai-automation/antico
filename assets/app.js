// ===== Hero slider =====
(function(){
  const slider = document.getElementById('heroSlider');
  if(!slider) return;
  const track = slider.querySelector('.hero-track');
  const slides = Array.from(slider.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');
  const total = slides.length;
  if(total < 2) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = null;
  const AUTOPLAY_MS = 6000;

  function goTo(i){
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * (100/total)}%)`;
    slides.forEach((s,n)=> s.classList.toggle('is-active', n===index));
    dots.forEach((d,n)=> d.classList.toggle('is-active', n===index));
  }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }
  function startAutoplay(){
    if(reduceMotion) return;
    stopAutoplay();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stopAutoplay(){ if(timer){ clearInterval(timer); timer = null; } }

  nextBtn && nextBtn.addEventListener('click', ()=>{ next(); startAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', ()=>{ prev(); startAutoplay(); });
  dots.forEach((d,n)=> d.addEventListener('click', ()=>{ goTo(n); startAutoplay(); }));

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let touchStartX = 0, touchDeltaX = 0, touching = false;
  slider.addEventListener('touchstart', (e)=>{
    touching = true; touchStartX = e.touches[0].clientX; touchDeltaX = 0; stopAutoplay();
  }, {passive:true});
  slider.addEventListener('touchmove', (e)=>{
    if(!touching) return; touchDeltaX = e.touches[0].clientX - touchStartX;
  }, {passive:true});
  slider.addEventListener('touchend', ()=>{
    if(!touching) return; touching = false;
    if(Math.abs(touchDeltaX) > 40){ touchDeltaX < 0 ? next() : prev(); }
    startAutoplay();
  });

  goTo(0);
  startAutoplay();
})();

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

  // Pre-select category from query string, e.g. products.html?category=valves
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('category');
  if(preselect){
    const chip = Array.from(chips).find(c=>c.dataset.filter === preselect);
    if(chip){ chip.click(); }
  } else {
    applyFilters();
  }
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
