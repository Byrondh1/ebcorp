export interface PagoCredito {
  id: number;
  cliente_id: number;
  venta_id: number | null;
  monto: number;
  metodo: 'efectivo' | 'transferencia';
  registrado_por: number;
  jornada_id: number;
  notas: string | null;
  registrado_en: string;
}

export interface ResumenCredito {
  cliente_id: number;
  cliente_nombre: string;
  saldo_total: number;
  ultima_compra: string | null;
}
