/**
 * Minify JS bundles only in dist/ using Terser.
 * Page scripts (dist/assets/js/pages/*.js) are left readable.
 * Run after sync-dist so dist has the latest JS to minify.
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const ROOT = path.join(__dirname, '..');
const DIST_JS_BUNDLES = path.join(ROOT, 'dist/assets/js/bundles');

async function minifyFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const result = await minify(code, {
        compress: { passes: 1 },
        mangle: true,
        format: { comments: false },
    });
    if (result.code) {
        fs.writeFileSync(filePath, result.code);
        return { path: filePath, ok: true };
    }
    return { path: filePath, ok: false };
}

async function minifyDir(dir) {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
    const results = [];
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const r = await minifyFile(fullPath);
        results.push(r);
    }
    return results;
}

async function main() {
    console.log('📦 Minifying dist JS bundles (pages left readable)...\n');

    const bundleResults = await minifyDir(DIST_JS_BUNDLES);
    const ok = bundleResults.filter((r) => r.ok).length;
    console.log(`  ✅ Bundles: ${ok}/${bundleResults.length}`);
    console.log(`\n🎉 Minified ${ok} JS bundle(s) in dist. Page scripts unchanged.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
