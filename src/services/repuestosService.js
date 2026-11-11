import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// Colección "repuestos": cada documento es un repuesto.
const repuestosRef = collection(db, "repuestos");

// READ: se suscribe a la colección y entrega la lista cada vez que cambia.
// Devuelve la función para cancelar la suscripción.
export function suscribirRepuestos(onData, onError) {
  const consulta = query(repuestosRef, orderBy("codigo"));
  return onSnapshot(
    consulta,
    (snapshot) => {
      const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(lista);
    },
    onError
  );
}

// CREATE
export function crearRepuesto(datos) {
  return addDoc(repuestosRef, { ...datos, creadoEn: serverTimestamp() });
}

// UPDATE
export function actualizarRepuesto(id, datos) {
  return updateDoc(doc(db, "repuestos", id), {
    ...datos,
    actualizadoEn: serverTimestamp(),
  });
}

// DELETE
export function eliminarRepuesto(id) {
  return deleteDoc(doc(db, "repuestos", id));
}
