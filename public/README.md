# ⚛️ Tabla Periódica Actualizada — Estándar Oficial IUPAC 2026 (PWA)

Una **Progressive Web App (PWA)** científica de última generación diseñada para la visualización integral, inspección fisicoquímica y análisis interactivo de los 118 elementos de la **Tabla Periódica Oficial de la IUPAC**, con estética de **Glassmorfismo Ultra-Moderno** y visualización 100% adaptativa en pantalla.

Cuenta con arquitectura modular en JavaScript vainilla (ES6+), estilos en vidrio esmerilado con Tailwind CSS y variables CSS nativas, un **Sistema Completo de Temas (Claro / Oscuro / Sistema)**, simulador termodinámico de fases en tiempo real, modelo atómico de Bohr en Canvas 2D, gráficos de tendencias periódicas con **Chart.js** adaptativo, síntesis de voz (**Text-to-Speech**), soporte multilingüe en caliente (**Español / Inglés**) con persistencia en `localStorage`, funcionamiento **100% offline** mediante Service Worker (v3) y un **contador de visitas discreto**.

---

## 🌟 Características Principales

### 1. 🌓 Sistema de Temas Avanzado (Light / Dark / System)
- **Tema Oscuro (*Scientific Neon Glass*)**: Fondo azul-negro profundo (`#060913`), transparencias glassmorfismo con `backdrop-filter: blur(20px)`, acentos cyan y violetas sutiles, reflejos especulares y estética de panel de control científico premium.
- **Tema Claro (*Scientific Clear Glass*)**: Superficies translúcidas blancas, bordes tenues azul/cyan, sombras suaves, texto oscuro de alto contraste (`#0f172a` / `#334155`), sin reflejos borrosos y con estética limpia estilo laboratorio moderno.
- **Detección Automática de Sistema**: Sincronización en vivo con `window.matchMedia('(prefers-color-scheme: dark)')` que sigue automáticamente los cambios del sistema operativo si se encuentra en modo *Sistema*.
- **Control Dual de Tema**:
  - **Clic directo en el botón principal**: Alterna de inmediato entre Claro y Oscuro con respuesta instantánea.
  - **Menú desplegable (*Chevron*)**: Popover flotante accesible para elegir explícitamente entre ☀️ *Claro*, 🌙 *Oscuro* y 🖥️ *Sistema*.
- **Prevención de FOUC**: Script en el `<head>` para calcular y aplicar el tema antes del primer renderizado de la interfaz, evitando destellos visuales.
- **Transiciones Suaves**: Animaciones en colores y fondos optimizadas para evitar recálculos lentos del grid atómico.

### 2. 🔬 Ficha Central Integrada (Hub IUPAC)
- Aprovecha el espacio natural de los periodos 1 a 3 (columnas 3 a 12).
- Muestra en tiempo real la información oficial del elemento seleccionado o del elemento sobre el que se hace *hover*, sin ocultar celdas de la tabla.
- Incluye acceso directo a la ficha técnica completa, masa atómica CIAAW, valencias, electronegatividad, radio atómico, estado físico, configuración electrónica y abundancia geológica.

### 3. 🧪 Ventana Modal Glass Ultra-Interactiva
La ficha técnica expandida cuenta con seis pestañas especializadas de análisis:
1. **Modelo Atómico**: Visualizador interactivo 2D del Modelo de Bohr sobre `<canvas>`, con animación continua de órbitas, cálculo de electrones por capa ($K, L, M, N, O, P, Q$) e interactividad que resalta órbitas al pasar el cursor por las píldoras de niveles.
2. **Valencias y Enlace**: Estados de oxidación oficiales recomendados por la IUPAC con chips interactivos y barra visual de electronegatividad en escala Pauling con gradiente reactivo.
3. **Compuestos Químicos Clave**: Catálogo de las principales moléculas y sales inorgánicas u orgánicas que forma cada elemento, con fórmulas estandarizadas, tipología de enlace, aplicaciones y botón de copiado rápido.
4. **Abundancia en la Tierra y Geoquímica**: Distribución de masa en la corteza terrestre (ppm y ranking planetario), concentraciones en océanos, presencia atmosférica, porcentaje en el cuerpo humano, orígenes cósmicos (Big Bang, supernovas, kilonovas) y lista de isótopos principales.
5. **Simulador Termodinámico de Fases**: Deslizador interactivo de temperatura (0 K a 4000 K / -273 °C a 3727 °C) que calcula dinámicamente si el elemento se encuentra en estado Sólido, Líquido o Gaseoso con badges reactivos y accesos rápidos a temperaturas de referencia (cero absoluto, nitrógeno líquido, hielo, ambiente 298.15 K, vapor de agua, alto horno).
6. **Historia & Usos**: Datos históricos del descubrimiento, descubridores, año oficial (incluyendo notación a.C. / BCE) y aplicaciones industriales contemporáneas.

