# Architecture

This is how Breach The LLM is put together, useful if you're contributing, curious how it works, or self-hosting somewhere other than a laptop. You don't need to read this to play through the challenges.

## Services

The stack runs as a set of Docker Compose services:

- **Frontend** — React app, the challenge dashboard and the Veyra Shield interface
- **Backend** — Express/Node API, handles challenge logic, flag validation, and requests to the local AI model
- **MongoDB** — stores local progress (levels unlocked, completed, hints used) and nothing else
- **Ollama** — the local model runtime, default AI backend, fully offline

## AI backend: local, with API mode planned

The backend talks to a local model through Ollama. This is the only AI backend implemented today, and it's what keeps the whole platform offline and free to run.

`docker-compose.yml` and `.env.example` already define `AI_BACKEND_MODE`, `OPENAI_API_KEY`, and `ANTHROPIC_API_KEY`. These are forward-looking placeholders for a planned API mode, calling OpenAI or Anthropic instead of the local model, useful for seeing how a hardened production-grade model responds differently than a local one. Setting them today has no effect: the backend only ever calls Ollama. API mode is planned for a future version.

After the first `docker compose up`, the Ollama model needs to be pulled manually into the container before challenges will work:

```
docker exec -it btl-ollama ollama pull llama3.1:8b
```

Swap the model name if you've set a different `OLLAMA_MODEL` in `.env`. Automating this pull is planned for a later step.

`llama3.1:8b` is the tested default (about 4.9GB download, 8GB+ RAM recommended). `llama3.2:3b` is available as a lighter alternative but is experimental, the prompt calibration in each level was tuned against 8b, and smaller models may refuse valid techniques inconsistently.

## Progress and flags

Progress lives in MongoDB, one document per local install, tracking which levels are unlocked, completed, how many hints were used, and when each was completed. Flags are validated server-side against the actual model output for that session, not pattern-matched on the client, so the flag format alone can't be gamed.

## The Context Trace

Every AI response the backend returns includes structured metadata about what went into the model's context: what came from the system prompt, what came from direct user input, and what came from injected or external content. The frontend uses this to render the color-coded trace view. This is generated as part of the normal request/response cycle, not a separate pass.