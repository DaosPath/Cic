import React, { useState, useEffect } from 'react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (options: ChatOptions) => void;
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

interface ChatOptions {
  includePredictions: boolean;
  quickQuestion?: string;
}

const quickQuestions = [
  "¿Cómo me siento hoy comparado con ayer?",
  "¿Qué patrones veo en mi ciclo?",
  "¿Hay algo que deba preocuparme?",
  "¿Cómo puedo mejorar mi bienestar?",
  "¿Qué me recomiendas para hoy?"
];

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
  contextInfo,
  keyMetrics
}) => {
  const [includePredictions, setIncludePredictions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>();

  // Cerrar con Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleStartChat = () => {
    onStartChat({
      includePredictions,
      quickQuestion: selectedQuestion
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 200ms ease-out'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="bg-[var(--surface)] rounded-[20px] border border-[var(--border)] w-full max-w-md shadow-2xl"
        style={{
          animation: 'modalSlideIn 200ms ease-out',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.2)'
        }}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]" style={{ fontWeight: 600 }}>
              Iniciar chat con contexto de hoy
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Cerrar modal"
            >
              <svg className="w-5 h-5 text-[var(--text-2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-5">
          {/* Contexto */}
          <div className="bg-[var(--surface-2)] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-[var(--text)]" style={{ fontWeight: 500 }}>
                {contextInfo.date}
              </span>
              {contextInfo.cyclePhase && (
                <>
                  <span className="text-[var(--text-2)]">•</span>
                  <span className="text-sm text-[var(--text-2)]">
                    {contextInfo.cyclePhase}
                  </span>
                </>
              )}
            </div>
            
            {/* Mini resumen de KPIs */}
            {keyMetrics && (
              <div className="flex items-center gap-4 text-xs text-[var(--text-2)]">
                {keyMetrics.stress && (
                  <span>Estrés: {keyMetrics.stress}/10</span>
                )}
                {keyMetrics.sleep && (
                  <span>Sueño: {keyMetrics.sleep}h</span>
                )}
                {keyMetrics.mood && (
                  <span>Ánimo: {keyMetrics.mood}/10</span>
                )}
              </div>
            )}
          </div>

          {/* Preguntas rápidas */}
          <div>
            <h3 className="text-sm font-medium text-[var(--text)] mb-3" style={{ fontWeight: 500 }}>
              Preguntas rápidas
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedQuestion(selectedQuestion === question ? undefined : question)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    selectedQuestion === question
                      ? 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20'
                      : 'bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                  }`}
                  style={{ lineHeight: 1.4 }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle predicciones */}
          <div className="flex items-center justify-between p-3 bg-[var(--surface-2)] rounded-lg">
            <div>
              <span className="text-sm font-medium text-[var(--text)]" style={{ fontWeight: 500 }}>
                Incluir predicciones
              </span>
              <p className="text-xs text-[var(--text-2)]" style={{ opacity: 0.8 }}>
                Análisis predictivo basado en patrones
              </p>
            </div>
            <button
              onClick={() => setIncludePredictions(!includePredictions)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                includePredictions ? 'bg-[var(--brand)]' : 'bg-[var(--border)]'
              }`}
              aria-label="Toggle predicciones"
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  includePredictions ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[var(--border)] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-all duration-200 min-h-[44px]"
            style={{ fontWeight: 500 }}
          >
            Cancelar
          </button>
          <button
            onClick={handleStartChat}
            className="flex-1 px-4 py-2.5 bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white text-sm font-medium rounded-lg transition-all duration-200 min-h-[44px] shadow-sm hover:shadow-md"
            style={{ fontWeight: 500 }}
          >
            Iniciar chat
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: scale(0.98) translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};