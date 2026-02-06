# Asset optimization (CSS & JS)

## Removing unused CSS

Unused CSS is removed with **PurgeCSS** so each page bundle keeps only selectors that appear in that page’s HTML.

### How to run

- **Full dist pipeline (recommended):**  
  `npm run dist`  
  This runs: generate bundles → purge CSS → sync to dist → update dist HTML.

- **Purge only** (after `npm run generate-bundles`):  
  `npm run purge-css`  
  Then run `npm run sync-dist` and `npm run update-dist` if you need to refresh dist.

### Behaviour

- **Input:** `assets/css/bundles/<page>.bundle.css` and the corresponding HTML at project root (e.g. `index.html`, `about-us.html`).
- **Output:** The same bundle files are overwritten with purged CSS. Expect roughly **60–68%** size reduction per page (safelist is minimal so only classes that appear in the HTML or are added by JS/libs are kept).
- **Safelist:** Only dynamic/JS-added and library classes (e.g. `wow`, `swiper`, `fa`, `show`, `collapse`, `animate*`, keyframes, `@font-face`) are safelisted. Bootstrap/utility classes are **not** safelisted; PurgeCSS keeps only what appears in the page HTML. Adjust `scripts/purge-css.js` if something needed is removed.

### Note

- `courses-list.html` exists only in `dist/`, not at project root, so PurgeCSS skips `courses-list.bundle.css`. To purge it, add a source `courses-list.html` at project root.

---

## Reducing JavaScript size

Current setup already reduces JS per page:

- **Per-page bundles** in `scripts/generate-bundles.js`: each page only gets the features it needs (e.g. swiper, wow, isotope, fancybox).
- **Page-specific script:** `assets/js/pages/<page>.js` is loaded separately and is small.

Further options if you need smaller JS:

1. **Minify page JS in dist**  
   Run Terser (or similar) on `dist/assets/js/pages/*.js` in the build so dist gets minified page scripts.

2. **Split `custom.js`**  
   Move parts of `assets/js/custom.js` into `src/js/pages/<page>.js` (or small feature modules) and include only what each page needs in the bundle step.

3. **Lazy-load heavy features**  
   Load Swiper, Fancybox, Isotope, etc. only when the user interacts (e.g. open a gallery) instead of in the main bundle. Requires changing how those scripts are included in `generate-bundles.js` and loading them dynamically from page JS.

4. **Replace or trim libraries**  
   Use lighter alternatives or custom code for simple behaviour (e.g. one carousel instead of full Swiper) and drop unused library code.

The biggest gain usually comes from (2) and (3); (1) is a quick win for dist size.

---

## Dist pipeline (npm run dist)

The full `npm run dist` pipeline does:

1. **generate-bundles** – Build per-page CSS/JS in `assets/`
2. **purge-css** – Remove unused CSS per page (~60–68% reduction)
3. **sync-dist** – Copy bundles to `dist/`
4. **minify-dist-css** – Minify CSS in `dist/assets/css/bundles/`
5. **minify-dist-js** – Minify JS in `dist/assets/js/bundles/` only (page scripts in `dist/assets/js/pages/` stay readable)
6. **update-dist-html** – Fix HTML links in `dist/`

So `dist/` gets purged + minified CSS and minified JS. Re-run Coverage in DevTools on a page served from `dist/` (e.g. `npm run serve:dist`) to verify.
