import { useEffect, useState } from "react";
import { useAtributos } from "../../hooks/useAtributos";
import UnidadMedidaService from "../../servicios/UnidadMedidaService";
import UnidadMedida from "../../entidades/UnidadMedida";
import { useSucursales } from "../../hooks/useSucursales";
import './unidadesMedidas.css';
import {  Button } from "@mui/material";
import { cilTrash } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
function UnidadesMedidaForm() {
    const [mostrarVisibles] = useState<boolean>(true);
    const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const { sucursales, sucursalSeleccionada } = useSucursales();
    const { unidadesMedida, setUnidadesMedida } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const unidadesMedidaService = new UnidadMedidaService(urlapi + "/api/unidadesmedida");

    const getUnidadesMedidaRest = async () => {
        const nuevasUnidades: UnidadMedida[] = await unidadesMedidaService.getAll();
        const unidadesFiltradas: UnidadMedida[] = nuevasUnidades.filter(u => {
            const incluyeSucursal = u.sucursales?.some(s => s.id === sucursalSeleccionada.id);
            return mostrarVisibles ? incluyeSucursal : !incluyeSucursal;
        }).sort((a, b) => a.denominacion < b.denominacion ? -1 : 1);
        setUnidadesMedida(unidadesFiltradas);
    }

    const mostrarInput = (categoriaPadreId?: number) => {
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

        const unidadNueva: UnidadMedida = new UnidadMedida();
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
        <div className="unidad-medida-container">
            <div className="unidad-medida-header">
                <div className="ms-3 d-flex flex-row">
                    <input type="text" className="form-control" placeholder="Unidad de medida" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                    <Button
                    onClick={save}
                    sx={{
                        bgcolor: "#a6c732",
                        "&:hover": {
                            bgcolor: "#a0b750",
                        },
                        my: 1,
                        mx: 1,
                        width: '12%',
                       
                    }}
                    variant="contained"
                >
                    Crear
                </Button>

                </div>
                
                <div className="accordion accordion-flush unidad-medida-accordion">
                    {unidadesMedida.map(unidadMedida => {
                        return (
                            <div key={unidadMedida.id} className="accordion-item">
                            <h2 className="accordion-header d-flex flex-row" id={"flush-heading" + unidadMedida.id}>
                                <div className="accordion-button custom-accordion-button accordion-no-arrow collapsed"> {unidadMedida.denominacion} </div>
                                <Button
                                    style={{
                                        margin:"10px 1px",
                                        backgroundColor: "#e05151",
                                        padding: "10px 15px",     // Ajusta el tamaño del botón
                                        height: "40px",
                                        width: "50px",
                                        minWidth: "auto",        // Asegura que el ancho mínimo sea automático
                                        minHeight: "10px",       // Asegura que la altura mínima sea automática
                                        right: '1%'
                                    }}
                                    className="custom-button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEliminarEnSucursal(unidadMedida)}
                                >
                                    <CIcon icon={cilTrash} size="sm" />
                                </Button>
                                </h2>
                            </div>
                        )
                    })
                    }
                </div>

                <div>
                    <label style={{ color: 'red', lineHeight: 5, padding: 5, userSelect: "none" }}>{txtValidacion}</label>
                </div>

            </div>
        </div>
    );
}

export default UnidadesMedidaForm;