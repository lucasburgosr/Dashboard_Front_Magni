import { CircularProgress, Button, TextField, Collapse, Alert } from "@mui/material";
import EmpleadoService from "../../servicios/EmpleadoService";
import { useState } from "react";
import Empleado from "../../entidades/Empleado";
import './profile.css';
import DomicilioForm from "../domicilios/DomicilioForm";
import { Form } from "react-bootstrap";
import CargarImagen from "../cargarImagenes/CargarImagen";
import { Link } from "react-router-dom";

const Profile = () => {
  const [errors, ] = useState<{ [key in keyof Empleado]?: string }>({});
  const [jsonUsuario, ] = useState<any>(localStorage.getItem('usuario'));
  const [empleado, setEmpleado] =  useState<Empleado>(JSON.parse(jsonUsuario) as Empleado);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [alerta, setAlerta] = useState<string>('');

  const urlapi = import.meta.env.VITE_API_URL;
  const empleadoService = new EmpleadoService(urlapi + "/api/empleados")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmpleado({ ...empleado, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!empleado.nombre) {
        throw new Error("El nombre del empleado no puede ser vacío");
      }
      if (!empleado.apellido) {
        throw new Error("El apellido del empleado no puede ser vacío");
      }
      if (!empleado.domicilio.calle) {
        throw new Error("La calle del domicilio del empleado no puede estar vacía");
      }
      if (!empleado.domicilio.numero) {
        throw new Error("El numero del domicilio del empleado no puede estar vacío");
      }
      if (!empleado.domicilio.cp) {
        throw new Error("El código postal del domicilio del empleado no puede estar vacío");
      }
      if (!empleado.domicilio.localidad.nombre) {
        throw new Error("La localidad del domicilio del empleado no puede estar vacía");
      }
      if (!empleado.telefono) {
        throw new Error("El telefono del empleado no puede estar vacío");
      }
      if (!empleado.email) {
        throw new Error("El e-mail del empleado no puede estar vacío");
      }
      await empleadoService.put(empleado.id, empleado);
      setIsEditing(false);
    } catch (error) {
      setAlerta(String(error));
      setTimeout(() => {
        setAlerta('');
      }, 3000);
    }
  };

  return (
    <>
      {empleado ? (
        <div className="m-3">
          <Collapse in={alerta !== ''} style={{position:'fixed', zIndex:'10', left:'10%', right:'10%'}}>
              <Alert severity="error" onClose={() => setAlerta('')}>{alerta}</Alert>
          </Collapse>

          <div className="row border rounded p-3 my-4 mx-1">
            <div className="col">
              <h2 className="ms-3 mb-4">Empleado</h2>
              <div className="row">
                <div className="perfil-imagen-container">
                {isEditing 
                  ? <CargarImagen imagen={empleado.imagen} handleChange={(key, value) => setEmpleado((prevState:Empleado) => ({
                    ...prevState,
                    [key]: value}))} />
                  : <img src={empleado.imagen.url} alt={empleado.nombre} className="perfil-imagen" />
                  }
                </div>
                <div className="col">
                  {isEditing ? (
                    <>
                      <TextField
                        label="Nombre"
                        name="nombre"
                        size="small"
                        value={empleado.nombre}
                        onChange={handleInputChange}
                        className="my-2"
                        fullWidth
                      />
                      <TextField
                        label="Apellido"
                        name="apellido"
                        size="small"
                        value={empleado.apellido}
                        onChange={handleInputChange}
                        className="my-2"
                        fullWidth
                      />
                      <TextField
                        label="Contraseña"
                        name="contraseña"
                        size="small"
                        type="password"
                        value="************"
                        disabled
                        className="my-2"
                        fullWidth
                      />
                    </>
                  ) : (
                    <>
                      <div className="d-flex my-2">
                        <h5 className="me-3">Nombre:</h5>
                        <h5 className="fw-normal">{empleado.nombre}</h5>
                      </div>
                      <div className="d-flex my-2">
                        <h5 className="me-3">Apellido:</h5>
                        <h5 className="fw-normal">{empleado.apellido}</h5>
                      </div>
                      <div className="d-flex my-2">
                        <h5 className="me-3">Contraseña:</h5>
                        <h5 className="fw-normal">************</h5>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col mt-3">
              <h4 className="mb-3">Contacto</h4>
              {isEditing ? (
                <>
                  <TextField
                    label="Teléfono"
                    name="telefono"
                    size="small"
                    value={empleado.telefono}
                    onChange={handleInputChange}
                    className="my-2"
                    fullWidth
                  />
                  <TextField
                    label="E-mail"
                    name="email"
                    size="small"
                    value={empleado.email}
                    disabled
                    className="my-2"
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <div className="d-flex my-2">
                    <h5 className="me-3">Teléfono:</h5>
                    <h5 className="fw-normal">{empleado.telefono}</h5>
                  </div>
                  <div className="d-flex my-2">
                    <h5 className="me-3">E-mail:</h5>
                    <h5 className="fw-normal">{empleado.email}</h5>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border rounded p-3 my-2 mx-1">
            <h4 className="mb-3">Domicilio</h4>
            {isEditing ? (
              <Form.Group controlId="domicilio">
              <DomicilioForm domicilio={empleado.domicilio} errors={errors} handleChangeDomicilio={(key, value) => setEmpleado((prevState:Empleado) => ({
                  ...prevState,
                  [key]: value
              }))} />
              </Form.Group>
            ) : (
              <>
                <div className="d-flex my-2">
                  <h5 className="me-3">Calle:</h5>
                  <h5 className="fw-normal">{empleado.domicilio.calle} {empleado.domicilio.numero}</h5>
                </div>
                <div className="row my-2">
                  <div className="col d-flex">
                    <h5 className="me-3">Localidad:</h5>
                    <h5 className="fw-normal">{empleado.domicilio.localidad.nombre}</h5>
                  </div>
                  <div className="col d-flex">
                    <h5 className="me-3">Código postal:</h5>
                    <h5 className="fw-normal">{empleado.domicilio.cp}</h5>
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col d-flex">
                    <h5 className="me-3">Provincia:</h5>
                    <h5 className="fw-normal">{empleado.domicilio.localidad.provincia.nombre}</h5>
                  </div>
                  <div className="col d-flex">
                    <h5 className="me-3">País:</h5>
                    <h5 className="fw-normal">{empleado.domicilio.localidad.provincia.pais.nombre}</h5>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="d-flex justify-content-between">
            <Link to={'../'}>
              <Button variant="contained" color="secondary">Volver</Button>
            </Link>
            {isEditing ? (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Guardar
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)}>
                Modificar Datos
              </Button>
            )}
          </div>
        </div>
      ) : <CircularProgress />}
    </>
  );
};

export default Profile;
