/**
 * Add srcset attributes to images for responsive loading
 * Run: node add-srcset.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';
const IMAGES_DIR = 'dist/assets/images';

// Get available responsive sizes for an image
function getAvailableSizes(baseName) {
    const sizes = [];
    const widths = [320, 640, 1024];
    
    for (const w of widths) {
        const fileName = `${baseName}-${w}w.webp`;
        const filePath = path.join(IMAGES_DIR, fileName);
        if (fs.existsSync(filePath)) {
            sizes.push({ width: w, file: fileName });
        }
    }
    
    return sizes;
}

function addSrcsetToHtml(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Find all img tags with webp images
    const imgRegex = /<img([^>]*)src="assets\/images\/([^"]+)\.webp"([^>]*)>/gi;
    
    content = content.replace(imgRegex, (match, before, imageName, after) => {
        // Skip if already has srcset
        if (match.includes('srcset')) {
            return match;
        }
        
        // Skip icons, logos, SVGs, and small images
        if (imageName.includes('icon') || 
            imageName.includes('aliment') || 
            imageName.includes('loader') ||
            imageName.toLowerCase().includes('logo')) {
            return match;
        }
        
        const sizes = getAvailableSizes(imageName);
        
        if (sizes.length === 0) {
            return match;
        }
        
        // Build srcset
        const srcset = sizes.map(s => 
            `assets/images/${s.file} ${s.width}w`
        ).join(', ') + `, assets/images/${imageName}.webp 1200w`;
        
        // Build sizes attribute based on typical usage
        const sizesAttr = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1200px';
        
        modified = true;
        
        // Add srcset and sizes
        return `<img${before}src="assets/images/${imageName}.webp" srcset="${srcset}" sizes="${sizesAttr}"${after}>`;
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('🖼️  Adding srcset for responsive images...\n');
    
    const htmlFiles = fs.readdirSync(DIST_DIR)
        .filter(f => f.endsWith('.html'))
        .map(f => path.join(DIST_DIR, f));
    
    let count = 0;
    for (const file of htmlFiles) {
        if (addSrcsetToHtml(file)) {
            console.log(`✅ ${path.basename(file)}`);
            count++;
        }
    }
    
    console.log(`\n✅ Updated ${count} HTML files with srcset`);
    console.log('\n📱 Browsers will now load smaller images on mobile!');
}

main();
