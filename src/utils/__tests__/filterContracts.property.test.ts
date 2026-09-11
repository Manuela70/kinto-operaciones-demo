// @vitest-environment node
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { filterContracts } from '../filterContracts';
import { mockContracts } from '../../data/mockContracts';
import type { Contract, FilterValues } from '../../types';

/**
 * Property test for client-side filtering.
 *
 * **Validates: Requirements 4.6**
 */

// Collect the actual domain values from mock data for realistic generators
const allModelos = [...new Set(mockContracts.map((c) => c.modelo))];
const allDealers = [...new Set(mockContracts.map((c) => c.dealerEntrega))];
const allLocales = [...new Set(mockContracts.map((c) => c.localEntrega))];
const allEstados = [...new Set(mockContracts.map((c) => c.estadoContrato))];

// Extract substrings from existing data for text-based filter generators
const allSeries = mockContracts.map((c) => c.serie);
const allPlacas = mockContracts.map((c) => c.placa);
const allClientes = mockContracts.map((c) => c.nombreCliente);
const allRucs = mockContracts.map((c) => c.ruc);

/**
 * Generator for a substring of a randomly chosen value from an array.
 * This produces filter strings that are likely to match at least some records.
 */
function substringOf(values: string[]): fc.Arbitrary<string> {
  return fc.constantFrom(...values).chain((value) =>
    fc.tuple(
      fc.integer({ min: 0, max: Math.max(0, value.length - 1) }),
      fc.integer({ min: 1, max: value.length })
    ).map(([start, end]) => {
      const realEnd = Math.max(start + 1, Math.min(end, value.length));
      return value.slice(start, realEnd);
    })
  );
}

/**
 * Generator for partial filter values.
 * Each field is either undefined (not applied) or a realistic value from the domain.
 */
const filterArb: fc.Arbitrary<Partial<FilterValues>> = fc.record(
  {
    serie: fc.oneof(fc.constant(undefined), substringOf(allSeries)),
    placa: fc.oneof(fc.constant(undefined), substringOf(allPlacas)),
    modelo: fc.oneof(fc.constant(undefined), fc.constantFrom(...allModelos)),
    cliente: fc.oneof(fc.constant(undefined), substringOf(allClientes)),
    ruc: fc.oneof(fc.constant(undefined), substringOf(allRucs)),
    dealerEntrega: fc.oneof(fc.constant(undefined), fc.constantFrom(...allDealers)),
    localEntrega: fc.oneof(fc.constant(undefined), fc.constantFrom(...allLocales)),
    estadoContrato: fc.oneof(fc.constant(undefined), fc.constantFrom(...allEstados)),
  },
  { requiredKeys: [] }
);

/**
 * Check that a contract matches a single filter criterion.
 * Mirrors the logic in filterContracts but expressed as a positive assertion.
 */
function contractMatchesFilter(
  contract: Contract,
  filters: Partial<FilterValues>
): boolean {
  if (filters.serie && !contract.serie.toLowerCase().includes(filters.serie.toLowerCase())) return false;
  if (filters.placa && !contract.placa.toLowerCase().includes(filters.placa.toLowerCase())) return false;
  if (filters.modelo && contract.modelo !== filters.modelo) return false;
  if (filters.cliente && !contract.nombreCliente.toLowerCase().includes(filters.cliente.toLowerCase())) return false;
  if (filters.ruc && !contract.ruc.includes(filters.ruc)) return false;
  if (filters.dealerEntrega && contract.dealerEntrega !== filters.dealerEntrega) return false;
  if (filters.localEntrega && contract.localEntrega !== filters.localEntrega) return false;
  if (filters.estadoContrato && contract.estadoContrato !== filters.estadoContrato) return false;
  return true;
}

describe('Property 4: Client-side filtering returns only matching records', () => {
  /**
   * **Validates: Requirements 4.6**
   *
   * For any combination of non-empty filter values applied to the mock data set,
   * every record in the filtered result matches all provided filter criteria
   * (text filters by case-insensitive containment, dropdown filters by exact match).
   */
  it('every returned record matches all provided filter criteria', () => {
    fc.assert(
      fc.property(filterArb, (filters) => {
        const result = filterContracts(mockContracts, filters);

        for (const contract of result) {
          // Text filters: case-insensitive containment
          if (filters.serie) {
            expect(contract.serie.toLowerCase()).toContain(filters.serie.toLowerCase());
          }
          if (filters.placa) {
            expect(contract.placa.toLowerCase()).toContain(filters.placa.toLowerCase());
          }
          if (filters.cliente) {
            expect(contract.nombreCliente.toLowerCase()).toContain(filters.cliente.toLowerCase());
          }
          if (filters.ruc) {
            expect(contract.ruc).toContain(filters.ruc);
          }

          // Dropdown filters: exact match
          if (filters.modelo) {
            expect(contract.modelo).toBe(filters.modelo);
          }
          if (filters.dealerEntrega) {
            expect(contract.dealerEntrega).toBe(filters.dealerEntrega);
          }
          if (filters.localEntrega) {
            expect(contract.localEntrega).toBe(filters.localEntrega);
          }
          if (filters.estadoContrato) {
            expect(contract.estadoContrato).toBe(filters.estadoContrato);
          }
        }
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 4.6**
   *
   * The filtered result must not exclude any record that genuinely matches
   * all provided filter criteria (completeness check).
   */
  it('no matching record is excluded from the result', () => {
    fc.assert(
      fc.property(filterArb, (filters) => {
        const result = filterContracts(mockContracts, filters);
        const resultIds = new Set(result.map((c) => c.id));

        for (const contract of mockContracts) {
          if (contractMatchesFilter(contract, filters)) {
            expect(resultIds).toContain(contract.id);
          }
        }
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 4.6**
   *
   * With empty filters, all records are returned (no filtering applied).
   */
  it('empty filters return all contracts', () => {
    const result = filterContracts(mockContracts, {});
    expect(result).toHaveLength(mockContracts.length);
  });
});
