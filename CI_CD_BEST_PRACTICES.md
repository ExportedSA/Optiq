# CI/CD Best Practices

## Overview

This document outlines the CI/CD configuration and best practices for the Optiq project to ensure reliable, reproducible builds across all environments.

---

## Core Principle: Always Use `npm ci`

### Why `npm ci` Instead of `npm install`?

| Aspect | `npm install` | `npm ci` |
|--------|---------------|----------|
| **Purpose** | Development | CI/CD & Production |
| **Lock File** | May modify | Never modifies |
| **Behavior** | Tolerant of mismatches | Strict validation |
| **Speed** | Slower | Faster (skips checks) |
| **node_modules** | Preserves existing | Deletes & reinstalls |
| **Reproducibility** | ❌ Not guaranteed | ✅ Guaranteed |

**Key Differences:**
- `npm install` will try to resolve conflicts and update the lock file
- `npm ci` will fail if package.json and package-lock.json are out of sync
- `npm ci` ensures everyone gets the exact same dependencies

---

## Current CI/CD Configuration

### 1. GitHub Actions (`.github/workflows/ci.yml`)

**Status:** ✅ Configured correctly

All jobs use `npm ci`:
```yaml
- name: Install dependencies
  run: npm ci
```

**Jobs:**
- **Lint** - Code quality checks
- **Type Check** - TypeScript validation
- **Unit Tests** - Automated testing
- **Build** - Production build verification

**Verification Step Added:**
```yaml
- name: Verify package-lock.json integrity
  run: |
    echo "🔍 Verifying package-lock.json is in sync..."
    npm ci --dry-run
    echo "✅ package-lock.json verification passed"
```

---

### 2. Vercel Deployment (`apps/frontend/vercel.json`)

**Status:** ✅ Configured correctly

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run build"
}
```

**Benefits:**
- Reproducible builds on Vercel
- Faster deployment times
- Consistent with local development

---

### 3. Docker Images

**Status:** ✅ Updated to use `npm ci`

#### Backend Dockerfile (`docker/Dockerfile.backend`)
```dockerfile
# Use npm ci for reproducible builds
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate
```

#### Frontend Dockerfile (`docker/Dockerfile.frontend`)
```dockerfile
# Use npm ci for reproducible builds
RUN npm ci --only=production

# Build Next.js application
RUN npm run build
```

**Production Optimizations:**
- `--only=production` flag excludes devDependencies
- Smaller image sizes
- Faster container startup

---

### 4. Pre-Commit Hook (`.husky/pre-commit`)

**Status:** ✅ Active

Prevents corrupted lock files from being committed:
```bash
if git diff --cached --name-only | grep -q "package-lock.json"; then
  npm ci --dry-run || exit 1
fi
```

---

## Deployment Workflows

### Local Development
```bash
# Use npm install for development
npm install

# Add new dependency
npm install <package-name>

# Verify npm ci works before committing
npm ci --dry-run
```

### CI/CD Pipeline
```bash
# Always use npm ci
npm ci

# Generate Prisma client
npm run prisma:generate -w @optiq/backend

# Run checks
npm run lint
npm run typecheck
npm run test

# Build
npm run build
```

### Docker Build
```bash
# Build images
docker build -f docker/Dockerfile.backend -t optiq-backend .
docker build -f docker/Dockerfile.frontend -t optiq-frontend .

# Images use npm ci internally
```

### Vercel Deployment
```bash
# Automatic on push to main
# Uses npm ci via vercel.json configuration
```

---

## Best Practices

### ✅ DO:

1. **Use `npm ci` in all CI/CD environments**
   - GitHub Actions
   - Docker builds
   - Vercel deployments
   - Any automated build process

2. **Use `npm install` for local development**
   - Adding new dependencies
   - Updating dependencies
   - Development workflow

3. **Commit package-lock.json changes**
   ```bash
   npm install <package>
   git add package.json package-lock.json
   git commit -m "chore: add <package>"
   ```

4. **Verify before pushing**
   ```bash
   npm ci --dry-run  # Verify lock file
   npm run build     # Verify build works
   ```

5. **Use exact Node.js versions**
   ```yaml
   # .github/workflows/ci.yml
   node-version: '20'  # Specific version
   ```

6. **Cache npm dependencies**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

### ❌ DON'T:

1. **Never use `npm install` in CI/CD**
   ```yaml
   # ❌ Bad
   - run: npm install
   
   # ✅ Good
   - run: npm ci
   ```

2. **Don't ignore lock file changes**
   ```bash
   # ❌ Bad
   git add package.json
   # Missing package-lock.json
   
   # ✅ Good
   git add package.json package-lock.json
   ```

3. **Don't manually edit package-lock.json**
   - Always use npm commands
   - Let npm manage the lock file

4. **Don't use `--force` or `--legacy-peer-deps` in CI**
   - Fix dependency conflicts properly
   - Don't mask issues

5. **Don't skip the pre-commit hook**
   ```bash
   # ❌ Bad (except emergencies)
   git commit --no-verify
   
   # ✅ Good
   git commit -m "message"
   ```

---

## Troubleshooting

### Build Fails with "package-lock.json out of sync"

**Cause:** Lock file doesn't match package.json

**Solution:**
```bash
# Regenerate lock file
rm package-lock.json
npm install

