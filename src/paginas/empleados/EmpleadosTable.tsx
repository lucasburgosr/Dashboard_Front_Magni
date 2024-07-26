import Empleado from "../../entidades/Empleado";
import BtnDelete from '../../componentes/btnDelete/BtnDelete';
import BtnEdit from '../../componentes/btnEdit/BtnEdit';
import BtnAdd from '../../componentes/btnAdd/BtnAdd';
import TableGenerica from '../../componentes/tableGenerica/TableGenerica';
import { Column } from "../../types/Column";

const EmpleadosTable = ({ empleados, mostrarVisibles, handleShow, handleEliminar } : { empleados: Empleado[], mostrarVisibles: boolean, handleShow: (empleado?: Empleado) => void, handleEliminar: (empleado: Empleado) => void }) => {
    const columns: Column[] = [
        { id: 'rol', label: 'Rol', align: 'center' },
        { id: 'nombre', label: 'Nombre', align: 'center' },
        { id: 'apellido', label: 'Apellido', align: 'center' },
        { id: 'telefono', label: 'Teléfono', align: 'center' },
        { id: 'email', label: 'E-mail', align: 'center' },
        { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', align: 'center', format: (value) => (value as Date).toLocaleString('es-AR') },
        { id: 'domicilio', label: 'Domicilio', align: 'center', format: (value: any) => `${value.calle} ${value.numero}` },
    ];

    const renderActions = (row: Empleado) => (
        <div className='d-flex justify-content-end'>
            {mostrarVisibles ? (
                <>
                    <BtnEdit handleClick={() => handleShow(row)} />
                    <div className='ms-2' />
                    <BtnDelete handleClick={() => handleEliminar(row)} />
                </>
            ) : (
                <BtnAdd color='#1b9e3e' handleClick={() => handleEliminar(row)} />
            )}
        </div>
    );

    return (
        <TableGenerica 
            rows={empleados} 
            columns={columns} 
            renderActions={renderActions} 
        />
    );
}

export default EmpleadosTable;
