# Dependency Update Process

## Overview

This guide provides step-by-step procedures for safely updating dependencies in the Optiq project. Following this process ensures reproducible builds, prevents breaking changes, and maintains system stability.

---

## Table of Contents

1. [Before You Start](#before-you-start)
2. [Update Scenarios](#update-scenarios)
3. [Step-by-Step Procedures](#step-by-step-procedures)
4. [Safety Checks](#safety-checks)
5. [Rollback Procedures](#rollback-procedures)
6. [Common Issues](#common-issues)
7. [Best Practices](#best-practices)

---

## Before You Start

### Prerequisites

- [ ] Node.js 20.x installed
- [ ] npm 10.x or higher
- [ ] Git configured
- [ ] Access to the repository
- [ ] Development environment set up

### Important Files

- `package.json` - Dependency declarations
- `package-lock.json` - Locked dependency versions
- `apps/*/package.json` - Workspace-specific dependencies
- `packages/*/package.json` - Shared package dependencies

### Key Principles

1. **Always use `npm install` for updates** (not `npm ci`)
2. **Always commit `package-lock.json` changes**
3. **Test thoroughly before merging**
4. **Update one dependency at a time** (for major updates)
5. **Document breaking changes**

---

## Update Scenarios

### 1. Security Patch (Urgent)
**When:** Critical security vulnerability detected  
**Priority:** Immediate  
**Risk:** Low (patch versions)

### 2. Minor Update (Routine)
**When:** New features, bug fixes  
**Priority:** Weekly/Monthly  
**Risk:** Low to Medium

### 3. Major Update (Planned)
**When:** Breaking changes, new major versions  
**Priority:** Quarterly  
**Risk:** High

### 4. Adding New Dependency
**When:** New feature requires new package  
**Priority:** As needed  
**Risk:** Medium

### 5. Removing Dependency
**When:** Package no longer needed  
**Priority:** As needed  
**Risk:** Low

---

## Step-by-Step Procedures

### Scenario 1: Security Patch Update

**Example:** Fix vulnerability in `axios`

```bash
# 1. Check for vulnerabilities
npm audit

# 2. Review the vulnerability details
npm audit --json | jq '.vulnerabilities'

# 3. Update the specific package
npm update axios

# 4. Verify the fix
npm audit

# 5. Test the application
npm run test
npm run build

# 6. Verify npm ci works
npm ci --dry-run

# 7. Commit changes
git add package.json package-lock.json
git commit -m "security: update axios to fix CVE-XXXX-XXXXX"

# 8. Push and create PR
git push origin feature/security-axios-update
```

**Timeline:** Same day  
**Testing Required:** Automated tests + smoke test

---

### Scenario 2: Minor Update (Single Package)

**Example:** Update `zod` from 4.1.0 to 4.2.0

```bash
# 1. Check current version
npm list zod

# 2. Check available versions
npm view zod versions --json

# 3. Update to specific version
npm install zod@4.2.0

# 4. Run tests
npm run test

# 5. Check for breaking changes
npm run typecheck
npm run build

# 6. Verify npm ci works
npm ci --dry-run

# 7. Test in development
npm run dev
# Manual testing of affected features

# 8. Commit changes
git add package.json package-lock.json
git commit -m "chore: update zod to 4.2.0"

# 9. Push and create PR
git push origin feature/update-zod
```

**Timeline:** 1-2 days  
**Testing Required:** Full test suite + manual testing

---

### Scenario 3: Major Update (Breaking Changes)

**Example:** Update Next.js from 15.x to 16.x

```bash
# 1. Create feature branch
git checkout -b feature/nextjs-16-upgrade

# 2. Read migration guide
# Visit: https://nextjs.org/docs/upgrading

# 3. Check current version
npm list next

# 4. Update to latest major version
npm install next@latest react@latest react-dom@latest

# 5. Update related packages
npm install eslint-config-next@latest

# 6. Fix breaking changes
# Follow migration guide
# Update code as needed

# 7. Run type checking
npm run typecheck

# 8. Run tests
npm run test

# 9. Build application
npm run build

# 10. Test locally
npm run dev
# Extensive manual testing

# 11. Verify npm ci works
npm ci --dry-run

# 12. Document changes
# Update CHANGELOG.md or create migration notes

# 13. Commit changes
git add -A
git commit -m "feat: upgrade Next.js to v16

BREAKING CHANGES:
- Updated Next.js from 15.x to 16.x
- Updated React to 19.x
- Migrated to new App Router features
- Updated middleware configuration

See docs/NEXTJS_16_MIGRATION.md for details"

# 14. Push and create PR
git push origin feature/nextjs-16-upgrade
```

**Timeline:** 1-2 weeks  
**Testing Required:** Full regression testing + QA review

---

### Scenario 4: Bulk Minor Updates

**Example:** Update all outdated packages

```bash
# 1. Check outdated packages
npm outdated

# 2. Review the list carefully
# Identify which updates are safe

# 3. Update all patch versions (safest)
npm update

# 4. Or update specific packages
npm update package1 package2 package3

# 5. Run full test suite
npm run test

# 6. Type check
npm run typecheck

# 7. Build
npm run build

# 8. Verify npm ci works
npm ci --dry-run

# 9. Review changes
git diff package.json
git diff package-lock.json

# 10. Commit changes
git add package.json package-lock.json
git commit -m "chore: update dependencies

Updated packages:
- package1: 1.0.0 -> 1.0.1
- package2: 2.1.0 -> 2.2.0
- package3: 3.0.0 -> 3.0.1"

# 11. Push and create PR
git push origin feature/dependency-updates
```

**Timeline:** 2-3 days  
**Testing Required:** Full test suite + smoke testing

---

### Scenario 5: Adding New Dependency

**Example:** Add `date-fns` for date manipulation

```bash
# 1. Research the package
# - Check npm downloads
# - Review GitHub stars/issues
# - Check last update date
# - Review license
# - Check bundle size

# 2. Install in appropriate workspace
npm install date-fns -w @optiq/frontend

# 3. Or install at root if shared
npm install date-fns

# 4. Verify installation
npm list date-fns

# 5. Use the package in code
# Import and implement feature

# 6. Run tests
npm run test

# 7. Check bundle size impact
npm run build
# Review build output for size changes

# 8. Verify npm ci works
npm ci --dry-run

# 9. Commit changes
git add package.json package-lock.json
git commit -m "feat: add date-fns for date manipulation

Added date-fns (2.30.0) for improved date handling
in the analytics dashboard.

Bundle size impact: +15KB gzipped"

# 10. Push and create PR
git push origin feature/add-date-fns
```

**Timeline:** 1 day  
**Testing Required:** Feature tests + bundle size check

---

### Scenario 6: Removing Dependency

**Example:** Remove unused `lodash`

```bash
# 1. Search for usage in codebase
git grep "from 'lodash'"
git grep "require('lodash')"

# 2. Verify it's truly unused
npm run typecheck
# Should pass if truly unused

# 3. Remove the package
npm uninstall lodash

# 4. Run tests
npm run test

# 5. Build
npm run build

# 6. Verify npm ci works
npm ci --dry-run

# 7. Commit changes
git add package.json package-lock.json
git commit -m "chore: remove unused lodash dependency

Removed lodash as it's no longer used in the codebase.
All functionality has been replaced with native ES6 methods.

Bundle size reduction: -24KB gzipped"

# 8. Push and create PR
git push origin chore/remove-lodash
```

**Timeline:** 1 day  
**Testing Required:** Full test suite

---

### Scenario 7: Workspace-Specific Update

**Example:** Update Prisma in backend workspace

```bash
# 1. Update in specific workspace
npm install prisma@latest @prisma/client@latest -w @optiq/backend

# 2. Generate Prisma client
npm run prisma:generate -w @optiq/backend

# 3. Check for migration changes
npm run prisma:migrate -w @optiq/backend

# 4. Run backend tests
npm run test -w @optiq/backend

# 5. Test database operations
npm run dev:backend
# Manual testing

# 6. Verify npm ci works
npm ci --dry-run

# 7. Commit changes
git add package.json package-lock.json apps/backend/package.json
git commit -m "chore(backend): update Prisma to latest

Updated Prisma from 5.x to 6.x
- Updated @prisma/client
- Regenerated Prisma client
- No schema changes required"

# 8. Push and create PR
git push origin chore/update-prisma
```

**Timeline:** 1-2 days  
**Testing Required:** Backend tests + database integration tests

---

## Safety Checks

### Pre-Update Checklist

- [ ] Create feature branch
- [ ] Ensure main branch is up to date
- [ ] Run `npm ci` to verify current state
- [ ] Run all tests to establish baseline
- [ ] Check for open PRs that might conflict

### During Update Checklist

- [ ] Read package changelog/release notes
- [ ] Check for breaking changes
- [ ] Update one package at a time (for major updates)
- [ ] Run tests after each update
- [ ] Check TypeScript compilation
- [ ] Verify build succeeds

### Post-Update Checklist

- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Build succeeds
- [ ] `npm ci --dry-run` succeeds
- [ ] Manual testing completed
- [ ] Bundle size acceptable
- [ ] Performance not degraded
- [ ] Documentation updated (if needed)

---

## Rollback Procedures

### If Update Breaks Tests

```bash
# 1. Don't panic - you have options

# 2. Option A: Revert the commit
git revert HEAD
git push

# 3. Option B: Reset to previous commit (if not pushed)
git reset --hard HEAD~1

# 4. Option C: Downgrade the package
npm install package@previous-version
git add package.json package-lock.json
git commit -m "revert: downgrade package to previous version"

# 5. Investigate the issue
npm run test -- --verbose
# Review error messages

# 6. Fix or postpone
# Either fix the breaking changes or postpone the update
```

### If Update Breaks Production

```bash
# 1. Immediate rollback via Vercel
# - Go to Vercel dashboard
# - Find previous deployment
# - Click "Promote to Production"

# 2. Revert the merge commit
git revert -m 1 <merge-commit-hash>
git push origin main

# 3. Create hotfix branch
git checkout -b hotfix/revert-dependency-update

# 4. Fix the issue or downgrade
npm install package@working-version

# 5. Test thoroughly
npm run test
npm run build

# 6. Deploy hotfix
git commit -m "hotfix: revert problematic dependency update"
git push origin hotfix/revert-dependency-update
# Create PR and merge immediately
```

### If Lock File Gets Corrupted

```bash
# 1. Delete lock file
rm package-lock.json

# 2. Reinstall
npm install

# 3. Verify
npm ci

# 4. Commit
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
```

---

## Common Issues

### Issue 1: Peer Dependency Conflicts

**Symptom:**
```
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Could not resolve dependency:
npm ERR! peer react@"^18.0.0" from package-a@1.0.0
```

**Solution:**
```bash
# Option 1: Update the peer dependency
npm install react@18

# Option 2: Use --legacy-peer-deps (temporary)
npm install --legacy-peer-deps

# Option 3: Wait for package update
# Check package issues/roadmap
```

---

### Issue 2: Breaking Changes Not Documented

**Symptom:** Tests fail after update, no clear migration guide

**Solution:**
```bash
# 1. Check package GitHub issues
# Search for: "breaking changes" "migration" "upgrade"

# 2. Check package commits
git log --oneline v1.0.0..v2.0.0

# 3. Review TypeScript errors
npm run typecheck 2>&1 | tee errors.log

# 4. Bisect if needed
git bisect start
git bisect bad
git bisect good <last-working-commit>
```

---

### Issue 3: npm ci Fails After Update

**Symptom:**
```
npm ERR! package-lock.json out of sync
```

**Solution:**
```bash
# 1. Regenerate lock file
rm package-lock.json
npm install

# 2. Verify
npm ci

# 3. If still fails, check Node version
node --version  # Should be 20.x

# 4. Clear cache
npm cache clean --force
npm install
```

---

### Issue 4: Transitive Dependency Issues

**Symptom:** Package A requires Package B v1, but you have v2

**Solution:**
```bash
# 1. Check dependency tree
npm ls package-b

# 2. Use overrides (package.json)
{
  "overrides": {
    "package-b": "^2.0.0"
  }
}

# 3. Or update parent package
npm update package-a
```

---

## Best Practices

### 1. Regular Updates

**Schedule:**
- **Security patches:** Immediate
- **Patch versions:** Weekly
- **Minor versions:** Monthly
- **Major versions:** Quarterly

**Process:**
```bash
# Every Monday morning
npm outdated
npm audit
# Review and plan updates
```

---

### 2. Update Strategy

**Prioritize:**
1. Security vulnerabilities (highest priority)
2. Bug fixes in critical dependencies
3. New features in actively used packages
4. Major version updates (planned)

**Avoid:**
- Updating everything at once
- Updating during feature freeze
- Updating without testing
- Skipping lock file commits

---

### 3. Testing Strategy

**For Patch Updates:**
- Automated tests
- Quick smoke test

**For Minor Updates:**
- Full test suite
- Manual testing of affected features
- Performance testing

**For Major Updates:**
- Full regression testing
- QA review
- Staging environment testing
- Performance benchmarking

---

### 4. Documentation

**Always Document:**
- Why the update was needed
- What changed
- Breaking changes
- Migration steps (if applicable)
- Performance impact
- Bundle size impact

**Example Commit Message:**
```
feat: upgrade Next.js to v16.0.0

BREAKING CHANGES:
- App Router is now default
- Middleware API changed
- Image component updated

Migration:
- Updated all pages to use App Router
- Migrated middleware to new API
- Updated Image components

Performance:
- Build time: -15%
- Bundle size: -8%
- First load: -12%

See docs/NEXTJS_16_MIGRATION.md for details
```

---

### 5. Communication

**Notify Team When:**
- Major updates planned
- Breaking changes incoming
- Security patches applied
- Dependencies removed

**Use:**
- Slack/Discord announcements
- PR descriptions
- Team meetings
- Documentation updates

---

## Dependency Update Checklist

### Before Update

- [ ] Check package changelog
- [ ] Review breaking changes
- [ ] Create feature branch
- [ ] Ensure tests pass on main
- [ ] Check for conflicting PRs

### During Update

- [ ] Update package(s)
- [ ] Run `npm ci --dry-run`
- [ ] Run tests
- [ ] Run type check
- [ ] Run build
- [ ] Manual testing
- [ ] Check bundle size
- [ ] Check performance

### After Update

- [ ] Update documentation
- [ ] Write clear commit message
- [ ] Create PR with details
- [ ] Request reviews
- [ ] Monitor CI/CD
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor production

---

## Emergency Procedures

### Critical Security Vulnerability

```bash
# 1. Assess severity
npm audit

# 2. Update immediately
npm update <vulnerable-package>

# 3. Test quickly
npm run test

# 4. Deploy ASAP
git add package.json package-lock.json
git commit -m "security: fix critical vulnerability in <package>"
git push
# Create PR and merge immediately
```

### Production is Down

```bash
# 1. Rollback via Vercel (instant)
# Use Vercel dashboard

# 2. Investigate locally
git log --oneline -10
# Find the problematic commit

# 3. Revert
git revert <commit-hash>
git push

# 4. Fix properly later
# Create new branch and fix the issue
```

---

## Tools & Resources

### Useful Commands

```bash
# Check outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# View dependency tree
npm ls

# Check specific package versions
npm view <package> versions

# Explain why package is installed
npm explain <package>

# Check package info
npm view <package>

# Find packages by keyword
npm search <keyword>
```

### Useful Tools

- **npm-check-updates** - Interactive dependency updates
- **depcheck** - Find unused dependencies
- **bundlephobia** - Check package size
- **snyk** - Security scanning
- **renovate** - Automated dependency updates

### Resources

- [npm Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)

---

## Related Documentation

- [PACKAGE_LOCK_ISSUES.md](./PACKAGE_LOCK_ISSUES.md) - Lock file troubleshooting
- [CI_CD_BEST_PRACTICES.md](./CI_CD_BEST_PRACTICES.md) - CI/CD configuration
- [GIT_HOOKS_SETUP.md](./GIT_HOOKS_SETUP.md) - Pre-commit hooks

---

## Support

**Questions?**
- Check this documentation first
- Search GitHub issues
- Ask in team Slack channel
- Create a discussion in GitHub

**Found an Issue?**
- Document the problem
- Try rollback procedures
- Report to team lead
- Update this documentation

---

**Last Updated:** Dec 21, 2025  
**Maintained By:** DevOps Team  
**Review Schedule:** Quarterly
