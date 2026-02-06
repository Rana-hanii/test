/**
 * Fix Arabic content - page titles, breadcrumbs, and inner-banner text
 */

const fs = require('fs');
const path = require('path');

// Translation map for page titles and breadcrumbs
const translations = {
    // Page titles
    'Contact Us': 'تواصل معنا',
    'About Us': 'من نحن',
    'About us': 'من نحن',
    'Courses Grid': 'شبكة الدورات',
    'Courses List': 'قائمة الدورات',
    'Courses Detail': 'تفاصيل الدورة',
    'Course Detail': 'تفاصيل الدورة',
    'Blog Grid': 'المدونة',
    'Blog List': 'قائمة المقالات',
    'Blog Detail': 'تفاصيل المقال',
    'Event Detail': 'تفاصيل الفعالية',
    'Instructor': 'المدربون',
    'Instructors': 'المدربون',
    'Instructor Detail': 'تفاصيل المدرب',
    'Pricing': 'الأسعار',
    'FAQ': 'الأسئلة الشائعة',
    'Faq': 'الأسئلة الشائعة',
    '404 Error': 'خطأ 404',
    'Error 404': 'خطأ 404',
    'Home': 'الرئيسية',
    'Login': 'تسجيل الدخول',
    'Register': 'إنشاء حساب',
    'Profile': 'الملف الشخصي',
    'Video Detail': 'تفاصيل الفيديو',
    
    // Common words
    'Search Here...': 'ابحث هنا...',
    'Get Started': 'ابدأ الآن',
    'Aliment': 'عنصر زخرفي',
    'Search Icon': 'أيقونة البحث'
};

function translateContent(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace translations
    for (const [eng, ar] of Object.entries(translations)) {
        // Replace in h1 titles
        const h1Regex = new RegExp(`<h1 class="h1-title">${eng}</h1>`, 'gi');
        if (h1Regex.test(content)) {
            content = content.replace(h1Regex, `<h1 class="h1-title">${ar}</h1>`);
            modified = true;
        }
        
        // Replace in breadcrumb links
        const breadcrumbLinkRegex = new RegExp(`title="${eng}">${eng}</a>`, 'gi');
        if (breadcrumbLinkRegex.test(content)) {
            content = content.replace(breadcrumbLinkRegex, `title="${ar}">${ar}</a>`);
            modified = true;
        }
        
        // Replace in breadcrumb text (non-link)
        const breadcrumbTextRegex = new RegExp(`<li>${eng}</li>`, 'gi');
        if (breadcrumbTextRegex.test(content)) {
            content = content.replace(breadcrumbTextRegex, `<li>${ar}</li>`);
            modified = true;
        }
        
        // Replace placeholder text
        const placeholderRegex = new RegExp(`placeholder="${eng}"`, 'gi');
        if (placeholderRegex.test(content)) {
            content = content.replace(placeholderRegex, `placeholder="${ar}"`);
            modified = true;
        }
        
        // Replace alt text
        const altRegex = new RegExp(`alt="${eng}"`, 'gi');
        if (altRegex.test(content)) {
            content = content.replace(altRegex, `alt="${ar}"`);
            modified = true;
        }
    }
    
    // Fix the breadcrumb angle icon direction for RTL
    content = content.replace(
        /fa-angle-right/g,
        'fa-angle-left'
    );
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function main() {
    console.log('🌐 Translating content to Arabic...\n');
    
    // Process source files
    const sourceFiles = fs.readdirSync('.')
        .filter(f => f.endsWith('.html'));
    
    let count = 0;
    sourceFiles.forEach(file => {
        if (translateContent(file)) {
            console.log(`✅ ${file}`);
            count++;
        }
    });
    
    // Process dist files
    const distFiles = fs.readdirSync('dist')
        .filter(f => f.endsWith('.html'))
        .map(f => path.join('dist', f));
    
    distFiles.forEach(file => {
        if (translateContent(file)) {
            console.log(`✅ ${file}`);
            count++;
        }
    });
    
    console.log(`\n✅ Translated content in ${count} files`);
}

main();
