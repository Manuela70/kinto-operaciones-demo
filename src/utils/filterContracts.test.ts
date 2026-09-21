import { describe, it, expect } from 'vitest';
import { filterContracts } from './filterContracts';
import type { Contract } from '../types';

const sampleContracts: Contract[] = [
  {
    id: 'C202509876',
    fechaUIO: '2024-03-15',
    fechaFinContrato: '2025-10-15',
    nombreCliente: 'Juan Carlos Valverde Campo',
    modelo: 'Corolla',
    serie: '12345X',
    placa: 'ABC-123',
    ruc: '20100001234',
    dealerEntrega: 'José Antonio Martínez Vargas',
    localEntrega: 'Local Norte',
    estadoContrato: 'Activo',
    kilometraje: 45000,
  },
  {
    id: 'C202509877',
    fechaUIO: '2024-04-20',
    fechaFinContrato: '2025-10-28',
    nombreCliente: 'María Elena Rodríguez',
    modelo: 'RAV4',
    serie: '12346X',
    placa: 'DEF-456',
    ruc: '20200005678',
    dealerEntrega: 'José Antonio Martínez Vargas',
    localEntrega: 'Local Sur',
    estadoContrato: 'Activo',
    kilometraje: 38000,
  },
  {
    id: 'C202509878',
    fechaUIO: '2024-02-10',
    fechaFinContrato: '2025-11-05',
    nombreCliente: 'Carlos Alberto Fernández',
    modelo: 'Corolla',
    serie: '12347X',
    placa: 'GHI-789',
    ruc: '20300009012',
    dealerEntrega: 'Roberto Sánchez Díaz',
    localEntrega: 'Local Norte',
    estadoContrato: 'No activo',
    kilometraje: 52000,
  },
];

describe('filterContracts', () => {
  it('returns all contracts when no filters are applied', () => {
    const result = filterContracts(sampleContracts, {});
    expect(result).toHaveLength(3);
  });

  it('filters by serie with case-insensitive containment', () => {
    const result = filterContracts(sampleContracts, { serie: '12345' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509876');
  });

  it('filters by serie case-insensitively', () => {
    const result = filterContracts(sampleContracts, { serie: '12345x' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509876');
  });

  it('filters by placa with case-insensitive containment', () => {
    const result = filterContracts(sampleContracts, { placa: 'abc' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509876');
  });

  it('filters by modelo with exact match', () => {
    const result = filterContracts(sampleContracts, { modelo: 'RAV4' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509877');
  });

  it('filters by cliente with case-insensitive containment', () => {
    const result = filterContracts(sampleContracts, { cliente: 'carlos' });
    expect(result).toHaveLength(2); // Juan Carlos and Carlos Alberto
  });

  it('filters by ruc with containment', () => {
    const result = filterContracts(sampleContracts, { ruc: '20100' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509876');
  });

  it('filters by dealerEntrega with exact match', () => {
    const result = filterContracts(sampleContracts, { dealerEntrega: 'Roberto Sánchez Díaz' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509878');
  });

  it('filters by localEntrega with exact match', () => {
    const result = filterContracts(sampleContracts, { localEntrega: 'Local Sur' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509877');
  });

  it('filters by estadoContrato with exact match', () => {
    const result = filterContracts(sampleContracts, { estadoContrato: 'No activo' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509878');
  });

  it('combines multiple filters with AND logic', () => {
    const result = filterContracts(sampleContracts, {
      modelo: 'Corolla',
      estadoContrato: 'Activo',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('C202509876');
  });

  it('returns empty array when no contracts match', () => {
    const result = filterContracts(sampleContracts, { serie: 'ZZZZZ' });
    expect(result).toHaveLength(0);
  });

  it('ignores empty string filter values', () => {
    const result = filterContracts(sampleContracts, { serie: '', modelo: '' });
    expect(result).toHaveLength(3);
  });
});
