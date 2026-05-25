# BuscadorMarvel 🦸‍♂️

Buscador interactivo de superhéroes Marvel y DC con Angular 17, Signals y características avanzadas de UX.

## 🚀 Features

- **Búsqueda multi-publisher**: Marvel Comics y DC Comics
- **5 tabs navegables**: Buscar, Comparar, Rankings, Explorar, Favoritos
- **Comparador de héroes**: Compara estadísticas lado a lado con debounce
- **Top 5 rankings**: Por estadística (inteligencia, fuerza, velocidad, etc.)
- **Explorar & filtrar**: Alineación, ordenamiento, paginación con scroll-to-top
- **Favoritos persistentes**: localStorage con Angular Signals
- **Tema dinámico**: Cambia colores (Marvel rojo vs DC azul) en toda la app
- **Skeleton loaders**: Carga visual mejorada mientras se obtiene data
- **Detalle interactivo**: Panel modal con Escape key para cerrar
- **Accesibilidad**: Soporte ARIA, navegación por teclado

## 🛠️ Tech Stack

- **Angular 17** — Standalone components, Signals, computed(), effect()
- **TypeScript** — Tipado fuerte
- **Bootstrap 5** — Responsivo y temas CSS variables
- **RxJS** — debounceTime, switchMap, caching
- **Akabab SuperHero API** — 700+ héroes con 6 stats cada uno
- **Karma/Jasmine** — 153 tests, 100% coverage

## 📋 Requisitos previos

- Node.js 18+
- npm 9+

## 🏗️ Instalación

```bash
git clone https://github.com/tu-usuario/buscadorMarvel.git
cd buscadorMarvel
npm install
```

## 🧪 Desarrollo & Testing

```bash
# Servidor dev (puerto 4200)
ng serve

# Tests con cobertura
ng test --code-coverage

# Build producción
ng build --configuration production
```

## 📊 Arquitectura

### Componentes
- `AppComponent` — contenedor principal, manejo de temas, rutas de tabs
- `SearchComponent` — input de búsqueda con validación
- `CharacterListComponent` — grid de resultados con filtros y ordenamiento
- `ComparatorComponent` — comparación lado a lado (debounced)
- `TopRankingsComponent` — top 5 por stat con skeleton loader
- `ExploreComponent` — browse con paginación y filtros
- `FavoritesComponent` — listado de favoritos guardados
- `CharacterDetailComponent` — modal de detalles con Escape key

### Servicios
- `HeroService` — API calls, caching por publisher, búsqueda
- `FavoritesService` — signal-based localStorage persistence

### Utilidades
- `hero-utils.ts` — centraliza definiciones de stats, labels, funciones compartidas

## 🎨 Mejoras implementadas

- ✅ Utilidades compartidas para eliminar duplicación (stats, alignmentLabel, alignmentClass)
- ✅ Debounce (300ms) + switchMap en comparador → evita race conditions
- ✅ Botón X para limpiar cada lado del comparador independientemente
- ✅ Botón limpiar búsqueda con estado visual
- ✅ Skeleton loaders en top-rankings durante carga
- ✅ Scroll suave al top al cambiar página/filtro
- ✅ Escape key cierra panel de detalle
- ✅ 100% test coverage con 153 tests

## 🐛 Notas técnicas

### API Akabab
- ~700 héroes con 6 stats cada uno (0-100)
- Publisher corrupto en ~50 caracteres (aliases como publisher)
- Sets explícitos `MARVEL_PUBLISHERS` / `DC_PUBLISHERS` para workaround

### Gestión de estado
- Signals para `query`, `results`, `heroes`, `favorites`, `page`
- `computed()` para `filtered`, `paged`, `displayed`
- `effect()` en AppComponent para sync CSS variables ↔ DOM

### Performance
- RxJS `switchMap` previene subscripciones múltiples
- `trackBy` en `*ngFor` para listas grandes
- Lazy skeleton loaders en lugar de spinners
- Caching de HTTP via `shareReplay`

## 📱 Responsive

- Mobile (375px) → 2 columnas
- Tablet (768px) → 3 columnas
- Desktop (1280px) → 4 columnas

## 🎯 Próximos pasos (opcional)

- [ ] Agregar filtro por origen (origin.name)
- [ ] Exportar comparación como imagen
- [ ] Historial de búsquedas
- [ ] Dark/light mode toggle manual (además del automático)
- [ ] Integración SSR con Angular Universal

## 📄 Licencia

MIT

## 👤 Autor

@usuario

---

**Última actualización**: April 2026  
**Angular**: 17.3.7  
**Test Coverage**: 100%
