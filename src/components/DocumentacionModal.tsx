import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { Assignment, UploadedFile } from '../types';
import { AssignmentUploadDialog } from './AssignmentUploadDialog';
import { FileViewerDialog } from './FileViewerDialog';
import { PartialSaveDialog } from './PartialSaveDialog';
import { SuccessDialog } from './SuccessDialog';

interface DocumentacionModalProps {
  open: boolean;
  assignment: Assignment | null;
  onClose: () => void;
  onSaved: () => void;
}

type StepKey = 'placas' | 'lunas' | 'soat';
type UploadTarget = 'tive' | 'tarjeta' | 'soat' | 'poliza';

const STEPS: { key: StepKey; title: string; completedLabel: string }[] = [
  { key: 'placas', title: 'Documentación placas', completedLabel: 'Inmatriculación completo' },
  { key: 'lunas', title: 'Lunas polarizadas', completedLabel: 'Permiso de polarizado completo' },
  { key: 'soat', title: 'SOAT y seguro', completedLabel: 'SOAT y seguro completo' },
];

/** Botón de adjuntar/ver archivos, reutilizado en las 3 secciones */
function AttachButton({
  label,
  files,
  onUpload,
  onView,
}: {
  label: string;
  files: UploadedFile[];
  onUpload: () => void;
  onView: () => void;
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        endIcon={<ArrowForwardIcon />}
        sx={{ justifyContent: 'space-between' }}
        onClick={files.length > 0 ? onView : onUpload}
      >
        {files.length > 0 ? 'Archivos' : 'Subir'}
      </Button>
    </Box>
  );
}

