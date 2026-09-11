import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRole } from '../context/RoleContext';
import { getNavItems } from '../config/navigation';
import type { Role } from '../types';

const ROLE_LABELS: Record<Role, string> = {
  Admin_Kinto: 'Administrador Kinto',
  Admin_Local: 'Administrador de Local',
  Asesor: 'Asesor de Concesionario',
};

export function Header() {
  const { role, clearRole } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  if (!role) return null;

  const navItems = getNavItems(role);

  const handleLogout = () => {
    clearRole();
    navigate('/');
  };

  return (
    <Box component="header">
      {/* Row 1: Logo + User Info — light background per mockup */}
      <Box
        sx={{
          backgroundColor: '#f5f7f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 1,
          minHeight: 48,
        }}
      >
        {/* Left: KINTO Logo */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 700,
            letterSpacing: 2,
            color: '#0d6d81',
            fontSize: '1.25rem',
          }}
        >
          KINTO
        </Typography>

        {/* Right: User info + Logout — all on one line */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: '#1a1a2e', fontWeight: 600, fontSize: '0.8125rem' }}
          >
            AGIRALDO
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(26,26,46,0.7)', fontSize: '0.75rem' }}
          >
            MITSUI-Mitsui C.C. Jockey Plaza
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(26,26,46,0.7)', fontSize: '0.75rem' }}
          >
            {ROLE_LABELS[role]}
          </Typography>
          <Button
            onClick={handleLogout}
            size="small"
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            sx={{
              color: '#c00000',
              textTransform: 'none',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
              '&:hover': {
                color: '#8f0000',
                backgroundColor: 'rgba(192,0,0,0.08)',
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Box>
      </Box>

      {/* Row 2: Navigation bar — dark teal-navy, active tab gets a light highlight */}
      <Box
        component="nav"
        sx={{
          backgroundColor: '#00495a',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 3,
          minHeight: 40,
        }}
      >
        {navItems.map((item) => {
          const isActive = item.path === location.pathname;

          return (
            <Button
              key={item.label}
              onClick={() => navigate(item.path)}
              size="small"
              sx={{
                color: isActive ? '#00303d' : '#fff',
                backgroundColor: isActive ? '#93c3cf' : 'transparent',
                textTransform: 'none',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 400,
                opacity: isActive ? 1 : 0.9,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                '&:hover': {
                  opacity: 1,
                  backgroundColor: isActive
                    ? '#7fb5c3'
                    : 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}
