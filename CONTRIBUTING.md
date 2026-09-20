# Contributing to Jzs-One-Piece

This is a personal knowledge base, so "contribution" mainly means keeping future additions internally consistent.

## Where Content Goes

- `docs/cpp/` — C++, compiler, build system, performance
- `docs/qt/` — Qt and desktop/client engineering
- `docs/backend/` — Java/Spring/backend/middleware/database
- `docs/devops/` — Linux, containers, Kubernetes/K3s, CI/CD
- `docs/ai/` — LLM, Agent, RAG, AI engineering
- `docs/architecture/` — reusable architecture and design decisions
- `docs/projects/` — project-specific knowledge
- `docs/notes/` — temporary, exploratory, or not-yet-stable notes

## File Naming

Use lowercase kebab-case:

```text
qt-plugin-lifecycle.md
k3s-network-troubleshooting.md
spring-properties-launcher.md
```

Avoid:

```text
新建文档1.md
note-final-final.md
20260920.md
```

Dates belong in metadata unless the date itself is the subject.

## Metadata

Copy `templates/knowledge-note.md` and fill in the front matter.

## Content Quality Checklist

Before merging a substantial note:

- [ ] Is the topic placed in the correct domain?
- [ ] Does a canonical page already exist?
- [ ] Is the title searchable and specific?
- [ ] Are assumptions and version-specific details explicit?
- [ ] Does it explain the reason behind important decisions?
- [ ] Are commands/configurations reproducible where needed?
- [ ] Are related internal pages linked?
- [ ] Is uncertain content marked as draft?
- [ ] Is `updated` correct?

## Lifecycle

A note may evolve:

```text
draft → active → stable
                 ↓
             deprecated
```

Deprecated knowledge should normally be retained when it preserves useful historical context. Add a replacement link rather than simply deleting it.
