/**
 * Optimize resource loading for better LCP
 * - Add defer to bundle.js
 * - Add critical CSS inline
 * Run: node optimize-loading.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';

// Critical CSS for above-the-fold content (LCP optimization)
const CRITICAL_CSS = `<style>
/* Critical CSS - Inlined for faster LCP */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Cairo',sans-serif;direction:rtl;text-align:right;overflow-x:hidden}
body.fixed{position:fixed;top:0;left:0;right:0;bottom:0;overflow:hidden}
.loader-box{position:fixed;inset:0;background:#fff;z-index:9999;display:flex;align-items:center;justify-content:center}
.site-header{position:relative;z-index:100}
.inner-banner{padding:120px 0 80px;position:relative;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%)}
.h1-title{font-size:2.5rem;font-weight:700;color:#1a1a2e;margin-bottom:1rem}
.container{max-width:1200px;margin:0 auto;padding:0 15px}
.row{display:flex;flex-wrap:wrap;margin:0 -15px}
.col-lg-12{flex:0 0 100%;max-width:100%;padding:0 15px}
.text-center{text-align:center}
img{max-width:100%;height:auto}
/* Mobile-first critical styles */
@media(max-width:767px){.h1-title{font-size:1.75rem}.inner-banner{padding:80px 0 50px}}
@media(max-width:575px){.h1-title{font-size:1.5rem}.inner-banner{padding:60px 0 40px}}
</style>`;

function optimizeHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Add defer to bundle.js if not present
    if (content.includes('src="assets/js/bundle.js"') && !content.includes('src="assets/js/bundle.js" defer')) {
        content = content.replace(
            '<script src="assets/js/bundle.js"></script>',
            '<script src="assets/js/bundle.js" defer></script>'
        );
        modified = true;
    }
    
    // 2. Add critical CSS inline if not present
    if (!content.includes('/* Critical CSS')) {
        content = content.replace(
            '<link rel="stylesheet" type="text/css" href="assets/css/bundle.css">',
            `${CRITICAL_CSS}
    <link rel="stylesheet" type="text/css" href="assets/css/bundle.css">`
        );
        modified = true;
    }
    
    // 3. Add fetchpriority="high" to LCP images (banner images)
    content = content.replace(
        /(<img[^>]*class="[^"]*banner[^"]*"[^>]*)(>)/gi,
        '$1 fetchpriority="high"$2'
    );
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('⚡ Optimizing resource loading for better LCP...\n');
    
    const htmlFiles = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(DIST_DIR, f));
    
    let count = 0;
    for (const file of htmlFiles) {
        if (optimizeHtmlFile(file)) {
            console.log(`✅ ${path.basename(file)}`);
            count++;
        }
    }
    
    console.log(`\n✅ Optimized ${count} HTML files.`);
    console.log('\n📋 Optimizations applied:');
    console.log('  - Added defer to bundle.js (non-blocking)');
    console.log('  - Inlined critical CSS for faster first paint');
    console.log('  - Added fetchpriority="high" to LCP images');
}

main();
