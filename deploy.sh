#!/bin/bash

# HostGator FTP Deployment Script
# Usage: ./deploy.sh

echo "🚀 HostGator FTP Deployment Script"
echo "=================================="
echo ""

# Load config if it exists
if [ -f "deploy-config" ]; then
    source deploy-config
fi

# FTP Configuration (Update these with your HostGator details)
# You can either:
# 1. Create a deploy-config file with your credentials
# 2. Or edit the values below directly
FTP_HOST="${FTP_HOST:-ftp.yourdomain.com}"  # Replace with your FTP host
FTP_USER="${FTP_USER:-your_username}"       # Replace with your cPanel username
FTP_PASS="${FTP_PASS:-}"                    # Will prompt if empty
FTP_DIR="${FTP_DIR:-public_html}"           # Usually public_html for main domain

# Files to upload
FILES=(
    "index.html"
    "about.html"
    "work.html"
    "blog.html"
    "blog-facebook-api-automation.html"
    "contact.html"
    "styles.css"
    "script.js"
)

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp is not installed."
    echo "Install it with: brew install lftp"
    exit 1
fi

# Validate configuration
if [ "$FTP_HOST" = "ftp.yourdomain.com" ] || [ "$FTP_USER" = "your_username" ]; then
    echo "⚠️  Please configure your FTP details first!"
    echo ""
    echo "Option 1: Create deploy-config file:"
    echo "  cp deploy-config.example deploy-config"
    echo "  # Then edit deploy-config with your details"
    echo ""
    echo "Option 2: Edit deploy.sh and update FTP_HOST and FTP_USER"
    echo ""
    exit 1
fi

# Prompt for password if not set
if [ -z "$FTP_PASS" ]; then
    read -sp "Enter FTP password: " FTP_PASS
    echo ""
fi

echo "📤 Uploading files to HostGator..."
echo ""

# Upload files using lftp
lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" <<EOF
set ftp:ssl-allow no
pwd
# Files are already in the root directory, just upload them
mput ${FILES[@]}
echo ""
echo "Verifying uploaded files..."
ls -lh ${FILES[@]} 2>/dev/null | head -10
bye
EOF

UPLOAD_EXIT=$?

if [ $UPLOAD_EXIT -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Visit your site at: https://rmalek.com"
    echo ""
    echo "Uploaded files:"
    for file in "${FILES[@]}"; do
        echo "  ✓ $file"
    done
else
    echo ""
    echo "❌ Deployment failed. Please check your FTP credentials."
    exit 1
fi

