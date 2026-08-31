import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';

/* ===== Rate Limiting (client-side, complementary) ===== */
const RATE_LIMIT = {
  MAX_MESSAGES_PER_SESSION: 15,
  COOLDOWN_MS: 3000,
  MAX_INPUT_LENGTH: 300,
};

/* ===== Simple Markdown Renderer ===== */
function renderText(text: string): React.ReactNode[] {
  return text.split('\n').map((line, li) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    const formatted = parts.map((part, pi) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={pi} style={{ color: '#e5e5e5', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={pi} style={{
            background: 'rgba(255,255,255,0.08)',
            padding: '1px 5px',
            borderRadius: 4,
            fontSize: '0.85em',
            fontFamily: 'monospace',
          }}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
    return (
      <React.Fragment key={li}>
        {li > 0 && <br />}
        {formatted}
      </React.Fragment>
    );
  });
}

/* ===== Chatbot Component ===== */
export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: 'Hola, soy el asistente de Matías. Preguntame sobre sus proyectos, habilidades o experiencia.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [lastSentAt, setLastSentAt] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setShowTooltip(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // --- Client-side Rate Limiting ---
    if (messageCount >= RATE_LIMIT.MAX_MESSAGES_PER_SESSION) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Alcanzaste el límite de consultas por sesión. Refrescá la página para empezar de nuevo.' },
      ]);
      return;
    }

    const now = Date.now();
    if (now - lastSentAt < RATE_LIMIT.COOLDOWN_MS) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Esperá unos segundos antes de enviar otro mensaje.' },
      ]);
      return;
    }

    const userMessage = input.trim().slice(0, RATE_LIMIT.MAX_INPUT_LENGTH);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setMessageCount((c) => c + 1);
    setLastSentAt(now);

    try {
      // Build history (only user messages that came after the welcome)
      const chatHistory = messages.slice(-4);
      const firstUserIdx = chatHistory.findIndex((m) => m.role === 'user');
      const validHistory = firstUserIdx >= 0 ? chatHistory.slice(firstUserIdx) : [];

      // Call our secure backend API (API key stays server-side)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: validHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev,
          { role: 'model', text: 'Demasiadas consultas. Intentá de nuevo más tarde.' },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      // Handle SSE streaming response
      setMessages((prev) => [...prev, { role: 'model', text: '' }]);
      setIsLoading(false);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { role: 'model', text: fullText };
                    return updated;
                  });
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      }

      // If no streaming text was received, show error
      if (!fullText) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: 'No se recibió respuesta. Intentá de nuevo.' };
          return updated;
        });
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Error de conexión. Intentá de nuevo en unos segundos.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const remainingMessages = RATE_LIMIT.MAX_MESSAGES_PER_SESSION - messageCount;

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <>
          {showTooltip && (
            <div 
              className="fixed bottom-[88px] right-6 z-50 px-4 py-2.5 bg-zinc-800/90 backdrop-blur-md text-zinc-200 text-sm rounded-xl shadow-2xl whitespace-nowrap border border-white/10 cursor-pointer"
              style={{ animation: 'fadeUp 0.4s ease-out' }}
              onClick={() => setIsOpen(true)}
            >
              ¡Hola! Preguntame sobre la experiencia de Matías.
              {/* Arrow down */}
              <div 
                className="absolute -bottom-1.5 right-6 w-3 h-3 bg-zinc-800/90 border-r border-b border-white/10 rotate-45 backdrop-blur-md"
              />
            </div>
          )}
          <button onClick={() => setIsOpen(true)} className="chat-trigger" aria-label="Abrir chat">
            <MessageSquare className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="chat-panel fixed bottom-6 right-6 z-50 flex flex-col"
          style={{
            width: 'min(380px, calc(100vw - 48px))',
            height: 'min(520px, calc(100vh - 120px))',
            animation: 'fadeUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-zinc-300" />
              <span className="text-sm font-semibold text-zinc-200">Asistente IA</span>
              <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">RAG</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={msg.role === 'user' ? 'msg-user max-w-[85%]' : 'msg-bot max-w-[85%]'}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="msg-bot max-w-[85%] w-full flex flex-col gap-2 p-3">
                  <div className="h-2.5 bg-zinc-700/50 rounded-full animate-pulse w-3/4"></div>
                  <div className="h-2.5 bg-zinc-700/50 rounded-full animate-pulse w-full"></div>
                  <div className="h-2.5 bg-zinc-700/50 rounded-full animate-pulse w-5/6"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Rate limit indicator + Input */}
          <div className="px-4 pb-4 pt-2">
            {messageCount > 0 && (
              <div className="text-[10px] text-zinc-600 text-right mb-1.5">
                {remainingMessages > 0
                  ? `${remainingMessages} consulta${remainingMessages !== 1 ? 's' : ''} restante${remainingMessages !== 1 ? 's' : ''}`
                  : 'Sin consultas restantes'}
              </div>
            )}
            <form onSubmit={handleSend} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, RATE_LIMIT.MAX_INPUT_LENGTH))}
                placeholder="Preguntá algo..."
                className="chat-input"
                disabled={remainingMessages <= 0}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || remainingMessages <= 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
