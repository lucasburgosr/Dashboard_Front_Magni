import { useEmpresas } from '../../hooks/useEmpresas';
import { useSucursales } from "../../hooks/useSucursales";
import { Card, Container, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { cilBarChart, cilBuilding, cilCreditCard, cilFastfood, cilIndustry, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import LoaderPage from "../../componentes/loaderPage/LoaderPage";
import { useEffect } from "react";
import { Rol } from "../../entidades/enums/Rol";
import { useEmpleado } from "../../hooks/useEmpleado";
import { useAuth0 } from '@auth0/auth0-react';
import { Alert } from '@mui/material';

function Home() {
    const { empresaSeleccionada } = useEmpresas();
    const { sucursalSeleccionada } = useSucursales();
    const { isLoading } = useAuth0();

    const { empleado } = useEmpleado();

    const links = [
        { to: "/empresas", icon: cilBuilding, label: "Empresas", superadmin: true },
        { to: "/sucursales", icon: cilIndustry, label: "Sucursales", superadmin: true },
        { to: "/categorias", icon: cilFastfood, label: "Categorías" },
        { to: "/unidadesmedida", icon: cilFastfood, label: "Unidades de Medida" },
        { to: "/insumos", icon: cilFastfood, label: "Insumos" },
        { to: "/manufacturados", icon: cilFastfood, label: "Manufacturados" },
        { to: "/promociones", icon: cilFastfood, label: "Promociones" },
        { to: "/clientes", icon: cilPeople, label: "Clientes" },
        { to: "/empleados", icon: cilPeople, label: "Empleados" },
        { to: "/facturacion", icon: cilCreditCard, label: "Facturación" },
        { to: "/estadisticas", icon: cilBarChart, label: "Estadísticas" },
    ];

    const redirigirUsuario = () => {
        if (empleado && empleado.sucursal) {
            switch (empleado.rol) {
                case Rol.Administrador: 
                    break;
                case Rol.Superadmin: 
                    break;
                case Rol.Cajero: 
                    if (window.location.pathname !== '/caja' && window.location.pathname !== '/callback') {
                        console.log('a')
                        window.location.href = '/caja';
                    }
                    break;
                case Rol.Delivery: 
                    if (window.location.pathname !== '/logistica' && window.location.pathname !== '/callback') {
                        window.location.href = '/logistica';
                    }
                    break;
                case Rol.Cocinero: 
                    if (window.location.pathname !== '/produccion' && window.location.pathname !== '/callback') {
                        window.location.href = '/produccion';
                    }
                    break;
                default: 
                    if (window.location.pathname !== '/' && window.location.pathname !== '/callback') {
                        window.location.href = '/';
                    }
            }
        }
    }

    useEffect(() => {
        if (empleado)
            redirigirUsuario();
    }, [empleado])

    return (
        <div className="container-fluid py-4">
            {empleado && (empleado.rol === Rol.Administrador || empleado.rol === Rol.Superadmin) ? (
            <div className="container text-center">
                <h1 className="mb-4">Bienvenido a {empresaSeleccionada.nombre}</h1>
                <h2 className="mb-3">{sucursalSeleccionada.nombre}</h2>
                <h5 className="mb-4">Use el menú contextual para navegar</h5>
                <Container>
                    <Row>
                        {links.map((link, index) => (
                            (!link.superadmin || empleado.rol === Rol.Superadmin 
                            ?   <Col key={index} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                    <Card style={{ backgroundColor: '#CCC', height: "100%" }}>
                                        <NavLink to={link.to} className="nav-link" style={{ textDecoration: "none", color: "inherit" }}>
                                            <Card.Body className="d-flex flex-column justify-content-between">
                                                <div>
                                                    <Card.Header className="border rounded" style={{ backgroundColor: '#FFFFFFAA', marginBottom: "10px" }}>
                                                        <CIcon customClassName="nav-icon" icon={link.icon} size="xl" height={60} />
                                                    </Card.Header>
                                                    <Card.Title className="text-center">{link.label}</Card.Title>
                                                </div>
                                            </Card.Body>
                                        </NavLink>
                                    </Card>
                                </Col>
                            :   <div key={index}></div>
                            )
                        ))}
                    </Row>
                </Container>
            </div>

            ) : ( !isLoading && !empleado
            ? (empresaSeleccionada.id 
                ?   <div className="container text-center">
                        <h1 className="mb-4">Bienvenido a {empresaSeleccionada.nombre}</h1>
                        <img src={empresaSeleccionada.imagen.url} className='col-6 rounded' />
                        <h4 className="m-3">Inicie sesión para continuar</h4>
                    </div>
                :   <div className="container text-center">
                        <h1 className="mb-4">Bienvenido al Buen Sabor</h1>
                        <Alert severity="warning">Ocurrió un error al buscar los datos.</Alert>
                    </div>
            )
            : <LoaderPage/>)}
        </div>
    );
}

export default Home;
