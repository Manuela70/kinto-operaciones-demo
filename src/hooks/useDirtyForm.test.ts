import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDirtyForm } from './useDirtyForm';
import { ReturnFormData } from '../types';

const createInitialData = (): ReturnFormData => ({
  fechaFinContrato: '2025-10-15',
  kilometraje: 45000,
  dealer: 'José Antonio Martínez Vargas',
  tipoDevolucion: 'Devolución',
  fechaDevolucion: '2025-11-01',
  devolverParaStock: false,
  comentarios: '',
  files: {},
});

describe('useDirtyForm', () => {
  it('returns initial formData unchanged', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    expect(result.current.formData).toEqual(initial);
  });

  it('isDirty returns false when no changes have been made', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    expect(result.current.isDirty()).toBe(false);
  });

  it('isDirty returns true after updating a text field', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('comentarios', 'Vehículo en buen estado');
    });

    expect(result.current.isDirty()).toBe(true);
    expect(result.current.formData.comentarios).toBe('Vehículo en buen estado');
  });

  it('isDirty returns true after updating a numeric field', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('kilometraje', 50000);
    });

    expect(result.current.isDirty()).toBe(true);
    expect(result.current.formData.kilometraje).toBe(50000);
  });

  it('isDirty returns true after toggling a boolean field', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('devolverParaStock', true);
    });

    expect(result.current.isDirty()).toBe(true);
    expect(result.current.formData.devolverParaStock).toBe(true);
  });

  it('isDirty returns false after reverting a field to its original value', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('comentarios', 'Temporal');
    });
    expect(result.current.isDirty()).toBe(true);

    act(() => {
      result.current.updateField('comentarios', '');
    });
    expect(result.current.isDirty()).toBe(false);
  });

  it('isDirty returns true after changing tipoDevolucion', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('tipoDevolucion', 'Robo');
    });

    expect(result.current.isDirty()).toBe(true);
    expect(result.current.formData.tipoDevolucion).toBe('Robo');
  });

  it('isDirty returns true after updating files', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('files', {
        imagenes: [{ id: '1', name: 'foto.jpg', size: 1024, type: 'image/jpeg' }],
      });
    });

    expect(result.current.isDirty()).toBe(true);
  });

  it('setFormData replaces entire form state', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    const newData: ReturnFormData = {
      ...initial,
      comentarios: 'Reemplazado',
      kilometraje: 60000,
    };

    act(() => {
      result.current.setFormData(newData);
    });

    expect(result.current.formData.comentarios).toBe('Reemplazado');
    expect(result.current.formData.kilometraje).toBe(60000);
    expect(result.current.isDirty()).toBe(true);
  });

  it('tracks multiple field updates correctly', () => {
    const initial = createInitialData();
    const { result } = renderHook(() => useDirtyForm(initial));

    act(() => {
      result.current.updateField('comentarios', 'Nota');
    });
    act(() => {
      result.current.updateField('kilometraje', 55000);
    });

    expect(result.current.formData.comentarios).toBe('Nota');
    expect(result.current.formData.kilometraje).toBe(55000);
    expect(result.current.isDirty()).toBe(true);
  });
});
