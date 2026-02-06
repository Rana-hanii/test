/**
 * Fix LCP (Largest Contentful Paint) issues
 * 1. Add fetchpriority="high" to LCP images (banner)
 * 2. Preload LCP image in <head>
 * 3. Add loading="lazy" to decorative images
 * 4. Fix oversized logo dimensions
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';

function fixLcpIssues(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const fileName = path.basename(filePath);

    // 1. Add fetchpriority="high" to banner image (LCP element)
    if (content.includes('banner-img.webp') && !content.includes('fetchpriority="high"')) {
        content = content.replace(
            /(<img[^>]*src="assets\/images\/banner-img\.webp"[^>]*)>/gi,
            '$1 fetchpriority="high">'
        );
        modified = true;
    }

    // 2. Add preload for LCP image in <head> (for index.html with banner)
    if (content.includes('banner-img.webp') && !content.includes('preload" href="assets/images/banner-img')) {
        content = content.replace(
            /<link rel="preload" href="assets\/css\/bundle\.css" as="style">/,
            `<link rel="preload" href="assets/css/bundle.css" as="style">
    <link rel="preload" href="assets/images/banner-img.webp" as="image" fetchpriority="high">`
        );
        modified = true;
    }

    // 3. Add loading="lazy" to decorative/alignment images (aliment SVGs)
    const alimentRegex = /<img([^>]*src="assets\/images\/aliment-[^"]+\.svg"[^>]*)>/gi;
    if (alimentRegex.test(content)) {
        content = content.replace(alimentRegex, (match, attrs) => {
            if (match.includes('loading=')) return match;
            return `<img${attrs} loading="lazy">`;
        });
        modified = true;
    }

    // 4. Fix oversized logo dimensions (1203x771 -> 150x96 actual display size)
    content = content.replace(
        /(<img[^>]*src="assets\/images\/Logo\.webp"[^>]*)width="1203" height="771"([^>]*)>/gi,
        '$1width="150" height="96"$2>'
    );
    if (content.includes('Logo.webp')) {
        // Also for any logo that doesn't have correct dimensions
        content = content.replace(
            /(<img[^>]*src="assets\/images\/Logo\.webp"[^>]*)width="\d+" height="\d+"([^>]*)loading="lazy"([^>]*)>/gi,
            '$1width="150" height="96"$2$3>'
        );
        modified = true;
    }

    // 5. Remove loading="lazy" from above-the-fold images (logo, banner)
    // Logo should NOT be lazy loaded - it's above the fold
    content = content.replace(
        /(<img[^>]*src="assets\/images\/Logo\.webp"[^>]*) loading="lazy"([^>]*)>/gi,
        '$1$2>'
    );

    // 6. Add loading="lazy" to other background images below the fold
    const bgImagesRegex = /<img([^>]*src="assets\/images\/(?:bg-|arrow-aliment|newsletter)[^"]+\.(svg|webp)"[^>]*)>/gi;
    content = content.replace(bgImagesRegex, (match, attrs) => {
        if (match.includes('loading=')) return match;
        return `<img${attrs} loading="lazy">`;
    });

    // 7. Add loading="lazy" to course images, blog images, instructor images (below fold)
    const belowFoldImagesRegex = /<img([^>]*src="assets\/images\/(?:course-image|blog-image|Instructor-image|event-image|client-image)[^"]+\.webp"[^>]*)>/gi;
    content = content.replace(belowFoldImagesRegex, (match, attrs) => {
        if (match.includes('loading=')) return match;
        return `<img${attrs} loading="lazy">`;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('⚡ Fixing LCP issues...\n');

    const htmlFiles = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(DIST_DIR, f));

    let count = 0;
    htmlFiles.forEach(file => {
        if (fixLcpIssues(file)) {
            console.log(`✅ ${path.basename(file)}`);
            count++;
        }
    });

    console.log(`\n✅ Fixed LCP issues in ${count} files`);
    console.log('\n📋 Optimizations applied:');
    console.log('  - Added fetchpriority="high" to banner images');
    console.log('  - Added preload for LCP image');
    console.log('  - Added loading="lazy" to decorative images');
    console.log('  - Fixed oversized logo dimensions');
    console.log('  - Added loading="lazy" to below-fold images');
}

main();
