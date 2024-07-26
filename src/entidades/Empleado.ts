import Base from "./Base";
import Domicilio from "./Domicilio";
import HorarioEmpleado from "./HorarioEmpleado";
import Imagen from "./Imagen";
import Sucursal from "./Sucursal";
import UsuarioEmpleado from "./UsuarioEmpleado";
import { Rol } from "./enums/Rol";

export default class Empleado extends Base {
    rol:Rol = Rol.Administrador;
    domicilio:Domicilio = new Domicilio();
    nombre:string = "" ;
    apellido:string = "" ;
    telefono:string = "" ;
    email:string = "" ;
    fechaNacimiento:Date = new Date();
    imagen:Imagen = new Imagen();
    sucursal:Sucursal|undefined = new Sucursal();
    usuario:UsuarioEmpleado = new UsuarioEmpleado();
    horarios:HorarioEmpleado[] = [];
}