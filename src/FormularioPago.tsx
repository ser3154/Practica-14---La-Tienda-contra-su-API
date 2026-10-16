import { useState, type FormEvent } from "react";
import { crearPedido, type PedidoConfirmado } from "./api/tiendaApi";
import { mensajeDeError } from "./api/cliente";
import { pesos } from "./datos";

interface FormularioPagoProps {
  ids: string[];      // ids de lo que hay en el carrito (repetidos = varias piezas)
  total: number;
  onPagado: (pedido: PedidoConfirmado) => void;
}

export default function FormularioPago({ ids, total, onPagado }: FormularioPagoProps) {
  // Formulario controlado: el valor de cada campo vive en el estado
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errorCorreo, setErrorCorreo] = useState("");
  const [errorTelefono, setErrorTelefono] = useState("");
  const [errorApi, setErrorApi] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que el navegador envíe el formulario y recargue la página

    const correoValido = correo.includes("@");
    const telefonoValido = /^\d{10}$/.test(telefono);

    setErrorCorreo(correoValido ? "" : "El correo debe tener @");
    setErrorTelefono(telefonoValido ? "" : "El teléfono debe tener 10 dígitos");
    setErrorApi("");
    if (!correoValido || !telefonoValido) return;

    setEnviando(true);
    try {
      const pedido = await crearPedido({ correo, telefono, productos: ids });
      onPagado(pedido);
    } catch (err) {
      setErrorApi(mensajeDeError(err)); // aquí aparece el 409
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="pago" onSubmit={enviar} noValidate>
      <h2>Pago simulado</h2>

      <label>
        Correo
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="tu@correo.com"
        />
      </label>
      {errorCorreo && <p className="pago__error">{errorCorreo}</p>}

      <label>
        Teléfono
        <input
          type="tel"
          inputMode="numeric"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="6441234567"
        />
      </label>
      {errorTelefono && <p className="pago__error">{errorTelefono}</p>}

      {errorApi && <p className="pago__error">{errorApi}</p>}

      <button type="submit" disabled={enviando}>
        {enviando ? "Procesando…" : `Pagar ${pesos.format(total)}`}
      </button>
    </form>
  );
}