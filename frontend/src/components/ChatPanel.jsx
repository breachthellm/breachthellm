import { useEffect, useRef, useState } from 'react';
import { postAttempt, ApiError } from '../api.js';
import TraceModal from './TraceModal.jsx';

let nextMessageId = 1;

function ChatPanel({ packId, levelId, solved, systemPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [viewingTraceId, setViewingTraceId] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages, sending]);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { id: nextMessageId++, role: 'user', text: trimmed }]);
    setInput('');
    setSending(true);

    try {
      const data = await postAttempt(packId, levelId, trimmed);
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId++, role: 'assistant', text: data.response, trace: data.trace },
      ]);
    } catch (err) {
      const text = err instanceof ApiError ? err.message : 'Something went wrong.';
      setMessages((prev) => [...prev, { id: nextMessageId++, role: 'error', text }]);
    } finally {
      setSending(false);
    }
  }

  const viewingTrace = messages.find((message) => message.id === viewingTraceId)?.trace;

  return (
    <div className="chat-panel">
      <div className="chat-messages" ref={listRef}>
        {messages.length === 0 && (
          <p className="chat-empty">No messages yet. Start the conversation below.</p>
        )}

        {messages.map((message) => {
          if (message.role === 'error') {
            return (
              <p key={message.id} className="error-text chat-message-error">
                {message.text}
              </p>
            );
          }

          const isUser = message.role === 'user';

          return (
            <div
              key={message.id}
              className={
                isUser
                  ? 'chat-message-group chat-message-group-user'
                  : 'chat-message-group chat-message-group-assistant'
              }
            >
              <div className={isUser ? 'chat-message chat-message-user' : 'chat-message chat-message-assistant'}>
                {!isUser && <p className="chat-message-label">Veyra Shield</p>}
                <p className="chat-message-text">{message.text}</p>
              </div>

              {!isUser && message.trace && (
                <button
                  type="button"
                  className="trace-trigger"
                  onClick={() => setViewingTraceId(message.id)}
                >
                  View Trace
                </button>
              )}
            </div>
          );
        })}

        {sending && (
          <div className="chat-typing">
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-dot" />
            <span className="chat-typing-caption">
              Veyra Shield is reviewing your message, this can take a few seconds on a
              local model.
            </span>
          </div>
        )}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message to Veyra Shield..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={sending || !input.trim()}
        >
          Send
        </button>
      </form>

      {viewingTrace && (
        <TraceModal
          trace={viewingTrace}
          solved={solved}
          systemPrompt={systemPrompt}
          onClose={() => setViewingTraceId(null)}
        />
      )}
    </div>
  );
}

export default ChatPanel;
