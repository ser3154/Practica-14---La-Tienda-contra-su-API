import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

// Convierte cualquier error en un texto para mostrar en pantalla.
export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const mensaje = error.response.data?.message;
      if (Array.isArray(mensaje)) return mensaje.join(". "); // 400: llega un arreglo
      if (typeof mensaje === "string") return mensaje;       // 404 / 409
      return `La API respondió con el error ${error.response.status}`;
    }
    if (error.code === "ECONNABORTED") return "La API tardó demasiado en responder";
    return "No se pudo conectar con la API. ¿Está encendida?";
  }
  return "Ocurrió un error inesperado";
}