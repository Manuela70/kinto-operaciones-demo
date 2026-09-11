import type { Role } from '../types';

export type ServiceFilterFieldType = 'text' | 'select' | 'date';

export interface ServiceFilterFieldConfig {
  name: string;
  label: string;
  type: ServiceFilterFieldType;
  options?: string[];
}

const ESTADO_OPTIONS = ['Por validar', 'Aprobado', 'Pendiente', 'Rechazado'];
const TIPO_SERVICIO_OPTIONS = ['Preventivo', 'Correctivo', 'Siniestro'];

/**
 * Admin Kinto ve el listado global de servicios de todos los locales/dealers,
 * con filtros orientados al vehículo y al cliente (VIN, RUC, Dealer, Local).
 */
function getAdminKintoFilterFields(): ServiceFilterFieldConfig[] {
  return [
    { name: 'vin', label: 'VIN', type: 'select' },
    { name: 'placa', label: 'Placa', type: 'text' },
    { name: 'cliente', label: 'Cliente', type: 'text' },
    { name: 'ruc', label: 'RUC', type: 'text' },
    { name: 'estadoOT', label: 'Estado OT', type: 'select', options: ESTADO_OPTIONS },
    { name: 'modelo', label: 'Modelo', type: 'select' },
    { name: 'dealer', label: 'Dealer entrega', type: 'select' },
    { name: 'local', label: 'Local entrega', type: 'select' },
    { name: 'tipoServicio', label: 'Tipo de servicio', type: 'select', options: TIPO_SERVICIO_OPTIONS },
    { name: 'fechaServicioDesde', label: 'Fecha de servicio (desde)', type: 'date' },
    { name: 'fechaServicioHasta', label: 'Fecha de servicio (hasta)', type: 'date' },
  ];
}

/**
 * Admin Local y Asesor operan sobre los servicios de su propio local, y
 * filtran principalmente por contrato y datos del vehículo.
 */
function getLocalFilterFields(): ServiceFilterFieldConfig[] {
  return [
    { name: 'contrato', label: 'Contrato', type: 'select' },
    { name: 'serie', label: 'Serie', type: 'select' },
    { name: 'placa', label: 'Placa', type: 'text' },
    { name: 'ruc', label: 'RUC', type: 'text' },
    { name: 'estadoOT', label: 'Estado', type: 'select', options: ESTADO_OPTIONS },
    { name: 'marca', label: 'Marca', type: 'select' },
    { name: 'modelo', label: 'Modelo', type: 'select' },
    { name: 'version', label: 'Versión', type: 'select' },
    { name: 'local', label: 'Local entrega', type: 'select' },
    { name: 'tipoServicio', label: 'Tipo de servicio', type: 'select', options: TIPO_SERVICIO_OPTIONS },
    { name: 'fechaServicioDesde', label: 'Fecha de servicio', type: 'date' },
  ];
}

export function getServiceFilterFields(role: Role): ServiceFilterFieldConfig[] {
  if (role === 'Admin_Kinto') return getAdminKintoFilterFields();
  return getLocalFilterFields();
}
