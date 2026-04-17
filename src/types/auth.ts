export type RolUsuario = 'admin' | 'vendedor';

export interface Usuario {
  id: number;
  nombre: string;
  rol: RolUsuario;
  activo: number;
  creado_en: string;
}
