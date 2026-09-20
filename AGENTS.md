# AGENTS.md

## Mission

This repository is a long-term personal knowledge base.

AI agents working in this repository should optimize for:

1. correctness;
2. durable knowledge;
3. clear information architecture;
4. low duplication;
5. future compatibility with static-site generation and RAG.

Do not treat this repository as a chat log or generic note dump.

## Repository Contract

- Primary knowledge lives under `docs/`.
- Reusable media lives under `assets/`.
- Document templates live under `templates/`.
- Markdown is the canonical content format.
- Website code, if introduced later, must not make the knowledge content dependent on a specific frontend framework.

## Before Adding Knowledge

Before creating a new document:

1. Search the repository for an existing document covering the same topic.
2. Prefer updating an existing canonical document over creating a duplicate.
3. Choose the narrowest appropriate domain directory.
4. If the content is immature or uncertain, place it under `docs/notes/` or mark it `status: draft`.

## Required Front Matter

Knowledge documents should contain:

```yaml
---
title: Document Title
description: One-sentence description
category: cpp | qt | backend | devops | ai | architecture | projects | notes
tags:
  - tag
status: draft | active | stable | deprecated
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Recommended Document Structure

Use sections when applicable:

```markdown
# Title

## Problem / Context

## Core Idea

## Design / Solution

## Example

## Pitfalls

## Decision / Trade-offs

## References
```

Do not force empty sections into every document.

## Writing Rules

- Prefer precise technical language.
- Explain why, not only how.
- Separate facts, assumptions, and opinions.
- Preserve commands, error messages, version numbers, and configuration details when they are important to reproducibility.
- Avoid unexplained screenshots when text or diagrams can encode the same knowledge.
- Use relative links for repository-local references.
- Avoid duplicating large blocks of content across documents.
- Keep titles stable once linked from other pages.
- Update `updated` when materially changing knowledge content.

## Architecture Decision Records

For important technical decisions, include:

- context;
- constraints;
- options considered;
- decision;
- trade-offs;
- consequences.

## AI-Generated Content

AI may:

- convert discussions into structured notes;
- normalize terminology;
- add examples;
- improve navigation;
- identify duplicated or outdated content;
- propose cross-links.

AI must not:

- fabricate references or test results;
- silently convert uncertain claims into facts;
- remove historical decisions without preserving context;
- rewrite domain-specific conclusions merely for stylistic consistency.

## Commit Guidance

Prefer small, semantic commits, for example:

- `docs(qt): add plugin lifecycle notes`
- `docs(k3s): document pod networking troubleshooting`
- `docs(ai): add RAG architecture overview`
- `chore(kb): refine knowledge metadata schema`

## Future Website Constraint

When a website is added:

- `docs/` remains source-of-truth.
- Frontend metadata should derive from Markdown front matter where possible.
- Avoid framework-specific syntax in knowledge content unless isolated and optional.
- Content must remain readable directly on GitHub.

## Future RAG Constraint

Documents should remain semantically self-contained enough to chunk and retrieve.

Prefer explicit headings and terminology over references such as “as mentioned earlier” when the referenced context is critical.
