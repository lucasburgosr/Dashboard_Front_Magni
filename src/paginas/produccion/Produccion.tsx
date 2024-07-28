import { useEffect, useState } from "react";
import Pedido from "../../entidades/Pedido";
import PedidoService from "../../servicios/PedidoService";
import { useSucursales } from '../../hooks/useSucursales';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Estados } from '../../entidades/enums/Estados';
import { AppBar, Tab, Tabs } from "@mui/material";
import ProduccionModalPedido from "./ProduccionModalPedido";
import ProduccionPedidos from "./ProduccionPedidos";
import Manufacturados from "../manufacturados/Manufacturados";
import Insumos from "../insumos/Insumos";
import './produccion.css';

const Produccion = () => {
    const [tab, setTab] = useState(0);
    const [pedido, setPedido] = useState<Pedido>(new Pedido());
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [show, setShow] = useState(false);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const getPedidosRest = async () => {
        const datos: Pedido[] = await pedidoService.buscarXSucursal(sucursalSeleccionada.id, "", "", "", Estados.APROBADO);
        setPedidos(datos);
    }

    const putPedidoRest = async () => {
        await pedidoService.put(pedido.id, pedido);
    }

    const handleOpenModal = (pedido: Pedido) => {
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
                        const newPedido: Pedido = JSON.parse(message.body);

                        if (newPedido.estado === Estados.APROBADO)
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
            <AppBar position="static" sx={{ backgroundColor: '#ccdd91' }}>
                <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    TabIndicatorProps={{ style: { backgroundColor: '#5bbec0' } }}
                >
                    <Tab label="Pedidos" {...a11yProps(0)} sx={{ fontWeight: 'bold' }} />
                    <Tab label="Insumos" {...a11yProps(1)} sx={{ fontWeight: 'bold' }} />
                    <Tab label="Productos Manufacturados" {...a11yProps(2)} sx={{ fontWeight: 'bold' }} />
                </Tabs>
            </AppBar>

            {tab === 0
                ? <>
                    <ProduccionModalPedido pedido={pedido} show={show} handleCloseModal={handleCloseModal} putPedidoRest={putPedidoRest} />
                    <div className='row mt-3'>
                        <h4 className="mb-3">Buzón de pedidos aprobados:</h4>
                        <ProduccionPedidos pedidos={pedidos} handleOpenModal={handleOpenModal} />
                    </div>
                </>
                : tab === 1
                    ? <>
                        <Insumos />
                    </>
                    : <>
                        <Manufacturados />
                    </>
            }
        </div>
    )
}

export default Produccion;
