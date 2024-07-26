
import { useEffect, useState }from "react";
import { Modal } from "react-bootstrap";
import BtnDelete from "../btnDelete/BtnDelete";
import PromocionDetalle from "../../entidades/PromocionDetalle";
import Promocion from "../../entidades/Promocion";
import ModalDetallesPromocion from "./ModalDetallesPromocion";
import ArticuloManufacturadoDetalle from "../../entidades/ArticuloManufacturadoDetalle";

function CargarDetallesPromocion({ promocion, handleChange }: { promocion:Promocion, handleChange: (key: keyof object, value: unknown) => void}) {
    const [detalles, setDetalles] = useState<PromocionDetalle []>([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }

    const actualizarDetalles = (detallesEnviados: PromocionDetalle[]) => {
        handleChange("promocionDetalles" as keyof object, detallesEnviados);
    };

    const deleteDetalle = (id:number) => {
        handleChange("promocionDetalles" as keyof object, [...detalles.filter((_detalle, index) => index !== id)]);
    }

    useEffect(() => {
        setDetalles(promocion.promocionDetalles);
    }, [promocion]);

    return (
    <div className="mb-3">
        { show 
            && <div className="modal-backdrop fade show"></div> 
        }
        <Modal className="modal-xl" centered show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Detalles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalDetallesPromocion detallesPrevios={detalles} onDetallesChange={actualizarDetalles} handleCloseModal={handleClose}/>
            </Modal.Body>
            
        </Modal>

        <div className="p-2 border rounded">
        <div className="d-flex justify-content-center" style={{height:'196px', overflowY:'auto'}}>
        <table className='table stripped' style={{width:'98%'}}>
            <thead style={{position:'sticky', top:'0', zIndex:'1'}}>
                <tr>
                    <th colSpan={4}>
                        <div className='row'>
                        <button type="button" className='btn btn-secondary' onClick={handleShow}>Editar</button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
            {detalles.map((detalle, index) => (
                <tr key={index}>
                    <td style={{width:"60%"}}>{detalle.articulo.denominacion}</td>
                    <td style={{width:"5%", textAlign:'center'}}>{detalle.cantidad}</td>
                    <td style={{width:"10%", textAlign:'center'}}>{detalle.articulo.unidadMedida.denominacion}</td>
                    <td style={{width:"25%", textAlign:'center'}}><BtnDelete handleClick={() => deleteDetalle(index)} /></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="fw-bold d-flex justify-content-between">
            <p>Precio total original: ${detalles.reduce((sum, current) => sum + current.cantidad * current.articulo.precioVenta, 0).toLocaleString('es-AR')}</p>
            <p>Costo total: ${detalles.reduce((sum, current) => sum + current.cantidad * (current.articulo.articuloManufacturadoDetalles?.reduce((sumManufacturado:number, currentManufacturado:ArticuloManufacturadoDetalle) => sumManufacturado + currentManufacturado.articuloInsumo.precioCompra * currentManufacturado.cantidad, 0) ?? current.articulo.precioCompra ?? 0), 0).toLocaleString('es-AR')}</p>
        </div>
        </div>
    </div>
    );
}

export default CargarDetallesPromocion;