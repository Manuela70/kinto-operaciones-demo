import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function PlaceholderPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
    >
      <Typography variant="h6" color="text.secondary">
        Este módulo está fuera del alcance de esta demo.
      </Typography>
    </Box>
  );
}
