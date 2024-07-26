import Base from "./Base";
import Sucursal from "./Sucursal";

export default class UnidadMedida extends Base {
    denominacion:string = "";
    sucursales:Sucursal[] = [];
}