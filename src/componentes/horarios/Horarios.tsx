import { useState } from "react";
import { Modal, Alert } from "react-bootstrap";
import HorarioEmpleado from "../../entidades/HorarioEmpleado";
import HorarioForm from "./HorarioForm";
import MostrarHorario from "./MostrarHorario";
import { Dia } from "../../entidades/enums/Dia";
import HorarioSucursal from "../../entidades/HorarioSucursal";
import HorarioDetalleEmpleado from "../../entidades/HorarioDetalleEmpleado";

type HorariosArgs = {
    horarios: (HorarioEmpleado | HorarioSucursal)[],
    handleChange: (value: any) => void
}

const Horarios: React.FC<HorariosArgs> = ({ horarios, handleChange }) => {
    const [horarioSeleccionado, setHorarioSeleccionado] = useState<(HorarioEmpleado | HorarioSucursal)>(new HorarioEmpleado());
    const [show, setShow] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setShow(false);
        setError(null);
    }

    const handleShow = (datos?: (HorarioEmpleado | HorarioSucursal)) => {
        const seleccionado = datos ? datos : new HorarioEmpleado();
        setHorarioSeleccionado(seleccionado);
        setShow(true);
    }

    const handleChangeHorario = (horario: (HorarioEmpleado | HorarioSucursal)) => {
        setHorarioSeleccionado(horario);
    }

    const handleSaveHorario = () => {
        // VALIDACIONES:

        // Verificar que el día de la semana sea único
        const existeHorario = !horarioSeleccionado.id && horarios.some(h => h.diaSemana === horarioSeleccionado.diaSemana);
        if (existeHorario) {
            setError("Ya existe un horario registrado para este día de la semana.");
            return;
        }

        // Verificar que los detalles de horario estén llenos correctamente
        const detallesValidos = horarioSeleccionado.horarioDetalles.every((detalle:HorarioDetalleEmpleado) => {
            return detalle.horaInicio !== '' as unknown as Date && detalle.horaFin !== '' as unknown as Date
        });

        // Se fija si la hora de inicio es mayor a la hora de fin (sólo si horaFin no es 00:00)
        const horaInicioMayorQueFin = horarioSeleccionado.horarioDetalles.some((detalle:HorarioDetalleEmpleado) => {
            return (!detalle.horaFin.toString().includes('00:00') && detalle.horaInicio > detalle.horaFin);
        });

        if (!detallesValidos) {
            setError("Todos los detalles de horario deben estar llenos correctamente.");
            return;
        } else if (horaInicioMayorQueFin) {
            setError("La hora de inicio no puede ser mayor a la hora de fin para ningún detalle.");
            return;
        }

        // Si pasa las validaciones, procedemos a guardar el horario
        const horariosActualizados = horarioSeleccionado.id === 0 
            ? [...horarios, horarioSeleccionado]
            : horarios.map(h => h.id === horarioSeleccionado.id ? horarioSeleccionado : h);
        handleChange(horariosActualizados);
        handleClose();
    }

    const handleDeleteHorario = (diaSemana: Dia) => {
        const horariosFiltrados = horarios.filter(h => h.diaSemana !== diaSemana);
        handleChange(horariosFiltrados);
    }

    return (
        <>
            { show && <div className="modal-backdrop fade show"></div> }
            <Modal show={show} size="lg" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Horario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HorarioForm horario={horarioSeleccionado} handleChange={handleChangeHorario} handleSave={handleSaveHorario} />
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Modal.Body>
            </Modal>

            <div style={{ overflowY: "scroll", minHeight:"100px", maxHeight: "300px" }}>
                <div className="mx-3">
                    {horarios.map((horario) =>
                        <MostrarHorario key={horario.id} horarioPrevio={horario} handleOpenModal={handleShow} handleDelete={handleDeleteHorario} />
                    )}
                </div>
            </div>

            <div className="row mx-1 mt-3">
                <button type='button' className="btn btn-sm btn-secondary" onClick={() => handleShow()}>Nuevo Horario</button>
            </div>
        </>
    );
}

export default Horarios;
