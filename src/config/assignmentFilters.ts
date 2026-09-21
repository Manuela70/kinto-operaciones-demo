import type { Role } from '../types';

export type FilterFieldType = 'text' | 'dropdown';

export interface FilterFieldConfig {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: string[];
}

const ESTADO_PROCESO_OPTIONS = [
  'Pendiente de asignación',
  'En Facturación',
  'En preparación TDP',
  'Preparación DLR',
  'UIO',
];

const ESTADO_VEHICULO_OPTIONS = [
  'Sin asignación',
  'Unidad asignada',
  'Unidad facturada',
  'Programado no entrega',
  'Entregado DLR',
  'En equipamiento',
];

const ESTADO_DOCUMENTACION_OPTIONS = ['Iniciada', 'Pendiente', 'Completada'];

export function getAssignmentFilterFields(role: Role): FilterFieldConfig[] {
  const common: FilterFieldConfig[] = [
    { name: 'serie', label: 'Serie', type: 'text' },
    { name: 'placa', label: 'Placa', type: 'text' },
    { name: 'marca', label: 'Marca', type: 'dropdown', options: ['TOYOTA', 'LEXUS'] },
    { name: 'modelo', label: 'Modelo', type: 'dropdown', options: ['Corolla', 'RAV4', 'Hilux', 'Yaris'] },
    { name: 'cliente', label: 'Cliente', type: 'text' },
    { name: 'ruc', label: 'RUC', type: 'text' },
    { name: 'asesor', label: 'Asesor', type: 'text' },
    { name: 'asesorEntrega', label: 'Asesor de entrega', type: 'text' },
  ];

  const estadoProceso: FilterFieldConfig = {
    name: 'estadoProceso',
    label: 'Estado proceso',
    type: 'dropdown',
    options: ESTADO_PROCESO_OPTIONS,
  };
  const estadoVehiculo: FilterFieldConfig = {
    name: 'estadoVehiculo',
    label: 'Estado vehículo',
    type: 'dropdown',
    options: ESTADO_VEHICULO_OPTIONS,
  };
  const estadoDocumentacion: FilterFieldConfig = {
    name: 'estadoDocumentacion',
    label: 'Estado documentación',
    type: 'dropdown',
    options: ESTADO_DOCUMENTACION_OPTIONS,
  };

  if (role === 'Admin_Kinto') {
    return [
      ...common,
      { name: 'dealerEntrega', label: 'Dealer entrega', type: 'dropdown', options: ['Dealer Lima', 'Dealer Arequipa'] },
      { name: 'localEntrega', label: 'Local entrega', type: 'dropdown', options: ['Local Norte', 'Local Sur'] },
      estadoProceso,
      estadoVehiculo,
      estadoDocumentacion,
    ];
  }

  if (role === 'Admin_Local') {
    return [
      ...common,
      { name: 'localEntrega', label: 'Local entrega', type: 'dropdown', options: ['Local Norte', 'Local Sur'] },
      estadoProceso,
      estadoVehiculo,
      estadoDocumentacion,
    ];
  }

  // Asesor: sin Local entrega ni Dealer entrega, según mockup
  return [...common, estadoProceso, estadoVehiculo, estadoDocumentacion];
}
