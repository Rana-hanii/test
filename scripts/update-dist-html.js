/**
 * Update dist HTML files with new per-page bundle structure
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');

// Page mapping: html filename -> bundle name
const PAGE_MAP = {
    'index.html': 'home',
    'home-tailwind.html': 'home-tailwind',
    'about-us.html': 'about',
    'courses-grid.html': 'courses-grid',
    'courses-list.html': 'courses-list',
    'courses-detail.html': 'courses-detail',
    'event-detail.html': 'event-detail',
    'instructor.html': 'instructor',
    'instructor-detail.html': 'instructor-detail',
    'pricing.html': 'pricing',
    'faq.html': 'faq',
    'blog-grid.html': 'blog-grid',
    'blog-list.html': 'blog-list',
    'blog-detail.html': 'blog-detail',
    'contact-us.html': 'contact',
    'login.html': 'login',
    'register.html': 'register',
    'profile.html': 'profile',
    'checkout.html': 'checkout',
    'video-detail.html': 'video-detail',
    '404.html': '404'
};

// Old CSS links to remove
const OLD_CSS_PATTERNS = [
    /<link[^>]*href="assets\/css\/bootstrap\.min\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/swiper-bundle\.min\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/fontawesome\.min\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/fancybox\.min\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/jquery-ui\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/animate\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/fonts\.css"[^>]*>/g,
    /<link[^>]*href="assets\/css\/rtl-auth\.css"[^>]*>/g,
];

// Old JS scripts to remove
const OLD_JS_PATTERNS = [
    /<script[^>]*src="assets\/js\/jquery-3\.7\.1\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/jquery-ui\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/bootstrap\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/swiper-bundle\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/wow\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/isotope\.pkgd\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/fancybox\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/bg-moving\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/pricing-range\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/custom-scroll-count\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/custom-fancybox\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/back-to-top\.js"[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/custom\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*cdn-cgi[^"]*"[^>]*><\/script>/g,
    /<script[^>]*cloudflareinsights[^>]*><\/script>/g,
    /<script[^>]*src="assets\/js\/bundle\.js"[^>]*><\/script>/g,
];

function updateHtmlFile(htmlFile, bundleName) {
    const filePath = path.join(DIST_DIR, htmlFile);

    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  ${htmlFile} not found, skipping`);
        return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // Remove old CSS links
    OLD_CSS_PATTERNS.forEach(pattern => {
        content = content.replace(pattern, '');
    });

    // Remove old JS scripts
    OLD_JS_PATTERNS.forEach(pattern => {
        content = content.replace(pattern, '');
    });

    // Remove existing bundle CSS (blocking, preload, or noscript) so we can add async pattern
    content = content.replace(/<link[^>]*href="assets\/css\/bundles\/[^"]*"[^>]*>/g, '');
    content = content.replace(/<noscript><link[^>]*href="assets\/css\/bundles\/[^"]*"[^>]*><\/noscript>\s*/g, '');
    content = content.replace(/<script[^>]*src="assets\/js\/bundles\/[^"]*"[^>]*><\/script>/g, '');
    content = content.replace(/<script[^>]*src="assets\/js\/pages\/[^"]*"[^>]*><\/script>/g, '');

    // Critical inline CSS (loader + body.fixed) so loader appears first and styled before main CSS
    const criticalCSS = `    <!-- Critical: loader + body.fixed (inline so loader appears first and styled before main CSS) -->
    <style>
body.fixed{position:fixed;top:0;height:100vh;overflow:hidden;}
.loader-box{position:fixed;top:0;left:0;width:100vw;height:100vh;background:#f3f6fa;z-index:999;}
.loader-content{position:relative;display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;}
.loading-container,.loading{width:140px;height:140px;border-radius:100%;position:relative;}
.loading{border:1px solid transparent;border-color:transparent #ffbd59 transparent #ffbd59;animation:rotate-loading 1.5s linear infinite;transform-origin:50% 50%;}
.loading-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:90px;height:90px;background:linear-gradient(-90deg,#ffbd59 0%,#ffd28c 100%);display:flex;align-items:center;justify-content:center;border-radius:100%;}
@keyframes rotate-loading{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
    </style>
`;
    if (!content.includes('Critical: loader')) {
        content = content.replace(
            /(<noscript><link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^<]*><\/noscript>)/,
            `$1\n${criticalCSS}`
        );
    }
    // Async CSS (non-render-blocking): preload + onload + noscript fallback
    const cssAsyncBlock = `    <link rel="preload" href="assets/css/bundles/${bundleName}.bundle.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="assets/css/bundles/${bundleName}.bundle.css"></noscript>
`;
    // Replace style.css with async bundle CSS or add async bundle before </head>
    if (content.includes('assets/css/style.css')) {
        content = content.replace(
            /<link[^>]*href="assets\/css\/style\.css"[^>]*>/,
            cssAsyncBlock.trim()
        );
    } else if (!content.includes(`${bundleName}.bundle.css`)) {
        content = content.replace(
            /<\/head>/,
            `${cssAsyncBlock}</head>`
        );
    }

    // Add new JS before </body> if not already present
    const newJsLinks = `
    <!-- Bundled JS -->
    <script src="assets/js/bundles/${bundleName}.bundle.js"></script>
    <!-- Page Logic -->
    <script src="assets/js/pages/${bundleName}.js"></script>
`;

    if (!content.includes(`${bundleName}.bundle.js`)) {
        content = content.replace(
            /(\s*)<\/body>/,
            `${newJsLinks}$1</body>`
        );
    }

    // Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n\s*\n/g, '\n\n');

    // Write updated content
    fs.writeFileSync(filePath, content);
    return true;
}

console.log('📄 Updating dist HTML files with bundle structure...\n');

let successCount = 0;
let failCount = 0;

for (const [htmlFile, bundleName] of Object.entries(PAGE_MAP)) {
    process.stdout.write(`  Updating dist/${htmlFile}...`);
    if (updateHtmlFile(htmlFile, bundleName)) {
        console.log(` ✅`);
        successCount++;
    } else {
        failCount++;
    }
}

console.log(`\n🎉 Complete! Updated ${successCount} files, ${failCount} skipped.`);
