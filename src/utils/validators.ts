export function esNumeroValido(valor: string): boolean {
  const n = parseFloat(valor.replace(',', '.'));
  return !isNaN(n) && n > 0;
}

export function parsearNumero(valor: string): number {
  return parseFloat(valor.replace(',', '.')) || 0;
}

export function esPINValido(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}
