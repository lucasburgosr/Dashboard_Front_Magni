import Articulo from "./Articulo";
import StockInsumo from "./StockInsumo";

export default class ArticuloInsumo extends Articulo {
    stockActual?:number = 0;
    stockMinimo?:number = 0;
    stockMaximo?:number = 0;
    precioCompra:number = 0;
    esParaElaborar:boolean = true;
    stocksInsumo?:StockInsumo[] = [];
    type:string = "insumo";
}