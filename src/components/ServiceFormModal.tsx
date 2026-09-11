import { useEffect, useState } from 'react';
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
import type { MonedaServicio, ServiceRecord, TipoServicio, UploadedFile } from '../types';
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

const TIPO_SERVICIO_OPTIONS: TipoServicio[] = ['Preventivo', 'Correctivo', 'Siniestro'];
const MONEDA_OPTIONS: MonedaServicio[] = ['Soles', 'USD'];
const FRECUENCIA_OPTIONS = ['5000 km', '10000 km', '15000 km', '20000 km'];

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
  const [cobrarCliente, setCobrarCliente] = useState(true);
  const [comentario, setComentario] = useState('');

  const [imagenesFiles, setImagenesFiles] = useState<UploadedFile[]>([]);
  const [vistoBuenoFiles, setVistoBuenoFiles] = useState<UploadedFile[]>([]);
  const [cotizacionFiles, setCotizacionFiles] = useState<UploadedFile[]>([]);

  const [uploadTarget, setUploadTarget] = useState<'imagenes' | 'vistoBueno' | 'cotizacion' | null>(null);
  const [viewerTarget, setViewerTarget] = useState<'imagenes' | 'vistoBueno' | 'cotizacion' | null>(null);
  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setSerie(service?.serie ?? '');
      setPlaca(service?.placa ?? '');
      setFechaServicio(service?.fechaServicio ?? '');
      setTipoServicio(service?.tipoServicio ?? '');
      setFrecuencia(service?.frecuencia || '5000 km');
      setKilometraje(service?.kilometraje ?? '0');
      setTipoMoneda(service?.tipoMoneda ?? 'Soles');
      setMonto(service?.monto ?? '0.00');
      setDealer(service?.dealer ?? '');
      setLocal(service?.local ?? '');
      setCobrarCliente(service?.cobrarCliente ?? true);
      setComentario(service?.comentario ?? '');
      setImagenesFiles(service?.imagenesFiles ?? []);
      setVistoBuenoFiles(service?.vistoBuenoFiles ?? []);
      setCotizacionFiles(service?.cotizacionFiles ?? []);
    }
  }, [open, service]);

  const isPreventivo = tipoServicio === 'Preventivo';
  const isNew = !service;

  const canSave =
    serie.trim() !== '' &&
    placa.trim() !== '' &&
    fechaServicio !== '' &&
    tipoServicio !== '';

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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Serie*
              </Typography>
              <TextField fullWidth placeholder="12345-X" value={serie} onChange={(e) => setSerie(e.target.value)} disabled={!isNew} />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Placa*
              </Typography>
              <TextField fullWidth placeholder="ABC-123" value={placa} onChange={(e) => setPlaca(e.target.value)} disabled={!isNew} />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de servicio*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaServicio}
                onChange={(e) => setFechaServicio(e.target.value)}
                disabled={!isNew}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Tipo de servicio*
              </Typography>
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
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Frecuencia*
                </Typography>
                <FormControl fullWidth>
                  <Select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)}>
                    {FRECUENCIA_OPTIONS.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {!isPreventivo && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tipo de moneda*
                </Typography>
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
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Monto*
                </Typography>
                <TextField fullWidth value={monto} onChange={(e) => setMonto(e.target.value)} InputProps={{ startAdornment: '$' }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Kilometraje de ingreso*
              </Typography>
              <TextField fullWidth value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} />
            </Box>

            {isPreventivo && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tipo de moneda*
                </Typography>
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

            {isPreventivo && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Monto (incluye IGV)*
                </Typography>
                <TextField fullWidth value={monto} onChange={(e) => setMonto(e.target.value)} />
              </Box>
            )}

            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Dealer*
              </Typography>
              <TextField fullWidth placeholder="Dealer" value={dealer} onChange={(e) => setDealer(e.target.value)} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Local*
              </Typography>
              <TextField fullWidth placeholder="Local" value={local} onChange={(e) => setLocal(e.target.value)} />
            </Box>

            {!isPreventivo && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Cargar imágenes (.jpg)*
                </Typography>
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

            {!isPreventivo && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Visto bueno del cliente (.pdf, .jpg)*
                </Typography>
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
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Cargar cotización (.pdf)*
              </Typography>
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

          {!isPreventivo && (
            <FormControlLabel
              control={<Checkbox checked={cobrarCliente} onChange={(e) => setCobrarCliente(e.target.checked)} />}
              label="Cobrar cliente"
              sx={{ mb: 2 }}
            />
          )}

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Comentarios
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Agrega comentarios"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
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
        maxFiles={10}
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
        accept={['.pdf']}
        maxFiles={1}
        title="Adjuntar"
      />

      <FileViewerDialog open={viewerTarget === 'imagenes'} onClose={() => setViewerTarget(null)} title="Archivos" files={imagenesFiles} />
      <FileViewerDialog open={viewerTarget === 'vistoBueno'} onClose={() => setViewerTarget(null)} title="Archivos" files={vistoBuenoFiles} />
      <FileViewerDialog open={viewerTarget === 'cotizacion'} onClose={() => setViewerTarget(null)} title="Archivos" files={cotizacionFiles} />

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