export function DocumentacionModal({ open, assignment, onClose, onSaved }: DocumentacionModalProps) {
  const [expanded, setExpanded] = useState<StepKey | false>('placas');
  const [completed, setCompleted] = useState<Record<StepKey, boolean>>({
    placas: false,
    lunas: false,
    soat: false,
  });

  // Documentación placas
  const [fechaInmatriculacion, setFechaInmatriculacion] = useState('');
  const [fechaIngresoSunarp, setFechaIngresoSunarp] = useState('');
  const [fechaRecepcionTive, setFechaRecepcionTive] = useState('');
  const [tiveFiles, setTiveFiles] = useState<UploadedFile[]>([]);
  const [placa, setPlaca] = useState('');
  const [fechaEnvioPlacaDlr, setFechaEnvioPlacaDlr] = useState('');

  // Lunas polarizadas
  const [inicioSolicitudLunas, setInicioSolicitudLunas] = useState('');
  const [fechaEnvioPermisosDrl, setFechaEnvioPermisosDrl] = useState('');
  const [fechaRecepcionTarjeta, setFechaRecepcionTarjeta] = useState('');
  const [tarjetaFiles, setTarjetaFiles] = useState<UploadedFile[]>([]);

  // SOAT y seguro
  const [fechaEmisionSoat, setFechaEmisionSoat] = useState('');
  const [fechaInclusionPoliza, setFechaInclusionPoliza] = useState('');
  const [soatFiles, setSoatFiles] = useState<UploadedFile[]>([]);
  const [polizaFiles, setPolizaFiles] = useState<UploadedFile[]>([]);

  const [uploadTarget, setUploadTarget] = useState<UploadTarget | null>(null);
  const [viewerTarget, setViewerTarget] = useState<UploadTarget | null>(null);
  const [partialSaveOpen, setPartialSaveOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (open && assignment) {
      setExpanded('placas');
      setCompleted({ placas: false, lunas: false, soat: false });

      setFechaInmatriculacion(assignment.fechaInmatriculacion);
      setFechaIngresoSunarp(assignment.fechaIngresoSunarp);
      setFechaRecepcionTive(assignment.fechaRecepcionTive);
      setTiveFiles(assignment.tiveFiles);
      setPlaca(assignment.placa);
      setFechaEnvioPlacaDlr(assignment.fechaEnvioPlacaDlr);

      setInicioSolicitudLunas(assignment.inicioSolicitudLunas);
      setFechaEnvioPermisosDrl(assignment.fechaEnvioPermisosDrl);
      setFechaRecepcionTarjeta(assignment.fechaRecepcionTarjeta);
      setTarjetaFiles(assignment.tarjetaFiles);

      setFechaEmisionSoat(assignment.fechaEmisionSoat);
      setFechaInclusionPoliza(assignment.fechaInclusionPoliza);
      setSoatFiles(assignment.soatFiles);
      setPolizaFiles(assignment.polizaFiles);
    }
  }, [open, assignment]);

  if (!assignment) return null;

  const markCompleteAndNext = (key: StepKey, next: StepKey | false) => {
    setCompleted((prev) => ({ ...prev, [key]: true }));
    setExpanded(next);
  };

  const handleGuardarClick = () => setPartialSaveOpen(true);

  const handleConfirmPartialSave = () => {
    setPartialSaveOpen(false);
    onSaved();
    setSuccessOpen(true);
  };

  const handleSuccessAccept = () => {
    setSuccessOpen(false);
    onClose();
  };

  const uploadConfig: Record<UploadTarget, { accept: string[]; maxFiles: number; setter: (files: UploadedFile[]) => void; files: UploadedFile[] }> = {
    tive: { accept: ['.pdf'], maxFiles: 1, setter: setTiveFiles, files: tiveFiles },
    tarjeta: { accept: ['.pdf'], maxFiles: 1, setter: setTarjetaFiles, files: tarjetaFiles },
    soat: { accept: ['.pdf'], maxFiles: 1, setter: setSoatFiles, files: soatFiles },
    poliza: { accept: ['.pdf'], maxFiles: 1, setter: setPolizaFiles, files: polizaFiles },
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Gestión de documentación
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Cerrar">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {STEPS.map((step) => (
            <Accordion
              key={step.key}
              expanded={expanded === step.key}
              onChange={() => setExpanded(expanded === step.key ? false : step.key)}
              disableGutters
              sx={{ mb: 1, '&:before': { display: 'none' } }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {completed[step.key] && <CheckCircleIcon color="success" fontSize="small" />}
                  <Typography fontWeight={600}>
                    {completed[step.key] ? step.completedLabel : step.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {step.key === 'placas' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Fecha de inmatrícula*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaInmatriculacion}
                      onChange={(e) => setFechaInmatriculacion(e.target.value)}
                    />
                    <TextField
                      label="Fecha de ingreso a Sunarp*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaIngresoSunarp}
                      onChange={(e) => setFechaIngresoSunarp(e.target.value)}
                    />
                    <TextField
                      label="Fecha de recepción TIVE*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaRecepcionTive}
                      onChange={(e) => setFechaRecepcionTive(e.target.value)}
                    />
                    <AttachButton
                      label="Adjuntar TIVE (.pdf)*"
                      files={tiveFiles}
                      onUpload={() => setUploadTarget('tive')}
                      onView={() => setViewerTarget('tive')}
                    />
                    <TextField
                      label="Placa*"
                      fullWidth
                      value={placa}
                      onChange={(e) => setPlaca(e.target.value)}
                    />
                    <TextField
                      label="Fecha de envío de placa a DLR*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaEnvioPlacaDlr}
                      onChange={(e) => setFechaEnvioPlacaDlr(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ alignSelf: 'flex-end' }}
                      onClick={() => markCompleteAndNext('placas', 'lunas')}
                    >
                      Continuar
                    </Button>
                  </Box>
                )}
                {step.key === 'lunas' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Inicio de solicitud*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={inicioSolicitudLunas}
                      onChange={(e) => setInicioSolicitudLunas(e.target.value)}
                    />
                    <TextField
                      label="Fecha envío permisos DRL*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaEnvioPermisosDrl}
                      onChange={(e) => setFechaEnvioPermisosDrl(e.target.value)}
                    />
                    <TextField
                      label="Fecha de recepción tarjeta*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaRecepcionTarjeta}
                      onChange={(e) => setFechaRecepcionTarjeta(e.target.value)}
                    />
                    <AttachButton
                      label="Cargar Tarjeta (.pdf)*"
                      files={tarjetaFiles}
                      onUpload={() => setUploadTarget('tarjeta')}
                      onView={() => setViewerTarget('tarjeta')}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ alignSelf: 'flex-end' }}
                      onClick={() => markCompleteAndNext('lunas', 'soat')}
                    >
                      Continuar
                    </Button>
                  </Box>
                )}
                {step.key === 'soat' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Fecha emisión SOAT*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaEmisionSoat}
                      onChange={(e) => setFechaEmisionSoat(e.target.value)}
                    />
                    <TextField
                      label="Fecha de inclusión póliza*"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={fechaInclusionPoliza}
                      onChange={(e) => setFechaInclusionPoliza(e.target.value)}
                    />
                    <AttachButton
                      label="Cargar SOAT (.pdf)*"
                      files={soatFiles}
                      onUpload={() => setUploadTarget('soat')}
                      onView={() => setViewerTarget('soat')}
                    />
                    <AttachButton
                      label="Cargar póliza (.pdf)*"
                      files={polizaFiles}
                      onUpload={() => setUploadTarget('poliza')}
                      onView={() => setViewerTarget('poliza')}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ alignSelf: 'flex-end' }}
                      onClick={() => markCompleteAndNext('soat', false)}
                    >
                      Finalizar
                    </Button>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleGuardarClick} variant="contained" color="secondary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {(Object.keys(uploadConfig) as UploadTarget[]).map((target) => (
        <AssignmentUploadDialog
          key={target}
          open={uploadTarget === target}
          onClose={() => setUploadTarget(null)}
          onUpload={(files) => uploadConfig[target].setter([...uploadConfig[target].files, ...files])}
          accept={uploadConfig[target].accept}
          maxFiles={uploadConfig[target].maxFiles}
          title="Adjuntar"
        />
      ))}
      {(Object.keys(uploadConfig) as UploadTarget[]).map((target) => (
        <FileViewerDialog
          key={target}
          open={viewerTarget === target}
          onClose={() => setViewerTarget(null)}
          title="Archivos"
          files={uploadConfig[target].files}
        />
      ))}

      <PartialSaveDialog
        open={partialSaveOpen}
        onCancel={() => setPartialSaveOpen(false)}
        onSave={handleConfirmPartialSave}
      />
      <SuccessDialog
        open={successOpen}
        onAccept={handleSuccessAccept}
        title="Datos guardados"
        message="La información de se guardó correctamente."
      />
    </>
  );
}
