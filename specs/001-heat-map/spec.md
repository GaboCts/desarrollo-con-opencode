# Spec 001 — Mapa de Calor de Estudio

## Contexto y objetivo

El Diario de Estudio registra sesiones de estudio con fecha, tema y minutos. Actualmente muestra métricas agregadas (racha, minutos semanales, días mensuales) pero no ofrece una visión histórica visual del hábito.

**Objetivo**: mostrar un mapa de calor tipo GitHub que permita ver de un vistazo los días estudiados de las últimas 12 semanas, con intensidad de color proporcional a los minutos estudiados.

## Usuarios

- **Estudiante autodidacta** que registra sesiones de estudio y quiere visualizar su constancia.

## Historias de usuario

- Como estudiante, quiero ver un mapa de calor de mis últimas 12 semanas para identificar patrones de estudio.
- Como estudiante, quiero ver la intensidad del color según los minutos estudiados para saber qué días fueron más productivos.
- Como estudiante, quiero hacer clic en un día para ver el detalle de minutos y temas estudiados.

## Requisitos funcionales

### RF-1: Visualización del mapa de calor
- **EARS**: El sistema DEBE mostrar un mapa de calor con las últimas 12 semanas, incluyendo la semana actual.
- **EARS**: El sistema DEBE mostrar los días en una cuadrícula de 7 filas (días de la semana) × 12 columnas (semanas).
- **EARS**: El sistema DEBE mostrar celdas de tamaño fijo 10px × 10px con un gap de 3px entre ellas.
- **EARS**: El sistema DEBE mostrar un borde de 1px sólido alrededor del mapa completo (días de la semana + cuadrícula).
- **EARS**: El sistema DEBE mostrar los días sin estudio en gris claro (#ebedf0).
- **EARS**: El sistema DEBE mostrar los días futuros de la semana actual en gris muy claro (#f6f8fa).
- **EARS**: El sistema DEBE ocultar completamente los días de semanas futuras.
- **EARS**: El sistema DEBE mostrar un título "Mapa de calor" sobre la cuadrícula.
- **EARS**: El sistema DEBE mostrar una leyenda "Menos" → "Más" con los 5 colores en la parte inferior.

### RF-2: Escala de color por niveles
- **EARS**: El sistema DEBE usar los siguientes niveles de color según minutos estudiados:
  - 0 min: #ebedf0 (gris claro)
  - 1-30 min: #9be9a8 (verde claro)
  - 31-60 min: #40c463 (verde medio)
  - 61-120 min: #30a14e (verde oscuro)
  - 121+ min: #216e39 (verde intenso)

### RF-3: Ventana emergente de detalle
- **EARS**: El sistema DEBE mostrar una ventana emergente al hacer clic en un día con:
  - Fecha en formato legible (ej: "5 de octubre de 2026")
  - Minutos totales estudiados ese día
  - Lista de temas estudiados (si hay varios)
- **EARS**: Si el día no tiene sesión, la ventana emergente DEBE mostrar "0 minutos" y "Sin temas".
- **EARS**: Si el día tiene más de 5 temas, la ventana emergente DEBE mostrar los primeros 5 y "+N más".
- **EARS**: El hover sobre una celda NO DEBE cambiar su tamaño ni alterar el layout.

### RF-4: Etiquetas de días de la semana
- **EARS**: El sistema DEBE mostrar etiquetas para los días de la semana (L, M, X, J, V, S, D) en el eje vertical, dentro del borde del mapa.

### RF-5: Etiquetas de meses
- **EARS**: El sistema DEBE mostrar etiquetas de mes en el eje horizontal cuando cambia el mes, usando abreviaturas en español (ej: "Oct", "Nov", "Dic").
- **EARS**: Una semana pertenece al mes en que comienza su lunes.

## Requisitos no funcionales

- El mapa de calor DEBE ser responsive y verse bien en móvil (375px).
- El mapa de calor DEBE respetar las reglas de fechas locales (nunca UTC).
- El mapa de calor DEBE funcionar sin servidor ni dependencias externas.
- El cálculo de días y colores DEBE ser una función pura, sin DOM ni localStorage, que reciba "hoy" como parámetro.
- El hover sobre una celda NO DEBE alterar el layout (sin `transform: scale()`).

## Casos límite

- **Sin sesiones**: mostrar todos los días en gris claro.
- **Múltiples sesiones el mismo día**: sumar minutos y mostrar todos los temas en la ventana emergente.
- **Días futuros**: los días futuros de la semana actual se muestran en gris muy claro; los días de semanas futuras se ocultan.
- **Cambio de hora**: los días deben calcularse en hora local.
- **Sesiones con fecha futura**: no mostrar en el mapa (solo se muestran fechas <= hoy).
- **Sesiones con minutos = 0 o negativos**: tratar como "sin estudio" (gris claro).
- **Sesiones con tema vacío**: mostrar "Sin tema" en la ventana emergente.
- **Primera semana incompleta**: mostrar solo las fechas que están dentro del período de 12 semanas.
- **Sesiones duplicadas**: sumar minutos normalmente (no hay deduplicación).

## Fuera de alcance

- Edición de sesiones desde el mapa de calor.
- Filtros por tema o rango de fechas personalizado.
- Exportación del mapa de calor como imagen.
- Comparación entre períodos.

## Criterios de finalización

- El mapa de calor muestra las últimas 12 semanas correctamente.
- Las celdas son de 10px × 10px con gap de 3px.
- El borde del mapa es visible y cubre días + cuadrícula.
- La leyenda "Menos" → "Más" es visible.
- Los colores corresponden a los niveles definidos.
- La ventana emergente muestra fecha, minutos y temas al hacer clic.
- El hover no altera el layout.
- La vista móvil (375px) es legible y funcional.
- No hay errores en la consola.
- La lógica del mapa de calor está cubierta por tests con `node --test`.

## Dudas abiertas

- ~~¿Mostrar días futuros en gris muy claro o ocultarlos completamente?~~ **Decisión**: días futuros de la semana actual en gris muy claro; días de semanas futuras ocultos.
- ~~¿Incluir un año completo (52 semanas) en lugar de 12?~~ **Decisión**: mantener 12 semanas (estándar de GitHub, buena perspectiva sin abrumar).
