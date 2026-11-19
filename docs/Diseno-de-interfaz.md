# Diseño de Interfaz y Criterios Visuales: Carolina Sweet

El diseño de la aplicación traduce la estética cálida, artesanal y cercana de una pastelería tradicional a una interfaz web moderna, limpia y ergonómica.

---

## 1. Paleta de Colores Artesanal

```text
[ #FFF9F4 ] Blanco Harina     -> Fondo principal de la aplicación
[ #F8E8E5 ] Rosa Suave        -> Fondo de tarjetas, badges y contenedores
[ #E8C5BC ] Rosa Secundario   -> Bordes suaves y estados secundarios
[ #B66C70 ] Rosa Artesanal    -> Color de marca, botones principales y acentos
[ #79534A ] Marrón Pastelero  -> Encabezados, títulos y textos destacados
[ #4F403B ] Chocolate Oscuro  -> Tipografía principal de lectura
[ #F0E3DC ] Borde Taller      -> Divisores sutiles y líneas de separación
```

---

## 2. Tipografía y Jerarquía
- **Familia tipográfica:** Sistema nativo sans-serif legible (`Inter`, `Segoe UI`, `Roboto`, `system-ui`).
- **Encabezados:** Títulos cálidos con acentos tipográficos en tono marrón pastelero.
- **Micro-interacciones:** Transiciones suaves de 0.2s en botones, tarjetas y selectores.

---

## 3. Navegación y Pantallas Principales
1. **Barra Lateral / Navegación Móvil:**
   - En pantallas de escritorio: menú lateral fijo con isotipo de Carolina Sweet.
   - En pantallas móviles (< 600px): barra superior compacta y navegación adaptada a pantalla completa.
2. **Inicio (Dashboard):**
   - Tarjetas de resumen métrico.
   - Panel de recordatorios de entrega (*Hoy, Mañana, Próximos 3 días*).
   - Pedidos recientes y accesos rápidos de un toque.
3. **Tablero Kanban y Vista Lista:**
   - 4 columnas fluidas con ancho adaptable.
   - Selector táctil de estado incorporado en cada tarjeta.
   - Conmutador para alternar a "Vista Tabla" detallada.
4. **Catálogo de Creaciones:**
   - Tarjetas con imagen referencial, precio, categoría, alérgenos y switch de disponibilidad.
5. **Agenda de Clientes:**
   - Lista rápida con etiquetas de alergias destacadas y acceso al historial completo.
6. **Módulo de Reportes:**
   - Botones tipo pastilla (*pills*) para selección de período y barras de progreso visuales para el ranking de productos.

---

## 4. Criterios de Accesibilidad y Ergonomía
- **Targets táctiles:** Botones y selectores con altura mínima de 44px.
- **Contraste de color:** Cumplimiento de ratio de contraste WCAG AA para textos principales sobre fondos claros.
- **Feedback visual:** Indicadores de estado con código de color e icono para evitar depender exclusivamente del color.
