# CLAUDE.md

Soft deletes addon for AdonisJS Lucid. Fork of `lookinlab/adonis-lucid-soft-deletes`, whose maintainers are inactive.

## Current goal

Release `@minkbear/adonis-lucid-soft-deletes` v3.0.0 for AdonisJS 7.

`docs/v3-definition-of-done.md` is the release gate. Do not publish `3.0.0` until every item passes on the local machine. CI is not used, by decision.

The migration may be in progress. Check `package.json` for the current state, because `master` started at 2.1.0 on `core@6` and `lucid@21`.

## Commands

```bash
npm test              # lint, then all tests with coverage
npm run quick:test    # tests only
npm run typecheck
npm run build         # runs lint first, so lint errors fail the build
npm run release       # np: runs tests, bumps the version, publishes
```

Tests use SQLite only. SQLite is also the agreed database for the real-app check.

## Rules

- **Package name:** always use the scoped name `@minkbear/adonis-lucid-soft-deletes`. npm reads `minkbear/adonis-lucid-soft-deletes` as a GitHub shorthand, and installing from GitHub does not provide `build/`.
- **Provider name:** `configure.ts` writes the provider path into the user's `adonisrc.ts`. It must use the scoped name.
- **`Exception` import:** import from `@adonisjs/core/exceptions`. Do not import from `@poppinss/utils`, which is not a declared dependency and fails under pnpm with `hoist=false`.
- **Provider reference:** keep `preserve="true"` on the `/// <reference>` in the provider. Without it TypeScript drops the directive from the `.d.ts`, and apps lose the `withTrashed` and `onlyTrashed` query builder types. Only the real-app `tsc` check catches this.
- **Version:** do not edit `version` by hand. `np` sets it during release.
- **Attribution:** keep the Lookin Anton copyright in `LICENSE.md` and in file headers. Keep the original author on commits taken from other forks.

## Testing notes

- **Real-app checks:** install the `npm pack` tarball. Do not use `npm link`, which can load a second copy of `@adonisjs/core` and `@adonisjs/lucid`.
- **Dependency versions:** `.npmrc` disables the lockfile, and `npm install` keeps any installed version that is still in range. To reset versions, run `rm -rf node_modules && npm install`.
- **Test filter package:** the old `adonis-lucid-filter` only supports `lucid@21`. Tests for v3 use `@dirupt/adonis-lucid-filter`, as a dev dependency only.
- **Native modules:** if `sqlite3` reports a missing binding, run `npm rebuild sqlite3 @swc/core esbuild`.
