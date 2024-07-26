import * as React from 'react';
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import ArticuloManufacturado from "../../entidades/ArticuloManufacturado";
import ArticuloManufacturadoService from "../../servicios/ArticuloManufacturadoService";
import { useAtributos } from "../../hooks/useAtributos";
import CboBoxFiltrar from "../../componentes/cboBoxFiltrar/CboBoxFiltrar";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Button, Form, Modal } from "react-bootstrap";
import CargarImagenes from "../../componentes/cargarImagenes/CargarImagenes";
import CargarDetallesManufacturado from "../../componentes/cargarDetalles/CargarDetallesManufacturado";
import Categoria from "../../entidades/Categoria";
import UnidadMedida from "../../entidades/UnidadMedida";
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
import BtnAddCategory from '../../componentes/btnAddCategory/BtnAddCategory';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import Slider from 'react-slick';
import { TablePagination } from '@mui/material';
import { useSucursales } from '../../hooks/useSucursales';
import BtnAdd from '../../componentes/btnAdd/BtnAdd';
import BtnVisible from '../../componentes/btnVisible/BtnVisible';


const Manufacturados = () => {
  const [articuloManufacturado, setArticuloManufacturado] = useState<ArticuloManufacturado>(new ArticuloManufacturado());
  const [busqueda, setBusqueda] = useState('');
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key in keyof ArticuloManufacturado]?: string }>({});
  const [manufacturados, setManufacturados] = useState<ArticuloManufacturado[]>([]);
  const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [show, setShow] = useState(false);
  const [showCategorias, setShowCategorias] = useState<boolean>(false);
  const [showUnidadesMedida, setShowUnidadesMedida] = useState<boolean>(false);
  const { sucursalSeleccionada } = useSucursales();

  const { categorias, unidadesMedida, getCategoriasRest, getUnidadesMedidaRest } = useAtributos();

  const urlapi = import.meta.env.VITE_API_URL;
  const articuloManufacturadoService = new ArticuloManufacturadoService(urlapi + "/api/manufacturados");

  const getManufacturadosRest = useCallback(async () => {
    try {
      const datos: ArticuloManufacturado[] = await articuloManufacturadoService.buscarXSucursal(sucursalSeleccionada.id, busqueda, !mostrarVisibles);
      const manufacturadosFiltrados = (categoriaSeleccionada
        ? datos.filter(manufacturado => manufacturado.categoria.id === categoriaSeleccionada)
        : datos);

      setManufacturados(manufacturadosFiltrados);
    } catch (error) {
      console.error("Error al buscar los datos", error);
    }
  }, [busqueda, mostrarVisibles]);

  const handleBusqueda = () => {
    getManufacturadosRest();
  }

  const handleChangeCategoria = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategoriaSeleccionada(Number(e.target.value));
  }

  const handleClose = () => {
    setShow(false);
    setErrors({});
  }

  const handleEliminarEnSucursal = async (articuloManufacturado: ArticuloManufacturado) => {
    if (articuloManufacturado.sucursales.some(s => s.id === sucursalSeleccionada.id)) {
      articuloManufacturado.sucursales = articuloManufacturado.sucursales.filter(s => s.id !== sucursalSeleccionada.id);
    } else {
      articuloManufacturado.sucursales = [...articuloManufacturado.sucursales, sucursalSeleccionada];
    }
    articuloManufacturado.type = 'manufacturado';
    await articuloManufacturadoService.put(articuloManufacturado.id, articuloManufacturado);
    getManufacturadosRest();
  };

  const handleShow = (datos?: ArticuloManufacturado) => {
    const seleccionado = new ArticuloManufacturado();
    if (datos) {
      Object.assign(seleccionado, datos);
    }
    seleccionado.articuloManufacturadoDetalles.sort((a,b) => b.id - a.id);
    setArticuloManufacturado(seleccionado);
    setShow(true);
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const id = e.target.id;
    errors[id] = '';
    let value: unknown;
    if (e.target.type === 'text') {
      value = String(e.target.value);
    } else if (e.target.type === 'number') {
      value = Number(e.target.value);
    } else if (id === 'imagenes' || id === 'categoria' || id === 'unidadMedida') {
      value = { id: Number(e.target.value) };
    } else {
      value = e.target.value;
    }
    setArticuloManufacturado(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  const handleSave = useCallback(async () => {
    // Validación
    const erroresNuevos: { [key in keyof ArticuloManufacturado]?: string } = {}
    for (const key in ArticuloManufacturado) {
      erroresNuevos[key] = '';
    }

    // Campos a validar
    if (articuloManufacturado.denominacion === '') {
      erroresNuevos['denominacion'] = 'Debe ingresar la denominación';
    }
    if (articuloManufacturado.categoria.id === 0) {
      erroresNuevos['categoria'] = 'Debe ingresar la categoría';
    }
    if (articuloManufacturado.resumen === '') {
      erroresNuevos['resumen'] = 'Debe ingresar una descripción resumida del producto';
    }
    if (articuloManufacturado.descripcion === '') {
      erroresNuevos['descripcion'] = 'Debe ingresar una descripción del producto';
    }
    if (articuloManufacturado.tiempoEstimadoMinutos! < 0) {
      erroresNuevos['tiempoEstimadoMinutos'] = 'Debe ingresar el tiempo estimado de preparación del producto';
    } else if (articuloManufacturado.tiempoEstimadoMinutos >= 1000) {
      erroresNuevos['tiempoEstimadoMinutos'] = 'El tiempo estimado es demasiado grande. limítese a 3 cifras';
    }
    if (articuloManufacturado.precioVenta! < 0) {
      erroresNuevos['precioVenta'] = 'Debe ingresar un precio de venta válido, que sea mayor o igual a cero.';
    } else if (articuloManufacturado.precioVenta! >= 1000000000) {
      erroresNuevos['precioVenta'] = 'El precio de venta es demasiado grande. limítese a 9 cifras';
    }
    if (articuloManufacturado.unidadMedida.id === 0) {
      erroresNuevos['unidadMedida'] = 'Debe ingresar la unidad de medida';
    }
    if (articuloManufacturado.preparacion === '') {
      erroresNuevos['preparacion'] = 'Debe ingresar la preparación del producto';
    }
    if (articuloManufacturado.articuloManufacturadoDetalles.length === 0) {
      erroresNuevos['articuloManufacturadoDetalles'] = 'Debe definir al menos un ingrediente para el producto';
    }

    setErrors(erroresNuevos);
    if (Object.keys(erroresNuevos).some(key => {
      const value = erroresNuevos[key];
      return Array.isArray(value) ? value.length > 0 : Boolean(value);
    })) {
      return;
    }

    if (articuloManufacturado.id === 0) {
      articuloManufacturado.sucursales = [sucursalSeleccionada];
      await articuloManufacturadoService.post(articuloManufacturado);
    } else {
      await articuloManufacturadoService.put(articuloManufacturado.id, articuloManufacturado);
    }
    getManufacturadosRest();
    handleClose();
  }, [articuloManufacturado, getManufacturadosRest]);

  useEffect(() => {
    getCategoriasRest();
    getUnidadesMedidaRest();
  }, [sucursalSeleccionada, manufacturados]);

  useEffect(() => {
    setCategoriasFiltradas(categorias.filter(categoria => manufacturados.some(manufacturado => manufacturado.categoria.id === categoria.id)));
  }, [categorias])

  useEffect(() => {
    if (sucursalSeleccionada)
      getManufacturadosRest();
  }, [sucursalSeleccionada, categoriaSeleccionada, mostrarVisibles]);

  function Row(props: { row: ArticuloManufacturado }) {
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
        },
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
          <TableCell align="center">{row.tiempoEstimadoMinutos}</TableCell>
          <TableCell align="center">{row.stockActual}</TableCell>
          <TableCell align="right">${row.precioVenta.toLocaleString('es-AR')}</TableCell>
          <TableCell align="center">{row.categoria.denominacion}</TableCell>
          <TableCell style={{ width: '10%' }} align="center">
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

              <div className='row'>
                <div className='col'>

                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Descripción
                    </Typography>

                    <Table size="small" aria-label="purchases">

                      <TableHead>
                        <TableRow>
                          <p className='mb-2'>
                            {row.resumen}
                          </p>
                        </TableRow>
                        <TableRow>
                          <p style={{ fontSize: 11 }}><i>
                            "{row.descripcion}"
                          </i></p>
                        </TableRow>
                        {row.imagenes.length > 0 &&
                          <Box sx={{ margin: 1 }}>
                            <div style={{ width: '95%' }}>
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
                      </TableHead>

                    </Table>

                  </Box>

                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Preparación
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {row.preparacion}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </Box>
                </div>
                <div className='col'>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Receta
                    </Typography>
                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Insumo</TableCell>
                          <TableCell align="right">Cantidad</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row.articuloManufacturadoDetalles?.map((manufacturadoDetalle) => (
                          <TableRow key={manufacturadoDetalle.id}>
                            <TableCell component="th" scope="row">{manufacturadoDetalle.articuloInsumo.denominacion}</TableCell>
                            <TableCell align="right">{manufacturadoDetalle.cantidad!.toLocaleString('es-AR')} {manufacturadoDetalle.articuloInsumo.unidadMedida.denominacion}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>

                </div>
              </div>



            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
    
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, manufacturados.length - page * rowsPerPage);

  return (
    <div className="m-3">
      <Modal show={show} onHide={handleClose} className='modal-xl'>
        <Modal.Header closeButton>
          <Modal.Title>Artículo Manufacturado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className='row'>
              <div className='col-lg d-flex flex-column justify-content-between'>
                <div className='mb-3 row justify-content-between'>
                  <Form.Group className="col" controlId="denominacion">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={articuloManufacturado.denominacion}
                      autoFocus
                      onChange={handleInputChange}
                      required
                    />
                    {errors['denominacion'] && <div className='ms-1 mt-1 text-danger'>{errors['denominacion']}</div>}
                  </Form.Group>
                  <Form.Group className="col" controlId="categoria">
                    <Form.Label>Categoría</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        as="select"
                        value={articuloManufacturado.categoria.id}
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
                </div>

                <div className='row'>
                  <Form.Group className="col-12 col-lg-6 mb-3" controlId="resumen">
                    <Form.Label>Descripción resumida</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={articuloManufacturado.resumen}
                      onChange={handleInputChange}
                    />
                    {errors['resumen'] && <div className='ms-1 mt-1 text-danger'>{errors['resumen']}</div>}
                  </Form.Group>
                  <Form.Group className="col-12 col-lg-6 mb-3" controlId="descripcion">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={articuloManufacturado.descripcion}
                      onChange={handleInputChange}
                    />
                    {errors['descripcion'] && <div className='ms-1 mt-1 text-danger'>{errors['descripcion']}</div>}
                  </Form.Group>
                </div>

                <Form.Group className="mb-3" controlId="preparacion">
                  <Form.Label>Preparación</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={articuloManufacturado.preparacion}
                    onChange={handleInputChange}
                  />
                  {errors['preparacion'] && <div className='ms-1 mt-1 text-danger'>{errors['preparacion']}</div>}
                </Form.Group>

                <div className='row justify-content-between'>
                  <Form.Group className='col-6 mb-3 col-xl-3' controlId="precioVenta">
                    <Form.Label>Precio de Venta</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <Form.Control
                        type="number"
                        value={articuloManufacturado.precioVenta}
                        min={0}
                        step={0.01}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors['precioVenta'] && <div className='ms-1 mt-1 text-danger'>{errors['precioVenta']}</div>}
                  </Form.Group>
                  <Form.Group className='col-6 col-xl-4' controlId="tiempoEstimadoMinutos">
                    <Form.Label>Tiempo Estimado</Form.Label>
                    <div className="input-group">
                      <Form.Control
                        type="number"
                        value={articuloManufacturado.tiempoEstimadoMinutos}
                        min={0}
                        step={0.1}
                        onChange={handleInputChange}
                        aria-describedby="tiempoEstimadoAddon"
                      />
                      <span className="input-group-text" id="tiempoEstimadoAddon">Minutos</span>
                    </div>
                    {errors['tiempoEstimadoMinutos'] && <div className='ms-1 mt-1 text-danger'>{errors['tiempoEstimadoMinutos']}</div>}
                  </Form.Group>
                  <Form.Group className="col mb-3" controlId="unidadMedida">
                    <Form.Label>Unidad de Medida</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        as="select"
                        value={articuloManufacturado.unidadMedida.id}
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
                </div>

              </div>
              <div className='col-lg d-flex flex-column justify-content-between'>

                <Form.Group controlId="articuloManufacturadoDetalles">
                  <Form.Label>Cargar Receta</Form.Label>
                  <CargarDetallesManufacturado articulo={articuloManufacturado} handleChange={(key, value) => setArticuloManufacturado(prevState => ({
                    ...prevState,
                    [key]: value
                  }))} />
                  {errors['articuloManufacturadoDetalles'] && <div className='ms-1 mt-1 text-danger'>{errors['articuloManufacturadoDetalles']}</div>}
                </Form.Group>

              </div>

              <Form.Group controlId="imagenes">
                <Form.Label>Imágenes</Form.Label>
                <CargarImagenes imagenes={articuloManufacturado.imagenes} handleChange={(key, value) => setArticuloManufacturado(prevState => ({
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
            <a className="ms-5 col btn btn-lg btn-primary" style={{ height: '44px', fontSize: '18px' }} onClick={() => handleShow()}>
              Nuevo
            </a>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Denominación</TableCell>
                <TableCell align="center">Tiempo Estimado (min)</TableCell>
                <TableCell align="center">Stock</TableCell>
                <TableCell align="right">Precio de Venta</TableCell>
                <TableCell align="center">Categoría</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {manufacturados.length > 0 && manufacturados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
          count={manufacturados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default Manufacturados;