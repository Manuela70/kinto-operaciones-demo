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
import type { UploadedFile } from '../types';
import { isValidFileType, canAddMoreFiles } from '../utils/fileValidation';

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[]) => void;
  accept: '.pdf' | '.jpg';
  maxFiles: number;
  title: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let fileIdCounter = 0;
function generateFileId(): string {
  fileIdCounter += 1;
  return `upload-${Date.now()}-${fileIdCounter}`;
}

export function UploadDialog({ open, onClose, onUpload, accept, maxFiles, title }: UploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatInfo = accept === '.pdf'
    ? `Formatos aceptados: .pdf. Máximo ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}.`
    : `Formatos aceptados: .jpg. Máximo ${maxFiles} archivo${maxFiles > 1 ? 's' : ''}.`;

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: UploadedFile[] = [];
    let currentCount = selectedFiles.length;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!isValidFileType(file.name, accept)) continue;
      if (!canAddMoreFiles(currentCount, maxFiles)) break;

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
    // Reset input so the same file can be selected again
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {/* Drag-and-drop zone */}
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

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          data-testid="file-input"
        />

        {/* Selected files list */}
        {selectedFiles.length > 0 && (
          <List dense>
            {selectedFiles.map((file) => (
              <ListItem key={file.id} sx={{ pr: 10 }}>
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
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleCargar}
          variant="contained"
          color="secondary"
          disabled={selectedFiles.length === 0}
        >
          Cargar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