# Verify it works
npm ci

# Commit the fix
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

---

### Docker Build Fails with npm ci Error

**Cause:** Lock file corruption or missing dependencies

**Solution:**
```bash
# Verify locally first
npm ci

# If that works, rebuild Docker image
docker build --no-cache -f docker/Dockerfile.backend .
```

---

### Vercel Build Fails

**Cause:** Lock file out of sync or missing environment variables

**Solution:**
1. Check Vercel build logs
2. Verify `npm ci` works locally
3. Check environment variables in Vercel dashboard
4. Ensure `vercel.json` has correct `installCommand`

---

### GitHub Actions Cache Issues

**Cause:** Corrupted npm cache

**Solution:**
```yaml
# Clear cache by changing cache key
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: '**/package-lock.json'
```

Or manually clear cache in GitHub Actions settings.

---

## Monitoring & Alerts

### What to Monitor

1. **Build Success Rate**
   - Track failed builds
   - Identify patterns

2. **Build Duration**
   - Baseline: ~5-10 minutes
   - Alert if > 15 minutes

3. **Dependency Vulnerabilities**
   ```bash
   npm audit
   ```

4. **Lock File Changes**
   - Review all lock file commits
   - Ensure they're intentional

### Setting Up Alerts

**GitHub Actions:**
- Configure branch protection rules
- Require status checks to pass
- Enable email notifications

**Vercel:**
- Enable deployment notifications
- Set up Slack/Discord webhooks
- Monitor deployment logs

---

## Security Considerations

### 1. Dependency Integrity

**npm ci validates:**
- Package checksums
- Dependency tree
- Lock file integrity

**Benefits:**
- Prevents supply chain attacks
- Ensures reproducible builds
- Detects tampering

### 2. Production Dependencies Only

```dockerfile
# Docker production builds
RUN npm ci --only=production
```

**Benefits:**
- Smaller image sizes
- Reduced attack surface
- Faster deployments

### 3. Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update with caution
npm update <package>

# Verify after update
npm ci
npm run test
```

---

## Performance Optimization

### 1. Caching Strategy

**GitHub Actions:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

**Docker:**
```dockerfile
# Cache package files separately
COPY package*.json ./
RUN npm ci --only=production

# Copy code after (better layer caching)
COPY . .
```

### 2. Parallel Jobs

```yaml
# GitHub Actions
jobs:
  lint:
    # Runs in parallel
  typecheck:
    # Runs in parallel
  test:
    # Runs in parallel
  build:
    needs: [lint, typecheck]  # Waits for these
```

### 3. Workspace Optimization

```bash
# Install only specific workspace
npm ci -w @optiq/backend

# Build only what changed
npm run build -w @optiq/shared
```

---

## Rollback Procedures

### If Bad Deployment Happens

1. **Immediate Rollback**
   ```bash
   # Revert to last known good commit
   git revert HEAD
   git push
   ```

2. **Vercel Rollback**
   - Use Vercel dashboard
   - Promote previous deployment
   - Instant rollback

3. **Docker Rollback**
   ```bash
   # Use previous image tag
   docker pull optiq-backend:previous-tag
   docker run optiq-backend:previous-tag
   ```

---

## Checklist for New Deployments

- [ ] `npm ci` works locally
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Pre-commit hook passes
- [ ] GitHub Actions CI passes
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Rollback plan ready
- [ ] Monitoring enabled
- [ ] Team notified

---

## Related Documentation

- [PACKAGE_LOCK_ISSUES.md](./PACKAGE_LOCK_ISSUES.md) - Lock file troubleshooting
- [GIT_HOOKS_SETUP.md](./GIT_HOOKS_SETUP.md) - Pre-commit hook guide
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Deployment procedures

---

## Maintenance Schedule

### Daily
- Monitor build status
- Review failed builds
- Check deployment logs

### Weekly
- Review dependency updates
- Check for security vulnerabilities
- Verify cache efficiency

### Monthly
- Regenerate package-lock.json
- Update Node.js version if needed
- Review and update CI/CD configuration
- Audit dependencies

---

## Contact & Support

**Build Issues:**
- Check GitHub Actions logs
- Review Vercel deployment logs
- Contact DevOps team

**Dependency Issues:**
- Run `npm audit`
- Check npm registry status
- Review package-lock.json changes

---

**Last Updated:** Dec 21, 2025  
**Node.js Version:** 20.x  
**npm Version:** 10.x  
**Status:** ✅ All CI/CD pipelines using `npm ci`
