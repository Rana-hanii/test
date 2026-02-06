#!/bin/bash
# Build script for Courseshub - Per-page CSS bundling + Readable JS
# Structure:
#   dist/css/bundles/*.bundle.css  (bundled CSS per page)
#   dist/js/bundles/*.bundle.js    (bundled libraries per page)
#   dist/js/pages/*.js             (readable page logic)

echo "🚀 Starting build process..."

# ================================================
# CONFIGURATION
# ================================================

# Page to HTML file mapping
declare -A PAGE_HTML=(
    ["home"]="index.html"
    ["about"]="about-us.html"
    ["courses-grid"]="courses-grid.html"
    ["courses-list"]="courses-list.html"
    ["courses-detail"]="courses-detail.html"
    ["event-detail"]="event-detail.html"
    ["instructor"]="instructor.html"
    ["instructor-detail"]="instructor-detail.html"
    ["pricing"]="pricing.html"
    ["faq"]="faq.html"
    ["blog-grid"]="blog-grid.html"
    ["blog-list"]="blog-list.html"
    ["blog-detail"]="blog-detail.html"
    ["contact"]="contact-us.html"
    ["login"]="login.html"
    ["register"]="register.html"
    ["profile"]="profile.html"
    ["checkout"]="checkout.html"
    ["video-detail"]="video-detail.html"
    ["404"]="404.html"
)

# ================================================
# STEP 0: Create dist directories
# ================================================
echo "📁 Creating output directories..."
mkdir -p dist/assets/css/bundles
mkdir -p dist/assets/js/bundles
mkdir -p dist/assets/js/pages
mkdir -p dist/assets/fonts
mkdir -p dist/assets/images
mkdir -p dist/assets/webfonts

# ================================================
# STEP 1: Split CSS if needed
# ================================================
# if [ ! -d "src/css/common" ] || [ ! -f "src/css/common/common.css" ]; then
#     echo "📄 Splitting CSS files..."
#     node scripts/split-css.js
# fi

# ================================================
# STEP 2: Build CSS bundles per page
# ================================================
echo "🎨 Building CSS bundles..."

# Common CSS components
COMMON_CSS_FILES=(
    "assets/css/bootstrap.min.css"
    "assets/css/fonts.css"
    "assets/css/fontawesome.min.css"
    "assets/css/swiper-bundle.min.css"
    "assets/css/fancybox.min.css"
    "assets/css/jquery-ui.css"
    "assets/css/animate.css"
)

# Build CSS bundle for each page
for page in "${!PAGE_HTML[@]}"; do
    echo "  Building ${page}.bundle.css..."
    
    # Start with common CSS files
    BUNDLE_CSS=""
    for css_file in "${COMMON_CSS_FILES[@]}"; do
        if [ -f "$css_file" ]; then
            BUNDLE_CSS+=$(cat "$css_file")
            BUNDLE_CSS+=$'\n'
        fi
    done
    
    # Add main style.css (common styles)
    # Add page specific style (includes common) from src
    if [ -f "src/css/pages/${page}.css" ]; then
        BUNDLE_CSS+=$(cat "src/css/pages/${page}.css")
        BUNDLE_CSS+=$'\n'
    fi
    
    # Add RTL styles
    if [ -f "assets/css/rtl-auth.css" ]; then
        BUNDLE_CSS+=$(cat "assets/css/rtl-auth.css")
        BUNDLE_CSS+=$'\n'
    fi
    
    # Write raw bundle first
    echo "$BUNDLE_CSS" > "dist/assets/css/bundles/${page}.bundle.css"
    
    # Rewrite paths for bundles (since they are one level deeper in css/bundles/)
    # 1. Fix FontAwesome/webfonts paths
    sed -i 's|\.\./webfonts/|../../webfonts/|g' "dist/assets/css/bundles/${page}.bundle.css"
    
    # 2. Fix image paths (images/ -> ../images/)
    sed -i 's|url("images/|url("../images/|g' "dist/assets/css/bundles/${page}.bundle.css"
    sed -i "s|url('images/|url('../images/|g" "dist/assets/css/bundles/${page}.bundle.css"
    sed -i 's|url(images/|url(../images/|g' "dist/assets/css/bundles/${page}.bundle.css"
    
    # Minify
    npx cleancss -o "dist/assets/css/bundles/${page}.bundle.css" "dist/assets/css/bundles/${page}.bundle.css"
    
    echo "  ✅ ${page}.bundle.css"
done

# ================================================
# STEP 3: Build JS bundles per page
# ================================================
echo "📦 Building JS bundles..."

# Core JS files needed by all pages
CORE_JS_FILES=(
    "assets/js/jquery-3.7.1.min.js"
    "assets/js/bootstrap.min.js"
)

