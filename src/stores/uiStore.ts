import { create } from 'zustand';

interface Toast {
  id: string;
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
}

interface UIState {
  toasts: Toast[];
  mostrarToast: (mensaje: string, tipo?: Toast['tipo']) => void;
  ocultarToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],

  mostrarToast: (mensaje, tipo = 'info') => {
    const id = Date.now().toString();
    set((s) => ({ toasts: [...s.toasts, { id, mensaje, tipo }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  ocultarToast: (id) => {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
