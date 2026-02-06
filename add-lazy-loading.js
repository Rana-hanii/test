const fs = require('fs');
const path = require('path');

/**
 * Add Lazy Loading to Images
 * 
 * This script adds loading="lazy" to all <img> tags except:
 * - Logo images
 * - Hero/banner images (above the fold)
 * - Images that already have loading attribute
 */

// Configuration
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

// Images to exclude from lazy loading (above the fold)
const EXCLUDE_PATTERNS = [
    /logo/i,
    /favicon/i,
    /banner-img/i,
    /hero/i,
    /site-branding/i,
    /footer-bottom-logo/i
];

/**
 * Check if an image should be excluded from lazy loading
 */
function shouldExclude(imgTag) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(imgTag));
}

/**
 * Add lazy loading to images in a single HTML file
 */
function addLazyLoading(htmlFile) {
    const filePath = path.join(__dirname, htmlFile);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${htmlFile}`);
        return;
    }

    console.log(`\n📄 Processing: ${htmlFile}`);

    // Read the HTML file
    let html = fs.readFileSync(filePath, 'utf8');

    let modifiedCount = 0;
    let skippedCount = 0;
    let alreadyHasLazyCount = 0;

    // Find all <img> tags
    const imgRegex = /<img([^>]*)>/gi;

    html = html.replace(imgRegex, (match, attributes) => {
        // Skip if already has loading attribute
        if (/loading\s*=/i.test(attributes)) {
            alreadyHasLazyCount++;
            return match;
        }

        // Skip if in exclude list
        if (shouldExclude(match)) {
            skippedCount++;
            return match;
        }

        // Add loading="lazy"
        modifiedCount++;
        return `<img${attributes} loading="lazy">`;
    });

    // Write updated HTML
    if (modifiedCount > 0) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`   ✅ Added lazy loading to ${modifiedCount} images`);
    } else {
        console.log(`   ℹ️  No images modified`);
    }

    if (skippedCount > 0) {
        console.log(`   ⏭️  Skipped ${skippedCount} above-the-fold images`);
    }

    if (alreadyHasLazyCount > 0) {
        console.log(`   ✓  ${alreadyHasLazyCount} images already have loading attribute`);
    }

    return { modified: modifiedCount, skipped: skippedCount, alreadyHas: alreadyHasLazyCount };
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Starting Lazy Loading Implementation...\n');
    console.log('='.repeat(60));

    let totalModified = 0;
    let totalSkipped = 0;
    let totalAlreadyHas = 0;
    let processedCount = 0;

    HTML_FILES.forEach(htmlFile => {
        const filePath = path.join(__dirname, htmlFile);

        if (fs.existsSync(filePath)) {
            const result = addLazyLoading(htmlFile);
            if (result) {
                totalModified += result.modified;
                totalSkipped += result.skipped;
                totalAlreadyHas += result.alreadyHas;
                processedCount++;
            }
        }
    });

    console.log('\n' + '='.repeat(60));
    console.log('✨ Lazy Loading Implementation Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${processedCount}`);
    console.log(`   Images with lazy loading added: ${totalModified}`);
    console.log(`   Images skipped (above-the-fold): ${totalSkipped}`);
    console.log(`   Images already had loading attribute: ${totalAlreadyHas}`);
    console.log(`   Total images processed: ${totalModified + totalSkipped + totalAlreadyHas}`);
    console.log('\n✅ All files updated successfully!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Test all pages to ensure images load correctly');
    console.log('   2. Verify lazy loading behavior (images load as you scroll)');
    console.log('   3. Check that above-the-fold images load immediately');
}

// Run the script
main();
