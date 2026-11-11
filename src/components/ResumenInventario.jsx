import { useMemo } from "react";
import { esCritico, formatearPrecio } from "../utils";

export default function ResumenInventario({ repuestos }) {
  const resumen = useMemo(() => {
    const criticos = repuestos.filter(esCritico);
    return {
      totalRepuestos: repuestos.length,
      totalUnidades: repuestos.reduce((suma, r) => suma + r.stock, 0),
      valorInventario: repuestos.reduce((suma, r) => suma + r.stock * r.precio, 0),
      criticos,
    };
  }, [repuestos]);

  return (
    <section className="tarjeta">
      <h2>Resumen del inventario</h2>

      <div className="indicadores">
        <div className="indicador">
          <span className="indicador-valor">{resumen.totalRepuestos}</span>
          <span>Repuestos distintos</span>
        </div>
        <div className="indicador">
          <span className="indicador-valor">{resumen.totalUnidades}</span>
          <span>Unidades en stock</span>
        </div>
        <div className="indicador">
          <span className="indicador-valor">{formatearPrecio(resumen.valorInventario)}</span>
          <span>Valor del inventario</span>
        </div>
        <div className="indicador indicador-alerta">
          <span className="indicador-valor">{resumen.criticos.length}</span>
          <span>Por reabastecer</span>
        </div>
      </div>

      {resumen.criticos.length > 0 && (
        <div className="reabastecer">
          <h3>Repuestos a reabastecer</h3>
          <ul>
            {resumen.criticos.map((r) => (
              <li key={r.id}>
                <strong>{r.codigo}</strong> · {r.nombre} — stock {r.stock} (crítico: {r.stockCritico})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
