export type TipoMovimiento = 'ingreso' | 'egreso' | 'ajuste';
export type MetodoMovimiento = 'efectivo' | 'transferencia';

export interface CajaMovimiento {
  id: number;
  jornada_id: number;
  tipo: TipoMovimiento;
  metodo: MetodoMovimiento;
  monto: number;
  concepto: string;
  referencia_id: number | null;
  referencia_tipo: string | null;
  registrado_por: number;
  registrado_en: string;
}

export interface TotalesCaja {
  efectivo_total: number;
  transferencias_total: number;
  total_general: number;
}

export interface CierreCaja {
  id: number;
  jornada_id: number;
  efectivo_esperado: number;
  efectivo_contado: number;
  transferencias_total: number;
  diferencia: number;
  cerrado_por: number;
  notas: string | null;
  cerrado_en: string;
}
