import { useState } from 'react';
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
import type { ServiceRecord } from '../types';
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
  readOnly?: boolean;
}

export function ServiceReviewModal({ open, service, onClose, onApproved, onRejected, readOnly = false }: ServiceReviewModalProps) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ title: string; message: string } | null>(null);
  const [viewerTarget, setViewerTarget] = useState<'imagenes' | 'cotizacion' | 'vistoBueno' | null>(null);

  if (!service) return null;

  const isPreventivo = service.tipoServicio === 'Preventivo';

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

          {isPreventivo ? (
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
          ) : (
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

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Comentarios*
          </Typography>
          <TextField fullWidth value={service.comentario} disabled placeholder="Agrega comentarios" />
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
