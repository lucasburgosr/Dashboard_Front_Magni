import { NavLink } from 'react-router-dom';
import { cilBarChart, cilBuilding, cilCreditCard, cilFastfood, cilIndustry, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CSidebar, CSidebarNav } from "@coreui/react";
import EmpresaSelect from './EmpresaSelect';
import '@coreui/coreui/dist/css/coreui.min.css';
import './sidebar.css';
import { useEmpleado } from '../../hooks/useEmpleado';
import { Rol } from '../../entidades/enums/Rol';

function Sidebar() {
    const { empleado } = useEmpleado();

    const links = [
        { to: "/", label: "EmpresaSelect", component: <EmpresaSelect /> },
        { to: "/empresas", icon: cilBuilding, label: "Empresas", superAdmin: true },
        { to: "/sucursales", icon: cilIndustry, label: "Sucursales", superAdmin: true },
        {
            label: "Articulos", icon: cilFastfood, subItems: [
                { to: "/categorias", label: "Categorías" },
                { to: "/unidadesmedida", label: "Unidades de Medida" },
                { to: "/insumos", label: "Insumos" },
                { to: "/manufacturados", label: "Manufacturados" },
                { to: "/promociones", label: "Promociones" }
            ]
        },
        {
            label: "Usuarios", icon: cilPeople, subItems: [
                { to: "/clientes", label: "Clientes" },
                { to: "/empleados", label: "Empleados" }
            ]
        },
        { to: "/facturacion", icon: cilCreditCard, label: "Facturación" },
        {
            label: "Estadisticas", icon: cilBarChart, subItems: [
                { to: "/estadisticas", label: "Estadísticas" },
                { to: "/pedidos", label: "Pedidos" }
            ]
        },
    ];

    return (
        <div className="d-flex">
            {empleado 
            && (empleado.rol === Rol.Administrador || empleado.rol === Rol.Superadmin )
            && (
                 <CSidebar className="collapse border-end d-md-block d-block sidebar" id="sidebarCollapse" style={{ position: 'relative', height: '100%', backgroundColor: '#E0E0E0' }} unfoldable>
                    <CSidebarNav>
                        {links.map((link, index) => (
                            !link.superAdmin || empleado.rol === Rol.Superadmin ? (
                            link.subItems 
                            ? (
                                <CNavGroup key={index} toggler={<><CIcon customClassName="nav-icon" icon={link.icon} />{link.label}</>}>
                                    {link.subItems.map((subLink, subIndex) => (
                                        <CNavItem key={subIndex}>
                                            <NavLink to={subLink.to} className="nav-link">
                                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                                {subLink.label}
                                            </NavLink>
                                        </CNavItem>
                                    ))}
                                </CNavGroup>
                            ) : (
                                <CNavItem key={index}>
                                    <NavLink to={link.to} className="nav-link">
                                        {link.icon && <CIcon customClassName="nav-icon" icon={link.icon} />}
                                        {link.component || link.label}
                                    </NavLink>
                                </CNavItem>
                            )
                        ) : <div key={index}></div>
                        ))}
                    </CSidebarNav>
                </CSidebar>
            )
            }
        </div>
    );
}

export default Sidebar;
