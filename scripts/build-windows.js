const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');

// Page mapping
const PAGE_HTML = {
    'home': 'index.html',
    'home-tailwind': 'home-tailwind.html',
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
    '404': '404.html'
};

function run(command) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit', cwd: ROOT });
    } catch (e) {
        console.error(`Command failed: ${command}`);
        process.exit(1);
    }
}

function copyAndProcessHtml() {
    console.log('📄 Processing HTML files...');

    // Ensure dist exists
    if (!fs.existsSync(DIST_DIR)) fs.mkdirSync(DIST_DIR, { recursive: true });

    for (const [page, htmlFile] of Object.entries(PAGE_HTML)) {
        const srcPath = path.join(ROOT, htmlFile);
        const destPath = path.join(DIST_DIR, htmlFile);

        if (fs.existsSync(srcPath)) {
            let content = fs.readFileSync(srcPath, 'utf8');

            // Basic replacements (mimicking build.sh)
            // Note: update-dist-html.js does nicer regex replacement, so we can rely on that
            // BUT we must write the file to dist first.

            // build.sh replaces bootstrap etc with comments. We can let update-dist-html.js handle the cleanup
            // or do a basic pass here. Let's do a basic pass to match build.sh behavior
            content = content.replace(/<link rel="stylesheet" type="text\/css" href="assets\/css\/bootstrap.min.css">/g, '<!-- CSS moved to bundle -->');
            // ... (add other simple replacements if strict matching build.sh is needed, but update-dist-html is more robust)

            fs.writeFileSync(destPath, content);
            console.log(`  ✅ Copied ${htmlFile} to dist`);
        } else {
            console.log(`  ⚠️  Source ${htmlFile} not found`);
        }
    }
}

function main() {
    console.log('🚀 Starting Windows Build...');

    // 1. Generate Bundles
    run('node scripts/generate-bundles.js');

    // 2. Purge CSS (Optional but good)
    run('npm run purge-css');

    // 3. Sync Dist (copies assets/bundles to dist/assets/bundles)
    run('node scripts/sync-dist.js');

    // 4. Minify (Optional for dev, but good for dist)
    // run('npm run minify-dist-css'); 
    // run('npm run minify-dist-js');

    // 5. Copy and Process HTML (The missing step from npm run dist)
    copyAndProcessHtml();

    // 6. Update Dist HTML (Final link injection)
    run('node scripts/update-dist-html.js');

    console.log('\n🎉 Build Complete!');
}

main();
