import { describe, it, expect } from 'vitest';
import { getUploadFields } from './uploadFields';

describe('getUploadFields', () => {
  it('returns 3 fields for Devolución with correct config', () => {
    const fields = getUploadFields('Devolución');
    expect(fields).toHaveLength(3);
    expect(fields.map((f) => f.name)).toEqual(['actaDocumentacion', 'imagenes', 'informeTecnico']);
  });

  it('returns correct accept types for Devolución', () => {
    const fields = getUploadFields('Devolución');
    expect(fields.find((f) => f.name === 'actaDocumentacion')?.accept).toBe('.pdf');
    expect(fields.find((f) => f.name === 'imagenes')?.accept).toBe('.jpg');
    expect(fields.find((f) => f.name === 'informeTecnico')?.accept).toBe('.jpg');
  });

  it('returns 3 fields for Anticipada with correct config', () => {
    const fields = getUploadFields('Anticipada');
    expect(fields).toHaveLength(3);
    expect(fields.map((f) => f.name)).toEqual(['actaDocumentacion', 'informeTecnico', 'imagenes']);
  });

  it('returns correct accept types for Anticipada', () => {
    const fields = getUploadFields('Anticipada');
    expect(fields.find((f) => f.name === 'actaDocumentacion')?.accept).toBe('.pdf');
    expect(fields.find((f) => f.name === 'informeTecnico')?.accept).toBe('.pdf');
    expect(fields.find((f) => f.name === 'imagenes')?.accept).toBe('.jpg');
  });

  it('returns 2 fields for Robo without actaDocumentacion', () => {
    const fields = getUploadFields('Robo');
    expect(fields).toHaveLength(2);
    expect(fields.map((f) => f.name)).toEqual(['imagenes', 'informeTecnico']);
    expect(fields.find((f) => f.name === 'actaDocumentacion')).toBeUndefined();
  });

  it('sets maxFiles to 5 for imagenes across all return types', () => {
    for (const type of ['Devolución', 'Anticipada', 'Robo'] as const) {
      const fields = getUploadFields(type);
      const imagenes = fields.find((f) => f.name === 'imagenes');
      expect(imagenes?.maxFiles).toBe(5);
    }
  });

  it('marks all fields as required', () => {
    for (const type of ['Devolución', 'Anticipada', 'Robo'] as const) {
      const fields = getUploadFields(type);
      for (const field of fields) {
        expect(field.required).toBe(true);
      }
    }
  });
});
