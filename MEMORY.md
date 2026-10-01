# Memoria del Proyecto - Diario de Estudio

## Estado actual
- Versión 1.3: Añadido el contador de **Días Estudiados este Mes** 📅 y reorganizado el layout de estadísticas en 3 columnas (Semana | Racha | Mes).
- Versión 1.2: Añadido el **Total de Minutos de la Semana** (Lunes a Domingo).
- Versión 1.1: Añadida la **Mejor Racha** 🏆 junto a la racha actual 🔥.
- Estructura basada en 3 archivos (`index.html`, `styles.css`, `app.js`).
- Persistencia mediante `localStorage` (`diario_estudio_sesiones`).

## Decisiones importantes
- **Layout de estadísticas:** La tarjeta principal muestra 3 columnas: minutos de la semana (izquierda), racha actual (centro) y días del mes (derecha). En pantallas pequeñas se apilan verticalmente.
- **Cálculo de días del mes:** Se filtran las sesiones del mes actual (año y mes en hora local) y se cuentan las fechas únicas.
- **Cálculo de minutos semanales:** Rango de lunes a domingo en hora local, sumando minutos de sesiones en ese rango.
- **Cálculo de la mejor racha:** Fechas únicas ordenadas cronológicamente evaluando secuencias consecutivas con `addDays`.

## Errores a evitar
- Nunca usar UTC ni `toISOString()` para manipular o comparar fechas. Trabajar siempre con cadenas `YYYY-MM-DD` en hora local.
