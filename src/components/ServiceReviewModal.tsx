import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import type { OrdenCompra, ServiceRecord, UploadedFile } from '../types';
import { AssignmentUploadDialog } from './AssignmentUploadDialog';
import { FileViewerDialog } from './FileViewerDialog';
import { ConfirmApproveServiceDialog } from './ConfirmApproveServiceDialog';
import { ConfirmRejectServiceDialog } from './ConfirmRejectServiceDialog';
import { SuccessDialog } from './SuccessDialog';

interface ServiceReviewModalProps {
  open: boolean;
  service: ServiceRecord | null;
  onClose: () => void;
  onApproved?: () => void;
  onRejected?: () => void;
  onSavedOc?: (ordenesCompra: OrdenCompra[]) => void;
  readOnly?: boolean;
  // HU028/HU029: una vez el servicio está Aprobado, el Asesor puede cargar OC
  // aunque el resto del formulario siga en solo lectura. Admin Kinto nunca
  // carga OC — solo puede descargar (readOnly=true sin ocEditable).
  ocEditable?: boolean;
}

export function ServiceReviewModal({
  open,
  service,
  onClose,
  onApproved,
  onRejected,
  onSavedOc,
  readOnly = false,
  ocEditable = false,
}: ServiceReviewModalProps) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ title: string; message: string } | null>(null);
  const [viewerTarget, setViewerTarget] = useState<'imagenes' | 'cotizacion' | 'vistoBueno' | null>(null);
  const [ocEntries, setOcEntries] = useState<OrdenCompra[]>([]);
  const [ocUploadIndex, setOcUploadIndex] = useState<number | null>(null);
  const [ocViewerIndex, setOcViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (open && service) {
      setOcEntries(service.ordenesCompra ?? []);
    }
  }, [open, service]);

  if (!service) return null;

  const isPreventivo = service.tipoServicio === 'Preventivo';
  const isCorrectivo = service.tipoServicio === 'Correctivo';
  const isCarroceria = service.tipoServicio === 'Carrocería y Pintura';
  const isCambioNeumaticos = service.tipoServicio === 'Cambio de neumáticos';
  const isAprobado = service.estadoOT === 'Aprobado';

  const addOcEntry = () => {
    setOcEntries((prev) => [...prev, { id: `oc-${Date.now()}-${prev.length}`, numero: '', file: null }]);
  };
  const updateOcNumero = (index: number, value: string) => {
    setOcEntries((prev) => prev.map((e, i) => (i === index ? { ...e, numero: value } : e)));
  };
  const handleOcFileUpload = (files: UploadedFile[]) => {
    if (ocUploadIndex === null) return;
    setOcEntries((prev) => prev.map((e, i) => (i === ocUploadIndex ? { ...e, file: files[0] ?? null } : e)));
    setOcUploadIndex(null);
  };
  const handleSaveOc = () => {
    onSavedOc?.(ocEntries);
    setSuccessInfo({ title: 'Órdenes de compra guardadas', message: 'La información se guardó correctamente.' });
    setSuccessOpen(true);
  };

  const handleConfirmApprove = () => {
    setApproveOpen(false);
    onApproved?.();
    setSuccessInfo({ title: 'Servicio aprobado', message: 'La información se guardó correctamente y el estado fue actualizado.' });
    setSuccessOpen(true);
  };

  const handleConfirmReject = () => {
    setRejectOpen(false);
    onRejected?.();
    setSuccessInfo({ title: 'Servicio rechazado', message: 'El servicio fue rechazado correctamente.' });
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
            Servicio
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Field label="Serie*" value={service.serie} />
            <Field label="Placa*" value={service.placa} />
            <Field label="Fecha de servicio*" value={service.fechaServicio} type="date" />
          </Box>

          {isPreventivo && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de servicio*" value={service.tipoServicio} />
                <Field label="Frecuencia*" value={service.frecuencia} />
                <Field label="Kilometraje de ingreso*" value={service.kilometraje} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de moneda*" value={service.tipoMoneda} />
                <Field label="Monto (incluye IGV)*" value={service.monto} />
                <Field label="Dealer*" value={service.dealer} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Local*" value={service.local} />
                <AttachField label="Cargar cotización (.pdf)*" onClick={() => setViewerTarget('cotizacion')} />
              </Box>
            </>
          )}

          {isCorrectivo && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de servicio*" value={service.tipoServicio} />
                <Field label="Tipo de moneda*" value={service.tipoMoneda} />
                <Field label="Monto*" value={service.monto} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Kilometraje de ingreso*" value={service.kilometraje} />
                <Field label="Dealer*" value={service.dealer} />
                <Field label="Local*" value={service.local} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <AttachField label="Cargar imágenes (.jpg)*" onClick={() => setViewerTarget('imagenes')} />
                <AttachField label="Visto bueno del cliente (.pdf, .jpg)*" onClick={() => setViewerTarget('vistoBueno')} />
                <AttachField label="Cargar cotización (.pdf)*" onClick={() => setViewerTarget('cotizacion')} />
              </Box>
              <FormControlLabel
                control={<Checkbox checked={service.cobrarCliente} disabled />}
                label="Cobrar cliente"
                sx={{ mb: 2 }}
              />
            </>
          )}

          {isCarroceria && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Fecha de ingreso a reparación*" value={service.fechaIngresoReparacion ?? ''} type="date" />
                <Field label="Fecha de salida de reparación*" value={service.fechaSalidaReparacion ?? ''} type="date" />
                <Field label="Tipo de servicio*" value={service.tipoServicio} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de moneda*" value={service.tipoMoneda} />
                <Field label="Monto*" value={service.monto} />
                <Field label="Kilometraje de ingreso*" value={service.kilometraje} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Dealer*" value={service.dealer} />
                <Field label="Local*" value={service.local} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <AttachField label="Cargar imágenes (.jpg)*" onClick={() => setViewerTarget('imagenes')} />
                <AttachField label="Visto bueno del cliente (.pdf, .jpg)*" onClick={() => setViewerTarget('vistoBueno')} />
                <AttachField label="Cargar cotización (.pdf)*" onClick={() => setViewerTarget('cotizacion')} />
              </Box>
              <FormControlLabel
                control={<Checkbox checked={!!service.seAtendioSeguro} disabled />}
                label="¿Se atendió por el seguro?"
                sx={{ mb: 1 }}
              />
              {service.seAtendioSeguro && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                  <Field label="N° Siniestro" value={service.numeroSiniestro ?? ''} />
                  <Field label="Fecha de siniestro" value={service.fechaSiniestro ?? ''} type="date" />
                  <Field label="Monto deducible (USD)*" value={service.montoDeducible ?? ''} />
                </Box>
              )}
            </>
          )}

          {isCambioNeumaticos && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de servicio*" value={service.tipoServicio} />
                <Field label="Frecuencia de cambio" value={service.frecuenciaCambio ?? ''} />
                <Field label="Km último cambio" value={service.kmUltimoCambio ?? ''} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Tipo de moneda*" value={service.tipoMoneda} />
                <Field label="Monto*" value={service.monto} />
                <Field label="Kilometraje de ingreso*" value={service.kilometraje} />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Field label="Dealer*" value={service.dealer} />
                <Field label="Local*" value={service.local} />
                <AttachField label="Cargar cotización (.pdf)*" onClick={() => setViewerTarget('cotizacion')} />
              </Box>
            </>
          )}

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Comentarios*
          </Typography>
          <TextField fullWidth value={service.comentario} disabled placeholder="Agrega comentarios" />

          {isAprobado && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Órdenes de compra
              </Typography>
              {ocEntries.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Aún no se han registrado órdenes de compra.
                </Typography>
              )}
              {ocEntries.map((oc, index) => (
                <Box key={oc.id} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'flex-end' }}>
                  <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      N° de orden de compra
                    </Typography>
                    <TextField
                      fullWidth
                      value={oc.numero}
                      disabled={!ocEditable}
                      onChange={(e) => updateOcNumero(index, e.target.value)}
                      placeholder="N° OC"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                    {ocEditable ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        sx={{ justifyContent: 'space-between' }}
                        onClick={() => setOcUploadIndex(index)}
                      >
                        {oc.file ? 'Reemplazar archivo' : 'Cargar archivo'}
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        endIcon={<DownloadIcon />}
                        sx={{ justifyContent: 'space-between' }}
                        disabled={!oc.file}
                        onClick={() => setOcViewerIndex(index)}
                      >
                        Descargar
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
              {ocEditable && (
                <Button startIcon={<AddIcon />} onClick={addOcEntry} sx={{ mb: 1 }}>
                  Agregar orden de compra
                </Button>
              )}
            </Box>
          )}
        </DialogContent>
        {!readOnly && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setRejectOpen(true)} variant="outlined" color="inherit">
              Rechazar
            </Button>
            <Button onClick={() => setApproveOpen(true)} variant="contained" color="secondary">
              Aprobar
            </Button>
          </DialogActions>
        )}
        {readOnly && isAprobado && ocEditable && (
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleSaveOc} variant="contained" color="secondary">
              Guardar OC
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <FileViewerDialog
        open={viewerTarget === 'imagenes'}
        onClose={() => setViewerTarget(null)}
        title="Archivos"
        files={service.imagenesFiles}
      />
      <FileViewerDialog
        open={viewerTarget === 'cotizacion'}
        onClose={() => setViewerTarget(null)}
        title="Archivos"
        files={service.cotizacionFiles}
      />
      <FileViewerDialog
        open={viewerTarget === 'vistoBueno'}
        onClose={() => setViewerTarget(null)}
        title="Archivos"
        files={service.vistoBuenoFiles}
      />

      <AssignmentUploadDialog
        open={ocUploadIndex !== null}
        onClose={() => setOcUploadIndex(null)}
        onUpload={handleOcFileUpload}
        title="Cargar orden de compra"
        accept={['.pdf', '.xlsx', '.xls']}
        maxFiles={1}
      />
      <FileViewerDialog
        open={ocViewerIndex !== null}
        onClose={() => setOcViewerIndex(null)}
        title="Archivos"
        files={ocViewerIndex !== null && ocEntries[ocViewerIndex]?.file ? [ocEntries[ocViewerIndex]!.file as UploadedFile] : []}
      />

      <ConfirmApproveServiceDialog
        open={approveOpen}
        onCancel={() => setApproveOpen(false)}
        onConfirm={handleConfirmApprove}
      />
      <ConfirmRejectServiceDialog
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onConfirm={handleConfirmReject}
      />
      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title={successInfo?.title}
        message={successInfo?.message}
      />
    </>
  );
}

function Field({ label, value, type }: { label: string; value: string; type?: string }) {
  return (
    <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <TextField fullWidth value={value} disabled type={type} InputLabelProps={type === 'date' ? { shrink: true } : undefined} />
    </Box>
  );
}

function AttachField({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        sx={{ justifyContent: 'space-between' }}
        onClick={onClick}
      >
        Archivos
      </Button>
    </Box>
  );
}
