import Pedido from '../../entidades/Pedido';
import TablePedido from '../../componentes/tablePedido/TablePedido';
import { Estados } from '../../entidades/enums/Estados';
import { Button, Modal } from 'react-bootstrap';
import { format } from 'date-fns';

function LogisticaModalPedido({pedido, show, handleCloseModal, enviarPedidoRest, putPedidoRest} : {pedido:Pedido, show:boolean, handleCloseModal:() => void, enviarPedidoRest:() => void, putPedidoRest:() => void}) {
    const entregarPedido = () => {
        pedido.estado = Estados.FACTURADO;
        putPedidoRest();
        enviarPedidoRest();
        handleCloseModal();
    }

    return (
        <Modal className='modal-xxl' show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>Pedido</Modal.Header>
        <Modal.Body>
        <div className='m-4 card p-4 bg-light'>
            <div className='row justify-content-between'>
              
              <div className='col-12 d-flex border-bottom justify-content-center'>
                <h5 className='text-center pb-2 me-4'>PEDIDO N° {('0000' + pedido.id).slice(-5)}</h5>
              </div>
              <div className='col-12 row ms-3'>
                <h6 className='col-6 col-xl-4'>Fecha: {format(pedido?.fechaPedido, "dd/MM/yy HH:mm")}</h6>
                <h6 className='col-6 col-xl-4'>Hora estimada: {pedido?.horaEstimadaFinalizacion.toString()}</h6>
                <h6 className='col-6 col-xl-4'>Forma de pago: {pedido?.formaPago}</h6>
                <h6 className='col-6 col-xl-4'>Cliente: {pedido?.cliente.nombre} {pedido?.cliente.apellido}</h6>
                <h6 className='col-6 col-xl-4'>Domicilio: {pedido?.domicilio.calle} {pedido?.domicilio.numero}, {pedido?.domicilio.localidad.nombre}</h6>
              </div>
            </div>
            <br/>

            <TablePedido pedido={pedido}/>
          </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='row'>
                <Button className='col btn-success me-4' onClick={entregarPedido}>Entregar</Button>
                <Button className='col btn-secondary' onClick={handleCloseModal}>Volver</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )
}
    
export default LogisticaModalPedido