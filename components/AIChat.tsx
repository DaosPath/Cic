import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../services/ai-chat-formatter.ts';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AIChat: React.FC<AIChatProps> = ({
  messages,
  onSendMessage,
  onBack,
  isLoading = false
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-base font-bold text-brand-text mt-4 mb-2" style={{ fontWeight: 700 }}>{line.slice(4)}</h3>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-bold text-brand-text mt-6 mb-3" style={{ fontWeight: 700 }}>{line.slice(3)}</h2>;
      }
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-xl font-bold text-brand-text mt-6 mb-4" style={{ fontWeight: 700 }}>{line.slice(2)}</h1>;
      }
      
      // Bold
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-semibold text-brand-text my-2" style={{ fontWeight: 600 }}>{line.slice(2, -2)}</p>;
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return <li key={i} className="text-sm text-brand-text ml-4 my-1">{line.slice(2)}</li>;
      }
      
      // Table rows
      if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim() === '---' || c.trim().startsWith('-'))) {
          return null; // Skip separator rows
        }
        return (
          <div key={i} className="flex gap-2 text-xs border-b border-brand-border py-2">
            {cells.map((cell, j) => (
              <div key={j} className={`flex-1 ${j === 0 ? 'font-semibold' : ''}`}>{cell.trim()}</div>
            ))}
          </div>
        );
      }
      
      // Horizontal rule
      if (line === '---') {
        return <hr key={i} className="border-brand-border my-4" />;
      }
      
      // Empty line
      if (!line.trim()) {
        return <div key={i} className="h-2" />;
      }
      
      // Regular paragraph
      return <p key={i} className="text-sm text-brand-text leading-relaxed my-2">{line}</p>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`${msg.role === 'user' ? 'flex justify-end' : ''}`}>
            <div className={`max-w-[85%] ${
              msg.role === 'user' 
                ? 'bg-brand-primary text-white rounded-xl p-4' 
                : 'bg-brand-surface-2 border border-brand-border rounded-xl p-5'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <div className="space-y-1">
                  {renderMarkdown(msg.content)}
                </div>
              )}
              <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/70' : 'text-brand-text-dim'}`}>
                {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-brand-surface-2 border border-brand-border rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre tus insights..."
          disabled={isLoading}
          className="flex-1 bg-brand-surface-2 border border-brand-border rounded-xl px-4 py-3 text-brand-text placeholder-brand-text-dim focus:outline-none focus:border-brand-primary transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-brand-primary text-white px-6 py-3 rounded-xl hover:bg-brand-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ fontWeight: 600 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Enviar
        </button>
      </form>
    </div>
  );
};
