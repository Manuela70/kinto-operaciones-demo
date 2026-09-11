import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useRole } from '../context/RoleContext';
import { getAssignmentFilterFields, type FilterFieldConfig } from '../config/assignmentFilters';
import type { AssignmentFilterValues } from '../types';

interface AssignmentsFiltersPanelProps {
  onSearch: (filters: Partial<AssignmentFilterValues>) => void;
  onClear: () => void;
}

const PLACEHOLDERS: Record<string, string> = {
  serie: '000000',
  placa: 'ABC-123',
  marca: 'Selecciona',
  modelo: 'Selecciona',
  cliente: 'Nombre del cliente',
  ruc: '000000000000',
  dealerEntrega: 'Selecciona',
  localEntrega: 'Selecciona',
  estadoProceso: 'Selecciona',
  estadoVehiculo: 'Selecciona',
  estadoDocumentacion: 'Selecciona',
};

function buildInitialValues(fields: FilterFieldConfig[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of fields) {
    values[field.name] = '';
  }
  return values;
}

export function AssignmentsFiltersPanel({ onSearch, onClear }: AssignmentsFiltersPanelProps) {
  const { role } = useRole();

  const fields = useMemo(() => (role ? getAssignmentFilterFields(role) : []), [role]);

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(fields),
  );

  const handleChange = useCallback((fieldName: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    const filters: Partial<AssignmentFilterValues> = {};
    for (const [key, val] of Object.entries(values)) {
      if (val !== '') {
        (filters as Record<string, string>)[key] = val;
      }
    }
    onSearch(filters);
  }, [values, onSearch]);

  const handleClear = useCallback(() => {
    setValues(buildInitialValues(fields));
    onClear();
  }, [fields, onClear]);

  if (!role) return null;

  return (
    <Paper
      variant="outlined"
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 2,
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
        {fields.map((field) => (
          <Box
            key={field.name}
            sx={{
              flex: '1 1 220px',
              minWidth: 220,
              maxWidth: 'calc(25% - 15px)',
            }}
          >
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
              {field.label}
            </Typography>
            {field.type === 'text' ? (
              <TextField
                fullWidth
                size="small"
                placeholder={PLACEHOLDERS[field.name] ?? ''}
                value={values[field.name] ?? ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            ) : (
              <FormControl fullWidth size="small">
                <Select
                  value={values[field.name] ?? ''}
                  displayEmpty
                  onChange={(e) => handleChange(field.name, e.target.value as string)}
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <Typography
                          component="span"
                          sx={{ color: 'text.disabled', fontSize: '0.875rem' }}
                        >
                          {PLACEHOLDERS[field.name] ?? 'Selecciona'}
                        </Typography>
                      );
                    }
                    return selected;
                  }}
                >
                  {field.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2.5 }}>
        <Button variant="outlined" onClick={handleClear}>
          Limpiar filtros
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#0097a7',
            '&:hover': { backgroundColor: '#00838f' },
          }}
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </Box>
    </Paper>
  );
}
