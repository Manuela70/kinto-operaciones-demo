import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import type { Contract, ReturnFormData, ReturnType, UploadedFile } from '../types';
import { useRole } from '../context/RoleContext';
import { useDirtyForm } from '../hooks/useDirtyForm';
import { getUploadFields, type UploadFieldConfig } from '../config/uploadFields';
import { UploadDialog } from './UploadDialog';
import { FileViewerDialog } from './FileViewerDialog';

interface DatosTabProps {
  contract: Contract;
  onSave: (formData: ReturnFormData) => void;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  onFormDataChange?: (formData: ReturnFormData) => void;
  /** Datos previamente guardados para este contrato (persisten entre aperturas del modal) */
  initialFormData?: ReturnFormData | null;
}

const DEALER_OPTIONS = [
  'José Antonio Martínez Vargas',
  'Roberto Sánchez Díaz',
];

const RETURN_TYPE_OPTIONS: ReturnType[] = ['Devolución', 'Anticipada', 'Robo'];

function buildInitialFormData(contract: Contract): ReturnFormData {
  return {
    fechaFinContrato: contract.fechaFinContrato,
    kilometraje: contract.kilometraje,
    dealer: contract.dealerEntrega,
    tipoDevolucion: '',
    fechaDevolucion: '',
    devolverParaStock: false,
    comentarios: '',
    files: {},
  };
}

/** Mock pre-populated data for Admin_Kinto read-only view */
function buildAdminKintoFormData(contract: Contract): ReturnFormData {
  return {
    fechaFinContrato: contract.fechaFinContrato,
    kilometraje: contract.kilometraje,
    dealer: contract.dealerEntrega,
    tipoDevolucion: 'Devolución',
    fechaDevolucion: contract.fechaFinContrato,
    devolverParaStock: true,
    comentarios: 'Devolución registrada según contrato.',
    files: {
      actaDocumentacion: [
        { id: 'f1', name: 'acta_documentacion.pdf', size: 245000, type: 'application/pdf' },
      ],
      imagenes: [
        { id: 'f2', name: 'foto_frontal.jpg', size: 1200000, type: 'image/jpeg' },
        { id: 'f3', name: 'foto_lateral.jpg', size: 980000, type: 'image/jpeg' },
      ],
      informeTecnico: [
        { id: 'f4', name: 'informe_tecnico.jpg', size: 1500000, type: 'image/jpeg' },
      ],
    },
  };
}

