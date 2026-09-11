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
  Link,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Assignment, UploadedFile } from '../types';
import { AssignmentUploadDialog } from './AssignmentUploadDialog';
import { FileViewerDialog } from './FileViewerDialog';
import { PartialSaveDialog } from './PartialSaveDialog';
import { ConfirmSendDialog } from './ConfirmSendDialog';
import { SuccessDialog } from './SuccessDialog';

interface EntregaClienteModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
  onSent: () => void;
}

export function EntregaClienteModal({ open, assignment, onClose, onSaved, onSent }: EntregaClienteModalProps) {
  const [fechaUio, setFechaUio] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [actaFiles, setActaFiles] = useState<UploadedFile[]>([]);
  const [imagenesFiles, setImagenesFiles] = useState<UploadedFile[]>([]);
  const [enviado, setEnviado] = useState(false);

  const [uploadTarget, setUploadTarget] = useState<'acta' | 'imagenes' | null>(null);
  const [viewerTarget, setViewerTarget] = useState<'acta' | 'imagenes' | null>(null);
  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    if (open && assignment) {
      setFechaUio(assignment.fechaUio);
      setFechaEntrega(assignment.fechaEntregaCliente);
      setComentarios(assignment.comentariosEntrega);
      setActaFiles(assignment.actaFiles);
      setImagenesFiles(assignment.imagenesFiles);
      setEnviado(assignment.entregaEnviado);
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const isLocked = enviado;

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
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Entrega al cliente
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
            <Typography variant="subtitle1" fontWeight="bold">
              Serie: {assignment.serie || '—'}
            </Typography>
            <Chip
              label={enviado ? 'Vehículo terminado' : 'Documentación completa'}
              size="small"
              color={enviado ? 'success' : 'info'}
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha de UIO*
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaUio}
                onChange={(e) => setFechaUio(e.target.value)}
                disabled={isLocked}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Adjuntar acta (.pdf, .docx)*
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{ justifyContent: 'space-between' }}
                disabled={isLocked && actaFiles.length === 0}
                onClick={() => (actaFiles.length > 0 ? setViewerTarget('acta') : setUploadTarget('acta'))}
              >
                Archivos
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Fecha entrega cliente
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                disabled={isLocked}
              />
            </Box>
            <Box sx={{ flex: '1 1 220px', minWidth: 200 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Adjuntar imágenes (.jpg)*
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{ justifyContent: 'space-between' }}
                disabled={isLocked && imagenesFiles.length === 0}
                onClick={() => (imagenesFiles.length > 0 ? setViewerTarget('imagenes') : setUploadTarget('imagenes'))}
              >
                Archivos
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Para descargar la plantilla haga click{' '}
            <Link href="#" underline="always">
              aquí
            </Link>
            .
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Comentarios*
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Comentarios correspondientes."
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            disabled={isLocked}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-start' }}>
          <Button onClick={handleEnviarClick} variant="outlined" color="inherit" disabled={isLocked}>
            Enviar
          </Button>
          <Button onClick={handleGuardarClick} variant="contained" color="secondary" disabled={isLocked}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <AssignmentUploadDialog
        open={uploadTarget === 'acta'}
        onClose={() => setUploadTarget(null)}
        onUpload={(files) => setActaFiles((prev) => [...prev, ...files])}
        accept={['.pdf', '.docx']}
        maxFiles={1}
        title="Adjuntar"
      />
      <AssignmentUploadDialog
        open={uploadTarget === 'imagenes'}
        onClose={() => setUploadTarget(null)}
        onUpload={(files) => setImagenesFiles((prev) => [...prev, ...files])}
        accept={['.jpg']}
        maxFiles={5}
        title="Adjuntar"
      />

      <FileViewerDialog
        open={viewerTarget === 'acta'}
        onClose={() => setViewerTarget(null)}
        title="Archivos"
        files={actaFiles}
      />
      <FileViewerDialog
        open={viewerTarget === 'imagenes'}
        onClose={() => setViewerTarget(null)}
        title="Archivos"
        files={imagenesFiles}
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
      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title={successMessage?.title}
        message={successMessage?.message}
      />
    </>
  );
}
