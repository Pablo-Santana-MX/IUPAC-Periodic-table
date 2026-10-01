<div align="center">

# ⚛️ Tabla Periódica Actualizada
**Estándar Oficial IUPAC 2026 | Progressive Web App (PWA)**

[![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?logo=pwa)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Vanilla JS](https://img.shields.io/badge/Vanilla_JS-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![IUPAC Standard](https://img.shields.io/badge/Data-IUPAC_2026-8A2BE2)](https://iupac.org/)

Una aplicación web científica de última generación diseñada para la visualización integral, inspección fisicoquímica y análisis interactivo de los 118 elementos químicos. 

[Explorar Demo En Vivo](#) <!-- Reemplaza # con el link a tu demo -->

<br/>

<!-- RECOMENDACIÓN: Añade un GIF o captura de pantalla de tu proyecto aquí -->
<img src="https://via.placeholder.com/800x400/060913/38bdf8?text=Banner+o+GIF+de+la+Tabla+Periodica+Aqui" alt="Demo de la Tabla Periódica" width="100%">

</div>

---

## 🌟 Características Principales

### 🌓 Sistema de Temas Avanzado (Light / Dark / System)
*   **Oscuro (*Scientific Neon Glass*)**: Fondo azul-negro profundo, transparencias glassmorfismo (`backdrop-filter: blur(20px)`), acentos cyan y violetas.
*   **Claro (*Scientific Clear Glass*)**: Superficies translúcidas blancas, bordes tenues, sin reflejos borrosos. Estilo laboratorio.
*   **Detección Automática**: Sincronización en vivo con las preferencias del sistema operativo.
*   **Prevención de FOUC**: Aplicación de tema pre-renderizado para evitar destellos visuales.

### 🔬 Ficha Central Integrada (Hub IUPAC)
Aprovecha el espacio natural de los periodos 1 a 3 (columnas 3 a 12) para mostrar información oficial en tiempo real mediante *hover*, incluyendo masa atómica, electronegatividad, configuración electrónica y más.

### 🧪 Modal Glass Ultra-Interactivo
Dossier técnico expandido con 6 módulos de análisis:
1.  **Modelo Atómico**: Visualizador interactivo 2D de Bohr en `<canvas>`.
2.  **Valencias y Enlace**: Estados de oxidación oficiales y barra visual de electronegatividad.
3.  **Compuestos Clave**: Catálogo de moléculas principales con botón de copiado rápido.
4.  **Geoquímica**: Abundancia terrestre, océanos, atmósfera, cuerpo humano y origen cósmico.
5.  **Simulador Termodinámico**: Deslizador interactivo (0 K a 4000 K) para calcular el estado de la materia en tiempo real.
6.  **Historia**: Datos del descubrimiento y usos industriales.

### 📈 Gráficos y Accesibilidad
*   **Chart.js Integrado**: Gráficos dinámicos de tendencias periódicas (Z vs Propiedades) adaptables al tema.
*   **Text-to-Speech**: Síntesis vocal bilingüe nativa (ES/EN) para pronunciación y datos clave.
*   **Navegación 100% por Teclado**: Soporte completo para `Tab`, `Enter`, `Flechas` y `Escape`.
*   **Búsqueda en Vivo**: Filtrado por símbolo, nombre, número atómico o familia química.

---

## 📱 PWA & Modo Offline

Funciona **100% sin conexión**. Utiliza un Service Worker (v3) con estrategia *Network-First* y *fallback* a caché local. Instalable como aplicación nativa (*standalone*) en Android, iOS, Windows y macOS.

---

## 🛠️ Detalles Técnicos y Estructura

<details>
<summary><strong>📁 Ver Estructura del Proyecto</strong></summary>

```text
tabla-periodica-actualizada/
├── index.html        # Estructura semántica, Grid atómico 18x10
├── style.css         # Variables CSS, animaciones glass y responsive
├── app.js            # Dataset IUPAC, temas, Bohr canvas, simulador e i18n
├── sw.js             # Service Worker (v3)
├── manifest.json     # Manifiesto PWA
├── public/           # Archivos estáticos
└── icons/            # Iconografía PWA (192px y 512px)
```
</details>

<details>
<summary><strong>🎨 Paleta de Colores (CSS Variables)</strong></summary>

```css
/* Variables en Modo Oscuro */
html[data-theme="dark"] {
  --bg-deep: #060913;
  --bg-secondary: #0d1424;
  --glass-base: rgba(13, 20, 36, 0.75);
  --text-primary: #f8fafc;
  --accent-primary: #38bdf8;
}

/* Variables en Modo Claro */
html[data-theme="light"] {
  --bg-deep: #f0f6fc;
  --bg-secondary: #e2eeff;
  --glass-base: rgba(255, 255, 255, 0.8);
  --text-primary: #0f172a;
  --accent-primary: #0284c7;
}
```
</details>

<details>
<summary><strong>🔬 Parámetros Verificados (IUPAC / CIAAW)</strong></summary>

| Parámetro | Descripción |
| :--- | :--- |
| **Z, Símbolo, Nombre** | Nomenclatura universal y bilingüe. |
| **Masa Atómica** | Evaluada por la comisión CIAAW. |
| **Config. Electrónica** | Subniveles $s, p, d, f$ y población $K-Q$. |
| **Termodinámica** | Puntos de fusión/ebullión y fases a 298.15 K. |
| **Propiedades** | Electronegatividad, radio atómico y energía de ionización. |

</details>

---

## 🚀 Instalación y Despliegue

### Entorno de Desarrollo (Vite)
```bash
# 1. Clonar el repositorio
git clone [https://github.com/tu-usuario/tabla-periodica-actualizada.git](https://github.com/tu-usuario/tabla-periodica-actualizada.git)
cd tabla-periodica-actualizada

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor local (Puerto 3000)
npm run dev
```

### Alternativa: Servidor Estático Rápido (Python)
```bash
python3 -m http.server 3000
```

### Construcción para Producción
```bash
npm run build
```
Sube la carpeta `dist/` a cualquier servicio de hosting estático (GitHub Pages, Vercel, Netlify).

---

## 💾 Persistencia Local (LocalStorage)

El proyecto guarda preferencias del usuario para una experiencia fluida:
*   `periodicTheme`: (`light` | `dark` | `system`)
*   `zperiod_lang`: (`es` | `en`)
*   `zperiod_visits_count`: Contador local de visitas.

---

<div align="center">
  <p>Desarrollado bajo la licencia <strong>MIT</strong>.<br/>
  Datos atómicos de conformidad con la <strong>IUPAC</strong> y la <strong>CIAAW</strong>.</p>
</div>
