import Base from "./Base";
import HorarioEmpleado from "./HorarioEmpleado";

export default class HorarioDetalleEmpleado extends Base {
    horario:HorarioEmpleado = new HorarioEmpleado();
    horaInicio:Date = new Date();
    horaFin:Date = new Date();
}