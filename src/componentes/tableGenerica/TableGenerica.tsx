import * as React from 'react';
import { useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';
import { Column } from '../../types/Column';

interface TableGenericaProps<T> {
    rows: T[];
    columns: Column[];
    renderActions: (row: T) => React.ReactNode;
}

const TableGenerica = <T,>({ rows, columns, renderActions }: TableGenericaProps<T>) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div
        style={{
          backgroundColor: "#f0f0f0", // Fondo gris claro
          padding: "15px", // Espaciado interno
          borderRadius: "10px", // Bordes redondeados
          boxShadow: "5px 10px 2px rgba(0, 0, 0, 0.3)", // Sombra sutil
          margin: "5px 0", // Margen superior e inferior
        }}
      >
        <>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#a6c732' }}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, color:'#fff' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell style={{color:'#fff'}} align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{ backgroundColor: '#f0f0f0' }}>
                                {columns.map((column) => {
                                    const value = (row as any)[column.id];
                                    return (
                                        <TableCell key={column.id} align={column.align}>
                                            {column.format ? column.format(value) : value}
                                        </TableCell>
                                    );
                                })}
                                <TableCell align="center">
                                    {renderActions(row)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 71 * emptyRows, backgroundColor: '#f0f0f0' }}>
                                <TableCell colSpan={columns.length + 1} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
        </div>
    );
}

export default TableGenerica;
