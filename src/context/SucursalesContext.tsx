import { ReactNode, createContext, useEffect, useState } from "react";
import Sucursal from "../entidades/Sucursal";
import { useEmpresas } from "../hooks/useEmpresas";

interface SucursalesContextType {
    sucursales: Sucursal[],
    sucursalSeleccionada: Sucursal,
    handleReloadSucursales: () => void,
    handleChangeSucursal: (value:number) => void
}

export const SucursalesContext = createContext<SucursalesContextType>({
    sucursales: [],
    sucursalSeleccionada: new Sucursal(),
    handleReloadSucursales: () => {},
    handleChangeSucursal: () => {}
});

export function SucursalesContextProvider({ children }: { children: ReactNode }) {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState<Sucursal>(new Sucursal());
    const {empresaSeleccionada} = useEmpresas();

    const handleChangeSucursal = (sucursalId:number) => {
        setSucursalSeleccionada(sucursales.find(e => e.id === sucursalId) ?? new Sucursal());
    }

    const handleReloadSucursales = () => {
        const sucursales = empresaSeleccionada.sucursales.sort((a,b) => a.id - b.id);
        setSucursales(sucursales);
        setSucursalSeleccionada(sucursales[0] ?? new Sucursal());
    }

    useEffect(() => {
        handleReloadSucursales();
}, [empresaSeleccionada])

return (
    <SucursalesContext.Provider value={{
        sucursales,
        sucursalSeleccionada,
        handleChangeSucursal,
        handleReloadSucursales
    }}>
        {children}
    </SucursalesContext.Provider>
);
}