"""Rebuilds <main> of About + 6 Application pages (alternating light/dark design).
Reads the page's existing content, so run it on the ORIGINAL pages only once."""
import re, sys, glob, os
from bs4 import BeautifulSoup
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'pages')

ARW = '<svg fill="none" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24" width="16"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
CHECK = '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>'
PHONE = '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/></svg>'
SHIELD = '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>'
BTNS = lambda p: f'<a class="btn btn-primary" href="{p}pages/contact.html">Request a Quote <span class="btn-arrow">→</span></a><a class="btn btn-outline" href="{p}pages/products/index.html">View Products</a>'

def cta(p, h, t):
    return f'''<section class="rd-sec rd-dark rd-cta"><div class="container rd-cta-in"><div><h2>{h}</h2><p>{t}</p></div>
<div class="rd-cta-btns"><a class="btn btn-white" href="{p}pages/contact.html">Request a Quote <span class="btn-arrow">→</span></a><a class="btn btn-ghost-w" href="tel:+919023790640">Call +91 90237 90640</a></div></div></section>'''

def swap_main(path, new_main, css_p=None):
    h = open(path, encoding='utf-8').read()
    h = re.sub(r'<main id="top">.*?</main>', lambda m: new_main, h, flags=re.S)
    if css_p and 'pages.css' not in h:
        h = h.replace(f'<link href="{css_p}css/footer.css" rel="stylesheet"/>', f'<link href="{css_p}css/footer.css" rel="stylesheet"/>\n<link href="{css_p}css/pages.css" rel="stylesheet"/>')
    open(path, 'w', encoding='utf-8').write(h)

