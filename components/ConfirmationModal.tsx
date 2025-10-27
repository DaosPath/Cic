import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div 
        className="bg-brand-surface rounded-xl shadow-2xl p-6 w-full max-w-sm m-4 text-left transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 id="modal-title" className="text-xl font-bold text-brand-text mb-4">
          {title}
        </h2>
        <p className="text-brand-text-dim mb-6">
          {children}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-brand-secondary hover:bg-brand-secondary/80 text-brand-text font-semibold transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-brand-background font-bold transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      `}</style>
    </div>
  );
};
