import { useContext } from "react"
import { EmpresasContext } from "../context/EmpresasContext";

export const useEmpresas = () => {
    const context = useContext(EmpresasContext);

    if (context === undefined) {
        throw new Error("useEmpresas debe ser usado dentre del ámbito de un EmpresasContextProvider");
    }

    return context;
}