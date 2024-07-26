import Sucursal from "../entidades/Sucursal";
import BackendClient from "./BackendClient";

export default class SucursalService extends BackendClient<Sucursal> {
    async eliminado(id: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/eliminado/${id}`, {
          method: "PUT",
          headers: this.getAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar el elemento con ID ${id}: ${response.statusText}`);
        }
    }
}
