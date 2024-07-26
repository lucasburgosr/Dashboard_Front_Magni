import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import DetallePedido from "../../entidades/DetallePedido";
import { FormaPago } from "../../entidades/enums/FormaPago";

export default function TablePedido({pedido}:{pedido:Pedido}) {
    const [subtotal, setSubtotal] = useState<number>(0);
    const [costoEnvioTotal, ] = useState<number>(0);

    useEffect(() => {
        setSubtotal(pedido.detallePedidos.reduce((suma, detalle) => suma + (detalle.articulo.precioVenta ?? detalle.articulo.precioPromocional) * detalle.cantidad, 0));
    }, [pedido]);

    return (
        <table className="table contenido">
            <thead className="table-dark">
                <tr>
                    <th> Producto </th>
                    <th> Precio Unitario </th>
                    <th> Cantidad </th>
                    <th> Subtotal </th>
                </tr>
            </thead>
            <tbody>
            {pedido.detallePedidos.map((detalle: DetallePedido) => (
                <tr key={detalle.articulo.id}>
                    <td> {detalle.articulo.denominacion} </td>
                    <td> ${(detalle.articulo.precioVenta ?? detalle.articulo.precioPromocional).toLocaleString('es-AR')} </td>
                    <td> {detalle.cantidad.toLocaleString('es-AR')} </td>
                    <td> ${(detalle.cantidad * (detalle.articulo.precioVenta ?? detalle.articulo.precioPromocional)).toLocaleString('es-AR')} </td>
                </tr>
            ))}
            {(subtotal > 0) 
                && <tr>
                    <td colSpan={2} className="border-0"/>
                    <td align="right" className="border-0"> Subtotal: </td>
                    <td> ${subtotal.toLocaleString('es-AR')} </td>
                </tr>
            }
            {(subtotal > 0 && pedido.formaPago === FormaPago.Efectivo) 
                && <tr>
                    <td colSpan={2} className="border-0"/>
                    <td align="right" className="border-0"> Descuentos: </td>
                    <td> ${(subtotal*0.1).toLocaleString('es-AR')} </td>
                </tr>
            }
            {(costoEnvioTotal > 0)
                && <tr>
                    <td colSpan={2} className="border-0"/>
                    <td align="right" className="border-0"> Costo envío: </td>
                    <td> ${costoEnvioTotal.toLocaleString('es-AR')} </td>
                </tr>
            }
            <tr>
            <td colSpan={2} className="border-0"/>
            <td align="right" className="border-0"><b> Total: </b></td>
            <td><b> ${(subtotal * (pedido.formaPago === FormaPago.Efectivo ? 0.9 : 1) + costoEnvioTotal).toLocaleString('es-AR')}</b> </td>
            </tr>
            </tbody>
        </table>
    );
}