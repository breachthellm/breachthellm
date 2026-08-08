# Direct Prompt Injection

Direct prompt injection is when an attacker's own input to an AI system overrides or manipulates the instructions that system was given. The attacker isn't exploiting a bug in the traditional sense, they're exploiting the fact that a language model can't reliably distinguish "instructions I should follow" from "text I'm being asked to process," especially when both arrive in the same context window.

## Why it works

Most AI systems are built by combining a system prompt (the developer's instructions) with user input (whatever the person typed) into a single block of text the model reads. The model has no hard boundary between the two, it's all just tokens. A confidently worded, well-framed piece of user input can carry as much apparent authority as the system prompt itself, especially if it references fictional context the model has no way to verify.

## Common patterns

- Directly asking the model to ignore or override its prior instructions
- Reframing a request as a hypothetical, a test, or documentation rather than a live instruction
- Claiming a false authority (a supervisor's approval, a compliance clearance) the model can't check
- Asking the model to repeat or summarize its own instructions, which can leak confidential system prompt content

## Where it shows up in production

Direct injection has affected real deployed systems, from chatbots leaking internal configuration to AI assistants being manipulated into taking actions outside their intended scope. It's ranked LLM01 in the OWASP Top 10 for LLM Applications for a reason, it's the most fundamental and hardest-to-fully-close category of LLM vulnerability.