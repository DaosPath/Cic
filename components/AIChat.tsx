import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { ChatMessage } from '../services/ai-chat-formatter.ts';
import { useTranslation } from '../hooks/useTranslation.ts';

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  contextInfo?: {
    timeRange?: string;
    cyclePhase?: string;
    cycleDay?: number;
  };
}

export const AIChat: React.FC<AIChatProps> = ({
  messages,
  onSendMessage,
  onBack,
  isLoading = false,
  contextInfo
}) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 200);
      
      // Compact header on scroll down
      if (scrollTop > lastScrollTop.current && scrollTop > 50) {
        setIsHeaderCompact(true);
      } else if (scrollTop < lastScrollTop.current && scrollTop < 30) {
        setIsHeaderCompact(false);
      }
      lastScrollTop.current = scrollTop;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      const message = input.trim();
      setInput('');
      await onSendMessage(message);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const quickQuestions = useMemo(
    () => [
      t('chatQuickCycle'),
      t('chatQuickSleep'),
      t('chatQuickSymptoms'),
      t('chatQuickRecommendations')
    ],
    [t]
  );

  // Group consecutive messages from same sender
  const groupedMessages = messages.reduce((groups: Array<{ role: string; messages: ChatMessage[]; timestamp: Date }>, msg, index) => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.role === msg.role && index > 0) {
      // Check if messages are within 2 minutes of each other
      const timeDiff = msg.timestamp.getTime() - lastGroup.timestamp.getTime();
      if (timeDiff < 120000) { // 2 minutes
        lastGroup.messages.push(msg);
        lastGroup.timestamp = msg.timestamp;
        return groups;
      }
    }
    groups.push({ role: msg.role, messages: [msg], timestamp: msg.timestamp });
    return groups;
  }, []);

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const displayLines = lines;
    
    return displayLines.map((line, i) => {
      // Headers
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-[15px] sm:text-base font-semibold text-[var(--text)] mt-3 mb-1.5" style={{ fontWeight: 600 }}>
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={i} className="text-base sm:text-lg font-semibold text-[var(--text)] mt-4 mb-2" style={{ fontWeight: 600 }}>
            {line.slice(3)}
          </h2>
        );
      }
      
      // Bold inline text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="text-[15px] sm:text-[16px] text-[var(--text)] my-1.5" style={{ lineHeight: 1.6 }}>
            {parts.map((part, j) => 
              j % 2 === 1 ? <strong key={j} style={{ fontWeight: 600 }}>{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="text-[15px] sm:text-[16px] text-[var(--text)] ml-4 my-1 list-disc" style={{ lineHeight: 1.6 }}>
            {line.slice(2)}
          </li>
        );
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={i} className="text-[15px] sm:text-[16px] text-[var(--text)] ml-4 my-1 list-decimal" style={{ lineHeight: 1.6 }}>
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      
      // Horizontal rule
      if (line === '---' || line === '___') {
        return <hr key={i} className="border-[var(--border)] my-3" />;
      }
      
      // Empty line
      if (!line.trim()) {
        return <div key={i} className="h-1.5" />;
      }
      
      // Regular paragraph
      return (
        <p key={i} className="text-[15px] sm:text-[16px] text-[var(--text)] my-1.5" style={{ lineHeight: 1.6 }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-full safe-area-inset">
      {/* Header - Compact on scroll */}
      <div 
        className={`sticky top-0 z-20 bg-[var(--bg)] border-b border-[var(--border)] transition-all duration-200 ${
          isHeaderCompact ? 'shadow-sm' : ''
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className={`px-4 transition-all duration-200 ${isHeaderCompact ? 'py-2' : 'py-3 sm:py-4'}`}>
          <div className="flex items-center justify-between gap-3">
            <h2 
              className={`font-semibold text-[var(--text)] transition-all duration-200 ${
                isHeaderCompact ? 'text-base' : 'text-lg sm:text-xl'
              }`} 
              style={{ fontWeight: 600 }}
            >
              {t('chatWithAI')}
            </h2>
            <button
              onClick={onBack}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--surface)] hover:bg-[var(--surface-2)] active:scale-95 border border-[var(--border)] rounded-full text-xs sm:text-sm font-medium text-[var(--text)] transition-all duration-150 hover:shadow-sm min-h-[44px] flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-1"
              style={{ fontWeight: 500 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden xs:inline">{t('back')}</span>
            </button>
          </div>
        </div>

        {/* Context Info - Scrollable chips */}
        {contextInfo && !isHeaderCompact && (
          <div 
            className="px-4 pb-3 overflow-x-auto scrollbar-hide"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex gap-2" style={{ width: 'max-content' }}>
              {contextInfo.timeRange && (
                <div className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                  <span>📅</span>
                  <span>{contextInfo.timeRange}</span>
                </div>
              )}
              {contextInfo.cyclePhase && (
                <div className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] whitespace-nowrap flex items-center gap-1.5 flex-shrink-0">
                  <span>🌙</span>
                  <span>{contextInfo.cyclePhase}</span>
                </div>
              )}
              {contextInfo.cycleDay && (
                <div className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] whitespace-nowrap flex-shrink-0">
                  Día {contextInfo.cycleDay}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="px-4 py-4 space-y-4">
          {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className={`flex flex-col ${group.role === 'user' ? 'items-end' : 'items-start'} gap-2 animate-fadeIn`}>
              {group.messages.map((msg, msgIndex) => (
                <div 
                  key={msgIndex}
                  className={`w-[90%] sm:w-[88%] max-w-[72ch] ${
                    group.role === 'user' 
                      ? 'bg-[var(--surface)] text-[var(--text)]' 
                      : 'bg-[var(--surface-2)] text-[var(--text)]'
                  } rounded-[18px] shadow-sm transition-all duration-150 active:scale-[0.98]`}
                  style={{
                    padding: '14px 16px',
                  }}
                >
                  {group.role === 'user' ? (
                    <p className="text-[15px] sm:text-[16px] whitespace-pre-wrap" style={{ lineHeight: 1.6 }}>
                      {msg.content}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {renderMarkdown(msg.content)}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Timestamp at the end of group */}
              <div className="text-xs text-[var(--text-2)] opacity-60 px-2">
                {group.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="w-[90%] sm:w-[88%] max-w-[72ch] bg-[var(--surface-2)] rounded-[18px] shadow-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[var(--brand)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[var(--brand)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[var(--brand)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-[var(--text-2)]">Escribiendo</span>
                  <span className="text-sm text-[var(--text-2)] animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-[180px] right-4 sm:right-6 bg-[var(--surface)] hover:bg-[var(--surface-2)] active:scale-95 border border-[var(--border)] rounded-full p-3 shadow-lg transition-all duration-150 z-20 min-h-[48px] min-w-[48px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
          aria-label="Ir al final"
        >
          <svg className="w-5 h-5 text-[var(--text)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Composer - Sticky with safe area */}
      <div 
        className="sticky bottom-0 bg-[var(--bg)] border-t border-[var(--border)] shadow-lg z-30"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom), 80px)',
        }}
      >
        <div className="px-4 pt-3 pb-2">
          {/* Quick questions - Horizontal scroll */}
          <div 
            className="overflow-x-auto scrollbar-hide mb-3 -mx-4 px-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
              {quickQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(question)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-2)] active:scale-95 border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-2)] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-1 flex-shrink-0"
                  style={{ fontWeight: 500 }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta sobre tus datos..."
                disabled={isLoading}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-[18px] px-4 py-3 text-[15px] text-[var(--text)] placeholder-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-all duration-150 disabled:opacity-50 min-h-[48px]"
                style={{ lineHeight: 1.5 }}
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 active:scale-95 text-white p-3 rounded-[18px] transition-all duration-150 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm min-h-[48px] min-w-[48px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2"
              style={{ fontWeight: 600 }}
              aria-label="Enviar mensaje"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 180ms ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .safe-area-inset {
          height: 100vh;
          height: 100dvh;
        }

        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};
