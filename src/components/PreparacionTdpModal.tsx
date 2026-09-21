import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import type { Assignment } from '../types';
import { useRole } from '../context/RoleContext';
import { PartialSaveDialog } from './PartialSaveDialog';
import { ConfirmSendDialog } from './ConfirmSendDialog';
import { SuccessDialog } from './SuccessDialog';

interface PreparacionTdpModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
  onSent: () => void;
}

/**
 * Preparación TDP — según HU017: la llena el Administrador Kinto (escenario 1);
 * Asesor y Administrador Local solo visualizan, sin poder editar (escenario 3).
 */
export function PreparacionTdpModal({ open, assignment, onClose, onSaved, onSent }: PreparacionTdpModalProps) {
  const { role } = useRole();
  const isViewerRole = role !== 'Admin_Kinto';

  const [fechaPreparacionPdi, setFechaPreparacionPdi] = useState('');
  const [fechaEntregaDealer, setFechaEntregaDealer] = useState('');
  const [enviado, setEnviado] = useState(false);

  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (open && assignment) {
      setFechaPreparacionPdi(assignment.fechaPreparacionPdi);
      setFechaEntregaDealer(assignment.fechaEntregaDealer);
      setEnviado(assignment.tdpEnviado);
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const isLocked = enviado || isViewerRole;

  const handleGuardarClick = () => setPartialSaveOpen(true);

  const handleConfirmPartialSave = () => {
    setPartialSaveOpen(false);
    onSaved();
    setSuccessMessage({
      title: 'Datos guardados',
      message: 'La información de se guardó correctamente.',
    });
    setSuccessOpen(true);
  };

  const handleEnviarClick = () => setConfirmSendOpen(true);

  const handleConfirmSend = () => {
    setConfirmSendOpen(false);
    setEnviado(true);
    onSent();
    setSuccessMessage({
      title: 'Datos actualizados',
      message: 'La información de la tabla se actualizó.',
    });
    setSuccessOpen(true);
  };

  const handleSuccessAccept = () => {
    setSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Preparación TDP
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarIcon color="action" />
              <Typography variant="subtitle1" fontWeight="bold">
                Serie {assignment.serie || '—'}
              </Typography>
            </Box>
            <Chip
              label={enviado ? 'Entregado DLR' : 'Unidad Facturada'}
              size="small"
              color={enviado ? 'success' : 'info'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de preparación PDI*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaPreparacionPdi}
                onChange={(e) => setFechaPreparacionPdi(e.target.value)}
                disabled={isLocked}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de entrega dealer*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaEntregaDealer}
                onChange={(e) => setFechaEntregaDealer(e.target.value)}
                disabled={isLocked}
              />
            </Box>
          </Box>
        </DialogContent>
        {!isViewerRole && (
          <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-start' }}>
            <Button onClick={handleEnviarClick} variant="outlined" color="inherit" disabled={isLocked}>
              Enviar
            </Button>
            <Button onClick={handleGuardarClick} variant="contained" color="secondary" disabled={isLocked}>
              Guardar
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <PartialSaveDialog
        open={partialSaveOpen}
        onCancel={() => setPartialSaveOpen(false)}
        onSave={handleConfirmPartialSave}
      />
      <ConfirmSendDialog
        open={confirmSendOpen}
        onCancel={() => setConfirmSendOpen(false)}
        onConfirm={handleConfirmSend}
      />
      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title={successMessage?.title}
        message={successMessage?.message}
      />
    </>
  );
}
