import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Form, Modal, Button, Spinner } from 'react-bootstrap';
import Empleado from "../../entidades/Empleado";
import CargarImagen from "../../componentes/cargarImagenes/CargarImagen";
import DomicilioForm from "../../componentes/domicilios/DomicilioForm";
import { useSucursales } from "../../hooks/useSucursales";
import EmpleadoService from "../../servicios/EmpleadoService";
import Horarios from "../../componentes/horarios/Horarios";
import HorarioEmpleado from "../../entidades/HorarioEmpleado";
import UsuarioEmpleado from "../../entidades/UsuarioEmpleado";

function EmpleadosForm({ show, handleClose, empleado, setEmpleado, getEmpleadosRest, empleadoService }: { show:boolean, handleClose:() => void, empleado:Empleado, setEmpleado:Dispatch<SetStateAction<Empleado>>, getEmpleadosRest:() => void, empleadoService:EmpleadoService}) {
    const [cargando, setCargando] = useState(false);
    const [errors, setErrors] = useState<{ [key in keyof Empleado]?: string }>({});
    const {sucursalSeleccionada} = useSucursales();

    const handleChangeHorarios = (dias:HorarioEmpleado[]) => {
        const diasValores = {Lunes:1, Martes:2, Miercoles:3, Jueves:4, Viernes:5, Sabado:6, Domingo:7};
        setEmpleado(prevState => ({
            ...prevState,
            ['horarios']: dias.sort((a,b) => diasValores[a.diaSemana] - diasValores[b.diaSemana])
        }));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const id = e.target.id;
        errors[id] = '';
        let value: string | number | {id:number} | boolean | unknown;
        if (e.target.type === 'text') {
            value = String(e.target.value);
        } else if (e.target.type === 'number') {
            value = Number(e.target.value);
        } else if (e.target.id === 'imagenes' || e.target.id === 'domicilio') {
            value = { id: Number(e.target.value) };
        } else {
            value = String(e.target.value);
        }
        setEmpleado(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const handleSave = useCallback(async () => {
        // Validación
        const erroresEmpleado: { [key in keyof Empleado]?: string } = {}
        for (const key in Empleado) {
            erroresEmpleado[key] = '';
        }

        // Campos a validar
        if (empleado.nombre === '') {
            erroresEmpleado['nombre'] = 'Debe ingresar el nombre del empleado';
        }
        if (empleado.apellido === '') {
            erroresEmpleado['apellido'] = 'Debe ingresar el apellido del empleado';
        }
        if (empleado.telefono === '') {
            erroresEmpleado['telefono'] = 'Debe ingresar el teléfono  del empleado';
        }
        if (empleado.email === '') {
            erroresEmpleado['email'] = 'Debe ingresar el E-mail del empleado';
        }
        if (String(empleado.fechaNacimiento) === '' || empleado.fechaNacimiento.toString().length > 10) {
            erroresEmpleado['fechaNacimiento'] = 'Debe ingresar la fecha de nacimiento del empleado';
        }

        // Domicilio
        if (empleado.domicilio.calle === '') {
            erroresEmpleado['domicilio.calle'] = 'Debe ingresar calle';
        }
        if (empleado.domicilio.localidad.nombre === '') {
            erroresEmpleado['domicilio.localidad'] = 'Debe ingresar localidad';
        } else if (empleado.domicilio.localidad.id === 0) {
            erroresEmpleado['domicilio.localidad'] = 'No se encontró la localidad';
        }
        if (empleado.domicilio.numero <= 0) {
            erroresEmpleado['domicilio.numero'] = 'Ingrese un número válido';
        } else if (empleado.domicilio.numero >= 100000) {
            erroresEmpleado['domicilio.numero'] = 'El número de calle es demasiado grande. limítese a 5 cifras';
        }
        if (empleado.domicilio.cp <= 0) {
            erroresEmpleado['domicilio.cp'] = 'Ingrese código postal válido';
        } else if (empleado.domicilio.cp >= 100000) {
            erroresEmpleado['domicilio.cp'] = 'El código postal es demasiado grande. limítese a 5 cifras';
        }

        setErrors(erroresEmpleado);
        if (Object.keys(erroresEmpleado).some(key => {
            const value = erroresEmpleado[key];
            return Array.isArray(value) ? value.length > 0 : Boolean(value);
        })) {
            return;
        }

        setCargando(true);

        empleado.pedidos = [];
        empleado.sucursal = sucursalSeleccionada;
        empleado.usuario = { auth0Id: '', username: `${empleado.nombre} ${empleado.apellido }`} as UsuarioEmpleado;

        if (empleado.id === 0) {
            await empleadoService.post(empleado);
        } else {
            await empleadoService.put(empleado.id, empleado);
        }

        setCargando(false);

        getEmpleadosRest();
        handleClose();
    }, [empleadoService, empleado, getEmpleadosRest]);

    useEffect(() => {
        if (show)
            handleChangeHorarios(empleado.horarios);
    }, [show])

    return (
        <Modal show={show} onHide={handleClose} className='modal-xl'>
            <Modal.Header closeButton>
                <Modal.Title>Empleado</Modal.Title>
            </Modal.Header>
            {cargando 
            ? <div className="cargando-empleado">
                <Spinner />
              </div>
            : <>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <Form.Group className="mb-3" controlId="imagen">
                                    <Form.Label>Imágen</Form.Label>
                                    <CargarImagen imagen={empleado.imagen} handleChange={(key, value) => setEmpleado((prevState:Empleado) => ({
                                        ...prevState,
                                        [key]: value
                                    }))} />
                                </Form.Group>

                                <div className="row">
                                    <Form.Group className="col mb-3" controlId="email">
                                        <Form.Label>E-mail</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={empleado.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors['email'] && <div className='ms-1 mt-1 text-danger'>{errors['email']}</div>}
                                    </Form.Group>
                                    <Form.Group className="col mb-3" controlId="fechaNacimiento">
                                        <Form.Label>Fecha de Nacimiento</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={empleado.fechaNacimiento.toString()}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors['fechaNacimiento'] && <div className='ms-1 mt-1 text-danger'>{errors['fechaNacimiento']}</div>}
                                    </Form.Group>
                                </div>

                                <Form.Group className="mb-5" controlId="domicilio">
                                    <Form.Label>Domicilio</Form.Label>
                                    <div className="border rounded p-2">
                                        <DomicilioForm domicilio={empleado.domicilio} errors={errors} handleChangeDomicilio={(key, value) => setEmpleado((prevState:Empleado) => ({
                                            ...prevState,
                                            [key]: value
                                        }))} />
                                    </div>
                                </Form.Group>
                            </div>
                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <div className="row">
                                    <Form.Group className="col mb-3" controlId="nombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={empleado.nombre}
                                            autoFocus
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors['nombre'] && <div className='ms-1 mt-1 text-danger'>{errors['nombre']}</div>}
                                    </Form.Group>

                                    <Form.Group className="col mb-3" controlId="apellido">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={empleado.apellido}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors['apellido'] && <div className='ms-1 mt-1 text-danger'>{errors['apellido']}</div>}
                                    </Form.Group>
                                </div>

                                <div className="row">
                                    <Form.Group className="col mb-3" controlId="rol">
                                        <Form.Label>Rol</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={empleado.rol}
                                            className='form-select'
                                            onChange={handleInputChange}
                                        >
                                            <option key={0} value='' disabled>Seleccione una opción</option>
                                            <option key={1} value='Administrador'>Administrador</option>
                                            <option key={2} value='Cajero'>Cajero</option>
                                            <option key={3} value='Cocinero'>Cocinero</option>
                                            <option key={4} value='Delivery'>Delivery</option>
                                        </Form.Control>
                                        {errors['rol'] && <div className='ms-1 mt-1 text-danger'>{errors['rol']}</div>}
                                    </Form.Group>
                                    <Form.Group className="col mb-3" controlId="telefono">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            value={empleado.telefono}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors['telefono'] && <div className='ms-1 mt-1 text-danger'>{errors['telefono']}</div>}
                                    </Form.Group>
                                </div>

                                <Form.Group className="mb-3" controlId="domicilio">
                                    <Form.Label>Horarios</Form.Label>
                                    <Horarios horarios={empleado.horarios} handleChange={handleChangeHorarios} />
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
            </>
            }
        </Modal>
    );
}

export default EmpleadosForm;
