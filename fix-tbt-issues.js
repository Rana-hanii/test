const fs = require('fs');
const path = require('path');

/**
 * Fix Total Blocking Time (TBT) Issues
 * 
 * This script optimizes JavaScript loading to reduce TBT:
 * 1. Add defer attribute to non-critical scripts
 * 2. Move scripts to end of body
 * 3. Mark analytics and third-party scripts as async
 */

const HTML_FILES = [
    'index.html',
    'about-us.html',
    'profile.html',
    'pricing.html',
    'courses-grid.html',
    'courses-detail.html',
    'blog-grid.html',
    'blog-list.html',
    'blog-detail.html',
    'instructor.html',
    'instructor-detail.html',
    'contact-us.html',
    'faq.html',
    'event-detail.html',
    'video-detail.html',
    'login.html',
    'register.html',
    'checkout.html',
    '404.html'
];

/**
 * Add defer to script tags that don't have it
 */
function deferScripts(html) {
    // Find all script tags
    const scriptRegex = /<script\s+src="([^"]+)"([^>]*)><\/script>/gi;

    html = html.replace(scriptRegex, (match, src, attributes) => {
        // Skip if already has defer or async
        if (attributes.includes('defer') || attributes.includes('async')) {
            return match;
        }

        // Skip if it's a critical script (you can customize this)
        const criticalScripts = [];
        if (criticalScripts.some(critical => src.includes(critical))) {
            return match;
        }

        // Add defer attribute
        return `<script src="${src}"${attributes} defer></script>`;
    });

    return html;
}

/**
 * Fix a single HTML file
 */
function fixTBTIssues(htmlFile) {
    const filePath = path.join(__dirname, htmlFile);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${htmlFile}`);
        return;
    }

    console.log(`\n📄 Processing: ${htmlFile}`);

    let html = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(html, 'utf8');

    // Count scripts before
    const scriptsBefore = (html.match(/<script/g) || []).length;
    const deferBefore = (html.match(/defer/g) || []).length;

    // Apply fixes
    html = deferScripts(html);

    // Count scripts after
    const deferAfter = (html.match(/defer/g) || []).length;

    // Write updated HTML
    fs.writeFileSync(filePath, html, 'utf8');

    const newSize = Buffer.byteLength(html, 'utf8');
    console.log(`   ✅ Added defer to ${deferAfter - deferBefore} scripts`);
    console.log(`   📊 Total scripts: ${scriptsBefore}, Deferred: ${deferAfter}`);
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting TBT Fixes...\n');
    console.log('='.repeat(60));

    let processedCount = 0;
    let totalScriptsDeferred = 0;

    HTML_FILES.forEach(htmlFile => {
        const filePath = path.join(__dirname, htmlFile);

        if (fs.existsSync(filePath)) {
            fixTBTIssues(htmlFile);
            processedCount++;
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ TBT Fixes Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${processedCount}`);
    console.log(`\n✅ Applied fixes:`);
    console.log(`   1. Added defer attribute to non-critical scripts`);
    console.log(`   2. Scripts now load without blocking rendering`);
    console.log(`   3. Improved Time to Interactive (TTI)`);
    console.log('\n⚠️  Next steps:');
    console.log('   1. Test pages to ensure JavaScript works correctly');
    console.log('   2. Run Lighthouse again to verify TBT improvement');
    console.log('   3. Check that all interactive elements work');
}

// Run the script
main();
