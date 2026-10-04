# Tareas 001 — Mapa de Calor de Estudio

## Fase 1: Lógica pura (sin DOM)

### T1.1: Crear estructura de `src/heat-map.js`
- [ ] Crear archivo `src/heat-map.js` con exports de funciones
- [ ] Definir constantes de colores (`COLORS = { EMPTY: '#ebedf0', LEVEL_1: '#9be9a8', ... }`)
- **RF**: RF-2
- **Hecho cuando**: El archivo existe y exporta las funciones del plan.

### T1.2: Implementar `getHeatMapRange(today)`
- [ ] Calcular lunes de la semana actual
- [ ] Restar 11 semanas para obtener `startDate`
- [ ] Calcular domingo de la semana actual para `endDate`
- **RF**: RF-1
- **Hecho cuando**: `getHeatMapRange('2026-10-04')` devuelve `{ startDate: '2026-07-13', endDate: '2026-10-04' }`.

### T1.3: Implementar `buildHeatMapData(sessions, today)`
- [ ] Agrupar sesiones por fecha
- [ ] Sumar minutos del mismo día
- [ ] Recoger temas únicos por día
- [ ] Ignorar sesiones futuras y minutos <= 0
- **RF**: RF-1, RF-2, RF-3
- **Hecho cuando**: Dado `[{date:'2026-10-01',minutes:30,subject:'A'}, {date:'2026-10-01',minutes:20,subject:'B'}]`, devuelve minutos=50 y topics=['A','B'].

### T1.4: Implementar `getDayColor(minutes)`
- [ ] Devolver color según niveles: 0, 1-30, 31-60, 61-120, 121+
- **RF**: RF-2
- **Hecho cuando**: `getDayColor(0)` → `#ebedf0`, `getDayColor(45)` → `#40c463`, `getDayColor(150)` → `#216e39`.

### T1.5: Implementar `getWeeksInRange(startDate, endDate)`
- [ ] Generar 12 semanas con 7 días cada una
- [ ] Marcar días futuros (`isFuture`)
- [ ] Marcar días de la semana actual (`isCurrentWeek`)
- **RF**: RF-1
- **Hecho cuando**: Devuelve 12 semanas, cada una con 7 días, y los días futuros están marcados.

### T1.6: Implementar `getMonthLabels(weeks)`
- [ ] Detectar cambio de mes en el lunes de cada semana
- [ ] Devolver etiquetas con índice de columna
- **RF**: RF-5
- **Hecho cuando**: Semanas que cruzan meses generan etiqueta en la columna correcta.

---

## Fase 2: Tests

### T2.1: Crear `src/heat-map.test.js`
- [ ] Configurar tests con `node:test` y `assert`
- [ ] Importar funciones de `heat-map.js`
- **RF**: Todos
- **Hecho cuando**: El archivo existe y `node --test` lo ejecuta sin errores de sintaxis.

### T2.2: Tests para `getHeatMapRange`
- [ ] Verificar rango de 12 semanas
- [ ] Verificar que `endDate` es domingo
- [ ] Verificar comportamiento en cambio de mes/año
- **RF**: RF-1
- **Hecho cuando**: Todos los tests pasan con `node --test`.

### T2.3: Tests para `buildHeatMapData`
- [ ] Agrupación por fecha correcta
- [ ] Suma de minutos del mismo día
- [ ] Ignorar sesiones futuras
- [ ] Ignorar minutos <= 0
- [ ] Manejar tema vacío
- **RF**: RF-1, RF-2, RF-3
- **Hecho cuando**: Todos los tests pasan.

### T2.4: Tests para `getDayColor`
- [ ] Verificar cada nivel de color
- [ ] Verificar minutos negativos → gris
- **RF**: RF-2
- **Hecho cuando**: Todos los tests pasan.

