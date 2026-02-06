const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Add Width and Height Attributes to Images
 * 
 * This script adds width and height attributes to all <img> tags
 * to prevent Cumulative Layout Shift (CLS).
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

const ASSETS_DIR = path.join(__dirname, 'assets');

// Cache for image dimensions
const dimensionsCache = {};

/**
 * Get image dimensions using sharp
 */
async function getImageDimensions(imagePath) {
    if (dimensionsCache[imagePath]) {
        return dimensionsCache[imagePath];
    }

    try {
        const metadata = await sharp(imagePath).metadata();
        const dimensions = { width: metadata.width, height: metadata.height };
        dimensionsCache[imagePath] = dimensions;
        return dimensions;
    } catch (error) {
        console.log(`   ⚠️  Could not read dimensions for: ${imagePath}`);
        return null;
    }
}

/**
 * Extract src from img tag attributes
 */
function extractSrc(attributes) {
    const srcMatch = attributes.match(/src\s*=\s*["']([^"']+)["']/i);
    return srcMatch ? srcMatch[1] : null;
}

/**
 * Check if img tag already has width and height
 */
function hasWidthHeight(attributes) {
    return /width\s*=/i.test(attributes) && /height\s*=/i.test(attributes);
}

/**
 * Add width and height to images in a single HTML file
 */
async function addImageDimensions(htmlFile) {
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
    let alreadyHasCount = 0;
    let notFoundCount = 0;

    // Find all <img> tags
    const imgRegex = /<img([^>]*)>/gi;
    const matches = [...html.matchAll(imgRegex)];

    for (const match of matches) {
        const fullTag = match[0];
        const attributes = match[1];

        // Skip if already has width and height
        if (hasWidthHeight(attributes)) {
            alreadyHasCount++;
            continue;
        }

        // Extract src
        const src = extractSrc(attributes);
        if (!src) {
            skippedCount++;
            continue;
        }

        // Skip external images
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
            skippedCount++;
            continue;
        }

        // Resolve image path
        let imagePath = path.join(__dirname, src);

        // Try to find the image
        if (!fs.existsSync(imagePath)) {
            // Try without leading slash
            imagePath = path.join(__dirname, src.replace(/^\//, ''));
        }

        if (!fs.existsSync(imagePath)) {
            notFoundCount++;
            continue;
        }

        // Get dimensions
        const dimensions = await getImageDimensions(imagePath);
        if (!dimensions) {
            notFoundCount++;
            continue;
        }

        // Add width and height attributes
        const newTag = fullTag.replace(
            /<img([^>]*)>/i,
            `<img$1 width="${dimensions.width}" height="${dimensions.height}">`
        );

        html = html.replace(fullTag, newTag);
        modifiedCount++;
    }

    // Write updated HTML
    if (modifiedCount > 0) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`   ✅ Added dimensions to ${modifiedCount} images`);
    } else {
        console.log(`   ℹ️  No images modified`);
    }

    if (alreadyHasCount > 0) {
        console.log(`   ✓  ${alreadyHasCount} images already have dimensions`);
    }

    if (skippedCount > 0) {
        console.log(`   ⏭️  Skipped ${skippedCount} images (external or no src)`);
    }

    if (notFoundCount > 0) {
        console.log(`   ⚠️  ${notFoundCount} images not found or unreadable`);
    }

    return { modified: modifiedCount, skipped: skippedCount, alreadyHas: alreadyHasCount, notFound: notFoundCount };
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Starting Image Dimensions Addition...\n');
    console.log('='.repeat(60));

    let totalModified = 0;
    let totalSkipped = 0;
    let totalAlreadyHas = 0;
    let totalNotFound = 0;
    let processedCount = 0;

    for (const htmlFile of HTML_FILES) {
        const filePath = path.join(__dirname, htmlFile);

        if (fs.existsSync(filePath)) {
            const result = await addImageDimensions(htmlFile);
            if (result) {
                totalModified += result.modified;
                totalSkipped += result.skipped;
                totalAlreadyHas += result.alreadyHas;
                totalNotFound += result.notFound;
                processedCount++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✨ Image Dimensions Addition Complete!\n');
    console.log(`📊 Summary:`);
    console.log(`   Files processed: ${processedCount}`);
    console.log(`   Images with dimensions added: ${totalModified}`);
    console.log(`   Images already had dimensions: ${totalAlreadyHas}`);
    console.log(`   Images skipped (external/no src): ${totalSkipped}`);
    console.log(`   Images not found: ${totalNotFound}`);
    console.log(`   Total images processed: ${totalModified + totalSkipped + totalAlreadyHas + totalNotFound}`);
    console.log('\n✅ All files updated successfully!');
    console.log('\n⚠️  Next steps:');
    console.log('   1. Test all pages to ensure images display correctly');
    console.log('   2. Verify no layout shifts occur during page load');
    console.log('   3. Check responsive behavior (CSS should handle sizing)');
}

// Run the script
main().catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
});
