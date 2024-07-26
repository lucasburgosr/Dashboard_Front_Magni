import Empleado from "../entidades/Empleado";
import BackendClient from "./BackendClient";

export default class EmpleadoService extends BackendClient<Empleado> {
    async buscarXSucursal(idSucursal?:number, busqueda?:string): Promise<Empleado[]> {
        const sucursalUrl = idSucursal ? `sucursalId=${idSucursal}` : '';
        const busquedaUrl = busqueda ? `busqueda=${busqueda}` : '';
        const response = await fetch(`${this.baseUrl}/buscar?${sucursalUrl}&${busquedaUrl}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as Empleado[];
    }

    async buscarXUsuarioAuth0(idAuth0?:string): Promise<Empleado> {
        const response = await fetch(`${this.baseUrl}/auth0id/${idAuth0}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        if (data.error) throw new Error("Su cuenta ha sido desactivada!");
        return data as Empleado;
    }
}
