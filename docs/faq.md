# FAQ

**Docker won't start / "Cannot connect to the Docker daemon"**
Make sure Docker Desktop (or your Docker engine) is actually running before `docker compose up`.

**A port is already in use**
Something else on your machine is likely using the same port. Check `docker-compose.yml` for the ports Breach The LLM uses and either stop the conflicting service or change the mapped port locally.

**The first run is slow / seems stuck**
On first launch, Ollama needs to download the local model, this can take a few minutes depending on your connection. Subsequent runs are fast since the model is cached.

**Why did I get a slightly different response than a video/walkthrough I watched, or a technique that worked before suddenly failed?**
Levels run against a live local AI model, so responses aren't fully deterministic. A technique that works once can still fail on a retry, that's expected, not a bug. Try rephrasing your prompt or simply trying again before assuming a technique is wrong.

**Where do I report a bug vs ask a question?**
Bugs and unclear challenges go in GitHub Issues. See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for details.

## Design decisions

**Why can I compute my own flags by reading the source code?**
Flags are derived per-install: an HMAC of `packId:levelId` and a secret generated locally the first time you run the stack. Anyone with access to their own repo and `.env` could compute their own flags without solving a level. This is intentional. The threat model here is preventing a flag leaked publicly, a walkthrough, a shared solution, from working on someone else's install, not preventing a player from reading their own machine's files. Every install has its own secret, so a leaked flag from one install is worthless on another. This is the same trust model most self-hosted, single-player security-training tools use.

**Why is CORS wide open and the API unauthenticated?**
Because this is built to run on localhost, for one player, on their own machine. There's nothing on the other side of that network boundary to protect against in that setup. If you expose the stack beyond localhost, on a shared network or the public internet, adding your own authentication and access controls is your responsibility. The platform doesn't do it for you today.

**Why are there two packs, Veyra Shield and Harden Veyra Shield?**
Veyra Shield is attack mode: seven challenges where you break a vulnerable AI fraud reviewer. Harden Veyra Shield is defend mode: you rewrite its system prompt yourself and an automated adversary tests your patch against the same categories of attack. They're separate packs sharing the same underlying engine, pack loading, progress tracking, and flag derivation aren't specific to either one, which is what makes it possible to add more packs without changing how the platform itself works.

**Why doesn't Harden Veyra Shield have a level about preventing confidential disclosure, the direct-injection category Veyra Shield's own Level 1 teaches?**
It was investigated, built, and calibrated against, then dropped after real testing. The `/defend` engine gained genuine support for it, a leak-detection check (`leakIndicators`) alongside the existing verdict-word and tool-call checks, attack-trial-aware so it can require the opposite of what the legitimate trial requires. Content was built reusing Veyra Shield's own Level 1 system prompt, protecting an opaque token rather than natural-language policy text specifically to avoid the paraphrase-detection limitations of substring matching.

Eleven independent live attack attempts, spanning Level 1's fully-calibrated shipped wording down to its original, essentially undefended draft, and topics from confidential fraud-detection rules to a completely unrelated internal shift-scheduling policy, all failed to get the local model (llama3.1:8b) to disclose a protected value, whether asked directly or through a social-engineering reframe (audit requests, new-employee training documentation, translation requests, system integrity checks, classic "ignore previous instructions" overrides). The refusal held even against a prompt with almost no defensive language of its own, and even for a topic with no plausible connection to fraud or security, ruling out both "the prompt is too hardened" and "the topic is sensitive" as explanations.

The likely cause: llama3.1:8b appears to carry broad baseline training against revealing confidential instructions as a request pattern, independent of whatever a pack's own fictional system prompt says. That means there's no demonstrable vulnerable baseline for a player's patch to defend against, since the model already resists the attack before any patch exists, making the lesson untestable with this engine's single-shot, deterministic classification approach against this model. This wasn't pursued further with dedicated jailbreak techniques, since testing general jailbreak resistance against the base model is a different kind of project than this pack has been. The engine capability (`leakIndicators`) remains in place, regression-tested and inert, in case a future pack, level, or model makes it viable.

**If I reset a level, does it affect my progress on other levels?**
No. Resetting a level only touches that level's own progress record. Every other level you've unlocked or completed stays exactly as it was. You can freely replay any single level without risking progress anywhere else in the pack, that's the intended behavior.

**Why did my chat history disappear when I refreshed the page?**
Chat messages and the Context Trace history for a level live only in the browser's memory for that page session, they're not persisted anywhere. Refreshing starts that level's conversation over. Your actual progress (solved/unsolved, flags earned) is stored server-side and is unaffected, only the visible conversation resets.

**When calibrating a defend-mode level, why did several submissions of the exact same patch produce suspiciously uniform results, then suddenly change?**
Ollama's inference engine (llama.cpp) reuses cached KV-state for a new request when it shares a long common prefix with a recently-processed one. Submitting the same, or a nearly identical, system prompt to `/defend` repeatedly in quick succession can land on the same cached completion path instead of sampling fresh and independently each time, so a short run of identical-looking submissions can look artificially consistent, or artificially stuck, in a way that doesn't reflect the patch's true reliability. If a calibration run seems locked into one outcome across several submissions of the same text, try a genuinely reworded variant, or restart the Ollama container, before drawing a conclusion from that streak alone.