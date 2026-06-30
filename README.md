NEXO landing — equipo pulido

Cambios de esta pasada:
- separé más la X del bloque de texto en vista clara y oscura;
- suavicé la transición de escena y reduje la agresividad del movimiento;
- aumenté apenas la sensibilidad del scroll;
- rehice el efecto del mouse en claro para que sea eléctrico azul y más procedural;
- corregí la composición del bloque de equipo para que los botones no queden sobre las cabezas;
- mejoré el layout mobile del estado oscuro;
- atenué y limpié los bordes blancos de los retratos.

Archivos principales:
- index.html
- bundle.js
- assets/
- src/
- validation/

Validación incluida:
- validation/desktop-light-pulido.png
- validation/desktop-dark-pulido.png
- validation/mobile-dark-pulido.png
- validation/state-dark.json
- validation/state-mobile.json

Última corrección — equipo sin fondo:
- retratos transparentes reales sobre el fondo oscuro;
- limpieza del halo blanco en los bordes;
- composición abierta con líneas finas, sin cards blancas ni fondos rectangulares;
- escala y alineación ajustadas para que los tres retratos tengan presencia equivalente;
- mobile convertido en carrusel horizontal con snap y sin overflow de página;
- validación Playwright en 1440×1000, 1366×768 y 390×844 dentro de `validation_final/`.

## Correcciones de interacción
- El efecto de partículas y conexión con el mouse permanece activo en la escena oscura.
- La red conserva visibilidad en ambas escenas.
- “Qué hacemos” abre una vista interna de servicios.
- “Volver al equipo” regresa al equipo y “Volver” continúa regresando al inicio.
