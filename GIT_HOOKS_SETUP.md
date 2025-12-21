# Git Hooks Setup Guide

## Overview

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks that ensure code quality and prevent broken deployments.

---

## Installed Hooks

### Pre-Commit Hook

**Location:** `.husky/pre-commit`

**Purpose:** Verifies `package-lock.json` integrity before allowing commits

**What it does:**
1. Checks if `package-lock.json` is being committed
2. If yes, runs `npm ci --dry-run` to verify the lock file is valid
3. Blocks the commit if `npm ci` would fail
4. Runs tests before committing

**Why this matters:**
- Prevents corrupted lock files from being committed
- Ensures CI/CD builds won't fail due to lock file issues
- Catches dependency conflicts early in development
- Saves time by preventing failed deployments

---

## How It Works

### When package-lock.json is Modified

```bash
$ git commit -m "update dependencies"

🔍 Verifying package-lock.json integrity...
📦 package-lock.json changed - verifying npm ci works...
✅ npm ci verification passed
npm test
...
```

### When package-lock.json is NOT Modified

```bash
$ git commit -m "fix: update component"

🔍 Verifying package-lock.json integrity...
✅ package-lock.json not modified - skipping verification
npm test
...
```

### When Verification Fails

```bash
$ git commit -m "update dependencies"

🔍 Verifying package-lock.json integrity...
📦 package-lock.json changed - verifying npm ci works...
❌ ERROR: npm ci failed - package-lock.json is out of sync

To fix this issue:
  1. Run: npm install
  2. Add the updated package-lock.json: git add package-lock.json
  3. Try committing again
```

---

## Setup Instructions

### Automatic Setup (Already Done)

Husky is configured to install automatically when you run `npm install`:

```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

### Manual Setup (If Needed)

If hooks aren't working:

```bash
# Reinstall husky
npm install

# Or manually initialize
npx husky init
```

---

## Bypassing Hooks (Emergency Only)

**⚠️ Warning:** Only use this in emergencies. Bypassing hooks can lead to broken builds.

```bash
# Skip pre-commit hook
git commit --no-verify -m "emergency fix"

# Or use environment variable
HUSKY=0 git commit -m "emergency fix"
```

**When to bypass:**
- Critical production hotfix
- CI/CD is down and you need to push
- You've verified the lock file manually

**Never bypass for:**
- Convenience
- "It works on my machine"
- Avoiding test failures

---

## Troubleshooting

### Hook Not Running

**Problem:** Commits go through without running the hook

**Solutions:**
1. Ensure husky is installed: `npm install`
2. Check hook is executable: `ls -la .husky/pre-commit`
3. Verify Git hooks path: `git config core.hooksPath`
4. Reinstall: `rm -rf .husky && npx husky init`

### Hook Fails on Valid Lock File

**Problem:** Hook blocks commit even though `npm ci` works locally

**Solutions:**
1. Clean install: `rm -rf node_modules && npm ci`
2. Regenerate lock file: `rm package-lock.json && npm install`
3. Check Git line endings: `git config core.autocrlf`
4. Verify npm version: `npm --version` (should be 8.x or higher)

### Hook is Too Slow

**Problem:** Pre-commit hook takes too long

**Current optimizations:**
- Uses `npm ci --dry-run` (doesn't install, just validates)
- Only runs when `package-lock.json` is modified
- Runs tests in parallel where possible

**If still slow:**
- Consider splitting tests into fast/slow suites
- Run only changed workspace tests
- Use `--no-verify` for WIP commits (commit properly later)

---

## Customization

### Modify Pre-Commit Hook

Edit `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Add your custom checks here
echo "Running custom checks..."

# Existing checks
npm ci --dry-run
npm test
```

### Add More Hooks

```bash
# Pre-push hook
npx husky add .husky/pre-push "npm run build"

# Commit message hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

---

## Benefits

### For Developers
- ✅ Catch issues before pushing
- ✅ No more "works on my machine" problems
- ✅ Faster feedback loop
- ✅ Less time debugging CI failures

### For Team
- ✅ Consistent code quality
- ✅ Fewer broken builds
- ✅ Reduced CI/CD costs
- ✅ Better collaboration

### For Production
- ✅ Fewer deployment failures
- ✅ More reliable releases
- ✅ Less downtime
- ✅ Happier users

---

## Related Documentation

- [PACKAGE_LOCK_ISSUES.md](./PACKAGE_LOCK_ISSUES.md) - Lock file troubleshooting
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment process
- [Husky Documentation](https://typicode.github.io/husky/)

---

## Maintenance

### Monthly Tasks
- Review hook performance
- Update husky if new version available
- Verify hooks work on all developer machines

### When Adding Dependencies
1. Run `npm install`
2. Verify `npm ci` works
3. Commit `package-lock.json`
4. Hook will verify automatically

### When Updating Husky
```bash
npm install husky@latest --save-dev
npx husky init
# Re-add custom hooks if needed
```

---

**Last Updated:** Dec 21, 2025  
**Husky Version:** 9.1.7  
**Status:** ✅ Active
