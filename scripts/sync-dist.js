/**
 * Sync dist folder with fresh bundles from assets/
 * Rewrites CSS paths so Bootstrap + Font Awesome work when served from dist/
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const DIRS = [
    { src: 'assets/css/bundles', dest: 'dist/assets/css/bundles', rewriteCss: true },
    { src: 'assets/js/bundles', dest: 'dist/assets/js/bundles', rewriteCss: false },
    { src: 'assets/js/pages', dest: 'dist/assets/js/pages', rewriteCss: false },
];

/**
 * Rewrite CSS so font/image paths work from dist/assets/css/bundles/
 * Same ../../webfonts/ and ../images/ work for dist - no change needed.
 * But ensure we're not using assets-relative paths; keep ../../webfonts/ and ../images/
 */
function rewriteCssForDist(content) {
    // Paths ../../webfonts/ and ../images/ are correct for dist/assets/css/bundles/
    // No change needed - they resolve to dist/assets/webfonts/ and dist/assets/css/images/
    return content;
}

function copyDir(srcRel, destRel, rewriteCss) {
    const src = path.join(ROOT, srcRel);
    const dest = path.join(ROOT, destRel);

    if (!fs.existsSync(src)) {
        console.log(`  ⚠️  Source not found: ${srcRel}`);
        return 0;
    }

    fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    let count = 0;

    files.forEach((file) => {
        const srcFile = path.join(src, file);
        const destFile = path.join(dest, file);
        if (fs.statSync(srcFile).isFile()) {
            let data = fs.readFileSync(srcFile, 'utf8');
            if (rewriteCss && file.endsWith('.css')) {
                data = rewriteCssForDist(data);
            }
            fs.writeFileSync(destFile, data, 'utf8');
            count++;
        }
    });

    return count;
}

console.log('🔄 Syncing dist with assets bundles...\n');

let total = 0;
DIRS.forEach(({ src, dest, rewriteCss }) => {
    const n = copyDir(src, dest, rewriteCss);
    total += n;
    console.log(`  ✅ ${src} → ${dest} (${n} files)`);
});

console.log(`\n🎉 Synced ${total} files to dist.`);
console.log('\nRun "npm run update-dist" if dist HTML links need updating.');
