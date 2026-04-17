import { create } from 'zustand';
import { Usuario } from '@/types/auth';
import { verificarPin } from '@/db/queries/usuarios';

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  error: string | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  cargando: false,
  error: null,

  login: async (pin: string) => {
    set({ cargando: true, error: null });
    try {
      const usuario = await verificarPin(pin);
      if (usuario) {
        set({ usuario, cargando: false });
        return true;
      } else {
        set({ error: 'PIN incorrecto', cargando: false });
        return false;
      }
    } catch (e) {
      set({ error: 'Error al verificar PIN', cargando: false });
      return false;
    }
  },

  logout: () => {
    set({ usuario: null, error: null });
  },
}));
