# Validación mobile premium

Validación realizada con Chromium en modo gráfico mediante Playwright y WebGL/SwiftShader activo.

## Matriz visual

- 320×568: inicio, transición, equipo y servicios.
- 390×844: inicio, transición, equipo y servicios.
- 430×932: inicio, transición, equipo y servicios.
- 844×390: inicio, transición, equipo y servicios en horizontal.
- 1440×900: regresión de las escenas desktop blanca y oscura.

## Interacciones verificadas

- Swipe vertical real desde la escena blanca hasta la escena oscura: progreso 0 → 1.
- Swipe vertical inverso: progreso 1 → 0.
- Apertura de “Qué hacemos” mediante click real.
- Cierre de servicios y regreso al equipo.
- Carruseles horizontales de equipo y servicios con overflow interno.

## Resultado técnico

- Sin overflow horizontal o vertical del documento en las resoluciones probadas.
- Sin excepciones JavaScript durante las pruebas.
- Canvas WebGL con el mismo tamaño que el viewport.
- Desktop mantiene la composición original.
