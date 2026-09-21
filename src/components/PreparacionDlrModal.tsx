import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import type { Assignment, EstadoUnidadDlr } from '../types';
import { useRole } from '../context/RoleContext';
import { PartialSaveDialog } from './PartialSaveDialog';
import { ConfirmSendDialog } from './ConfirmSendDialog';
import { SuccessDialog } from './SuccessDialog';

interface PreparacionDlrModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
  onSent: () => void;
}

const ESTADOS: EstadoUnidadDlr[] = ['En almacén DLR', 'En Equipamiento', 'Unidad terminada'];

/**
 * Preparación DLR — según HU022: la llena Asesor / Administrador Local
 * (escenario 1); el Administrador Kinto solo visualiza, sin poder editar
 * (escenario 2).
 */
export function PreparacionDlrModal({ open, assignment, onClose, onSaved, onSent }: PreparacionDlrModalProps) {
  const { role } = useRole();
  const isViewerRole = role === 'Admin_Kinto';

  const [estado, setEstado] = useState<EstadoUnidadDlr | ''>('');
  const [fechaTerminada, setFechaTerminada] = useState('');
  const [enviado, setEnviado] = useState(false);

  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (open && assignment) {
      setEstado(assignment.estadoUnidadDlr || 'En almacén DLR');
      setFechaTerminada(assignment.fechaUnidadTerminada);
      setEnviado(assignment.dlrEnviado);
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
            Preparación DLR
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
            <Chip label={estado || 'En almacén DLR'} size="small" color="info" variant="outlined" />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Estado de unidad*
          </Typography>
          <FormControl fullWidth disabled={isLocked} sx={{ mb: estado === 'Unidad terminada' ? 2 : 0 }}>
            <Select value={estado} onChange={(e) => setEstado(e.target.value as EstadoUnidadDlr)}>
              {ESTADOS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {estado === 'Unidad terminada' && (
            <>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de unidad terminada*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaTerminada}
                onChange={(e) => setFechaTerminada(e.target.value)}
                disabled={isLocked}
              />
            </>
          )}
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