export function DatosTab({ contract, onSave, onCancel, onDirtyChange, onFormDataChange, initialFormData }: DatosTabProps) {
  const { role } = useRole();
  const isReadOnly = role === 'Admin_Kinto';

  const initialData = useMemo(
    () =>
      isReadOnly
        ? buildAdminKintoFormData(contract)
        : (initialFormData ?? buildInitialFormData(contract)),
    [contract, isReadOnly, initialFormData],
  );

  const { formData, isDirty, updateField } = useDirtyForm(initialData);

  // Report dirty state changes to parent
  useEffect(() => {
    onDirtyChange?.(isDirty());
  }, [isDirty, onDirtyChange]);

  // Report formData changes to parent so it can be used for partial save
  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  const uploadFields = useMemo(
    () => (formData.tipoDevolucion ? getUploadFields(formData.tipoDevolucion) : []),
    [formData.tipoDevolucion],
  );

  // Upload dialog state
  const [activeUploadField, setActiveUploadField] = useState<UploadFieldConfig | null>(null);

  // File viewer dialog state (Admin_Kinto)
  const [viewerField, setViewerField] = useState<UploadFieldConfig | null>(null);

  const handleOpenUploadDialog = (field: UploadFieldConfig) => {
    setActiveUploadField(field);
  };

  const handleCloseUploadDialog = () => {
    setActiveUploadField(null);
  };

  const handleUploadFiles = (files: UploadedFile[]) => {
    if (!activeUploadField) return;
    const fieldName = activeUploadField.name;
    const existingFiles = formData.files[fieldName] ?? [];
    updateField('files', {
      ...formData.files,
      [fieldName]: [...existingFiles, ...files],
    });
  };

  const handleSave = useCallback(() => {
    onSave(formData);
  }, [formData, onSave]);

  const getFileCount = (fieldName: string): number => {
    return formData.files[fieldName]?.length ?? 0;
  };

  /** Build the label with accept info for upload fields */
  const getUploadLabel = (field: UploadFieldConfig): string => {
    const ext = field.accept === '.pdf' ? '.pdf' : '.jpg';
    return `Adjuntar ${field.label.toLowerCase()} (${ext})${field.required ? '*' : ''}`;
  };

  return (
    <Box sx={{ pt: 1 }}>
      {/* Row 1: Fecha fin contrato, Kilometraje, Dealer */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
            Fecha fin contrato
          </Typography>
          <TextField
            type="date"
            value={formData.fechaFinContrato}
            onChange={(e) => updateField('fechaFinContrato', e.target.value)}
            fullWidth
            required
            disabled={isReadOnly}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
            Kilometraje
          </Typography>
          <TextField
            type="number"
            placeholder="0"
            value={formData.kilometraje}
            onChange={(e) =>
              updateField('kilometraje', e.target.value === '' ? '' : Number(e.target.value))
            }
            fullWidth
            required
            disabled={isReadOnly}
            size="small"
          />
        </Box>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
            Dealer
          </Typography>
          <FormControl fullWidth required disabled={isReadOnly} size="small">
            <Select
              value={formData.dealer}
              displayEmpty
              onChange={(e) => updateField('dealer', e.target.value)}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                      Selecciona
                    </Typography>
                  );
                }
                return selected;
              }}
            >
              {DEALER_OPTIONS.map((dealer) => (
                <MenuItem key={dealer} value={dealer}>
                  {dealer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Row 2: Tipo de devolución, Fecha de devolución, first upload field (if available) */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
            Tipo de devolución
          </Typography>
          <FormControl fullWidth required disabled={isReadOnly} size="small">
            <Select
              value={formData.tipoDevolucion}
              displayEmpty
              onChange={(e) => {
                const newType = e.target.value as ReturnType | '';
                updateField('tipoDevolucion', newType);
                // Clear files when return type changes
                if (newType !== formData.tipoDevolucion) {
                  updateField('files', {});
                }
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return (
                    <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                      Selecciona
                    </Typography>
                  );
                }
                return selected;
              }}
            >
              {RETURN_TYPE_OPTIONS.map((tipo) => (
                <MenuItem key={tipo} value={tipo}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
            Fecha de devolución
          </Typography>
          <TextField
            type="date"
            value={formData.fechaDevolucion}
            onChange={(e) => updateField('fechaDevolucion', e.target.value)}
            fullWidth
            required
            disabled={isReadOnly}
            size="small"
          />
        </Box>
        {/* First upload field in row 2 if available */}
        {uploadFields.length > 0 && (
          <Box sx={{ flex: '1 1 260px', minWidth: 220 }}>
            <UploadFieldInput
              field={uploadFields[0]}
              label={getUploadLabel(uploadFields[0])}
              fileCount={getFileCount(uploadFields[0].name)}
              isReadOnly={isReadOnly}
              onUploadClick={() => handleOpenUploadDialog(uploadFields[0])}
              onViewClick={() => setViewerField(uploadFields[0])}
            />
          </Box>
        )}
      </Box>

      {/* Remaining upload fields (from index 1 onward), 3 per row */}
      {uploadFields.length > 1 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
          {uploadFields.slice(1).map((field) => (
            <Box sx={{ flex: '1 1 260px', minWidth: 220 }} key={field.name}>
              <UploadFieldInput
                field={field}
                label={getUploadLabel(field)}
                fileCount={getFileCount(field.name)}
                isReadOnly={isReadOnly}
                onUploadClick={() => handleOpenUploadDialog(field)}
                onViewClick={() => setViewerField(field)}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Devolver para stock checkbox */}
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.devolverParaStock}
              onChange={(e) => updateField('devolverParaStock', e.target.checked)}
              disabled={isReadOnly}
            />
          }
          label="Devolver para stock"
        />
      </Box>

      {/* Comentarios textarea */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary' }}>
          Comentarios
        </Typography>
        <TextField
          value={formData.comentarios}
          onChange={(e) => updateField('comentarios', e.target.value)}
          fullWidth
          multiline
          rows={3}
          disabled={isReadOnly}
          size="small"
        />
      </Box>

      {/* Action buttons — hidden for Admin_Kinto */}
      {!isReadOnly && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel} color="inherit" variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="secondary">
            Guardar
          </Button>
        </Box>
      )}

      {/* Upload Dialog (editable mode) */}
      {activeUploadField && (
        <UploadDialog
          open={!!activeUploadField}
          onClose={handleCloseUploadDialog}
          onUpload={handleUploadFiles}
          accept={activeUploadField.accept}
          maxFiles={activeUploadField.maxFiles}
          title="Adjuntar"
        />
      )}

      {/* File Viewer Dialog (Admin_Kinto read-only) */}
      {viewerField && (
        <FileViewerDialog
          open={!!viewerField}
          onClose={() => setViewerField(null)}
          title="Archivos"
          files={formData.files[viewerField.name] ?? []}
        />
      )}
    </Box>
  );
}

/* ─── Upload Field Input ────────────────────────────────────────────── */

interface UploadFieldInputProps {
  field: UploadFieldConfig;
  label: string;
  fileCount: number;
  isReadOnly: boolean;
  onUploadClick: () => void;
  onViewClick: () => void;
}

/**
 * Renders an upload field as an input-style box matching the mockup:
 * - Empty state: dashed border, teal "Subir ↑" text
 * - With files: solid border, "Archivos →" text
 * - Read-only (Admin_Kinto): solid border, "Archivos →" opens FileViewerDialog
 */
function UploadFieldInput({
  field,
  label,
  fileCount,
  isReadOnly,
  onUploadClick,
  onViewClick,
}: UploadFieldInputProps) {
  const hasFiles = fileCount > 0;

  const handleClick = () => {
    if (isReadOnly) {
      onViewClick();
    } else {
      onUploadClick();
    }
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 0.5,
          fontWeight: 500,
          color: 'text.secondary',
          fontSize: '0.75rem',
        }}
      >
        {label}
      </Typography>
      <Box
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={
          hasFiles
            ? `Archivos ${field.label} (${fileCount})`
            : `Subir ${field.label}`
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          px: 1.5,
          borderRadius: 1,
          cursor: 'pointer',
          border: hasFiles ? '1px solid' : '1px dashed',
          borderColor: hasFiles ? 'divider' : '#0097a7',
          backgroundColor: hasFiles ? 'transparent' : 'rgba(0, 151, 167, 0.04)',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: '#0097a7',
            backgroundColor: 'rgba(0, 151, 167, 0.08)',
          },
        }}
      >
        {hasFiles ? (
          <>
            <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '0.875rem' }}>
              Archivos ({fileCount})
            </Typography>
            <ArrowForwardIcon sx={{ fontSize: 18, color: '#0097a7' }} />
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ color: '#0097a7', fontSize: '0.875rem' }}>
              Subir
            </Typography>
            <ArrowUpwardIcon sx={{ fontSize: 18, color: '#0097a7' }} />
          </>
        )}
      </Box>
    </Box>
  );
}
