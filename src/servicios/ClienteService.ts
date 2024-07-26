import Cliente from "../entidades/Cliente";
import BackendClient from "./BackendClient";

export default class ClienteService extends BackendClient<Cliente> {
    async buscarXNombre(busqueda?:string, mostrarEliminados?:boolean): Promise<Cliente[]> {
      const busquedaUrl = busqueda ? `busqueda=${busqueda}` : '';
      const mostrarEliminadosUrl = mostrarEliminados ? `mostrarEliminados=${mostrarEliminados}` : '';
        const response = await fetch(`${this.baseUrl}/buscar?${busquedaUrl}&&${mostrarEliminadosUrl}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as Cliente[];
    }
    async eliminado(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/eliminado/${id}`, {
          method: "PUT",
          headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar el cliente con ID ${id}: ${response.statusText}`);
        }
    }
}
