import { useState } from "react";
import ChartMovimientosMonetarios from "../../componentes/charts/ChartMovimientosMonetarios";
import ChartRankingClientes from "../../componentes/charts/ChartRankingClientes";
import ChartRankingProductos from "../../componentes/charts/ChartRankingProductos";
import './estadisticas.css';
import { AppBar, Tab, Tabs } from "@mui/material";
import { styled } from '@mui/material/styles';

const CustomAppBar = styled(AppBar)({
    backgroundColor: '#ccdd91',
});

const CustomTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: '#5bbec0',
    },
});

const CustomTab = styled(Tab)({
    fontWeight: 'bold',
});

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
                <CustomAppBar position="static">
                    <CustomTabs
                    value={tab}
                    onChange={handleChangeTab}
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    >
                    <CustomTab label="Ranking Productos" {...a11yProps(0)} />
                    <CustomTab label="Ranking Clientes" {...a11yProps(1)} />
                    <CustomTab label="Movimientos Monetarios" {...a11yProps(2)} />
                    </CustomTabs>
                </CustomAppBar>
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
