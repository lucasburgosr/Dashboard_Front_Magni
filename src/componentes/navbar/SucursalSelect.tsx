import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useSucursales } from '../../hooks/useSucursales';
import { useEffect, useState } from 'react';
import Sucursal from '../../entidades/Sucursal';

export default function SucursalSelect() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {sucursales, sucursalSeleccionada, handleChangeSucursal} = useSucursales();
  const [sucursalesFiltradas, setSucursalesFiltradas] = useState<Sucursal[]>([]);

  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    idSucursal: number
  ) => {
    handleChangeSucursal(idSucursal);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (sucursales.length)
      setSucursalesFiltradas(sucursales.filter(sucursal => !sucursal.eliminado));
  }, [sucursales])

  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
      >
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="Sucursal:"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
          className='text-truncate'
          style={{}}
          sx={{ bgcolor: 'background.paper', border: '1px solid #eeeeee', borderRadius: '6px', width:'14rem' }}
        >
          <ListItemText
            primary= {sucursalSeleccionada.nombre} 
            className='text-truncate'
            style={{width:'12rem'}}
          /><svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" tab-index="-1"><path d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5"></path></svg> 
        </ListItemButton>
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
        {sucursalesFiltradas.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === sucursalSeleccionada.id}
            onClick={() => handleMenuItemClick(option.id)}

          >
            <div className="d-flex" style={{width:'22rem'}}>
              <img src={(option.imagen ?? {url:''}).url} alt="" style={{width:'3rem', height:'3rem', borderRadius:'6px'}}/>
              <div className='ms-2 text-truncate ' style={{width:'17rem'}}>
                <h6 className='text-primary  mb-0'><b>{option.nombre ?? ''}</b></h6>
                <p style={{ fontSize: '0.8rem' }}>{`${option.domicilio.calle} ${option.domicilio.numero}, ${option.domicilio.localidad.nombre}`}</p>
              </div>
            </div>
            
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}