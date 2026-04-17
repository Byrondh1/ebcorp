import { create } from 'zustand';
import { Jornada } from '@/types/jornada';
import { getJornadaHoy, abrirJornada, cerrarJornada } from '@/db/queries/jornadas';

interface JornadaState {
  jornadaActual: Jornada | null;
  cargando: boolean;
  cargarJornadaHoy: () => Promise<void>;
  abrirJornada: (usuarioId: number) => Promise<void>;
  cerrarJornada: (usuarioId: number) => Promise<void>;
  limpiar: () => void;
}

export const useJornadaStore = create<JornadaState>((set, get) => ({
  jornadaActual: null,
  cargando: false,

  cargarJornadaHoy: async () => {
    set({ cargando: true });
    try {
      const jornada = await getJornadaHoy();
      set({ jornadaActual: jornada });
    } finally {
      set({ cargando: false });
    }
  },

  abrirJornada: async (usuarioId) => {
    set({ cargando: true });
    try {
      const jornada = await abrirJornada(usuarioId);
      set({ jornadaActual: jornada });
    } finally {
      set({ cargando: false });
    }
  },

  cerrarJornada: async (usuarioId) => {
    const { jornadaActual } = get();
    if (!jornadaActual) return;
    set({ cargando: true });
    try {
      await cerrarJornada(jornadaActual.id, usuarioId);
      set({ jornadaActual: { ...jornadaActual, estado: 'cerrada' } });
    } finally {
      set({ cargando: false });
    }
  },

  limpiar: () => set({ jornadaActual: null }),
}));
