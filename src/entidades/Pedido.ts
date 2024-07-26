import Base from "./Base";
import Cliente from "./Cliente";
import DetallePedido from "./DetallePedido";
import Domicilio from "./Domicilio";
import Empleado from "./Empleado";
import Sucursal from "./Sucursal";
import { Estados } from "./enums/Estados";
import { FormaPago } from "./enums/FormaPago";
import { TipoEnvio } from "./enums/TipoEnvio";
export default class Pedido extends Base {
    horaEstimadaFinalizacion:Date = new Date();
    total: number = 0;
    totalCosto: number = 0;
    estado: Estados = Estados.PAGO_PENDIENTE;
    tipoEnvio: TipoEnvio = TipoEnvio.TakeAway;
    formaPago: FormaPago = FormaPago.Efectivo;
    fechaPedido:Date = new Date();
    domicilio:Domicilio = new Domicilio();
    sucursal:Sucursal = new Sucursal();
    cliente:Cliente = new Cliente();
    empleado:Empleado = new Empleado();
    detallePedidos:DetallePedido[] = [];
}