#!/bin/bash

# Script to create a new SSH key for SumitDevlopment18 GitHub account

echo "🔑 Creating new SSH key for SumitDevlopment18"
echo "=============================================="
echo ""

# Generate new SSH key
echo "📝 Generating new SSH key..."
ssh-keygen -t ed25519 -C "SumitDevlopment18@github" -f ~/.ssh/id_ed25519_sumitdev

echo ""
echo "🔧 Adding key to SSH agent..."
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_sumitdev

echo ""
echo "📋 Your NEW public SSH key for SumitDevlopment18:"
echo "=================================================="
cat ~/.ssh/id_ed25519_sumitdev.pub
echo "=================================================="
echo ""
echo "📝 Next steps:"
echo "1. Copy the public key above"
echo "2. Go to https://github.com/settings/keys"
echo "3. Click 'New SSH key'"
echo "4. Title: 'MacBook Pro - SumitDevlopment18' (or any name you prefer)"
echo "5. Paste the key and click 'Add SSH key'"
echo ""
echo "🧪 After adding to GitHub, test with:"
echo "   ssh -T git@github.com"
echo ""
