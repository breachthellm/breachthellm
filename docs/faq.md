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