import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import type { UploadedFile } from '../types';

interface FileViewerDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  files: UploadedFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileViewerDialog({ open, onClose, title, files }: FileViewerDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose} aria-label="Cerrar">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        {files.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            Sin archivos
          </Typography>
        ) : (
          <List dense>
            {files.map((file) => (
              <ListItem
                key={file.id}
                sx={{ pr: 6, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <InsertDriveFileIcon color="action" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={formatFileSize(file.size)}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    size="small"
                    aria-label={`Descargar ${file.name}`}
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
