import PedidoService from "../../servicios/PedidoService";
import { ChangeEvent, useEffect, useState } from "react";
import { useSucursales } from "../../hooks/useSucursales";
import { BarChart } from "@mui/x-charts";
import { Button } from "react-bootstrap";

function ChartRankingClientes() {
    const [desde, setDesde] = useState<string>(new Date().getFullYear()+ '-01-01');
    const [hasta, setHasta] = useState<string>(new Date().getFullYear()+ '-12-31');
    const [limite, setLimite] = useState<number>(5);
    const [ordenarPorPedidos, setOrdenarPorPedidos] = useState<boolean>(true);
    const [datos, setDatos] = useState<any[]>([]);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const handleDescargarExcel = () => {
        pedidoService.getExcelRankingClientes(limite, sucursalSeleccionada.id, desde, hasta, ordenarPorPedidos)
    }

    useEffect(() => {
        if (sucursalSeleccionada) {
            pedidoService.getRankingClientes(limite, sucursalSeleccionada.id, desde, hasta, ordenarPorPedidos)
                .then(data => setDatos(data))
                .catch(error => console.error("Error fetching movimientos monetarios:", error));
        }
    }, [sucursalSeleccionada, ordenarPorPedidos, limite, desde, hasta]);

    const handleChangeLimite = (e: ChangeEvent<HTMLSelectElement>) => {
        setLimite(Number(e.target.value));
    }

    const handleChangeOrdenarPor = (e: ChangeEvent<HTMLSelectElement>) => {
        setOrdenarPorPedidos(e.target.value === "1");
    }

    const handleDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDesde(e.target.value);
    }

    const handleHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasta(e.target.value);
    }

    return (
        <div className="col contenido mt-3 h-75 d-grid justify-content-center">
            <div className="d-flex">
                <label className="me-2 my-auto">Mostrar: </label>
                <select className="form-select short" onChange={handleChangeLimite}>
                    <option value="5">Top 5</option>
                    <option value="10">Top 10</option>
                    <option value="15">Top 15</option>
                </select>
                <label className="ms-4 me-2 my-auto">Ordenar por: </label>
                <select className="form-select short" onChange={handleChangeOrdenarPor}>
                    <option value="1">Pedidos</option>
                    <option value="2">Total</option>
                </select>
                <label className="ms-4 me-2 my-auto">Desde: </label>
                <input className="date-input" type="date" value={desde} onChange={handleDesdeChange} />
                <label className="ms-4 me-2 my-auto">Hasta: </label>
                <input className="date-input" type="date" value={hasta} onChange={handleHastaChange} />
            </div>
            <div className="chart-container">
                <BarChart
                    yAxis={[{
                        scaleType: 'band',
                        data: datos.map(dato => dato[0])
                    }]}
                    series={[
                        { data: datos.map(dato => dato[2]), label: 'Pedidos' }, 
                        { data: datos.map(dato => dato[3] / 1000), label: 'Total (k)' }
                    ]}
                    height={300}
                    layout="horizontal"
                    xAxis={[{
                        valueFormatter: (value) => `${value}k`,  // Formatea los valores del eje X
                    }]}
                    margin={{ left: 150, right: 10, top: 50, bottom: 30 }}
                    />
            </div>

            <Button className="ms-auto mt-4 col-2 btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</Button>
        </div>
    );
}

export default ChartRankingClientes;
