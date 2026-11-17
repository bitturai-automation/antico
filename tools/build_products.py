#!/usr/bin/env python3
"""Generates one static showcase page per product into pages/products/<id>.html
from js/products-data.js.   Run from anywhere:  python3 tools/build_products.py"""
import re, json, html, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from product_copy import COPY, GROUP_FEATURES, INSTALL, INSTALL_EXTRA, QUALITY, LINING
from layout import rebase

ROOT = os.path.dirname(HERE)
os.chdir(ROOT)                       # all paths below are relative to the site root
raw = open('js/products-data.js', encoding='utf-8').read()
P = json.loads(re.search(r'window.PRODUCTS=(\[.*\]);\nwindow.FLANGE', raw, re.S).group(1))
GRP = json.loads(re.search(r'window.PRODUCT_GROUPS=(\{.*?\});', raw).group(1))
CATS = json.loads(re.search(r'window.PRODUCT_CATEGORIES=(\{.*?\});', raw).group(1))
BYID = {p['id']: p for p in P}

E = lambda s: html.escape(str(s), quote=True)
ARROW = '<svg fill="none" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24" width="16"><line x1="5" x2="19" y1="12" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>'
DL = '<svg fill="none" height="16" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" viewBox="0 0 24 24" width="16"><path d="M12 3v12"></path><polyline points="7 11 12 16 17 11"></polyline><path d="M5 20h14"></path></svg>'

# ---- header / footer from about.html -------------------------------------
about = open('tools/template-about.html', encoding='utf-8').read()   # flat-link header/footer template
HEAD, rest = about.split('<main id="top">', 1)
FOOT = rest.split('</main>', 1)[1]
HEAD = HEAD.replace(' is-current" href="about.html" aria-current="page"', '" href="about.html"')
HEAD = HEAD.replace('<a class=" is-current" href="about.html">', '<a class="" href="about.html">')
HEAD = HEAD.replace('<a class="hdr-link" href="products.html">', '<a class="hdr-link is-current" href="products.html" aria-current="page">')
HEAD = HEAD.replace('<a class="" href="products.html">', '<a class="" href="products.html">')
HEAD = HEAD.replace('<link href="css/pages.css" rel="stylesheet"/>',
  '<link href="css/products.css" rel="stylesheet"/>\n<link href="css/product-detail.css" rel="stylesheet"/>')
FOOT = FOOT.replace('<script src="js/header.js"></script>',
  '<script src="js/header.js"></script>\n<script src="js/product-detail.js"></script>')

def spec_union(p):
    if p.get('variants'):
        out = []
        for v in p['variants']:
            out += v.get('spec', [])
        return list(dict.fromkeys(out))
    return p.get('spec', [])

def nb_line(p):
    for s in spec_union(p):
        if s.startswith('NB '): return s
    return ''

def liner_list(p):
    # same rule as the listing page: linings actually offered in the size table
    seen = set()
    for r in p.get('rows') or []:
        seen.update(r.get('m', []))
    return [l for l in ('PTFE', 'PFA', 'FEP') if l in seen]

def li(items):
    out = []
    for i in items:
        if isinstance(i, str): out.append(f'<li>{E(i)}</li>')
        else: out.append(f'<li>{E(i[0])}: ' + ', '.join(E(x) for x in i[1]) + '</li>')
    return ''.join(out)

def req_text(items):
    out = []
    for i in items:
        if isinstance(i, str): out.append(i)
        else: out.append(f'{i[0]} ({", ".join(i[1])})')
    return out

