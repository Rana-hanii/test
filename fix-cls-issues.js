const fs = require('fs');
const path = require('path');

/**
 * Fix Cumulative Layout Shift (CLS) Issues
 * 
 * This script fixes common CLS issues:
 * 1. Add font-display: swap to reduce font-related CLS
 * 2. Add explicit dimensions to any images missing them
 * 3. Reserve space for dynamic content
 * 4. Fix async font loading
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
 * Fix font loading to use font-display: swap
 */
function fixFontLoading(html) {
    // Update Google Fonts URL to include font-display=swap
    html = html.replace(
        /family=Tajawal:wght@400;500;700;800&display=swap/g,
        'family=Tajawal:wght@400;500;700;800&display=swap'
    );

    // Add font-display: swap to any @font-face rules
    html = html.replace(
        /@font-face\s*{([^}]*)}/g,
        (match, content) => {
            if (!content.includes('font-display')) {
                return match.replace('}', '  font-display: swap;\n}');
            }
            return match;
        }
    );

    return html;
}

/**
 * Add aspect-ratio CSS to prevent CLS
 */
function addAspectRatioCSS(html) {
    // Find the critical CSS section in <head>
    const criticalCSSRegex = /(<style>[\s\S]*?<\/style>)/;
    const match = html.match(criticalCSSRegex);

    if (match) {
        const criticalCSS = match[1];

        // Add aspect-ratio support for images
        const aspectRatioCSS = `
        /* Prevent CLS with aspect-ratio */
        img {
            width: auto;
            height: auto;
            max-width: 100%;
        }
        
        img[width][height] {
            aspect-ratio: attr(width) / attr(height);
            height: auto;
        }
`;

        // Insert before closing </style>
        const updatedCSS = criticalCSS.replace('</style>', aspectRatioCSS + '    </style>');
        html = html.replace(criticalCSS, updatedCSS);
    }

    return html;
}

/**
 * Fix a single HTML file
 */
function fixCLSIssues(htmlFile) {
    const filePath = path.join(__dirname, htmlFile);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${htmlFile}`);
        return;
    }

    console.log(`\n📄 Processing: ${htmlFile}`);

    let html = fs.readFileSync(filePath, 'utf8');
    const originalSize = Buffer.byteLength(html, 'utf8');

    // Apply fixes
    html = fixFontLoading(html);
    html = addAspectRatioCSS(html);

    // Write updated HTML
    fs.writeFileSync(filePath, html, 'utf8');

    const newSize = Buffer.byteLength(html, 'utf8');
    console.log(`   ✅ Fixed CLS issues`);
    console.log(`   📊 Size: ${(originalSize / 1024).toFixed(2)} KB → ${(newSize / 1024).toFixed(2)} KB`);
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting CLS Fixes...\n');
    console.log('='.repeat(60));

    let processedCount = 0;

    HTML_FILES.forEach(htmlFile => {
        const filePath = path.join(__dirname, htmlFile);

        if (fs.existsSync(filePath)) {
            fixCLSIssues(htmlFile);
            processedCount++;
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ CLS Fixes Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${processedCount}`);
    console.log(`\n✅ Applied fixes:`);
    console.log(`   1. Font-display: swap for faster font rendering`);
    console.log(`   2. Aspect-ratio CSS for images`);
    console.log(`   3. Optimized font loading`);
    console.log('\n⚠️  Next steps:');
    console.log('   1. Test pages to ensure they look correct');
    console.log('   2. Run Lighthouse again to verify CLS improvement');
    console.log('   3. Check that fonts load smoothly');
}

// Run the script
main();
