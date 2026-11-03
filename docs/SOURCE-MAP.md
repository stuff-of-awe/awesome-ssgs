<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
# Source map and verification ledger

**Initial review date:** 2026-11-03. This file tracks attribution and known limitations, not a claim that all dependent projects have been built or validated.

| Source | What was read | What this proves | What it does not prove |
| --- | --- | --- | --- |
| [Polystack / poly-ssg](https://github.com/hyperpolymath/polystack/tree/main/poly-ssg) | `README.adoc`, `engines/`, `satellites/`, `mcp/`, `lsp/`, `sites-build/`, historical audit | Preserved source, comparison tool, protocol integrations and project history exist | Every historical SSG is runnable; production DNS or security claims are current |
| [SSG Collection](https://github.com/hyperpolymath/ssg-collection) | README and directories `implementations/`, `variants/`, `stubs/` | 7 larger implementation trees, 13 variants and 32 scaffolds are represented | They are identical to the Polystack copies, pass tests or are maintained |
| [BoJ SSG MCP](https://github.com/hyperpolymath/boj-server-cartridges/tree/main/cartridges/domains/web/ssg-mcp) | Manifest, `mod.js`, README | Five tool names declared; JavaScript delegates to configurable backend defaulting to `127.0.0.1:7742` | Backend exists, tools work end-to-end or all Poly SSG engines are supported |
| [BoJ SSG LSP](https://github.com/hyperpolymath/boj-server-cartridges/tree/main/cartridges/domains/web/ssg-lsp) | README and archived source notes | New cartridge explicitly scaffolded; original Elixir implementation retained for porting | New LSP handlers implemented/qualified |
| [Polystack preservation blocker](https://github.com/hyperpolymath/polystack/issues/30) | Open migration checklist | Work has an explicit gate and task sequence | Any migration task is completed |

Canonical external repositories were checked for existence on GitHub on 2026-11-03: Hugo, Zola, Astro, Eleventy, Jekyll and Pelican. No binary, integration, CI or current-version comparison was performed on those projects in this initial pass.

## Publication rules

- Do not claim an SSG is independently verified until a reproducible source-to-output test, command/toolchain, commit and result are recorded.
- Do not confuse `ssg-collection`'s *source-file-count* categories with quality or maturity.
- Do not represent archival of Polystack as completion of its MCP or LSP migration.
- Preserve upstream attribution and link directly to original repositories and licences.
- Recheck and note links and test states at the next deliberate editorial review.

## Open work

[ ] Confirm an editor/curator and review cadence.  
[ ] Add one complete tested walkthrough with actual output.  
[ ] Review each experimental entry for its language, runnable entry point, licence and status.  
[ ] Check for overlap and contribute back to appropriate existing community lists where useful.  
[ ] Finalise licensing and assess readiness for any optional central Awesome-directory submission.
