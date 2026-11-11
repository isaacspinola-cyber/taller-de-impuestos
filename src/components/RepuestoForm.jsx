import { useEffect, useState } from "react";
import { CATEGORIAS } from "../utils";

const FORMULARIO_VACIO = {
  codigo: "",
  nombre: "",
  categoria: "",
  stock: "",
  stockCritico: "",
  precio: "",
};

export default function RepuestoForm({ repuestoEditando, onGuardar, onCancelar }) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // Cuando se selecciona un repuesto para editar, se cargan sus datos en el formulario.
  useEffect(() => {
    if (repuestoEditando) {
      setFormulario({
        codigo: repuestoEditando.codigo,
        nombre: repuestoEditando.nombre,
        categoria: repuestoEditando.categoria,
        stock: String(repuestoEditando.stock),
        stockCritico: String(repuestoEditando.stockCritico),
        precio: String(repuestoEditando.precio),
      });
    } else {
      setFormulario(FORMULARIO_VACIO);
    }
    setError("");
  }, [repuestoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  };

  const validar = () => {
    if (!formulario.codigo.trim()) return "El código de parte es obligatorio.";
    if (!formulario.nombre.trim()) return "El nombre es obligatorio.";
    if (!formulario.categoria) return "Selecciona una categoría.";
    const campos = [
      ["stock", "El stock"],
      ["stockCritico", "El stock crítico"],
      ["precio", "El precio"],
    ];
    for (const [campo, etiqueta] of campos) {
      const valor = formulario[campo];
      if (valor === "" || Number.isNaN(Number(valor)) || Number(valor) < 0) {
        return `${etiqueta} debe ser un número mayor o igual a 0.`;
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mensaje = validar();
    if (mensaje) {
      setError(mensaje);
      return;
    }

    setGuardando(true);
    setError("");
    try {
      await onGuardar({
        codigo: formulario.codigo.trim().toUpperCase(),
        nombre: formulario.nombre.trim(),
        categoria: formulario.categoria,
        stock: Number(formulario.stock),
        stockCritico: Number(formulario.stockCritico),
        precio: Number(formulario.precio),
      });
      if (!repuestoEditando) setFormulario(FORMULARIO_VACIO);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const editando = Boolean(repuestoEditando);

  return (
    <section className="tarjeta">
      <h2>{editando ? "Editar repuesto" : "Registrar repuesto"}</h2>

      <form onSubmit={handleSubmit} className="formulario" noValidate>
        <label>
          Código de parte
          <input name="codigo" value={formulario.codigo} onChange={handleChange} placeholder="Ej: FRE-001" />
        </label>

        <label>
          Nombre
          <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Ej: Pastillas de freno delanteras" />
        </label>

        <label>
          Categoría
          <select name="categoria" value={formulario.categoria} onChange={handleChange}>
            <option value="">Selecciona...</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <div className="fila">
          <label>
            Stock actual
            <input type="number" min="0" name="stock" value={formulario.stock} onChange={handleChange} />
          </label>
          <label>
            Stock crítico
            <input type="number" min="0" name="stockCritico" value={formulario.stockCritico} onChange={handleChange} />
          </label>
        </div>

        <label>
          Precio (CLP)
          <input type="number" min="0" name="precio" value={formulario.precio} onChange={handleChange} />
        </label>

        {error && <p className="mensaje mensaje-error">{error}</p>}

        <div className="acciones">
          <button type="submit" className="btn btn-primario" disabled={guardando}>
            {guardando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
          </button>
          {editando && (
            <button type="button" className="btn" onClick={onCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
