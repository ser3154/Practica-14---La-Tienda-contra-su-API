import { useState } from "react";
import { pesos, type Producto } from "./datos";
import { useProductos } from "./hooks/useProductos";
import type { PedidoConfirmado } from "./api/tiendaApi";
import Layout from "./Layout";
import Encabezado from "./Encabezado";
import PiePagina from "./PiePagina";
import Filtros, { type Filtro } from "./Filtros";
import Catalogo from "./Catalogo";
import { Cargando } from "./Cargando";
import { MensajeError } from "./MensajeError";
import FormularioPago from "./FormularioPago";

export default function App() {
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [pedido, setPedido] = useState<PedidoConfirmado | null>(null);

  const { productos, cargando, error, recargar } = useProductos();

  // Derivados
  const visibles =
    filtro === "todas"
      ? productos
      : productos.filter((p) => p.categoria === filtro);
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  const agregar = (producto: Producto) => {
    setPedido(null); // oculta la confirmación anterior
    setCarrito([...carrito, producto]);
  };

  // Pago exitoso: guarda el folio, vacía el carrito y vuelve a pedir los productos
  const alPagar = (confirmado: PedidoConfirmado) => {
    setPedido(confirmado);
    setCarrito([]);
    recargar();
  };

  let contenido;
  if (cargando) {
    contenido = <Cargando />;
  } else if (error) {
    contenido = <MensajeError mensaje={error} onReintentar={recargar} />;
  } else {
    contenido = <Catalogo productos={visibles} onAgregar={agregar} />;
  }

  return (
    <Layout
      encabezado={<Encabezado piezas={carrito.length} />}
      pie={<PiePagina piezas={carrito.length} total={total} />}
    >
      <Filtros activo={filtro} onCambiar={setFiltro} />
      {contenido}

      {pedido && (
        <p className="confirmacion">
          ¡Pedido confirmado! Folio: {pedido.folio} · Total: {pesos.format(pedido.total)}
        </p>
      )}

      {carrito.length > 0 && (
        <FormularioPago
          ids={carrito.map((p) => p.id)}
          total={total}
          onPagado={alPagar}
        />
      )}
    </Layout>
  );
}