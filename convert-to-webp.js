/**
 * Convert all JPG, JPEG, and PNG images to WebP format
 * Run: node convert-to-webp.js
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'assets/images';
const DEST_DIR = 'dist/assets/images';
const QUALITY = 80; // WebP quality (0-100)

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

// Get all image files
function getImageFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            files.push(...getImageFiles(fullPath));
        } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
            files.push(fullPath);
        }
    }
    
    return files;
}

async function convertImage(inputPath) {
    const relativePath = path.relative(SOURCE_DIR, inputPath);
    const outputDir = path.join(DEST_DIR, path.dirname(relativePath));
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const outputPath = path.join(outputDir, `${baseName}.webp`);
    
    // Create output directory if needed
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    try {
        const info = await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath);
        
        const inputSize = fs.statSync(inputPath).size;
        const savings = ((inputSize - info.size) / inputSize * 100).toFixed(1);
        
        console.log(`✅ ${relativePath} → ${baseName}.webp (${savings}% smaller)`);
        return { success: true, savings: inputSize - info.size };
    } catch (error) {
        console.error(`❌ Failed to convert ${inputPath}: ${error.message}`);
        return { success: false, savings: 0 };
    }
}

async function copyNonConvertibleFiles(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            await copyNonConvertibleFiles(fullPath);
        } else if (/\.(svg|gif|ico|webp)$/i.test(item)) {
            // Copy SVG, GIF, ICO, and existing WebP files as-is
            const relativePath = path.relative(SOURCE_DIR, fullPath);
            const destPath = path.join(DEST_DIR, relativePath);
            const destDir = path.dirname(destPath);
            
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            fs.copyFileSync(fullPath, destPath);
            console.log(`📋 Copied: ${relativePath}`);
        }
    }
}

function cleanOldImages(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (/\.(jpg|jpeg|png)$/i.test(item)) {
            fs.unlinkSync(fullPath);
        }
    }
}

async function main() {
    console.log('🖼️  WebP Image Converter\n');
    console.log(`Source: ${SOURCE_DIR}`);
    console.log(`Destination: ${DEST_DIR}`);
    console.log(`Quality: ${QUALITY}%\n`);
    
    // Clean old JPG/PNG from destination
    cleanOldImages(DEST_DIR);
    
    // Get all images to convert
    const imageFiles = getImageFiles(SOURCE_DIR);
    console.log(`Found ${imageFiles.length} images to convert\n`);
    
    // Convert images
    let totalSavings = 0;
    let successCount = 0;
    
    for (const file of imageFiles) {
        const result = await convertImage(file);
        if (result.success) {
            successCount++;
            totalSavings += result.savings;
        }
    }
    
    // Copy non-convertible files (SVG, GIF, etc.)
    console.log('\n📋 Copying SVG and other files...\n');
    await copyNonConvertibleFiles(SOURCE_DIR);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Converted: ${successCount}/${imageFiles.length} images`);
    console.log(`💾 Total savings: ${(totalSavings / 1024 / 1024).toFixed(2)} MB`);
    console.log('='.repeat(50));
}

main().catch(console.error);
