import { Chip } from "@mui/material";
import { Estados } from "../../entidades/enums/Estados";

export default function ChipEstado ({estado} : {estado:Estados}) {
    return <Chip 
            color={
                (estado === Estados.TERMINADO || estado === Estados.APROBADO || estado === Estados.FACTURADO) 
                    ? 'success' 
                : ((estado === Estados.PAGO_PENDIENTE || estado === Estados.PENDIENTE) 
                    ? 'warning' 
                    : 'error')} 
            variant="outlined" 
            label={estado} />
}