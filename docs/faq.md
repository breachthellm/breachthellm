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

**Why does the UI only show one pack (Veyra Shield)?**
The backend engine, pack loading, progress tracking, flag derivation, is already pack-agnostic; nothing about it assumes Veyra Shield specifically. The frontend just doesn't have multi-pack navigation built yet. Multi-pack support is planned for a future version, not a v1 feature.

**If I reset a level, does it affect my progress on other levels?**
No. Resetting a level only touches that level's own progress record. Every other level you've unlocked or completed stays exactly as it was. You can freely replay any single level without risking progress anywhere else in the pack, that's the intended behavior.

**Why did my chat history disappear when I refreshed the page?**
Chat messages and the Context Trace history for a level live only in the browser's memory for that page session, they're not persisted anywhere. Refreshing starts that level's conversation over. Your actual progress (solved/unsolved, flags earned) is stored server-side and is unaffected, only the visible conversation resets.