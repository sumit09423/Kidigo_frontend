# SSH Key Setup for SumitDevlopment18 GitHub Account

## Current Situation
- Your existing SSH key (`id_ed25519`) is associated with a different GitHub account
- You need a new SSH key for the `SumitDevlopment18` account
- You're authenticated as `SumitDevlopment18` but need the correct key

## Step 1: Generate New SSH Key

Run this command in your terminal:

```bash
cd /Users/jcaspapple/Kidigo_frontend
chmod +x create-new-ssh-key.sh
./create-new-ssh-key.sh
```

Or manually:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "SumitDevlopment18@github" -f ~/.ssh/id_ed25519_sumitdev

# When prompted for passphrase, you can press Enter for no passphrase
# or set a passphrase for extra security
```

## Step 2: Add Key to SSH Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add the new key
ssh-add ~/.ssh/id_ed25519_sumitdev

# Verify it's added
ssh-add -l
```

## Step 3: Update SSH Config

Update your `~/.ssh/config` file to use the new key for GitHub:

```bash
# Backup existing config
cp ~/.ssh/config ~/.ssh/config.backup

# Update config to use new key
cat > ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_sumitdev
  AddKeysToAgent yes
  UseKeychain yes
EOF
```

Or if you want to keep both keys and use different ones for different accounts, you can set up multiple hosts:

```bash
cat > ~/.ssh/config << 'EOF'
# Default GitHub (SumitDevlopment18)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_sumitdev
  AddKeysToAgent yes
  UseKeychain yes

# Alternative GitHub account (if needed)
Host github-other
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  AddKeysToAgent yes
EOF
```

## Step 4: Add Public Key to GitHub

1. **Copy your new public key:**
   ```bash
   cat ~/.ssh/id_ed25519_sumitdev.pub | pbcopy
   # This copies it to your clipboard on macOS
   ```

2. **Add to GitHub:**
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: "MacBook Pro - SumitDevlopment18" (or any descriptive name)
   - Key: Paste the public key
   - Click "Add SSH key"

## Step 5: Test SSH Connection

```bash
ssh -T git@github.com
```

You should see:
```
Hi SumitDevlopment18! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 6: Update Git Remote and Push

After SSH is working:

```bash
cd /Users/jcaspapple/Kidigo_frontend

# First, fork the repository on GitHub (if not already done)
# Go to: https://github.com/sumit09423/Kidigo_frontend and click "Fork"

# Add upstream remote (original repo)
git remote add upstream git@github.com:sumit09423/Kidigo_frontend.git 2>/dev/null || echo "Upstream already exists"

# Update origin to point to your fork
git remote set-url origin git@github.com:SumitDevlopment18/Kidigo_frontend.git

# Verify remotes
git remote -v

# Push to your fork
git push origin main
```

## Troubleshooting

### If SSH agent has permission issues:
```bash
# On macOS, add key to keychain
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_sumitdev
```

### If you need to remove old key from agent:
```bash
ssh-add -D  # Remove all keys
ssh-add ~/.ssh/id_ed25519_sumitdev  # Add only the new one
```

### Check which key is being used:
```bash
ssh -vT git@github.com 2>&1 | grep "identity file"
```

## Quick Reference

- **New SSH Key:** `~/.ssh/id_ed25519_sumitdev`
- **Public Key:** `~/.ssh/id_ed25519_sumitdev.pub`
- **SSH Config:** `~/.ssh/config`
- **GitHub Account:** `SumitDevlopment18`
- **Your Fork:** `git@github.com:SumitDevlopment18/Kidigo_frontend.git`
