import { useContext } from "react"
import { EmpleadoContext } from "../context/EmpleadoContext";

export const useEmpleado = () => {
    const context = useContext(EmpleadoContext);

    if (context === undefined) {
        throw new Error("useEmpleado debe ser usado dentre del ámbito de un EmpresasContextProvider");
    }

    return context;
}