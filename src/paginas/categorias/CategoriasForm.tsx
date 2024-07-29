import { useEffect, useState } from "react";
import Categoria from "../../entidades/Categoria";
import CategoriaService from "../../servicios/CategoriaService";
import { useAtributos } from "../../hooks/useAtributos";
import './categorias.css';
import { useSucursales } from "../../hooks/useSucursales";
import { Button } from "@mui/material";
function CategoriasForm() {
    const [categoriasSinFiltrar, setCategoriasSinFilrar] = useState<Categoria[]>([]);
    const [mostrarVisibles] = useState<boolean>(true);
    const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const { sucursales, sucursalSeleccionada } = useSucursales();
    const { categorias, setCategorias } = useAtributos();

    const urlapi = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService(urlapi + "/api/categorias");

    const getCategoriasRest = async () => {
        const nuevasCategorias: Categoria[] = await categoriaService.getAll();
        setCategoriasSinFilrar(nuevasCategorias);
    }

    const filtrarCategorias = async () => {
        const categoriasFiltradas: Categoria[] = categoriasSinFiltrar.filter(c => {
            const incluyeSucursal = c.sucursales?.some(s => s.id === sucursalSeleccionada.id);
            return mostrarVisibles ? incluyeSucursal : !incluyeSucursal;
        }).sort((a, b) => a.denominacion < b.denominacion ? -1 : 1);
        setCategorias(categoriasFiltradas);
    }

    const changeSucursalSubcategoria = (categoria: Categoria, eliminar: boolean) => {
        categoria.subCategorias.forEach(subcategoria => changeSucursalSubcategoria(subcategoria, eliminar));
        categoria.sucursales = eliminar
            ? categoria.sucursales?.filter(s => s.id !== sucursalSeleccionada.id) || []
            : [...(categoria.sucursales || []), sucursalSeleccionada];
    }

    const actualizarCategoria = async (categoria: Categoria) => {
        await categoriaService.put(categoria.id, categoria);
        await getCategoriasRest();
    };

    const changeSucursalPadres = async (categoria: Categoria, eliminar: boolean) => {
        const categoriaPadre = categorias.find(c => c.subCategorias.some(sub => sub.id === categoria.id));

        if (eliminar || !categoriaPadre) {
            await actualizarCategoria(categoria);
            return;
        }

        categoriaPadre.sucursales = [
            ...categoria.sucursales?.filter(s => s.id !== sucursalSeleccionada.id) || [],
            sucursalSeleccionada
        ];

        categoriaPadre.subCategorias = [
            ...categoriaPadre.subCategorias.filter(sub => sub.id !== categoria.id),
            categoria
        ];

        await changeSucursalPadres(categoriaPadre, eliminar);
    };

    const handleEliminarEnSucursal = async (categoria: Categoria) => {
        const eliminar = categoria.sucursales?.some(s => s.id === sucursalSeleccionada.id) || false;
        changeSucursalSubcategoria(categoria, eliminar);
        await changeSucursalPadres(categoria, eliminar);
    };

    const mostrarCategorias = (categoria: Categoria, padreId: number) => {
        const tieneHijos: boolean = categoria.subCategorias.filter(sc => !mostrarVisibles || sc.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).length > 0;
        return (
            <div key={categoria.id} className="accordion-item">
                <h2 className="accordion-header d-flex flex-row" id={"flush-heading" + categoria.id}>
                    {tieneHijos
                        ? <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse" + categoria.id} aria-expanded="false" aria-controls={"flush-collapse" + categoria.id}> {categoria.denominacion} </button>
                        : <div className="accordion-button accordion-no-arrow collapsed"> {categoria.denominacion} </div>
                    }

                    {mostrarVisibles &&
                        <Button
                            onClick={() => mostrarInput(categoria.id)}
                            sx={{
                                bgcolor: "#a6c732",
                                "&:hover": {
                                    bgcolor: "#a0b750",
                                },
                                my: 3,
                                mx: 1,
                                width: "auto",
                                maxWidth: 200,
                            }}
                            variant="contained"
                        >
                            Crear
                        </Button>
                    }


                    <Button
                        onClick={() => handleEliminarEnSucursal(categoria)}
                        sx={{
                            bgcolor: "#e05151",
                            "&:hover": {
                                bgcolor: "#db3939",
                            },
                            my: 3,
                            mx: 1,
                            width: "auto",
                            maxWidth: 200,
                        }}
                        variant="contained"
                    >
                        Eliminar
                    </Button>

                </h2>

                <h2 className="accordion-header input-categoria" id={"inputCategoria" + categoria.id} hidden>
                    <div className="d-flex flex-row">

                        <div className="accordion-button accordion-no-arrow collapsed">
                            <input type="text" className="form-control" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                        </div>

                        <Button
                            onClick={() => save(categoria.id)}
                            sx={{
                                bgcolor: "#a6c732",
                                "&:hover": {
                                    bgcolor: "#a0b750",
                                },
                                my: 3,
                                mx: 1,
                                width: "auto",
                                maxWidth: 200,
                            }}
                            variant="contained"
                        >
                            Crear
                        </Button>

                    </div>
                </h2>

                {tieneHijos &&
                    <div id={"flush-collapse" + categoria.id} className="accordion-collapse collapse" aria-labelledby={"flush-heading" + categoria.id} data-bs-parent={"#accordionFlush" + padreId}>
                        <div className="accordion-body">
                            {categoria.subCategorias.filter(sc => !mostrarVisibles || sc.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).sort((a, b) => a.denominacion < b.denominacion ? -1 : 1).map(subcategoria =>
                                mostrarCategorias(subcategoria, categoria.id)
                            )}
                        </div>
                    </div>
                }

            </div>
        )
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

    const save = async (categoriaPadreId: number | null) => {
        if (txtDenominacionNueva == undefined || txtDenominacionNueva == "") {
            setTxtValidacion("Ingrese el nombre de la categoría");
            return;
        }

        const categoriaNueva: Categoria = new Categoria();
        categoriaNueva.denominacion = txtDenominacionNueva;

        if (categoriaPadreId) {
            const categoriaPadre: Categoria = categorias.filter(categoria => categoria.id === categoriaPadreId)[0];
            categoriaPadre.subCategorias.push(categoriaNueva);
            await categoriaService.put(categoriaPadreId, categoriaPadre);
        }
        else {
            categoriaNueva.sucursales = sucursales;
            await categoriaService.post(categoriaNueva);
        }

        setTxtValidacion("");
        mostrarInput();

        await getCategoriasRest();
    }

    useEffect(() => {
        getCategoriasRest();
    }, []);

    useEffect(() => {
        if (categoriasSinFiltrar.length)
            filtrarCategorias();
    }, [mostrarVisibles, sucursalSeleccionada, categoriasSinFiltrar]);

    return (
        <>
            <div className="categoria-container">
                <div className="categoria-header">
                    <div className="ms-3 mb-2 d-flex flex-row">
                        <input type="text" className="form-control categoria-input" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                        <Button
                            onClick={() => save(null)}
                            sx={{
                                bgcolor: "#a6c732",
                                "&:hover": {
                                    bgcolor: "#a0b750",
                                },

                            }}
                            variant="contained"
                        >
                            Crear
                        </Button>

                    </div>

                    <div className="accordion accordion-flush categoria-accordion"
                        id="accordionFlush0">
                        {categorias
                            .filter(
                                categoria => {
                                    return !categorias
                                        .some(categoriaPadre => categoriaPadre.subCategorias
                                            .some(subcategoria => subcategoria.id === categoria.id)
                                        );
                                }
                            )
                            .sort((a, b) => (a.denominacion < b.denominacion ? -1 : 1))
                            .map(categoria => mostrarCategorias(categoria, 0))
                        }
                    </div>

                    <div>
                        <label style={{ color: 'red', lineHeight: 5, padding: 5, userSelect: "none" }}>{txtValidacion}</label>
                    </div>

                </div>
            </div>

        </>
    );
}

export default CategoriasForm;