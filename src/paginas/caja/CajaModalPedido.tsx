import Pedido from '../../entidades/Pedido';
import TablePedido from '../../componentes/tablePedido/TablePedido';
import { Estados } from '../../entidades/enums/Estados';
import { Button, Modal } from 'react-bootstrap';
import ChipEstado from '../../componentes/chipEstado/ChipEstado';
import { TipoEnvio } from '../../entidades/enums/TipoEnvio';
import { format } from 'date-fns';
import { useEmpleado } from '../../hooks/useEmpleado';

function CajaModalPedido({pedido, show, handleCloseModal, enviarPedidoRest, putPedidoRest} : {pedido:Pedido, show:boolean, enviarPedidoRest:() => void, handleCloseModal:() => void, putPedidoRest:() => void}) {
    const {empleado} = useEmpleado();  

    const aprobarPedido = () => {
      if (empleado) {
        pedido.estado = Estados.APROBADO;
        pedido.empleado = empleado;
        putPedidoRest();
        handleCloseModal();
      }
    }

    const cancelarPedido = () => {
      pedido.estado = Estados.CANCELADO;
      putPedidoRest();
      handleCloseModal();
    }

    const mandarDeliveryPedido = () => {
      pedido.estado = Estados.EN_DELIVERY;
      putPedidoRest();
      handleCloseModal();
    }

    const facturarPedido = () => {
      pedido.estado = Estados.FACTURADO;
      putPedidoRest();
      enviarPedidoRest();
      handleCloseModal();
    }

    return (
      <Modal size='xl' show={show} onHide={handleCloseModal}>
      <Modal.Header closeButton>Pedido</Modal.Header>
      <Modal.Body>
      <div className='m-4 card p-4 bg-light'>
          <div className='row justify-content-between'>
            
            <div className='col-12 d-flex border-bottom justify-content-center'>
              <h5 className='text-center pb-2 me-4'>PEDIDO N° {('0000' + pedido.id).slice(-5)}</h5>
              <ChipEstado estado={pedido.estado} />
            </div>
            <div className='col-9 row ms-3'>
              <h6 className='col-6'>Fecha: {format(pedido?.fechaPedido, "dd/MM/yy HH:mm")}</h6>
              <h6 className='col-6'>Hora estimada: {pedido?.horaEstimadaFinalizacion.toString()}</h6>
              <h6 className='col-6'>Tipo de envío: {pedido?.tipoEnvio}</h6>
              <h6 className='col-6'>Forma de pago: {pedido?.formaPago}</h6>
            </div>
          </div>
          <br/>
          <TablePedido pedido={pedido}/>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='row'>
              {pedido.estado === Estados.PENDIENTE 
                  ?   <>
                          <Button className='col me-4 btn-success' onClick={aprobarPedido}>Aprobar</Button>
                          <Button className='col me-4 btn-danger' onClick={cancelarPedido}>Cancelar</Button>
                      </>
                  :   (pedido.tipoEnvio === TipoEnvio.Delivery) 
                          ?   <Button className='col me-4 btn-success' onClick={mandarDeliveryPedido}>Delivery</Button>
                          :   <Button className='col me-4 btn-primary' onClick={facturarPedido}>Facturar</Button>
              }
              <Button className='col btn-secondary' onClick={handleCloseModal}>Volver</Button>
          </div>
        </Modal.Footer>
      </Modal>
      )
}
    
export default CajaModalPedido