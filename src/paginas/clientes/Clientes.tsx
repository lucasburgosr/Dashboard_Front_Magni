import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import Cliente from "../../entidades/Cliente";
import ClienteService from "../../servicios/ClienteService";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CargarImagen from '../../componentes/cargarImagenes/CargarImagen';
import Domicilios from '../../componentes/domicilios/Domicilios';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import { TablePagination } from '@mui/material';
import BtnVisible from '../../componentes/btnVisible/BtnVisible';
import BtnAdd from '../../componentes/btnAdd/BtnAdd';

const Clientes = () => {
    const [cliente, setCliente] = useState<Cliente>(new Cliente());
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
    const [show, setShow] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [errors, setErrors] = useState<{ [key in keyof Cliente]?: string }>({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const urlapi = import.meta.env.VITE_API_URL;
    const clienteService = new ClienteService(urlapi + "/api/clientes");

    const getClientesRest = async () => {
        const datos: Cliente[] = await clienteService.buscarXNombre(busqueda, !mostrarVisibles);
        setClientes(datos);
    }

    const handleEliminar = async (idCliente: number) => {
        await clienteService.eliminado(idCliente);
        getClientesRest();
    }

    const handleBusqueda = () => {
        getClientesRest();
    }

    const handleClose = () => {
        setShow(false);
        setErrors({});
    }

    const handleShow = (datos?: Cliente) => {
        const seleccionado = new Cliente();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setCliente(seleccionado);
        setShow(true);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const id = e.target.id;
        errors[id] = '';
        let value: unknown;
        if (e.target.type === 'text') {
            value = String(e.target.value);
        } else if (e.target.type === 'number') {
            value = Number(e.target.value);
        } else if (e.target.type === 'email' || e.target.type === 'tel' || e.target.type === 'date') {
            value = String(e.target.value);
        } else {
            value = {id:Number(e.target.value)};
        }
        setCliente(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresNuevos : {[key in keyof Cliente]?: string} = {}
        for (const key in Cliente) {
            erroresNuevos[key] = '';
        }

        // Campos a validar
        if (cliente.nombre === '') {
            erroresNuevos['nombre'] = 'Debe ingresar el nombre del cliente';
        }
        if (cliente.apellido === '') {
            erroresNuevos['apellido'] = 'Debe ingresar el apellido del cliente';
        }
        if (cliente.telefono === '') {
            erroresNuevos['telefono'] = 'Debe ingresar el teléfono  del cliente';
        }
        if (cliente.email === '') {
            erroresNuevos['email'] = 'Debe ingresar el E-mail del cliente';
        }
        if (String(cliente.fechaNacimiento) === '' || cliente.fechaNacimiento.toString().length > 10) {
            erroresNuevos['fechaNacimiento'] = 'Debe ingresar la fecha de nacimiento del cliente';
        }

        setErrors(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => {
            const value = erroresNuevos[key];
            return Array.isArray(value) ? value.length > 0 : Boolean(value);
        })) {
            return;
        }

        cliente.pedidos = [];
        if (cliente.id === 0) {
            alert("Ocurrió un error al modificar el cliente");
        } else {
            await clienteService.put(cliente.id, cliente);
        }
        getClientesRest();
        handleClose();
    }, [clienteService, cliente, getClientesRest]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
      };
  
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    useEffect(() => {
        getClientesRest();
    }, [mostrarVisibles]);

    function Row(props: { row: Cliente }) {
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
              <TableCell align="center">{row.nombre} {row.apellido}</TableCell>
              <TableCell align="center">{row.telefono}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.fechaNacimiento.toLocaleString('es-AR')}</TableCell>
              <TableCell style={{width:'10%'}} align="center">
                <div className='d-flex justify-content-end' >
                {mostrarVisibles
                    ? <>
                    <BtnEdit handleClick={() => (handleShow(row))} />
                    <div className='ms-2' />
                    <BtnDelete handleClick={() => (handleEliminar(row.id))} />
                    </>
                    : <BtnAdd color='#1b9e3e' handleClick={() => (handleEliminar(row.id))} />
                }
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Domicilios
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Calle</TableCell>
                          <TableCell>Localidad</TableCell>
                          <TableCell>Provincia</TableCell>
                          <TableCell>País</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.domicilios!.map((domicilio) => (
                          <TableRow key={domicilio.id}>
                            <TableCell component="th" scope="row">
                              {domicilio.calle} {domicilio.numero}
                            </TableCell>
                            <TableCell>{domicilio.localidad.nombre}</TableCell>
                            <TableCell>{domicilio.localidad.provincia.nombre}</TableCell>
                            <TableCell>{domicilio.localidad.provincia.pais.nombre}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </React.Fragment>
        );
      }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, clientes.length - page * rowsPerPage);

    return (
        <div className="m-3">
            <Modal show={show} onHide={handleClose} className='modal-xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                        <div className='col-lg d-flex flex-column justify-content-between'>

                        <Form.Group className="mb-3" controlId="imagen">
                            <Form.Label>Imágen</Form.Label>
                            <CargarImagen imagen={cliente.imagen} handleChange={(key, value) => setCliente(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="domicilios">
                            <Form.Label>Domicilios</Form.Label>
                            <Domicilios domicilios={cliente.domicilios} editar handleChange={(key, value) => setCliente(prevState => ({
                                ...prevState,
                                [key]: value
                            }))} />
                        </Form.Group>
                        
                        </div>
                        <div className='col-lg d-flex flex-column justify-content-between'>
                        
                        <Form.Group className="mb-3" controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                value={cliente.nombre}
                                autoFocus
                                onChange={handleInputChange}
                                required
                            />
                            {errors['nombre'] && <div className='ms-1 mt-1 text-danger'>{errors['nombre']}</div>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="apellido">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                value={cliente.apellido}
                                onChange={handleInputChange}
                                required
                            />
                            {errors['apellido'] && <div className='ms-1 mt-1 text-danger'>{errors['apellido']}</div>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="telefono">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                value={cliente.telefono}
                                onChange={handleInputChange}
                                required
                            />
                            {errors['telefono'] && <div className='ms-1 mt-1 text-danger'>{errors['telefono']}</div>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                type="email"
                                value={cliente.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors['email'] && <div className='ms-1 mt-1 text-danger'>{errors['email']}</div>}
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="fechaNacimiento">
                            <Form.Label>Fecha de Nacimiento</Form.Label>
                            <Form.Control
                                type="date"
                                value={cliente.fechaNacimiento.toString()}
                                onChange={handleInputChange}
                                required
                            />
                            {errors['fechaNacimiento'] && <div className='ms-1 mt-1 text-danger'>{errors['fechaNacimiento']}</div>}
                        </Form.Group>
                        </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>

            <div>
                <div className='mb-3 d-flex justify-content-between'>
                    <SearchBar texto={"Buscar por nombre y apellido"} setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />
                    <div className="ms-2 me-auto mt-2">
                        <BtnVisible valor={mostrarVisibles} handleClick={() => setMostrarVisibles(!mostrarVisibles)} />
                    </div>
                </div>
                
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="center">Nombre</TableCell>
                            <TableCell align="center">Teléfono</TableCell>
                            <TableCell align="center">E-mail</TableCell>
                            <TableCell align="center">Fecha de Nacimiento</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        {emptyRows > 0 && (
                            Array.from({ length: emptyRows }).map((_, index) => (
                                <TableRow key={`empty-${index}`} style={{ height: 71 }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={clientes.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                
            </div>
        </div>
    )
}

export default Clientes;