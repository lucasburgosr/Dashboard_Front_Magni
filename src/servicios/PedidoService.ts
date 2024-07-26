import Pedido from "../entidades/Pedido";
import { Estados } from "../entidades/enums/Estados";
import BackendClient from "./BackendClient";

export default class PedidoService extends BackendClient<Pedido> {
    async buscarXSucursal(idSucursal:number, busqueda?:string, desde?: string, hasta?: string, estado?:Estados): Promise<Pedido[]> {
        const estadoParam = estado ?  `estado=${estado}` : '';
        const desdeParam = desde ? `desde=${desde}` : '';
        const hastaParam = hasta ? `hasta=${hasta}` : '';
        const busquedaParam = busqueda ? `busqueda=${busqueda}` : '';
        const response = await fetch(`${this.baseUrl}/buscar/${idSucursal}?${busquedaParam}&${desdeParam}&${hastaParam}&${estadoParam}`, {
            headers: this.getAuthHeaders()
          });
        const data = await response.json();
        return data as Pedido[];
    }

    // EXCEL PEDIDOS
    async getExcelPedidos(idSucursal:number, busqueda?:string, desde?: string, hasta?: string, estado?:Estados) {
        const estadoParam = estado ?  `estado=${estado}` : '';
        const desdeParam = desde ? `desde=${desde}` : '';
        const hastaParam = hasta ? `hasta=${hasta}` : '';
        const busquedaParam = busqueda ? `busqueda=${busqueda}` : '';
        const url = `${this.baseUrl}/descargarexcelpedidos/${idSucursal}?${busquedaParam}&${desdeParam}&${hastaParam}&${estadoParam}`;

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `pedidos${desde ? '-'+desde : ''}${hasta ? '-'+hasta : ''}${estado ? '-estado_'+estado : ''}${busqueda ? '-busqueda' : ''}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    // RANKING PRODUCTOS
    async getRankingProductos(idSucursal:number, desde: string, hasta: string): Promise<[]> {
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const response = await fetch(`${this.baseUrl}/rankingproductos?idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}`,
            {headers: this.getAuthHeaders()});
        const data = await response.json();
        return data as [];
    }

    async getExcelRankingProductos(idSucursal:number, desde?: string, hasta?: string) {
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const url = `${this.baseUrl}/descargarexcelrankingproductos?idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}`;

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `ranking_productos-${desde}-${hasta}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    // RANKING CLIENTES
    async getRankingClientes(limite:number, idSucursal:number, desde: string, hasta: string, ordenarPorPedidos: boolean): Promise<[]> {
        const limiteParam = limite ? `limite=${limite}` : '';
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const response = await fetch(`${this.baseUrl}/rankingclientes?${limiteParam}&idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}&ordenarPorPedidos=${ordenarPorPedidos}`,
            {headers: this.getAuthHeaders()});
        const data = await response.json();
        return data as [];
    }

    async getExcelRankingClientes(limite:number, idSucursal:number, desde: string, hasta: string, ordenarPorPedidos: boolean) {
        const limiteParam = limite ? `limite=${limite}` : '';
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const url = `${this.baseUrl}/descargarexcelrankingclientes?${limiteParam}&idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}&ordenarPorPedidos=${ordenarPorPedidos}`;

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `ranking_clientes-${desde}-${hasta}-top_${limite}-ordenado_por_${ordenarPorPedidos ? 'pedidos' : 'monto'}.xlsx`; // Nombre del archivo descargado
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    // MOVIMIENTOS MONETARIOS
    async getMovimientosMonetarios(idSucursal:number, desde: string, hasta: string, esDiario: boolean): Promise<[]> {
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const response = await fetch(`${this.baseUrl}/movimientosmonetarios?idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}&esDiario=${esDiario}`,
            {headers: this.getAuthHeaders()});
        const data = await response.json();
        return data as [];
    }

    async getExcelMovimientosMonetarios(idSucursal:number, desde: string, hasta: string, esDiario: boolean) {
        const fechaDesdeParam = desde ? `desde=${desde}` : '';
        const fechaHastaParam = hasta ? `hasta=${hasta}` : '';
        const url = `${this.baseUrl}/descargarexcelmovimientosmonetarios?idSucursal=${idSucursal}&${fechaDesdeParam}&${fechaHastaParam}&esDiario=${esDiario}`;

        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `movimientos_monetarios-${desde}-${hasta}-${esDiario ? 'agrupamiento_diario' : 'agrupamiento_mensual'}.xlsx`; // Nombre del archivo descargado
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    // IMPRIMIR PDF PEDIDO
    async facturarPedido(pedidoId:number) {
        const url = `${this.baseUrl}/facturar/${pedidoId}`;
        
        const response = await fetch(url, {
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `factura_pedido-nro_${('00000' + pedidoId).slice(-5)}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(urlBlob);
    }

    // ENVIAR POR MAIL PDF PEDIDO
    async enviarPedido(pedidoId:number) {
        await fetch(`${this.baseUrl}/facturarYEnviar/${pedidoId}`, {
            headers: this.getAuthHeaders()
        });
    }
}
