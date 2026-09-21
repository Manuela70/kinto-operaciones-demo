import type { ReportCriterio, ReportFieldConfig } from '../types';

export const REPORT_CRITERIOS: ReportCriterio[] = [
  'LEAD TIME ENTREGAS',
  'SERVICIOS',
  'KM EXCESO',
  'VENCIMIENTO SEGUROS',
  'DEVOLUCIONES',
  'CARROCERÍA Y PINTURA',
  'B&P',
  'OC',
];

export function getReportFilterFields(criterio: ReportCriterio | ''): ReportFieldConfig[] {
  switch (criterio) {
    case 'LEAD TIME ENTREGAS':
      return [
        { name: 'fechaUioDesde', label: 'Fecha UIO (desde)', type: 'date' },
        { name: 'fechaUioHasta', label: 'Fecha UIO (hasta)', type: 'date' },
        { name: 'fechaFirmaDesde', label: 'Fecha firma contrato (desde)', type: 'date' },
        { name: 'fechaFirmaHasta', label: 'Fecha firma contrato (hasta)', type: 'date' },
        {
          name: 'estadoProceso',
          label: 'Estado proceso',
          type: 'select',
          options: ['Pendiente de asignación', 'En Facturación', 'En preparación TDP', 'Preparación DLR', 'UIO'],
        },
        {
          name: 'estadoVehiculo',
          label: 'Estado vehículo',
          type: 'select',
          options: [
            'Sin asignación',
            'Unidad asignada',
            'Unidad facturada',
            'Programado no entrega',
            'Entregado DLR',
            'En equipamiento',
          ],
        },
        { name: 'dealerEntrega', label: 'Dealer entrega', type: 'text', placeholder: 'Dealer' },
        { name: 'localEntrega', label: 'Local entrega', type: 'text', placeholder: 'Local' },
        {
          name: 'documentacion',
          label: 'Documentación',
          type: 'select',
          options: ['Iniciada', 'Pendiente', 'Completada'],
        },
        { name: 'vin', label: 'VIN', type: 'text', placeholder: '1234567890123456' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
      ];
    case 'SERVICIOS':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        {
          name: 'estadoOT',
          label: 'Estado OT',
          type: 'select',
          options: ['Por validar', 'Aprobado', 'Pendiente', 'Rechazado'],
        },
        { name: 'idOT', label: 'ID OT', type: 'text', placeholder: '123456' },
        {
          name: 'tipoServicio',
          label: 'Tipo de servicio',
          type: 'select',
          options: ['Preventivo', 'Correctivo', 'Siniestro'],
        },
        { name: 'fechaServicioDesde', label: 'Fecha de servicio (desde)', type: 'date' },
        { name: 'fechaServicioHasta', label: 'Fecha de servicio (hasta)', type: 'date' },
      ];
    case 'KM EXCESO':
      return [
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'tiempoEjecutadoDesde', label: 'Tiempo ejecutado (meses - desde)', type: 'text', placeholder: '0' },
        { name: 'tiempoEjecutadoHasta', label: 'Tiempo ejecutado (meses - hasta)', type: 'text', placeholder: '0' },
        { name: 'estadoContrato', label: 'Estado contrato', type: 'select', options: ['Activo', 'No activo'] },
      ];
    case 'VENCIMIENTO SEGUROS':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'ruc', label: 'RUC', type: 'text', placeholder: '07845613294' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        { name: 'estadoSoat', label: 'Estado SOAT', type: 'select', options: ['Vigente', 'Por vencer', 'Vencido'] },
        { name: 'estadoContrato', label: 'Estado contrato', type: 'select', options: ['Activo', 'No activo'] },
      ];
    case 'DEVOLUCIONES':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        {
          name: 'tipoDevolucion',
          label: 'Tipo de devolución',
          type: 'select',
          options: ['Devolución', 'Anticipada', 'Robo'],
        },
        { name: 'estadoContrato', label: 'Estado contrato', type: 'select', options: ['Activo', 'No activo'] },
      ];
    case 'CARROCERÍA Y PINTURA':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        { name: 'fechaSiniestroDesde', label: 'Fecha de siniestro (desde)', type: 'date' },
        { name: 'fechaSiniestroHasta', label: 'Fecha de siniestro (hasta)', type: 'date' },
      ];
    case 'B&P':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        { name: 'fechaIngresoReparacionDesde', label: 'Fecha de ingreso a reparación (desde)', type: 'date' },
        { name: 'fechaIngresoReparacionHasta', label: 'Fecha de ingreso a reparación (hasta)', type: 'date' },
      ];
    case 'OC':
      return [
        { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre del cliente' },
        { name: 'placa', label: 'Placa', type: 'text', placeholder: 'ABC-123' },
        { name: 'serie', label: 'Serie', type: 'text', placeholder: '12345X' },
        {
          name: 'tipoServicio',
          label: 'Tipo de servicio',
          type: 'select',
          options: ['Preventivo', 'Correctivo', 'Siniestro'],
        },
      ];
    default:
      return [];
  }
}
