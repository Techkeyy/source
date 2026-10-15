# Rollback and release boundary

## Exact rollback point

`70f8042550cfbf28b15bc5adbf969a9baa48bd40` (`docs: record Render deployment
blocker`) is the recorded pre-Directive-015 branch point. The active redesign
branch is `codex/uiux-015-findor-reconstruction`.

## Local rollback procedure

Before merge or deployment, review the branch diff. If the director rejects the
visual slice, discard or archive the isolated branch and continue from the
recorded rollback commit. Do not reset a shared checkout destructively.

## Release boundary

- Local preview only.
- Existing public deployment remains unchanged.
- No production environment variables, database, AI provider, Render service
  or GitHub history were changed by this directive.
- A later release must be explicitly authorized after rendered review and any
  approved backend persistence work.
