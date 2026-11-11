import { useState } from "react";
import RepuestoItem from "./RepuestoItem";

export default function RepuestoList({ repuestos, cargando, onEditar, onEliminar }) {
  const [busqueda, setBusqueda] = useState("");

  const texto = busqueda.trim().toLowerCase();
  const filtrados = repuestos.filter(
    (r) =>
      r.codigo.toLowerCase().includes(texto) ||
      r.nombre.toLowerCase().includes(texto) ||
      r.categoria.toLowerCase().includes(texto)
  );

  return (
    <section className="tarjeta">
      <div className="cabecera-lista">
        <h2>Listado de repuestos</h2>
        <input
          type="search"
          placeholder="Buscar por código, nombre o categoría"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <p className="vacio">Cargando inventario...</p>
      ) : filtrados.length === 0 ? (
        <p className="vacio">
          {repuestos.length === 0
            ? "Aún no hay repuestos registrados."
            : "Ningún repuesto coincide con la búsqueda."}
        </p>
      ) : (
        <div className="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th className="num">Stock</th>
                <th className="num">Crítico</th>
                <th className="num">Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((r) => (
                <RepuestoItem key={r.id} repuesto={r} onEditar={onEditar} onEliminar={onEliminar} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
