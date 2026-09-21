import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import type { MonedaServicio, OrdenCompra, ServiceRecord, TipoServicio, UploadedFile } from '../types';
import { AssignmentUploadDialog } from './AssignmentUploadDialog';
import { FileViewerDialog } from './FileViewerDialog';
import { SuccessDialog } from './SuccessDialog';
import { PartialSaveDialog } from './PartialSaveDialog';

interface ServiceFormModalProps {
  open: boolean;
  service: ServiceRecord | null; // null => nuevo servicio
  onClose: () => void;
  onSaved: (data: Partial<ServiceRecord>) => void;
}

const TIPO_SERVICIO_OPTIONS: TipoServicio[] = ['Preventivo', 'Correctivo', 'Carrocería y Pintura', 'Cambio de neumáticos'];
const MONEDA_OPTIONS: MonedaServicio[] = ['Soles', 'USD'];

// Frecuencia de mantenimiento: Lexus cada 10 mil km hasta 200 mil, el resto cada 5 mil km hasta 200 mil.
function getFrecuenciaOptions(marca?: string): string[] {
  const step = marca?.toLowerCase() === 'lexus' ? 10000 : 5000;
  const options: string[] = [];
  for (let km = step; km <= 200000; km += step) {
    options.push(`${km} km`);
  }
  return options;
}

// Tarifario mock: monto de mantenimiento preventivo según frecuencia (incluye IGV).
// TODO: reemplazar por el lookup real del tarifario (depende de versión + frecuencia) cuando exista el módulo Admin/Tarifario.
const MOCK_TARIFARIO_PREVENTIVO: Record<string, string> = {
  '5000 km': '180.00',
  '10000 km': '320.00',
  '15000 km': '250.00',
  '20000 km': '380.00',
};

function getMontoPreventivo(frecuencia: string): string {
  return MOCK_TARIFARIO_PREVENTIVO[frecuencia] ?? '200.00';
}

// Mismas opciones que en el filtro de Asignaciones (src/config/assignmentFilters.ts),
// para mantener consistencia mientras no exista un catálogo real de dealers/locales.
const DEALER_OPTIONS = ['Dealer Lima', 'Dealer Arequipa'];
const LOCAL_OPTIONS = ['Local Norte', 'Local Sur'];

// Mock del usuario logeado (Asesor) — mientras no exista un módulo de sesión real,
// se usa como valor por defecto de Dealer/Local al crear un servicio nuevo.
const CURRENT_USER_DEALER = DEALER_OPTIONS[0];
const CURRENT_USER_LOCAL = LOCAL_OPTIONS[0];

function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayISO(): string {
  return formatDateLocal(new Date());
}

// Confirmado por Ale: "Fecha de servicio" para Preventivo tiene corte cada 7.
// Del 1 al 7 del mes: se habilita todo el mes anterior + los primeros 7 días del mes actual.
// Del 8 en adelante: se habilita solo el mes actual completo. Domingos siempre deshabilitados.
function getPreventivoFechaBounds(): { min: string; max: string } {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  if (day <= 7) {
    return {
      min: formatDateLocal(new Date(year, month - 1, 1)),
      max: formatDateLocal(new Date(year, month, 7)),
    };
  }
  return {
    min: formatDateLocal(new Date(year, month, 1)),
    max: formatDateLocal(new Date(year, month + 1, 0)),
  };
}

// Confirmado por Ale: "Fecha de servicio" para Correctivo queda activa desde
// 2 meses atrás hasta fin del mes actual (ej. si estamos en septiembre: julio, agosto, septiembre).
function getCorrectivoFechaBounds(): { min: string; max: string } {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  return {
    min: formatDateLocal(new Date(year, month - 2, 1)),
    max: formatDateLocal(new Date(year, month + 1, 0)),
  };
}

// Autocompletado VIN <-> Placa: simulación para el demo (no hay integración real
// con un registro de vehículos todavía). A partir de 3 caracteres en un campo,
// se deriva un valor mock para el otro y se deshabilita mientras tanto.
function derivePlacaFromVin(vin: string): string {
  const clean = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const letters = (clean.match(/[A-Z]/g) ?? ['A', 'B', 'C']).slice(0, 3).join('').padEnd(3, 'X');
  const digits = (clean.match(/[0-9]/g) ?? ['1', '2', '3']).slice(0, 3).join('').padEnd(3, '0');
  return `${letters}-${digits}`;
}

