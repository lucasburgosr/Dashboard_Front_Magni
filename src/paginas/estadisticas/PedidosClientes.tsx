import * as React from 'react';
import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import PedidoService from "../../servicios/PedidoService";
import SearchBar from "../../componentes/searchBar/SearchBar";
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button } from 'react-bootstrap';
import { TablePagination } from '@mui/material';
import { useSucursales } from '../../hooks/useSucursales';
import './estadisticas.css';
import ChipEstado from '../../componentes/chipEstado/ChipEstado';
import { Estados } from '../../entidades/enums/Estados';
import { format } from 'date-fns';

const PedidosClientes = () => {
    const [busqueda, setBusqueda] = useState('');
    const [desde, setDesde] = useState<string>(new Date().getFullYear() + '-01-01');
    const [hasta, setHasta] = useState<string>(new Date().getFullYear() + '-12-31');
    const [page, setPage] = useState(0);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {sucursalSeleccionada} = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const handleFacturar = (pedidoId: number) => {
      pedidoService.facturarPedido(pedidoId);
    }

    const handleDescargarExcel = () => {
        pedidoService.getExcelPedidos(sucursalSeleccionada.id, busqueda, desde, hasta);
    }

    const getPedidosRest = async () => {
        const datos: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, busqueda, desde, hasta);
        setPedidos(datos);
    }

    const handleBusqueda = () => {
        getPedidosRest();
    }

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDesde(e.target.value);
    }

    const handleHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasta(e.target.value);
    }

    useEffect(() => {
        getPedidosRest();
    }, [sucursalSeleccionada, desde, hasta]);

    function Row(props: { row: Pedido }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        return (
            <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell align="center">{('0000' + row.id).slice(-5)}</TableCell>
              <TableCell align="center">{format(row.fechaPedido, "dd/MM/yy HH:mm")}</TableCell>
              <TableCell align="center">{row.tipoEnvio}</TableCell>
              <TableCell align="center">{row.formaPago}</TableCell>
              <TableCell align="center">
                <ChipEstado estado={row.estado} />
              </TableCell>
              <TableCell align="center">
                { row.estado === Estados.FACTURADO &&
                  <Button onClick={() => (handleFacturar(row.id))}>Imprimir factura</Button> }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Detalles del Pedido N°{('0000' + row.id).slice(-5)}
                    </Typography>
                    
                    <div className='row'>

                        <div className='col'>
                            <div><b>Fecha:</b> {format(row.fechaPedido, "dd/MM/yy HH:mm")}</div>
                            <div><b>Nombre y apellido:</b> {row.cliente.nombre} {row.cliente.apellido}</div>
                            <div><b>Dirección:</b> {row.domicilio.calle} {row.domicilio.numero}</div>
                            <div><b>Tipo de envío:</b> {row.tipoEnvio}</div>
                            <div><b>Forma de pago:</b> {row.formaPago}</div>
                        </div>

                        <div className='col'>
                            <div><b>Estado:</b> {row.estado}</div>
                            <div><b>Teléfono:</b> {row.cliente.telefono}</div>
                            <div><b>Localidad:</b> {row.domicilio.localidad.nombre}</div>
                            <div><b>Hora Estimada:</b> {String(row.horaEstimadaFinalizacion)}</div>
                        </div>

                    </div>
                    <br/>
                    <Table size="small" aria-label="purchases" className='table table-responsive'>
                      <TableHead className='table-dark'>
                        <TableRow>
                          <TableCell>Producto</TableCell>
                          <TableCell>Cantidad</TableCell>
                          <TableCell>Precio unitario</TableCell>
                          <TableCell>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className='table-group-divider'>
                        {row.detallePedidos.map((detalle) => (
                          <TableRow key={detalle.id}>
                            <TableCell component="th" scope="row">
                              {detalle.articulo.denominacion}
                            </TableCell>
                            <TableCell>{detalle.cantidad.toLocaleString('es-AR')}</TableCell>
                            <TableCell>${(detalle.articulo.precioVenta ?? detalle.articulo.precioPromocional).toLocaleString('es-AR')}</TableCell>
                            <TableCell>${(detalle.cantidad * (detalle.articulo.precioVenta ?? detalle.articulo.precioPromocional)).toLocaleString('es-AR')}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow key='subtotal'>
                            <TableCell component="th" scope="row" colSpan={2}></TableCell>
                            <TableCell>Subtotal</TableCell>
                            <TableCell>${(row.formaPago === "Efectivo" ? (row.total / 0.9) : row.total).toLocaleString('es-AR')}</TableCell>
                        </TableRow>
                        {row.formaPago === "Efectivo" &&
                        <TableRow key='descuentos'>
                            <TableCell component="th" scope="row" colSpan={2}></TableCell>
                            <TableCell>Descuentos</TableCell>
                            <TableCell>${((row.total / 0.9) * 0.1).toLocaleString('es-AR')}</TableCell>
                        </TableRow>}
                        <TableRow key='total'>
                            <TableCell component="th" scope="row" colSpan={2}></TableCell>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell><b>${row.total.toLocaleString('es-AR')}</b></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, pedidos.length - page * rowsPerPage);

    return (
        <div className="m-3">
            <div>
                <div className='mb-3 d-flex justify-content-between'>
                    <SearchBar texto={"Buscar por nombre y apellido"} setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />
                    <label className="ms-4 me-2 my-auto">Desde: </label>
                    <input className="date-input" type="date" value={desde} onChange={handleDesdeChange} />
                    <label className="ms-4 me-2 my-auto">Hasta: </label>
                    <input className="date-input me-2" type="date" value={hasta} onChange={handleHastaChange} />
                    <Button className="ms-auto col-2 btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</Button>
                </div>
                
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '10px' }} />
                            <TableCell align="center">Nro. de Pedido</TableCell>
                            <TableCell align="center">Fecha de Pedido</TableCell>
                            <TableCell align="center">Forma de Entrega</TableCell>
                            <TableCell align="center">Forma de Pago</TableCell>
                            <TableCell align="center">Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        {emptyRows > 0 && (
                            Array.from({ length: emptyRows }).map((_, index) => (
                                <TableRow key={`empty-${index}`} style={{ height: 71 }}>
                                    <TableCell colSpan={7} />
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={pedidos.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                
            </div>
        </div>
    )
}

export default PedidosClientes;