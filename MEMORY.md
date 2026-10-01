# Memoria del Proyecto - Diario de Estudio

## Estado actual
- Versión 1.2: Añadido el **Total de Minutos de la Semana** (Lunes a Domingo) en una tarjeta resumen dedicada.
- Versión 1.1: Añadida la **Mejor Racha** 🏆 junto a la racha actual 🔥.
- Estructura basada en 3 archivos (`index.html`, `styles.css`, `app.js`).
- Persistencia mediante `localStorage` (`diario_estudio_sesiones`).

## Decisiones importantes
- **Cálculo de minutos semanales:** Se calcula el rango de la semana actual tomando como inicio el Lunes y fin el Domingo en hora local. Se filtran y suman los minutos de las sesiones cuyas fechas caen dentro de este rango.
- **Cálculo de la mejor racha:** Fechas únicas de sesiones ordenadas cronológicamente evaluando secuencias consecutivas con `addDays`.
- **Ubicación visual:** Las métricas de racha y el resumen semanal se presentan en tarjetas superiores dedicadas y limpias.

## Errores a evitar
- Nunca usar UTC ni `toISOString()` para manipular o comparar fechas. Trabajar siempre con cadenas `YYYY-MM-DD` en hora local.
