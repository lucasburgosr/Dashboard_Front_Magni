import { ReactNode, createContext, useEffect, useState } from "react";
import EmpresaService from "../servicios/EmpresaService";
import Empresa from "../entidades/Empresa";

interface EmpresasContextType {
    empresas: Empresa[],
    empresaSeleccionada: Empresa,
    handleReloadEmpresa: () => void,
    handleChangeEmpresa: (value:number) => void
}

export const EmpresasContext = createContext<EmpresasContextType>({
    empresas: [],
    empresaSeleccionada: new Empresa(),
    handleReloadEmpresa: () => {},
    handleChangeEmpresa: () => {}
});

export function EmpresasContextProvider({ children }: { children: ReactNode }) {
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa>(new Empresa());

    const urlapi = import.meta.env.VITE_API_URL;
    const empresasService = new EmpresaService(urlapi + "/api/empresas");

    const handleChangeEmpresa = (empresaId:number) => {
        setEmpresaSeleccionada(empresas.find(e => e.id === empresaId) ?? new Empresa());
    }
    const getEmpresaRest = async () => {
        const empresas: Empresa[] = await empresasService.getAll();
        setEmpresas(empresas);
        empresas.forEach(e => e.sucursales.sort((a,b) => a.id - b.id));
        if (!empresaSeleccionada.id)
            setEmpresaSeleccionada(empresas[0]);
    }

    const handleReloadEmpresa = () => {
        getEmpresaRest();
    }

    useEffect(() => {
        handleReloadEmpresa();
    }, [])

return (
    <EmpresasContext.Provider value={{
        empresas,
        empresaSeleccionada,
        handleReloadEmpresa,
        handleChangeEmpresa
    }}>
        {children}
    </EmpresasContext.Provider>
);
}