# ------------------------------------------------------------------ ABOUT
def about():
    p = '../'
    prods = [('Lined Pipes','Spool, jacketed spool and hose pipes.','3','pipes'),('Lined Fittings','Elbows, tees, reducers, flanges, crosses and spectacle blinds.','15','fittings'),('Lined Valves','Ball, butterfly, plug, diaphragm, non-return and flush bottom valves.','7','valves'),('Expansion Bellows','Moulded and machined high-pressure bellows.','2','bellows'),('Sight Flow Indicators','Double-window and tubular indicators.','2','sight-flow'),('Custom Engineered','Dip pipes, spacers, strainers, headers and special fabricated designs.','14','custom')]
    pc = ''.join(f'<a class="rd-tile reveal" href="{p}pages/products/index.html?category={c}"><span class="rd-n">{n} products</span><h3>{t}</h3><p>{d}</p><span class="p-link">Explore {ARW}</span></a>' for t,d,n,c in prods)
    steps = [('Understand your requirement','We review your line drawings, fluid data and process duty conditions.'),('Engineering & design','Isometric drawings and a complete fitting list are prepared for sign-off.'),('Precision manufacturing','Components are machined, lined and fabricated in-house to spec.'),('Quality inspection','100% dimensional, spark and hydro/pneumatic testing before dispatch.'),('Timely delivery','Packed and dispatched to your site on a confirmed schedule.'),('Technical support','Our engineering team stays available for installation queries.')]
    sc = ''.join(f'<div class="rd-tile reveal"><span class="rd-n">0{i+1}</span><h3>{t}</h3><p>{d}</p></div>' for i,(t,d) in enumerate(steps))
    q = [('Dimensional & visual inspection','Checked against approved drawings on every lined component.'),('Hydrostatic & pneumatic testing','Pressure testing performed on every lined component.'),('Spark testing','High-voltage testing confirms complete liner integrity.'),('Coating inspection','Coating and lining thickness and coverage verified on every component.'),('Certificates & reports','Quality management certificate, material test certificates, inspection and test reports, statutory registrations.')]
    qc = ''.join(f'<div class="rd-q-item reveal">{CHECK}<div><h4>{t}</h4><p>{d}</p></div></div>' for t,d in q)
    inds = [('Chemical Processing','chemical-processing'),('Pharmaceutical','pharmaceutical'),('Petrochemical','petrochemical'),('Fertilizer','fertilizer'),('Specialty Chemicals','specialty-chemicals'),('Process Manufacturing','process-manufacturing')]
    ic = ''.join(f'<a href="{p}pages/applications/{s}.html"><span>{n}</span>{ARW}</a>' for n,s in inds)
    main = f'''<main id="top">
<section class="rd-hero"><div class="container rd-hero-grid">
<div><nav aria-label="Breadcrumb" class="ap-crumbs"><a href="{p}index.html">Home</a><span>/</span><b>About Us</b></nav>
<div class="eyebrow reveal">ABOUT US</div>
<h1>Flow systems engineered to outlast corrosion.</h1>
<p class="ap-lead">Aggressive chemicals shouldn't compromise your operations. Antico designs and builds corrosion-resistant flow solutions, from lined pipes and valves to bellows and custom equipment, to keep critical processes running safely and reliably.</p>
<div class="ap-actions">{BTNS(p)}</div>
<div class="rd-jump" aria-label="On this page"><a href="#who">Who we are</a><a href="#make">What we make</a><a href="#process">How we work</a><a href="#quality">Quality</a><a href="#industries">Industries</a></div></div>
<div class="rd-visual" role="img" aria-label="Industrial chemical process plant with pipes and tanks" style="--img:url('https://images.unsplash.com/photo-1620203853151-496c7228306c?auto=format&fit=crop&w=1400&q=80')"><div class="rd-badge"><i>{SHIELD}</i><div><b>100% tested</b><span>Before every dispatch</span></div></div></div>
</div></section>

<section class="rd-sec rd-dark rd-stats"><div class="container"><div class="rd-stat-grid">
<div class="rd-stat"><span>Linings</span><strong>PTFE · PFA · FEP</strong><small>Fluoropolymer linings</small></div>
<div class="rd-stat"><span>Range</span><strong>43 products</strong><small>Pipes, fittings, valves, bellows and more</small></div>
<div class="rd-stat"><span>Sizes</span><strong>NB ½″ to 16″</strong><small>Lined pipe size range</small></div>
<div class="rd-stat"><span>Testing</span><strong>100% tested</strong><small>Dimensional, spark and pressure</small></div>
</div></div></section>

<section class="rd-sec rd-light" id="who"><div class="container rd-two">
<div class="rd-copy"><div class="eyebrow reveal">WHO WE ARE</div><h2 class="section-title reveal">When corrosion stops production, engineering starts.</h2>
<p>Antico Flow System is based in Vadodara, Gujarat, and supplies fluoropolymer-lined flow systems to the chemical and process industries, where a single leak can stop a plant.</p>
<p>We work from your line drawings, fluid data and duty conditions. Our engineers prepare isometric drawings and a complete fitting list for sign-off. Components are then machined, lined and fabricated in-house to specification.</p>
<p>Every lined component is inspected before dispatch, and our team stays available for installation queries after delivery.</p></div>
<aside class="rd-card ap-facts"><h4>At a glance</h4>
<div class="ap-fact"><span>Based in</span><strong>Vadodara, Gujarat, India</strong></div>
<div class="ap-fact"><span>Linings</span><strong>PTFE, PFA and FEP</strong></div>
<div class="ap-fact"><span>Range</span><strong>Pipes, fittings, valves, bellows, sight flow indicators, custom equipment</strong></div>
<div class="ap-fact"><span>Industries</span><strong>Chemical, pharmaceutical, petrochemical, fertilizer, specialty chemicals, process manufacturing</strong></div>
<a class="rd-contact" href="tel:+919023790640"><span class="ct-ic">{PHONE}</span><span><small>Talk to us</small><strong>+91 90237 90640</strong></span></a>
</aside></div></section>

<section class="rd-sec rd-dark" id="make"><div class="container">
<div class="rd-head"><div class="eyebrow reveal">WHAT WE MAKE</div><h2 class="section-title reveal">One source for the whole flow line.</h2><p class="section-body">Lined components designed to work together, so your pipework, valves and instruments share one standard of corrosion protection.</p></div>
<div class="rd-grid rd-g3">{pc}</div></div></section>

<section class="rd-sec rd-light" id="process"><div class="container">
<div class="rd-head"><div class="eyebrow reveal">HOW WE WORK WITH YOU</div><h2 class="section-title reveal">From your requirement to your plant.</h2></div>
<div class="rd-grid rd-g3">{sc}</div></div></section>

<section class="rd-sec rd-dark" id="quality"><div class="container rd-q">
<div class="rd-sticky"><div class="eyebrow reveal">QUALITY &amp; CERTIFICATION</div><h2 class="section-title reveal">Quality you can verify.</h2><p class="section-body">Every product passes through inspection before it reaches your facility. Our certificates and test documents are available for review, so ask for the copies relevant to your project.</p><a class="btn btn-white" href="{p}pages/contact.html">Ask for documents <span class="btn-arrow">→</span></a></div>
<div class="rd-q-list rd-q-dark">{qc}</div></div></section>

<section class="rd-sec rd-light" id="industries"><div class="container">
<div class="rd-head"><div class="eyebrow reveal">INDUSTRIES</div><h2 class="section-title reveal">Built for demanding applications.</h2></div>
<div class="rd-ind">{ic}</div></div></section>

{cta(p,'Have a line that needs protecting?','Tell us the media, temperature and pressure. Our engineers will recommend the right lining and components.')}
</main>'''
    swap_main(os.path.join(ROOT,'pages','about.html'), main)

