#!/bin/bash

# SSH Setup Script for GitHub
# This script helps set up SSH authentication for GitHub

echo "🔑 GitHub SSH Setup Script"
echo "=========================="
echo ""

# Check if SSH key exists
if [ -f ~/.ssh/id_ed25519 ]; then
    echo "✅ SSH key found: ~/.ssh/id_ed25519"
else
    echo "❌ SSH key not found. Generating new key..."
    ssh-keygen -t ed25519 -C "sumit@jcasptechnologies.com" -f ~/.ssh/id_ed25519 -N ""
fi

# Start SSH agent
echo ""
echo "🔧 Starting SSH agent..."
eval "$(ssh-agent -s)"

# Add SSH key to agent
echo "🔧 Adding SSH key to agent..."
ssh-add ~/.ssh/id_ed25519

# Display public key
echo ""
echo "📋 Your public SSH key:"
echo "----------------------"
cat ~/.ssh/id_ed25519.pub
echo ""
echo "----------------------"
echo ""
echo "📝 Next steps:"
echo "1. Copy the public key above"
echo "2. Go to https://github.com/settings/keys"
echo "3. Click 'New SSH key'"
echo "4. Paste the key and save"
echo ""
echo "🧪 Testing connection..."
ssh -T git@github.com 2>&1

echo ""
echo "✅ Setup complete!"
