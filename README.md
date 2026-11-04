<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
# Awesome Static Site Generators — mainstream, experimental and unusual-language approaches

A **curated, evidence-conscious starting point** for discovering static-site generators (SSGs), learning how they differ, and trying unconventional implementations. Maintained by [Stuff of Awe](https://github.com/stuff-of-awe), with independent projects and our own work assessed on the same terms.

> **Status: starter collection, editorial and execution review open (3 November 2026).** Repository links below were inspected, but this publication has **not** independently built every tool or reproduced the experimental projects' claims. Being listed means *worth investigating*, not production-qualified. This has not been submitted to the central Awesome list.

## Start with an established generator

| Project | Ecosystem | Why look at it? |
| --- | --- | --- |
| [Hugo](https://github.com/gohugoio/hugo) | Go | General-purpose, fast static-site publishing |
| [Zola](https://github.com/getzola/zola) | Rust | Self-contained, content-focused generator |
| [Astro](https://github.com/withastro/astro) | JavaScript ecosystem | Content sites with component-based pages and static output |
| [Eleventy (11ty)](https://github.com/11ty/eleventy) | JavaScript | Flexible templates and a small-site workflow |
| [Jekyll](https://github.com/jekyll/jekyll) | Ruby | Classic blog and documentation publishing |
| [Pelican](https://github.com/getpelican/pelican) | Python | Article-oriented publishing in the Python ecosystem |

These are canonical source repositories, not test results or version-specific recommendations. Follow each project's own current documentation for setup.

## Different paradigms: research and lesser-known projects

These entries are useful for studying SSG design across programming languages. They are **not** all established, runnable products.

| Project or collection | Approach | Verified scope of this catalogue |
| --- | --- | --- |
| [Casket SSG](https://github.com/hyperpolymath/casket-ssg) | Haskell | Independently maintained repository; execution not assessed here |
| [Ddraig SSG](https://github.com/hyperpolymath/ddraig-ssg) | Idris 2 | Independently maintained repository; execution not assessed here |
| [SSG Collection: seven larger experiments](https://github.com/hyperpolymath/ssg-collection/tree/main/implementations) | Eclipse, Hackenbush, Odd, Pharos, QED, Rats, Wokelang | Larger source trees **as classified by file count**, not independently certified builds |
| [SSG Collection: thirteen smaller variants](https://github.com/hyperpolymath/ssg-collection/tree/main/variants) | Includes Befunge, Gleam/Sparkle, WAT/Wagasm and Zig/Zigzag | Experimental code and sketches; capabilities vary |
| [SSG Collection: thirty-two stubs](https://github.com/hyperpolymath/ssg-collection/tree/main/stubs) | Broader language and design ideas | **Scaffolds only; not recommended as generators** |
| Poly SSG historical framework (private source; [public migration tracker](https://github.com/hyperpolymath/boj-server-cartridges/issues/165)) | Comparison UI, engines, adapters, MCP/LSP and site-building assets | Preservation/migration in progress; **not a publicly downloadable generator** |

Polystack has a private preservation blocker; public compatibility status is tracked in [BoJ issue #165](https://github.com/hyperpolymath/boj-server-cartridges/issues/165). The public list is **not** the runtime for BoJ and does not establish that an SSG cartridge can build or deploy a site.

## Compare generators usefully

When choosing or reviewing an SSG, record the source format (Markdown, AsciiDoc, etc.), templates and language, build reproducibility, output and deployment support, accessibility testing, threat model for untrusted content and dependencies, extensibility, and the **specific version/commit actually tested**.

For experimental SSGs, also distinguish a language-specific core implementation from wrappers, generated files and a generic template. An SSG repository with a manifest or README but no exercised source-to-HTML path belongs in the *experimental* or *historical* category.

Use [Comparing static-site generators through one publishing task](docs/COMPARISON-NOTES.md) for a repeatable example, an evidence checklist and a way to study implementation choices without overstating what a build proves.

## Existing lists and discovery

- [Jamstack's generator index](https://jamstack.org/generators/) — broad discovery across popular tools.
- [Awesome Static Web Site Generators](https://github.com/myles/awesome-static-generators) — historical resource (repository archived; credit its original curators).
- [Awesome Static Site Generators](https://github.com/ishandutta2007/Awesome-Static-Site-Generators) — existing community list; review before duplicating entries.

Our distinct remit is **comparative evidence, experimental languages and formal-methods approaches**, not copying a mainstream catalogue.

## Contribute and maintain

See [CONTRIBUTING.md](CONTRIBUTING.md), [SOURCE-MAP.md](docs/SOURCE-MAP.md) and [Stuff of Awe's maintenance policy](https://github.com/stuff-of-awe/.github/blob/main/docs/collections/MAINTENANCE.adoc). Add independent work freely; declare your affiliation with any project you submit. A maintainer should review links quarterly and record tested commands before upgrading any entry to "verified".

Text and original curation: [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt). Linked software and third-party content retain their own licences and attribution.
