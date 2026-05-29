import { TipoProducto, UnidadProducto } from '@/constants/productos';

export interface Despacho {
  id: number;
  jornada_id: number;
  vendedor_id: number;
  tipo_producto: TipoProducto;
  cantidad: number;
  unidad: UnidadProducto;
  confirmado: number;
  confirmado_en: string | null;
  creado_en: string;
  vendedor_nombre?: string;
}

export interface DevolucionDespacho {
  id: number;
  despacho_id: number;
  jornada_id: number;
  cantidad: number;
  motivo: string | null;
  registrado_en: string;
}
