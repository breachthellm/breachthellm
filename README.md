# Breach The LLM

**Talk your way past the AI guarding the money.**

An open source, self-hosted range for practicing, proving, and measuring AI security skill. Attack Veyra Shield, a fictional bank's AI fraud review assistant, deliberately built with real, exploitable vulnerabilities. Then defend it, and find out how good you actually are. Think OWASP Juice Shop, but for AI security, and built to be a range you return to, not a game you beat once.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

---

## What is this?

Veyra Shield reviews flagged bank transactions and recommends approve, block, or escalate. Your job is to manipulate what it reads and how it reasons, until it approves transactions it should never approve. Seven progressive challenges walk you through real prompt injection techniques, from basic system prompt leaks to a full chained account takeover.

But breaking it is only the on-ramp. Breach The LLM is being built as a living AI security range: a place to **attack** (learn the techniques), **defend** (harden your own guardrails against an automated adversary), **measure** (see which OWASP LLM and MITRE ATLAS threat categories you have actually demonstrated), and **prove** (earn verifiable, shareable proof of skill). Most tools teach you to break AI and then run out of content. This one is built to stay useful as models and attacks evolve.

This isn't a toy chatbot. Every challenge is built around a realistic scenario, and every solve comes with a plain-language breakdown of the vulnerability and how to defend against it, mapped to the OWASP LLM Top 10 and MITRE ATLAS.

## Why it's different

- **See the attack, don't just infer it.** The Context Trace view color-codes exactly what the AI read and trusted, system prompt, user input, and injected content, so prompt injection becomes visible instead of abstract. Nothing else in this space does this.
- **Built to return to, not to beat.** Attack levels are the hook. Defender mode, a community defense ladder, and skills measurement are what make it a weekly habit rather than a one-time solve.
- **For practitioners and the leaders who train them.** Individuals build and prove real adversarial skill. Teams get framework-mapped coverage they can actually see.
- **Realistic, high-stakes theme.** A bank fraud assistant, not a generic chatbot. Cinematic incident framing, real consequences.

## What's in v1

v1 is the attack range, deliberately narrow and polished. It ships:

- **7 hands-on challenges**, from beginner direct injection to an advanced chained capstone
- **Context Trace view**, a color-coded breakdown of exactly what the AI read and trusted for any given response, so you can see the injection working, not just infer it
- **Cinematic incident framing** and an attack surface map, so you're probing a world, not a chat box
- **Runs fully offline** by default via a local model (Ollama), no API keys required
- **Optional API mode** to test against a real frontier model (OpenAI or Anthropic)
- **Every challenge mapped** to OWASP LLM Top 10 and MITRE ATLAS
- **Progressive hints** per level, plus a full local reset for a clean run
- **One command to start**, no cloud account, no signup, no telemetry

## Quick Start

**Prerequisites:** Docker, Docker Compose, and Node installed.

```bash
git clone https://github.com/breachthellm/breachthellm.git
cd breachthellm
npm run dev
```

Then open `http://localhost:3000` and start with Level 1.

By default, Breach The LLM runs on a local model via Ollama, fully offline. To use a real API instead, copy `.env.example` to `.env` and add your OpenAI or Anthropic API key.

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

React, Express/Node, MongoDB, Docker Compose. AI backend is Ollama by default, with optional OpenAI/Anthropic API support.

## Where this is going

Breach The LLM is built in public and expands in phases. v1 is the hook. The rest is what makes it a range you return to.

- **v1 — The Hook.** The 7-level attack range plus Context Trace. Available now / in progress.
- **v2 — Defend and Measure.** Write your own system prompt and guardrails, then an automated adversary attacks and scores them. A skills scorecard shows which OWASP LLM and MITRE ATLAS categories you have demonstrated. A community defense ladder turns the best submitted defenses into the next challenge.
- **v3 — The Frontier.** Multi-step agentic scenarios: tool-chaining, agent-to-agent handoffs, and MCP-style attacks, the frontier the industry itself calls unsolved. Plus multi-model comparison with Context Trace side by side.
- **v4 — Bring Your Own.** Point the full attack suite at your own system prompt or local endpoint, safely. Team mode with shared leaderboards and internal org events.

The free, open source, self-hosted, offline-capable core stays constant across every phase.

## Contributing

Contributions are welcome, see [`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines on proposing new levels, reporting issues, or improving the docs.

## License

MIT, see [`LICENSE`](./LICENSE) for details.

## Maintainer

Built and maintained by [Arnold Mavhezha](https://github.com/mavhezha).