export type TipoProducto = 'pechuga' | 'filete' | 'menudencia' | 'recortes' | 'pollo_entero';

export type UnidadProducto = 'kg' | 'unidades';

export interface InfoProducto {
  id: TipoProducto;
  label: string;
  unidad: UnidadProducto;
  icono: string;
  color: string;
}

export const PRODUCTOS: Record<TipoProducto, InfoProducto> = {
  pechuga: { id: 'pechuga', label: 'Pechuga', unidad: 'kg', icono: 'nutrition', color: '#F59E0B' },
  filete: { id: 'filete', label: 'Filete', unidad: 'kg', icono: 'restaurant', color: '#10B981' },
  menudencia: { id: 'menudencia', label: 'Menudencia', unidad: 'unidades', icono: 'layers', color: '#8B5CF6' },
  recortes: { id: 'recortes', label: 'Recortes Bandeja', unidad: 'kg', icono: 'cut', color: '#EC4899' },
  pollo_entero: { id: 'pollo_entero', label: 'Pollo Entero', unidad: 'kg', icono: 'egg', color: '#EF4444' },
};

export const LISTA_PRODUCTOS: InfoProducto[] = Object.values(PRODUCTOS);

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
