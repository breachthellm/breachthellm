const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://ollama:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

export class OllamaError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 502;
  }
}

export async function runChat(systemPrompt, userMessage) {
  let res;
  try {
    res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        stream: false,
        options: { temperature: 0.2 },
      }),
    });
  } catch (err) {
    throw new OllamaError(`Could not reach Ollama at ${OLLAMA_HOST}: ${err.message}`);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new OllamaError(
      `Ollama request failed (${res.status}). If the model isn't pulled yet, run: ` +
        `docker exec -it btl-ollama ollama pull ${OLLAMA_MODEL}. ${body}`
    );
  }

  const data = await res.json();
  return data.message.content;
}
