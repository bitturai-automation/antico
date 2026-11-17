"""Site layout map + link rewriting.

New structure (only index.html lives in the site root):
  index.html
  pages/            about, contact, blog, privacy-policy, terms-conditions
  pages/applications/<industry>.html
  pages/products/index.html       (all-products listing)
  pages/products/<product-id>.html
  css/  js/  images/  catalogue/  tools/
"""
import re

PAGES = {'about', 'contact', 'blog', 'privacy-policy', 'terms-conditions'}
APPS = {'chemical-processing', 'pharmaceutical', 'petrochemical', 'fertilizer',
        'specialty-chemicals', 'process-manufacturing'}

def new_path(old):
    """old flat file name (e.g. 'product-ball-valve.html') -> path from site root."""
    if old == 'index.html': return 'index.html'
    if old == 'products.html': return 'pages/products/index.html'
    m = re.match(r'^product-(.+)\.html$', old)
    if m: return f'pages/products/{m.group(1)}.html'
    name = old[:-5] if old.endswith('.html') else old
    if old.endswith('.html') and name in PAGES: return f'pages/{old}'
    if old.endswith('.html') and name in APPS: return f'pages/applications/{old}'
    return old                      # css/, js/, images/, catalogue/ stay where they are

def depth(path):
    return path.count('/')

def prefix_for(path):
    return '../' * depth(path)

_SKIP = re.compile(r'^(https?:|//|#|mailto:|tel:|data:|javascript:|\s*$)', re.I)
_ATTR = re.compile(r'''(\b(?:href|src|data-src)=)(["'])(.*?)\2''', re.S)

def _fix(val, pre):
    if _SKIP.match(val): return val
    m = re.match(r'^([^#?]*)([#?].*)?$', val, re.S)
    base, tail = m.group(1), m.group(2) or ''
    return pre + new_path(base) + tail

def rebase(html, dest_path):
    """Rewrite every relative href/src/data-src (written relative to the OLD flat
    root) so it is correct for a page that will live at dest_path."""
    pre = prefix_for(dest_path)
    html = _ATTR.sub(lambda m: f'{m.group(1)}{m.group(2)}{_fix(m.group(3), pre)}{m.group(2)}', html)
    html = re.sub(r'("image": ")(images/)', lambda m: m.group(1) + pre + m.group(2), html)
    if pre:   # tell the shared JS where the site root is
        html = html.replace('</head>', f'<script>window.SITE_ROOT="{pre}";</script>\n</head>', 1)
    return html
