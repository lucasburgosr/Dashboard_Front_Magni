import AbstractBackendClient from "./AbstractBackendClient";

export default abstract class BackendClient<T> extends AbstractBackendClient<T> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  protected getAuthHeaders(): Headers {
    const token = localStorage.getItem('token');
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    return headers;
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    const data = await response.json();
    return data as T[];
  }

  async getById(id: number): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`);
    }
    const data = await response.json();
    return data as T;
  }

  async post(data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    console.log(this.getAuthHeaders());
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error al crear datos: ${response.statusText}`);
    }
    const newData = await response.json();
    return newData as T;
  }

  async put(id: number, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar datos: ${response.statusText}`);
    }
    const newData = await response.json();
    return newData as T;
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}: ${response.statusText}`);
    }
  }
}
