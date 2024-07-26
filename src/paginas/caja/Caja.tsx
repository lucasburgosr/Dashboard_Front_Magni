import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import PedidoService from "../../servicios/PedidoService";
import { useSucursales } from '../../hooks/useSucursales';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Estados } from '../../entidades/enums/Estados';
import CajaPedidos from './CajaPedidos';
import CajaModalPedido from "./CajaModalPedido";
import { AppBar, Tab, Tabs } from "@mui/material";
import Facturacion from "../facturacion/Facturacion";

const Caja = () => {
    const [ tab, setTab ] = useState(0);
    const [ pedido, setPedido ] = useState<Pedido>(new Pedido());
    const [ pedidosPendientes, setPedidosPendientes ] = useState<Pedido[]>([]);
    const [ pedidosTerminados, setPedidosTerminados ] = useState<Pedido[]>([]);
    const [ show, setShow ] = useState(false);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const getPedidosRest = async () => {
      const datosPendientes: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, "", "", "", Estados.PENDIENTE);
      const datosTerminados: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, "", "", "", Estados.TERMINADO);
      setPedidosPendientes(datosPendientes);
      setPedidosTerminados(datosTerminados);
    }

    const putPedidoRest = async () => {
      await pedidoService.put(pedido.id, pedido);
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

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
      setTab(newValue);
    }

    function a11yProps(index: number) {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
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

                      if (newPedido.estado === Estados.TERMINADO)
                        setPedidosTerminados((p) => [newPedido, ...p.filter(pedido => pedido.id !== newPedido.id)]);
                      
                      else if (newPedido.estado === Estados.PENDIENTE)
                        setPedidosPendientes((p) => [newPedido, ...p.filter(pedido => pedido.id !== newPedido.id)]);
                      
                      else {
                        setPedidosPendientes((p) => p.filter(pedido => pedido.id !== newPedido.id));
                        setPedidosTerminados((p) => p.filter(pedido => pedido.id !== newPedido.id));
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
          <AppBar position="static">
            <Tabs
            value={tab}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            >
              <Tab label="Administración de pedidos" {...a11yProps(0)} />
              <Tab label="Administración de facturas" {...a11yProps(1)} />
            </Tabs>
          </AppBar>

          {tab === 0 
          ? <>
              <CajaModalPedido pedido={pedido} show={show} handleCloseModal={handleCloseModal} enviarPedidoRest={enviarPedidoRest} putPedidoRest={putPedidoRest} />
              <div className='row mt-3'>
              <div className='col-12 card p-4 mx-3 col-xl'>
                <h4 className="mb-3">Buzón de pedidos pendientes:</h4>
                <CajaPedidos pedidos={pedidosPendientes} handleOpenModal={handleOpenModal} />
              </div>
              <div className='col-12 card p-4 mx-3 col-xl'>
                <h4 className="mb-3">Buzón de pedidos terminados:</h4>
                <CajaPedidos pedidos={pedidosTerminados} handleOpenModal={handleOpenModal} />
              </div>
              </div>
            </>
          : <>
              <Facturacion/>
            </>
          }
        </div>
    )
}

export default Caja;
