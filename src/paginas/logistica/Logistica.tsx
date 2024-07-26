import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import PedidoService from "../../servicios/PedidoService";
import { useSucursales } from '../../hooks/useSucursales';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Estados } from '../../entidades/enums/Estados';
import LogisticaPedidos from "./LogisticaPedidos";
import LogisticaModalPedido from "./LogisticaModalPedido";
import './logistica.css';

const Logistica = () => {
    const [ pedido, setPedido ] = useState<Pedido>(new Pedido());
    const [ pedidos, setPedidos ] = useState<Pedido[]>([]);
    const [ show, setShow ] = useState(false);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const getPedidosRest = async () => {
      const datos: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, "", "", "", Estados.EN_DELIVERY);
      setPedidos(datos);
    }

    const putPedidoRest = async () => {
      await pedidoService.put(pedido.id, pedido);
      getPedidosRest();
    }

    const enviarPedidoRest = async () => {
      await pedidoService.enviarPedido(pedido.id);
    }

    const handleOpenModal = (pedido:Pedido) => {
      setPedido(pedido);
      setShow(true);
    }

    const handleCloseModal = () => {
      setShow(false);
    }

    useEffect(() => {
        getPedidosRest();

        const socket = new SockJS(urlapi + '/wss');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                stompClient.subscribe(`/topic/pedidos/${sucursalSeleccionada.id}`, (message) => {
                    if (message.body) {
                      const newPedido:Pedido = JSON.parse(message.body);

                      if (newPedido.estado === Estados.EN_DELIVERY)
                        setPedidos((p) => [newPedido, ...p.filter(pedido => pedido.id !== newPedido.id)]);
                      else {
                        setPedidos((p) => p.filter(pedido => pedido.id !== newPedido.id));
                      }
                    }
                });
            },
        });

        stompClient.activate();

        return () => {
            stompClient.deactivate();
        };
    }, [sucursalSeleccionada]);

    return (
        <div className="m-3">
          <LogisticaModalPedido pedido={pedido} show={show} handleCloseModal={handleCloseModal} enviarPedidoRest={enviarPedidoRest} putPedidoRest={putPedidoRest} />
          <div>
            <h4>Buzón de pedidos a enviar:</h4>
            <LogisticaPedidos pedidos={pedidos} handleOpenModal={handleOpenModal} />
          </div>
        </div>
    )
}

export default Logistica;
