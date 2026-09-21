import type { Assignment } from '../types';

const NOMBRES = [
  'Juan Carlos Valverde Campo',
  'María Elena Rodríguez',
  'Carlos Alberto Fernández',
  'Sofia Alejandra Torres',
  'Ricardo Gómez',
  'Valeria López',
  'Ana María Sánchez',
  'Diego Martín Pérez',
  'Lucía Fernanda Ramos',
  'Jorge Luis Castillo',
];

const ASESORES_ENTREGA = [
  'Mariana Salcedo Ibáñez',
  'Renzo Vidal Quispe',
  'Camila Herrera Zúñiga',
  'Fabián Rojas Medina',
];

const ESTADOS: Array<Pick<Assignment, 'estadoProceso' | 'estadoVehiculo' | 'documentacion'>> = [
  { estadoProceso: 'Pendiente de asignación', estadoVehiculo: 'Sin asignación', documentacion: 'Iniciada' },
  { estadoProceso: 'En Facturación', estadoVehiculo: 'Unidad asignada', documentacion: 'Iniciada' },
  { estadoProceso: 'En preparación TDP', estadoVehiculo: 'Unidad facturada', documentacion: 'Pendiente' },
  { estadoProceso: 'Preparación DLR', estadoVehiculo: 'Programado no entrega', documentacion: 'Pendiente' },
  { estadoProceso: 'Preparación DLR', estadoVehiculo: 'Entregado DLR', documentacion: 'Completada' },
  { estadoProceso: 'UIO', estadoVehiculo: 'En equipamiento', documentacion: 'Completada' },
];

function buildAssignment(index: number): Assignment {
  const estado = ESTADOS[index % ESTADOS.length];
  const hasSerie = estado.estadoProceso !== 'Pendiente de asignación';
  const hasAccesorios = ['En Facturación', 'En preparación TDP'].includes(estado.estadoProceso);

  return {
    id: `C20250${9876 + index}`,
    fechaFirmaContrato: `2025-10-${String(10 + (index % 15)).padStart(2, '0')}`,
    localEntrega: 'Local',
    nombreCliente: NOMBRES[index % NOMBRES.length],
    vehiculo: 'Corolla - versión',
    marca: 'TOYOTA',
    modelo: 'Corolla',
    serie: hasSerie ? '12345X' : '',
    placa: hasSerie ? 'ABC-123' : '',
    ruc: '12345678912',
    dealerEntrega: 'MITSUI-Mitsui C.C. Jockey Plaza',
    fechaEstado: '2026-09-15',
    estadoProceso: estado.estadoProceso,
    estadoVehiculo: estado.estadoVehiculo,
    documentacion: estado.documentacion,
    asesor: 'Antonio Torres Vargas',
    asesorEntrega: ASESORES_ENTREGA[index % ASESORES_ENTREGA.length],
    tieneAccesorios: hasAccesorios,

    vin: 'ABCDEFGH123456789',
    disponibilidad: 'Disponible',
    fechaDisponibilidad: '2026-09-15',
    fechaAsignacion: '2026-09-15',
    fechaFacturacion: '2026-09-15',
    fechaActivacion: '',
    duasFiles: [],
    facturaEnviada: false,

    fechaPreparacionPdi: '2026-09-16',
    fechaEntregaDealer: '2026-09-17',
    tdpEnviado: ['Preparación DLR', 'UIO'].includes(estado.estadoProceso),

    estadoUnidadDlr: estado.estadoProceso === 'Preparación DLR' || estado.estadoProceso === 'UIO'
      ? (estado.estadoVehiculo === 'Entregado DLR' || estado.estadoProceso === 'UIO' ? 'Unidad terminada' : 'En almacén DLR')
      : '',
    fechaUnidadTerminada: '2026-09-15',
    dlrEnviado: estado.estadoProceso === 'UIO',

    fechaInmatriculacion: '2026-09-10',
    fechaIngresoSunarp: '2026-09-11',
    fechaRecepcionTive: '2026-09-12',
    tiveFiles: [],
    fechaEnvioPlacaDlr: '2026-09-13',

    inicioSolicitudLunas: '2026-09-10',
    fechaEnvioPermisosDrl: '2026-09-11',
    fechaRecepcionTarjeta: '2026-09-12',
    tarjetaFiles: [],

    fechaEmisionSoat: '2026-09-10',
    fechaInclusionPoliza: '2026-09-11',
    soatFiles: [],
    polizaFiles: [],

    fechaUio: '2026-09-15',
    actaFiles: [],
    fechaEntregaCliente: '2026-09-15',
    imagenesFiles: [],
    comentariosEntrega: '',
    entregaEnviado: estado.estadoProceso === 'UIO',

    cotizacion: {
      ruc: '12345678912',
      razonSocial: 'Ana María S.',
      rubro: 'Rubro',
      nombres: 'Test A',
      telefono: '+51 987654321',
      email: 'anamaria.sanchez@gmail.com',
      dealerEntrega: 'Dealer',
      zonaOperacion: 'Local',
      kilometraje: '10000 km',
      comentariosAdicional: '',
      vehiculo: 'TOYOTA HILUX 4X4 D/C 1GD SR',
      marca: 'TOYOTA',
      modelo: 'HILUX',
      version: '2466 - 4X4 D/C 1GD SR',
      cantidadUnidades: '15 Unidades',
      plazo: '24 Meses',
      color: 'Gris',
    },
  };
}

export const mockAssignments: Assignment[] = Array.from({ length: 97 }, (_, i) => buildAssignment(i));
