export type Role = 'Admin_Kinto' | 'Admin_Local' | 'Asesor';

export type ContractStatus = 'Activo' | 'No activo';

export type ReturnType = 'Devolución' | 'Anticipada' | 'Robo';

export type ServiceType = 'Preventivo' | 'Correctivo' | 'Siniestro' | 'Recuperación' | 'Devolución';

export type WorkOrderStatus = 'Por validar' | 'Aprobado' | 'Pendiente';

export interface Contract {
  id: string;                    // e.g., "C202509876"
  fechaUIO: string;              // ISO date string
  fechaFinContrato: string;      // ISO date string
  nombreCliente: string;
  modelo: string;                // e.g., "Corolla"
  serie: string;                 // e.g., "12345X"
  placa: string;
  ruc: string;
  dealerEntrega: string;
  localEntrega: string;
  estadoContrato: ContractStatus;
  kilometraje: number;
}

export interface WorkOrder {
  idOT: string;
  contractId: string;
  serie: string;
  placa: string;
  kilometraje: number;
  tipoServicio: ServiceType;
  estadoOT: WorkOrderStatus;
  comentario: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;     // bytes
  type: string;     // MIME type
}

export interface ReturnFormData {
  fechaFinContrato: string;
  kilometraje: number | '';
  dealer: string;
  tipoDevolucion: ReturnType | '';
  fechaDevolucion: string;
  devolverParaStock: boolean;
  comentarios: string;
  files: Record<string, UploadedFile[]>;  // keyed by upload field name
}

export interface FilterValues {
  serie: string;
  placa: string;
  modelo: string;
  cliente: string;
  ruc: string;
  dealerEntrega: string;
  localEntrega: string;
  estadoContrato: string;
}

// ---- Módulo Asignaciones ----

export type EstadoProceso =
  | 'Pendiente de asignación'
  | 'En Facturación'
  | 'En preparación TDP'
  | 'Preparación DLR'
  | 'UIO';

export type EstadoVehiculo =
  | 'Sin asignación'
  | 'Unidad asignada'
  | 'Unidad facturada'
  | 'Programado no entrega'
  | 'Entregado DLR'
  | 'En equipamiento';

export type EstadoDocumentacion = 'Iniciada' | 'Pendiente' | 'Completada';

export type Disponibilidad = 'Disponible' | 'No disponible';

export type EstadoUnidadDlr = 'En almacén DLR' | 'En Equipamiento' | 'Unidad terminada';

export interface Assignment {
  id: string; // "ID Contrato", e.g. "C202509876"
  fechaFirmaContrato: string; // ISO date
  localEntrega: string;
  nombreCliente: string;
  vehiculo: string; // e.g. "Corolla - versión"
  marca: string;
  modelo: string;
  serie: string;
  placa: string;
  ruc: string;
  dealerEntrega: string;
  fechaEstado: string; // ISO date
  estadoProceso: EstadoProceso;
  estadoVehiculo: EstadoVehiculo;
  documentacion: EstadoDocumentacion;
  asesor: string; // Asesor inicial (venta)
  asesorEntrega: string; // Asesor de entrega / asignado
  tieneAccesorios: boolean;

  // Facturación
  vin: string;
  disponibilidad: Disponibilidad;
  fechaDisponibilidad: string;
  fechaAsignacion: string;
  fechaFacturacion: string;
  fechaActivacion: string;
  duasFiles: UploadedFile[];
  facturaEnviada: boolean;

  // Preparación TDP
  fechaPreparacionPdi: string;
  fechaEntregaDealer: string;
  tdpEnviado: boolean;

  // Preparación DLR
  estadoUnidadDlr: EstadoUnidadDlr | '';
  fechaUnidadTerminada: string;
  dlrEnviado: boolean;

  // Gestión de documentación — Documentación placas
  fechaInmatriculacion: string;
  fechaIngresoSunarp: string;
  fechaRecepcionTive: string;
  tiveFiles: UploadedFile[];
  fechaEnvioPlacaDlr: string;

  // Gestión de documentación — Lunas polarizadas
  inicioSolicitudLunas: string;
  fechaEnvioPermisosDrl: string;
  fechaRecepcionTarjeta: string;
  tarjetaFiles: UploadedFile[];

  // Gestión de documentación — SOAT y seguro
  fechaEmisionSoat: string;
  fechaInclusionPoliza: string;
  soatFiles: UploadedFile[];
  polizaFiles: UploadedFile[];

