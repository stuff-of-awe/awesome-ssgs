<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
# Contributing to Awesome SSGs

We welcome mainstream generators, narrowly focused tools, small research implementations and educational examples. This is a curated guide, **not a dump of every repository with an SSG name**. Follow [Stuff of Awe's standing maintenance rules](https://github.com/stuff-of-awe/.github/blob/main/docs/collections/MAINTENANCE.adoc).

## An acceptable new entry

Provide:
1. Canonical project/source URL and the actual implementation language/runtime.
2. A concise original description of what the project does and whom it serves.
3. Status: **verified in a specified environment**, **documented but not independently tested**, **experimental**, **scaffold/stub**, or **historical**. Record tested commit, commands, toolchains and results if you claim verification.
4. An actual source-to-static-output example if it is presented as a usable generator; a template, manifest or empty directory is not evidence.
5. Licence and maintenance context (e.g., archived, actively maintained, unsupported version), and attribution to original authors.
6. Relationship to an existing listed tool, where relevant, so related forks are not presented as original projects.

Our own tools receive no preference. Disclose personal/organisational affiliation. Distinguish theoretical assertions and stated proof obligations from checked proof evidence.

## Review workflow

- Propose via a focused issue or PR. One category or related set of entries per PR.
- Verify links and inspect the actual source/docs; do not copy existing list descriptions verbatim.
- Keep the mainstream list concise. Put unusual-language research, historical work and unimplemented stubs in their clearly marked categories.
- Review with applicable bots and address substantive comments. A CI "success" that did not run meaningful checks does not justify a verified label.
- A human curator makes the final editorial decision. Do not submit an AI-generated dump to the central Awesome directory.
- Quarterly review target for link validity and changes in upstream status. This target is not an assertion that automated monitoring is configured.

Text submissions are accepted under the collection's [CC BY-SA 4.0 licence](LICENSES/CC-BY-SA-4.0.txt). External code retains its own licence; never copy third-party code into this list just to demonstrate a build.

For Polystack-derived projects, respect [the preservation blocker](https://github.com/hyperpolymath/polystack/issues/30): source and build-system migration is separate from this curated list.