function deriveVinFromPlaca(placa: string): string {
  const clean = placa.toUpperCase().replace(/[^A-Z0-9]/g, '').padEnd(6, '0');
  return `${clean}00000000000`.slice(0, 17);
}

/** Label de campo: si termina en "*" (obligatorio), el asterisco se muestra en rojo. */
function FieldLabel({ text }: { text: string }) {
  const isRequired = text.trim().endsWith('*');
  const base = isRequired ? text.trim().slice(0, -1) : text;
  return (
    <Typography variant="subtitle2" sx={{ mb: 1 }}>
      {base}
      {isRequired && (
        <Box component="span" sx={{ color: 'error.main' }}>
          *
        </Box>
      )}
    </Typography>
  );
}

export function ServiceFormModal({ open, service, onClose, onSaved }: ServiceFormModalProps) {
  const [serie, setSerie] = useState('');
  const [placa, setPlaca] = useState('');
  const [fechaServicio, setFechaServicio] = useState('');
  const [tipoServicio, setTipoServicio] = useState<TipoServicio | ''>('');
  const [frecuencia, setFrecuencia] = useState('5000 km');
  const [kilometraje, setKilometraje] = useState('0');
  const [tipoMoneda, setTipoMoneda] = useState<MonedaServicio>('Soles');
  const [monto, setMonto] = useState('0.00');
  const [dealer, setDealer] = useState('');
  const [local, setLocal] = useState('');
  const [placaAutoDisabled, setPlacaAutoDisabled] = useState(false);
  const [vinAutoDisabled, setVinAutoDisabled] = useState(false);
  const [fechaServicioError, setFechaServicioError] = useState('');
  const [cobrarCliente, setCobrarCliente] = useState(true);
  const [comentario, setComentario] = useState('');

  // Carrocería y Pintura (HU027-3)
  const [fechaIngresoReparacion, setFechaIngresoReparacion] = useState('');
  const [fechaSalidaReparacion, setFechaSalidaReparacion] = useState('');
  const [fechaSalidaError, setFechaSalidaError] = useState('');
  const [seAtendioSeguro, setSeAtendioSeguro] = useState(false);
  const [numeroSiniestro, setNumeroSiniestro] = useState('');
  const [fechaSiniestro, setFechaSiniestro] = useState('');
  const [montoDeducible, setMontoDeducible] = useState('');

  // Cambio de neumáticos (HU027-4)
  const [kmUltimoCambio, setKmUltimoCambio] = useState('0');

  const [imagenesFiles, setImagenesFiles] = useState<UploadedFile[]>([]);
  const [vistoBuenoFiles, setVistoBuenoFiles] = useState<UploadedFile[]>([]);
  const [cotizacionFiles, setCotizacionFiles] = useState<UploadedFile[]>([]);
  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>([]);
  const [ocUploadIndex, setOcUploadIndex] = useState<number | null>(null);
  const [ocViewerIndex, setOcViewerIndex] = useState<number | null>(null);

  const [uploadTarget, setUploadTarget] = useState<'imagenes' | 'vistoBueno' | 'cotizacion' | null>(null);
  const [viewerTarget, setViewerTarget] = useState<'imagenes' | 'vistoBueno' | 'cotizacion' | null>(null);
  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const isNew = !service;
  const isPreventivo = tipoServicio === 'Preventivo';
  const isCorrectivo = tipoServicio === 'Correctivo';
  const isCarroceria = tipoServicio === 'Carrocería y Pintura';
  const isCambioNeumaticos = tipoServicio === 'Cambio de neumáticos';

  // Remanente = ((km ingreso - km último cambio) / frecuencia) * monto — HU027-4.
  const remanente = useMemo(() => {
    if (!isCambioNeumaticos) return 0;
    const kmi = parseFloat(kilometraje) || 0;
    const kmu = parseFloat(kmUltimoCambio) || 0;
    const freq = parseFloat(frecuencia) || 0;
    const montoNum = parseFloat(monto) || 0;
    if (freq <= 0) return 0;
    return ((kmi - kmu) / freq) * montoNum;
  }, [isCambioNeumaticos, kilometraje, kmUltimoCambio, frecuencia, monto]);

  const frecuenciaOptions = useMemo(() => getFrecuenciaOptions(service?.marca), [service?.marca]);

  useEffect(() => {
    if (open) {
      const initialFrecuencia = service?.frecuencia || getFrecuenciaOptions(service?.marca)[0];
      setSerie(service?.serie ?? '');
      setPlaca(service?.placa ?? '');
      setFechaServicio(service?.fechaServicio || todayISO());
      setTipoServicio(service?.tipoServicio ?? '');
      setFrecuencia(initialFrecuencia);
      setKilometraje(service?.kilometraje ?? '0');
      setTipoMoneda(service?.tipoMoneda ?? 'Soles');
      setMonto(service?.tipoServicio === 'Preventivo' ? getMontoPreventivo(initialFrecuencia) : (service?.monto ?? '0.00'));
      setDealer(service?.dealer ?? CURRENT_USER_DEALER);
      setLocal(service?.local ?? CURRENT_USER_LOCAL);
      setPlacaAutoDisabled(false);
      setVinAutoDisabled(false);
      setFechaServicioError('');
      setCobrarCliente(service?.cobrarCliente ?? true);
      setComentario(service?.comentario ?? '');
      setImagenesFiles(service?.imagenesFiles ?? []);
      setVistoBuenoFiles(service?.vistoBuenoFiles ?? []);
      setCotizacionFiles(service?.cotizacionFiles ?? []);
      setOrdenesCompra(service?.ordenesCompra ?? []);
      setFechaIngresoReparacion(service?.fechaIngresoReparacion ?? '');
      setFechaSalidaReparacion(service?.fechaSalidaReparacion ?? '');
      setFechaSalidaError('');
      setSeAtendioSeguro(service?.seAtendioSeguro ?? false);
      setNumeroSiniestro(service?.numeroSiniestro ?? '');
      setFechaSiniestro(service?.fechaSiniestro ?? '');
      setMontoDeducible(service?.montoDeducible ?? '');
      setKmUltimoCambio(service?.kmUltimoCambio ?? '0');
    }
  }, [open, service]);

  // Preventivo: moneda fija en Soles y monto auto-calculado desde el tarifario — no editables.
  useEffect(() => {
    if (isPreventivo) {
      setTipoMoneda('Soles');
      setMonto(getMontoPreventivo(frecuencia));
    }
  }, [isPreventivo, frecuencia]);

  // Cambio de neumáticos: moneda por defecto USD al crear (queda editable, a
  // diferencia de Preventivo donde la moneda es fija).
  useEffect(() => {
    if (isNew && isCambioNeumaticos) {
      setTipoMoneda('USD');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, isCambioNeumaticos]);

  const handleVinChange = (value: string) => {
    setSerie(value);
    if (value.trim().length >= 3) {
      setPlaca(derivePlacaFromVin(value));
      setPlacaAutoDisabled(true);
    } else if (placaAutoDisabled) {
      setPlaca('');
      setPlacaAutoDisabled(false);
    }
  };

  const handlePlacaChange = (value: string) => {
    setPlaca(value);
    if (value.trim().length >= 3) {
      setSerie(deriveVinFromPlaca(value));
      setVinAutoDisabled(true);
    } else if (vinAutoDisabled) {
      setSerie('');
      setVinAutoDisabled(false);
    }
  };

  const handleFechaServicioChange = (value: string) => {
    if (value && (isPreventivo || isCorrectivo)) {
      const [y, m, d] = value.split('-').map(Number);
      if (new Date(y, m - 1, d).getDay() === 0) {
        setFechaServicioError('Los domingos no están disponibles. Elige otro día.');
        return;
      }
      const bounds = isPreventivo ? getPreventivoFechaBounds() : getCorrectivoFechaBounds();
      if (value < bounds.min || value > bounds.max) {
        setFechaServicioError('La fecha está fuera del plazo habilitado. Si necesitas registrarla igual, contacta a soporte.');
        setFechaServicio(value);
        return;
      }
    }
    setFechaServicioError('');
    setFechaServicio(value);
  };

  const handleFechaSalidaChange = (value: string) => {
    if (value && fechaIngresoReparacion && value < fechaIngresoReparacion) {
      setFechaSalidaError('La fecha de salida no puede ser menor a la fecha de ingreso.');
      setFechaSalidaReparacion(value);
      return;
    }
    setFechaSalidaError('');
    setFechaSalidaReparacion(value);
  };

  const addOcEntry = () => {
    setOrdenesCompra((prev) => [...prev, { id: `oc-${Date.now()}-${prev.length}`, numero: '', file: null }]);
  };
  const updateOcNumero = (index: number, value: string) => {
    setOrdenesCompra((prev) => prev.map((e, i) => (i === index ? { ...e, numero: value } : e)));
  };
  const handleOcFileUpload = (files: UploadedFile[]) => {
    if (ocUploadIndex === null) return;
    setOrdenesCompra((prev) => prev.map((e, i) => (i === ocUploadIndex ? { ...e, file: files[0] ?? null } : e)));
    setOcUploadIndex(null);
  };

  const canSave =
    serie.trim() !== '' &&
    placa.trim() !== '' &&
    tipoServicio !== '' &&
    (isCarroceria
      ? fechaIngresoReparacion !== '' &&
        fechaSalidaReparacion !== '' &&
        !fechaSalidaError &&
        (!seAtendioSeguro || montoDeducible.trim() !== '')
      : fechaServicio !== '');

  const handleGuardarClick = () => {
    if (!canSave) return;
    setPartialSaveOpen(true);
  };

  const handleConfirmPartialSave = () => {
    setPartialSaveOpen(false);
    onSaved({
      serie,
      placa,
      fechaServicio,
      tipoServicio: tipoServicio as TipoServicio,
      frecuencia,
      kilometraje,
      tipoMoneda,
      monto,
      dealer,
      local,
      cobrarCliente,
      comentario,
      imagenesFiles,
      vistoBuenoFiles,
      cotizacionFiles,
      ordenesCompra,
      fechaIngresoReparacion,
      fechaSalidaReparacion,
      seAtendioSeguro,
      numeroSiniestro,
      fechaSiniestro,
      montoDeducible,
      frecuenciaCambio: frecuencia,
      kmUltimoCambio,
      estadoOT: 'Por validar',
    });
    setSuccessOpen(true);
  };

  const handleSuccessAccept = () => {
    setSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {isNew ? 'Nuevo servicio' : 'Editar servicio'}
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="VIN*" />
              <TextField
                fullWidth
                placeholder="12345-X"
                value={serie}
                onChange={(e) => handleVinChange(e.target.value)}
                disabled={!isNew || vinAutoDisabled}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Placa*" />
              <TextField
                fullWidth
                placeholder="ABC-123"
                value={placa}
                onChange={(e) => handlePlacaChange(e.target.value)}
                disabled={!isNew || placaAutoDisabled}
              />
            </Box>
            {isCarroceria ? (
              <>
                <Box sx={{ minWidth: 0 }}>
                  <FieldLabel text="Fecha de ingreso a reparación*" />
                  <TextField
                    fullWidth
                    type="date"
                    value={fechaIngresoReparacion}
                    onChange={(e) => setFechaIngresoReparacion(e.target.value)}
                    disabled={!isNew}
                  />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <FieldLabel text="Fecha de salida de reparación*" />
                  <TextField
                    fullWidth
                    type="date"
                    value={fechaSalidaReparacion}
                    onChange={(e) => handleFechaSalidaChange(e.target.value)}
                    disabled={!isNew}
                    error={!!fechaSalidaError}
                    helperText={fechaSalidaError || undefined}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Fecha de servicio*" />
                <TextField
                  fullWidth
                  type="date"
                  value={fechaServicio}
                  onChange={(e) => handleFechaServicioChange(e.target.value)}
                  disabled={!isNew}
                  error={!!fechaServicioError}
                  helperText={fechaServicioError || undefined}
                  inputProps={
                    isNew
                      ? isPreventivo
                        ? getPreventivoFechaBounds()
                        : isCorrectivo
                          ? getCorrectivoFechaBounds()
                          : undefined
                      : undefined
                  }
                />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Tipo de servicio*" />
              <FormControl fullWidth>
                <Select
                  displayEmpty
                  value={tipoServicio}
                  onChange={(e) => setTipoServicio(e.target.value as TipoServicio)}
                  renderValue={(selected) =>
                    selected || <Typography sx={{ color: 'text.disabled' }}>Selecciona</Typography>
                  }
                >
                  {TIPO_SERVICIO_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {isPreventivo && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Frecuencia*" />
                <FormControl fullWidth>
                  <Select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
                    {frecuenciaOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {!isPreventivo && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Tipo de moneda*" />
                <FormControl fullWidth>
                  <Select value={tipoMoneda} onChange={(e) => setTipoMoneda(e.target.value as MonedaServicio)}>
                    {MONEDA_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {!isPreventivo && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Monto (sin IGV)*" />
                <TextField fullWidth value={monto} onChange={(e) => setMonto(e.target.value)} InputProps={{ startAdornment: '$' }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Kilometraje de ingreso*" />
              <TextField fullWidth value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} />
            </Box>

            {isPreventivo && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Tipo de moneda*" />
                <TextField fullWidth value={tipoMoneda} disabled />
              </Box>
            )}

            {isPreventivo && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Monto (incluye IGV)*" />
                <TextField fullWidth value={monto} disabled InputProps={{ startAdornment: 'S/ ' }} />
              </Box>
            )}

            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Dealer*" />
              <FormControl fullWidth>
                <Select value={dealer} onChange={(e) => setDealer(e.target.value)}>
                  {Array.from(new Set([...DEALER_OPTIONS, dealer].filter(Boolean))).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Local*" />
              <FormControl fullWidth>
                <Select value={local} onChange={(e) => setLocal(e.target.value)}>
                  {Array.from(new Set([...LOCAL_OPTIONS, local].filter(Boolean))).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {(isCorrectivo || isCarroceria) && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Cargar imágenes (.jpg, máx. 5)*" />
                {imagenesFiles.length > 0 ? (
                  <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setViewerTarget('imagenes')}>
                    Archivos
                  </Button>
                ) : (
                  <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setUploadTarget('imagenes')}>
                    Subir
                  </Button>
                )}
              </Box>
            )}

            {(isCorrectivo || isCarroceria || (isCambioNeumaticos && remanente > 0)) && (
              <Box sx={{ minWidth: 0 }}>
                <FieldLabel text="Visto bueno del cliente (.pdf, .jpg)*" />
                {vistoBuenoFiles.length > 0 ? (
                  <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setViewerTarget('vistoBueno')}>
                    Archivos
                  </Button>
                ) : (
                  <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setUploadTarget('vistoBueno')}>
                    Subir
                  </Button>
                )}
              </Box>
            )}

            {isCambioNeumaticos && (
              <>
                <Box sx={{ minWidth: 0 }}>
                  <FieldLabel text="Frecuencia de cambio" />
                  <TextField fullWidth value={frecuencia} disabled />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <FieldLabel text="Km último cambio" />
                  <TextField fullWidth value={kmUltimoCambio} onChange={(e) => setKmUltimoCambio(e.target.value)} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <FieldLabel text="Remanente" />
                  <TextField fullWidth value={remanente.toFixed(2)} disabled InputProps={{ startAdornment: tipoMoneda === 'USD' ? '$' : 'S/ ' }} />
                </Box>
              </>
            )}
          </Box>

          {isCarroceria && (
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={seAtendioSeguro}
                    onChange={(e) => setSeAtendioSeguro(e.target.checked)}
                  />
                }
                label="¿Se atendió por el seguro?"
              />
              {seAtendioSeguro && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2, mt: 1 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <FieldLabel text="N° Siniestro" />
                    <TextField
                      fullWidth
                      value={numeroSiniestro}
                      onChange={(e) => setNumeroSiniestro(e.target.value)}
                      placeholder="Puede completarla Kinto operaciones"
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <FieldLabel text="Fecha de siniestro" />
                    <TextField
                      fullWidth
                      type="date"
                      value={fechaSiniestro}
                      onChange={(e) => setFechaSiniestro(e.target.value)}
                    />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <FieldLabel text="Monto deducible (USD)*" />
                    <TextField
                      fullWidth
                      value={montoDeducible}
                      onChange={(e) => setMontoDeducible(e.target.value)}
                      InputProps={{ startAdornment: '$' }}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Cargar cotización sí va en la vista de creación (antes faltaba). Comentarios
              solo aparece al editar un servicio ya registrado. */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <FieldLabel text="Cargar cotización (.pdf, .xlsx, .zip)*" />
              {cotizacionFiles.length > 0 ? (
                <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setViewerTarget('cotizacion')}>
                  Archivos
                </Button>
              ) : (
                <Button fullWidth variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ justifyContent: 'space-between' }} onClick={() => setUploadTarget('cotizacion')}>
                  Subir
                </Button>
              )}
            </Box>
          </Box>

          {(isPreventivo || isCorrectivo || isCarroceria) && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Carga de OC
              </Typography>
              {ordenesCompra.map((oc, index) => (
                <Box key={oc.id} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={oc.numero}
                    onChange={(e) => updateOcNumero(index, e.target.value)}
                    placeholder="N° OC"
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ justifyContent: 'space-between' }}
                    onClick={() => (oc.file ? setOcViewerIndex(index) : setOcUploadIndex(index))}
                  >
                    {oc.file ? 'Archivo' : 'Subir'}
                  </Button>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={addOcEntry}>
                Agregar orden de compra
              </Button>
            </Box>
          )}

          {!isNew && (
            <>
              <FieldLabel text="Comentarios" />
              <TextField
                fullWidth
                multiline
                minRows={2}
                placeholder="Agrega comentarios"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                sx={{ mb: isCorrectivo ? 2 : 0 }}
              />
            </>
          )}

        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleGuardarClick} variant="contained" color="secondary" disabled={!canSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <AssignmentUploadDialog
        open={uploadTarget === 'imagenes'}
        onClose={() => setUploadTarget(null)}
        onUpload={(files) => setImagenesFiles((prev) => [...prev, ...files])}
        accept={['.jpg', '.png']}
        maxFiles={5}
        title="Adjuntar"
      />
      <AssignmentUploadDialog
        open={uploadTarget === 'vistoBueno'}
        onClose={() => setUploadTarget(null)}
        onUpload={(files) => setVistoBuenoFiles((prev) => [...prev, ...files])}
        accept={['.pdf', '.jpg']}
        maxFiles={1}
        title="Adjuntar"
      />
      <AssignmentUploadDialog
        open={uploadTarget === 'cotizacion'}
        onClose={() => setUploadTarget(null)}
        onUpload={(files) => setCotizacionFiles((prev) => [...prev, ...files])}
        accept={['.pdf', '.xlsx', '.xls', '.zip']}
        maxFiles={1}
        title="Adjuntar"
      />

      <FileViewerDialog open={viewerTarget === 'imagenes'} onClose={() => setViewerTarget(null)} title="Archivos" files={imagenesFiles} />
      <FileViewerDialog open={viewerTarget === 'vistoBueno'} onClose={() => setViewerTarget(null)} title="Archivos" files={vistoBuenoFiles} />
      <FileViewerDialog open={viewerTarget === 'cotizacion'} onClose={() => setViewerTarget(null)} title="Archivos" files={cotizacionFiles} />

      <AssignmentUploadDialog
        open={ocUploadIndex !== null}
        onClose={() => setOcUploadIndex(null)}
        onUpload={handleOcFileUpload}
        accept={['.pdf']}
        maxFiles={1}
        title="Cargar orden de compra"
      />
      <FileViewerDialog
        open={ocViewerIndex !== null}
        onClose={() => setOcViewerIndex(null)}
        title="Archivos"
        files={ocViewerIndex !== null && ordenesCompra[ocViewerIndex]?.file ? [ordenesCompra[ocViewerIndex]!.file as UploadedFile] : []}
      />

      <PartialSaveDialog
        open={partialSaveOpen}
        onCancel={() => setPartialSaveOpen(false)}
        onSave={handleConfirmPartialSave}
      />

      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title="Datos guardados"
        message={
          isNew
            ? 'La información se guardó correctamente y el estado fue actualizado.'
            : 'La información se guardó correctamente.'
        }
      />
    </>
  );
}
