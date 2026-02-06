/**
 * Update HTML files with new per-page bundle structure
 * Replaces old CSS/JS links with new bundled versions
 */

const fs = require('fs');
const path = require('path');

// Page mapping: html filename -> bundle name
const PAGE_MAP = {
    'index.html': 'home',
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
const OLD_CSS_LINKS = [
    '<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/swiper-bundle.min.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/fontawesome.min.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/fancybox.min.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/jquery-ui.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/animate.css">',
    '<link rel="stylesheet" type="text/css" href="assets/css/fonts.css">',
];

// Old JS scripts to remove (patterns)
const OLD_JS_PATTERNS = [
    /<script[^>]*src="[^"]*jquery-3\.7\.1\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*jquery-ui\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*bootstrap\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*swiper-bundle\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*wow\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*isotope\.pkgd\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*fancybox\.min\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*bg-moving\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*pricing-range\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*custom-scroll-count\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*custom-fancybox\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*back-to-top\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*custom\.js"[^>]*><\/script>/g,
    /<script[^>]*src="[^"]*cdn-cgi[^"]*"[^>]*><\/script>/g,
    /<script[^>]*cloudflareinsights[^>]*><\/script>/g,
];

function updateHtmlFile(htmlFile, bundleName) {
    const filePath = path.join(__dirname, '..', htmlFile);
    
    if (!fs.existsSync(filePath)) {
        console.log(`  ⚠️  ${htmlFile} not found, skipping`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove old CSS links
    OLD_CSS_LINKS.forEach(link => {
        content = content.replace(link, '');
    });
    
    // Remove old JS scripts
    OLD_JS_PATTERNS.forEach(pattern => {
        content = content.replace(pattern, '');
    });
    
    // Replace style.css with bundle CSS
    content = content.replace(
        /<link rel="stylesheet" type="text\/css" href="assets\/css\/style\.css">/,
        `<link rel="stylesheet" type="text/css" href="assets/css/bundles/${bundleName}.bundle.css">`
    );
    
    // Replace rtl-auth.css reference (remove it, it's in the bundle)
    content = content.replace(
        /<link rel="stylesheet" type="text\/css" href="assets\/css\/rtl-auth\.css">/,
        ''
    );
    
    // Find the closing </body> tag and add new JS links before it
    const newJsLinks = `
    <!-- Bundled JS -->
    <script src="assets/js/bundles/${bundleName}.bundle.js"></script>
    <!-- Page Logic (editable) -->
    <script src="assets/js/pages/${bundleName}.js"></script>
`;
    
    // Remove any existing bundle/page script references first
    content = content.replace(/<script[^>]*src="assets\/js\/bundles\/[^"]*"[^>]*><\/script>/g, '');
    content = content.replace(/<script[^>]*src="assets\/js\/pages\/[^"]*"[^>]*><\/script>/g, '');
    
    // Add new JS before </body>
    content = content.replace(
        /(\s*)<\/body>/,
        `${newJsLinks}$1</body>`
    );
    
    // Clean up multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Clean up comments for removed scripts
    content = content.replace(/\s*<!-- jQuery Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- jQuery UI JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Bootstrap JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Swiper Slider JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Wow Animation JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Isotope JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Fancybox JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- BG Moving JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Custom JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Back To Top Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Pricing Range JS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Custom Fancybox JS -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Counter JS Link -->\s*/g, '\n');
    
    // Clean up CSS comments
    content = content.replace(/\s*<!-- Bootstrap CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Swiper Slider CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Font Awesome CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Fancybox CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- jQuery UI CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- Wow Animation CSS Link -->\s*/g, '\n');
    content = content.replace(/\s*<!-- RTL & Auth Pages CSS -->\s*/g, '\n');
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    return true;
}

console.log('📄 Updating HTML files with new bundle structure...\n');

let successCount = 0;
let failCount = 0;

for (const [htmlFile, bundleName] of Object.entries(PAGE_MAP)) {
    process.stdout.write(`  Updating ${htmlFile}...`);
    if (updateHtmlFile(htmlFile, bundleName)) {
        console.log(` ✅ → ${bundleName}.bundle.css + ${bundleName}.bundle.js + ${bundleName}.js`);
        successCount++;
    } else {
        failCount++;
    }
}

console.log(`\n🎉 Complete! Updated ${successCount} files, ${failCount} skipped.`);
