# Memoria del Proyecto - Diario de Estudio

## Estado actual
- Versión 1.4: Añadido el **Mapa de Calor** de las últimas 12 semanas (estilo GitHub) con ventana emergente de detalle.
- Versión 1.3: Añadido el contador de **Días Estudiados este Mes** 📅 y reorganizado el layout de estadísticas en 3 columnas (Semana | Racha | Mes).
- Versión 1.2: Añadido el **Total de Minutos de la Semana** (Lunes a Domingo).
- Versión 1.1: Añadida la **Mejor Racha** 🏆 junto a la racha actual 🔥.
- Estructura basada en 3 archivos (`index.html`, `styles.css`, `app.js`) + `src/heat-map.js` (lógica pura del mapa).
- Persistencia mediante `localStorage` (`diario_estudio_sesiones`).

## Decisiones importantes
- **Mapa de calor**: 12 semanas (estándar GitHub), colores estilo GitHub (#ebedf0, #9be9a8, #40c463, #30a14e, #216e39).
- **Lógica pura**: Funciones del mapa en `src/heat-map.js` sin DOM ni localStorage, con `today` como parámetro.
- **Tests**: 25 tests con `node --test` que cubren todas las funciones puras.
- **Layout de estadísticas**: 3 columnas (Semana | Racha | Mes) en la tarjeta principal.
- **Cálculo de días del mes**: Se filtran las sesiones del mes actual (año y mes en hora local) y se cuentan las fechas únicas.
- **Cálculo de minutos semanales**: Rango de lunes a domingo en hora local, sumando minutos de sesiones en ese rango.
- **Cálculo de la mejor racha**: Fechas únicas ordenadas cronológicamente evaluando secuencias consecutivas con `addDays`.

## Errores a evitar
- Nunca usar UTC ni `toISOString()` para manipular o comparar fechas. Trabajar siempre con cadenas `YYYY-MM-DD` en hora local.
