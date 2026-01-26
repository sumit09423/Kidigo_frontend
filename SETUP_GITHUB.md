# GitHub SSH Setup Guide

## Current Situation
- Repository: `sumit09423/Kidigo_frontend`
- Remote URL: `git@github.com:sumit09423/Kidigo_frontend.git` (SSH)
- You don't have push permissions to the original repository

## Option 1: Fork the Repository (Recommended)

### Step 1: Fork on GitHub
1. Go to https://github.com/sumit09423/Kidigo_frontend
2. Click the "Fork" button in the top right
3. This creates a copy at `https://github.com/YOUR_USERNAME/Kidigo_frontend`

### Step 2: Set Up SSH Key (if not already done)

#### Check if you have an SSH key:
```bash
ls -la ~/.ssh/id_*.pub
```

#### If you need to generate a new key:
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter to accept default location
# Optionally set a passphrase
```

#### Add your SSH key to GitHub:
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # or
   pbcopy < ~/.ssh/id_ed25519.pub  # macOS - copies to clipboard
   ```

2. Go to GitHub Settings:
   - Visit: https://github.com/settings/keys
   - Click "New SSH key"
   - Title: Give it a name (e.g., "MacBook Pro")
   - Key: Paste your public key
   - Click "Add SSH key"

#### Test SSH connection:
```bash
ssh -T git@github.com
# You should see: "Hi YOUR_USERNAME! You've successfully authenticated..."
```

### Step 3: Update Remote to Your Fork

After forking, update your local repository:

```bash
# Check current remote
git remote -v

# Add your fork as a new remote (replace YOUR_USERNAME)
git remote add fork git@github.com:YOUR_USERNAME/Kidigo_frontend.git

# Or change origin to point to your fork
git remote set-url origin git@github.com:YOUR_USERNAME/Kidigo_frontend.git

# Verify
git remote -v
```

### Step 4: Push to Your Fork

```bash
# Push to your fork
git push origin main
# or if you kept original as origin and added fork:
git push fork main
```

### Step 5: Keep Fork Updated (Optional)

To sync your fork with the original repository:

```bash
# Add original repo as upstream
git remote add upstream git@github.com:sumit09423/Kidigo_frontend.git

# Fetch updates from upstream
git fetch upstream

# Merge upstream changes
git merge upstream/main

# Push to your fork
git push origin main
```

## Option 2: Request Write Access

If you need to push directly to the original repository:
1. Contact the repository owner (sumit09423)
2. Request write/collaborator access
3. They can add you as a collaborator in repository settings

## Troubleshooting SSH Issues

### If SSH connection fails:

1. **Check SSH agent:**
   ```bash
   eval "$(ssh-agent -s)"
   ssh-add ~/.ssh/id_ed25519
   ```

2. **Test connection:**
   ```bash
   ssh -T git@github.com
   ```

3. **Check SSH config:**
   ```bash
   cat ~/.ssh/config
   ```
   
   If file doesn't exist, create it:
   ```bash
   cat >> ~/.ssh/config << EOF
   Host github.com
     AddKeysToAgent yes
     UseKeychain yes
     IdentityFile ~/.ssh/id_ed25519
   EOF
   ```

4. **On macOS, add key to keychain:**
   ```bash
   ssh-add --apple-use-keychain ~/.ssh/id_ed25519
   ```

## Quick Setup Script

Run the provided script:
```bash
chmod +x setup-ssh-github.sh
./setup-ssh-github.sh
```

This will:
- Check/create SSH key
- Start SSH agent
- Add key to agent
- Display your public key for GitHub
