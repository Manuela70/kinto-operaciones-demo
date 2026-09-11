import { describe, it, expect } from 'vitest';
import { paginateRecords, getPaginationLabel, getPageLabel } from './pagination';

describe('paginateRecords', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns the first page of records with default page size 10', () => {
    const result = paginateRecords(items, 1, 10);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns the second page of records', () => {
    const result = paginateRecords(items, 2, 10);
    expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  });

  it('returns a partial last page', () => {
    const result = paginateRecords(items, 3, 10);
    expect(result).toEqual([21, 22, 23, 24, 25]);
  });

  it('returns an empty array for a page beyond the data', () => {
    const result = paginateRecords(items, 4, 10);
    expect(result).toEqual([]);
  });

  it('returns an empty array for empty input', () => {
    const result = paginateRecords([], 1, 10);
    expect(result).toEqual([]);
  });

  it('works with custom page sizes', () => {
    const result = paginateRecords(items, 1, 5);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('getPaginationLabel', () => {
  it('returns correct label for the first page', () => {
    expect(getPaginationLabel(1, 10, 25)).toBe('Mostrando del 1 al 10 de 25 registros');
  });

  it('returns correct label for the last partial page', () => {
    expect(getPaginationLabel(3, 10, 25)).toBe('Mostrando del 21 al 25 de 25 registros');
  });

  it('returns correct label when total equals page size', () => {
    expect(getPaginationLabel(1, 10, 10)).toBe('Mostrando del 1 al 10 de 10 registros');
  });

  it('returns correct label for empty data', () => {
    expect(getPaginationLabel(1, 10, 0)).toBe('Mostrando del 0 al 0 de 0 registros');
  });
});

describe('getPageLabel', () => {
  it('returns correct page label', () => {
    expect(getPageLabel(1, 25, 10)).toBe('Página 1 de 3');
  });

  it('returns correct label for single page', () => {
    expect(getPageLabel(1, 5, 10)).toBe('Página 1 de 1');
  });

  it('returns correct label for exact multiple of page size', () => {
    expect(getPageLabel(2, 20, 10)).toBe('Página 2 de 2');
  });

  it('returns "Página 1 de 1" for zero records', () => {
    expect(getPageLabel(1, 0, 10)).toBe('Página 1 de 1');
  });
});
