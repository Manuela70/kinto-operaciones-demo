import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import type { UploadedFile } from '../types';

interface AssignmentUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
  accept: string[]; // e.g. ['.pdf', '.docx'] o ['.jpg'] — a diferencia de Devolución,
  // Asignaciones acepta más de una extensión por campo (DUAS, acta de entrega).
  maxFiles: number;
  title: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isValidFileType(fileName: string, acceptedExtensions: string[]): boolean {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return acceptedExtensions.includes(ext);
}

let fileIdCounter = 0;
function generateFileId(): string {
  fileIdCounter += 1;
  return `assign-upload-${Date.now()}-${fileIdCounter}`;
}

export function AssignmentUploadDialog({ open, onClose, onUpload, accept, maxFiles, title }: AssignmentUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatInfo = `Formatos aceptados: ${accept.join(', ')} · Máximo ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}`;

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = [];
    let currentCount = selectedFiles.length;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!isValidFileType(file.name, accept)) continue;
      if (currentCount >= maxFiles) break;

      newFiles.push({
        id: generateFileId(),
        name: file.name,
        size: file.size,
        type: file.type,
      });
      currentCount += 1;
    }

    if (newFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  }, [selectedFiles.length, accept, maxFiles]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDeleteFile = (fileId: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleCargar = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <IconButton size="small" onClick={handleClose} aria-label="Cerrar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          sx={{
            border: '2px dashed',
            borderColor: isDragOver ? 'secondary.main' : 'divider',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragOver ? 'action.hover' : 'background.default',
            transition: 'all 0.2s ease',
            mb: 2,
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" color="text.secondary">
            Haz clic para seleccionar tu archivo
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatInfo}
          </Typography>
        </Box>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          multiple={maxFiles > 1}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          data-testid="assignment-file-input"
        />

        {selectedFiles.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Archivos
            </Typography>
            <List dense>
              {selectedFiles.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{ pr: 10, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <InsertDriveFileIcon color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton size="small" aria-label={`Descargar ${file.name}`}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label={`Eliminar ${file.name}`}
                      onClick={() => handleDeleteFile(file.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleCargar}
          variant="contained"
          color="secondary"
          disabled={selectedFiles.length === 0}
          fullWidth
        >
          Cargar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
