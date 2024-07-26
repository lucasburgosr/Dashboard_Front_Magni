import { Dispatch, ReactNode, createContext, useState } from "react";
import Categoria from "../entidades/Categoria";
import CategoriaService from "../servicios/CategoriaService";
import UnidadMedida from "../entidades/UnidadMedida";
import UnidadMedidaService from "../servicios/UnidadMedidaService";
import { useSucursales } from "../hooks/useSucursales";

interface AtributosContextType {
    categorias: Categoria[],
    unidadesMedida: UnidadMedida[],
    getCategoriasRest: () => void,
    setCategorias: Dispatch<React.SetStateAction<Categoria[]>>,
    getUnidadesMedidaRest: () => void,
    setUnidadesMedida: Dispatch<React.SetStateAction<UnidadMedida[]>>
}

export const AtributosContext = createContext<AtributosContextType>({
    categorias: [],
    unidadesMedida: [],
    getCategoriasRest: () => {},
    setCategorias: () => {},
    getUnidadesMedidaRest: () => {},
    setUnidadesMedida: () => {},
});

export function AtributosContextProvider({children} : {children: ReactNode}) {
    const {sucursalSeleccionada} = useSucursales();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida []>([]);
  
    const urlapi = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService(urlapi + "/api/categorias");
    const unidadMedidaService = new UnidadMedidaService(urlapi + "/api/unidadesmedida");

    const getCategoriasRest = async () => {
        const categorias:Categoria[] = (await categoriaService.getAll()).filter(c => c.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1);
        setCategorias(categorias);
    }

    const getUnidadesMedidaRest = async () => {
        const unidadesMedida:UnidadMedida[] = (await unidadMedidaService.getAll()).filter(u => u.sucursales?.map(s => s.id).includes(sucursalSeleccionada.id)).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1);
        setUnidadesMedida(unidadesMedida);
    }

    return (
        <AtributosContext.Provider value={{ 
            categorias,
            unidadesMedida,
            getCategoriasRest, 
            setCategorias, 
            getUnidadesMedidaRest, 
            setUnidadesMedida,
            }}>
            {children}
        </AtributosContext.Provider>
    );
}
