import { CircularProgress, Button, TextField, Collapse, Alert, Card, CardContent, Typography } from "@mui/material";
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
        <div className="m-3 d-flex justify-content-center">
          <Collapse in={alerta !== ''} style={{position:'fixed', zIndex:'10', left:'10%', right:'10%'}}>
              <Alert severity="error" onClose={() => setAlerta('')}>{alerta}</Alert>
          </Collapse>

          <Card style={{ backgroundColor: '#ccdd91', color: '#fff', maxWidth: '800px', width: '100%' }}>
            <CardContent>
              <div className="text-center mb-4">
                <div className="perfil-imagen-container mx-auto">
                  {isEditing 
                    ? <CargarImagen imagen={empleado.imagen} handleChange={(key, value) => setEmpleado((prevState:Empleado) => ({
                      ...prevState,
                      [key]: value}))} />
                    : <img src={empleado.imagen.url} alt={empleado.nombre} className="perfil-imagen grande" />
                  }
                </div>
                <Typography variant="h4" className="mt-3" style={{ fontWeight: 'bold' }}>{empleado.nombre} {empleado.apellido}</Typography>
              </div>
              <div className="row justify-content-center">
                <div className="col-md-5 text-start">
                  <Typography variant="h5" className="mb-3" style={{ fontWeight: 'bold',textAlign:'center' }}>Domicilio</Typography>
                  {isEditing ? (
                    <Form.Group controlId="domicilio">
                      <DomicilioForm domicilio={empleado.domicilio} errors={errors} handleChangeDomicilio={(key, value) => setEmpleado((prevState:Empleado) => ({
                        ...prevState,
                        [key]: value
                      }))} />
                    </Form.Group>
                  ) : (
                    <>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>Calle:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.domicilio.calle} {empleado.domicilio.numero}</Typography>
                      </div>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>Localidad:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.domicilio.localidad.nombre}</Typography>
                      </div>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>Provincia:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.domicilio.localidad.provincia.nombre}</Typography>
                      </div>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>País:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.domicilio.localidad.provincia.pais.nombre}</Typography>
                      </div>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>Código postal:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.domicilio.cp}</Typography>
                      </div>
                    </>
                  )}
                </div>
                <div className="col-md-5 text-start">
                  <Typography variant="h5" className="mb-3" style={{ fontWeight: 'bold', textAlign:'center' }}>Contacto</Typography>
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
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>Teléfono:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.telefono}</Typography>
                      </div>
                      <div className="d-flex my-2" style={{ margin: '3px' }}>
                        <Typography variant="body1" className="me-3" style={{ fontWeight: 'bold' }}>E-mail:</Typography>
                        <Typography variant="body1" className="fw-normal">{empleado.email}</Typography>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="row justify-content-center mt-4">
                <div className="col-md-5 text-start">
                  <Link to={'../'}>
                    <Button variant="contained" style={{ backgroundColor: '#a6c732', color: '#fff', width: '100%' }}>Volver</Button>
                  </Link>
                </div>
                <div className="col-md-5 text-start">
                  {isEditing ? (
                    <Button variant="contained" style={{ backgroundColor: '#a6c732', color: '#fff', width: '100%' }} onClick={handleSubmit}>
                      Guardar
                    </Button>
                  ) : (
                    <Button variant="contained" style={{ backgroundColor: '#a6c732', color: '#fff', width: '100%' }} onClick={() => setIsEditing(true)}>
                      Modificar Datos
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : <CircularProgress />}
    </>
  );
};

export default Profile;
