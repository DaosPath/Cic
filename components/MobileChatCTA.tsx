import React, { useState } from 'react';
import { ChatModal } from './ChatModal.tsx';

interface MobileChatCTAProps {
  onStartChat?: () => void;
  isAIMode?: boolean;
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
}

export const MobileChatCTA: React.FC<MobileChatCTAProps> = ({
  onStartChat,
  isAIMode = false,
  contextInfo,
  keyMetrics
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCTAClick = () => {
    if (onStartChat) {
      setIsModalOpen(true);
    } else {
      alert('Chat function not available');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleStartChatWithOptions = () => {
    setIsModalOpen(false);
    onStartChat?.();
  };

  // Solo mostrar en modo IA
  if (!isAIMode || !onStartChat) return null;

  return (
    <>
      {/* Barra sticky superior al menú para mobile */}
      <div className="md:hidden fixed left-0 right-0 z-[9999] p-4 bg-white/98 backdrop-blur-lg border-t border-gray-200 shadow-lg" style={{ bottom: '80px' }}>
        <button
          onClick={handleCTAClick}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full py-4 px-6 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 min-h-[56px] relative overflow-hidden group"
          style={{ 
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {/* Textura sutil */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Gloss sutil */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)'
            }}
          />

          <div className="relative flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span>Chatear con IA</span>
            <svg 
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </button>
      </div>

      {/* Espaciador para evitar que el contenido se oculte detrás de la barra y el menú */}
      <div className="md:hidden h-40" />

      {/* Modal compartido */}
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