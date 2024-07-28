import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useEmpresas } from '../../hooks/useEmpresas';
import { useEmpleado } from '../../hooks/useEmpleado';
import { Rol } from '../../entidades/enums/Rol';

export default function EmpresaSelect() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { empleado } = useEmpleado();
  const { empresas, empresaSeleccionada, handleChangeEmpresa } = useEmpresas();

  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    idEmpresa: number
  ) => {
    handleChangeEmpresa(idEmpresa);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div  >
      <List 
        component="nav"
        aria-label="Device settings"
        
      >
        <div className="" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', overflow: 'hidden', backgroundColor: '#a6c732' }}>
        <img src="/BS.png"  alt="Logo" style={{width:'30%'}}/>
          <ListItemButton
            id="lock-button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
            disabled={empleado?.rol !== Rol.Superadmin}
           
          >
            <ListItemText
              secondary={empresaSeleccionada.nombre}
              className='text-truncate'
            />
          </ListItemButton>
        </div>
      </List>
      <Menu 
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'lock-button',
          role: 'listbox',
        }}
        
      >
        {empresas.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === empresaSeleccionada.id}
            onClick={() => handleMenuItemClick(option.id)}
            style={{ backgroundColor: option.id === empresaSeleccionada.id ? '#a6c732' : '#e0ebc2', color: '#333' }}
          >
            <div className="d-flex" style={{ width: '22rem' }}>
              <img src={(option.imagen ?? { url: '' }).url} alt="" style={{ width: '3rem', height: '3rem', borderRadius: '6px' }} />
              <div className='ms-2 text-truncate'>
                {option.nombre ?? ''}
              </div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
