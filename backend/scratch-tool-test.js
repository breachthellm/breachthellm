const OLLAMA_HOST = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3.1:8b';

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a city',
      parameters: {
        type: 'object',
        properties: { city: { type: 'string' } },
        required: ['city'],
      },
    },
  },
];

async function run(n) {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
      tools,
      stream: false,
    }),
  });

  const data = await res.json();
  console.log(`\n=== RUN ${n} ===`);
  console.log(JSON.stringify(data, null, 2));
  console.log(`--- message.tool_calls present: ${data.message?.tool_calls ? 'YES' : 'NO'} ---`);
}

async function main() {
  for (let i = 1; i <= 3; i++) {
    await run(i);
  }
}

main();
