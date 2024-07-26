// App.tsx
import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from 'react';

import Sidebar from "./componentes/sidebar/Sidebar";
import NavBar from "./componentes/navbar/NavBar";
import { AuthenticationGuard } from "./componentes/auth0/AuthenticationGuard";
import AuthHandler from "./componentes/navbar/Auth0Handler";
import LoaderPage from "./componentes/loaderPage/LoaderPage";
import PedidosClientes from "./paginas/estadisticas/PedidosClientes";
import { RutaPrivada } from "./componentes/rutaPrivada/RutaPrivada";
import RutaPrivadaRol from "./componentes/rutaPrivadaRol/RutaPrivadaRol";
import { Rol } from "./entidades/enums/Rol";
(window).global = window;

const Sucursales = lazy(() => import("./paginas/sucursales/Sucursales"));
const Manufacturados = lazy(() => import("./paginas/manufacturados/Manufacturados"));
const Empresas = lazy(() => import("./paginas/empresas/Empresas"));
const Insumos = lazy(() => import("./paginas/insumos/Insumos"));
const UnidadesMedida = lazy(() => import("./paginas/unidadesMedida/UnidadesMedida"));
const Categorias = lazy(() => import("./paginas/categorias/Categorias"));
const Promociones = lazy(() => import("./paginas/promociones/Promociones"));
const Empleados = lazy(() => import("./paginas/empleados/Empleados"));
const Clientes = lazy(() => import("./paginas/clientes/Clientes"));
const Facturacion = lazy(() => import("./paginas/facturacion/Facturacion"));
const ErrorPage = lazy(() => import("./paginas/adminPage/ErrorPage"));
const EmpleadoProfilePage = lazy(() => import("./paginas/adminPage/EmpleadoProfilePage"));
const Home = lazy(() => import("./paginas/home/Home"));
const Estadisticas = lazy(() => import("./paginas/estadisticas/Estadisticas"));
const Caja = lazy(() => import("./paginas/caja/Caja"));
const Produccion = lazy(() => import("./paginas/produccion/Produccion"));
const Logistica = lazy(() => import("./paginas/logistica/Logistica"));

const routeNameMap: { [key: string]: string } = {
    "/": "Home",
    "/empleado/perfil": "Perfil del Empleado",
    "/empresas": "Empresas",
    "/sucursales": "Sucursales",
    "/unidadesmedida": "Unidades de Medida",
    "/insumos": "Insumos",
    "/manufacturados": "Manufacturados",
    "/categorias": "Categorías",
    "/promociones": "Promociones",
    "/empleados": "Empleados",
    "/clientes": "Clientes",
    "/facturacion": "Facturación",
    "/estadisticas": "Estadísticas",
    "/pedidos": "Pedidos de Clientes",
    "/caja": "Caja",
    "/produccion": "Producción",
    "/logistica": "Logística",
    "+": "Error"
};

export default function App() {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState("");

    useEffect(() => {
        const path = location.pathname;
        const pageName = routeNameMap[path] || "Página Desconocida";
        setCurrentPage(pageName);
    }, [location]);

    return (
        <>
            <Sidebar />
            <div className="h-100 w-100 flex-grow-1" >
                <NavBar currentPage={currentPage} />
                <div className='content' style={{ overflowY: 'auto', height: '87%', background: "#f9f9f9" }}>
                    <Suspense fallback={<LoaderPage />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/callback" element={<LoaderPage />} />

                            <Route path="/empleado/perfil" element={
                                <RutaPrivada><AuthenticationGuard component={EmpleadoProfilePage} />
                                </RutaPrivada>}
                            />

                            <Route element={<RutaPrivadaRol roles={[Rol.Superadmin]} />}>
                                <Route path="empresas" element={<AuthenticationGuard component={Empresas} />} />
                                <Route path="sucursales" element={<AuthenticationGuard component={Sucursales} />} />
                            </Route>

                            <Route element={<RutaPrivadaRol roles={[Rol.Administrador, Rol.Superadmin]} />}>
                                <Route path="unidadesmedida" element={<AuthenticationGuard component={UnidadesMedida} />} />
                                <Route path="insumos" element={<AuthenticationGuard component={Insumos} />} />
                                <Route path="manufacturados" element={<AuthenticationGuard component={Manufacturados} />} />
                                <Route path="categorias" element={<AuthenticationGuard component={Categorias} />} />
                                <Route path="promociones" element={<AuthenticationGuard component={Promociones} />} />
                                <Route path="empleados" element={<AuthenticationGuard component={Empleados} />} />
                                <Route path="clientes" element={<AuthenticationGuard component={Clientes} />} />
                                <Route path="facturacion" element={<AuthenticationGuard component={Facturacion} />} />
                                <Route path="estadisticas" element={<AuthenticationGuard component={Estadisticas} />} />
                                <Route path="pedidos" element={<AuthenticationGuard component={PedidosClientes} />} />
                            </Route>

                            <Route element={<RutaPrivadaRol roles={[Rol.Cajero]} />}>
                                <Route
                                    path="/caja"
                                    element={<AuthenticationGuard component={Caja} />}
                                />
                            </Route>

                            <Route element={<RutaPrivadaRol roles={[Rol.Cocinero]} />}>
                                <Route
                                    path="/produccion"
                                    element={<AuthenticationGuard component={Produccion} />}
                                />
                            </Route>

                            <Route element={<RutaPrivadaRol roles={[Rol.Delivery]} />}>
                                <Route
                                    path="/logistica"
                                    element={<AuthenticationGuard component={Logistica} />}
                                />
                            </Route>

                            <Route path="+" element={<ErrorPage />} />
                        </Routes>
                    </Suspense>
                    <AuthHandler />
                </div>
            </div>
        </>
    );
}
