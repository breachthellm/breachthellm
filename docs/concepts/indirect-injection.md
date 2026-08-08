# Indirect Prompt Injection

Indirect prompt injection is the same underlying mechanism as direct injection, an AI trusting text it shouldn't, but the malicious instruction doesn't come from what the user types directly. Instead, it's embedded in data the AI reads as part of doing its job: a document, a support ticket, a web page, an email.

## Why it's more dangerous than it sounds

Direct injection requires the attacker to be the one typing into the AI. Indirect injection doesn't. An attacker can plant an instruction somewhere they know an AI system will eventually read it, a resume an AI screener will process, a product review an AI shopping assistant will summarize, a webpage an AI agent will fetch for context, and never interact with the AI system themselves. The instruction executes later, automatically, when the AI encounters the poisoned content.

## Common patterns

- Embedding instructions in a document, ticket, or form field addressed directly to "the AI" or "the assistant" rather than a human reader
- Hiding text in places humans skip but machines still parse (HTML comments, footer text, metadata)
- Referencing fictional prior authorization or context the AI has no way to verify

## Where it shows up in production

Indirect injection is behind some of the more serious real-world AI security incidents, cases where an AI agent with access to email, documents, or web content was manipulated purely through content it was asked to process, with no direct interaction from the attacker at all. It's a growing concern as AI agents get more autonomy to read and act on external content.