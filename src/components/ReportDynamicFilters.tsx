import { Box, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import type { ReportFieldConfig } from '../types';

interface ReportDynamicFiltersProps {
  fields: ReportFieldConfig[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function ReportDynamicFilters({ fields, values, onChange }: ReportDynamicFiltersProps) {
  if (fields.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2.5 }}>
      {fields.map((field) => (
        <Box key={field.name} sx={{ flex: '1 1 220px', minWidth: 220, maxWidth: 'calc(25% - 15px)' }}>
          <Typography
            variant="caption"
            sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary', fontSize: '0.75rem' }}
          >
            {field.label}
          </Typography>
          {field.type === 'text' && (
            <TextField
              fullWidth
              size="small"
              placeholder={field.placeholder ?? ''}
              value={values[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'date' && (
            <TextField
              fullWidth
              size="small"
              type="date"
              value={values[field.name] ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
          {field.type === 'select' && (
            <FormControl fullWidth size="small">
              <Select
                value={values[field.name] ?? ''}
                displayEmpty
                onChange={(e) => onChange(field.name, e.target.value as string)}
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
  );
}