# ------------------------------------------------------------------ APPLICATIONS
ICONS = {'chemical-processing':'<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 001.3 2.2h12.4a1.5 1.5 0 001.3-2.2L14 9V3"/><path d="M7.5 15h9"/>',
 'pharmaceutical':'<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M8.7 14.8l6.6-5.6"/>',
 'petrochemical':'<path d="M12 3s6 6.2 6 11a6 6 0 01-12 0c0-4.8 6-11 6-11z"/>',
 'fertilizer':'<path d="M20 4C9 4 4 9 4 15c0 2 1 4 3 5 6 0 13-3 13-16z"/><path d="M4 20c3-6 7-9 12-11"/>',
 'specialty-chemicals':'<path d="M9 3h6M10 3v5l-5 9a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-9V3"/><circle cx="10" cy="15" r="1"/><circle cx="14" cy="17" r="1"/>',
 'process-manufacturing':'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/>'}
NAMES = {'chemical-processing':'Chemical Processing','pharmaceutical':'Pharmaceutical','petrochemical':'Petrochemical','fertilizer':'Fertilizer','specialty-chemicals':'Specialty Chemicals','process-manufacturing':'Process Manufacturing'}
svg = lambda k: f'<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" viewBox="0 0 24 24">{ICONS[k]}</svg>'

