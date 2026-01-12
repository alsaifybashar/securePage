#!/bin/bash
# ===========================================
# SECUREPENT PRODUCTION CLEANUP SCRIPT
# Removes sensitive files from the deployment
# ===========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================"
echo "   SECUREPENT SECURITY CLEANUP"
echo "========================================"
echo ""

# Ensure script is run from project root
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}Error: Run this script from the project root directory${NC}"
    exit 1
fi

# Count files to be removed
echo -e "${YELLOW}[1/4]${NC} Scanning for sensitive files..."

FILES_TO_REMOVE=()

# Environment files (except examples)
for f in .env .env.local .env.production .env.development .env.staging .env.test; do
    [ -f "$f" ] && FILES_TO_REMOVE+=("$f")
done

# Git directory
[ -d ".git" ] && FILES_TO_REMOVE+=(".git (directory)")

# Database files
for f in *.sql *.sqlite *.sqlite3 *.db dump.* backup.*; do
    [ -f "$f" ] 2>/dev/null && FILES_TO_REMOVE+=("$f")
done

# Log files
for f in *.log error.log debug.log access.log npm-debug.log*; do
    [ -f "$f" ] 2>/dev/null && FILES_TO_REMOVE+=("$f")
done

# Config backups
for f in *.bak *.backup *.old *.orig; do
    [ -f "$f" ] 2>/dev/null && FILES_TO_REMOVE+=("$f")
done

# CI/CD files
for f in .travis.yml .gitlab-ci.yml Jenkinsfile .circleci; do
    [ -e "$f" ] && FILES_TO_REMOVE+=("$f")
done

# Infrastructure files
for f in .terraform *.tfstate *.tfvars .k8s; do
    [ -e "$f" ] && FILES_TO_REMOVE+=("$f")
done

# Credentials
for f in .credentials *.pem *.key *.p12; do
    [ -f "$f" ] 2>/dev/null && FILES_TO_REMOVE+=("$f")
done

# Apache/htaccess
for f in .htaccess .htpasswd; do
    [ -f "$f" ] && FILES_TO_REMOVE+=("$f")
done

# Source maps
for f in *.map; do
    [ -f "$f" ] 2>/dev/null && FILES_TO_REMOVE+=("$f")
done

echo -e "  Found ${#FILES_TO_REMOVE[@]} sensitive files/directories"
echo ""

if [ ${#FILES_TO_REMOVE[@]} -eq 0 ]; then
    echo -e "${GREEN}✓ No sensitive files found. Environment is clean.${NC}"
    exit 0
fi

echo -e "${YELLOW}[2/4]${NC} Files to be removed:"
for f in "${FILES_TO_REMOVE[@]}"; do
    echo "  - $f"
done
echo ""

# Confirm deletion
read -p "Remove these files? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo -e "${YELLOW}[3/4]${NC} Removing files..."

# Remove environment files
rm -f .env .env.local .env.production .env.development .env.staging .env.test 2>/dev/null || true

# Remove git directory
rm -rf .git 2>/dev/null || true

# Remove database files
rm -f *.sql *.sqlite *.sqlite3 *.db 2>/dev/null || true
rm -f dump.* backup.* 2>/dev/null || true

# Remove logs
rm -f *.log npm-debug.log* 2>/dev/null || true

# Remove backups
rm -f *.bak *.backup *.old *.orig 2>/dev/null || true

# Remove CI/CD
rm -f .travis.yml .gitlab-ci.yml Jenkinsfile 2>/dev/null || true
rm -rf .circleci 2>/dev/null || true

# Remove infrastructure
rm -rf .terraform .k8s 2>/dev/null || true
rm -f *.tfstate *.tfvars 2>/dev/null || true

# Remove credentials
rm -f .credentials *.pem *.key *.p12 2>/dev/null || true

# Remove Apache files
rm -f .htaccess .htpasswd 2>/dev/null || true

# Remove source maps
rm -f *.map 2>/dev/null || true

echo -e "  ${GREEN}✓ Files removed${NC}"
echo ""

echo -e "${YELLOW}[4/4]${NC} Verifying cleanup..."

# Verify no sensitive files remain
REMAINING=0
for f in .env .env.* .git *.sql *.sqlite* *.db *.log *.bak .htaccess .htpasswd *.pem *.key; do
    if ls $f 1>/dev/null 2>&1; then
        echo -e "  ${RED}Warning: $f still exists${NC}"
        REMAINING=$((REMAINING + 1))
    fi
done

echo ""
if [ $REMAINING -eq 0 ]; then
    echo -e "${GREEN}========================================"
    echo "   CLEANUP COMPLETE"
    echo "========================================${NC}"
    echo ""
    echo "  Sensitive files have been removed."
    echo "  Your deployment is now cleaner."
    echo ""
    echo "  Next steps:"
    echo "  1. Ensure .env is loaded from a secure location"
    echo "  2. Rebuild containers: docker compose -f docker-compose.prod.yml up --build -d"
    echo ""
else
    echo -e "${YELLOW}========================================"
    echo "   CLEANUP PARTIALLY COMPLETE"
    echo "========================================${NC}"
    echo ""
    echo "  Some files could not be removed."
    echo "  Please remove them manually."
fi