### 4. 📈 Gráfico de Tendencias Periódicas (Chart.js)
- Gráfico dinámico en ventana modal que traza la variación de propiedades fisicoquímicas en función del número atómico $Z$ (1 a 118).
- Soporta análisis de electronegatividad, masa atómica, radio atómico, energía de ionización, valencia principal y densidad.
- **Adaptación automática de tema (`updateChartTheme`)**: Actualiza ejes, cuadrícula, tipografía, leyendas y tooltips en caliente entre Claro y Oscuro sin destruir la gráfica.

### 5. 🔊 Accesibilidad, Text-to-Speech e Interacción
- **Lectura en voz alta (Text-to-Speech)**: Síntesis vocal bilingüe con la Web Speech API nativa para escuchar pronunciación, masa, valencia y resumen geocientífico.
- **Portapapeles con formato IUPAC**: Exportación rápida y formateada del dossier del elemento listo para informes de laboratorio o apuntes académicos.
- **Navegación completa por teclado**:
  - `Enter` / `Espacio` en celdas para seleccionar y abrir ficha.
  - `Flecha Izquierda` / `Flecha Derecha` dentro del modal para navegar consecutivamente entre elementos ($Z-1$ y $Z+1$).
  - `Escape` para cerrar ventanas modales y menús emergentes.
  - Navegación por flechas dentro del menú de temas.
- **Buscador en Tiempo Real**: Filtrado simultáneo por símbolo químico, nombre (español e inglés), número atómico o estados de valencia.
- **Filtro por Familias Químicas**: Resaltado y atenuación de celdas según las 10 familias IUPAC.
- **Selector de Métrica en Celdas**: Alterna en vivo la propiedad visible en la esquina inferior de cada una de las 118 celdas (valencia, masa, radio, electronegatividad, etc.).

### 6. 📱 PWA, Modo Offline (Service Worker v3) & Optimización Móvil Completa
- **Adaptabilidad Móvil Integral (Landscape & Portrait)**:
  - **Modo Horizontal (*Landscape*)**: Cabecera compacta en una sola línea (`~38px`), barra de familias reducida y celdas atómicas con tipografía calculada para que los 118 elementos (incluyendo lantánidos y actínidos) quepan en pantalla sin cortes ni superposición del Hub Central.
  - **Modo Vertical (*Portrait*)**: Desplazamiento horizontal táctil fluido (`-webkit-overflow-scrolling: touch`) a través de los 18 grupos, con indicador visual de deslizamiento.
  - **Optimización Táctil**: Reglas `@media (hover: hover)` para evitar que las celdas queden atascadas en estado hover al pulsar en pantallas táctiles, soporte `touch-action: manipulation` para eliminación del retardo de 300ms.
- Manifiesto Web App (`manifest.json`) e iconos vectoriales para instalación *standalone* en Android, iOS, Windows y macOS.
- **Service Worker (v3)** con estrategia *Network-First* con *fallback* a caché local para garantizar funcionamiento autónomo sin conexión a internet.
- Indicador visual flotante de estado sin conexión.

---

## 📁 Estructura del Proyecto

```text
tabla-periodica-actualizada/
├── index.html        # Estructura semántica, Grid atómico 18x10, cabecera y modales
├── style.css         # Variables CSS para Dark y Light, animaciones glass y responsive
├── app.js            # Lógica completa: dataset IUPAC 118, temas, Bohr canvas, simulador e i18n
├── sw.js             # Service Worker (v3) con precacheo de recursos y soporte offline
├── manifest.json     # Manifiesto PWA para instalación como aplicación web de escritorio/móvil
├── public/           # Archivos sincronizados para servicio estático en producción (Vite/PWA)
│   ├── app.js
│   ├── style.css
│   ├── sw.js
│   ├── manifest.json
│   └── icons/
├── icons/
│   ├── icon-192x192.png  # Icono PWA con motif atómico cyan glass para móviles
│   └── icon-512x512.png  # Icono PWA de alta resolución y pantalla de inicio
├── package.json      # Dependencias y scripts de desarrollo / construcción Vite
├── vite.config.ts    # Configuración de compilación y servidor Vite
└── README.md         # Documentación integral del proyecto
```

