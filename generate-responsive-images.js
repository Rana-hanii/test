/**
 * Generate responsive images at multiple sizes
 * Creates: image-320w.webp, image-640w.webp, image-1024w.webp
 * Run: node generate-responsive-images.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'assets/images';
const DEST_DIR = 'dist/assets/images';

// Sizes to generate (width in pixels)
const SIZES = [320, 640, 1024];
const QUALITY = 80;

async function generateResponsiveSizes(inputPath) {
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const ext = path.extname(inputPath).toLowerCase();
    
    // Skip SVGs and small icons
    if (ext === '.svg' || fileName.includes('icon') || fileName.includes('logo')) {
        return [];
    }
    
    const generated = [];
    
    try {
        const metadata = await sharp(inputPath).metadata();
        
        // Only generate sizes smaller than original
        for (const size of SIZES) {
            if (metadata.width > size) {
                const outputPath = path.join(DEST_DIR, `${fileName}-${size}w.webp`);
                
                await sharp(inputPath)
                    .resize(size, null, { withoutEnlargement: true })
                    .webp({ quality: QUALITY })
                    .toFile(outputPath);
                
                generated.push({ size, path: outputPath });
            }
        }
        
        if (generated.length > 0) {
            console.log(`✅ ${fileName}: generated ${generated.length} sizes`);
        }
    } catch (error) {
        // Skip files that can't be processed
    }
    
    return generated;
}

async function main() {
    console.log('📐 Generating responsive images...\n');
    
    const files = fs.readdirSync(SOURCE_DIR)
        .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
        .map(f => path.join(SOURCE_DIR, f));
    
    let totalGenerated = 0;
    
    for (const file of files) {
        const generated = await generateResponsiveSizes(file);
        totalGenerated += generated.length;
    }
    
    console.log(`\n✅ Generated ${totalGenerated} responsive image variants`);
}

main().catch(console.error);
