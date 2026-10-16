# npm audit triage — 2026-10-16

This record documents the dependency review requested by Director Directive 023. It is evidence for the existing approved release; it does not authorize a dependency upgrade, framework change, or production code change.

## Scope and commands

Repository: `Techkeyy/source`
Release under review: `64807d1ce7da0c036949d430a0627c9878770323`
Production: [https://source-9k1o.onrender.com](https://source-9k1o.onrender.com)
Audit date: 2026-10-16 (Africa/Lagos)

Commands run:

```powershell
npm audit --omit=dev
npm audit --omit=dev --json
npm audit --json
npm ls @mastra/core gray-matter js-yaml argparse sprintf-js eslint-config-next @next/eslint-plugin-next fast-glob micromatch braces --all
```

`npm audit fix --force` was not run. No dependency, lockfile, framework, or application-code change was made as part of this triage.

## Count summary

| Audit scope | High | Moderate | Critical | Production interpretation |
|---|---:|---:|---:|---|
| `npm audit --omit=dev` | 0 | 5 | 0 | Five moderate package nodes remain in a transitive `@mastra/core` parser chain. |
| Full `npm audit` | 5 | 5 | 0 | The five high package nodes are in the development-only ESLint chain; the five moderate nodes are the same production Mastra chain. |

The npm count is package-node based. The ten findings reduce to two advisory chains: one high development chain and one moderate production transitive chain.

## Triage table

| Affected package and path | Advisory and severity | Present at production runtime? | Vulnerable functionality used by Source? | Safe remediation | Residual risk / decision |
|---|---|---|---|---|---|
| `braces@3.0.3` via `micromatch@4.0.8` → `fast-glob@3.3.1` → `@next/eslint-plugin-next@16.4.1` → `eslint-config-next@16.4.1` | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), high, CVSS 7.5. Deeply nested brace patterns can exhaust the stack and cause denial of service. | No. This is in the dev-only ESLint dependency tree and is absent from the `--omit=dev` result. | No. Source does not run ESLint or pass attacker-controlled patterns through this development toolchain in production. | Do not accept npm’s `--force` recommendation. It proposes `eslint-config-next@14.2.35`, a breaking/downgrade path. A future controlled dev-toolchain update can evaluate a compatible non-breaking remediation. | No credible production exposure was found. Keep the current tested toolchain for this release; track the dev-only advisory separately. |
| `sprintf-js@1.0.3` via `argparse@1.0.10` → `js-yaml@3.15.2` → `gray-matter@4.0.3` → `@mastra/core@1.77.0` | [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), moderate, CVSS 5.3. Unbounded precision specifiers can cause denial of service. npm reports the related `argparse`, `js-yaml`, and `gray-matter` nodes as the same moderate chain. | Yes, transitively. `@mastra/core` is a production dependency and Source imports `@mastra/core/workflows` from `src/lib/profile-workflow.ts`; the production-only audit retains this chain. | The Mastra workflow boundary is used for every profile analysis, but Source does not import `sprintf-js`, `argparse`, `js-yaml`, or `gray-matter`, and does not use Mastra’s workspace-skill/front-matter APIs. The installed Mastra workflow bundle nevertheless includes the front-matter parser, so “not directly called by Source” is not the same as “absent from the runtime bundle.” | No safe non-breaking remediation was identified. npm’s automated fix requires `@mastra/core@1.0.4` and reports a major change. Removing or replacing the Mastra workflow boundary would also be a separate application correction. Evaluate an upstream compatible fix or a separately approved package-path change before altering the release. | Limited but non-zero residual risk: an attacker would need to reach the affected parser functionality through the upstream Mastra runtime; Source’s exercised profile path does not accept skill/front-matter files. This is a production follow-up item, not a reason to force-upgrade the verified release. |

## Evidence for runtime and use classification

- `src/lib/profile-workflow.ts` imports `createStep` and `createWorkflow` from `@mastra/core/workflows` and starts that workflow for profile analysis.
- `src/app/api/profile/analyze/route.ts` calls `runProfileAnalysis` after website extraction and before returning the profile response.
- The vulnerable transitive packages are not imported by Source application code.
- The installed `@mastra/core` distribution includes `gray-matter` in its workspace-skill/front-matter bundle. The parser is used by Mastra’s skill-loading implementation, not by Source’s profile, discovery, proposal, or persistence code.
- No Source feature supplies user-controlled skill files or front-matter documents to that Mastra API in the accepted production journey.
- The high `braces` chain is development-only: `eslint-config-next` → `@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces`. It does not appear in the production-only audit.

## Production-risk verdict

No credible high-severity production exposure was found. The production-only audit reports zero high and zero critical findings, and the high advisory is confined to the development ESLint tree.

The remaining moderate finding is a real transitive production dependency risk because the release uses `@mastra/core` at runtime. Static and acceptance-path evidence shows that Source does not directly invoke the vulnerable front-matter parser, but the package is present in the runtime bundle and the advisory cannot be dismissed as purely development-only. The correct disposition for this frozen release is to document and track the residual risk, avoid `npm audit fix --force`, and require a separately approved security correction before changing Mastra or the dependency tree.

This triage did not change the deployed application, production secrets, Render service, hosting plan, or infrastructure.
