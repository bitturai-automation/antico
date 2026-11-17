# Antico website — folder structure

```
index.html                  <- the only page in the root
pages/
  about.html  contact.html  blog.html  privacy-policy.html  terms-conditions.html
  applications/             chemical-processing, pharmaceutical, petrochemical,
                            fertilizer, specialty-chemicals, process-manufacturing
  products/
    index.html              all-products listing
    <product-id>.html       43 product showcase pages (generated)
css/  js/  images/  catalogue/
tools/                      build scripts (not part of the live site)
```

## Editing product pages
Product pages are generated from `js/products-data.js` + `tools/product_copy.py`.
After changing either file, run from anywhere:

    python3 tools/build_products.py

Never edit `pages/products/<id>.html` by hand, as the next build overwrites it.
Header/footer for generated pages come from `tools/template-about.html`.

## Links
Pages in `pages/` use `../`, pages in `pages/products/` and `pages/applications/` use `../../`.
Shared JS finds the site root through `window.SITE_ROOT`, which each page sets in its <head>.
`tools/layout.py` holds the URL map.
