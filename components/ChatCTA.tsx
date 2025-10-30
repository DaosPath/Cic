import React from 'react';

interface ChatCTAProps {
  onStartChat: () => void;
  contextTitle: string;
  contextSubtitle?: string;
  className?: string;
}

export const ChatCTA: React.FC<ChatCTAProps> = ({ 
  onStartChat, 
  contextTitle, 
  contextSubtitle,
  className = '' 
}) => {
  return (
    <div className={`bg-gradient-to-br from-brand-primary/10 via-brand-accent/10 to-brand-primary/10 border border-brand-primary/30 rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-all duration-300 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-primary/20 backdrop-blur-sm">
            <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-brand-text mb-1" style={{ fontWeight: 700, lineHeight: 1.3 }}>
              Chatear con IA
            </h3>
            <p className="text-sm text-brand-text-dim" style={{ fontWeight: 500, lineHeight: 1.45 }}>
              {contextSubtitle || `Analiza y pregunta sobre ${contextTitle}`}
            </p>
          </div>
        </div>
        
        <button
          onClick={onStartChat}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:scale-105 active:scale-100 transition-all duration-200"
          style={{ fontWeight: 600 }}
        >
          <span>Iniciar Chat</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
      
      {/* Context Badge */}
      <div className="mt-4 pt-4 border-t border-brand-border/50 flex items-center gap-2 text-xs text-brand-text-dim">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span style={{ fontWeight: 500 }}>
          Contexto: <span className="text-brand-primary font-semibold">{contextTitle}</span>
        </span>
      </div>
    </div>
  );
};
