import { esCritico, formatearPrecio } from "../utils";

export default function RepuestoItem({ repuesto, onEditar, onEliminar }) {
  const critico = esCritico(repuesto);

  return (
    <tr className={critico ? "fila-critica" : ""}>
      <td>{repuesto.codigo}</td>
      <td>{repuesto.nombre}</td>
      <td>{repuesto.categoria}</td>
      <td className="num">
        {repuesto.stock}
        {critico && <span className="etiqueta">Crítico</span>}
      </td>
      <td className="num">{repuesto.stockCritico}</td>
      <td className="num">{formatearPrecio(repuesto.precio)}</td>
      <td className="acciones-fila">
        <button className="btn btn-pequeno" onClick={() => onEditar(repuesto)}>Editar</button>
        <button className="btn btn-pequeno btn-peligro" onClick={() => onEliminar(repuesto)}>Eliminar</button>
      </td>
    </tr>
  );
}
