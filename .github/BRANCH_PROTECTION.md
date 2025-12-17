# Branch Protection Setup Guide

This document explains how to configure GitHub branch protection rules to enforce CI quality gates.

## Overview

The CI pipeline runs automatically on every push and pull request, executing:
- **Lint** - Code quality and style checks
- **Type Check** - TypeScript validation across the monorepo
- **Build** - Ensures all packages compile successfully

Branch protection rules ensure that code cannot be merged unless all checks pass.

---

## Setting Up Branch Protection

### 1. Navigate to Repository Settings

1. Go to your repository: `https://github.com/ExportedSA/Optiq`
2. Click **Settings** tab
3. Click **Branches** in the left sidebar
4. Click **Add branch protection rule**

### 2. Configure Protection Rules

#### **Branch name pattern**
```
main
```

#### **Protect matching branches** - Enable these settings:

##### ✅ **Require a pull request before merging**
- ☑️ Require approvals: `1` (recommended)
- ☑️ Dismiss stale pull request approvals when new commits are pushed
- ☐ Require review from Code Owners (optional)

##### ✅ **Require status checks to pass before merging**
- ☑️ Require branches to be up to date before merging
- **Required status checks:**
  - `Quality Gate` (from CI workflow)

##### ✅ **Require conversation resolution before merging**
- Ensures all PR comments are addressed

##### ✅ **Do not allow bypassing the above settings**
- Applies rules to administrators too (recommended for production)

##### ⚠️ **Optional but Recommended:**
- ☑️ Require linear history (prevents merge commits)
- ☑️ Require deployments to succeed before merging (if using deployments)

### 3. Save Changes

Click **Create** or **Save changes** at the bottom.

---

## Testing Branch Protection

### Create a Test PR with Failing Checks

1. **Create a new branch:**
   ```bash
   git checkout -b test/ci-validation
   ```

2. **Introduce a lint error:**
   ```bash
   echo "const unused = 'test';" >> apps/backend/src/index.ts
   git add .
   git commit -m "test: introduce lint error"
   git push origin test/ci-validation
   ```

3. **Create a Pull Request:**
   - Go to GitHub and create a PR from `test/ci-validation` to `main`
   - Observe that the **Quality Gate** check fails
   - The **Merge** button should be disabled with message: "Merging is blocked"

4. **Fix the error:**
   ```bash
   git revert HEAD
   git push origin test/ci-validation
   ```

5. **Verify checks pass:**
   - CI re-runs automatically
   - Once green, the **Merge** button becomes enabled

---

## CI Workflow Details

### Workflow File
`.github/workflows/ci.yml`

### Triggers
- **Push** to `main` or `develop` branches
- **Pull requests** targeting `main` or `develop`

### Jobs

#### **Quality Gate** (required)
- **Lint**: `npm run lint`
- **Type Check**: `npm run typecheck`
- **Build**: `npm run build`
- **Artifact Verification**: Ensures build outputs exist

### Environment Variables
The CI workflow provides minimal environment variables for build validation:
- Database URL (test connection string)
- Auth secrets (test values meeting validation requirements)
- Integration credentials (test values)

**Note:** These are test values only and do not connect to real services.

---

## Workflow Optimization

### Caching
The workflow uses `actions/setup-node@v4` with `cache: 'npm'` to cache dependencies, reducing install time on subsequent runs.

### Concurrency
Configured to cancel in-progress runs when new commits are pushed to the same branch, saving CI minutes.

### Timeouts
- Quality Gate: 15 minutes max
- Prevents stuck jobs from consuming resources

---

## Adding Tests to CI

When you implement tests, uncomment the test job in `.github/workflows/ci.yml`:

```yaml
test:
  name: Unit Tests
  runs-on: ubuntu-latest
  timeout-minutes: 10
  needs: quality-gate

  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm run test
      env:
        NODE_ENV: test
```

Then update the required status checks in branch protection to include `Unit Tests`.

---

## Troubleshooting

### CI Fails with "Cannot find module"
- Ensure `npm ci` is used (not `npm install`)
- Check that all dependencies are in `package.json`
- Verify workspace references are correct

### Build Fails with Environment Errors
- Check that all required env vars are provided in the workflow
- Ensure test values meet validation requirements (e.g., 32+ char secrets)

### Lint Fails Locally but Passes in CI (or vice versa)
- Run `npm run lint` locally to see exact errors
- Ensure you're using the same Node version (20.x)
- Check for `.eslintignore` differences

### Status Check Not Appearing in PR
- Ensure the workflow file is on the base branch (main)
- Check Actions tab for workflow run status
- Verify workflow syntax with `yamllint .github/workflows/ci.yml`

---

## Best Practices

### For Developers

1. **Run checks locally before pushing:**
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

2. **Keep PRs small and focused:**
   - Easier to review
   - Faster CI runs
   - Easier to debug failures

3. **Write descriptive commit messages:**
   - Helps reviewers understand changes
   - Useful for debugging CI failures

### For Maintainers

1. **Monitor CI performance:**
   - Check Actions tab regularly
   - Optimize slow jobs
   - Update dependencies to fix security issues

2. **Review and update protection rules:**
   - Adjust approval requirements as team grows
   - Add new required checks as needed
   - Keep rules documented

3. **Keep workflow up to date:**
   - Update action versions regularly
   - Add new quality checks as needed
   - Remove obsolete checks

---

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions for Node.js](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
