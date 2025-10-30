import React, { useState } from 'react';
import { ChatModal } from './ChatModal.tsx';

interface UnifiedChatCTAProps {
  onStartChat?: () => void;
  contextTitle: string;
  contextSubtitle: string;
  contextInfo: {
    date: string;
    cyclePhase?: string;
    cycleDay?: number;
  };
  keyMetrics?: {
    stress?: number;
    sleep?: number;
    mood?: number;
    energy?: string;
  };
  mode?: 'simple' | 'ai';
}

export const UnifiedChatCTA: React.FC<UnifiedChatCTAProps> = ({
  onStartChat,
  contextTitle,
  contextSubtitle,
  contextInfo,
  keyMetrics,
  mode = 'simple'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStartChatWithOptions = () => {
    setIsModalOpen(false);
    onStartChat?.();
  };

  // Solo mostrar en modo IA
  if (!onStartChat || mode !== 'ai') return null;

  return (
    <>
      {/* Card con gradiente de fondo */}
      <div className="bg-gradient-to-br from-brand-primary/10 via-brand-accent/10 to-brand-primary/10 border border-brand-primary/30 rounded-[18px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.25)] transition-all duration-300">
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
                {contextSubtitle}
              </p>
            </div>
          </div>
          
          {/* Botón unificado con paleta oscura */}
          <button
            onClick={handleCTAClick}
            className="relative px-6 py-3 bg-black/60 hover:bg-black/70 backdrop-blur-sm text-white rounded-full font-medium transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center gap-2 group/btn border border-black/30"
            style={{ 
              fontWeight: 500,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.4), 0 6px 20px rgba(0,0,0,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = '2px solid rgba(0,0,0,0.6)';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = 'none';
            }}
          >
            <span className="text-white font-semibold" style={{ fontSize: '14px', fontWeight: 600 }}>
              Iniciar Chat
            </span>
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ width: '16px', height: '16px' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

      {/* Modal unificado */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onStartChat={handleStartChatWithOptions}
        contextInfo={contextInfo}
        keyMetrics={keyMetrics}
      />
    </>
  );
};