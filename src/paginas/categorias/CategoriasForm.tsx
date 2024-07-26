import { useEffect, useState } from "react";
import Categoria from "../../entidades/Categoria";
import CategoriaService from "../../servicios/CategoriaService";
import { useAtributos } from "../../hooks/useAtributos";
import './categorias.css';
import BtnVisible from "../../componentes/btnVisible/BtnVisible";
import { useSucursales } from "../../hooks/useSucursales";

function CategoriasForm() {
    const [categoriasSinFiltrar, setCategoriasSinFilrar] = useState<Categoria[]>([]);
    const [mostrarVisibles, setMostrarVisibles] = useState<boolean>(true);
    const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
    const [txtValidacion, setTxtValidacion] = useState<string>("");
    const {sucursales, sucursalSeleccionada} = useSucursales();
    const {categorias, setCategorias} = useAtributos();

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
        }).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1);
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

    const mostrarCategorias = (categoria:Categoria, padreId:number) => {
        const tieneHijos:boolean = categoria.subCategorias.filter(sc => !mostrarVisibles || sc.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).length > 0;
        return (
            <div key={categoria.id} className="accordion-item">
                <h2 className="accordion-header d-flex flex-row" id={"flush-heading"+categoria.id}>
                {tieneHijos 
                    ? <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse"+categoria.id} aria-expanded="false" aria-controls={"flush-collapse"+categoria.id}> {categoria.denominacion} </button>
                    : <div className="accordion-button accordion-no-arrow collapsed"> {categoria.denominacion} </div>
                }
                
                {mostrarVisibles &&
                <button className="btn mx-2 p-0" type="button" onClick={() => mostrarInput(categoria.id)} >
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#333333" className="bi bi-plus-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg>
                    </div>
                </button>
                }
                
                <button className="btn mx-2 p-0" type="button" onClick={() => handleEliminarEnSucursal(categoria)} > 
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
                
                <h2 className="accordion-header input-categoria" id={"inputCategoria"+categoria.id} hidden>
                    <div className="d-flex flex-row">

                    <div className="accordion-button accordion-no-arrow collapsed">
                        <input type="text" className="form-control" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                    </div>

                    <button className="btn mx-2 p-0" type="button" onClick={() => save(categoria.id)}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00AA00" className="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                            </svg>
                        </div>
                    </button>

                    </div>
                </h2>

                {tieneHijos && 
                    <div id={"flush-collapse"+categoria.id} className="accordion-collapse collapse" aria-labelledby={"flush-heading"+categoria.id} data-bs-parent={"#accordionFlush" + padreId}>
                        <div className="accordion-body">
                        {categoria.subCategorias.filter(sc => !mostrarVisibles || sc.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1).map(subcategoria => 
                            mostrarCategorias(subcategoria, categoria.id)
                        )}
                        </div>
                    </div>
                }

            </div>
        )
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

    const save = async (categoriaPadreId:number | null) => {
        if (txtDenominacionNueva == undefined || txtDenominacionNueva == "") {
            setTxtValidacion("Ingrese el nombre de la categoría");
            return;
        }

        const categoriaNueva:Categoria = new Categoria();
        categoriaNueva.denominacion = txtDenominacionNueva;

        if (categoriaPadreId) {
            const categoriaPadre:Categoria = categorias.filter(categoria => categoria.id === categoriaPadreId)[0];
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
        <div className="row">
        <div className="col-sm">

            <div className="ms-3 mb-2 d-flex flex-row">
                <input type="text" className="form-control" placeholder="Nombre de la categoría" value={txtDenominacionNueva} onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}></input>
                <button className="btn mx-2 p-0" type="button" onClick={() => save(null)}>
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

            <div className="accordion accordion-flush" id="accordionFlush0">
                {categorias
                    .filter(
                        categoria => { return !categorias
                            .some( categoriaPadre => categoriaPadre.subCategorias
                                .some( subcategoria => subcategoria.id === categoria.id) 
                            ); 
                        }
                    )
                    .sort((a, b) => (a.denominacion < b.denominacion ? -1 : 1))
                    .map(categoria => mostrarCategorias(categoria, 0))
                }
            </div>

            <div>
                <label style={{ color: 'red', lineHeight: 5, padding: 5, userSelect: "none"}}>{txtValidacion}</label>
            </div>

        </div>
        </div>

        </>
    );
}

export default CategoriasForm;