### T2.5: Tests para `getWeeksInRange` y `getMonthLabels`
- [ ] 12 semanas con 7 días
- [ ] Días futuros marcados
- [ ] Etiquetas de mes correctas
- **RF**: RF-1, RF-5
- **Hecho cuando**: Todos los tests pasan.

---

## Fase 3: Interfaz

### T3.1: Añadir contenedor del mapa en `index.html`
- [ ] Crear `<section class="heatmap-section">` con título "Mapa de calor"
- [ ] Añadir `heatmap-wrapper` con borde para el mapa completo
- [ ] Añadir contenedor de meses, días de la semana y cuadrícula
- [ ] Añadir contenedor de leyenda ("Menos" → "Más")
- [ ] Añadir ventana emergente (`<div class="heatmap-tooltip">`)
- **RF**: RF-1, RF-3, RF-4, RF-5
- **Hecho cuando**: El HTML contiene todos los elementos del mapa incluyendo leyenda y borde.

### T3.2: Estilos base del mapa en `styles.css`
- [ ] Cuadrícula: `display: grid; grid-template-columns: repeat(12, 10px); gap: 3px;`
- [ ] Celdas: `width: 10px; height: 10px; border-radius: 2px;`
- [ ] Borde del mapa: `border: 1px solid #d4cfc7; border-radius: 6px; padding: 12px;`
- [ ] Etiquetas de días y meses
- **RF**: RF-1, RF-4, RF-5
- **Hecho cuando**: La cuadrícula se muestra correctamente con celdas de 10px y borde visible.

### T3.3: Estilos de colores, hover y leyenda
- [ ] Colores de fondo para cada nivel
- [ ] Hover: `outline: 1px solid #1a1a1a; outline-offset: 1px;` (sin `transform: scale()`)
- [ ] Estilos de la ventana emergente (posición, fondo, borde, sombra)
- [ ] Estilos de leyenda: "Menos" → 5 colores → "Más"
- [ ] Responsive: apilar en móvil si es necesario
- **RF**: RF-2, RF-3
- **Hecho cuando**: Los colores coinciden con los niveles, el hover no altera el layout y la leyenda es visible.

### T3.4: Conectar lógica con DOM en `app.js`
- [ ] Importar funciones de `heat-map.js`
- [ ] Leer sesiones y llamar a `buildHeatMapData`
- [ ] Pintar cuadrícula con colores según `getDayColor`
- [ ] Pintar etiquetas de días (L, M, X, J, V, S, D) y meses
- [ ] Pintar leyenda con los 5 colores
- **RF**: RF-1, RF-2, RF-4, RF-5
- **Hecho cuando**: El mapa se renderiza con datos reales, días correctos y leyenda visible.

### T3.5: Implementar ventana emergente
- [ ] Mostrar ventana al hacer clic en una celda
- [ ] Mostrar fecha, minutos y temas
- [ ] Limitar a 5 temas con "+N más"
- [ ] Ocultar ventana al hacer clic fuera
- **RF**: RF-3
- **Hecho cuando**: Al hacer clic en un día con datos, se muestra la información correcta.

---

## Fase 4: Verificación final

### T4.1: Verificación con Chrome DevTools
- [ ] Abrir `index.html` en el navegador
- [ ] Registrar sesiones de prueba (hoy, ayer, anteayer)
- [ ] Verificar que el mapa muestra colores correctos
- [ ] Verificar borde del mapa visible
- [ ] Verificar leyenda "Menos" → "Más" visible
- [ ] Verificar días de la semana: L, M, X, J, V, S, D
- [ ] Verificar hover sin cambio de tamaño
- [ ] Verificar ventana emergente con datos
- [ ] Verificar vista móvil (375px)
- [ ] Revisar consola por errores
- **RF**: Todos
- **Hecho cuando**: Todo funciona correctamente y no hay errores en consola.

### T4.2: Tests finales
- [ ] Ejecutar `node --test` y verificar que todos pasan
- **RF**: Todos
- **Hecho cuando**: `node --test` muestra 0 fallos.
