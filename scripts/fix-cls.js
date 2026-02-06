/**
 * Fix Cumulative Layout Shift (CLS) issues
 * - Adds width/height attributes to images
 * - Adds aspect-ratio CSS
 * Run: node fix-cls.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const DIST_DIR = 'dist';
const IMAGES_DIR = 'dist/assets/images';

// Cache for image dimensions
const dimensionsCache = {};

async function getImageDimensions(imagePath) {
    if (dimensionsCache[imagePath]) {
        return dimensionsCache[imagePath];
    }

    try {
        const fullPath = path.join(DIST_DIR, imagePath);
        if (!fs.existsSync(fullPath)) {
            // Try with different extensions
            const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            const webpFullPath = path.join(DIST_DIR, webpPath);
            if (fs.existsSync(webpFullPath)) {
                const metadata = await sharp(webpFullPath).metadata();
                dimensionsCache[imagePath] = { width: metadata.width, height: metadata.height };
                return dimensionsCache[imagePath];
            }
            return null;
        }

        const metadata = await sharp(fullPath).metadata();
        dimensionsCache[imagePath] = { width: metadata.width, height: metadata.height };
        return dimensionsCache[imagePath];
    } catch (error) {
        console.error(`  ⚠️ Could not get dimensions for ${imagePath}: ${error.message}`);
        return null;
    }
}

async function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find all img tags without width attribute
    const imgRegex = /<img\s+([^>]*?)src="([^"]+)"([^>]*?)>/gi;
    const matches = [...content.matchAll(imgRegex)];

    for (const match of matches) {
        const fullTag = match[0];
        const beforeSrc = match[1];
        const src = match[2];
        const afterSrc = match[3];

        // Skip if already has width
        if (fullTag.includes('width=')) {
            continue;
        }

        // Skip SVG images (they're usually icons with flexible size)
        if (src.endsWith('.svg')) {
            continue;
        }

        // Get image dimensions
        const dims = await getImageDimensions(src);
        if (!dims) {
            continue;
        }

        // Create new tag with dimensions
        const newTag = `<img ${beforeSrc}src="${src}"${afterSrc} width="${dims.width}" height="${dims.height}" loading="lazy">`;
        content = content.replace(fullTag, newTag);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

async function addClsFixCss() {
    const bundlesDir = path.join(DIST_DIR, 'assets/css/bundles');

    // Check if bundles directory exists
    if (!fs.existsSync(bundlesDir)) {
        console.log('⚠️  Bundles directory not found, skipping CSS fixes');
        return;
    }

    const clsFixCss = `
/* CLS Fix - Prevent layout shifts */
img {
    max-width: 100%;
    height: auto;
}

/* Reserve space for common image containers */
.course-box-image img,
.blog-box-image img,
.instructor-image img,
.event-image img {
    aspect-ratio: 16/10;
    object-fit: cover;
}

.client-image img,
.testimonial-image img,
.author-image img {
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 50%;
}

/* Prevent font swap CLS */
body {
    font-display: swap;
}

/* Loader takes full space to prevent CLS */
.loader-box {
    position: fixed;
    inset: 0;
    z-index: 9999;
}
`;

    // Get all bundle CSS files
    const bundleFiles = fs.readdirSync(bundlesDir)
        .filter(f => f.endsWith('.bundle.css'));

    let updatedCount = 0;
    for (const file of bundleFiles) {
        const cssPath = path.join(bundlesDir, file);
        let css = fs.readFileSync(cssPath, 'utf8');

        // Check if CLS fix already added
        if (css.includes('/* CLS Fix */')) {
            continue;
        }

        css = css + clsFixCss;
        fs.writeFileSync(cssPath, css, 'utf8');
        updatedCount++;
    }

    if (updatedCount > 0) {
        console.log(`✅ Added CLS fix CSS to ${updatedCount} bundle files`);
    } else {
        console.log('ℹ️  CLS CSS fix already applied to all bundles');
    }
}

async function main() {
    console.log('🔧 Fixing Cumulative Layout Shift (CLS) issues...\n');

    // Step 1: Add CSS fixes
    console.log('📝 Step 1: Adding CSS fixes...');
    await addClsFixCss();

    // Step 2: Add dimensions to images in HTML files
    console.log('\n📝 Step 2: Adding dimensions to images...');

    const htmlFiles = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(DIST_DIR, f));

    let updatedCount = 0;
    for (const file of htmlFiles) {
        const updated = await processHtmlFile(file);
        if (updated) {
            console.log(`  ✅ ${path.basename(file)}`);
            updatedCount++;
        }
    }

    console.log(`\n✅ Done! Updated ${updatedCount} HTML files.`);
    console.log('\n📋 CLS Prevention Summary:');
    console.log('  - Added width/height to images');
    console.log('  - Added lazy loading to images');
    console.log('  - Added aspect-ratio CSS for image containers');
    console.log('  - Added font-display: swap');
}

main().catch(console.error);
