export interface EntradaInventario {
  id: number;
  jornada_id: number;
  num_gavetas: number;
  peso_total_kg: number;
  proveedor: string | null;
  hora: string;
  notas: string | null;
}

export interface ProcesamientoInventario {
  id: number;
  jornada_id: number;
  entrada_id: number | null;
  pechuga_kg: number;
  filete_kg: number;
  menudencia_unidades: number;
  recortes_kg: number;
  recortes_unidades: number;
  pollo_entero_kg: number;
  registrado_en: string;
}

export interface BalanceInventario {
  pechuga_disponible: number;
  filete_disponible: number;
  menudencia_disponible: number;
  recortes_disponible: number;
  pollo_entero_disponible: number;
  peso_entrada_total: number;
}
