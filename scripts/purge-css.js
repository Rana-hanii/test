/**
 * Purge unused CSS from each page bundle using that page's HTML.
 * Run after generate-bundles. Keeps only selectors that appear in the page HTML.
 */

const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const ROOT = path.join(__dirname, '..');

const PAGE_HTML = {
    'home': 'index.html',
    'about': 'about-us.html',
    'courses-grid': 'courses-grid.html',
    'courses-list': 'courses-list.html',
    'courses-detail': 'courses-detail.html',
    'event-detail': 'event-detail.html',
    'instructor': 'instructor.html',
    'instructor-detail': 'instructor-detail.html',
    'pricing': 'pricing.html',
    'faq': 'faq.html',
    'blog-grid': 'blog-grid.html',
    'blog-list': 'blog-list.html',
    'blog-detail': 'blog-detail.html',
    'contact': 'contact-us.html',
    'login': 'login.html',
    'register': 'register.html',
    'profile': 'profile.html',
    'checkout': 'checkout.html',
    'video-detail': 'video-detail.html',
    '404': '404.html',
};

// Only keep classes added by JS or required by libs. Let PurgeCSS keep everything
// that actually appears in the HTML (no greedy Bootstrap/utility patterns here).
const SAFELIST = {
    standard: [
        /^wow$/,
        /^fadeup-animation$/,
        /^fade-/,
        /^swiper/,
        /^swiper-/,
        /^fa$/,
        /^fa-/,
        /^fas$/,
        /^far$/,
        /^fab$/,
        /^collapsed$/,
        /^show$/,
        /^active$/,
        /^modal/,
        /^dropdown/,
        /^open$/,
        /^fancybox/,
        /^isotope/,
        /^grid-item/,
        /^loading$/,
        /^fixed$/,
        /^sticky/,
        /^collapse$/,
        /^navbar-collapse$/,
        /^sub-menu$/,
        /^sub-items$/,
        /^toggle-button$/,
    ],
    // Minimal: only animate* for WOW/animations; do NOT keep all btn/col/row/container
    greedy: [
        /^animate/,
    ],
    keyframes: true,
    fontFace: true,
};

async function purgePage(pageName, htmlPath, cssPath) {
    if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath)) {
        console.log(`  ⚠️  Skip ${pageName}: missing HTML or CSS`);
        return false;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    const css = [{ raw: fs.readFileSync(cssPath, 'utf8'), name: `${pageName}.bundle.css` }];
    const result = await new PurgeCSS().purge({
        content: [{ raw: html, extension: 'html' }],
        css,
        safelist: { standard: SAFELIST.standard, greedy: SAFELIST.greedy },
        fontFace: SAFELIST.fontFace,
        keyframes: SAFELIST.keyframes,
    });
    if (result[0] && result[0].css) {
        fs.writeFileSync(cssPath, result[0].css);
        const before = (css[0].raw || '').length;
        const after = result[0].css.length;
        const pct = before ? Math.round((1 - after / before) * 100) : 0;
        console.log(`  ✅ ${pageName}.bundle.css purged (~${pct}% removed)`);
        return true;
    }
    return false;
}

async function main() {
    console.log('🧹 Purging unused CSS from page bundles...\n');
    const bundlesDir = path.join(ROOT, 'assets/css/bundles');
    const htmlDir = ROOT;

    for (const [pageName, htmlFile] of Object.entries(PAGE_HTML)) {
        const htmlPath = path.join(htmlDir, htmlFile);
        const cssPath = path.join(bundlesDir, `${pageName}.bundle.css`);
        await purgePage(pageName, htmlPath, cssPath);
    }

    console.log('\n🎉 Purge complete. Run npm run sync-dist to update dist.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
