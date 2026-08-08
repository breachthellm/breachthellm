# Architecture

This is how Breach The LLM is put together, useful if you're contributing, curious how it works, or self-hosting somewhere other than a laptop. You don't need to read this to play through the challenges.

## Services

The stack runs as a set of Docker Compose services:

- **Frontend** — React app, the challenge dashboard and the Veyra Shield interface
- **Backend** — Express/Node API, handles challenge logic, flag validation, and the AI backend switch
- **MongoDB** — stores local progress (levels unlocked, completed, hints used) and nothing else
- **Ollama** — the local model runtime, default AI backend, fully offline

## AI backend: local vs API mode

By default, the backend talks to a local model through Ollama. This keeps the whole platform offline and free to run. If you set API credentials in `.env`, the backend switches to calling OpenAI or Anthropic instead, useful if you want to see how a hardened production-grade model responds differently than a local one. The switch is a config value, not a code change, the rest of the platform behaves identically either way.

## Progress and flags

Progress lives in MongoDB, one document per local install, tracking which levels are unlocked, completed, how many hints were used, and when each was completed. Flags are validated server-side against the actual model output for that session, not pattern-matched on the client, so the flag format alone can't be gamed.

## The Context Trace

Every AI response the backend returns includes structured metadata about what went into the model's context: what came from the system prompt, what came from direct user input, and what came from injected or external content. The frontend uses this to render the color-coded trace view. This is generated as part of the normal request/response cycle, not a separate pass.