import { useState, useCallback, useRef } from 'react';
import type { ReturnFormData } from '../types';

export function useDirtyForm(initialData: ReturnFormData) {
  const initialRef = useRef(JSON.stringify(initialData));
  const [formData, setFormData] = useState<ReturnFormData>(initialData);

  const isDirty = useCallback(() => {
    return JSON.stringify(formData) !== initialRef.current;
  }, [formData]);

  const updateField = useCallback(<K extends keyof ReturnFormData>(
    field: K,
    value: ReturnFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return { formData, isDirty, updateField, setFormData };
}
