import { useCallback, useEffect, useState } from "react";
import Sucursal from "../../entidades/Sucursal";
import SucursalService from "../../servicios/SucursalService";
import Empresa from "../../entidades/Empresa";
import { Button, Form, Modal } from "react-bootstrap";
import CargarImagen from "../../componentes/cargarImagenes/CargarImagen";
import DomicilioForm from "../../componentes/domicilios/DomicilioForm";
import BtnEdit from "../../componentes/btnEdit/BtnEdit";
import BtnVisible from "../../componentes/btnVisible/BtnVisible";
import { Alert, Collapse } from "@mui/material";
import { useEmpresas } from "../../hooks/useEmpresas";
import Horarios from "../../componentes/horarios/Horarios";
import HorarioSucursal from "../../entidades/HorarioSucursal";
import './sucursales.css';

export default function Sucursales() {
    const [sucursal, setSucursal] = useState<Sucursal>(new Sucursal());
    const [showSucursal, setShowSucursal] = useState(false);
    const [errorsSucursal, setErrorsSucursal] = useState<{ [key in keyof Sucursal]?: string }>({});
    const [alerta, setAlerta] = useState<boolean>(false);
    const { empresas, handleReloadEmpresa } = useEmpresas();

    const urlapi = import.meta.env.VITE_API_URL;
    const sucursalService = new SucursalService(urlapi + "/api/sucursales");

    const handleCloseSucursal = () => {
        setShowSucursal(false);
        setErrorsSucursal({});
    }

    const handleShowSucursal = (empresa: Empresa, datos?: Sucursal) => {
        const seleccionado = new Sucursal();
        if (datos) {
            Object.assign(seleccionado, datos);
            seleccionado.empresa = empresa;
        } else {
            seleccionado.empresa = empresa;
        }
        
        const diasValores = {Lunes:1, Martes:2, Miercoles:3, Jueves:4, Viernes:5, Sabado:6, Domingo:7};
        seleccionado.horarios.sort((a,b) => diasValores[a.diaSemana] - diasValores[b.diaSemana]);

        setSucursal(seleccionado);
        setShowSucursal(true);
    }

    const handleChangeHorarios = (dias:HorarioSucursal[]) => {
        const diasValores = {Lunes:1, Martes:2, Miercoles:3, Jueves:4, Viernes:5, Sabado:6, Domingo:7};
        setSucursal(prevState => ({
            ...prevState,
            ['horarios']: dias.sort((a,b) => diasValores[a.diaSemana] - diasValores[b.diaSemana])
        }));
    }

    const handleInputChangeSucursal = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const id = e.target.id;
        errorsSucursal[id] = '';
        let value: string | number | {id:number} | boolean | unknown;
        if (e.target.type === 'text') {
            value = String(e.target.value);
        } else if (e.target.type === 'number') {
            value = Number(e.target.value);
        } else if (['imagen', 'imagenes', 'categoria', 'unidadMedida'].includes(id)) {
            value = { id: Number(e.target.value) };
        } else if (e.target.type === 'checkbox') {
            if (sucursal.empresa!.sucursales.some(s => s.casaMatriz && s.id !== sucursal.id)) {
                alert("Ya existe una casa matriz");
                return;
            }
            value = (e.target as {checked:boolean}).checked;
        } else {
            value = e.target.value;
        }
        setSucursal(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const deleteSucursal = async (idSucursal: number) => {
        try {
            await sucursalService.eliminado(idSucursal);
            handleReloadEmpresa();
        } catch {
            setAlerta(true);
            setTimeout(() => {
              setAlerta(false);
            }, 3000);
        }
    }

    const handleSaveSucursal = useCallback(async () => {
        // Validación
        const erroresSucursal : {[key in keyof Sucursal]?: string} = {}
        for (const key in Sucursal) {
            erroresSucursal[key] = '';
        }

        // Campos a validar
        if (sucursal.nombre === '') {
            erroresSucursal['nombre'] = 'Debe ingresar el nombre de la empresa';
        }

        // Domicilio de la sucursal
        if (sucursal.domicilio.calle === '') {
            erroresSucursal['domicilio.calle'] = 'Debe ingresar calle';
        }
        if (sucursal.domicilio.localidad.id === 0) {
            erroresSucursal['domicilio.localidad'] = 'Debe ingresar localidad';
        }

        if (sucursal.domicilio.numero <= 0) {
            erroresSucursal['domicilio.numero'] = 'Ingrese un número válido';
        } else if (sucursal.domicilio.numero >= 100000) {
            erroresSucursal['domicilio.numero'] = 'El número de calle es demasiado grande. limítese a 5 cifras';
        }
        if (sucursal.domicilio.cp <= 0) {
            erroresSucursal['domicilio.cp'] = 'Ingrese código postal válido';
        } else if (sucursal.domicilio.cp >= 100000) {
            erroresSucursal['domicilio.cp'] = 'El código postal es demasiado grande. limítese a 5 cifras';
        }

        setErrorsSucursal(erroresSucursal);
        if (Object.keys(erroresSucursal).some(key => (erroresSucursal)[key]!.length > 0)) {
            return
        }

        if (sucursal.id === 0) {
            await sucursalService.post(sucursal);
        } else {
            await sucursalService.put(sucursal.id, sucursal);
        }
        handleReloadEmpresa();
        handleCloseSucursal();
    }, [sucursalService, sucursal, handleReloadEmpresa]);

    useEffect(() => {
        handleReloadEmpresa();
    }, []);

    return (

        <div className="m-3">
            <Collapse in={alerta} style={{position:'fixed', zIndex:'10', left:'10%', right:'10%'}}>
                <Alert severity="error" onClose={() => setAlerta(false)}>No se pudo eliminar la sucursal debido a que está siendo utilizada en otra parte</Alert>
            </Collapse>

            <Modal show={showSucursal} onHide={handleCloseSucursal} className="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title>Sucursal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <Form.Group className="mb-3" controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sucursal.nombre}
                                        autoFocus
                                        onChange={handleInputChangeSucursal}
                                        required
                                    />
                                {errorsSucursal['nombre'] && <div className='ms-1 mt-1 text-danger'>{errorsSucursal['nombre']}</div>}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="casaMatriz">
                                    <Form.Check
                                        type='checkbox'
                                        id={`casaMatriz`}
                                        label={`Es casa matriz`}
                                        checked={sucursal.casaMatriz}
                                        onChange={handleInputChangeSucursal}
                                    />
                                </Form.Group>

                                <Form.Group className="d-flex flex-column h-100" controlId="domicilio">
                                    <Form.Label>Domicilio</Form.Label>
                                    <div className="border rounded p-2 h-100">
                                        <DomicilioForm errors={errorsSucursal} domicilio={sucursal.domicilio} handleChangeDomicilio={(key, value) => setSucursal(prevState => ({
                                            ...prevState,
                                            [key]: value
                                        }))} />
                                    </div>
                                {errorsSucursal['domicilio'] && <div className='ms-1 mt-1 text-danger'>{errorsSucursal['domicilio']}</div>}
                                </Form.Group>
                            </div>

                            <div className='col-lg d-flex flex-column justify-content-between'>
                                <Form.Group className="mb-3" controlId="imagen">
                                    <Form.Label>Imágen</Form.Label>
                                    <CargarImagen imagen={sucursal.imagen} handleChange={(key, value) => setSucursal(prevState => ({
                                        ...prevState,
                                        [key]: value
                                    }))} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="domicilio">
                                    <Form.Label>Horarios</Form.Label>
                                    <Horarios horarios={sucursal.horarios} handleChange={handleChangeHorarios} />
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSucursal}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={handleSaveSucursal}>
                        Enviar
                    </Button>
                </Modal.Footer>
            </Modal>



            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {empresas.map(empresa =>
                    <div key={empresa.id} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                        <div className="mx-3 py-3 row border rounded fw-bold">
                            <h2 className="ms-3 col text-truncate">{empresa.nombre}</h2>
                            <div className="col-3">
                                <p className="my-0">Razón Social: {empresa.razonSocial}</p>
                                <p className="my-0">Cuil: {empresa.cuil}</p>
                            </div>

                        </div>

                        <div className="mx-2 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 justify-content-start">

                            {empresa.sucursales.map((sucursal: Sucursal) => (
                                <div key={sucursal.id} className="card border-0 mx-2" style={{ width: "242px", height: "250px" }}>
                                    <img src={sucursal.imagen.url} className="card-img-top" style={{ height: '165px' }} alt="..." />
                                    <div className="card-body m-0 p-0">
                                        <div className="d-flex">
                                            <div className="col-8">
                                                <h5 className="card-title mb-0 text-truncate">{sucursal.nombre}</h5>
                                                <h6 className="card-text my-0">{sucursal.domicilio.localidad.nombre}</h6>
                                                <p className="card-text me-2 horario-sucursal">
                                                    Horario: {(sucursal.horarios.find(horario => horario.diaSemana === ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()]))?.horarioDetalles
                                                        .sort((a,b) => new Date('2000-01-01T'+a.horaInicio).getTime() - new Date('2000-01-01T'+b.horaInicio).getTime())
                                                        .map(hd => `(${hd.horaInicio.toString().slice(0, -3)} a ${hd.horaFin.toString().slice(0, -3)})`).join(' y ') ?? 'N/A'}
                                                </p>
                                            </div>
                                            <div className="col-4 d-flex  flex-column justify-content-end mt-1">
                                                
                                                <div className="d-flex flex-wrap align-content-end justify-content-between" style={{height:'4rem'}}>
                                                <div className="mb-2">
                                                    {sucursal.casaMatriz 
                                                        ? <div className="rounded border px-1 py-0" style={{fontSize:'13px', backgroundColor:'#55DD55'}}>Casa matriz</div>
                                                        : <></>}
                                                </div>
                                                    <BtnEdit handleClick={() => handleShowSucursal(empresa, sucursal)} />
                                                    <BtnVisible valor={!sucursal.eliminado} handleClick={() => deleteSucursal(sucursal.id)} fill />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="card border-0 mx-2" style={{ width: "242px", height: "250px" }}>
                
                            <button className="rounded" onClick={() => handleShowSucursal(empresa)} style={{
                                width: '242px',
                                height: '250px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                backgroundColor:'#E0E0E0'
                                }} > <div style={{width: '121px',
                                height: '120px'}}>
                                    <svg fill="#999999"className="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-6flbmm" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="AddIcon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path></svg>
                                    </div>  
                                    </button>
                            </div>

                        </div>
                    </div>
                )}

            </div>

        </div>

    )
}