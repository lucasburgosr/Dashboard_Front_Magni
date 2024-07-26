import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import ArticuloInsumo from "../../entidades/ArticuloInsumo";
import ArticuloInsumoService from "../../servicios/ArticuloInsumoService";
import { useAtributos } from "../../hooks/useAtributos";
import CboBoxFiltrar from "../../componentes/cboBoxFiltrar/CboBoxFiltrar";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import CargarImagenes from "../../componentes/cargarImagenes/CargarImagenes";
import Categoria from "../../entidades/Categoria";
import UnidadMedida from "../../entidades/UnidadMedida";
import BtnAddCategory from "../../componentes/btnAddCategory/BtnAddCategory";
import CategoriasForm from "../categorias/CategoriasForm";
import UnidadesMedidaForm from "../unidadesMedida/UnidadesMedidaForm";
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
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import StockInsumo from '../../entidades/StockInsumo';
import Slider from 'react-slick';
import { TablePagination } from '@mui/material';
import { useSucursales } from '../../hooks/useSucursales';
import BtnVisible from '../../componentes/btnVisible/BtnVisible';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import BtnAdd from '../../componentes/btnAdd/BtnAdd';

const Insumos = () => {
    const [articuloInsumo, setArticuloInsumo] = useState<ArticuloInsumo>(new ArticuloInsumo());
    const [busqueda, setBusqueda] = useState('');
    const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(0);
    const [errors, setErrors] = useState<{ [key in keyof ArticuloInsumo]?: string }>({});
    const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
    const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [show, setShow] = useState(false);
    const [showCategorias, setShowCategorias] = useState<boolean>(false);
    const [showUnidadesMedida, setShowUnidadesMedida] = useState<boolean>(false);
    const { sucursalSeleccionada } = useSucursales();
    const { categorias, unidadesMedida, getCategoriasRest, getUnidadesMedidaRest } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const articuloInsumoService = new ArticuloInsumoService(urlapi + "/api/insumos");

    const getInsumosRest = async () => {
        const datos: ArticuloInsumo[] = await articuloInsumoService.buscarXDenominacion(busqueda);
        datos.forEach(articulo => {
            const stockSucursal = articulo.stocksInsumo?.find(s => s.sucursal.id === sucursalSeleccionada.id);
            articulo.stockActual = stockSucursal?.stockActual ?? 0;
            articulo.stockMinimo = stockSucursal?.stockMinimo ?? 0;
            articulo.stockMaximo = stockSucursal?.stockMaximo ?? 0;
        });
        const insumosFiltrados = (categoriaSeleccionada
            ? datos.filter(insumo => insumo.categoria.id === categoriaSeleccionada)
            : datos).filter((i: ArticuloInsumo) => {
                const incluyeSucursal = i.stocksInsumo?.some(s => s.sucursal.id === sucursalSeleccionada.id);
                return mostrarVisibles ? incluyeSucursal : !incluyeSucursal;
            });
        setInsumos(insumosFiltrados);
        handleChangePage(undefined, 0);
    }

    const handleEliminarEnSucursal = async (articuloInsumo: ArticuloInsumo) => {
        const stockSucursalActual = articuloInsumo.stocksInsumo!.find(s => s.sucursal.id === Number(sucursalSeleccionada.id)) || new StockInsumo();
        if (!stockSucursalActual.sucursal.id) {
            stockSucursalActual.sucursal = sucursalSeleccionada;
            articuloInsumo.stocksInsumo = [...articuloInsumo.stocksInsumo!, stockSucursalActual];
        } else {
            articuloInsumo.stocksInsumo = articuloInsumo.stocksInsumo!.filter(s => s.id !== stockSucursalActual.id);
        }
        articuloInsumo.type = 'insumo';
        await articuloInsumoService.put(articuloInsumo.id, articuloInsumo);
        getInsumosRest();
    };

    const handleElaborarChange = async (articuloInsumo: ArticuloInsumo) => {
        articuloInsumo.type = 'insumo';
        articuloInsumo.esParaElaborar = !articuloInsumo.esParaElaborar;
        await articuloInsumoService.put(articuloInsumo.id, articuloInsumo);
        getInsumosRest();
    }

    const handleBusqueda = () => {
        getInsumosRest();
    }

    const handleChangeCategoria = (e: ChangeEvent<HTMLSelectElement>) => {
        setCategoriaSeleccionada(Number(e.target.value));
    }

    const handleClose = () => {
        setShow(false);
        setErrors({});
    }

    const handleShow = (datos?: ArticuloInsumo) => {
        const seleccionado = new ArticuloInsumo();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setArticuloInsumo(seleccionado);
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
        } else {
            value = { id: Number(e.target.value) };
        }
        setArticuloInsumo(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresNuevos: { [key in keyof ArticuloInsumo]?: string } = {}
        for (const key in ArticuloInsumo) {
            erroresNuevos[key] = '';
        }

        // Campos a validar
        if (articuloInsumo.denominacion === '') {
            erroresNuevos['denominacion'] = 'Debe ingresar la denominación';
        }
        if (articuloInsumo.categoria.id === 0) {
            erroresNuevos['categoria'] = 'Debe ingresar la categoría';
        }
        if (articuloInsumo.stockMinimo! < 0) {
            erroresNuevos['stockMinimo'] = 'Debe ingresar un stock mínimo válido, que sea mayor o igual a cero.';
        } else if (articuloInsumo.stockMinimo! >= 1000000000) {
            erroresNuevos['stockMinimo'] = 'El stock mínimo es demasiado grande. limítese a 9 cifras';
        }
        if (articuloInsumo.stockMaximo! < 0) {
            erroresNuevos['stockMaximo'] = 'Debe ingresar un stock máximo válido, que sea mayor o igual a cero.';
        } else if (articuloInsumo.stockMaximo! >= 1000000000) {
            erroresNuevos['stockMaximo'] = 'El stock máximo es demasiado grande. limítese a 9 cifras';
        } else if (articuloInsumo.stockMaximo! < articuloInsumo.stockMinimo!) {
            erroresNuevos['stockMaximo'] = 'El stock máximo no puede ser menor al stock mínimo.';
        }
        if (articuloInsumo.stockActual! < 0) {
            erroresNuevos['stockActual'] = 'Debe ingresar un stock válido, que sea mayor o igual a cero';
        } else if (articuloInsumo.stockActual! >= 1000000000) {
            erroresNuevos['stockActual'] = 'El stock actual es demasiado grande. limítese a 9 cifras';
        } else {
            if (articuloInsumo.stockActual! < articuloInsumo.stockMinimo!) {
                erroresNuevos['stockActual'] = 'El stock actual debe ser mayor al stock mínimo.';
            }
            if (articuloInsumo.stockActual! > articuloInsumo.stockMaximo!) {
                erroresNuevos['stockActual'] = 'El stock actual debe ser menor al stock máximo.';
            }
        }
        if (articuloInsumo.precioCompra! < 0) {
            erroresNuevos['precioCompra'] = 'Debe ingresar un precio de compra válido, que sea mayor a cero.';
        } else if (articuloInsumo.precioCompra >= 1000000000) {
            erroresNuevos['precioCompra'] = 'El precio de compra es demasiado grande. limítese a 9 cifras';
        }
        if (articuloInsumo.precioVenta! < 0) {
            erroresNuevos['precioVenta'] = 'Debe ingresar un precio de venta válido, que sea mayor o igual a cero.';
        } else if (articuloInsumo.precioVenta >= 1000000000) {
            erroresNuevos['precioVenta'] = 'El precio de venta es demasiado grande. limítese a 9 cifras';
        }
        if (articuloInsumo.unidadMedida.id === 0) {
            erroresNuevos['unidadMedida'] = 'Debe ingresar la unidad de medida';
        }

        setErrors(erroresNuevos);
        if (Object.keys(erroresNuevos).some(key => {
            const value = erroresNuevos[key];
            return Array.isArray(value) ? value.length > 0 : Boolean(value);
        })) {
            return;
        }

        if (articuloInsumo.id === 0) {
            const stockSucursal = new StockInsumo();
            stockSucursal.sucursal = sucursalSeleccionada;
            stockSucursal.stockActual = articuloInsumo.stockActual!;
            stockSucursal.stockMinimo = articuloInsumo.stockMinimo!;
            stockSucursal.stockMaximo = articuloInsumo.stockMaximo!;
            articuloInsumo.stocksInsumo?.push(stockSucursal);
            await articuloInsumoService.post(articuloInsumo);

        } else {
            // Se actualizan los stocks de la sucursal
            const stockSucursalActual = articuloInsumo.stocksInsumo!.find(s => s.sucursal.id === Number(sucursalSeleccionada.id));
            if (!stockSucursalActual) {
                return
            }

            stockSucursalActual.stockActual = articuloInsumo.stockActual!;
            stockSucursalActual.stockMinimo = articuloInsumo.stockMinimo!;
            stockSucursalActual.stockMaximo = articuloInsumo.stockMaximo!;
            articuloInsumo.stocksInsumo = [...articuloInsumo.stocksInsumo!.filter(s => s.id !== stockSucursalActual.id), stockSucursalActual!]

            await articuloInsumoService.put(articuloInsumo.id, articuloInsumo);
        }
        getInsumosRest();
        handleClose();
    }, [articuloInsumoService, articuloInsumo, getInsumosRest]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        if (sucursalSeleccionada) {
            getCategoriasRest();
            getUnidadesMedidaRest();
        }
    }, [sucursalSeleccionada, insumos]);

    useEffect(() => {
        setCategoriasFiltradas(categorias.filter(categoria => insumos.some(insumo => insumo.categoria.id === categoria.id)));
    }, [categorias]);

    useEffect(() => {
        if (sucursalSeleccionada) {
            getInsumosRest();
        }
    }, [categoriaSeleccionada, sucursalSeleccionada, mostrarVisibles]);

    function Row(props: { row: ArticuloInsumo }) {
        const { row } = props;
        const [open, setOpen] = React.useState(false);
        const settings = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: 7,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: 7,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 5,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 991,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                }
            ],
        };

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
                    <TableCell component="th" scope="row">
                        {row.denominacion}
                    </TableCell>
                    <TableCell align="right">${row.precioCompra.toLocaleString('es-AR')}</TableCell>
                    <TableCell align="right">${row.precioVenta.toLocaleString('es-AR')}</TableCell>
                    <TableCell align="right">{row.categoria.denominacion}</TableCell>
                    <TableCell align="center"><a className={"my-auto " + (row.esParaElaborar ? "btn btn-success" : "btn btn-dark")} style={{ width: '100px', marginBottom: 10 }} onClick={() => { handleElaborarChange(row) }}>{row.esParaElaborar ? "Sí" : "No"}</a></TableCell>
                    <TableCell style={{ width: '70px' }} align="center">
                        <div className='d-flex justify-content-end' >
                            {mostrarVisibles
                                ? <>
                                    <BtnEdit handleClick={() => (handleShow(row))} />
                                    <div className='ms-2' />
                                    <BtnDelete handleClick={() => (handleEliminarEnSucursal(row))} />
                                </>
                                : <BtnAdd color='#1b9e3e' handleClick={() => (handleEliminarEnSucursal(row))} />
                            }
                        </div>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Stock por sucursal
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sucursal</TableCell>
                                            <TableCell align="right">Stock Actual</TableCell>
                                            <TableCell align="right">Stock Mínimo</TableCell>
                                            <TableCell align="right">Stock Máximo</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.stocksInsumo!.map((stocksInsumo) => (
                                            <TableRow key={stocksInsumo.id}>
                                                <TableCell component="th" scope="row">
                                                    {stocksInsumo.sucursal.nombre}
                                                </TableCell>
                                                <TableCell align="right">{stocksInsumo.stockActual!.toLocaleString('es-AR')} {row.unidadMedida.denominacion}</TableCell>
                                                <TableCell align="right">{stocksInsumo.stockMinimo!.toLocaleString('es-AR')} {row.unidadMedida.denominacion}</TableCell>
                                                <TableCell align="right">{stocksInsumo.stockMaximo!.toLocaleString('es-AR')} {row.unidadMedida.denominacion}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                            {row.imagenes.length > 0 &&
                                <Box sx={{ margin: 1 }}>
                                    <div style={{ width: '86vw' }}>
                                        <Slider className='px-4 text-center mb-4' {...settings}>
                                            {row.imagenes.map((imagen, index) => (
                                                <div key={index}>
                                                    <img src={imagen.url} alt={`Imagen ${index}`} style={{ width: '100px', height: '100px' }} />
                                                </div>
                                            ))}
                                        </Slider>
                                    </div>
                                </Box>
                            }
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, insumos.length - page * rowsPerPage);

    return (
        <div className="m-3">
            <Modal show={show} onHide={handleClose} className='modal-xl'>
                <Modal.Header closeButton>
                    <Modal.Title>Insumo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                            <div className='col-sm col-md col-lg d-flex flex-column justify-content-between'>

                                <Form.Group className="mb-3" controlId="denominacion">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={articuloInsumo.denominacion}
                                        autoFocus
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {errors['denominacion'] && <div className='ms-1 mt-1 text-danger'>{errors['denominacion']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="precioCompra">
                                    <Form.Label>Precio de Compra</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={articuloInsumo.precioCompra}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors['precioCompra'] && <div className='ms-1 mt-1 text-danger'>{errors['precioCompra']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="stockActual">
                                    <Form.Label>Stock Actual</Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            value={articuloInsumo.stockActual}
                                            onChange={handleInputChange}
                                        />
                                        <span className="input-group-text">{unidadesMedida?.find(u => u.id === articuloInsumo.unidadMedida.id)?.denominacion}</span>
                                    </div>
                                    {errors['stockActual'] && <div className='ms-1 mt-1 text-danger'>{errors['stockActual']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="stockMinimo">
                                    <Form.Label>Stock Mínimo</Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            value={articuloInsumo.stockMinimo}
                                            onChange={handleInputChange}
                                        />
                                        <span className="input-group-text">{unidadesMedida?.find(u => u.id === articuloInsumo.unidadMedida.id)?.denominacion}</span>
                                    </div>
                                    {errors['stockMinimo'] && <div className='ms-1 mt-1 text-danger'>{errors['stockMinimo']}</div>}
                                </Form.Group>

                            </div>
                            <div className='col-sm col-md col-lg d-flex flex-column justify-content-between'>

                                <Form.Group className="mb-3" controlId="categoria">
                                    <Form.Label>Categoría</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control
                                            as="select"
                                            value={articuloInsumo.categoria.id}
                                            className='form-select'
                                            onChange={handleInputChange}
                                        >
                                            <option key={0} value='0' disabled>Seleccione una opción</option>
                                            {categorias.map((categoria: Categoria) => (
                                                <option key={categoria.id} value={categoria.id}>{categoria.denominacion}</option>
                                            ))}
                                        </Form.Control>
                                        <BtnAddCategory openModal={() => setShowCategorias(true)} />
                                    </div>
                                    {errors['categoria'] && <div className='ms-1 mt-1 text-danger'>{errors['categoria']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="precioVenta">
                                    <Form.Label>Precio de Venta</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={articuloInsumo.precioVenta}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    {errors['precioVenta'] && <div className='ms-1 mt-1 text-danger'>{errors['precioVenta']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="unidadMedida">
                                    <Form.Label>Unidad de Medida</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control
                                            as="select"
                                            value={articuloInsumo.unidadMedida.id}
                                            className='form-select'
                                            onChange={handleInputChange}
                                        >
                                            <option key={0} value='0' disabled>Seleccione una opción</option>
                                            {unidadesMedida.map((unidad: UnidadMedida) => (
                                                <option key={unidad.id} value={unidad.id}>{unidad.denominacion}</option>
                                            ))}
                                        </Form.Control>
                                        <BtnAddCategory openModal={() => setShowUnidadesMedida(true)} />
                                    </div>
                                    {errors['unidadMedida'] && <div className='ms-1 mt-1 text-danger'>{errors['unidadMedida']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="stockMaximo">
                                    <Form.Label>Stock Máximo</Form.Label>
                                    <div className="input-group">
                                        <Form.Control
                                            type="number"
                                            min={0}
                                            value={articuloInsumo.stockMaximo}
                                            onChange={handleInputChange}
                                        />
                                        <span className="input-group-text">{unidadesMedida?.find(u => u.id === articuloInsumo.unidadMedida.id)?.denominacion}</span>
                                    </div>
                                    {errors['stockMaximo'] && <div className='ms-1 mt-1 text-danger'>{errors['stockMaximo']}</div>}
                                </Form.Group>
                            </div>
                            <Form.Group className="mb-3" controlId="imagenes">
                                <Form.Label>Imágenes</Form.Label>
                                <CargarImagenes imagenes={articuloInsumo.imagenes} handleChange={(key, value) => setArticuloInsumo(prevState => ({
                                    ...prevState,
                                    [key]: value
                                }))} />
                            </Form.Group>
                        </div>
                    </Form>
                    { showCategorias 
                        && <div className="modal-backdrop fade show"></div> 
                    }
                    <Modal show={showCategorias} onHide={() => setShowCategorias(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Categorías</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <CategoriasForm />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => setShowCategorias(false)}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    { showUnidadesMedida 
                        && <div className="modal-backdrop fade show"></div> 
                    }
                    <Modal show={showUnidadesMedida} onHide={() => setShowUnidadesMedida(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Unidades de Medida</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UnidadesMedidaForm />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={() => setShowUnidadesMedida(false)}>
                                Guardar
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
                <div className='d-flex justify-content-between'>
                    <SearchBar setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />

                    <div className="col mb-3 mt-auto d-flex justify-content-end">
                        <CboBoxFiltrar
                            idCboInput="Categoria"
                            titulo="Categoría"
                            datos={categoriasFiltradas}
                            handleChange={handleChangeCategoria}
                        />
                        <div className="ms-2 mt-2">
                            <BtnVisible valor={mostrarVisibles} handleClick={() => setMostrarVisibles(!mostrarVisibles)} />
                        </div>
                        <a className="col ms-5 btn btn-lg btn-primary" style={{ height: '44px', fontSize: '18px' }} onClick={() => handleShow()}>
                            Nuevo
                        </a>
                    </div>
                </div>

                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Denominacion</TableCell>
                                <TableCell align="right">Precio de compra</TableCell>
                                <TableCell align="right">Precio de venta</TableCell>
                                <TableCell align="right">Categoría</TableCell>
                                <TableCell align="center">Es para elaborar</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {insumos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                    count={insumos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>
        </div>
    )
}

export default Insumos;