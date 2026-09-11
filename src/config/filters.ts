import type { Role } from '../types';

export type FilterFieldType = 'text' | 'dropdown';

export interface FilterFieldConfig {
  name: string;
  label: string;
  type: FilterFieldType;
  options?: string[]; // for dropdowns
}

export function getFilterFields(role: Role): FilterFieldConfig[] {
  const common: FilterFieldConfig[] = [
    { name: 'serie', label: 'Serie', type: 'text' },
    { name: 'placa', label: 'Placa', type: 'text' },
    { name: 'modelo', label: 'Modelo', type: 'dropdown', options: ['Corolla', 'RAV4', 'Hilux', 'Yaris'] },
    { name: 'cliente', label: 'Cliente', type: 'text' },
    { name: 'ruc', label: 'RUC', type: 'text' },
  ];

  const estadoContrato: FilterFieldConfig = {
    name: 'estadoContrato',
    label: 'Estado contrato',
    type: 'dropdown',
    options: ['Activo', 'No activo'],
  };

  if (role === 'Admin_Kinto') {
    return [
      ...common,
      { name: 'dealerEntrega', label: 'Dealer entrega', type: 'dropdown', options: ['Dealer Lima', 'Dealer Arequipa'] },
      { name: 'localEntrega', label: 'Local entrega', type: 'dropdown', options: ['Local Norte', 'Local Sur'] },
      estadoContrato,
    ];
  }

  if (role === 'Admin_Local') {
    return [
      ...common,
      { name: 'localEntrega', label: 'Local entrega', type: 'dropdown', options: ['Local Norte', 'Local Sur'] },
      estadoContrato,
    ];
  }

  // Asesor
  return [...common, estadoContrato];
}
