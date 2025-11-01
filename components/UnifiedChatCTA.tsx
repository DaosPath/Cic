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
      {/* Card mejorado con diseño más limpio y fondo negro */}
      <div 
        className="relative overflow-hidden border border-[#2a2a2a] rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.6)] transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(15, 15, 15, 0.98) 50%, rgba(0, 0, 0, 1) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Efecto de brillo sutil con color de fase */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at 20% 50%, var(--brand) 0%, transparent 50%)',
            pointerEvents: 'none'
          }}
        />
        
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Contenido principal */}
            <div className="flex items-start gap-4 flex-1">
              {/* Icono mejorado con color de fase */}
              <div 
                className="p-3 rounded-xl flex-shrink-0 bg-brand-primary/20 backdrop-blur-sm"
                style={{
                  boxShadow: '0 4px 12px rgba(var(--brand-rgb), 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              
              {/* Texto */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-1" style={{ fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  Chatear con IA
                </h3>
                <p className="text-sm text-gray-400" style={{ fontWeight: 500, lineHeight: 1.5 }}>
                  {contextSubtitle}
                </p>
              </div>
            </div>
            
            {/* Botón mejorado con gradiente dorado/amarillo */}
            <button
              onClick={handleCTAClick}
              className="relative px-6 py-3 rounded-full font-semibold transition-all duration-200 min-h-[48px] flex items-center gap-2 group/btn flex-shrink-0 overflow-hidden"
              style={{ 
                fontWeight: 600,
                background: 'linear-gradient(135deg, #FFA500 0%, #FFD700 100%)',
                boxShadow: '0 4px 16px rgba(255, 165, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.2)',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 165, 0, 0.4), 0 4px 12px rgba(255, 215, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 165, 0, 0.3), 0 2px 8px rgba(255, 215, 0, 0.2)';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = '2px solid rgba(255, 215, 0, 0.6)';
                e.currentTarget.style.outlineOffset = '2px';
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = 'none';
              }}
            >
              {/* Efecto de brillo animado */}
              <div 
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.2) 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
              />
              
              <span className="relative z-10 font-bold" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.01em' }}>
                Iniciar Chat
              </span>
              <svg 
                className="relative z-10 w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ width: '18px', height: '18px', strokeWidth: 2.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
          
          {/* Context Badge mejorado con color de fase */}
          <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-400" style={{ fontWeight: 500 }}>
                Contexto:
              </span>
              <span className="text-brand-primary font-semibold" style={{ fontWeight: 600 }}>
                {contextTitle}
              </span>
            </div>
            
            {/* Métricas clave si existen */}
            {keyMetrics && (
              <div className="ml-auto flex items-center gap-3 text-xs">
                {keyMetrics.stress !== undefined && (
                  <span className="text-gray-400">
                    Estrés: <span className="text-white font-medium">{keyMetrics.stress}/10</span>
                  </span>
                )}
                {keyMetrics.sleep !== undefined && (
                  <span className="text-gray-400">
                    Sueño: <span className="text-white font-medium">{keyMetrics.sleep}h</span>
                  </span>
                )}
              </div>
            )}
          </div>
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

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};