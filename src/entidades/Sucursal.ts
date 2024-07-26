import Base from "./Base";
import Domicilio from "./Domicilio";
import Empresa from "./Empresa";
import HorarioSucursal from "./HorarioSucursal";
import Imagen from "./Imagen";

export default class Sucursal extends Base {
    nombre:string = '';
    eliminado:boolean = false;
    domicilio:Domicilio = new Domicilio();
    casaMatriz:boolean = false;
    imagen:Imagen = new Imagen();
    empresa?:Empresa = new Empresa();
    horarios:HorarioSucursal[] = [];
}