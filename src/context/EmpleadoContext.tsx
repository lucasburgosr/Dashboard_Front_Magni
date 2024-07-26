import { ReactNode, createContext, useEffect, useState } from "react";
import Empleado from "../entidades/Empleado";
import EmpleadoService from "../servicios/EmpleadoService";
import { useAuth0 } from "@auth0/auth0-react";

interface EmpleadoContextType {
    empleado: Empleado | undefined
}

export const EmpleadoContext = createContext<EmpleadoContextType>({
    empleado: undefined
});

export function EmpleadoContextProvider({ children }: { children: ReactNode }) {
    const [empleado, setEmpleado] = useState<Empleado | undefined>(undefined);
    const { isLoading, user, logout } = useAuth0();

    const urlapi = import.meta.env.VITE_API_URL;
    const empleadoService = new EmpleadoService(urlapi + "/api/empleados");

    const handleReloadEmpleado = async () => {
        try {
            const usuario = await empleadoService.buscarXUsuarioAuth0(user?.sub);

            if (usuario) {
                localStorage.setItem("usuario", JSON.stringify(usuario));
                setEmpleado(usuario);
            } else {
                throw new Error("El usuario no tiene un rol válido o asignado.");
            }
        }
        catch (e) {
            localStorage.setItem("usuario", "");
            setEmpleado(undefined);
            logout({logoutParams : { returnTo: ""}}).then(() => localStorage.setItem("usuario", ""))
            alert(e);
        }
    }

    useEffect(() => {
        if (!isLoading && user) {
            handleReloadEmpleado();
        }
    }, [isLoading, user]);

    useEffect(() => {
        const storageUser = localStorage.getItem("usuario");
        const usuario: Empleado | undefined = storageUser ? JSON.parse(storageUser) : undefined;
        if (usuario) {
            setEmpleado(usuario);
        }
    }, []);

return (
    <EmpleadoContext.Provider value={{
        empleado
    }}>
        {children}
    </EmpleadoContext.Provider>
);
}