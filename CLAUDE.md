# CLAUDE.md

Instructions for Claude Code when working in this repository.

## Project

Breach The LLM is an open source, self-hosted AI security range. v1 ships a 7-level prompt injection attack range against "Veyra Shield," a fictional bank's AI fraud review assistant, plus a Context Trace visualization showing what the AI read and trusted (system prompt vs user input vs injected content).

Stack: React (frontend), Express/Node (backend), MongoDB (progress storage), Docker Compose. AI backend is Ollama (local, default) with optional OpenAI/Anthropic API mode via `.env`.

## Standing rules

- **Never use em dashes (—) anywhere.** Not in code comments, docs, commit messages, or any generated content.
- **Brand colors: dark navy, teal, off-white only.** No amber, no other accent colors, in any UI work.
- **Commit one atomic step at a time.** Do not bundle unrelated changes into a single commit. Wait for explicit confirmation before committing.
- **Public-facing content (README, docs, UI copy, commit messages) never references personal life details** (immigration, family, personal background). Keep it strictly technical and professional.
- **Flag format:** `BTL{descriptive_flag_text}`, validated server-side, never pattern-matched client-side only.
- **Architecture principle: build as scenario packs, not hardcoded.** Veyra Shield is the first pack (system prompts, data, flags, framing), not embedded logic. The engine (Context Trace, scoring, progress) must stay pack-agnostic so future scenario packs (other industries) don't require refactoring the core.
- **v1 scope is deliberately narrow:** the 7 levels, Context Trace, progress/reset, offline Ollama + optional API. Defender mode, multi-model comparison, agentic scenarios, and bring-your-own-system are v2 through v4, do not build them into v1 unless explicitly asked.

## Reference docs in this repo

- `/docs/architecture.md` — how the platform fits together
- `/docs/concepts/*.md` — vulnerability category explanations (no spoilers)
- Level specs, product vision, and scenario-pack architecture docs exist outside this repo and will be added to `/docs` as the project matures; ask before assuming details not yet documented here.

## Working style

Confirm the plan for a step before writing files when the step is non-trivial. Show what will change. Keep commits small and named clearly (conventional commit style: `feat:`, `docs:`, `chore:`, `fix:`).