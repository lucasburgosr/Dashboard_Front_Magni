import { useEffect, useState } from "react";
import { useAtributos } from "../../hooks/useAtributos";
import UnidadMedidaService from "../../servicios/UnidadMedidaService";
import UnidadMedida from "../../entidades/UnidadMedida";
import { useSucursales } from "../../hooks/useSucursales";
import BtnVisible from "../../componentes/btnVisible/BtnVisible";
import './unidadesMedidas.css';

function UnidadesMedidaForm() {
    const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
    const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const {sucursales, sucursalSeleccionada} = useSucursales();
    const {unidadesMedida, setUnidadesMedida} = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const unidadesMedidaService = new UnidadMedidaService(urlapi + "/api/unidadesmedida");

    const getUnidadesMedidaRest = async () => {
        const nuevasUnidades:UnidadMedida[] = await unidadesMedidaService.getAll();
        const unidadesFiltradas: UnidadMedida[] = nuevasUnidades.filter(u => {
            const incluyeSucursal = u.sucursales?.some(s => s.id === sucursalSeleccionada.id);
            return mostrarVisibles ? incluyeSucursal : !incluyeSucursal;
        }).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1);
        setUnidadesMedida(unidadesFiltradas);
    }

    const mostrarInput = (categoriaPadreId?:number) => {
        const inputs = document.getElementsByClassName("input-categoria");
        for (let i = 0; i < inputs.length; i++) {
            const slide = inputs[i] as HTMLElement;
            slide.setAttribute("hidden", "true");
        }
        setTxtDenominacionNueva("");

        if (categoriaPadreId !== null)
            document.getElementById("inputCategoria" + categoriaPadreId)?.removeAttribute("hidden");
    }
    
    const handleEliminarEnSucursal = async (unidadMedida: UnidadMedida) => {
        if (unidadMedida.sucursales?.some(s => s.id === sucursalSeleccionada.id)) {
            unidadMedida.sucursales = unidadMedida.sucursales.filter(s => s.id !== sucursalSeleccionada.id);
        } else {
            unidadMedida.sucursales = [...unidadMedida.sucursales, sucursalSeleccionada];
        }
        await unidadesMedidaService.put(unidadMedida.id, unidadMedida);
        getUnidadesMedidaRest();
    }; 

    const save = async () => {
        if (txtDenominacionNueva == undefined || txtDenominacionNueva == "") {
            setTxtValidacion("Ingrese la unidad de medida");
            return;
        }
        if (unidadesMedida.some(a => a.denominacion === txtDenominacionNueva)) {
            setTxtValidacion("La unidad de medida ya existe");
            return;
        }

        const unidadNueva:UnidadMedida = new UnidadMedida();
        unidadNueva.denominacion = txtDenominacionNueva;
        unidadNueva.sucursales = sucursales;
        await unidadesMedidaService.post(unidadNueva);

        setTxtValidacion("");
        mostrarInput();

        await getUnidadesMedidaRest();
    }

    useEffect(() => {
        getUnidadesMedidaRest();
    }, [mostrarVisibles, sucursalSeleccionada]);

    return (
        <div className="row">
        <div className="col-sm">

            <div className="ms-3 d-flex flex-row">
                <input type="text" className="form-control" placeholder="Unidad de medida" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                <button className="btn mx-2 p-0" type="button" onClick={save}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00AA00" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                        </svg>
                    </div>
                </button>
                <div className="mt-2">
                    <BtnVisible valor={mostrarVisibles} handleClick={() => setMostrarVisibles(!mostrarVisibles)} />
                </div>
            </div>

            <div className="accordion accordion-flush">
                {unidadesMedida.map(unidadMedida => { return (
                    <div key={unidadMedida.id} className="accordion-item">
                        <h2 className="accordion-header d-flex flex-row" id={"flush-heading"+unidadMedida.id}>
                        
                        <div className="accordion-button accordion-no-arrow collapsed"> {unidadMedida.denominacion} </div>
                            <button className="btn mx-2 p-0" type="button" onClick={() => handleEliminarEnSucursal(unidadMedida)} > 
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {mostrarVisibles 
                                    ?   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF0000" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                                        </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00AA00" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                        </svg>
                                }
                            </div>
                            </button>
                        </h2>
                    </div>
                )})
                }
            </div>

            <div>
                <label style={{ color: 'red', lineHeight: 5, padding: 5, userSelect: "none"}}>{txtValidacion}</label>
            </div>

        </div>
        </div>
    );
}

export default UnidadesMedidaForm;