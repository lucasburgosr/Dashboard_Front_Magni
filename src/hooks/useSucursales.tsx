import { useContext } from "react"
import { SucursalesContext } from "../context/SucursalesContext";

export const useSucursales = () => {
    const context = useContext(SucursalesContext);

    if (context === undefined) {
        throw new Error("useSucursales debe ser usado dentre del ámbito de un SucursalesContextProvider");
    }

    return context;
}