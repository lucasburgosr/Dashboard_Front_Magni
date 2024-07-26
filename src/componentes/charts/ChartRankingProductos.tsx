import PedidoService from "../../servicios/PedidoService";
import { useEffect, useState } from "react";
import { useSucursales } from "../../hooks/useSucursales";
import { BarChart } from "@mui/x-charts";
import { Button } from "react-bootstrap";

function ChartRankingProductos() {
    const [desde, setDesde] = useState<string>(new Date().getFullYear()+ '-01-01');
    const [hasta, setHasta] = useState<string>(new Date().getFullYear()+ '-12-31');
    const [datos, setDatos] = useState<any[][]>([]);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    const handleDescargarExcel = () => {
        pedidoService.getExcelRankingProductos(sucursalSeleccionada.id, desde, hasta);
    }

    useEffect(() => {
        if (sucursalSeleccionada) {
            pedidoService.getRankingProductos(sucursalSeleccionada.id, desde, hasta)
                .then(data => {
                    // Calcular el total de pedidos
                    const totalPedidos = data.reduce((sum, producto) => sum + producto[1], 0);
                    // Calcular el porcentaje de cada producto
                    const datosPorcentajes = data.map(producto => [producto[0], (producto[1] / totalPedidos) * 100]);
                    setDatos(datosPorcentajes);
                })
                .catch(error => console.error("Error fetching ranking productos:", error));
        }
    }, [sucursalSeleccionada, desde, hasta]);

    const handleDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDesde(e.target.value);
    }

    const handleHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasta(e.target.value);
    }

    return (
        <div className="col contenido mt-3 h-75 d-grid justify-content-center">
            <div className="d-flex justify-content-center">
                <label className="ms-4 me-2 my-auto">Desde: </label>
                <input className="date-input" type="date" value={desde} onChange={handleDesdeChange} />
                <label className="ms-4 me-2 my-auto">Hasta: </label>
                <input className="date-input" type="date" value={hasta} onChange={handleHastaChange} />

            </div>

            <div className="chart-container productos">
                <BarChart
                    xAxis={[{valueFormatter:(value: number) => `${value.toFixed(2)}%`}]}
                    yAxis={[{ scaleType: 'band', data: datos.map(c => c[0]) }]}
                    series={[{ data: datos.map(c => c[1]), valueFormatter:(value: number|null) => `${value!.toFixed(2)}%` }]}
                    height={300}
                    layout="horizontal"
                    margin={{ left: 30, right: 10, top: 20, bottom: 30 }}
                    />
            </div>

            <Button className="ms-auto mt-4 col-2 btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</Button>
        </div>
    );
}

export default ChartRankingProductos;
