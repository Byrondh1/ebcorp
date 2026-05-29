import { TipoProducto, UnidadProducto } from '@/constants/productos';

export type MetodoPago = 'efectivo' | 'transferencia' | 'credito';
export type EstadoVenta = 'pagada' | 'credito' | 'parcial';

export interface VentaItem {
  id?: number;
  venta_id?: number;
  tipo_producto: TipoProducto;
  cantidad: number;
  unidad: UnidadProducto;
  precio_unitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  jornada_id: number;
  cliente_id: number;
  vendedor_id: number;
  metodo_pago: MetodoPago;
  subtotal: number;
  monto_pagado: number;
  saldo_pendiente: number;
  estado: EstadoVenta;
  notas: string | null;
  registrada_en: string;
  cliente_nombre?: string;
  items?: VentaItem[];
}

export interface NuevaVentaInput {
  jornada_id: number;
  cliente_id: number;
  vendedor_id: number;
  metodo_pago: MetodoPago;
  monto_pagado: number;
  notas?: string;
  items: Omit<VentaItem, 'id' | 'venta_id'>[];
}
