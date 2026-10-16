// <MensajeError> — RECURSO: se copia del código base.
interface MensajeErrorProps {
  mensaje: string;
  onReintentar: () => void;
}

export function MensajeError({ mensaje, onReintentar }: MensajeErrorProps) {
  return (
    <div className="error">
      <p>{mensaje}</p>
      <button onClick={onReintentar}>Reintentar</button>
    </div>
  );
}
