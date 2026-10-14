# Known limitations and owner decisions

1. The current protected backend has no profile-read endpoint. After a fresh
   session, Source can recover saved opportunities and proposal drafts but
   cannot truthfully repopulate the confirmed profile editor. Closing this
   requires an approved backend/API change.
2. Proposal edits are intentionally local until copied because the existing
   backend has no proposal-edit persistence endpoint. The UI says this plainly.
3. Manual onboarding can draft a profile, but the existing confirmation route
   still requires a supporting public URL. This is shown as a limitation rather
   than being bypassed.
4. A real Remote OK excerpt contained replacement glyphs in the source text.
   Normalizing external encoding belongs in a separately approved data-layer
   change so evidence is not silently rewritten.
5. The legacy Source before screenshot could not be produced from the rollback
   worktree because Next/Turbopack rejected a cross-worktree dependency link
   and the bounded offline install did not finish. No fabricated baseline is
   included.
6. No automated accessibility scanner or video recording was available in the
   evidence run; keyboard focus, labels, alert roles, responsive widths and
   reduced-motion CSS were checked directly.
7. This branch is not a production deployment and does not claim final owner
   acceptance.
