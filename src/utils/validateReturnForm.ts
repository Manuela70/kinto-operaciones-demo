import type { ReturnFormData } from '../types';
import { getUploadFields } from '../config/uploadFields';

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

export function validateReturnForm(formData: ReturnFormData): ValidationResult {
  const missingFields: string[] = [];

  if (!formData.fechaFinContrato) missingFields.push('Fecha fin contrato');
  if (formData.kilometraje === '' || formData.kilometraje === undefined) missingFields.push('Kilometraje');
  if (!formData.dealer) missingFields.push('Dealer');
  if (!formData.tipoDevolucion) missingFields.push('Tipo de devolución');
  if (!formData.fechaDevolucion) missingFields.push('Fecha de devolución');

  if (formData.tipoDevolucion) {
    const uploadFields = getUploadFields(formData.tipoDevolucion);
    for (const field of uploadFields) {
      if (field.required && (!formData.files[field.name] || formData.files[field.name].length === 0)) {
        missingFields.push(field.label);
      }
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
