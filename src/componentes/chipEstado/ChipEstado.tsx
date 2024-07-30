
import { Chip } from "@mui/material";
import { Estados } from "../../entidades/enums/Estados";

export default function ChipEstado ({estado} : {estado:Estados}) {
    const getChipStyle = () => {
        switch (estado) {
            case Estados.TERMINADO:
            case Estados.APROBADO:
            case Estados.FACTURADO:
                return { 
                    color: '#fff', 
                    backgroundColor: '#a6c732' 
                };
            case Estados.PAGO_PENDIENTE:
            case Estados.PENDIENTE:
                return { 
                    color: '#fff', 
                    backgroundColor: '#5bbec0' 
                };
            default:
                return { 
                    color: '#fff', 
                    backgroundColor: '#e2504c' 
                };
        }
    };

    return (
        <Chip 
            sx={{
                ...getChipStyle(),
                fontWeight: 'bold',
                fontSize: '1rem',
                borderRadius: '4px'  // Hace que los chips sean cuadrados
            }} 
            variant="filled" 
            label={estado} 
        />
    );
}
