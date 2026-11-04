<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->
# Comparing static-site generators through one publishing task

**Review date: 4 November 2026.** This is a method guide for readers and contributors. It reports no new generator build results. See the collection's [source map](SOURCE-MAP.md) for the evidence recorded so far.

A small publishing task can reveal more than a long feature checklist. Give each generator the same content, describe the output you need, and examine how the implementation gets there. This makes the comparison useful both for choosing a tool and for studying different programming approaches.

## Begin with an observable result

Use a compact example: a home page, two articles, one nested page, a draft, and a local image. State how titles, links, dates and templates should appear. Record the output paths you expect and whether the draft should be absent from a published build.

Keep the example small enough to inspect the generated HTML. Successful process exit is one observation; the required content, links and files are separate observations. A useful record includes both.

| Question | Evidence to collect |
| --- | --- |
| What did you run? | Source commit or release, command, runtime/compiler version and operating system. |
| What did you supply? | The example content, configuration and templates, with sensitive values removed. |
| What appeared? | Output file inventory and checks for expected HTML content, links and assets. |
| What happened on failure? | A malformed input, a missing required resource and an invalid output location, with their actual results. |
| Can someone repeat it? | Complete setup instructions and any network or external-service dependencies. |

Define the expected behaviour before running the example. If two generators intentionally treat dates, drafts or links differently, record that difference explicitly. A comparison should help readers choose the behaviour they need.

## Let each implementation show its approach

The shared task gives the comparison a stable point of reference. Within it, inspect how each implementation represents content, applies templates, coordinates work and reports errors.

Useful questions include whether transformations are composed as functions, expressed as a pipeline, organised around objects, described through declarative rules, or divided between concurrent tasks. These are things to investigate in the actual implementation. A language name alone does not establish how a particular generator works.

Separate the generator's own logic from wrappers, generated files and external programs it invokes. Explain which part of the publishing task illustrates an interesting design choice. For an educational experiment, one clear, reproducible idea can be more useful than broad advertised coverage.

## Record boundaries as carefully as successes

A local build exercises a particular input, version and environment. Preview servers, deployment, plugin execution and cleanup introduce additional behaviour and deserve their own evidence when they matter to the intended use.

Decide how the generator will receive content. Trusted files written by a site author and submissions from unknown contributors create different questions about template execution, HTML handling and file access. State which situation your example covers and which properties you actually checked.

For performance comparisons, hold the content, output requirements and environment steady. Record repeated measurements and explain whether setup, compilation and cached work are included. If the outputs differ materially, explain that before interpreting timings.

## Use status labels readers can act on

Follow the collection's [contribution guidance](../CONTRIBUTING.md): distinguish a result verified in a specified environment from documented but untested behaviour, experiments, scaffolds and historical work.

A retained historical implementation can still teach something valuable. Identify its source, authorship, licence and known limitations, and explain the idea a reader can investigate. Preserve uncertainty when there is no runnable example or when an advertised property has not been checked.

For a new contribution, a concise result is enough: **task, source version, command, observed output, failure behaviour, and limitations**. Add the canonical source link and disclose any affiliation. This gives the next reader a practical starting point and a clear boundary around the evidence.

Return to the [generator collection](../README.md) or read the [source and verification ledger](SOURCE-MAP.md).
