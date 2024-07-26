import PedidoService from "../../servicios/PedidoService";
import { useEffect, useState } from "react";
import { useSucursales } from "../../hooks/useSucursales";
import { LineChart } from "@mui/x-charts";
import { Button } from "react-bootstrap";

function ChartMovimientosMonetarios() {
    const [desde, setDesde] = useState<string>(new Date().getFullYear() + '-01-01');
    const [hasta, setHasta] = useState<string>(new Date().getFullYear() + '-12-31');
    const [movimientos, setMovimientos] = useState<any[]>([]);
    const [esDiario, setEsDiario] = useState<boolean>(true);
    const { sucursalSeleccionada } = useSucursales();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/api/pedidos");

    useEffect(() => {
        if (sucursalSeleccionada) {
            pedidoService.getMovimientosMonetarios(sucursalSeleccionada.id, desde, hasta, esDiario)
                .then(data => setMovimientos(data))
                .catch(error => console.error("Error fetching movimientos monetarios:", error));
        }
    }, [sucursalSeleccionada, desde, hasta, esDiario]);

    const handleDescargarExcel = () => {
        pedidoService.getExcelMovimientosMonetarios(sucursalSeleccionada.id, desde, hasta, esDiario);
    }

    const handleChangeEsDiario = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEsDiario(e.target.value === "1");
    }

    const handleDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDesde(e.target.value);
    }

    const handleHastaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasta(e.target.value);
    }

    const filteredData = esDiario ? movimientos : movimientos;

    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    const xAxisData = filteredData.map(movimiento => esDiario ? new Date(movimiento[0]) : (`${meses[new Date(movimiento[0]).getMonth()]} ${new Date(movimiento[0]).getFullYear()}`));
    const ingresosData = filteredData.map(movimiento => movimiento[1]);
    const costosData = filteredData.map(movimiento => movimiento[2]);
    const gananciasData = filteredData.map(movimiento => movimiento[3]);

    return (
        <div className="contenido mt-3 h-75 d-grid justify-content-center">
            <div className="d-flex justify-content-center">
                <label className="ms-4 me-2 my-auto">Ordenar por: </label>
                <select className="form-select short" onChange={handleChangeEsDiario}>
                    <option value="1">Diario</option>
                    <option value="2">Mensual</option>
                </select>
                <label className="ms-4 me-2 my-auto">Desde: </label>
                <input className="date-input" type="date" value={desde} onChange={handleDesdeChange} />
                <label className="ms-4 me-2 my-auto">Hasta: </label>
                <input className="date-input" type="date" value={hasta} onChange={handleHastaChange} />
            </div>

            <div className="chart-container">
                <LineChart
                    xAxis={[{
                        scaleType: esDiario ? 'time' : 'band',
                        data: xAxisData,
                        valueFormatter: (value) => esDiario ? (`${new Date(value).getDate()} ${meses[new Date(value).getMonth()]} ${new Date(value).getFullYear()}`) : value
                    }]}
                    series={[
                        { data: ingresosData, label: 'Ingresos' },
                        { data: costosData, label: 'Costos' },
                        { data: gananciasData, label: 'Ganancias' },
                    ]}
                    height={300}
                    margin={{ left: 65, right: 10, top: 50, bottom: 30 }}
                    grid={{ vertical: true, horizontal: true }}
                />
            </div>

            <Button className="ms-auto mt-4 col-2 btn-secondary" onClick={handleDescargarExcel}>Exportar a Excel</Button>
        </div>
    );
}

export default ChartMovimientosMonetarios;
