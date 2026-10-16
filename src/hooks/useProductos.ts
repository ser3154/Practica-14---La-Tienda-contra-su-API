import { useEffect, useState } from "react";
import type { Producto } from "../datos";
import { mensajeDeError } from "../api/cliente";
import { obtenerProductos } from "../api/tiendaApi";

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    obtenerProductos(controlador.signal)
      .then((lista) => {
        if (controlador.signal.aborted) return;
        setProductos(lista);
        setCargando(false);
      })
      .catch((e) => {
        if (controlador.signal.aborted) return;
        setError(mensajeDeError(e));
        setCargando(false);
      });

    // Limpieza: si el efecto se vuelve a ejecutar, cancela la petición anterior
    return () => controlador.abort();
  }, [intento]); // ← el arreglo de dependencias

  // Sirve para "Reintentar" y para volver a pedir la existencia después de pagar
  const recargar = () => {
    setError(null);
    setCargando(true);
    setIntento((n) => n + 1);
  };

  return { productos, cargando, error, recargar };
}