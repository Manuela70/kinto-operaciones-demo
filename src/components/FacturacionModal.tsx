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
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Assignment, Disponibilidad, UploadedFile } from '../types';
import { useRole } from '../context/RoleContext';
import { AssignmentUploadDialog } from './AssignmentUploadDialog';
import { FileViewerDialog } from './FileViewerDialog';
import { PartialSaveDialog } from './PartialSaveDialog';
import { ConfirmSendDialog } from './ConfirmSendDialog';
import { ErrorDialog } from './ErrorDialog';
import { SuccessDialog } from './SuccessDialog';

interface FacturacionModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
  onSent: () => void;
}

const DISPONIBILIDAD_OPTIONS: Disponibilidad[] = ['Disponible', 'No disponible'];

export function FacturacionModal({ open, assignment, onClose, onSaved, onSent }: FacturacionModalProps) {
  const { role } = useRole();
  // Según HU016: solo el Administrador Kinto factura (escenario 1). Asesor y
  // Administrador Local siempre ven una vista resumida de solo lectura —
  // sin Fecha de asignación, sin DUAS, sin botones — sea cual sea el estado
  // de envío (escenario 4).
  const isReducedRole = role !== 'Admin_Kinto';

  const [vin, setVin] = useState('');
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad>('Disponible');
  const [fechaDisponibilidad, setFechaDisponibilidad] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState('');
  const [fechaFacturacion, setFechaFacturacion] = useState('');
  const [fechaActivacion, setFechaActivacion] = useState('');
  const [duasFiles, setDuasFiles] = useState<UploadedFile[]>([]);
  const [enviado, setEnviado] = useState(false);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (open && assignment) {
      setVin(assignment.vin);
      setDisponibilidad(assignment.disponibilidad);
      setFechaDisponibilidad(assignment.fechaDisponibilidad);
      setFechaAsignacion(assignment.fechaAsignacion);
      setFechaFacturacion(assignment.fechaFacturacion);
      setFechaActivacion(assignment.fechaActivacion ?? '');
      setDuasFiles(assignment.duasFiles);
      setEnviado(assignment.facturaEnviada);
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const isLocked = enviado || isReducedRole;

  // "Guardar" ofrece confirmar guardado parcial (mismo patrón que Devolución)
  const handleGuardarClick = () => setPartialSaveOpen(true);

  const handleConfirmPartialSave = () => {
    setPartialSaveOpen(false);
    // Simula una operación que a veces falla, igual que el mockup de error genérico
    const success = duasFiles.length > 0 || vin.trim() !== '';
    if (!success) {
      setErrorOpen(true);
      return;
    }
    onSaved();
    setSuccessMessage({
      title: 'Datos guardados',
      message: 'La información de se guardó correctamente.',
    });
    setSuccessOpen(true);
  };

  // "Enviar" dispara la confirmación irreversible (nuevo respecto a Devolución)
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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Facturación
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
                Vehículo
              </Typography>
            </Box>
            <Chip
              label={
                fechaActivacion
                  ? 'Unidad Facturada'
                  : duasFiles.length > 0
                    ? 'Pendiente aprobación Finanzas TDP'
                    : 'Pendiente de asignación'
              }
              size="small"
              color={fechaActivacion ? 'success' : duasFiles.length > 0 ? 'warning' : 'info'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Serie*
              </Typography>
              <TextField fullWidth value={assignment.serie || '000000'} disabled />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Vin*
              </Typography>
              <TextField
                fullWidth
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                disabled={isLocked}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Disponibilidad*
              </Typography>
              <FormControl fullWidth disabled={isLocked}>
                <Select
                  value={disponibilidad}
                  onChange={(e) => setDisponibilidad(e.target.value as Disponibilidad)}
                >
                  {DISPONIBILIDAD_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de disponibilidad*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaDisponibilidad}
                onChange={(e) => setFechaDisponibilidad(e.target.value)}
                disabled={isLocked}
              />
            </Box>
          </Box>

          {!isReducedRole && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Adjuntar DUAS (cualquier formato, incluido ZIP)*
              </Typography>
              {duasFiles.length > 0 ? (
                <Button
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ justifyContent: 'space-between', width: { xs: '100%', sm: '50%' } }}
                  onClick={() => setViewerOpen(true)}
                >
                  Archivos
                </Button>
              ) : (
                <Box
                  onClick={() => !isLocked && setUploadOpen(true)}
                  sx={{
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    cursor: isLocked ? 'default' : 'pointer',
                    color: 'secondary.main',
                    width: { xs: '100%', sm: '50%' },
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  Subir ⬆
                </Box>
              )}
            </Box>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            {!isReducedRole && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fecha de asignación*
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={fechaAsignacion}
                  onChange={(e) => setFechaAsignacion(e.target.value)}
                  disabled={isLocked}
                />
              </Box>
            )}
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha facturación*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaFacturacion}
                onChange={(e) => setFechaFacturacion(e.target.value)}
                disabled={isLocked}
              />
            </Box>
            {!isReducedRole && (
              <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Fecha activación
                </Typography>
                <TextField
                  fullWidth
                  type="date"
                  value={fechaActivacion}
                  onChange={(e) => setFechaActivacion(e.target.value)}
                  disabled={isLocked || duasFiles.length === 0}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        {!isReducedRole && (
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

      <AssignmentUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={(files) => setDuasFiles((prev) => [...prev, ...files])}
        accept={[]}
        maxFiles={3}
        title="Adjuntar"
      />
      <FileViewerDialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        title="Archivos"
        files={duasFiles}
      />
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
      <ErrorDialog open={errorOpen} onConfirm={() => setErrorOpen(false)} />
      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title={successMessage?.title}
        message={successMessage?.message}
      />
    </>
  );
}