---

## 🔬 Verificación Oficial de Parámetros IUPAC por Elemento

Cada elemento cuenta con los parámetros físicos y químicos verificados de acuerdo con las fuentes de la **IUPAC** y la **CIAAW**:

| Parámetro | Unidad / Formato | Descripción |
| :--- | :--- | :--- |
| **Número Atómico ($Z$)** | Entero ($1 - 118$) | Protones en el núcleo del átomo. |
| **Símbolo Químico** | Texto ($1 - 2$ caracteres) | Nomenclatura universal IUPAC. |
| **Nombre Oficial** | Bilingüe (ES / EN) | Nombre internacional verificado. |
| **Masa Atómica Estándar** | Unidades de masa unificada ($u$) | Evaluada por la comisión CIAAW más reciente. |
| **Valencia / Estados de Oxidación** | Notación con signos ($+1, -1, +2$, etc.) | Estados recomendados y reconocidos formalmente. |
| **Configuración Electrónica** | Notación cuántica condensada | Subniveles $s, p, d, f$ respecto al gas noble previo. |
| **Electrones por Capa** | Secuencia numérica | Población electrónica en niveles $K, L, M, N, O, P, Q$. |
| **Electronegatividad** | Escala de Pauling | Capacidad de atracción de densidad electrónica en enlaces. |
| **Radio Atómico** | Picómetros ($pm$) | Radio covalente o empírico verificado. |
| **1ª Energía de Ionización** | Kilojulios por mol ($kJ/mol$) | Energía mínima para remover el electrón más externo. |
| **Puntos de Fusión y Ebullición** | Kelvin ($K$) y Grados Celsius (°C) | Temperaturas oficiales de cambio de fase termodinámica. |
| **Densidad** | $g/cm^3$ o $g/L$ (a 20°C) | Masa volumétrica en condiciones estándar. |
| **Estado Físico a 298.15 K** | Sólido / Líquido / Gas / Sintético | Fase observable a temperatura ambiente de laboratorio. |
| **Abundancia Terrestre** | $ppm$ / Porcentaje en masa | Concentración en corteza, océanos, atmósfera y cuerpo humano. |
| **Origen Cósmico** | Mecanismo astrofísico | Big Bang, nucleosíntesis estelar, supernovas o kilonovas. |
| **Compuestos Principales** | Fórmulas moleculares y sales | Fórmulas, tipo de red química y usos industriales. |
| **Electrón Diferencial ($n, l, m_l, s$)** | Cuádrupla de números cuánticos | Parámetros cuánticos del último electrón en añadirse según el principio de Aufbau. |
| **Configuración Gráfica de Cajas** | Casillas orbitales y espines ($\uparrow, \downarrow$) | Representación visual con espines respetando el principio de exclusión de Pauli y regla de Hund. |

---

## ⚛️ Mecánica Cuántica y Configuración Gráfica

La ficha científica integra ahora el análisis cuántico completo para los 118 elementos químicos:

1. **Configuración Electrónica Gráfica (Notación de Cajas / Orbitales):**
   - Muestra visualmente las casillas orbitales degeneradas ($s=1$, $p=3$, $d=5$, $f=7$) para cada subnivel.
   - Representación precisa de electrones mediante flechas de espín:
     - Flecha hacia arriba ($\uparrow$) para spin positivo ($s = +1/2$).
     - Flecha hacia abajo ($\downarrow$) para spin negativo ($s = -1/2$).
   - Riguroso cumplimiento pedagógico:
     - **Regla de Hund:** Los orbitales degenerados se semillenen inicialmente con espines paralelos ($\uparrow$) de menor repulsión electrostática.
     - **Principio de Exclusión de Pauli:** No existen dos electrones con los cuatro números cuánticos idénticos; en una misma casilla orbital coexisten únicamente espines antiparalelos ($\uparrow\downarrow$).
     - **Selector de Vista:** Alterna dinámicamente entre **Capa de Valencia** (con indicador del gas noble cerrado) y **Configuración Completa**.
     - **Resaltado Dinámico:** La casilla del electrón diferencial se destaca con borde pulsante cian, resplandor de neón y la etiqueta distintiva `e⁻ dif`.

