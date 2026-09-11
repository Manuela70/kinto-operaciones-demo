import { Box, Checkbox, Chip, FormControl, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';

interface MultiSelectWithChipsProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelectWithChips({ label, options, value, onChange, placeholder }: MultiSelectWithChipsProps) {
  const allSelected = options.length > 0 && value.length === options.length;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const raw = event.target.value;
    const selected = typeof raw === 'string' ? raw.split(',') : raw;

    if (selected.includes('__all__')) {
      onChange(allSelected ? [] : options);
      return;
    }
    onChange(selected.filter((v) => v !== '__all__'));
  };

  const handleRemove = (option: string) => {
    onChange(value.filter((v) => v !== option));
  };

  return (
    <Box sx={{ flex: '1 1 260px', minWidth: 240 }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'text.secondary', fontSize: '0.75rem' }}
      >
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select
          multiple
          value={value}
          onChange={handleChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected.length) {
              return (
                <Typography component="span" sx={{ color: 'text.disabled', fontSize: '0.875rem' }}>
                  {placeholder ?? 'Selecciona'}
                </Typography>
              );
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    size="small"
                    onDelete={() => handleRemove(option)}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                ))}
              </Box>
            );
          }}
        >
          <MenuItem value="__all__">
            <Checkbox checked={allSelected} indeterminate={value.length > 0 && !allSelected} />
            <ListItemText primary="Seleccionar todos" />
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.includes(option)} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
