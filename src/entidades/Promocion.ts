import Articulo from "./Articulo";
import PromocionDetalle from "./PromocionDetalle";
import Sucursal from "./Sucursal";

export default class Promocion extends Articulo {
    fechaDesde:Date = new Date();
    fechaHasta:Date = new Date();
    horaDesde:Date = new Date();
    horaHasta:Date = new Date();
    descripcionDescuento:string = '';
    precioPromocional:number = 0;
    tipoPromocion:string = '';
    sucursales:Sucursal[] = [];
    promocionDetalles:PromocionDetalle[] = [];
    type = 'promocion';
}