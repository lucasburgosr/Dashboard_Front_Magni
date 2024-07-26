import ArticuloInsumo from "../entidades/ArticuloInsumo";
import BackendClient from "./BackendClient";

export default class ArticuloInsumoService extends BackendClient<ArticuloInsumo> {
    async buscarXDenominacion(busqueda?:string): Promise<ArticuloInsumo[]> {
        const busquedaUrl = busqueda ? `busqueda=${busqueda}` : '';
        const response = await fetch(`${this.baseUrl}/buscar?${busquedaUrl}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as ArticuloInsumo[];
    }
}