2. **Números Cuánticos del Electrón Diferencial:**
   - Calcula de forma exacta los cuatro números cuánticos correspondientes al último electrón en añadirse al átomo neutro según el principio de Aufbau:
     - **$n$ (Principal):** Nivel energético fundamental y radio medio orbital (capas $K, L, M, N, O, P, Q$).
     - **$l$ (Azimutal / Momento Angular):** Subnivel y geometría espacial ($0 = s$ esférico, $1 = p$ bilobular, $2 = d$ tetralobular, $3 = f$ complejo).
     - **$m_l$ (Magnético):** Orientación tridimensional del orbital respecto a los ejes cartesianos (valores enteros entre $-l$ y $+l$).
     - **$s$ (Espín Cuántico):** Momento angular intrínseco ($+1/2$ para giro paralelo/horario $\uparrow$, $-1/2$ para giro antiparalelo/antihorario $\downarrow$).
   - Botón de copiado con un clic de la cuádrupla formal `(n, l, m, s)` con retroalimentación háptica/visual.

---

## 🎨 Paleta y Variables de Estilo

El proyecto centraliza todas las decisiones visuales en CSS Custom Properties organizadas bajo los atributos `data-theme="dark"` y `data-theme="light"`:

```css
/* Variables en Modo Oscuro (por defecto) */
html[data-theme="dark"] {
  --bg-deep: #060913;
  --bg-secondary: #0d1424;
  --glass-base: rgba(13, 20, 36, 0.75);
  --glass-card: rgba(26, 38, 62, 0.52);
  --glass-cell: rgba(17, 27, 48, 0.65);
  --glass-border: rgba(255, 255, 255, 0.13);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --accent-primary: #38bdf8;
  --accent-glow: rgba(56, 189, 248, 0.4);
}

/* Variables en Modo Claro (Clear Glass) */
html[data-theme="light"] {
  --bg-deep: #f0f6fc;
  --bg-secondary: #e2eeff;
  --glass-base: rgba(255, 255, 255, 0.8);
  --glass-card: rgba(255, 255, 255, 0.7);
  --glass-cell: rgba(255, 255, 255, 0.75);
  --glass-border: rgba(14, 116, 144, 0.16);
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --accent-primary: #0284c7;
  --accent-glow: rgba(2, 132, 199, 0.3);
}
```

---

## 🛠️ Instalación y Ejecución Local

### Opción 1: Con Node.js (Servidor de Desarrollo)
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/tabla-periodica-actualizada.git
cd tabla-periodica-actualizada

# Instalar dependencias
npm install

# Iniciar servidor local Vite en el puerto 3000
npm run dev
```
Abre en tu navegador: `http://localhost:3000`

### Opción 2: Como Sitio Estático Portable (Python 3)
```bash
python3 -m http.server 3000
```

### Opción 3: Despliegue en Producción (GitHub Pages / Netlify / Vercel)
```bash
# Compilar bundle estático optimizado
npm run build
```
Sube la carpeta `dist/` o el directorio raíz a cualquier servidor estático con soporte HTTPS para activar todas las capacidades PWA y Service Worker.

---

## 💾 Claves de Persistencia Local (`localStorage`)

| Clave | Valores | Propósito |
| :--- | :--- | :--- |
| `periodicTheme` | `"light"` \| `"dark"` \| `"system"` | Conserva la preferencia de tema visual elegida por el usuario. |
| `zperiod_lang` | `"es"` \| `"en"` | Almacena el idioma activo para títulos, propiedades y fichas técnicas. |
| `zperiod_visits_count` | Entero positivo | Contador discreto de visitas almacenado localmente en el dispositivo. |

---

## 📜 Licencia

Desarrollado bajo licencia **MIT**. Datos atómicos estandarizados de conformidad con las directrices de acceso abierto de la **IUPAC (International Union of Pure and Applied Chemistry)** y la **CIAAW (Commission on Isotopic Abundances and Atomic Weights)**.