def app(slug):
    p = '../../'
    s = BeautifulSoup(open(os.path.join(SRC,'applications',slug+'.html'), encoding='utf-8').read(), 'html.parser')
    name = NAMES[slug]
    h1 = s.select_one('h1').get_text(strip=True)
    lead = s.select_one('.ap-lead').get_text(strip=True)
    img = re.search(r"url\('([^']+)'\)", s.select_one('.ap-hero-img')['style']).group(1)
    ov_title = s.select_one('.ap-overview .section-title').get_text(strip=True)
    paras = ''.join(f'<p>{x.get_text(strip=True)}</p>' for x in s.select('.ap-overview .ap-copy p'))
    facts = [(f.select_one('span').get_text(strip=True), f.select_one('strong').get_text(strip=True)) for f in s.select('.ap-fact')]
    chs = [(c.select_one('h3').get_text(strip=True), c.select_one('p').get_text(strip=True)) for c in s.select('.ap-ch')]
    ch_title = s.select_one('.section-tint .section-title').get_text(strip=True)
    prs = [(a.select_one('h3').get_text(strip=True), a.select_one('p').get_text(strip=True)) for a in s.select('.ap-prod')]
    pr_title = s.select('section')[3].select_one('.section-title').get_text(strip=True)
    cta_h = s.select_one('.ap-cta h2').get_text(strip=True); cta_p = s.select_one('.ap-cta p').get_text(strip=True)
    # stat band: first 4 facts as tiles
    stat = ''.join(f'<div class="rd-stat"><span>{l}</span><strong>{v}</strong></div>' for l,v in facts[:4])
    ctiles = ''.join(f'<div class="rd-tile reveal"><span class="rd-n">0{i+1}</span><h3>{t}</h3><p>{d}</p></div>' for i,(t,d) in enumerate(chs))
    ptiles = ''.join(f'<a class="rd-tile reveal" href="{p}pages/products/index.html"><h3>{t}</h3><p>{d}</p><span class="p-link">View products {ARW}</span></a>' for t,d in prs)
    others = ''.join(f'<a href="{p}pages/applications/{k}.html"><span>{n}</span>{ARW}</a>' for k,n in NAMES.items() if k!=slug)
    main = f'''<main id="top">
<section class="rd-hero"><div class="container rd-hero-grid">
<div><nav aria-label="Breadcrumb" class="ap-crumbs"><a href="{p}index.html">Home</a><span>/</span><a href="{p}index.html#applications">Applications</a><span>/</span><b>{name}</b></nav>
<div class="eyebrow reveal">APPLICATIONS</div><h1>{h1}</h1><p class="ap-lead">{lead}</p>
<div class="ap-actions">{BTNS(p)}</div>
<div class="rd-jump"><a href="#overview">Overview</a><a href="#challenges">Challenges</a><a href="#products">Recommended products</a><a href="#others">Other industries</a></div></div>
<div class="rd-visual" role="img" aria-label="{name} application" style="--img:url('{img}')"><div class="rd-badge"><i>{svg(slug)}</i><div><b>{name}</b><span>PTFE · PFA · FEP lined systems</span></div></div></div>
</div></section>

<section class="rd-sec rd-dark rd-stats"><div class="container"><div class="rd-stat-grid">{stat}</div></div></section>

<section class="rd-sec rd-light" id="overview"><div class="container rd-two">
<div class="rd-copy"><div class="eyebrow reveal">OVERVIEW</div><h2 class="section-title reveal">{ov_title}</h2><div class="reveal">{paras}</div></div>
<aside class="rd-card reveal"><h4>Need advice for {name.lower()}?</h4><p style="font-size:14.5px;margin-top:8px">Share your media, temperature and pressure. Our engineers will recommend the right lining and components.</p>
<a class="btn btn-primary" style="width:100%;margin-top:20px" href="{p}pages/contact.html">Talk to an engineer <span class="btn-arrow">→</span></a>
<a class="rd-contact" href="tel:+919023790640"><span class="ct-ic">{PHONE}</span><span><small>Call us</small><strong>+91 90237 90640</strong></span></a></aside>
</div></section>

<section class="rd-sec rd-dark" id="challenges"><div class="container">
<div class="rd-head"><div class="eyebrow reveal">CHALLENGES</div><h2 class="section-title reveal">{ch_title}</h2></div>
<div class="rd-grid rd-g4">{ctiles}</div></div></section>

<section class="rd-sec rd-light" id="products"><div class="container">
<div class="rd-head"><div class="eyebrow reveal">RECOMMENDED PRODUCTS</div><h2 class="section-title reveal">{pr_title}</h2></div>
<div class="rd-grid rd-g3">{ptiles}</div></div></section>

{cta(p,cta_h,cta_p)}

<section class="rd-sec rd-light" id="others"><div class="container">
<div class="rd-head" style="margin-bottom:32px"><div class="eyebrow reveal">OTHER APPLICATIONS</div><h2 class="section-title reveal">Explore more industries</h2></div>
<div class="rd-ind">{others}</div></div></section>
</main>'''
    swap_main(os.path.join(ROOT,'pages','applications',slug+'.html'), main, '../../')

about()
for k in NAMES: app(k)
print('done')
