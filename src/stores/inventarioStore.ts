import { create } from 'zustand';
import { BalanceInventario } from '@/types/inventario';
import { getBalanceInventario } from '@/db/queries/inventario';

interface InventarioState {
  balance: BalanceInventario | null;
  cargando: boolean;
  refrescar: (jornadaId: number) => Promise<void>;
  limpiar: () => void;
}

export const useInventarioStore = create<InventarioState>((set) => ({
  balance: null,
  cargando: false,

  refrescar: async (jornadaId) => {
    set({ cargando: true });
    try {
      const balance = await getBalanceInventario(jornadaId);
      set({ balance });
    } finally {
      set({ cargando: false });
    }
  },

  limpiar: () => set({ balance: null }),
}));
