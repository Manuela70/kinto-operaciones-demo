import { describe, it, expect } from 'vitest';
import { getFilterFields } from './filters';

describe('getFilterFields', () => {
  it('returns 8 fields for Admin_Kinto', () => {
    const fields = getFilterFields('Admin_Kinto');
    expect(fields).toHaveLength(8);
  });

  it('returns 7 fields for Admin_Local', () => {
    const fields = getFilterFields('Admin_Local');
    expect(fields).toHaveLength(7);
  });

  it('returns 6 fields for Asesor', () => {
    const fields = getFilterFields('Asesor');
    expect(fields).toHaveLength(6);
  });

  it('Admin_Kinto includes dealerEntrega and localEntrega fields', () => {
    const fields = getFilterFields('Admin_Kinto');
    const names = fields.map((f) => f.name);
    expect(names).toContain('dealerEntrega');
    expect(names).toContain('localEntrega');
  });

  it('Admin_Local includes localEntrega but not dealerEntrega', () => {
    const fields = getFilterFields('Admin_Local');
    const names = fields.map((f) => f.name);
    expect(names).toContain('localEntrega');
    expect(names).not.toContain('dealerEntrega');
  });

  it('Asesor does not include dealerEntrega or localEntrega', () => {
    const fields = getFilterFields('Asesor');
    const names = fields.map((f) => f.name);
    expect(names).not.toContain('dealerEntrega');
    expect(names).not.toContain('localEntrega');
  });

  it('all roles include the common fields', () => {
    const roles = ['Admin_Kinto', 'Admin_Local', 'Asesor'] as const;
    const commonNames = ['serie', 'placa', 'modelo', 'cliente', 'ruc', 'estadoContrato'];

    for (const role of roles) {
      const fields = getFilterFields(role);
      const names = fields.map((f) => f.name);
      for (const common of commonNames) {
        expect(names).toContain(common);
      }
    }
  });

  it('dropdown fields have options arrays', () => {
    const fields = getFilterFields('Admin_Kinto');
    const dropdowns = fields.filter((f) => f.type === 'dropdown');
    for (const dropdown of dropdowns) {
      expect(dropdown.options).toBeDefined();
      expect(dropdown.options!.length).toBeGreaterThan(0);
    }
  });

  it('text fields do not have options', () => {
    const fields = getFilterFields('Admin_Kinto');
    const textFields = fields.filter((f) => f.type === 'text');
    for (const textField of textFields) {
      expect(textField.options).toBeUndefined();
    }
  });
});
