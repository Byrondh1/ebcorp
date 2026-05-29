import { TipoProducto } from '@/constants/productos';

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string | null;
  direccion: string | null;
  vendedor_id: number | null;
  activo: number;
  notas: string | null;
  creado_en: string;
}

export interface PrecioCliente {
  id: number;
  cliente_id: number;
  tipo_producto: TipoProducto;
  precio_kg: number;
  vigente_desde: string;
}

export interface ClienteConSaldo extends Cliente {
  saldo_pendiente: number;
}
