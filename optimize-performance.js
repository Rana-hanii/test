const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Master Performance Optimization Script
 * 
 * Runs all performance optimizations in the correct order:
 * 1. Extract inline CSS
 * 2. Convert images to WebP
 * 3. Add lazy loading
 * 4. Add image dimensions
 * 5. Optimize CSS and JS
 */

const STEPS = [
    {
        name: 'Extract Inline CSS',
        script: 'extract-inline-css.js',
        description: 'Removes inline CSS from HTML files',
        required: true
    },
    {
        name: 'Add Lazy Loading',
        script: 'add-lazy-loading.js',
        description: 'Adds loading="lazy" to images',
        required: true
    },
    {
        name: 'Add Image Dimensions',
        script: 'add-image-dimensions.js',
        description: 'Adds width/height to prevent CLS',
        required: false // Optional because it requires sharp
    },
    {
        name: 'Convert Images to WebP',
        script: 'convert-to-webp.js',
        description: 'Converts JPG/PNG to WebP format',
        required: false // Optional, uses existing script
    }
];

/**
 * Run a single optimization step
 */
function runStep(step, index, total) {
    console.log('\n' + '='.repeat(70));
    console.log(`📌 Step ${index + 1}/${total}: ${step.name}`);
    console.log(`   ${step.description}`);
    console.log('='.repeat(70));

    const scriptPath = path.join(__dirname, step.script);

    if (!fs.existsSync(scriptPath)) {
        if (step.required) {
            console.log(`❌ Required script not found: ${step.script}`);
            return false;
        } else {
            console.log(`⚠️  Optional script not found: ${step.script} (skipping)`);
            return true;
        }
    }

    try {
        execSync(`node "${scriptPath}"`, {
            stdio: 'inherit',
            cwd: __dirname
        });
        console.log(`\n✅ ${step.name} completed successfully!`);
        return true;
    } catch (error) {
        console.log(`\n❌ ${step.name} failed!`);
        if (step.required) {
            console.log(`   This is a required step. Stopping execution.`);
            return false;
        } else {
            console.log(`   This is an optional step. Continuing...`);
            return true;
        }
    }
}

/**
 * Create a summary report
 */
function createSummaryReport() {
    const HTML_FILES = [
        'index.html',
        'about-us.html',
        'profile.html',
        'pricing.html',
        'courses-grid.html'
    ];

    console.log('\n' + '='.repeat(70));
    console.log('📊 OPTIMIZATION SUMMARY REPORT');
    console.log('='.repeat(70));
    console.log('\nFile Sizes (Sample):');
    console.log('-'.repeat(70));

    HTML_FILES.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`   ${file.padEnd(25)} ${sizeKB.padStart(10)} KB`);
        }
    });

    // Check if backups exist
    const backupDir = path.join(__dirname, 'backup-html');
    if (fs.existsSync(backupDir)) {
        console.log('\n📁 Backups:');
        console.log(`   Original files backed up to: backup-html/`);
        console.log(`   You can restore from backups if needed`);
    }

    // Check if extracted CSS exists
    const extractedDir = path.join(__dirname, 'assets', 'css', 'extracted');
    if (fs.existsSync(extractedDir)) {
        console.log('\n📝 Extracted CSS:');
        console.log(`   Inline CSS saved to: assets/css/extracted/`);
        console.log(`   (For reference only, not used in production)`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('\n');
    console.log('╔' + '═'.repeat(68) + '╗');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('║' + '  🚀 COURSESHUB PERFORMANCE OPTIMIZATION SUITE  '.padEnd(68) + '║');
    console.log('║' + ' '.repeat(68) + '║');
    console.log('╚' + '═'.repeat(68) + '╝');
    console.log('\nThis script will run all performance optimizations:');
    STEPS.forEach((step, i) => {
        console.log(`   ${i + 1}. ${step.name}`);
    });
    console.log('\n⚠️  WARNING: This will modify your HTML files!');
    console.log('   Backups will be created automatically.\n');

    // Run all steps
    let allSuccess = true;
    for (let i = 0; i < STEPS.length; i++) {
        const success = runStep(STEPS[i], i, STEPS.length);
        if (!success && STEPS[i].required) {
            allSuccess = false;
            break;
        }
    }

    // Create summary report
    createSummaryReport();

    // Final message
    console.log('\n' + '='.repeat(70));
    if (allSuccess) {
        console.log('✨ ALL OPTIMIZATIONS COMPLETED SUCCESSFULLY! ✨');
        console.log('='.repeat(70));
        console.log('\n📋 Next Steps:');
        console.log('   1. Test all pages in your browser');
        console.log('   2. Verify CSS bundles are loading correctly');
        console.log('   3. Check that images load properly with lazy loading');
        console.log('   4. Run Lighthouse audit to measure improvements');
        console.log('   5. If everything works, delete backup-html/ folder');
        console.log('\n💡 To test locally:');
        console.log('   npm run serve:dist');
        console.log('   or open HTML files directly in browser\n');
    } else {
        console.log('⚠️  SOME OPTIMIZATIONS FAILED');
        console.log('='.repeat(70));
        console.log('\n   Please check the error messages above.');
        console.log('   You can restore from backups if needed.\n');
    }
}

// Run the master script
main();
