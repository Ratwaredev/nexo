# NEXO — rediseño mobile

## Enfoque

La experiencia mobile se reconstruyó como una landing propia y continua. No es el layout desktop comprimido ni una sucesión de escenas que dependan de WebGL.

- tema oscuro y lenguaje visual consistente con NEXO;
- header fijo y menú mobile completo;
- hero compacto con la geometría WebGL original de la X;
- fallback estático obtenido del render original cuando WebGL no está disponible;
- equipo presentado en filas compactas, sin carrusel gigante;
- servicios en cards finas y legibles;
- bloque de beneficios y CTA final por WhatsApp;
- variante horizontal específica.

## Breakpoints validados

- 320 × 568
- 360 × 640
- 375 × 667
- 390 × 844
- 412 × 915
- 430 × 932
- 844 × 390 horizontal

La matriz terminó sin overflow horizontal, sin errores de consola del layout, con menú bloqueando correctamente el scroll y con anclas ubicadas 72 px debajo del header fijo.

## X original

No se reemplazó la geometría de la X. `bundle.js` conserva las tres piezas originales, materiales, luces y red procedural. En dispositivos compatibles se renderiza esa versión 3D. El PNG `assets/optimized/original-x-mobile.png` se usa únicamente como fallback si el navegador no puede crear un contexto WebGL.

## Desktop

La interfaz mobile se activa hasta 820 px, además de teléfonos en horizontal de hasta 960 × 540. En 1440 × 900 se verificó que la mobile permanece oculta y la interfaz desktop original sigue activa.
