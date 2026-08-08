# Contributing to Breach The LLM

Thanks for considering a contribution. This project is early and the process will get more formal as it grows, but here's how things work for now.

## Ways to contribute

- **Report a bug or unclear challenge**: open an issue describing what happened, what you expected, and steps to reproduce if relevant.
- **Improve the docs**: clearer explanations, typo fixes, and better wording are always welcome, no need to ask first, just open a pull request.
- **Propose a new challenge level**: this is the most valuable kind of contribution long term. See below for what a level submission needs.
- **Report a security issue with the project itself** (not a challenge vulnerability, an actual bug in the platform): please open an issue rather than a public exploit writeup if it could affect other users' local instances.

## Proposing a new challenge level

New levels are the core of what makes this project grow past a fixed set of 7 challenges. A good submission includes:

1. **A short scenario description**, what is the fictional setup, and what's the objective
2. **The vulnerability mechanism**, which category it falls under (direct injection, indirect injection, tool chaining, jailbreak, etc.) and why it's realistic
3. **A working implementation**, the actual system prompt, any supporting data (tickets, external content), and the intended exploit path
4. **A flag and validation method**, following the existing `BTL{...}` convention
5. **At least two progressive hints**
6. **A post-solve explanation**, mapping the vulnerability to OWASP LLM Top 10 or a relevant framework, and a note on how it would be defended against in a real system

Open an issue first to discuss the concept before building it out fully, this saves you time if the scenario overlaps with something already planned or doesn't fit the project's scope.

## Code style

- Keep pull requests focused, one feature or fix per PR is easier to review than a large bundle of changes
- Match the existing code structure and naming conventions where possible
- No need for extensive tests on challenge content itself, but platform code changes should not break existing functionality

## Code of conduct

Be respectful. This project exists to teach AI security responsibly, disagreements about implementation are fine, hostility isn't.