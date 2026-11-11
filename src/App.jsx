import { useEffect, useState } from "react";
import RepuestoForm from "./components/RepuestoForm";
import RepuestoList from "./components/RepuestoList";
import ResumenInventario from "./components/ResumenInventario";
import {
  suscribirRepuestos,
  crearRepuesto,
  actualizarRepuesto,
  eliminarRepuesto,
} from "./services/repuestosService";

export default function App() {
  const [repuestos, setRepuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [repuestoEditando, setRepuestoEditando] = useState(null);

  // Al montar la app nos suscribimos a Firestore; al desmontar cancelamos la suscripción.
  useEffect(() => {
    const cancelar = suscribirRepuestos(
      (lista) => {
        setRepuestos(lista);
        setCargando(false);
        setError("");
      },
      (err) => {
        console.error(err);
        setError("No se pudo leer el inventario. Revisa tu conexión y la configuración de Firebase.");
        setCargando(false);
      }
    );
    return cancelar;
  }, []);

  // Guarda un repuesto nuevo o actualiza el que se está editando.
  // Lanza un Error con mensaje claro si algo no es válido (lo muestra el formulario).
  const handleGuardar = async (datos) => {
    const codigoRepetido = repuestos.some(
      (r) =>
        r.codigo.toLowerCase() === datos.codigo.toLowerCase() &&
        r.id !== repuestoEditando?.id
    );
    if (codigoRepetido) {
      throw new Error(`Ya existe un repuesto con el código "${datos.codigo}".`);
    }

    try {
      if (repuestoEditando) {
        await actualizarRepuesto(repuestoEditando.id, datos);
        setRepuestoEditando(null);
      } else {
        await crearRepuesto(datos);
      }
    } catch (err) {
      console.error(err);
      throw new Error("No se pudo guardar en Firebase. Inténtalo nuevamente.");
    }
  };

  const handleEliminar = async (repuesto) => {
    const confirmado = window.confirm(
      `¿Eliminar "${repuesto.nombre}" (${repuesto.codigo})? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    try {
      await eliminarRepuesto(repuesto.id);
      if (repuestoEditando?.id === repuesto.id) setRepuestoEditando(null);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el repuesto.");
    }
  };

  return (
    <div className="contenedor">
      <header className="encabezado">
        <h1>Inventario de repuestos</h1>
        <p>Taller mecánico · control de stock y reabastecimiento</p>
      </header>

      {error && <p className="mensaje mensaje-error">{error}</p>}

      <ResumenInventario repuestos={repuestos} />

      <main className="principal">
        <RepuestoForm
          repuestoEditando={repuestoEditando}
          onGuardar={handleGuardar}
          onCancelar={() => setRepuestoEditando(null)}
        />
        <RepuestoList
          repuestos={repuestos}
          cargando={cargando}
          onEditar={setRepuestoEditando}
          onEliminar={handleEliminar}
        />
      </main>
    </div>
  );
}
