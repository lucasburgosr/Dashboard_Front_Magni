import Pedido from '../../entidades/Pedido';
import { Estados } from '../../entidades/enums/Estados';
import { Button, Modal } from 'react-bootstrap';
import { format } from 'date-fns';
import DetallePedido from '../../entidades/DetallePedido';
import ArticuloManufacturadoDetalle from '../../entidades/ArticuloManufacturadoDetalle';
import { useState } from 'react';
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import Promocion from '../../entidades/Promocion';

function ProduccionModalPedido({pedido, show, handleCloseModal, putPedidoRest} : {pedido:Pedido, show:boolean, handleCloseModal:() => void, putPedidoRest:() => void}) {
    
    const [expanded, setExpanded] = useState<string[]>([]);

    const toggleExpand = (index: string) => {
        if (expanded.includes(index)) {
            setExpanded(expanded.filter(i => i !== index));
        } else {
            setExpanded([...expanded, index]);
        }
    };

    const demorarPedido = () => {
        pedido.horaEstimadaFinalizacion = (new Date(new Date(new Date().toISOString().split('T')[0] + 'T' + pedido.horaEstimadaFinalizacion).getTime() - 10800000 + 600000).toISOString().split('T')[1].split('.')[0] as unknown as Date);
        putPedidoRest();
    }

    const terminarPedido = () => {
        pedido.estado = Estados.TERMINADO;
        putPedidoRest();
        handleCloseModal();
    }

    return (
        <Modal className='modal-xxl' centered show={show} onHide={handleCloseModal}>
            <Modal.Header closeButton>Pedido</Modal.Header>
            <Modal.Body>
                <div className='m-4 card p-4 bg-light'>
                    <div className='row justify-content-between'>
                        <div className='col-12 d-flex border-bottom justify-content-center'>
                            <h5 className='text-center pb-2 me-4'>PEDIDO N° {('0000' + pedido.id).slice(-5)}</h5>
                        </div>
                        <div className='col-9 row ms-3'>
                            <h6 className='col-6'>Fecha: {format(pedido?.fechaPedido, "dd/MM/yy HH:mm")}</h6>
                            <h6 className='col-6'>Hora estimada: <b>{pedido?.horaEstimadaFinalizacion.toString()}</b></h6>
                            <h6 className='col-6'>Tipo de envío: {pedido?.tipoEnvio}</h6>
                            <h6 className='col-6'>Forma de pago: {pedido?.formaPago}</h6>
                        </div>
                    </div>
                    <br/>

                    <div className='mt-4'>
                        <h5>Receta</h5>
                        <div className='accordion accordion-flex'>
                        {pedido.detallePedidos?.map((detalle: DetallePedido, index: number) => (
                            <div key={"articulo-" + index} className='accordion-item mb-3'>
                                {detalle.articulo.esParaElaborar !== undefined
                                ?   <div className="accordion-button collapsed accordion-no-arrow">
                                        {detalle.cantidad} x {detalle.articulo.denominacion}
                                    </div>
                                :   (<>
                                    <button onClick={() => toggleExpand("articulo-" + index)} className={`accordion-button ${expanded.includes("articulo-" + index) ? '' : 'collapsed'}`}>
                                        {detalle.cantidad} x {detalle.articulo.denominacion}
                                    </button>
                                    {expanded.includes("articulo-" + index) 
                                    && (<div className='m-2'>
                                        {(detalle.articulo as ArticuloManufacturado).articuloManufacturadoDetalles === undefined 
                                            ?   (<div key={detalle.articulo.id} className='accordion-item mb-3'>
                                                    {(detalle.articulo as Promocion).promocionDetalles.map((pd, indexDetallePromocion) => 
                                                        (<div key={"promocion-" + index + "-" + indexDetallePromocion} className='accordion-item mb-3'>
                                                        { pd.articulo.articuloManufacturadoDetalles === undefined
                                                        ?   <div className="accordion-button collapsed accordion-no-arrow">
                                                                {pd.cantidad} x {pd.articulo.denominacion}
                                                            </div>
                                                        :   (<>
                                                                <button onClick={() => toggleExpand("promocion-" + index + "-" + indexDetallePromocion)} className={`accordion-button ${expanded.includes("promocion-" + index + "-" + indexDetallePromocion) ? '' : 'collapsed'}`}>
                                                                    {pd.cantidad} x {pd.articulo.denominacion}
                                                                </button>
                                                                { expanded.includes("promocion-" + index + "-" + indexDetallePromocion) 
                                                                && (<div className='m-2'>
                                                                        <p className='text-center d-flex'><h5 className='me-2'>Resumen:</h5> <i>"{pd.articulo.resumen}"</i></p>
                                                                            <div className='row'>
                                                                                <div className='col-5 col-xl-3'>
                                                                                <h5>Ingredientes</h5>
                                                                                <ul>
                                                                                    {pd.articulo.articuloManufacturadoDetalles.map((detalleManufacturado: ArticuloManufacturadoDetalle, idx: number) => (
                                                                                        <li key={idx}>
                                                                                            {detalleManufacturado.cantidad} {detalleManufacturado.articuloInsumo.unidadMedida.denominacion} de {detalleManufacturado.articuloInsumo.denominacion}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                                
                                                                            <div className='col border-start'>
                                                                                <h5>Preparación</h5>
                                                                                {pd.articulo.preparacion ?? ''}
                                                                            </div>
                                                                        </div>
                                                                    </div>)
                                                                }
                                                            </>)
                                                        }
                                                        </div>)
                                                    )}
                                                </div>)
                                            :   (<>
                                                <p className='text-center d-flex'>
                                                    <h5 className='me-2'>Resumen:</h5>
                                                    <i>"{detalle.articulo.resumen}"</i>
                                                </p>
                                                <div className='row'>
                                                    <div className='col-5 col-xl-3'>
                                                    <h5>Ingredientes</h5>
                                                    <ul>
                                                        {detalle.articulo.articuloManufacturadoDetalles.map((detalleManufacturado: ArticuloManufacturadoDetalle, idx: number) => (
                                                            <li key={idx}>
                                                                {detalleManufacturado.cantidad} {detalleManufacturado.articuloInsumo.unidadMedida.denominacion} de {detalleManufacturado.articuloInsumo.denominacion}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    </div>
                                                    
                                                    <div className='col border-start'>
                                                        <h5>Preparación</h5>
                                                        {detalle.articulo.preparacion ?? ''}
                                                    </div>
                                                </div>
                                                </>)
                                        }
                                        </div>)
                                    }
                                </>)}
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='row'>
                    <Button className='col me-4 btn-secondary' onClick={handleCloseModal}>Volver</Button>
                    <Button className='col me-4 btn-primary' onClick={demorarPedido}>+10 min</Button>
                    <Button className='col me-4 btn-success' onClick={terminarPedido}>Terminado</Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}
    
export default ProduccionModalPedido;
