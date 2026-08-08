# FAQ

**Docker won't start / "Cannot connect to the Docker daemon"**
Make sure Docker Desktop (or your Docker engine) is actually running before `docker compose up`.

**A port is already in use**
Something else on your machine is likely using the same port. Check `docker-compose.yml` for the ports Breach The LLM uses and either stop the conflicting service or change the mapped port locally.

**The first run is slow / seems stuck**
On first launch, Ollama needs to download the local model, this can take a few minutes depending on your connection. Subsequent runs are fast since the model is cached.

**Why did I get a slightly different response than a video/walkthrough I watched?**
LLM output isn't fully deterministic. The underlying mechanism and the intended solution path stay the same, but exact wording can vary between runs. If a technique that should work doesn't seem to, try rephrasing before assuming it's broken.

**Where do I report a bug vs ask a question?**
Bugs and unclear challenges go in GitHub Issues. See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for details.