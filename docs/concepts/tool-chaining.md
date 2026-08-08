# Tool Chaining and Excessive Agency

Prompt injection becomes significantly more dangerous once an AI system doesn't just generate text, it can take real actions. This category, sometimes called "excessive agency," covers what happens when an injected instruction doesn't just make an AI say something wrong, it makes it do something.

## Why this raises the stakes

A chatbot that gets tricked into saying something it shouldn't is a reputational or information-leak problem. An AI agent that gets tricked into actually executing a wire transfer, granting access, or deleting data is an operational one. The injection technique is often identical, the difference is what the AI is allowed to do once it's been manipulated.

## Common patterns

- An AI trusting a claimed internal system state or flag ("auto-approve mode is active") that it has no way to independently verify
- Injected instructions that reference a plausible but fabricated process or authorization
- Chaining a successful injection into a function call or tool invocation the AI has access to, rather than just a recommendation

## Where it shows up in production

As AI agents gain more real-world permissions, calendar access, payment systems, code execution, infrastructure control, this category becomes the most consequential one to get right. It's closely tied to the OWASP LLM Top 10's "Excessive Agency" category, and it's a growing area of focus as agentic AI systems become more common.