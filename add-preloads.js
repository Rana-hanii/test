/**
 * Add preload hints for critical resources to improve LCP/FCP
 * Run: node add-preloads.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';

// Preload links to add
const PRELOAD_LINKS = `
    <!-- Preload Tajawal font for faster text rendering -->
    <link rel="preload" href="assets/fonts/Tajawal-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/fonts/Tajawal-Bold.woff2" as="font" type="font/woff2" crossorigin>
    <!-- Preload critical fonts for better CLS -->
    <link rel="preload" href="assets/webfonts/fa-solid-900.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/webfonts/fa-brands-400.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="assets/css/bundle.css" as="style">
`;

function addPreloads(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if preloads already added
    if (content.includes('rel="preload"')) {
        return false;
    }
    
    // Add preloads after favicon link
    content = content.replace(
        /(<link rel="shortcut icon"[^>]*>)/i,
        `$1${PRELOAD_LINKS}`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
}

function main() {
    console.log('⚡ Adding preload hints for critical resources...\n');
    
    const htmlFiles = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(DIST_DIR, f));
    
    let count = 0;
    for (const file of htmlFiles) {
        if (addPreloads(file)) {
            console.log(`✅ ${path.basename(file)}`);
            count++;
        }
    }
    
    console.log(`\n✅ Added preloads to ${count} HTML files.`);
}

main();
