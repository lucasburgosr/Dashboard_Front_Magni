import { useEffect, useState } from "react";
import Empleado from "../../entidades/Empleado";
import EmpleadoService from "../../servicios/EmpleadoService";
import SearchBar from "../../componentes/searchBar/SearchBar";
import { Alert, Collapse } from '@mui/material';
import EmpleadosForm from './EmpleadosForm';
import { useSucursales } from '../../hooks/useSucursales';
import BtnVisible from '../../componentes/btnVisible/BtnVisible';
import EmpleadosTable from './EmpleadosTable';
import './empleados.css';

const Empleados = () => {
    const [empleado, setEmpleado] = useState<Empleado>(new Empleado());
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [show, setShow] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
    const [alerta, setAlerta] = useState<boolean>(false);
    const {sucursalSeleccionada} = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const empleadoService = new EmpleadoService(urlapi + "/api/empleados");

    const getEmpleadosRest = async () => {
        const datos: Empleado[] = await empleadoService.buscarXSucursal(mostrarVisibles ? sucursalSeleccionada.id : 0, busqueda);
        setEmpleados(datos);
    }

    const handleEliminar = async (empleado:Empleado) => {
        try {
            empleado.sucursal = mostrarVisibles ? undefined : sucursalSeleccionada;
            await empleadoService.put(empleado.id, empleado);
            getEmpleadosRest();
        } catch {
            setAlerta(true);
            setTimeout(() => {
              setAlerta(false);
            }, 3000);
        }
    }

    const handleBusqueda = () => {
        getEmpleadosRest();
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleShow = (datos?: Empleado) => {
        const seleccionado = new Empleado();
        if (datos) {
            Object.assign(seleccionado, datos);
        }
        setEmpleado(seleccionado);
        setShow(true);
    }

    useEffect(() => {
        getEmpleadosRest();
    }, [sucursalSeleccionada, mostrarVisibles]);

    return (
        <div className="m-3">
            <Collapse in={alerta} style={{position:'fixed', zIndex:'10', left:'10%', right:'10%'}}>
                <Alert severity="error" onClose={() => setAlerta(false)}>Hubo un problema al intentar cargar los datos.</Alert>
            </Collapse>

            <EmpleadosForm show={show} handleClose={handleClose} empleado={empleado} setEmpleado={setEmpleado} getEmpleadosRest={getEmpleadosRest} empleadoService={empleadoService}/>

            <div>
                <div className='d-flex justify-content-between'>
                    <SearchBar texto={"Buscar por nombre y apellido"} setBusqueda={setBusqueda} handleBusqueda={handleBusqueda} />
                    <div className="ms-2 mt-2">
                        <BtnVisible valor={mostrarVisibles} handleClick={() => setMostrarVisibles(!mostrarVisibles)} />
                    </div>
                    <div className="col mb-3 mt-auto d-flex justify-content-end">
                        <a className="ms-5 col-6 btn btn-lg btn-primary" style={{ height: '44px', fontSize: '18px' }} onClick={() => handleShow()}>
                            Nuevo
                        </a>
                    </div>
                </div>

                <EmpleadosTable empleados={empleados} mostrarVisibles={mostrarVisibles} handleShow={handleShow} handleEliminar={handleEliminar} />
            </div>
        </div>
    )
}

export default Empleados;