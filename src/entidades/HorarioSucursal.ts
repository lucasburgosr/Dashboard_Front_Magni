import Base from "./Base";
import HorarioDetalleSucursal from "./HorarioDetalleSucursal";
import { Dia } from "./enums/Dia";

export default class HorarioSucursal extends Base {
    diaSemana:Dia = Dia.Lunes;
    horarioDetalles:HorarioDetalleSucursal[] = [];
}