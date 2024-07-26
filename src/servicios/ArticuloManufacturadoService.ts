import ArticuloManufacturado from "../entidades/ArticuloManufacturado";
import BackendClient from "./BackendClient";

export default class ArticuloManufacturadoService extends BackendClient<ArticuloManufacturado> {
    async buscarXSucursal(sucursalId?: number, busqueda?:string, soloEliminados?:boolean): Promise<ArticuloManufacturado[]> {
        const sucursalUrl = sucursalId ? `sucursalId=${sucursalId}` : '';
        const busquedaUrl = busqueda ? `busqueda=${busqueda}` : '';
        const soloEliminadosUrl = soloEliminados ? `soloEliminados=${soloEliminados}` : '';
        const response = await fetch(`${this.baseUrl}/buscar?${sucursalUrl}&${busquedaUrl}&${soloEliminadosUrl}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as ArticuloManufacturado[];
    }
    
    async getById(id: number): Promise<ArticuloManufacturado> {
        const response = await fetch(`${this.baseUrl}/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el manufacturado');
        }
        return response.json();
    }
}
