import LogoutButton from "./LogoutButton";
import ProfileButton from "./ProfileButton";
import LoginButton from "./LoginButton";
import SucursalSelect from "./SucursalSelect";
import { Rol } from "../../entidades/enums/Rol";
import { useEmpleado } from "../../hooks/useEmpleado";
import { useEmpresas } from "../../hooks/useEmpresas";
import { useSucursales } from "../../hooks/useSucursales";
import { useEffect } from "react";

function NavBar({ currentPage } : { currentPage:string }) {
  const { empleado } = useEmpleado();
  const { handleChangeEmpresa } = useEmpresas();
  const { sucursalSeleccionada, handleChangeSucursal } = useSucursales();

  useEffect(() => {
    if (empleado && empleado.sucursal) {
      handleChangeEmpresa(empleado.sucursal.empresa!.id);
      handleChangeSucursal(empleado.sucursal.id);
    }
  }, [empleado])

  return (
    <nav className="navbar bg-light" style={{ width: '100%' }}>
      <div className="container-fluid">

        {empleado
          ? <>
              {empleado.rol === Rol.Superadmin
                ? <>
                    <button className="btn btn-primary d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarCollapse" aria-expanded="false" aria-controls="sidebarCollapse">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <SucursalSelect />
                    <h4 className="my-auto">{currentPage}</h4>
                  </>
                : <>
                  {(empleado && empleado.sucursal) &&
                  <>
                    <img src="/buen-sabor.svg" className="ms-3 my-auto" alt="Logo" />
                    <h3 className="user-select-none ms-3 my-auto text-secondary">
                      {sucursalSeleccionada.nombre}
                    </h3>
                    <h4 className="user-select-none ms-3 me-auto my-auto text-secondary">
                      <i>| {empleado.rol}</i>
                    </h4>
                  </>
                  }
                </>
              }
              <div>
                <ProfileButton />
                <LogoutButton />
              </div>
            </>
          : <div className="ms-auto">
              <LoginButton />
            </div>
        }
      </div>
    </nav>
  );
}

export default NavBar;
