import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useEmpleado } from '../../hooks/useEmpleado';

export const RutaPrivada = ({ children }: { children: ReactNode }) => {
    const { empleado } = useEmpleado();

	return empleado ? children : <Navigate to='' />;
};