# Feature JS files
SWIPER_JS="assets/js/swiper-bundle.min.js"
WOW_JS="assets/js/wow.min.js"
ISOTOPE_JS="assets/js/isotope.pkgd.min.js"
FANCYBOX_JS="assets/js/fancybox.min.js"
JQUERY_UI_JS="assets/js/jquery-ui.min.js"

# Custom JS files
CUSTOM_JS_FILES=(
    "assets/js/bg-moving.js"
    "assets/js/custom-scroll-count.js"
    "assets/js/back-to-top.js"
    "assets/js/custom.js"
)

# Page-specific JS requirements
declare -A PAGE_FEATURES=(
    ["home"]="swiper wow isotope custom"
    ["about"]="swiper wow custom"
    ["courses-grid"]="wow isotope custom"
    ["courses-list"]="wow custom"
    ["courses-detail"]="swiper wow fancybox custom"
    ["event-detail"]="swiper wow custom"
    ["instructor"]="wow custom"
    ["instructor-detail"]="wow custom"
    ["pricing"]="swiper wow custom"
    ["faq"]="wow custom"
    ["blog-grid"]="wow custom"
    ["blog-list"]="wow custom"
    ["blog-detail"]="wow fancybox custom"
    ["contact"]="wow custom"
    ["login"]="custom"
    ["register"]="custom"
    ["profile"]="custom"
    ["checkout"]="custom"
    ["video-detail"]="wow fancybox custom"
    ["404"]="custom"
)

# Build JS bundle for each page
for page in "${!PAGE_HTML[@]}"; do
    echo "  Building ${page}.bundle.js..."
    
    # Start with core JS
    BUNDLE_JS=""
    for js_file in "${CORE_JS_FILES[@]}"; do
        if [ -f "$js_file" ]; then
            BUNDLE_JS+=$(cat "$js_file")
            BUNDLE_JS+=$';\n'
        fi
    done
    
    # Add feature JS based on page requirements
    features="${PAGE_FEATURES[$page]}"
    
    if [[ "$features" == *"swiper"* ]] && [ -f "$SWIPER_JS" ]; then
        BUNDLE_JS+=$(cat "$SWIPER_JS")
        BUNDLE_JS+=$';\n'
    fi
    
    if [[ "$features" == *"wow"* ]] && [ -f "$WOW_JS" ]; then
        BUNDLE_JS+=$(cat "$WOW_JS")
        BUNDLE_JS+=$';\n'
    fi
    
    if [[ "$features" == *"isotope"* ]] && [ -f "$ISOTOPE_JS" ]; then
        BUNDLE_JS+=$(cat "$ISOTOPE_JS")
        BUNDLE_JS+=$';\n'
    fi
    
    if [[ "$features" == *"fancybox"* ]] && [ -f "$FANCYBOX_JS" ]; then
        BUNDLE_JS+=$(cat "$FANCYBOX_JS")
        BUNDLE_JS+=$';\n'
    fi
    
    if [[ "$features" == *"jquery-ui"* ]] && [ -f "$JQUERY_UI_JS" ]; then
        BUNDLE_JS+=$(cat "$JQUERY_UI_JS")
        BUNDLE_JS+=$';\n'
    fi
    
    # Add custom JS files
    if [[ "$features" == *"custom"* ]]; then
        for js_file in "${CUSTOM_JS_FILES[@]}"; do
            if [ -f "$js_file" ]; then
                BUNDLE_JS+=$(cat "$js_file")
                BUNDLE_JS+=$';\n'
            fi
        done
    fi
    
    # Write and minify bundle
    echo "$BUNDLE_JS" > "dist/assets/js/bundles/${page}.bundle.js"
    npx terser "dist/assets/js/bundles/${page}.bundle.js" -o "dist/assets/js/bundles/${page}.bundle.js" --compress --mangle
    
    echo "  ✅ ${page}.bundle.js"
done

# ================================================
# STEP 4: Copy page JS files (readable, not minified)
# ================================================
echo "📄 Copying page JS files (readable)..."

for page in "${!PAGE_HTML[@]}"; do
    src_js="src/js/pages/${page}.js"
    if [ -f "$src_js" ]; then
        cp "$src_js" "dist/assets/js/pages/${page}.js"
        echo "  ✅ ${page}.js"
    fi
done

