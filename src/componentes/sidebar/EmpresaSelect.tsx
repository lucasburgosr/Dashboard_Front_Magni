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
  const {empleado} = useEmpleado();
  const {empresas, empresaSeleccionada, handleChangeEmpresa} = useEmpresas();

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
    <div>
      <List
        component="nav"
        aria-label="Device settings"
      >
        <div className="" style={{ alignItems:'center',justifyContent:'center', display:'flex', overflow:'hidden'}} >
        <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0.133839 1.26611H25.1338C25.1338 9.76611 23.1974 11.266 20.6974 12.266C17.5832 13.5117 14.6975 11.3941 13.1975 8.89408C13.1975 10.3941 10.6975 14.8941 6.19748 13.3941C-0.429737 11.185 -0.199494 6.59945 0.133839 1.26611ZM2.1974 4.766L11.6975 4.26611C11.0308 6.93278 9.4974 11.166 6.6974 10.766C3.8974 10.366 2.6974 7.266 2.1974 4.766ZM23.1974 3.766H14.1974C15.1974 8.766 17.1974 10.266 19.1974 10.266C21.1974 10.266 22.6974 5.93267 23.1974 3.766Z" fill="#999999" />
            <path d="M13.5 16.2661C8.12338 19.5466 3.5 17.7661 1.19748 16.8596C2.19748 20.2665 6.42994 26.0304 11 22.7661C18 17.7661 23.1975 20.7662 24.1975 21.7664C25.1338 19.7661 22.5143 10.7661 13.5 16.2661Z" fill="#999999" />
            <path d="M25.1338 1.26611C5.53384 1.26611 0.300506 1.26611 0.133839 1.26611M25.1338 1.26611C25.1338 9.76611 23.1974 11.266 20.6974 12.266C17.5832 13.5117 14.6975 11.3941 13.1975 8.89408C13.1975 10.3941 10.6975 14.8941 6.19748 13.3941C-0.429737 11.185 -0.199494 6.59945 0.133839 1.26611M25.1338 1.26611H0.133839M2.1974 4.766L11.6975 4.26611C11.0308 6.93278 9.4974 11.166 6.6974 10.766C3.8974 10.366 2.6974 7.266 2.1974 4.766ZM14.1974 3.766H23.1974C22.6974 5.93267 21.1974 10.266 19.1974 10.266C17.1974 10.266 15.1974 8.766 14.1974 3.766ZM1.19748 16.8596C3.5 17.7661 8.12338 19.5466 13.5 16.2661C22.5143 10.7661 25.1338 19.7661 24.1975 21.7664C23.1975 20.7662 18 17.7661 11 22.7661C6.42994 26.0304 2.19748 20.2665 1.19748 16.8596Z" stroke="#999999" />
        </svg>
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
          >
            <div className="d-flex" style={{ width:'22rem'}}>
              <img src={(option.imagen ?? {url:''}).url} alt="" style={{width:'3rem', height:'3rem', borderRadius:'6px'}}/>
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