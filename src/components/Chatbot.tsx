import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { resumeChunks, systemPrompt } from '../data/chunks';
import { Send, X, MessageSquare } from 'lucide-react';
import Fuse from 'fuse.js';

/* ===== Lexical Search Engine ===== */
const fuse = new Fuse(resumeChunks, {
  keys: ['content'],
  includeScore: true,
  threshold: 0.6,
});

/* ===== Simple Markdown Renderer (sin dependencias externas) ===== */
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Instanciar el modelo una sola vez
  const openai = React.useMemo(() => {
    const apiKey = import.meta.env.VITE_NVIDIA_API_KEY;
    if (!apiKey) {
      console.error('VITE_NVIDIA_API_KEY no está definida en .env');
      return null;
    }
    return new OpenAI({
      apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
      dangerouslyAllowBrowser: true,
    });
  }, []);

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

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!openai) {
        setMessages((prev) => [...prev, { role: 'model', text: 'Error: Cliente de IA no configurado.' }]);
        setIsLoading(false);
        return;
      }

      // RAG: Lexical Search
      const searchResults = fuse.search(userMessage);
      const topChunks = searchResults.slice(0, 3).map((r) => r.item.content);
      const contextText =
        topChunks.length > 0
          ? topChunks.join('\n\n')
          : 'No hay información específica. Sugerí contactar a Matías directamente.';

      // Mapear historial de chat al formato de OpenAI
      const formattedHistory: any[] = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      // Agregar mensaje de sistema con el contexto inyectado
      const systemMessage = {
        role: 'system',
        content: `${systemPrompt}\n\nContexto relevante:\n${contextText}`,
      };

      // Streaming con el nuevo SDK
      const payload: any = {
        model: 'deepseek-ai/deepseek-v4-pro',
        messages: [systemMessage, ...formattedHistory, { role: 'user', content: userMessage }],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 4000,
        stream: true,
        chat_template_kwargs: { thinking: false },
      };
      const stream = await openai.chat.completions.create(payload) as any;

      setMessages((prev) => [...prev, { role: 'model', text: '' }]);
      setIsLoading(false);

      let fullText = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        fullText += delta;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: fullText };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'model', text: 'Error de conexión. Verificá tu API Key y tu conexión a internet.' }]);
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Input */}
          <div className="px-4 pb-4 pt-2">
            <form onSubmit={handleSend} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Preguntá algo..."
                className="chat-input"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
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
