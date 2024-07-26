import ArticuloManufacturadoDetalle  from "./ArticuloManufacturadoDetalle";
import Articulo from "./Articulo";
import Sucursal from "./Sucursal";

export default class ArticuloManufacturado extends Articulo {
    resumen:string = "";
    descripcion:string = "";
    tiempoEstimadoMinutos:number = 0;
    preparacion:string = "";
    stockActual:number = 0;
    precioCosto:number = 0;
    articuloManufacturadoDetalles:ArticuloManufacturadoDetalle[] = [];
    type:string = "manufacturado";
    sucursales:Sucursal[] = [];
}