import { useEffect, useState } from "react";
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  useGridApiRef,
} from "@mui/x-data-grid";
import ArticuloInsumo from "../../entidades/ArticuloInsumo";
import ArticuloInsumoService from "../../servicios/ArticuloInsumoService";
import ArticuloManufacturadoDetalle from "../../entidades/ArticuloManufacturadoDetalle";
import Categoria from "../../entidades/Categoria";

function ModalDetallesManufacturado({
  detallesPrevios,
  onDetallesChange,
  handleCloseModal,
}: {
  detallesPrevios: ArticuloManufacturadoDetalle[];
  onDetallesChange: (nuevosDetalles: ArticuloManufacturadoDetalle[]) => void;
  handleCloseModal: () => void;
}) {
  const [insumos, setInsumos] = useState<ArticuloInsumo[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const apiRef = useGridApiRef();const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'denominacion',
      headerName: 'Nombre',
      flex: 1,
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      headerAlign: 'right',
      align: 'right',
      flex: 1,
      editable: true,
      renderCell: (params) => (
        <div>
          <span>{params.row.cantidad}</span>
          <span style={{ marginLeft: '4px', fontSize: '0.75rem', color: '#6b6b6b' }}>{params.row.unidadMedida.denominacion}</span>
        </div>
      ),
      valueGetter: (_value, row) => `${row.cantidad} ${row.unidadMedida.denominacion}`,
    },
  ] as GridColDef<(typeof rows)[number]>[];  

  const columnsViewonly: GridColDef<typeof rows[number]>[] = [
    {
      field: "denominacion",
      headerName: "Nombre",
      flex: 1,
    },
    {
      field: "precioCompra",
      headerName: "Precio de Compra",
      headerAlign: "center",
      align: "center",
      valueGetter: (_value: any, row: { precioCompra: number }) =>
        `$${row.precioCompra.toLocaleString("es-AR") || ""}`,
      flex: 1,
    },
    {
      field: "precioVenta",
      headerName: "Precio de Venta",
      headerAlign: "center",
      align: "center",
      valueGetter: (_value: any, row: { precioVenta: number }) =>
        `$${row.precioVenta.toLocaleString("es-AR") || ""}`,
      flex: 1,
    },
    {
      field: "categoria",
      headerName: "Categoría",
      headerAlign: "right",
      align: "right",
      valueGetter: (_value: any, row: { categoria: Categoria }) =>
        `${row.categoria.denominacion || ""}`,
      flex: 1,
    },
  ];

  const urlapi = import.meta.env.VITE_API_URL;
  const articuloInsumoService = new ArticuloInsumoService(urlapi + "/api/insumos");

  const getInsumosRest = async () => {
    const datos: ArticuloInsumo[] = (await articuloInsumoService.buscarXDenominacion(busqueda))
      .filter(
      (articulo) =>
        !detallesPrevios.some(
          (detalle) => detalle.articuloInsumo.id === articulo.id
        )
    ).sort((a,b) => a.denominacion < b.denominacion ? -1 : 1);
    setInsumos(datos.filter((insumo) => insumo.esParaElaborar));
  };

  const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
    if (selectionModel.length > selectedRows.length) {
      const rowId = selectionModel[selectionModel.length - 1];
      if (apiRef.current) {
        apiRef.current.setCellFocus(rowId, "cantidad");
      }
    }
    setSelectedRows(selectionModel);
  };

  const handleButtonClick = () => {
    const nuevosDetalles: ArticuloManufacturadoDetalle[] = [];
    rows.forEach((insumo) => {
      const detalle: ArticuloManufacturadoDetalle =
        new ArticuloManufacturadoDetalle();
      insumo.type = "insumo";
      detalle.articuloInsumo = insumo;
      detalle.cantidad =
        rows.find((fila) => fila.id === insumo.id).cantidad || 1;
      nuevosDetalles.push(detalle);
    });
    onDetallesChange(nuevosDetalles);
    handleCloseModal();
  };

  const handleBusqueda = () => {
    const nuevasSelecciones = rows.filter((row) =>
      selectedRows.includes(row.id)
    );
    if (nuevasSelecciones.length) {
      detallesPrevios.push(
        ...nuevasSelecciones.map((seleccion) => ({
          cantidad: 0,
          id: 0,
          articuloInsumo: { ...seleccion },
        }))
      );
      setSelectedRows([]);
    }
    getInsumosRest();
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    newRow.cantidad = parseFloat((newRow.cantidad as string).replace(',', '.'));

    if (newRow.cantidad.toString().length === 0) {
      alert("La cantidad tiene que ser un valor numérico válido.");
      return oldRow;
    }
    if (newRow.cantidad <= 0) {
      alert("No se puede ingresar una cantidad menor a 0.");
      return oldRow;
    }
    if (newRow.cantidad >= 1000000) {
      alert("La cantidad es demasiado grande. Limítese a 6 cifras");
      return oldRow;
    }
    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
    setRows(updatedRows);
    return newRow;
  };

  useEffect(() => {
    getInsumosRest();
  }, []);

  useEffect(() => {
    setRows([
      ...insumos.filter((row) => selectedRows.includes(row.id)).map(insumo => {return {...insumo, cantidad:((rows.find(row => row.id === insumo.id) ?? {cantidad:1}).cantidad)}}),
      ...detallesPrevios.map((detalle) => ({
        ...detalle.articuloInsumo,
        cantidad: detalle.cantidad,
      })),
    ]);
  }, [selectedRows]);

  return (
    <div>
      <div className="mb-3">
        <div className="row">
          <div className="col-12 col-xl-8">
            <div className="d-flex justify-content-between">
              <h5 className="my-auto">Agregar insumos</h5>
              <div className="col-8">
                <div className="search mb-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="fa fa-search"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por denominación"
                    onChange={(e) => setBusqueda(String(e.target.value))}
                  />
                  <button className="btn btn-primary" onClick={handleBusqueda}>
                    Buscar
                  </button>
                </div>
              </div>
            </div>
            <div>
              {insumos.length ? (
                <DataGrid
                  rows={insumos}
                  columns={columnsViewonly}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5]}
                  checkboxSelection
                  onRowSelectionModelChange={handleSelectionChange}
                  rowSelectionModel={selectedRows}
                />
              ) : (
                <p className="mt-4 d-flex text-red">
                  No se encontraron insumos actualmente!
                </p>
              )}
            </div>
          </div>
          <div className="col-12 col-xl-4">
            <div className="d-flex mb-1" style={{height:'48px'}}>
              <h5 className='my-auto'>Modificar cantidad</h5>
            </div>
            <div>
              <DataGrid
                apiRef={apiRef}
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
                processRowUpdate={handleProcessRowUpdate}
              />
            </div>
          </div>
        </div>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-success" onClick={handleButtonClick}>Guardar</button>
        </div>
        
      </div>
      
      )
}

export default ModalDetallesManufacturado;