  // Entrega al cliente
  fechaUio: string;
  actaFiles: UploadedFile[];
  fechaEntregaCliente: string;
  imagenesFiles: UploadedFile[];
  comentariosEntrega: string;
  entregaEnviado: boolean;

  // Detalle de cotización (solo lectura)
  cotizacion: {
    ruc: string;
    razonSocial: string;
    rubro: string;
    nombres: string;
    telefono: string;
    email: string;
    dealerEntrega: string;
    zonaOperacion: string;
    kilometraje: string;
    comentariosAdicional: string;
    vehiculo: string;
    marca: string;
    modelo: string;
    version: string;
    cantidadUnidades: string;
    plazo: string;
    color: string;
  };
}

export interface AssignmentFilterValues {
  serie: string;
  placa: string;
  marca: string;
  modelo: string;
  cliente: string;
  ruc: string;
  dealerEntrega: string;
  localEntrega: string;
  estadoProceso: string;
  estadoVehiculo: string;
  estadoDocumentacion: string;
  asesor: string;
  asesorEntrega: string;
}

// ---- Módulo Servicios ----

export type TipoServicio = 'Preventivo' | 'Correctivo' | 'Carrocería y Pintura' | 'Cambio de neumáticos';

export type EstadoOT = 'Por validar' | 'Aprobado' | 'Pendiente' | 'Rechazado';

export type MonedaServicio = 'Soles' | 'USD';

export interface OrdenCompra {
  id: string;
  numero: string;
  file: UploadedFile | null;
}

export interface ServiceRecord {
  idOT: string; // e.g. "C202509876"
  contrato: string;
  vin: string;
  serie: string;
  placa: string;
  kilometraje: string; // "Kilometraje de ingreso"
  cliente: string;
  ruc: string;
  marca: string;
  modelo: string;
  version: string;
  dealer: string;
  local: string;
  asesor: string; // Asesor inicial (venta)
  asesorEntrega: string; // Asesor de entrega / asignado

  tipoServicio: TipoServicio;
  estadoOT: EstadoOT;
  comentario: string;
  idOtDisplay: string; // "ID OT" column value, same as idOT (kept for clarity)

  fechaServicio: string; // ISO date
  frecuencia: string; // only Preventivo, e.g. "5000 km"
  tipoMoneda: MonedaServicio;
  monto: string;
  cobrarCliente: boolean;

  cotizacionFiles: UploadedFile[]; // .pdf/.xlsx/.zip — todos los tipos
  imagenesFiles: UploadedFile[]; // .jpg/.png — Correctivo/Carrocería y Pintura
  vistoBuenoFiles: UploadedFile[]; // .pdf/.jpg — Correctivo/Carrocería y Pintura/Cambio de neumáticos (si aplica)

  // HU028/HU029 — Carga de OC (múltiple), habilitada cuando el servicio ya está aprobado
  ordenesCompra: OrdenCompra[];

  // Carrocería y Pintura (HU027-3)
  fechaIngresoReparacion?: string;
  fechaSalidaReparacion?: string;
  seAtendioSeguro?: boolean;
  numeroSiniestro?: string;
  fechaSiniestro?: string;
  montoDeducible?: string;

  // Cambio de neumáticos (HU027-4)
  frecuenciaCambio?: string;
  kmUltimoCambio?: string;
}

export interface ServiceFilterValues {
  vin: string;
  contrato: string;
  serie: string;
  placa: string;
  cliente: string;
  ruc: string;
  estadoOT: string;
  marca: string;
  modelo: string;
  version: string;
  dealer: string;
  local: string;
  tipoServicio: string;
  fechaServicioDesde: string;
  fechaServicioHasta: string;
  asesor: string;
  asesorEntrega: string;
}

// ---- Módulo Reportería ----

export type ReportMode = 'Concesionario' | 'Local';

export type ReportCriterio =
  | 'LEAD TIME ENTREGAS'
  | 'SERVICIOS'
  | 'KM EXCESO'
  | 'VENCIMIENTO SEGUROS'
  | 'DEVOLUCIONES'
  | 'CARROCERÍA Y PINTURA'
  | 'B&P'
  | 'OC';

export interface ReportLocal {
  code: string;
  name: string;
}

export interface ReportConcesionario {
  code: string;
  name: string;
  locales: ReportLocal[];
}

export type ReportFieldType = 'text' | 'date' | 'select';

export interface ReportFieldConfig {
  name: string;
  label: string;
  type: ReportFieldType;
  placeholder?: string;
  options?: string[];
}

export interface ReportFilterValues {
  [key: string]: string;
}
