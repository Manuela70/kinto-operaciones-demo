import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { mockContracts, getWorkOrdersByContractId } from '../mockContracts';

/**
 * Property tests for mock data invariants.
 *
 * **Validates: Requirements 11.2, 11.5, 11.6, 8.4, 11.8**
 */

describe('Property 10: Mock data records conform to format constraints', () => {
  /**
   * **Validates: Requirements 11.2**
   * Every contract ID matches the pattern C20250XXXX (regex ^C20250\d{4}$).
   */
  it('every contract ID matches ^C20250\\d{4}$', () => {
    const contractIdRegex = /^C20250\d{4}$/;

    fc.assert(
      fc.property(
        fc.constantFrom(...mockContracts),
        (contract) => {
          expect(contract.id).toMatch(contractIdRegex);
        }
      ),
      { numRuns: mockContracts.length }
    );
  });

  /**
   * **Validates: Requirements 11.5**
   * Every contract end date falls between October 2025 and December 2025 (inclusive).
   */
  it('every contract end date falls Oct–Dec 2025', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockContracts),
        (contract) => {
          const date = new Date(contract.fechaFinContrato);
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // 0-indexed → 1-indexed

          expect(year).toBe(2025);
          expect(month).toBeGreaterThanOrEqual(10);
          expect(month).toBeLessThanOrEqual(12);
        }
      ),
      { numRuns: mockContracts.length }
    );
  });

  /**
   * **Validates: Requirements 11.6**
   * Every contract status is either "Activo" or "No activo".
   */
  it('every contract status is Activo or No activo', () => {
    const validStatuses = ['Activo', 'No activo'];

    fc.assert(
      fc.property(
        fc.constantFrom(...mockContracts),
        (contract) => {
          expect(validStatuses).toContain(contract.estadoContrato);
        }
      ),
      { numRuns: mockContracts.length }
    );
  });
});

describe('Property 11: Each contract has associated work orders in valid range', () => {
  /**
   * **Validates: Requirements 8.4, 11.8**
   * getWorkOrdersByContractId() returns 3–6 work orders for every contract.
   */
  it('every contract has between 3 and 6 work orders', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mockContracts),
        (contract) => {
          const workOrders = getWorkOrdersByContractId(contract.id);

          expect(workOrders.length).toBeGreaterThanOrEqual(3);
          expect(workOrders.length).toBeLessThanOrEqual(6);
        }
      ),
      { numRuns: mockContracts.length }
    );
  });
});
