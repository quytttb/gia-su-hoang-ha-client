#!/bin/bash

# 🔍 SEO Testing Script for Gia Su Hoang Ha
# Usage: ./scripts/test-seo.sh [URL]

URL=${1:-"http://localhost:4173"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
REPORT_DIR="seo-reports"
REPORT_FILE="$REPORT_DIR/seo-test-$TIMESTAMP.txt"

# Create reports directory
mkdir -p $REPORT_DIR

echo "🔍 SEO Testing Report - $(date)" > $REPORT_FILE
echo "URL: $URL" >> $REPORT_FILE
echo "=================================================" >> $REPORT_FILE

# Function to test and log
test_and_log() {
    echo -e "\n📋 $1" | tee -a $REPORT_FILE
    echo "---" >> $REPORT_FILE
}

# Function to check if URL is accessible
check_url() {
    if curl -s --head $URL | head -n 1 | grep -q "200 OK"; then
        echo "✅ Website is accessible" | tee -a $REPORT_FILE
        return 0
    else
        echo "❌ Website is not accessible" | tee -a $REPORT_FILE
        return 1
    fi
}

# Test 1: Basic Accessibility
test_and_log "1. WEBSITE ACCESSIBILITY"
if ! check_url; then
    echo "Cannot proceed with SEO tests. Please check if the website is running." | tee -a $REPORT_FILE
    exit 1
fi

# Test 2: Meta Tags
test_and_log "2. META TAGS"
echo "Title Tag:" >> $REPORT_FILE
curl -s $URL | grep -o '<title[^>]*>[^<]*</title>' >> $REPORT_FILE

echo -e "\nMeta Description:" >> $REPORT_FILE
curl -s $URL | grep -o '<meta[^>]*name="description"[^>]*>' >> $REPORT_FILE

echo -e "\nMeta Keywords:" >> $REPORT_FILE
curl -s $URL | grep -o '<meta[^>]*name="keywords"[^>]*>' >> $REPORT_FILE

# Test 3: Open Graph Tags
test_and_log "3. OPEN GRAPH TAGS"
curl -s $URL | grep -o '<meta[^>]*property="og:[^"]*"[^>]*>' >> $REPORT_FILE

# Test 4: Twitter Cards
test_and_log "4. TWITTER CARDS"
curl -s $URL | grep -o '<meta[^>]*property="twitter:[^"]*"[^>]*>' >> $REPORT_FILE

# Test 5: Structured Data
test_and_log "5. STRUCTURED DATA"
if curl -s $URL | grep -q "application/ld+json"; then
    echo "✅ JSON-LD structured data found" >> $REPORT_FILE
    curl -s $URL | grep -A 10 "application/ld+json" | head -15 >> $REPORT_FILE
else
    echo "❌ No JSON-LD structured data found" >> $REPORT_FILE
fi

# Test 6: Sitemap
test_and_log "6. SITEMAP"
if curl -s $URL/sitemap.xml | grep -q "<?xml"; then
    echo "✅ Sitemap is accessible" >> $REPORT_FILE
    SITEMAP_URLS=$(curl -s $URL/sitemap.xml | grep -o '<loc>[^<]*</loc>' | wc -l)
    echo "Number of URLs in sitemap: $SITEMAP_URLS" >> $REPORT_FILE
else
    echo "❌ Sitemap not found or not accessible" >> $REPORT_FILE
fi

# Test 7: Robots.txt
test_and_log "7. ROBOTS.TXT"
if curl -s $URL/robots.txt | grep -q "User-agent"; then
    echo "✅ Robots.txt is accessible" >> $REPORT_FILE
    curl -s $URL/robots.txt | head -10 >> $REPORT_FILE
else
    echo "❌ Robots.txt not found" >> $REPORT_FILE
fi

# Test 8: Page Speed (Basic)
test_and_log "8. PAGE SPEED (Basic)"
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" $URL)
echo "Page load time: ${LOAD_TIME}s" >> $REPORT_FILE

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    echo "✅ Good load time (< 3s)" >> $REPORT_FILE
elif (( $(echo "$LOAD_TIME < 5.0" | bc -l) )); then
    echo "⚠️ Acceptable load time (3-5s)" >> $REPORT_FILE
else
    echo "❌ Slow load time (> 5s)" >> $REPORT_FILE
fi

# Test 9: Mobile-Friendly (Basic)
test_and_log "9. MOBILE-FRIENDLY (Basic)"
if curl -s $URL | grep -q 'viewport'; then
    echo "✅ Viewport meta tag found" >> $REPORT_FILE
else
    echo "❌ Viewport meta tag missing" >> $REPORT_FILE
fi

# Test 10: HTTPS (if applicable)
test_and_log "10. SECURITY"
if [[ $URL == https* ]]; then
    echo "✅ Using HTTPS" >> $REPORT_FILE
else
    echo "⚠️ Using HTTP (consider HTTPS for production)" >> $REPORT_FILE
fi

# Test 11: Heading Structure
test_and_log "11. HEADING STRUCTURE"
H1_COUNT=$(curl -s $URL | grep -o '<h1[^>]*>' | wc -l)
H2_COUNT=$(curl -s $URL | grep -o '<h2[^>]*>' | wc -l)
H3_COUNT=$(curl -s $URL | grep -o '<h3[^>]*>' | wc -l)

echo "H1 tags: $H1_COUNT" >> $REPORT_FILE
echo "H2 tags: $H2_COUNT" >> $REPORT_FILE
echo "H3 tags: $H3_COUNT" >> $REPORT_FILE

if [ $H1_COUNT -eq 1 ]; then
    echo "✅ Exactly one H1 tag (good)" >> $REPORT_FILE
elif [ $H1_COUNT -eq 0 ]; then
    echo "❌ No H1 tag found" >> $REPORT_FILE
else
    echo "⚠️ Multiple H1 tags found" >> $REPORT_FILE
fi

# Test 12: Internal Links
test_and_log "12. INTERNAL LINKS"
INTERNAL_LINKS=$(curl -s $URL | grep -o 'href="[^"]*"' | grep -v 'http' | wc -l)
echo "Internal links found: $INTERNAL_LINKS" >> $REPORT_FILE

# Summary
test_and_log "SUMMARY"
echo "SEO test completed at $(date)" >> $REPORT_FILE
echo "Report saved to: $REPORT_FILE" >> $REPORT_FILE

# Display summary
echo -e "\n🎯 SEO Test Summary:"
echo "✅ Report generated: $REPORT_FILE"
echo "📊 Key findings:"
grep -E "✅|❌|⚠️" $REPORT_FILE | tail -10

# Optional: Open report in default editor
if command -v code &> /dev/null; then
    echo -e "\n📝 Opening report in VS Code..."
    code $REPORT_FILE
elif command -v nano &> /dev/null; then
    echo -e "\n📝 Press Enter to view full report..."
    read
    nano $REPORT_FILE
fi

echo -e "\n🔍 SEO Testing completed!"
echo "Full report: $REPORT_FILE" 