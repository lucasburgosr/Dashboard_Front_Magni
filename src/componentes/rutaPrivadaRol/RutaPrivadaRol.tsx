import { Navigate, Outlet } from 'react-router-dom';
import { Rol } from '../../entidades/enums/Rol';
import { useEmpleado } from '../../hooks/useEmpleado';
import LoaderPage from '../loaderPage/LoaderPage';

function RolUsuario({ roles }: { roles:Rol[] }) {
    const { empleado } = useEmpleado();

    if((empleado)){
        if (roles.includes(empleado.rol)) {
            return <Outlet />;
        }else {
            return <Navigate replace to='' />;
        }
    } else {
        return <LoaderPage />
    }
        
    
}
export default RolUsuario;