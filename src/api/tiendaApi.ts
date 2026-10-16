import type { Producto } from "../datos";
import { api } from "./cliente";

interface Sobre<T> {
  data: T;
  meta: { ruta: string; duracionMs: number; timestamp: string };
}

export interface NuevoPedido {
  correo: string;
  telefono: string;
  productos: string[];
}

export interface PedidoConfirmado {
  folio: string;
  total: number;
}

// Pide los productos y saca la lista del sobre { data, meta }
export async function obtenerProductos(signal?: AbortSignal): Promise<Producto[]> {
  const respuesta = await api.get<Sobre<Producto[]>>("/productos", { signal });
  return respuesta.data.data;
}

export async function crearPedido(pedido: NuevoPedido): Promise<PedidoConfirmado> {
  const respuesta = await api.post<Sobre<PedidoConfirmado>>("/pedidos", pedido);
  return respuesta.data.data;
}