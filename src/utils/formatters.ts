import { MESES } from '@/constants/productos';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatKg(kg: number): string {
  return `${kg.toFixed(2)} kg`;
}

export function formatUnidades(u: number): string {
  return `${u} und`;
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate + 'T00:00:00');
  const day = date.getDate().toString().padStart(2, '0');
  const month = MESES[date.getMonth()].substring(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatMonthYear(month: number, year: number): string {
  return `${MESES[month - 1]} ${year}`;
}

export function extractMonthYear(isoDate: string): { month: number; year: number } {
  const date = new Date(isoDate + 'T00:00:00');
  return { month: date.getMonth() + 1, year: date.getFullYear() };
}
