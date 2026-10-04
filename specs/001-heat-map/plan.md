# Plan 001 — Mapa de Calor de Estudio (estilo GitHub)

## Cambios de diseño

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Tamaño de celdas | `aspect-ratio: 1` (auto) | 10px × 10px fijos |
| Gap entre celdas | 2px | 3px |
| Hover | `transform: scale(1.15)` | Sin cambio de tamaño, solo tooltip |
| Borde del mapa | Ninguno | 1px sólido alrededor de días + cuadrícula |
| Leyenda | Ninguna | "Menos" → "Más" con 5 colores |
| Días de la semana | Sin borde | Incluidos en el borde del mapa |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `styles.css` | Tamaño de celdas 10px, gap 3px, borde del mapa, eliminar `transform: scale()`, añadir estilos de leyenda |
| `index.html` | Añadir contenedor de leyenda debajo del mapa |
| `specs/001-heat-map/plan.md` | Este archivo |

## Decisiones técnicas

| Decisión | Justificación | Alternativa descartada |
|----------|---------------|------------------------|
| Celdas fijas 10px | Tamaño exacto de GitHub | `aspect-ratio: 1` (tamaño variable) |
| Sin `transform: scale()` | Evita desalineación al final de filas/columnas | Escalar en hover (causa overflow) |
| Borde en contenedor exterior | Visualmente separa el mapa del resto | Borde en cada celda (ruido visual) |
| Leyenda con 5 colores | Coincide con los niveles de color | Leyenda con texto descriptivo |

## Estructura HTML del mapa

```html
<section class="heatmap-section">
    <h2>Mapa de calor</h2>
    <div class="heatmap-wrapper">
        <div class="heatmap-container">
            <div class="heatmap-months" id="heatmap-months"></div>
            <div class="heatmap-body">
                <div class="heatmap-weekdays">
                    <span>L</span><span>M</span><span>X</span>
                    <span>J</span><span>V</span><span>S</span><span>D</span>
                </div>
                <div class="heatmap-grid" id="heatmap-grid"></div>
            </div>
        </div>
        <div class="heatmap-legend">
            <span>Menos</span>
            <div class="legend-colors">
                <div class="legend-cell" style="background-color: #ebedf0"></div>
                <div class="legend-cell" style="background-color: #9be9a8"></div>
                <div class="legend-cell" style="background-color: #40c463"></div>
                <div class="legend-cell" style="background-color: #30a14e"></div>
                <div class="legend-cell" style="background-color: #216e39"></div>
            </div>
            <span>Más</span>
        </div>
    </div>
</section>
```

## Estilos CSS clave

```css
.heatmap-wrapper {
    border: 1px solid #d4cfc7;
    border-radius: 6px;
    padding: 12px;
}

.heatmap-grid {
    display: grid;
    grid-template-columns: repeat(12, 10px);
    gap: 3px;
}

.heatmap-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    cursor: pointer;
}

.heatmap-cell:hover {
    outline: 1px solid #1a1a1a;
    outline-offset: 1px;
}

.heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 8px;
    font-size: 0.75rem;
    color: #8a8a8a;
}

.legend-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
}
```

## Criterios de verificación

- [ ] Celdas de 10px × 10px con gap de 3px
- [ ] Borde de 1px alrededor del mapa completo
- [ ] Hover sin cambio de tamaño (solo outline)
- [ ] Leyenda "Menos" → "Más" visible
- [ ] Días de la semana dentro del borde
- [ ] Funciona en móvil (375px)
- [ ] Tests siguen pasando
