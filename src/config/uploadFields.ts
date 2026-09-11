export type ReturnType = 'Devolución' | 'Anticipada' | 'Robo';

export interface UploadFieldConfig {
  name: string;
  label: string;
  accept: '.pdf' | '.jpg';
  maxFiles: number;
  required: boolean;
}

export function getUploadFields(returnType: ReturnType): UploadFieldConfig[] {
  switch (returnType) {
    case 'Devolución':
      return [
        { name: 'actaDocumentacion', label: 'Acta documentación', accept: '.pdf', maxFiles: 1, required: true },
        { name: 'imagenes', label: 'Imágenes', accept: '.jpg', maxFiles: 5, required: true },
        { name: 'informeTecnico', label: 'Informe técnico', accept: '.jpg', maxFiles: 1, required: true },
      ];
    case 'Anticipada':
      return [
        { name: 'actaDocumentacion', label: 'Acta documentación', accept: '.pdf', maxFiles: 1, required: true },
        { name: 'informeTecnico', label: 'Informe técnico', accept: '.pdf', maxFiles: 1, required: true },
        { name: 'imagenes', label: 'Imágenes', accept: '.jpg', maxFiles: 5, required: true },
      ];
    case 'Robo':
      return [
        { name: 'imagenes', label: 'Imágenes', accept: '.jpg', maxFiles: 5, required: true },
        { name: 'informeTecnico', label: 'Informe técnico', accept: '.jpg', maxFiles: 1, required: true },
      ];
  }
}
