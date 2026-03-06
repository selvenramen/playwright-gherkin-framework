# Setup Instructions for GitHub

## How to Put This Framework on GitHub:

### 1. Create a GitHub Repository

1. Go to https://github.com and sign in
2. Click the `+` icon → **New repository**
3. Name it: `playwright-test-framework` (or your choice)
4. Description: "Simple Playwright framework for non-technical users"
5. Make it **Public** or **Private** (your choice)
6. **Don't** initialize with README (we already have one)
7. Click **Create repository**

### 2. Upload Your Framework

Open PowerShell in the `FW project` folder and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Playwright test framework"

# Link to your GitHub repo (replace with your actual URL)
git remote add origin https://github.com/YOUR-USERNAME/playwright-test-framework.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. How Users Will Get Your Framework

Users can clone it with:
```powershell
git clone https://github.com/YOUR-USERNAME/playwright-test-framework.git
cd playwright-test-framework
npm install
npm run install-browsers
```

**Or download as ZIP:**
1. Go to your GitHub repo
2. Click green **Code** button
3. Click **Download ZIP**
4. Extract and follow setup instructions

---

## Benefits of Using GitHub:

✅ **Easy Distribution** - Users just clone or download  
✅ **Version Control** - Track changes to your framework  
✅ **Updates** - Users can pull latest changes with `git pull`  
✅ **Collaboration** - Multiple people can contribute  
✅ **Documentation** - README shows up nicely on GitHub  

---

## Alternative: Without Git (Simpler for Non-Technical Users)

If your users don't know Git, you can:

1. Zip the folder (exclude `node_modules`, `test-results`, `playwright-report`)
2. Upload to a shared drive or send via email
3. Users extract and run:
   ```powershell
   npm install
   npm run install-browsers
   ```

Both methods work! GitHub is better for technical teams, while direct ZIP distribution is simpler for completely non-technical users.
