import Base from "./Base";
import Categoria from "./Categoria";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

export default class Articulo extends Base {
    
    denominacion:string = "";
    precioVenta:number = 0;
    imagenes:Imagen[] = [];
    unidadMedida:UnidadMedida = new UnidadMedida();
    categoria:Categoria = new Categoria();
}