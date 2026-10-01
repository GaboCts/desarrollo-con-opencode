# Spec 001 — Mapa de Calor de Estudio

## Contexto y objetivo

El Diario de Estudio registra sesiones de estudio con fecha, tema y minutos. Actualmente muestra métricas agregadas (racha, minutos semanales, días mensuales) pero no ofrece una visión histórica visual del hábito.

**Objetivo**: mostrar un mapa de calor tipo GitHub que permita ver de un vistazo los días estudiados de las últimas 12 semanas, con intensidad de color proporcional a los minutos estudiados.

## Usuarios

- **Estudiante autodidacta** que registra sus sesiones de estudio y quiere visualizar su constancia.

## Historias de usuario

- Como estudiante, quiero ver un mapa de calor de mis últimas 12 semanas para identificar patrones de estudio.
- Como estudiante, quiero ver la intensidad del color según los minutos estudiados para saber qué días fueron más productivos.
- Como estudiante, quiero hacer clic en un día para ver el detalle de minutos y temas estudiados.

## Requisitos funcionales

### RF-1: Visualización del mapa de calor
- **EARS**: El sistema DEBE mostrar un mapa de calor con las últimas 12 semanas (84 días).
- **EARS**: El sistema DEBE mostrar los días en una cuadrícula de 7 filas (días de la semana) × 12 columnas (semanas).
- **EARS**: El sistema DEBE mostrar los días sin estudio en gris claro.

### RF-2: Escala de color por niveles
- **EARS**: El sistema DEBE usar los siguientes niveles de color según minutos estudiados:
  - 0 min: gris claro
  - 1-30 min: verde claro
  - 31-60 min: verde medio
  - 61-120 min: verde oscuro
  - 121+ min: verde intenso

### RF-3: Tooltip de detalle
- **EARS**: El sistema DEBE mostrar un tooltip al hacer clic en un día con:
  - Fecha en formato legible (ej: "5 de octubre de 2026")
  - Minutos totales estudiados ese día
  - Lista de temas estudiados (si hay varios)

### RF-4: Etiquetas de días de la semana
- **EARS**: El sistema DEBE mostrar etiquetas para los días de la semana (L, X, J, V, S, D) en el eje vertical.

### RF-5: Etiquetas de meses
- **EARS**: El sistema DEBE mostrar etiquetas de mes en el eje horizontal cuando cambia el mes.

## Requisitos no funcionales

- El mapa de calor DEBE ser responsive y verse bien en móvil (375px).
- El mapa de calor DEBE respetar las reglas de fechas locales (nunca UTC).
- El mapa de calor DEBE funcionar sin servidor ni dependencias externas.

## Casos límite

- **Sin sesiones**: mostrar todos los días en gris claro.
- **Múltiples sesiones el mismo día**: sumar minutos y mostrar todos los temas en el tooltip.
- **Días futuros**: no mostrar (o mostrar en gris muy claro).
- **Cambio de hora**: los días deben calcularse en hora local.

## Fuera de alcance

- Edición de sesiones desde el mapa de calor.
- Filtros por tema o rango de fechas personalizado.
- Exportación del mapa de calor como imagen.
- Comparación entre períodos.

## Criterios de finalización

- El mapa de calor muestra las últimas 12 semanas correctamente.
- Los colores corresponden a los niveles definidos.
- El tooltip muestra fecha, minutos y temas al hacer clic.
- La vista móvil (375px) es legible y funcional.
- No hay errores en la consola.

## Dudas abiertas

- ~~¿Mostrar días futuros en gris muy claro o ocultarlos completamente?~~ **Decisión**: ocultarlos completamente.
- ~~¿Incluir un año completo (52 semanas) en lugar de 12?~~ **Decisión**: mantener 12 semanas (estándar de GitHub, buena perspectiva sin abrumar).
