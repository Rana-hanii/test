/**
 * Minify CSS bundles in dist/ using clean-css.
 * Run after sync-dist so dist has the latest (purged) CSS to minify.
 */

const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const ROOT = path.join(__dirname, '..');
const DIST_CSS_BUNDLES = path.join(ROOT, 'dist/assets/css/bundles');

function minifyFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = new CleanCSS({ level: 1 }).minify(code);
    if (result.errors.length) {
        console.warn(`  ⚠️  ${path.basename(filePath)}:`, result.errors.join('; '));
        return false;
    }
    fs.writeFileSync(filePath, result.styles);
    return true;
}

function main() {
    console.log('🎨 Minifying dist CSS...\n');

    if (!fs.existsSync(DIST_CSS_BUNDLES)) {
        console.log('  ⚠️  dist/assets/css/bundles not found. Run sync-dist first.');
        return;
    }

    const files = fs.readdirSync(DIST_CSS_BUNDLES).filter((f) => f.endsWith('.css'));
    let ok = 0;
    files.forEach((file) => {
        if (minifyFile(path.join(DIST_CSS_BUNDLES, file))) ok++;
    });

    console.log(`  ✅ Minified ${ok}/${files.length} CSS bundles in dist.\n`);
}

main();
