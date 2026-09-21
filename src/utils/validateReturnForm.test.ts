import { describe, it, expect } from 'vitest';
import { validateReturnForm } from './validateReturnForm';
import type { ReturnFormData } from '../types';

function makeValidForm(tipoDevolucion: 'Devolución' | 'Anticipada' | 'Robo' = 'Devolución'): ReturnFormData {
  const files: Record<string, { id: string; name: string; size: number; type: string }[]> = {
    imagenes: [{ id: '1', name: 'img.jpg', size: 1024, type: 'image/jpeg' }],
    informeTecnico: [{ id: '2', name: 'informe.jpg', size: 2048, type: 'image/jpeg' }],
  };

  if (tipoDevolucion !== 'Robo') {
    files.actaDocumentacion = [{ id: '3', name: 'acta.pdf', size: 3072, type: 'application/pdf' }];
  }

  return {
    fechaFinContrato: '2025-10-15',
    kilometraje: 45000,
    dealer: 'Dealer Lima',
    tipoDevolucion,
    fechaDevolucion: '2025-10-01',
    devolverParaStock: false,
    comentarios: '',
    files,
  };
}

describe('validateReturnForm', () => {
  it('returns valid for a complete Devolución form', () => {
    const result = validateReturnForm(makeValidForm('Devolución'));
    expect(result.isValid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it('returns valid for a complete Anticipada form', () => {
    const result = validateReturnForm(makeValidForm('Anticipada'));
    expect(result.isValid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it('returns valid for a complete Robo form', () => {
    const result = validateReturnForm(makeValidForm('Robo'));
    expect(result.isValid).toBe(true);
    expect(result.missingFields).toHaveLength(0);
  });

  it('reports missing fechaFinContrato', () => {
    const form = makeValidForm();
    form.fechaFinContrato = '';
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Fecha fin contrato');
  });

  it('reports missing kilometraje when empty string', () => {
    const form = makeValidForm();
    form.kilometraje = '';
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Kilometraje');
  });

  it('reports missing dealer', () => {
    const form = makeValidForm();
    form.dealer = '';
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Dealer');
  });

  it('reports missing tipoDevolucion', () => {
    const form = makeValidForm();
    form.tipoDevolucion = '';
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Tipo de devolución');
  });

  it('reports missing fechaDevolucion', () => {
    const form = makeValidForm();
    form.fechaDevolucion = '';
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Fecha de devolución');
  });

  it('reports missing required upload fields for Devolución', () => {
    const form = makeValidForm('Devolución');
    form.files = {};
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Acta documentación');
    expect(result.missingFields).toContain('Imágenes');
    expect(result.missingFields).toContain('Informe técnico');
  });

  it('reports missing required upload fields for Robo', () => {
    const form = makeValidForm('Robo');
    form.files = {};
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toContain('Imágenes');
    expect(result.missingFields).toContain('Informe técnico');
    expect(result.missingFields).not.toContain('Acta documentación');
  });

  it('does not check upload fields when tipoDevolucion is empty', () => {
    const form = makeValidForm();
    form.tipoDevolucion = '';
    form.files = {};
    const result = validateReturnForm(form);
    // Should report tipoDevolucion missing but not upload fields
    expect(result.missingFields).toContain('Tipo de devolución');
    expect(result.missingFields).not.toContain('Acta documentación');
    expect(result.missingFields).not.toContain('Imágenes');
  });

  it('reports multiple missing fields at once', () => {
    const form: ReturnFormData = {
      fechaFinContrato: '',
      kilometraje: '',
      dealer: '',
      tipoDevolucion: '',
      fechaDevolucion: '',
      devolverParaStock: false,
      comentarios: '',
      files: {},
    };
    const result = validateReturnForm(form);
    expect(result.isValid).toBe(false);
    expect(result.missingFields).toHaveLength(5);
  });

  it('accepts kilometraje of 0 as valid', () => {
    const form = makeValidForm();
    form.kilometraje = 0;
    const result = validateReturnForm(form);
    expect(result.missingFields).not.toContain('Kilometraje');
  });
});
