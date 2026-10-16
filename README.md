1. ¿Porqué en la pestaña Red sale dos peticiones al cargar?
   Porque la app está dentro de <StrictMode> (main.tsx). En desarrollo, StrictMode monta el
   componente, ejecuta la limpieza del efecto y lo vuelve a montar, para comprobar que el efecto
   se limpia bien. Por eso el efecto corre dos veces y se hacen dos GET /productos (la primera
   aparece como "canceled" por el AbortController). En producción (build) solo sale una.

2. ¿Qué pasa si quitas el arreglo de dependencias del efecto?
   Sin arreglo, el efecto se ejecuta después de CADA render. Como el efecto hace setState
   (setProductos, setCargando), eso provoca otro render, que ejecuta otra vez el efecto, y así
   sin parar: un ciclo infinito de peticiones. En la pestaña Red se ven cientos de GET
   /productos seguidos.

3. ¿Qué hace e.preventDefault() y qué pasa si lo quitas?
   Cancela el comportamiento por defecto del navegador al enviar un formulario, que es mandar
   una petición y recargar la página. Si lo quito, la página se recarga, la URL cambia (se
   agrega "?") y se pierde todo el estado de React (el carrito, lo escrito en los campos), y
   la petición de Axios se interrumpe antes de mostrar el folio o el error.


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
