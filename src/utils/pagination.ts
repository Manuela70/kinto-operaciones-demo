export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
}

export function paginateRecords<T>(records: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return records.slice(start, start + pageSize);
}

export function getPaginationLabel(page: number, pageSize: number, total: number): string {
  if (total === 0) {
    return 'Mostrando del 0 al 0 de 0 registros';
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return `Mostrando del ${start} al ${end} de ${total} registros`;
}

export function getPageLabel(page: number, total: number, pageSize: number): string {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return `Página ${page} de ${totalPages}`;
}
