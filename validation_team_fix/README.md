# Validación de la sección Equipo

Se corrigió el efecto de fotos apiladas reemplazando el carrusel con vista parcial por una sola persona completa por slide.

Pruebas realizadas:
- 390×844: primera y segunda persona.
- 320×568: composición compacta.
- 844×390: composición horizontal.
- Botón siguiente: índice 0 → 1.
- Overflow horizontal del documento: 0 px.
- Errores JavaScript del componente: ninguno.

Las capturas aíslan la capa DOM modificada. El bundle Three.js no fue alterado en esta pasada.
