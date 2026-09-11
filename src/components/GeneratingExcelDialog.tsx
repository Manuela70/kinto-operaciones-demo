import { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, LinearProgress, Typography } from '@mui/material';

interface GeneratingExcelDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function GeneratingExcelDialog({ open, onComplete }: GeneratingExcelDialogProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 12;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 250);
          return 100;
        }
        return next;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [open, onComplete]);

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogContent sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          Generando Excel
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Espere un momento. Se está generando el Excel!
        </Typography>
        <Box sx={{ px: 1 }}>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
