# CI Pipeline Quick Reference

## What Gets Checked

Every push and PR runs:

```bash
npm run lint        # Code quality
npm run typecheck   # TypeScript validation
npm run build       # Compilation check
```

## Running Checks Locally

Before pushing, run:

```bash
# Run all checks
npm run lint && npm run typecheck && npm run build

# Or individually
npm run lint
npm run typecheck
npm run build
```

## Common Issues

### Lint Errors
```bash
# See what's wrong
npm run lint

# Auto-fix what's possible
npm run format
```

### Type Errors
```bash
# Check types
npm run typecheck

# Clean and rebuild
npm run clean
npm install
npm run build
```

### Build Failures
```bash
# Ensure Prisma is generated
npm run prisma:generate -w @optiq/backend

# Clean build
npm run clean
npm run build
```

## CI Status

- ✅ **Green check** = All tests passed, ready to merge
- ❌ **Red X** = Tests failed, fix before merging
- 🟡 **Yellow dot** = Tests running, wait for completion

## Bypassing CI (Emergency Only)

If you need to bypass CI in an emergency:

1. Admin must temporarily disable branch protection
2. Merge the PR
3. **Immediately** re-enable branch protection
4. Create follow-up PR to fix the issue

**Note:** This should be extremely rare and documented.

## Adding Tests

When you add tests:

1. Install test framework:
   ```bash
   npm install --save-dev vitest @vitest/ui
   ```

2. Update `package.json`:
   ```json
   "test": "vitest run",
   "test:watch": "vitest"
   ```

3. Uncomment test job in `.github/workflows/ci.yml`

4. Update branch protection to require "Unit Tests" check

## Workflow Files

- **CI Workflow**: `.github/workflows/ci.yml`
- **Branch Protection Guide**: `.github/BRANCH_PROTECTION.md`
- **This Guide**: `.github/CI_QUICKSTART.md`
