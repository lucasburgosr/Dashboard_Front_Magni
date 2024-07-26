import Base from "./Base";
import HorarioDetalleEmpleado from "./HorarioDetalleEmpleado";
import { Dia } from "./enums/Dia";

export default class HorarioEmpleado extends Base {
    diaSemana:Dia = Dia.Lunes;
    horarioDetalles:HorarioDetalleEmpleado[] = [];
}