import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useRole } from '../context/RoleContext';
import type { Role } from '../types';

interface RoleOption {
  role: Role;
  label: string;
  description: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'Admin_Kinto',
    label: 'Administrador Kinto',
    description: 'Rol de supervisión — visualización y descarga de datos',
  },
  {
    role: 'Admin_Local',
    label: 'Administrador de Local',
    description: 'Rol operativo — gestión de devoluciones a nivel local',
  },
  {
    role: 'Asesor',
    label: 'Asesor de Concesionario',
    description: 'Rol operativo — registro de devoluciones en concesionario',
  },
];

export function RoleSelector() {
  const { role, setRole } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      navigate('/contracts', { replace: true });
    }
  }, [role, navigate]);

  const handleSelectRole = (selectedRole: Role) => {
    setRole(selectedRole);
    navigate('/contracts');
  };

  if (role) {
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1a1a2e',
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{ color: '#fff', fontWeight: 700, mb: 1 }}
      >
        KINTO
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{ color: 'rgba(255,255,255,0.7)', mb: 5 }}
      >
        Módulo de Devolución — Seleccione su rol para continuar
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {ROLE_OPTIONS.map(({ role: optionRole, label, description }) => (
          <Card
            key={optionRole}
            sx={{
              width: 280,
              borderRadius: 3,
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(233,69,96,0.3)',
              },
            }}
          >
            <CardActionArea
              onClick={() => handleSelectRole(optionRole)}
              data-testid={`role-card-${optionRole}`}
              sx={{ height: '100%' }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 4,
                  px: 3,
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    bgcolor: '#e94560',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{ color: '#fff', fontWeight: 700 }}
                  >
                    {label.charAt(0)}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {label}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
