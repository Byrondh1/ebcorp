export type EstadoJornada = 'abierta' | 'cerrada';

export interface Jornada {
  id: number;
  fecha: string;
  estado: EstadoJornada;
  abierta_por: number;
  cerrada_por: number | null;
  hora_apertura: string;
  hora_cierre: string | null;
  notas: string | null;
  creado_en: string;
}
