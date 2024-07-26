import Empresa from "../entidades/Empresa";
import BackendClient from "./BackendClient";

export default class EmpresaService extends BackendClient<Empresa> {
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
