import { useEffect, useState } from "react";
import Categoria from "../../entidades/Categoria";
import CategoriaService from "../../servicios/CategoriaService";
import { useAtributos } from "../../hooks/useAtributos";
import "./categorias.css";
import { useSucursales } from "../../hooks/useSucursales";
import { Button } from "@mui/material";

function CategoriasForm() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [txtDenominacionNueva, setTxtDenominacionNueva] = useState<string>("");
  const [txtValidacion, setTxtValidacion] = useState<string>("");
  const { sucursales, sucursalSeleccionada } = useSucursales();

  const urlapi = import.meta.env.VITE_API_URL;
  const categoriaService = new CategoriaService(urlapi + "/api/categorias");

  const getCategoriasRest = async () => {
    const nuevasCategorias: Categoria[] = await categoriaService.getAll();

    // Filtramos las categorías que no tienen una categoría padre
    const categoriasPrincipales = nuevasCategorias.filter((categoria) => {
      // Si ninguna categoría la tiene como subcategoría, entonces es una categoría principal
      return !nuevasCategorias.some((cat) =>
        cat.subCategorias.some((sub) => sub.id === categoria.id)
      );
    });

    setCategorias(categoriasPrincipales);
  };

  const changeSucursalSubcategoria = (
    categoria: Categoria,
    eliminar: boolean
  ) => {
    categoria.subCategorias.forEach((subcategoria) =>
      changeSucursalSubcategoria(subcategoria, eliminar)
    );
    categoria.sucursales = eliminar
      ? categoria.sucursales?.filter((s) => s.id !== sucursalSeleccionada.id) ||
        []
      : [...(categoria.sucursales || []), sucursalSeleccionada];
  };

  const changeSucursalPadres = async (
    categoria: Categoria,
    eliminar: boolean
  ) => {
    const categoriaPadre = categorias.find((c) =>
      c.subCategorias.some((sub) => sub.id === categoria.id)
    );

    if (eliminar || !categoriaPadre) {
      await actualizarCategoria(categoria);
      return;
    }

    categoriaPadre.sucursales = [
      ...(categoriaPadre.sucursales?.filter(
        (s) => s.id !== sucursalSeleccionada.id
      ) || []),
      sucursalSeleccionada,
    ];

    categoriaPadre.subCategorias = [
      ...categoriaPadre.subCategorias.filter((sub) => sub.id !== categoria.id),
      categoria,
    ];

    await changeSucursalPadres(categoriaPadre, eliminar);
  };

  const actualizarCategoria = async (categoria: Categoria) => {
    await categoriaService.put(categoria.id, categoria);
    await getCategoriasRest();
  };

  const handleEliminarEnSucursal = async (categoria: Categoria) => {
    const eliminar =
      categoria.sucursales?.some((s) => s.id === sucursalSeleccionada.id) ||
      false;
    changeSucursalSubcategoria(categoria, eliminar);
    await changeSucursalPadres(categoria, eliminar);
    await getCategoriasRest();
  };

  const mostrarCategorias = (categoria: Categoria, padreId: number) => {
    const tieneHijos = categoria.subCategorias.length > 0;

    return (
      <div key={categoria.id} className="accordion-item">
        <h2
          className="accordion-header d-flex flex-row"
          id={"flush-heading" + categoria.id}
        >
          {tieneHijos ? (
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#flush-collapse" + categoria.id}
              aria-expanded="false"
              aria-controls={"flush-collapse" + categoria.id}
            >
              {" "}
              {categoria.denominacion}{" "}
            </button>
          ) : (
            <div className="accordion-button accordion-no-arrow collapsed">
              {" "}
              {categoria.denominacion}{" "}
            </div>
          )}

          <Button
            onClick={() => mostrarInput(categoria.id)}
            sx={{
              bgcolor: "#a6c732",
              "&:hover": {
                bgcolor: "#a0b750",
              },
              my: 3,
              mx: 1,
              width: "auto",
              maxWidth: 200,
            }}
            variant="contained"
          >
            Crear Subcategoría
          </Button>

          <Button
            onClick={() => handleEliminarEnSucursal(categoria)}
            sx={{
              bgcolor: "#e05151",
              "&:hover": {
                bgcolor: "#db3939",
              },
              my: 3,
              mx: 1,
              width: "auto",
              maxWidth: 200,
            }}
            variant="contained"
          >
            Eliminar
          </Button>
        </h2>

        <h2
          className="accordion-header input-categoria"
          id={"inputCategoria" + categoria.id}
          hidden
        >
          <div className="d-flex flex-row">
            <div className="accordion-button accordion-no-arrow collapsed">
              <input
                type="text"
                className="form-control"
                placeholder="Nombre de la subcategoría"
                value={txtDenominacionNueva}
                onChange={(e) =>
                  setTxtDenominacionNueva(String(e.target.value))
                }
              ></input>
            </div>
            <Button
              onClick={() => save(categoria.id)}
              sx={{
                bgcolor: "#a6c732",
                "&:hover": {
                  bgcolor: "#a0b750",
                },
                my: 3,
                mx: 1,
                width: "auto",
                maxWidth: 200,
              }}
              variant="contained"
            >
              Crear
            </Button>
          </div>
        </h2>

        {tieneHijos && (
          <div
            id={"flush-collapse" + categoria.id}
            className="accordion-collapse collapse"
            aria-labelledby={"flush-heading" + categoria.id}
            data-bs-parent={"#accordionFlush" + padreId}
          >
            <div className="accordion-body">
              {categoria.subCategorias
                .sort((a, b) => a.denominacion.localeCompare(b.denominacion))
                .map((subcategoria) =>
                  mostrarCategorias(subcategoria, categoria.id)
                )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const mostrarInput = (categoriaPadreId?: number) => {
    const inputs = document.getElementsByClassName("input-categoria");
    for (let i = 0; i < inputs.length; i++) {
      const slide = inputs[i] as HTMLElement;
      slide.setAttribute("hidden", "true");
    }
    setTxtDenominacionNueva(""); // Limpiar el texto del input

    if (categoriaPadreId !== undefined) {
      document
        .getElementById("inputCategoria" + categoriaPadreId)
        ?.removeAttribute("hidden");
    }
  };

  const save = async (categoriaPadreId: number | null) => {
    if (txtDenominacionNueva === "") {
      setTxtValidacion("Ingrese el nombre de la categoría");
      return;
    }

    const categoriaNueva: Categoria = new Categoria();
    categoriaNueva.denominacion = txtDenominacionNueva;

    if (categoriaPadreId) {
      const categoriaPadre: Categoria = categorias.find(
        (categoria) => categoria.id === categoriaPadreId
      )!;
      categoriaPadre.subCategorias.push(categoriaNueva);

      await categoriaService.put(categoriaPadreId, categoriaPadre);
    } else {
      categoriaNueva.sucursales = sucursales;
      await categoriaService.post(categoriaNueva);
    }

    setTxtValidacion("");
    mostrarInput();

    await getCategoriasRest();
  };

  useEffect(() => {
    getCategoriasRest();
  }, []);

  return (
    <>
      <div className="categoria-container">
        <div className="categoria-header">
          <div className="ms-3 mb-2 d-flex flex-row">
            <input
              type="text"
              className="form-control categoria-input"
              placeholder="Nombre de la categoría"
              value={txtDenominacionNueva}
              onChange={(e) => setTxtDenominacionNueva(String(e.target.value))}
            ></input>
            <Button
              onClick={() => save(null)}
              sx={{
                bgcolor: "#a6c732",
                "&:hover": {
                  bgcolor: "#a0b750",
                },
                my: 3,
                mx: 1,
                width: "auto",
                maxWidth: 200,
              }}
              variant="contained"
            >
              Crear Categoría
            </Button>
          </div>
        </div>
        <div id="accordionFlush" className="accordion">
          {categorias
            .sort((a, b) => a.denominacion.localeCompare(b.denominacion))
            .map((categoria) => mostrarCategorias(categoria, 0))}
        </div>
      </div>
      {txtValidacion && (
        <div className="alert alert-danger" role="alert">
          {txtValidacion}
        </div>
      )}
    </>
  );
}

export default CategoriasForm;
