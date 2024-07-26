import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import Pedido from "../../entidades/Pedido";
import { Fragment, useState } from "react";
import { Button } from "react-bootstrap";
import { format } from "date-fns";

export default function CajaPedidos ({pedidos, handleOpenModal} : {pedidos:Pedido[], handleOpenModal:(pedido:Pedido) => void}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    function Row(props: { row: Pedido }) {
        const { row } = props;
        return (
            <Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell align="center">{("0000" + row.id).slice(-5)}</TableCell>
                    <TableCell align="center">{format(row.fechaPedido, "HH:mm")}</TableCell>
                    <TableCell align="center">{row.tipoEnvio}</TableCell>
                    <TableCell align="center">{row.formaPago}</TableCell>
                    <TableCell align="center"><Button onClick={() => (handleOpenModal(row))}>Pedido</Button></TableCell>
                </TableRow>
            </Fragment>
        );
    }
    
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, pedidos.length - page * rowsPerPage);

    return (
        <div>
          <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                  <TableHead>
                      <TableRow>
                          <TableCell align="center">N°Pedido</TableCell>
                          <TableCell align="center">Hora</TableCell>
                          <TableCell align="center">Entrega</TableCell>
                          <TableCell align="center">Pago</TableCell>
                          <TableCell align="center">Controlar</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {pedidos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                          <Row key={row.id} row={row} />
                      ))}
                      {emptyRows > 0 && (
                          Array.from({ length: emptyRows }).map((_, index) => (
                              <TableRow key={`empty-${index}`} style={{ height: 71 }}>
                                  <TableCell colSpan={5} />
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={pedidos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
    );
}