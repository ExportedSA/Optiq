# Package Lock File Issues & Prevention Guide

## Issue Summary (Dec 20, 2025)

### Error Encountered
```
npm error `npm ci` can only install packages when your package.json and package-lock.json are in sync.
npm error Invalid: lock file's picomatch@2.3.1 does not satisfy picomatch@4.0.3
npm error Missing: picomatch@2.3.1 from lock file
```

### Root Cause Analysis

**Primary Issue:** Version conflict in `package-lock.json` between `picomatch@2.3.1` and `picomatch@4.0.3`

**Conflicting Dependencies:**

Dependencies requiring **picomatch v2.x**:
- `anymatch@3.1.3` → requires `picomatch@^2.0.4`
- `micromatch@4.0.8` → requires `picomatch@^2.3.1`
- `readdirp@3.6.0` (in unplugin) → requires `picomatch@^2.2.1`

Dependencies requiring **picomatch v4.x**:
- `@rollup/plugin-commonjs` → requires `picomatch@^4.0.2`
- `@rollup/pluginutils` → requires `picomatch@^4.0.2`
- `tinyglobby` → requires `picomatch@^4.0.3`

**Why This Happened:**
1. The lock file had both versions installed in different node_modules locations
2. npm's dependency resolution algorithm created nested dependencies
3. Manual edits or partial updates corrupted the lock file structure
4. npm ci detected inconsistencies in the dependency tree that npm install would tolerate

---

## Recurring Issues Identified

### 1. **Dependency Version Conflicts**
- **Pattern:** Major version jumps in transitive dependencies (v2 → v4)
- **Impact:** Lock file becomes out of sync with package.json
- **Frequency:** Occurs when dependencies update their own dependencies to incompatible versions

### 2. **Lock File Corruption**
- **Pattern:** Lock file gets corrupted during git operations or manual edits
- **Impact:** npm ci fails while npm install succeeds (masking the issue)
- **Frequency:** Common in monorepo setups with multiple developers

### 3. **Workspace Dependencies**
- **Pattern:** Workspace packages (`@optiq/shared`, `@optiq/backend`, `@optiq/frontend`) have overlapping dependencies
- **Impact:** Hoisting conflicts and duplicate installations
- **Frequency:** Increases with workspace complexity

### 4. **Build Environment Differences**
- **Pattern:** Local development uses `npm install` (tolerant), CI/CD uses `npm ci` (strict)
- **Impact:** Builds fail in CI but work locally
- **Frequency:** Every deployment if lock file is corrupted

---

## Solution Applied

```bash
# 1. Remove corrupted lock file
rm package-lock.json

# 2. Regenerate with fresh dependency resolution
npm install

# 3. Verify clean install works
npm ci
```

**Results:**
- ✅ `npm ci` now succeeds
- ✅ Added 3 packages, removed 8 packages, changed 1 package
- ✅ Dependency tree properly resolved
- ⚠️ 5 moderate severity vulnerabilities remain (separate issue)

---

## Prevention Strategies

### 1. **Always Use npm ci in CI/CD**
```yaml
# .github/workflows/deploy.yml
- name: Install dependencies
  run: npm ci  # NOT npm install
```

**Why:** `npm ci` is stricter and will catch lock file issues before deployment.

### 2. **Commit Lock File Changes**
```bash
# After any dependency changes
npm install
git add package-lock.json
git commit -m "chore: update dependencies"
```

**Why:** Ensures all developers use the same dependency versions.

### 3. **Regular Lock File Maintenance**
```bash
# Monthly or after major updates
rm package-lock.json
npm install
npm ci  # Verify it works
git add package-lock.json
git commit -m "chore: regenerate lock file"
```

**Why:** Prevents accumulated corruption and resolves version conflicts.

### 4. **Use npm audit**
```bash
# Check for vulnerabilities and conflicts
npm audit
npm audit fix  # For non-breaking fixes
```

**Why:** Identifies security issues and dependency conflicts early.

### 5. **Avoid Manual Lock File Edits**
- Never manually edit `package-lock.json`
- Use `npm install <package>@<version>` to update specific packages
- Let npm manage the lock file structure

### 6. **Monitor Dependency Updates**
```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update <package-name>
```

**Why:** Proactive updates prevent major version conflicts.

---

## Debugging Commands

### Check Lock File Integrity
```bash
npm ci --dry-run
```

### Find Version Conflicts
```bash
npm ls picomatch  # Check specific package versions
npm ls --all      # Full dependency tree
```

### Verify Package Resolution
```bash
npm explain picomatch  # Why is this package installed?
```

### Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
npm ci
```

---

## Monorepo-Specific Issues

### Workspace Dependency Conflicts
```json
// Root package.json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**Issue:** Workspaces can have conflicting peer dependencies.

**Solution:**
1. Use consistent versions across workspaces
2. Hoist common dependencies to root
3. Use `npm install -w <workspace>` for workspace-specific installs

### Example Fix
```bash
# Install in specific workspace
npm install <package> -w @optiq/frontend

# Install in all workspaces
npm install <package> -ws

# Update root and all workspaces
npm install <package>
```

---

## Security Vulnerabilities

Current state (after fix):
```
5 moderate severity vulnerabilities
```

**Action Items:**
1. Run `npm audit` to see details
2. Evaluate if `npm audit fix` is safe (may cause breaking changes)
3. Consider updating vulnerable packages manually
4. Document any vulnerabilities that cannot be fixed

---

## Best Practices Going Forward

### ✅ DO:
- Use `npm ci` in CI/CD pipelines
- Commit `package-lock.json` after every dependency change
- Regenerate lock file monthly or after major updates
- Test with `npm ci` before pushing
- Use exact versions for critical dependencies

### ❌ DON'T:
- Manually edit `package-lock.json`
- Use `npm install` in CI/CD
- Ignore lock file conflicts in git
- Mix npm and yarn/pnpm in the same project
- Delete `node_modules` without regenerating lock file

---

## Related Files

- `/package.json` - Root workspace configuration
- `/apps/frontend/package.json` - Frontend dependencies
- `/apps/backend/package.json` - Backend dependencies
- `/packages/shared/package.json` - Shared library dependencies
- `/package-lock.json` - Dependency lock file (now fixed)

---

## Next Steps

1. ✅ Lock file regenerated and verified
2. ⚠️ Address 5 moderate security vulnerabilities
3. 📝 Add pre-commit hook to verify `npm ci` works
4. 📝 Update CI/CD to use `npm ci` consistently
5. 📝 Document dependency update process for team

---

**Last Updated:** Dec 20, 2025  
**Status:** ✅ Resolved  
**Next Review:** Monthly or after major dependency updates
