import BtnDelete from "../../componentes/btnDelete/BtnDelete";
import BtnEdit from "../../componentes/btnEdit/BtnEdit";
import HorarioDetalleEmpleado from "../../entidades/HorarioDetalleEmpleado";
import HorarioEmpleado from "../../entidades/HorarioEmpleado";
import HorarioSucursal from "../../entidades/HorarioSucursal";
import { Dia } from "../../entidades/enums/Dia";

type MostrarHorarioArgs = {
    horarioPrevio: HorarioEmpleado | HorarioSucursal,
    handleOpenModal: (value: HorarioEmpleado | HorarioSucursal) => void,
    handleDelete: (dia: Dia) => void,
}

function MostrarHorario({ horarioPrevio, handleOpenModal, handleDelete }: MostrarHorarioArgs) {
    return (
        <div className="mb-3 row">
            <div className="card">
                <div className="card-body row">
                    <div className="col-9">
                        <h5 className="card-title">{horarioPrevio.diaSemana}</h5>
                        <h6 className="card-subtitle mb-2 text-muted">{horarioPrevio.horarioDetalles.map((d:HorarioDetalleEmpleado) => `${d.horaInicio.toString()} - ${d.horaFin.toString()}`).join(' / ')}</h6>
                    </div>
                    <div className="col-3">
                        <div className="d-flex justify-content-end">
                            <BtnEdit handleClick={() => handleOpenModal(horarioPrevio)} />
                            <div className='ms-2' />
                            <BtnDelete handleClick={() => handleDelete(horarioPrevio.diaSemana)} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MostrarHorario;
