export const CATEGORIAS = [
  "Motor",
  "Frenos",
  "Suspensión",
  "Eléctrico",
  "Filtros",
  "Lubricantes",
  "Neumáticos",
  "Otros",
];

const formatoPesos = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export const formatearPrecio = (valor) => formatoPesos.format(valor);

// Un repuesto está en estado crítico si su stock actual es menor o igual al stock crítico.
export const esCritico = (repuesto) => repuesto.stock <= repuesto.stockCritico;
