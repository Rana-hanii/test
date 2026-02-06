/**
 * Update image references in HTML files from .jpg/.png to .webp
 * Run: node update-image-refs.js
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = 'dist';

function updateImageReferences(content) {
    // Replace .jpg and .png with .webp in img src attributes
    // But keep .svg, .gif, and favicon references as-is
    
    let updated = content;
    
    // Replace in src attributes (but not favicon)
    updated = updated.replace(
        /src="([^"]*?)(\.jpg|\.jpeg|\.png)"/gi,
        (match, path, ext) => {
            // Keep favicon as PNG (some browsers need it)
            if (path.includes('favicon')) {
                return match;
            }
            return `src="${path}.webp"`;
        }
    );
    
    // Replace in srcset attributes
    updated = updated.replace(
        /srcset="([^"]*?)(\.jpg|\.jpeg|\.png)"/gi,
        (match, path, ext) => `srcset="${path}.webp"`
    );
    
    // Replace in data-src attributes (lazy loading)
    updated = updated.replace(
        /data-src="([^"]*?)(\.jpg|\.jpeg|\.png)"/gi,
        (match, path, ext) => `data-src="${path}.webp"`
    );
    
    // Replace in background-image inline styles
    updated = updated.replace(
        /url\(([^)]*?)(\.jpg|\.jpeg|\.png)\)/gi,
        (match, path, ext) => `url(${path}.webp)`
    );
    
    return updated;
}

function processHtmlFiles(dir) {
    const items = fs.readdirSync(dir);
    let totalUpdated = 0;
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            totalUpdated += processHtmlFiles(fullPath);
        } else if (item.endsWith('.html')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const updated = updateImageReferences(content);
            
            if (content !== updated) {
                fs.writeFileSync(fullPath, updated, 'utf8');
                console.log(`✅ Updated: ${fullPath}`);
                totalUpdated++;
            }
        }
    }
    
    return totalUpdated;
}

console.log('🔄 Updating image references to WebP...\n');
const count = processHtmlFiles(DIST_DIR);
console.log(`\n✅ Done! Updated ${count} HTML files.`);
