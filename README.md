# Breach The LLM

**Talk your way past the AI guarding the money.**

An open source, self-hosted range for practicing, proving, and measuring AI security skill. Attack Veyra Shield, a fictional bank's AI fraud review assistant, deliberately built with real, exploitable vulnerabilities. Then defend it, and find out how good you actually are. Think OWASP Juice Shop, but for AI security, and built to be a range you return to, not a game you beat once.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

---

## What is this?

Veyra Shield reviews flagged bank transactions and recommends approve, block, or escalate. Your job is to manipulate what it reads and how it reasons, until it approves transactions it should never approve. Seven progressive challenges walk you through real prompt injection techniques, from basic system prompt leaks to a full chained account takeover.

This isn't a toy chatbot. Every challenge is built around a realistic scenario, and every solve comes with a plain-language breakdown of the vulnerability and how to defend against it, mapped to the OWASP LLM Top 10 and MITRE ATLAS.

## Why it's different

- **See the attack, don't just infer it.** The Context Trace view color-codes exactly what the AI read and trusted, system prompt, user input, and injected content, so prompt injection becomes visible instead of abstract. Nothing else in this space does this.
- **A live target, not a fixed puzzle.** Every challenge runs against a real local model, so responses aren't scripted or fully deterministic, the same technique can play out differently on a retry, and per-level resets let you replay freely.
- **For practitioners and the leaders who train them.** Individuals build and prove real adversarial skill. Teams get framework-mapped coverage they can actually see.
- **Realistic, high-stakes theme.** A bank fraud assistant, not a generic chatbot. Cinematic incident framing, real consequences.

## What's in v1

v1 is the attack range, deliberately narrow and polished. It ships:

- **7 hands-on challenges**, from beginner direct injection to an advanced chained capstone
- **Context Trace view**, a color-coded breakdown of exactly what the AI read and trusted for any given response, so you can see the injection working, not just infer it
- **Cinematic incident framing** and an attack surface map, so you're probing a world, not a chat box
- **Runs fully offline** via a local model (Ollama), no API keys required
- **Every challenge mapped** to OWASP LLM Top 10 and MITRE ATLAS
- **Progressive hints** per level, plus a full local reset for a clean run
- **One command to start**, no cloud account, no signup, no telemetry

## Quick Start

**Prerequisites:** Docker, Docker Compose, and Node.js (used to run the setup script, not to build the app, everything else happens in containers).

Note: on first run, Breach The LLM downloads a local AI model (~4.9GB) via Ollama. This requires a reasonably modern machine (8GB+ RAM recommended) and a few minutes depending on your connection.

```bash
git clone https://github.com/breachthellm/breachthellm.git
cd breachthellm
npm run dev
```

In a separate terminal, pull the model into the running Ollama container:

```bash
docker exec -it btl-ollama ollama pull llama3.1:8b
```

Then open `http://localhost:3000` and start with Level 1.

Using a lighter local model? Set `OLLAMA_MODEL=llama3.2:3b` in `.env`, note this is experimental, current challenges are calibrated against the larger model and smaller models may behave inconsistently.

Breach The LLM runs on a local model via Ollama, fully offline.

## The Challenges

| Level | Name | Teaser | Difficulty |
|---|---|---|---|
| 1 | Leak the Rules | Every system has secrets. Get Veyra Shield to tell you hers. | Beginner |
| 2 | Override the Verdict | The AI just flagged this transaction as high risk. Convince it otherwise. | Beginner-Intermediate |
| 3 | The Poisoned Dispute | You never spoke to the AI directly. It read your words anyway. | Intermediate |
| 4 | The Fake Vendor Page | The AI trusts what it finds online. What if you control the page? | Intermediate |
| 5 | Chain to the Wire | A recommendation is just words. Make it act. | Advanced |
| 6 | Past the Fraud Filters | This one was built to resist you. Find the gap anyway. | Advanced |
| 7 | Full Account Takeover | Everything you've learned. One account. Empty it. | Capstone |

Full conceptual breakdowns of each vulnerability category live in [`/docs`](./docs), no spoilers, just the underlying mechanics.

## Tech Stack

React, Express/Node, MongoDB, Docker Compose. AI backend is Ollama.

## Contributing

Contributions are welcome, see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines on proposing new levels, reporting issues, or improving the docs.

## License

MIT, see [`LICENSE`](./LICENSE) for details.

## Maintainer

Built and maintained by [Arnold Mavhezha](https://github.com/mavhezha).