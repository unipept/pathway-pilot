# Contributing to PathwayPilot

Thanks for helping out. This is a short guide to how the repository works — see the
[README](README.md) for what PathwayPilot is and how to run it locally.

## Getting set up

Follow **Local development** in the [README](README.md). Both `web/` and `backend/`
have their own `package.json`, so each is installed and run separately.

You need Node 20 or newer. That is what CI uses; nothing older is tested.

## Making a change

1. Branch off `main`. Name the branch for the change: `fix/pathway-render-crash`,
   `feat/csv-export`, `docs/contributing`.
2. Make the change, and keep the diff to that one thing. Unrelated fixes are much
   easier to review as their own pull request.
3. Run the checks below before opening the pull request.
4. Open a pull request against `main` and describe what changed and why.

## Checks your pull request must pass

CI runs these on every pull request, so it is worth running them first:

```bash
cd web     && npm ci && npm run build     # vue-tsc typecheck + production build
cd backend && npm ci && npx tsc --noEmit  # typecheck
```

Lint is not yet part of CI, but new code should not add problems to it:

```bash
cd web && npm run lint
```

## Commit messages

Recent history follows [Conventional Commits](https://www.conventionalcommits.org/):

```
fix(web): give every v-for loop a stable key
feat(web): make the backend URL configurable
chore: add dependabot config
docs: document the backend environment variables
```

Explain *why* in the body where the reason is not obvious from the diff.

## A note on tests

There is currently no test suite. That means the checks above verify that the code
compiles and builds, not that it behaves correctly — so please exercise your change in
the running app before opening a pull request, and say in the description what you
checked. The sample files in `test-data/` cover every supported input format.

## Reporting problems

- **Bugs and feature requests** — open an issue.
