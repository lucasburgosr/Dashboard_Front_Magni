import Base from "./Base";
import HorarioSucursal from "./HorarioSucursal";

export default class HorarioDetalleSucursal extends Base {
    horario:HorarioSucursal = new HorarioSucursal();
    horaInicio:Date = new Date();
    horaFin:Date = new Date();
}