# ================================================
# STEP 5: Copy static assets
# ================================================
echo "📁 Copying static assets..."
cp -r assets/fonts/* dist/assets/fonts/ 2>/dev/null || true
cp -r assets/webfonts/* dist/assets/webfonts/
mkdir -p dist/assets/css/images
cp -r assets/css/images/* dist/assets/css/images/ 2>/dev/null || true

echo "✅ Static assets copied"

# ================================================
# STEP 6: Convert images to WebP
# ================================================
echo "🖼️  Converting images to WebP..."
if [ -f "scripts/convert-to-webp.js" ]; then
    node scripts/convert-to-webp.js
elif [ -f "convert-to-webp.js" ]; then
    node convert-to-webp.js
fi

# ================================================
# STEP 7: Process HTML files
# ================================================
echo "📄 Processing HTML files..."

for page in "${!PAGE_HTML[@]}"; do
    htmlfile="${PAGE_HTML[$page]}"
    
    if [ -f "$htmlfile" ]; then
        # Read the HTML file
        html_content=$(cat "$htmlfile")
        
        # Remove old CSS links and add new bundle
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/swiper-bundle.min.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/fontawesome.min.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/fancybox.min.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/jquery-ui.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/animate.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<link rel="stylesheet" type="text/css" href="assets/css/rtl-auth.css">|<!-- CSS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e "s|<link rel=\"stylesheet\" type=\"text/css\" href=\"assets/css/style.css\">|<link rel=\"stylesheet\" type=\"text/css\" href=\"assets/css/bundles/${page}.bundle.css\">|g")
        
        # Remove old JS scripts and add new bundle + page JS
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/jquery-3.7.1.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/jquery-ui.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/bootstrap.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/swiper-bundle.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/wow.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/isotope.pkgd.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/fancybox.min.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/bg-moving.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/pricing-range.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/custom-scroll-count.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/custom-fancybox.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e 's|<script src="assets/js/back-to-top.js"></script>|<!-- JS moved to bundle -->|g')
        html_content=$(echo "$html_content" | sed -e "s|<script src=\"assets/js/custom.js\"></script>|<script src=\"assets/js/bundles/${page}.bundle.js\"></script>\n    <script src=\"assets/js/pages/${page}.js\"></script>|g")
        
        # Remove placeholder comments
        html_content=$(echo "$html_content" | sed -e '/<!-- CSS moved to bundle -->/d')
        html_content=$(echo "$html_content" | sed -e '/<!-- JS moved to bundle -->/d')
        
        # Remove Cloudflare scripts
        html_content=$(echo "$html_content" | sed -e '/<script data-cfasync="false" src="..\/cdn-cgi/d')
        html_content=$(echo "$html_content" | sed -e '/<script defer src="https:\/\/static.cloudflareinsights.com/d')
        
        # Write to dist
        echo "$html_content" > "dist/$htmlfile"
        echo "  ✅ $htmlfile"
    fi
done

# ================================================
# STEP 8: Additional optimizations
# ================================================
echo "🔄 Updating image references to WebP..."
if [ -f "scripts/update-image-refs.js" ]; then
    node scripts/update-image-refs.js
elif [ -f "update-image-refs.js" ]; then
    node update-image-refs.js
fi

echo "🔧 Fixing CLS issues..."
if [ -f "scripts/fix-cls.js" ]; then
    node scripts/fix-cls.js
elif [ -f "fix-cls.js" ]; then
    node fix-cls.js
fi


echo "⚡ Adding preload hints..."
if [ -f "scripts/add-preloads.js" ]; then
    node scripts/add-preloads.js
elif [ -f "add-preloads.js" ]; then
    node add-preloads.js
fi

echo "🚀 Optimizing resource loading..."
if [ -f "scripts/optimize-loading.js" ]; then
    node scripts/optimize-loading.js
elif [ -f "optimize-loading.js" ]; then
    node optimize-loading.js
fi

echo "♿ Fixing accessibility issues..."
if [ -f "scripts/fix-accessibility.js" ]; then
    node scripts/fix-accessibility.js
elif [ -f "fix-accessibility.js" ]; then
    node fix-accessibility.js
fi

echo "⚡ Fixing LCP issues..."
if [ -f "scripts/fix-lcp.js" ]; then
    node scripts/fix-lcp.js
elif [ -f "fix-lcp.js" ]; then
    node fix-lcp.js
fi

# Fix RTL direction
echo "🔄 Fixing RTL direction..."
for file in dist/*.html; do
    sed -i 's/<html lang="en">/<html lang="ar" dir="rtl">/g' "$file" 2>/dev/null || true
done

# ================================================
# Summary
# ================================================
echo ""
echo "🎉 Build complete!"
echo ""
echo "📊 Results:"
echo "  CSS Bundles: $(ls -1 dist/assets/css/bundles/*.css 2>/dev/null | wc -l) files"
echo "  JS Bundles:  $(ls -1 dist/assets/js/bundles/*.js 2>/dev/null | wc -l) files"
echo "  JS Pages:    $(ls -1 dist/assets/js/pages/*.js 2>/dev/null | wc -l) files"
echo ""
echo "📂 Output structure:"
echo "  dist/"
echo "  ├── assets/"
echo "  │   ├── css/bundles/*.bundle.css  (minified per-page CSS)"
echo "  │   ├── js/bundles/*.bundle.js    (minified per-page libraries)"
echo "  │   └── js/pages/*.js             (readable page logic)"
echo "  └── *.html"
echo ""
echo "📂 Output folder: dist/"
