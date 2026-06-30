# Validación mobile — NEXO

La adaptación conserva el diseño y la escena 3D original.

## Comportamiento comprobado

- inicio blanco a pantalla completa;
- X original renderizada por Three.js;
- gesto vertical que controla el progreso y giro 3D;
- transición de fondo claro a escena oscura;
- equipo en carrusel horizontal con `scroll-snap`;
- servicios dentro de la misma escena oscura;
- viewport bloqueado, sin scroll vertical ni overflow horizontal;
- adaptación específica para teléfonos en landscape;
- desktop preservado.

## Resoluciones comprobadas

- 320 × 568
- 360 × 640
- 390 × 844
- 430 × 932
- 844 × 390
- 1440 × 900 (regresión desktop)

Durante las pruebas no se registraron errores de JavaScript ni desbordamiento horizontal.