def build(p, idx):
    pid = p['id']; name = p['name']; grp = p['grp']; gname = GRP[grp]
    tagline, desc = COPY[pid]
    lin = liner_list(p)
    specs = spec_union(p)
    page_no = p['page'] if isinstance(p['page'], int) else p['page'][0]
    cat_ref = f"Catalogue page {page_no-2}" if isinstance(p['page'], int) else f"Catalogue pages {p['page'][0]-2}–{p['page'][-1]-2}"

    # ----- gallery -----
    views = [(im, f'{name}', 'Product') for im in p['images']]
    if p.get('variants'):
        views = [(im, p['variants'][k]['title'] if k < len(p['variants']) else name, p['variants'][k]['title'] if k < len(p['variants']) else 'Product') for k, im in enumerate(p['images'])]
    if p.get('drawing'): views.append((p['drawing'], f'Technical drawing — {name}', 'Drawing'))
    stage = f'<img id="pdStageImg" alt="{E(views[0][1])}" src="images/products/{E(views[0][0])}" width="900" height="675"/>'
    thumbs = ''.join(
        f'<button type="button" class="pd-thumb{" is-on" if k==0 else ""}" data-src="images/products/{E(v[0])}" data-alt="{E(v[1])}" aria-label="Show {E(v[2])} view"><img alt="" loading="lazy" src="images/products/{E(v[0])}"/><span>{E(v[2])}</span></button>'
        for k, v in enumerate(views)) if len(views) > 1 else ''

    chips = ''.join(f'<span>{E(s)}</span>' for s in specs[:4])
    linchips = ''.join(f'<span class="pd-lin">{E(l)}</span>' for l in lin)

    # ----- features -----
    feats = list(GROUP_FEATURES[grp])
    if nb_line(p):
        feats.append(("Size range", f"{nb_line(p)}. Larger or special sizes can be made on request."))
    elif specs:
        feats.append(("Specification", specs[0] + "."))
    if lin:
        feats.append(("Choice of lining", f"Available in {' / '.join(lin)}, depending on size. Confirm the right one for your media with our engineers."))
    feat_html = ''.join(f'<div class="pd-feat"><span class="pd-fn">{k+1:02d}</span><h3>{E(t)}</h3><p>{E(x)}</p></div>' for k, (t, x) in enumerate(feats))

    # ----- construction -----
    def mats_of(b): return b.get('mat') or []
    mat_blocks = ''
    if p.get('variants'):
        for v in p['variants']:
            mat_blocks += f'<h3 class="pd-sub">{E(v["title"])}</h3><div class="pd-mats">' + ''.join(
                f'<div class="pd-mat"><h4>{E(m[0])}</h4><ul>{"".join("<li>"+E(x)+"</li>" for x in m[1])}</ul></div>' for m in mats_of(v)) + '</div>'
    else:
        mat_blocks = '<div class="pd-mats">' + ''.join(
            f'<div class="pd-mat"><span class="pd-mn">{k+1}</span><h4>{E(m[0])}</h4><ul>{"".join("<li>"+E(x)+"</li>" for x in m[1])}</ul></div>' for k, m in enumerate(mats_of(p))) + '</div>'
    spec_list = ''.join(f'<li>{E(s)}</li>' for s in specs)
    reqs = []
    if p.get('variants'):
        for v in p['variants']:
            reqs += req_text(v.get('req', []))
    else:
        reqs = req_text(p.get('req', []))
    reqs = list(dict.fromkeys(reqs))
    req_html = ''.join(f'<li>{E(r)}</li>' for r in reqs)

    # ----- spec / configurator -----
    rows = p.get('rows') or []
    cols = p.get('cols') or []
    has_cfg = bool(rows and cols)
    size_cols = 0
    if has_cfg:
        for c in cols:
            if c.startswith('Size'): size_cols += 1
            else: break
        if size_cols == 0: size_cols = 1
    data = {'id': pid, 'name': name, 'cols': cols, 'rows': rows, 'lin': lin, 'sizeCols': size_cols}
    note = E(p['note']) if p.get('note') else ''

    cfg = ''
    if has_cfg:
        sel = ''.join(
            f'<div class="pd-field"><label for="pdSize{i}">{E(cols[i])}</label><select id="pdSize{i}"></select></div>'
            for i in range(size_cols))
        cfg = f'''<div class="pd-config" id="configure">
<h3>Build your enquiry</h3>
<p class="pd-config-sub">Pick a size and lining. We add them to your quote request.</p>
<div class="pd-fields">{sel}</div>
<div class="pd-field"><span class="pd-label">Lining</span><div class="pd-linpick" id="pdLinPick"></div></div>
<div class="pd-field"><label for="pdQty">Quantity</label><input id="pdQty" type="number" min="1" inputmode="numeric" placeholder="e.g. 10"/></div>
<div class="pd-dims" id="pdDims" aria-live="polite"></div>
<div class="pd-config-actions"><a class="btn btn-primary" id="pdQuote" href="contact.html?product={E(pid)}">Add to Quote <span class="btn-arrow">→</span></a><button class="btn btn-outline" id="pdCopy" type="button">Copy specification</button></div>
<p class="pd-copied" id="pdCopied" role="status"></p>
</div>'''
    else:
        cfg = f'''<div class="pd-config" id="configure"><h3>Dimensions on request</h3>
<p class="pd-config-sub">{note or "This product is made to your drawing. Send us your requirement and our engineers will confirm dimensions."}</p>
<div class="pd-config-actions"><a class="btn btn-primary" href="contact.html?product={E(pid)}">Request a Quote <span class="btn-arrow">→</span></a></div></div>'''

    drawing_card = ''
    if p.get('drawing'):
        drawing_card = f'<figure class="pd-drawing"><a href="images/products/{E(p["drawing"])}" target="_blank" rel="noopener" aria-label="Open the technical drawing in a new tab"><img alt="Technical drawing of {E(name)}" loading="lazy" src="images/products/{E(p["drawing"])}"/></a><figcaption>Technical drawing · tap to enlarge</figcaption></figure>'
    else:
        drawing_card = f'<figure class="pd-drawing"><img alt="{E(name)}" loading="lazy" src="images/products/{E(p["images"][0])}"/><figcaption>Product view</figcaption></figure>'

    fulltable = ''
    if has_cfg:
        fulltable = '<details class="pd-table"><summary>View the full size table <span>' + str(len(rows)) + ' sizes</span></summary><div class="tbl-wrap"><table class="ptbl" id="pdTable"></table></div><p class="tbl-legend">Dimensions in mm unless stated. “•” = lining available for that size.</p></details>'

    # ----- lining -----
    lin_cards = ''
    for key in ('PTFE', 'PFA', 'FEP'):
        t, full, std = LINING[key]
        on = key in lin
        lin_cards += f'<div class="pd-lc{" is-on" if on else " is-off"}"><span class="pd-lc-tag">{t}</span><h3>{E(full)}</h3><p>{E(std)}</p><span class="pd-lc-st">{"Available on this product" if on else "Not offered on this product"}</span></div>'
    lin_note = ''
    if not lin:
        lin_cards = '<div class="pd-lc is-on pd-lc-wide"><span class="pd-lc-tag">PTFE</span><h3>Made to your drawing</h3><p>The lining and materials for this product are agreed with our engineers against your duty conditions.</p></div>'

    # ----- installation -----
    steps = list(INSTALL)
    if grp in INSTALL_EXTRA: steps.insert(2, INSTALL_EXTRA[grp])
    inst_html = ''.join(f'<li><span>{k+1:02d}</span><div><h4>{E(t)}</h4><p>{E(x)}</p></div></li>' for k, (t, x) in enumerate(steps))
    qual_html = ''.join(f'<div class="pd-q"><span>{k+1:02d}</span><h4>{E(t)}</h4><p>{E(x)}</p></div>' for k, (t, x) in enumerate(QUALITY))

    # ----- downloads -----
    dl = f'''<a class="pd-dl" href="catalogue/Ablaze_Product_Catalogue.pdf" download><span class="pd-dl-ic">{DL}</span><div><small>PRIMARY DOCUMENT</small><h4>Product Catalogue</h4><p>PDF · {E(cat_ref)}</p></div></a>'''
    if p.get('drawing'):
        dl += f'<a class="pd-dl" href="images/products/{E(p["drawing"])}" target="_blank" rel="noopener"><span class="pd-dl-ic">{ARROW}</span><div><small>DRAWING</small><h4>Technical Drawing</h4><p>View the dimensioned drawing</p></div></a>'
    subj = E(f'Request datasheet - {name}').replace(' ', '%20')
    dl += f'<a class="pd-dl" href="mailto:mkt.anticoflowsystem@gmail.com?subject={subj}"><span class="pd-dl-ic">{ARROW}</span><div><small>ON REQUEST</small><h4>Datasheet &amp; 3D model</h4><p>Ask our team for project documents</p></div></a>'
    dl += f'<a class="pd-dl" href="contact.html?product={E(pid)}"><span class="pd-dl-ic">{ARROW}</span><div><small>ENQUIRY</small><h4>Technical enquiry</h4><p>Send media, temperature and pressure</p></div></a>'

    # ----- FAQ -----
    faqs = []
    faqs.append((f"What is the {name} used for?", f"{desc}"))
    if nb_line(p):
        faqs.append(("What size range is available?", f"{nb_line(p)}. Larger or special sizes can be made on request."))
    if lin:
        faqs.append(("Which lining materials are available?", f"{', '.join(lin)}. Availability can depend on size, so check the size table above. Our engineers can help you match the lining to your media, temperature and pressure."))
    if mats_of(p) or any(mats_of(v) for v in p.get('variants', [])):
        ms = p['mat'] if p.get('mat') else p['variants'][0]['mat']
        faqs.append(("What is it made from?", '; '.join(f"{m[0]}: {', '.join(m[1])}" for m in ms) + '.'))
    if reqs:
        faqs.append(("What else can be supplied on request?", '; '.join(reqs) + '.'))
    faqs.append(("Can I order a size or version that is not listed?", "Yes. Send us your drawing and requirements through the quote form, and our engineers will confirm what we can make."))
    faqs.append(("How do I get a quotation?", "Use the Add to Quote button on this page, or send us your line drawing, fluid data and duty conditions through the quote form."))
    faq_html = ''.join(f'<details class="pd-faq"><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in faqs)
    faq_ld = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}, ensure_ascii=False).replace('</', '<\\/')
    prod_ld = json.dumps({"@context": "https://schema.org", "@type": "Product", "name": name, "description": desc,
        "image": f"images/products/{p['images'][0]}", "category": gname,
        "brand": {"@type": "Brand", "name": "Antico Flow System"}}, ensure_ascii=False).replace('</', '<\\/')

    # ----- related -----
    rel = [q for q in P if q['grp'] == grp and q['id'] != pid]
    n = len(P)
    # order by proximity in catalogue
    rel.sort(key=lambda q: abs(q['n'] - p['n']))
    rel = rel[:4]
    if len(rel) < 4:
        extra = [q for q in P if q['id'] != pid and q not in rel]
        extra.sort(key=lambda q: abs(q['n'] - p['n']))
        rel += extra[:4 - len(rel)]
    def card(q):
        tags = ''.join(f'<span class="tag">{t}</span>' for t in (q.get('lin') or []))
        return (f'<a class="pc" href="product-{E(q["id"])}.html"><div class="pc-img"><img loading="lazy" alt="{E(q["name"])}" src="images/products/{E(q["images"][0])}"/><div class="p-tech-line"></div></div>'
                f'<div class="p-body"><div class="p-eyebrow">{q["n"]:02d} · {E(GRP[q["grp"]]).upper()}</div><h3 class="p-title">{E(q["name"])}</h3>'
                f'<div class="pc-meta">{E(nb_line(q))}</div><div class="pc-tags">{tags}</div><span class="p-link">View Details {ARROW}</span></div></a>')
    rel_html = ''.join(card(q) for q in rel)
    prev = P[(idx - 1) % len(P)]; nxt = P[(idx + 1) % len(P)]

    title = f'{name} — Antico Flow System'
    meta = f'{tagline} {desc}'[:300]
    head = HEAD
    head = re.sub(r'<title>.*?</title>', f'<title>{E(title)}</title>', head, flags=re.S)
    head = re.sub(r'<meta content="Antico Flow System designs[^>]*name="description"/>', f'<meta content="{E(meta)}" name="description"/>', head)
    head = head.replace('</head>', f'<script type="application/ld+json">{prod_ld}</script>\n<script type="application/ld+json">{faq_ld}</script>\n</head>')

    main = f'''<main id="top">
<section class="ap-hero pd-hero">
<div class="container pd-hero-grid">
<div class="pd-hero-text">
<nav aria-label="Breadcrumb" class="ap-crumbs"><a href="index.html">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><a href="products.html?category={E(grp)}">{E(gname)}</a><span>/</span><b>{E(name)}</b></nav>
<div class="eyebrow">{E(gname).upper()}</div>
<h1>{E(name)}</h1>
<p class="pd-tag">{E(tagline)}</p>
<p class="ap-lead">{E(desc)}</p>
<div class="pd-chips">{chips}</div>
<div class="pd-lins">{linchips}</div>
<div class="ap-actions"><a class="btn btn-primary" href="#configure">Configure &amp; Quote <span class="btn-arrow">→</span></a><a class="btn btn-outline" href="catalogue/Ablaze_Product_Catalogue.pdf" download>Download Catalogue</a></div>
</div>
<div class="pd-gallery">
<div class="pd-stage">{stage}</div>
<div class="pd-thumbs">{thumbs}</div>
</div>
</div>
</section>

<nav class="pd-subnav" id="pdSubnav" aria-label="On this page"><div class="container pd-subnav-in">
<a href="#overview">Overview</a><a href="#features">Features</a><a href="#construction">Construction</a><a href="#specifications">Specifications</a><a href="#lining">Lining</a><a href="#installation">Installation</a><a href="#quality">Quality</a><a href="#downloads">Downloads</a><a href="#faq">FAQ</a>
</div></nav>

<section class="pd-sec" id="overview"><div class="container pd-intro">
<div><div class="eyebrow">OVERVIEW</div><h2 class="section-title">Built for corrosive service.</h2></div>
<div><p>{E(desc)}</p><p>Every Antico lined component is made in-house to your approved drawing and inspected before dispatch. {E(cat_ref)} of our product catalogue.</p></div>
</div></section>

<section class="pd-sec pd-tint" id="features"><div class="container">
<div class="eyebrow">KEY FEATURES</div><h2 class="section-title">What you get with this product.</h2>
<div class="pd-feats">{feat_html}</div>
</div></section>

<section class="pd-sec" id="construction"><div class="container">
<div class="eyebrow">CONSTRUCTION</div><h2 class="section-title">Materials and specification.</h2>
<p class="section-body">Materials follow the standards listed here. Alternatives are available on request.</p>
<div class="pd-con">
<div>{mat_blocks}</div>
<aside class="pd-spec-card"><h3>Specification</h3><ul>{spec_list}</ul>{('<h3 class="pd-req-h">Available on request</h3><ul>'+req_html+'</ul>') if req_html else ''}</aside>
</div>
</div></section>

<section class="pd-sec pd-tint" id="specifications"><div class="container">
<div class="eyebrow">TECHNICAL SPECIFICATIONS</div><h2 class="section-title">Choose a size and see its dimensions.</h2>
<p class="section-body">Dimensions come from our product catalogue. Final dimensions are confirmed in writing before manufacture.</p>
<div class="pd-spec-grid">
{drawing_card}
{cfg}
</div>
{fulltable}
{('<div class="pm-note pd-note">'+note+'</div>') if (note and has_cfg) else ''}
</div></section>

<section class="pd-sec" id="lining"><div class="container">
<div class="eyebrow">LINING MATERIALS</div><h2 class="section-title">Match the lining to your media.</h2>
<p class="section-body">Final choice depends on the chemical, temperature and pressure of your process. Tell us your duty conditions and our engineers will recommend the right lining.</p>
<div class="pd-lcs">{lin_cards}</div>
<p class="tbl-legend">* Conductive black PTFE or PFA.</p>
</div></section>

<section class="pd-sec pd-tint" id="installation"><div class="container pd-two">
<div><div class="eyebrow">INSTALLATION</div><h2 class="section-title">Handle with care, fit with care.</h2>
<p class="section-body">General good practice for lined equipment. Follow the installation advice supplied with your order where it differs.</p></div>
<ol class="pd-steps">{inst_html}</ol>
</div></section>

<section class="pd-sec pd-dark" id="quality"><div class="container">
<div class="eyebrow">QUALITY</div><h2 class="section-title">Tested before it reaches your plant.</h2>
<p class="section-body">Every lined component passes through inspection before dispatch. Certificates and test documents are available for review.</p>
<div class="pd-qs">{qual_html}</div>
<a class="btn btn-white pd-q-btn" href="contact.html?product={E(pid)}">Ask for documents <span class="btn-arrow">→</span></a>
</div></section>

<section class="pd-sec" id="downloads"><div class="container">
<div class="eyebrow">DOWNLOAD CENTRE</div><h2 class="section-title">Technical documents.</h2>
<div class="pd-dls">{dl}</div>
</div></section>

<section class="pd-sec pd-tint" id="faq"><div class="container pd-two">
<div><div class="eyebrow">FAQ</div><h2 class="section-title">Common questions.</h2></div>
<div class="pd-faqs">{faq_html}</div>
</div></section>

<section class="ap-cta">
<div class="container ap-cta-in">
<div><h2>Need the {E(name)} for your line?</h2><p>Tell us the media, temperature, pressure and sizes. Our engineers will confirm the right lining and components.</p></div>
<a class="btn btn-white" href="contact.html?product={E(pid)}">Request a Quote <span class="btn-arrow">→</span></a>
</div>
</section>

<section class="pd-sec pd-related"><div class="container">
<div class="eyebrow">YOU MAY ALSO NEED</div><h2 class="section-title">Related products.</h2>
<div class="pp-grid pd-rel-grid">{rel_html}</div>
<div class="pd-pn"><a href="product-{E(prev['id'])}.html"><small>Previous product</small>← {E(prev['name'])}</a><a href="product-{E(nxt['id'])}.html"><small>Next product</small>{E(nxt['name'])} →</a></div>
</div></section>
</main>
<script>window.PD={json.dumps(data, ensure_ascii=False).replace('</','<\\/')};</script>'''
    out = head + main + FOOT
    dest = f'pages/products/{pid}.html'
    os.makedirs('pages/products', exist_ok=True)
    open(dest, 'w', encoding='utf-8').write(rebase(out, dest))

for i, p in enumerate(P):
    build(p, i)
print('built', len(P), 'pages')
