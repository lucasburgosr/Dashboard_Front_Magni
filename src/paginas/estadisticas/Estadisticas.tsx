import { useState } from "react";
import ChartMovimientosMonetarios from "../../componentes/charts/ChartMovimientosMonetarios";
import ChartRankingClientes from "../../componentes/charts/ChartRankingClientes";
import ChartRankingProductos from "../../componentes/charts/ChartRankingProductos";
import './estadisticas.css';
import { AppBar, Tab, Tabs } from "@mui/material";

function Estadisticas() {
    const [tab, setTab] = useState<number>(0);

    const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }

    function a11yProps(index: number) {
      return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
      };
    }
    
    return (
        <div className="m-3">
            <div className="narrow-80">
                <AppBar position="static">
                    <Tabs
                    value={tab}
                    onChange={handleChangeTab}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    >
                    <Tab label="Ranking Productos" {...a11yProps(0)} />
                    <Tab label="Ranking Clientes" {...a11yProps(1)} />
                    <Tab label="Movimientos Monetarios" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <div className="contenido h-75 d-grid justify-content-center">
                    { tab === 0 
                        ? <ChartRankingProductos />
                        : tab === 1 
                            ? <ChartRankingClientes />
                            : <ChartMovimientosMonetarios />
                    }
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;
