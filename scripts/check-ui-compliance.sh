#!/bin/bash
# UI Compliance Check Script
# Detects ad hoc UI patterns in ERP routes that should use shared components

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SEARCH_PATHS="src/routes/erp src/routes/+page.svelte"
ISSUES_FOUND=0

echo "Checking UI compliance in ERP routes..."
echo ""

check_pattern() {
    local pattern="$1"
    local message="$2"
    local suggestion="$3"
    
    if grep -rn --include="*.svelte" "$pattern" $SEARCH_PATHS 2>/dev/null; then
        echo -e "${YELLOW}Warning:${NC} $message"
        echo -e "  ${GREEN}Suggestion:${NC} $suggestion"
        echo ""
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
}

# Check for ad hoc button styling (should use Button component)
echo "Checking for ad hoc button patterns..."
check_pattern 'class="[^"]*bg-blue-600[^"]*"' \
    "Found ad hoc primary button styling (bg-blue-600)" \
    "Use <Button> component instead"

check_pattern 'class="[^"]*bg-green-700[^"]*"' \
    "Found ad hoc success button styling (bg-green-700)" \
    "Use <Button variant=\"secondary\"> component instead"

check_pattern 'class="[^"]*bg-gray-900[^"]*px-[^"]*py-[^"]*text-white' \
    "Found ad hoc dark button styling" \
    "Use <Button variant=\"secondary\"> component instead"

# Check for ad hoc input styling (should use Input component)
echo "Checking for ad hoc input patterns..."
check_pattern '<input[^>]*class="[^"]*border-gray-300[^"]*"' \
    "Found ad hoc input styling (border-gray-300)" \
    "Use <Input> component instead"

# Check for ad hoc textarea styling (should use Textarea component)
echo "Checking for ad hoc textarea patterns..."
check_pattern '<textarea[^>]*class="[^"]*border-gray-300[^"]*"' \
    "Found ad hoc textarea styling (border-gray-300)" \
    "Use <Textarea> component instead"

# Check for ad hoc alert/status message styling (should use Alert component)
echo "Checking for ad hoc alert patterns..."
check_pattern 'class="[^"]*border-amber-200[^"]*bg-amber-50[^"]*"' \
    "Found ad hoc warning message styling" \
    "Use <Alert variant=\"warning\"> component instead"

check_pattern 'class="[^"]*border-red-[^"]*bg-red-[^"]*"' \
    "Found ad hoc error message styling" \
    "Use <Alert variant=\"destructive\"> component instead"

# Check for ad hoc link styling that should be Button
echo "Checking for ad hoc action link patterns..."
check_pattern '<a[^>]*class="[^"]*text-blue-700[^"]*underline[^"]*"' \
    "Found ad hoc action link styling" \
    "Use <Button variant=\"link\"> component instead"

echo "========================================"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC} No ad hoc UI patterns detected."
    exit 0
else
    echo -e "${RED}Found $ISSUES_FOUND potential issue(s).${NC}"
    echo "Please review and consider using shared UI components."
    echo "See docs/ui-guidelines.md for component mapping."
    exit 1
fi
