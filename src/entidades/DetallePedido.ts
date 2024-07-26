import Articulo from "./Articulo";
import Base from "./Base";

export default class DetallePedido extends Base {
    cantidad:number = 0;
    subTotal:number = 0;
    articulo:Articulo = new Articulo();
}