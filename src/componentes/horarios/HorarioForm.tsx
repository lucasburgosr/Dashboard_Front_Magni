import { Form, Button } from "react-bootstrap";
import HorarioEmpleado from "../../entidades/HorarioEmpleado";
import { Dia } from "../../entidades/enums/Dia";
import HorarioDetalleEmpleado from "../../entidades/HorarioDetalleEmpleado";
import BtnDelete from "../btnDelete/BtnDelete";
import BtnAdd from "../btnAdd/BtnAdd";
import HorarioSucursal from "../../entidades/HorarioSucursal";
import HorarioDetalleSucursal from "../../entidades/HorarioDetalleSucursal";

type HorarioFormArgs = {
    horario: HorarioEmpleado | HorarioSucursal,
    handleChange: (value: HorarioEmpleado | HorarioSucursal) => void,
    handleSave: () => void
}

const HorarioForm: React.FC<HorarioFormArgs> = ({ horario, handleChange, handleSave }) => {
    const handleDiaSemanaChange = (value: string) => {
        const nuevoHorario:HorarioEmpleado | HorarioSucursal = {...horario, diaSemana:value as Dia};
        handleChange(nuevoHorario);
    };

    const handleHoraInicioChange = (detalleIndex: number, value: string) => {
        const nuevosDetalles = [...horario.horarioDetalles];
        nuevosDetalles[detalleIndex].horaInicio = value as unknown as Date;
        const nuevoHorario:HorarioEmpleado | HorarioSucursal = {...horario, horarioDetalles:nuevosDetalles};
        handleChange(nuevoHorario);
    };

    const handleHoraFinChange = (detalleIndex: number, value: string) => {
        const nuevosDetalles = [...horario.horarioDetalles];
        nuevosDetalles[detalleIndex].horaFin = value as unknown as Date;
        const nuevoHorario:HorarioEmpleado | HorarioSucursal = {...horario, horarioDetalles:nuevosDetalles};
        handleChange(nuevoHorario);
    };

    const handleAgregarDetalle = () => {
        const nuevoDetalle:HorarioDetalleEmpleado | HorarioDetalleSucursal = { id:0, horario:{} as HorarioEmpleado, horaInicio: '' as unknown as Date, horaFin: '' as unknown as Date };
        const nuevoHorario:HorarioEmpleado | HorarioSucursal = {...horario, horarioDetalles:[...horario.horarioDetalles, nuevoDetalle]};
        handleChange(nuevoHorario);
    };

    const handleEliminarDetalle = (detalleIndex: number) => {
        const nuevosDetalles = horario.horarioDetalles.filter((_:HorarioDetalleEmpleado|HorarioDetalleSucursal, index:number) => index !== detalleIndex);
        const nuevoHorario:HorarioEmpleado | HorarioSucursal = {...horario, horarioDetalles:nuevosDetalles};
        handleChange(nuevoHorario);
    };

    const handleGuardar = () => {
        handleSave();
    };

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Día de la Semana</Form.Label>
                <Form.Control
                    as="select"
                    value={horario.diaSemana}
                    onChange={(e) => handleDiaSemanaChange(e.target.value)}
                >
                    {Object.values(Dia).map(dia => (
                        <option key={dia} value={dia}>{dia}</option>
                    ))}
                </Form.Control>
            </Form.Group>

            {horario.horarioDetalles.map((detalle:HorarioDetalleEmpleado|HorarioDetalleSucursal, detalleIndex:number) => (
                <div key={detalleIndex} className="row justify-content-between align-items-center mb-2">
                    <Form.Group className="col mb-3 me-2">
                        <Form.Label>Hora Inicio</Form.Label>
                        <Form.Control
                            type="time"
                            value={String(detalle.horaInicio)}
                            onChange={(e) => handleHoraInicioChange(detalleIndex, e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="col mb-3">
                        <Form.Label>Hora Fin</Form.Label>
                        <Form.Control
                            type="time"
                            value={String(detalle.horaFin)}
                            onChange={(e) => handleHoraFinChange(detalleIndex, e.target.value)}
                        />
                    </Form.Group>

                    <div className="w-auto mt-3">
                        <BtnDelete handleClick={() => handleEliminarDetalle(detalleIndex)} />
                    </div>
                </div>
            ))}

            <div className="d-flex justify-content-end mt-3">
                <BtnAdd width="100%" handleClick={handleAgregarDetalle} />
            </div>

            <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" onClick={handleGuardar}>Guardar</Button>
            </div>
        </Form>
    );
}

export default HorarioForm;
