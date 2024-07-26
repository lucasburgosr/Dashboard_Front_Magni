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
import { Button, Form } from 'react-bootstrap';
import CboBoxFiltrar from '../../componentes/cboBoxFiltrar/CboBoxFiltrar';
import { TablePagination } from '@mui/material';
import { useSucursales } from '../../hooks/useSucursales';
import ChipEstado from '../../componentes/chipEstado/ChipEstado';
import { Estados as Estado } from '../../entidades/enums/Estados';
import { format } from 'date-fns';

const Facturacion = () => {
    const [busqueda, setBusqueda] = useState('');
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [page, setPage] = useState(0);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const {sucursalSeleccionada} = useSucursales();

    const estados = [...Object.keys(Estado).map((e, index) => ({id:index+1, denominacion:e}))];

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const handleFacturar = (pedidoId: number) => {
      pedidoService.facturarPedido(pedidoId);
    }

    const handleDescargarExcel = () => {
        pedidoService.getExcelPedidos(sucursalSeleccionada.id, busqueda, undefined, undefined, estadoSeleccionado as Estado);
    }

    const getPedidosRest = async () => {
        const datos: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, busqueda, "", "", estadoSeleccionado as Estado ?? undefined);
        setPedidos(datos);
    }

    const handleBusqueda = () => {
        getPedidosRest();
    }

    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const estadoSeleccionado = e.target.selectedOptions[0].text;
        if (e.target.value === '0') {
            setEstadoSeleccionado('');
        } else {
            setEstadoSeleccionado(estadoSeleccionado);
        }
    }

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    useEffect(() => {
        getPedidosRest();
    }, [sucursalSeleccionada, estadoSeleccionado]);

    function Row(props: { row: Pedido }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        return (
            <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <TableCell>
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
                { row.estado === Estado.FACTURADO &&
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
                    <Form.Group className="d-flex" controlId="rol">
                        <CboBoxFiltrar idCboInput='estado' titulo='Estado' datos={estados} handleChange={handleEstadoChange} />
                    </Form.Group>
                    
                    <Button className="col-2 btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</Button>
        
                </div>
                
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell />
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

export default Facturacion;