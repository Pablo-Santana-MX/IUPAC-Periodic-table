/**
 * ==========================================================================
 * TABLA PERIÓDICA ACTUALIZADA (ESTÁNDAR OFICIAL IUPAC 2026) - APP.JS
 * - Visualización 100% en pantalla (Grid Atómico 18x10 Adaptativo)
 * - Ficha Central Integrada IUPAC (Hub en Periodos 1-3, Columnas 3-12)
 * - Verificación IUPAC completa:
 *   * Valencias y Estados de Oxidación oficiales
 *   * Número Atómico (Z) y Símbolo Oficial
 *   * Masas Atómicas Estándar CIAAW / IUPAC
 *   * Configuración Electrónica y Electrones por Capa
 *   * Electronegatividad (Pauling), Radio Atómico, 1ª Energía de Ionización
 *   * Puntos de Fusión/Ebullición, Densidad, Estado Físico y Estructura Cristalina
 *   * Descubrimiento y aplicaciones clave
 * - Estilo Glassmorfismo ultra-moderno
 * - Soporte PWA Offline, i18n (ES / EN) y Contador persistente (LocalStorage)
 * ==========================================================================
 */

// --- 1. REGISTRO SERVICE WORKER & PWA INSTALL ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => console.log('[IUPAC PWA] Service Worker activo:', reg.scope))
      .catch((err) => console.warn('[IUPAC PWA] Fallo de registro SW:', err));
  });
}

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const pwaBtn = document.getElementById('pwaInstallBtn');
  if (pwaBtn) pwaBtn.classList.remove('hidden');
});

// --- 2. DICCIONARIOS DE INTERNACIONALIZACIÓN (i18n) ---
const I18N = {
  es: {
    appTitle: 'Tabla Periódica Actualizada',
    appSubtitle: 'Estándar Oficial de los Elementos Químicos (IUPAC 2026)',
    navTrends: 'Tendencias',
    btnFitScreen: 'Pantalla Completa',
    installApp: 'Instalar App',
    searchPlaceholder: 'Buscar elemento (ej: Fe, Hierro, 26, valencia +3)...',
    activeProperty: 'Propiedad:',
    visitsLabel: 'Visitas',
    detailsTitle: 'Ficha IUPAC',
    modalIupacTitle: 'Ficha Técnica Completa Oficial IUPAC',
    chartTitle: 'Gráfico de Tendencias Periódicas',
    chartSubtitle: 'Variación fisicoquímica según el número atómico (Z)',
    btnLangText: 'EN',
    offlineStatus: 'Modo sin conexión activo (Caché IUPAC)',
    fullSheetBtn: 'Ver Ficha Completa',
    closeBtn: 'Cerrar',
    mobileScrollPrompt: 'Desliza para ver los 18 grupos',
    // Propiedades oficiales IUPAC
    atomicNumber: 'Número Atómico (Z)',
    mass: 'Masa Atómica (CIAAW)',
    valencia: 'Valencia / Oxidación',
    electronConfig: 'Config. Electrónica',
    electronsPerShell: 'Electrones por Capa',
    electronegativity: 'Electronegatividad (Pauling)',
    atomicRadius: 'Radio Atómico',
    ionizationEnergy: '1ª Energía Ionización',
    electronAffinity: 'Afinidad Electrónica',
    meltingPoint: 'Punto de Fusión',
    boilingPoint: 'Punto de Ebullición',
    density: 'Densidad (a 20°C)',
    crystalStructure: 'Estructura Cristalina',
    group: 'Grupo',
    period: 'Periodo',
    block: 'Bloque',
    phase: 'Estado a 298.15 K',
    discoveredBy: 'Descubridor(es)',
    year: 'Año',
    applications: 'Aplicaciones & Relevancia',
    // Estados físicos
    solid: 'Sólido',
    liquid: 'Líquido',
    gas: 'Gas',
    synthetic: 'Sintético / Radiactivo',
    unknown_phase: 'Desconocido',
    // Familias IUPAC
    familiesLabel: 'Familias IUPAC:',
    filterAll: 'Todas',
    alkali: 'Metales alcalinos',
    'alkaline-earth': 'Alcalinotérreos',
    transition: 'Metales de transición',
    'post-transition': 'Metales post-transición',
    metalloid: 'Metaloides',
    'reactive-nonmetal': 'No metales reactivos',
    halogen: 'Halógenos',
    'noble-gas': 'Gases nobles',
    lanthanide: 'Lantánidos',
    actinide: 'Actínidos',
    unknown: 'Desconocido',
    // Pestañas y Geociencias
    tabAtomicModel: 'Modelo Atómico',
    tabQuantum: 'Orbitales & Cuántica',
    tabValences: 'Valencias',
    tabCompounds: 'Compuestos Clave',
    tabAbundance: 'Abundancia en Tierra',
    tabThermal: 'Simulador Térmico',
    tabHistory: 'Historia & Usos',
    diffElectronTitle: 'Números Cuánticos del Electrón Diferencial',
    diffElectronSubtitle: 'Parámetros del último electrón incorporado según Aufbau',
    diffElectronBadge: 'Electrón Diferencial',
    orbitalBoxesTitle: 'Configuración Electrónica Gráfica',
    orbitalBoxesSubtitle: 'Diagrama de orbitales y espines respetando Hund y Pauli',
    valenceOnly: 'Capa de Valencia',
    fullConfig: 'Configuración Completa',
    copyQuantumTuple: 'Copiar cuádrupla (n, l, m, s)',
    copiedTuple: '¡Copiado!',
    nobleGasCoreClosed: 'Capa interna cerrada (gas noble)',
    viewQuantumDiagram: 'Ver diagrama cuántico &rarr;',
    crustLabel: 'Corteza Terrestre',
    oceanLabel: 'Océanos',
    atmosphereLabel: 'Atmósfera',
    humanLabel: 'Cuerpo Humano',
    originLabel: 'Origen Cósmico',
    isotopesLabel: 'Isótopos Principales',
    compoundsTitle: 'Principales Compuestos Químicos',
    compoundsSubtitle: 'Fórmulas, tipos de enlace y aplicaciones de las moléculas y sales más importantes que forma',
    reactivityTitle: 'Comportamiento y Reactividad Química',
    abundanceTitle: 'Abundancia Geoquímica y Distribución Planetaria',
    shellInstruction: 'Pasa el cursor sobre una capa para resaltarla:',
    viewGeoreport: 'Ver geoinforme &rarr;',
    viewCatalog: 'Ver catálogo &rarr;',
    oxidationStatesTitle: 'Estados de Oxidación Oficiales IUPAC',
    valencesRecommended: 'Valencias recomendadas',
    notAvailableInert: 'No disponible / Inerte',
    lowAttraction: '0.0 (Baja atracción)',
    highAttraction: '4.0 (Flúor: Máxima)',
    thermalSimTitle: 'Simulador Termodinámico de Fases',
    thermalSimDesc: 'Mueve el deslizador para simular el estado de agregación a diferentes temperaturas:',
    simulatedTempLabel: 'Temperatura Simulada',
    referencePointsLabel: 'Puntos de Referencia:',
    calculatedPhaseLabel: 'Fase Termodinámica Calculada:',
    solidState: 'SÓLIDO',
    liquidState: 'LÍQUIDO',
    gasState: 'GAS',
    solidDesc: 'Estructura cristalina ordenada, átomos vibrando en posiciones fijas.',
    liquidDesc: 'Fluidez con volumen definido pero sin forma fija; enlaces dinámicos.',
    gasDesc: 'Átomos con alta energía cinética en expansión libre y colisiones moleculares.',
    historyTitle: 'Historia y Reconocimiento IUPAC',
    compoundsAnalyzed: 'compuestos analizados',
    copyFormula: 'Copiar fórmula',
    copiedFormula: '¡Copiada!',
    crustRocksDesc: 'Concentración en rocas de la litosfera',
    oceanSaltsDesc: 'Sales disueltas y biodisponibilidad en agua marina',
    atmosphereGasDesc: 'Concentración promedio en la columna gaseosa',
    humanBiomolecularDesc: 'Participación biomolecular',
    abundanceDistributionDesc: 'Distribución de masa en geosferas terrestres, océanos, atmósfera y biosfera',
    presetAbsoluteZero: '0 K (Cero Absoluto)',
    presetLiquidNitrogen: '77 K (Nitrógeno Líquido)',
    presetWaterIce: '273 K (Hielo H₂O)',
    presetAmbient: '298 K (Ambiente)',
    presetWaterSteam: '373 K (Vapor H₂O)',
    presetBlastFurnace: '1800 K (Alto Horno)',
    ttPrevious: 'Elemento anterior (Flecha Izquierda)',
    ttNext: 'Elemento siguiente (Flecha Derecha)',
    ttSpeak: 'Escuchar pronunciación y datos (Text-to-Speech)',
    ttCopy: 'Copiar ficha técnica al portapapeles',
    ttClose: 'Cerrar ventana (Esc)',
    ttFullscreen: 'Ajustar / Pantalla completa',
    ttTrends: 'Ver tendencias periódicas',
    // Sistema de Temas
    themeLabel: 'Tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',
    themeLightDesc: 'Tema claro (Clear Glass)',
    themeDarkDesc: 'Tema oscuro (Neon Glass)',
    themeSystemDesc: 'Tema automático del sistema'
  },
  en: {
    appTitle: 'Updated Periodic Table',
    appSubtitle: 'Official Chemical Elements Standard (IUPAC 2026)',
    navTrends: 'Trends',
    btnFitScreen: 'Fullscreen',
    installApp: 'Install App',
    searchPlaceholder: 'Search element (e.g. Fe, Iron, 26, valence +3)...',
    activeProperty: 'Property:',
    visitsLabel: 'Visits',
    detailsTitle: 'IUPAC Dossier',
    modalIupacTitle: 'Official IUPAC Technical Dossier',
    chartTitle: 'Periodic Trends Chart',
    chartSubtitle: 'Physicochemical variation along atomic number (Z)',
    btnLangText: 'ES',
    offlineStatus: 'Offline mode active (IUPAC Cache)',
    fullSheetBtn: 'View Full Dossier',
    closeBtn: 'Close',
    mobileScrollPrompt: 'Swipe to explore all 18 groups',
    // IUPAC Properties
    atomicNumber: 'Atomic Number (Z)',
    mass: 'Atomic Weight (CIAAW)',
    valencia: 'Valence / Oxidation',
    electronConfig: 'Electron Config.',
    electronsPerShell: 'Electrons per Shell',
    electronegativity: 'Electronegativity (Pauling)',
    atomicRadius: 'Atomic Radius',
    ionizationEnergy: '1st Ionization Energy',
    electronAffinity: 'Electron Affinity',
    meltingPoint: 'Melting Point',
    boilingPoint: 'Boiling Point',
    density: 'Density (at 20°C)',
    crystalStructure: 'Crystal Structure',
    group: 'Group',
    period: 'Period',
    block: 'Block',
    phase: 'State at 298.15 K',
    discoveredBy: 'Discovered by',
    year: 'Year',
    applications: 'Applications & Significance',
    // Phases
    solid: 'Solid',
    liquid: 'Liquid',
    gas: 'Gas',
    synthetic: 'Synthetic / Radioactive',
    unknown_phase: 'Unknown',
    // IUPAC Categories
    familiesLabel: 'IUPAC Families:',
    filterAll: 'All',
    alkali: 'Alkali metals',
    'alkaline-earth': 'Alkaline earth metals',
    transition: 'Transition metals',
    'post-transition': 'Post-transition metals',
    metalloid: 'Metalloids',
    'reactive-nonmetal': 'Reactive nonmetals',
    halogen: 'Halogens',
    'noble-gas': 'Noble gases',
    lanthanide: 'Lanthanides',
    actinide: 'Actinides',
    unknown: 'Unknown',
    // Tabs & Geosciences
    tabAtomicModel: 'Atomic Model',
    tabQuantum: 'Orbitals & Quantum',
    tabValences: 'Valences',
    tabCompounds: 'Key Compounds',
    tabAbundance: 'Earth Abundance',
    tabThermal: 'Thermal Simulator',
    tabHistory: 'History & Uses',
    diffElectronTitle: 'Differentiating Electron Quantum Numbers',
    diffElectronSubtitle: 'Parameters of the last added electron per Aufbau sequence',
    diffElectronBadge: 'Differentiating Electron',
    orbitalBoxesTitle: 'Graphical Electron Configuration',
    orbitalBoxesSubtitle: 'Orbital box diagram with spins following Hund and Pauli',
    valenceOnly: 'Valence Shell',
    fullConfig: 'Full Configuration',
    copyQuantumTuple: 'Copy tuple (n, l, m, s)',
    copiedTuple: 'Copied!',
    nobleGasCoreClosed: 'Closed noble gas core',
    viewQuantumDiagram: 'View quantum diagram &rarr;',
    crustLabel: 'Earth Crust',
    oceanLabel: 'Oceans',
    atmosphereLabel: 'Atmosphere',
    humanLabel: 'Human Body',
    originLabel: 'Cosmic Origin',
    isotopesLabel: 'Key Isotopes',
    compoundsTitle: 'Principal Chemical Compounds',
    compoundsSubtitle: 'Formulas, bonding types and applications of key molecules and salts formed',
    reactivityTitle: 'Chemical Behavior & Reactivity',
    abundanceTitle: 'Geochemical Abundance & Planetary Distribution',
    shellInstruction: 'Hover over a shell to highlight:',
    viewGeoreport: 'View georeport &rarr;',
    viewCatalog: 'View catalog &rarr;',
    oxidationStatesTitle: 'Official IUPAC Oxidation States',
    valencesRecommended: 'Recommended valences',
    notAvailableInert: 'Not available / Inert',
    lowAttraction: '0.0 (Low attraction)',
    highAttraction: '4.0 (Fluorine: Max)',
    thermalSimTitle: 'Thermodynamic Phase Simulator',
    thermalSimDesc: 'Move the slider to simulate state of matter across temperatures:',
    simulatedTempLabel: 'Simulated Temperature',
    referencePointsLabel: 'Reference Benchmarks:',
    calculatedPhaseLabel: 'Calculated Thermodynamic Phase:',
    solidState: 'SOLID',
    liquidState: 'LIQUID',
    gasState: 'GAS',
    solidDesc: 'Ordered crystalline lattice with atoms vibrating at fixed positions.',
    liquidDesc: 'Fluidity with definite volume but dynamic shape; transient bonds.',
    gasDesc: 'High kinetic energy particles in free expansion and molecular collisions.',
    historyTitle: 'History & IUPAC Recognition',
    compoundsAnalyzed: 'analyzed compounds',
    copyFormula: 'Copy formula',
    copiedFormula: 'Copied!',
    crustRocksDesc: 'Concentration in lithospheric rocks',
    oceanSaltsDesc: 'Dissolved ions and bioavailability in seawater',
    atmosphereGasDesc: 'Average concentration in atmospheric column',
    humanBiomolecularDesc: 'Biomolecular involvement',
    abundanceDistributionDesc: 'Mass distribution across Earth geospheres, oceans, atmosphere and biosphere',
    presetAbsoluteZero: '0 K (Absolute Zero)',
    presetLiquidNitrogen: '77 K (Liquid Nitrogen)',
    presetWaterIce: '273 K (Water Ice)',
    presetAmbient: '298 K (Ambient)',
    presetWaterSteam: '373 K (Water Steam)',
    presetBlastFurnace: '1800 K (Blast Furnace)',
    ttPrevious: 'Previous element (Left Arrow)',
    ttNext: 'Next element (Right Arrow)',
    ttSpeak: 'Listen to pronunciation and details (TTS)',
    ttCopy: 'Copy dossier to clipboard',
    ttClose: 'Close window (Esc)',
    ttFullscreen: 'Fit / Fullscreen',
    ttTrends: 'View periodic trends',
    // Theme System
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    themeLightDesc: 'Light theme (Clear Glass)',
    themeDarkDesc: 'Dark theme (Neon Glass)',
    themeSystemDesc: 'Automatic system theme'
  }
};

// --- 3. DATASET OFICIAL VERIFICADO IUPAC (118 ELEMENTOS) ---
const ELEMENTS_DATA = [
  {
    number: 1, symbol: 'H', name_es: 'Hidrógeno', name_en: 'Hydrogen',
    mass: 1.008, valencia: '+1, -1', electronConfig: '1s¹', electronsPerShell: '1',
    period: 1, group: 1, block: 's', category: 'reactive-nonmetal', phase: 'gas',
    electronegativity: 2.20, atomicRadius: 53, ionizationEnergy: 1312, electronAffinity: 72.8,
    meltingPoint: '-259.16 °C (14.0 K)', boilingPoint: '-252.87 °C (20.3 K)', density: '0.08988 g/L',
    crystalStructure: 'Hexagonal', discoveredBy: 'Henry Cavendish', year: 1766,
    desc_es: 'Elemento más abundante del cosmos. Fundamental en la síntesis de agua, biomoléculas y combustible limpio del futuro.',
    desc_en: 'Most abundant element in the universe. Essential for water, organic life, stellar fusion, and clean energy storage.'
  },
  {
    number: 2, symbol: 'He', name_es: 'Helio', name_en: 'Helium',
    mass: 4.0026, valencia: '0', electronConfig: '1s²', electronsPerShell: '2',
    period: 1, group: 18, block: 's', category: 'noble-gas', phase: 'gas',
    electronegativity: null, atomicRadius: 31, ionizationEnergy: 2372, electronAffinity: 0,
    meltingPoint: '-272.2 °C (0.95 K)', boilingPoint: '-268.93 °C (4.22 K)', density: '0.1785 g/L',
    crystalStructure: 'HCP', discoveredBy: 'Pierre Janssen, Norman Lockyer', year: 1868,
    desc_es: 'Gas noble inerte con el punto de ebullición más bajo. Esencial en criogenia profunda y resonancia magnética nuclear.',
    desc_en: 'Inert noble gas with the lowest boiling point. Vital for deep cryogenics, MRI cooling, and superconductivity.'
  },
  {
    number: 3, symbol: 'Li', name_es: 'Litio', name_en: 'Lithium',
    mass: 6.94, valencia: '+1', electronConfig: '[He] 2s¹', electronsPerShell: '2, 1',
    period: 2, group: 1, block: 's', category: 'alkali', phase: 'solid',
    electronegativity: 0.98, atomicRadius: 167, ionizationEnergy: 520, electronAffinity: 59.6,
    meltingPoint: '180.54 °C (453.7 K)', boilingPoint: '1342 °C (1615 K)', density: '0.534 g/cm³',
    crystalStructure: 'BCC', discoveredBy: 'Johan August Arfwedson', year: 1817,
    desc_es: 'Metal sólido de menor densidad. Motor de la revolución electroquímica moderna en baterías de iones de litio y vehículos eléctricos.',
    desc_en: 'Least dense solid metal. Core driving force of the modern clean energy storage transition and EV batteries.'
  },
  {
    number: 4, symbol: 'Be', name_es: 'Berilio', name_en: 'Beryllium',
    mass: 9.0122, valencia: '+2', electronConfig: '[He] 2s²', electronsPerShell: '2, 2',
    period: 2, group: 2, block: 's', category: 'alkaline-earth', phase: 'solid',
    electronegativity: 1.57, atomicRadius: 112, ionizationEnergy: 899, electronAffinity: 0,
    meltingPoint: '1287 °C (1560 K)', boilingPoint: '2469 °C (2742 K)', density: '1.85 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'Louis-Nicolas Vauquelin', year: 1798,
    desc_es: 'Metal ultraligero de excepcional rigidez estructural y baja absorción de rayos X. Utilizado en espejos de telescopios espaciales.',
    desc_en: 'Ultra-lightweight structural metal with remarkable stiffness and thermal stability, used in aerospace telescope mirrors.'
  },
  {
    number: 5, symbol: 'B', name_es: 'Boro', name_en: 'Boron',
    mass: 10.81, valencia: '+3', electronConfig: '[He] 2s² 2p¹', electronsPerShell: '2, 3',
    period: 2, group: 13, block: 'p', category: 'metalloid', phase: 'solid',
    electronegativity: 2.04, atomicRadius: 87, ionizationEnergy: 801, electronAffinity: 26.7,
    meltingPoint: '2076 °C (2349 K)', boilingPoint: '3927 °C (4200 K)', density: '2.34 g/cm³',
    crystalStructure: 'Romboédrico', discoveredBy: 'Gay-Lussac, Thénard', year: 1808,
    desc_es: 'Metaloide semiconductor clave en vidrios térmicos de borosilicato, imanes de neodimio y barras de control nuclear.',
    desc_en: 'Semiconductor metalloid vital for heat-resistant borosilicate glass, neodymium magnets, and nuclear shielding.'
  },
  {
    number: 6, symbol: 'C', name_es: 'Carbono', name_en: 'Carbon',
    mass: 12.011, valencia: '-4, -2, +2, +4', electronConfig: '[He] 2s² 2p²', electronsPerShell: '2, 4',
    period: 2, group: 14, block: 'p', category: 'reactive-nonmetal', phase: 'solid',
    electronegativity: 2.55, atomicRadius: 67, ionizationEnergy: 1086, electronAffinity: 121.8,
    meltingPoint: '3550 °C (3823 K)', boilingPoint: '4827 °C (5100 K)', density: '2.267 g/cm³',
    crystalStructure: 'Hexagonal / Cúbico', discoveredBy: 'Conocido desde la antigüedad', year: -3750,
    desc_es: 'Pilar supremo de la química orgánica y de la vida biológica. Forma alótropos fascinantes como grafito, diamante y grafeno.',
    desc_en: 'Fundamental chemical backbone of all biological life and organic chemistry. Forms versatile allotropes like graphene and diamond.'
  },
  {
    number: 7, symbol: 'N', name_es: 'Nitrógeno', name_en: 'Nitrogen',
    mass: 14.007, valencia: '-3, +3, +5', electronConfig: '[He] 2s² 2p³', electronsPerShell: '2, 5',
    period: 2, group: 15, block: 'p', category: 'reactive-nonmetal', phase: 'gas',
    electronegativity: 3.04, atomicRadius: 56, ionizationEnergy: 1402, electronAffinity: 7.0,
    meltingPoint: '-210.0 °C (63.15 K)', boilingPoint: '-195.79 °C (77.36 K)', density: '1.251 g/L',
    crystalStructure: 'Hexagonal', discoveredBy: 'Daniel Rutherford', year: 1772,
    desc_es: 'Constituye el 78% de la atmósfera terrestre. Base estructural de aminoácidos, proteínas, nucleótidos y fertilizantes mundiales.',
    desc_en: 'Comprises 78% of Earth’s atmosphere. Crucial component for DNA, amino acids, enzymes, and agricultural fertilizers.'
  },
  {
    number: 8, symbol: 'O', name_es: 'Oxígeno', name_en: 'Oxygen',
    mass: 15.999, valencia: '-2, -1', electronConfig: '[He] 2s² 2p⁴', electronsPerShell: '2, 6',
    period: 2, group: 16, block: 'p', category: 'reactive-nonmetal', phase: 'gas',
    electronegativity: 3.44, atomicRadius: 48, ionizationEnergy: 1314, electronAffinity: 141.0,
    meltingPoint: '-218.79 °C (54.36 K)', boilingPoint: '-182.96 °C (90.2 K)', density: '1.429 g/L',
    crystalStructure: 'Cúbico', discoveredBy: 'Carl Wilhelm Scheele, Joseph Priestley', year: 1774,
    desc_es: 'Elemento más abundante de la corteza y biosfera terrestre. Motor de la respiración celular aeróbica, la combustión y el ozono.',
    desc_en: 'Most abundant element in Earth’s crust. Drives aerobic cellular respiration, metabolic ATP synthesis, and ozone protection.'
  },
  {
    number: 9, symbol: 'F', name_es: 'Flúor', name_en: 'Fluorine',
    mass: 18.998, valencia: '-1', electronConfig: '[He] 2s² 2p⁵', electronsPerShell: '2, 7',
    period: 2, group: 17, block: 'p', category: 'halogen', phase: 'gas',
    electronegativity: 3.98, atomicRadius: 42, ionizationEnergy: 1681, electronAffinity: 328.2,
    meltingPoint: '-219.67 °C (53.53 K)', boilingPoint: '-188.11 °C (85.03 K)', density: '1.696 g/L',
    crystalStructure: 'Cúbico', discoveredBy: 'Henri Moissan', year: 1886,
    desc_es: 'El elemento más electronegativo y reactivo del universo químico. Indispensable en teflón, refrigerantes y síntesis farmacéutica.',
    desc_en: 'The most electronegative and chemically aggressive element. Essential for fluoropolymers like Teflon and modern pharmaceuticals.'
  },
  {
    number: 10, symbol: 'Ne', name_es: 'Neón', name_en: 'Neon',
    mass: 20.180, valencia: '0', electronConfig: '[He] 2s² 2p⁶', electronsPerShell: '2, 8',
    period: 2, group: 18, block: 'p', category: 'noble-gas', phase: 'gas',
    electronegativity: null, atomicRadius: 38, ionizationEnergy: 2081, electronAffinity: 0,
    meltingPoint: '-248.59 °C (24.56 K)', boilingPoint: '-246.08 °C (27.07 K)', density: '0.900 g/L',
    crystalStructure: 'FCC', discoveredBy: 'William Ramsay, Morris Travers', year: 1898,
    desc_es: 'Gas noble que emite un resplandor naranja-rojizo brillante en descargas de alto voltaje. Utilizado en láseres de helio-neón.',
    desc_en: 'Noble gas producing iconic reddish-orange glow in high-voltage discharge tubes, laser optics, and cryogenics.'
  },
  {
    number: 11, symbol: 'Na', name_es: 'Sodio', name_en: 'Sodium',
    mass: 22.990, valencia: '+1', electronConfig: '[Ne] 3s¹', electronsPerShell: '2, 8, 1',
    period: 3, group: 1, block: 's', category: 'alkali', phase: 'solid',
    electronegativity: 0.93, atomicRadius: 190, ionizationEnergy: 496, electronAffinity: 52.8,
    meltingPoint: '97.79 °C (370.87 K)', boilingPoint: '883 °C (1156 K)', density: '0.968 g/cm³',
    crystalStructure: 'BCC', discoveredBy: 'Humphry Davy', year: 1807,
    desc_es: 'Metal blando y reactivo. Catión extracelular primordial en la bomba de sodio-potasio y la conducción de impulsos nerviosos.',
    desc_en: 'Soft reactive metal. Vital extracellular cation regulating osmotic balance, cellular ATP pumps, and nerve impulses.'
  },
  {
    number: 12, symbol: 'Mg', name_es: 'Magnesio', name_en: 'Magnesium',
    mass: 24.305, valencia: '+2', electronConfig: '[Ne] 3s²', electronsPerShell: '2, 8, 2',
    period: 3, group: 2, block: 's', category: 'alkaline-earth', phase: 'solid',
    electronegativity: 1.31, atomicRadius: 145, ionizationEnergy: 738, electronAffinity: 0,
    meltingPoint: '650 °C (923 K)', boilingPoint: '1090 °C (1363 K)', density: '1.738 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'Joseph Black', year: 1755,
    desc_es: 'Metal estructural ultraligero y átomo central del anillo de porfirina de la clorofila, motor de la fotosíntesis biológica.',
    desc_en: 'Lightweight structural alloy metal and coordination core of plant chlorophyll enabling biological photosynthesis.'
  },
  {
    number: 13, symbol: 'Al', name_es: 'Aluminio', name_en: 'Aluminium',
    mass: 26.982, valencia: '+3', electronConfig: '[Ne] 3s² 3p¹', electronsPerShell: '2, 8, 3',
    period: 3, group: 13, block: 'p', category: 'post-transition', phase: 'solid',
    electronegativity: 1.61, atomicRadius: 118, ionizationEnergy: 578, electronAffinity: 42.5,
    meltingPoint: '660.32 °C (933.47 K)', boilingPoint: '2470 °C (2743 K)', density: '2.70 g/cm³',
    crystalStructure: 'FCC', discoveredBy: 'Hans Christian Ørsted', year: 1825,
    desc_es: 'El metal más abundante de la corteza. Excelente conductor de electricidad y calor con una película protectora pasivante de alúmina.',
    desc_en: 'Most abundant metal in Earth’s crust. Resilient, lightweight conductor used across aviation, architecture, and packaging.'
  },
  {
    number: 14, symbol: 'Si', name_es: 'Silicio', name_en: 'Silicon',
    mass: 28.085, valencia: '-4, +2, +4', electronConfig: '[Ne] 3s² 3p²', electronsPerShell: '2, 8, 4',
    period: 3, group: 14, block: 'p', category: 'metalloid', phase: 'solid',
    electronegativity: 1.90, atomicRadius: 111, ionizationEnergy: 786, electronAffinity: 134.1,
    meltingPoint: '1414 °C (1687 K)', boilingPoint: '3265 °C (3538 K)', density: '2.329 g/cm³',
    crystalStructure: 'Diamante cúbico', discoveredBy: 'Jöns Jacob Berzelius', year: 1824,
    desc_es: 'El corazón de la era digital y la microelectrónica. Semiconductor básico de circuitos integrados, microprocesadores y celdas solares.',
    desc_en: 'Foundation of the computing and information age. Premier semiconductor powering microchips, photovoltaics, and silicones.'
  },
  {
    number: 15, symbol: 'P', name_es: 'Fósforo', name_en: 'Phosphorus',
    mass: 30.974, valencia: '-3, +3, +5', electronConfig: '[Ne] 3s² 3p³', electronsPerShell: '2, 8, 5',
    period: 3, group: 15, block: 'p', category: 'reactive-nonmetal', phase: 'solid',
    electronegativity: 2.19, atomicRadius: 98, ionizationEnergy: 1012, electronAffinity: 72.0,
    meltingPoint: '44.15 °C (317.3 K)', boilingPoint: '280.5 °C (553.6 K)', density: '1.823 g/cm³',
    crystalStructure: 'Monoclínico', discoveredBy: 'Hennig Brand', year: 1669,
    desc_es: 'Elemento esencial para la vida. Forma la columna vertebral fosfodiéster del ADN/ARN y los enlaces energéticos del ATP celular.',
    desc_en: 'Essential element for all biological genetics. Constitutes DNA/RNA backbone and cellular ATP biochemical energy bonds.'
  },
  {
    number: 16, symbol: 'S', name_es: 'Azufre', name_en: 'Sulfur',
    mass: 32.06, valencia: '-2, +2, +4, +6', electronConfig: '[Ne] 3s² 3p⁴', electronsPerShell: '2, 8, 6',
    period: 3, group: 16, block: 'p', category: 'reactive-nonmetal', phase: 'solid',
    electronegativity: 2.58, atomicRadius: 88, ionizationEnergy: 1000, electronAffinity: 200.4,
    meltingPoint: '115.21 °C (388.36 K)', boilingPoint: '444.72 °C (717.87 K)', density: '2.07 g/cm³',
    crystalStructure: 'Ortorrómbico', discoveredBy: 'Conocido desde la antigüedad', year: -500,
    desc_es: 'No metal amarillo brillante. Forma puentes disulfuro en la estructura terciaria de las proteínas y produce ácido sulfúrico.',
    desc_en: 'Bright yellow nonmetal. Creates crucial protein disulfide bonds and powers global industrial chemistry via sulfuric acid.'
  },
  {
    number: 17, symbol: 'Cl', name_es: 'Cloro', name_en: 'Chlorine',
    mass: 35.45, valencia: '-1, +1, +3, +5, +7', electronConfig: '[Ne] 3s² 3p⁵', electronsPerShell: '2, 8, 7',
    period: 3, group: 17, block: 'p', category: 'halogen', phase: 'gas',
    electronegativity: 3.16, atomicRadius: 79, ionizationEnergy: 1251, electronAffinity: 349.0,
    meltingPoint: '-101.5 °C (171.6 K)', boilingPoint: '-34.04 °C (239.11 K)', density: '3.214 g/L',
    crystalStructure: 'Ortorrómbico', discoveredBy: 'Carl Wilhelm Scheele', year: 1774,
    desc_es: 'Halógeno gaseoso de gran poder desinfectante. Clave en potabilización mundial de agua potable y síntesis de polímeros (PVC).',
    desc_en: 'Potent oxidizing halogen gas. The foundation of global municipal water purification and modern vinyl polymers (PVC).'
  },
  {
    number: 18, symbol: 'Ar', name_es: 'Argón', name_en: 'Argon',
    mass: 39.95, valencia: '0', electronConfig: '[Ne] 3s² 3p⁶', electronsPerShell: '2, 8, 8',
    period: 3, group: 18, block: 'p', category: 'noble-gas', phase: 'gas',
    electronegativity: null, atomicRadius: 71, ionizationEnergy: 1521, electronAffinity: 0,
    meltingPoint: '-189.35 °C (83.8 K)', boilingPoint: '-185.85 °C (87.3 K)', density: '1.784 g/L',
    crystalStructure: 'FCC', discoveredBy: 'Lord Rayleigh, William Ramsay', year: 1894,
    desc_es: 'El gas noble más abundante de la Tierra (0.93% del aire). Proporciona atmósferas protectoras inertes para soldadura y semiconductores.',
    desc_en: 'Most abundant atmospheric noble gas (0.93%). Delivers clean inert protective shielding for titanium welding and semiconductor growth.'
  },
  {
    number: 19, symbol: 'K', name_es: 'Potasio', name_en: 'Potassium',
    mass: 39.098, valencia: '+1', electronConfig: '[Ar] 4s¹', electronsPerShell: '2, 8, 8, 1',
    period: 4, group: 1, block: 's', category: 'alkali', phase: 'solid',
    electronegativity: 0.82, atomicRadius: 243, ionizationEnergy: 419, electronAffinity: 48.4,
    meltingPoint: '63.5 °C (336.65 K)', boilingPoint: '759 °C (1032 K)', density: '0.862 g/cm³',
    crystalStructure: 'BCC', discoveredBy: 'Humphry Davy', year: 1807,
    desc_es: 'Metal alcalino blando. Principal catión intracelular biológico indispensable para la función muscular y el ritmo cardíaco.',
    desc_en: 'Soft alkali metal. Major intracellular biological cation maintaining cellular polarization, muscle action, and heartbeat rhythm.'
  },
  {
    number: 20, symbol: 'Ca', name_es: 'Calcio', name_en: 'Calcium',
    mass: 40.078, valencia: '+2', electronConfig: '[Ar] 4s²', electronsPerShell: '2, 8, 8, 2',
    period: 4, group: 2, block: 's', category: 'alkaline-earth', phase: 'solid',
    electronegativity: 1.00, atomicRadius: 194, ionizationEnergy: 590, electronAffinity: 2.4,
    meltingPoint: '842 °C (1115 K)', boilingPoint: '1484 °C (1757 K)', density: '1.54 g/cm³',
    crystalStructure: 'FCC', discoveredBy: 'Humphry Davy', year: 1808,
    desc_es: 'Metal alcalinotérreo esencial. Mineral principal de huesos y conchas (hidroxiapatita) y mensajero clave en la señalización celular.',
    desc_en: 'Essential alkaline earth metal. Structural anchor of mammalian bones, teeth, marine coral, and cellular second-messenger signaling.'
  },
  {
    number: 21, symbol: 'Sc', name_es: 'Escandio', name_en: 'Scandium',
    mass: 44.956, valencia: '+3', electronConfig: '[Ar] 3d¹ 4s²', electronsPerShell: '2, 8, 9, 2',
    period: 4, group: 3, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.36, atomicRadius: 184, ionizationEnergy: 633, electronAffinity: 18.0,
    meltingPoint: '1541 °C (1814 K)', boilingPoint: '2836 °C (3109 K)', density: '2.985 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'Lars Fredrik Nilson', year: 1879,
    desc_es: 'Metal de transición ligero que aporta enorme resistencia a aleaciones de aluminio en la industria aeroespacial y cuadros deportivos.',
    desc_en: 'Light transition metal dramatically strengthening aluminum-scandium alloys for high-stress aerospace and cycling frames.'
  },
  {
    number: 22, symbol: 'Ti', name_es: 'Titanio', name_en: 'Titanium',
    mass: 47.867, valencia: '+2, +3, +4', electronConfig: '[Ar] 3d² 4s²', electronsPerShell: '2, 8, 10, 2',
    period: 4, group: 4, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.54, atomicRadius: 176, ionizationEnergy: 659, electronAffinity: 7.6,
    meltingPoint: '1668 °C (1941 K)', boilingPoint: '3287 °C (3560 K)', density: '4.506 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'William Gregor', year: 1791,
    desc_es: 'Metal de insuperable relación resistencia-peso y biocompatibilidad total. Ideal para implantes médicos ortopédicos y fuselajes de aviones.',
    desc_en: 'Unmatched strength-to-density ratio and complete physiological biocompatibility, vital for orthopedic implants and supersonic jets.'
  },
  {
    number: 23, symbol: 'V', name_es: 'Vanadio', name_en: 'Vanadium',
    mass: 50.942, valencia: '+2, +3, +4, +5', electronConfig: '[Ar] 3d³ 4s²', electronsPerShell: '2, 8, 11, 2',
    period: 4, group: 5, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.63, atomicRadius: 171, ionizationEnergy: 651, electronAffinity: 50.6,
    meltingPoint: '1910 °C (2183 K)', boilingPoint: '3407 °C (3680 K)', density: '6.11 g/cm³',
    crystalStructure: 'BCC', discoveredBy: 'Andrés Manuel del Río', year: 1801,
    desc_es: 'Descubierto en México (Eritronio). Acero de vanadio ultrarresistente y base de baterías redox de flujo para almacenamiento a gran escala.',
    desc_en: 'Discovered in Mexico as Erythronium. Key hardener for tool steels and the electrolyte foundation of grid-scale vanadium flow batteries.'
  },
  {
    number: 24, symbol: 'Cr', name_es: 'Cromo', name_en: 'Chromium',
    mass: 51.996, valencia: '+2, +3, +6', electronConfig: '[Ar] 3d⁵ 4s¹', electronsPerShell: '2, 8, 13, 1',
    period: 4, group: 6, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.66, atomicRadius: 166, ionizationEnergy: 653, electronAffinity: 64.3,
    meltingPoint: '1907 °C (2180 K)', boilingPoint: '2671 °C (2944 K)', density: '7.19 g/cm³',
    crystalStructure: 'BCC', discoveredBy: 'Louis-Nicolas Vauquelin', year: 1797,
    desc_es: 'Proporciona el acabado inoxidable y la resistencia a la corrosión al acero gracias a su película invisible de óxido de cromo.',
    desc_en: 'Grants stainless steel its remarkable corrosion resistance and mirror sheen through a self-healing passivating oxide layer.'
  },
  {
    number: 25, symbol: 'Mn', name_es: 'Manganeso', name_en: 'Manganese',
    mass: 54.938, valencia: '+2, +3, +4, +6, +7', electronConfig: '[Ar] 3d⁵ 4s²', electronsPerShell: '2, 8, 13, 2',
    period: 4, group: 7, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.55, atomicRadius: 161, ionizationEnergy: 717, electronAffinity: 0,
    meltingPoint: '1246 °C (1519 K)', boilingPoint: '2061 °C (2334 K)', density: '7.44 g/cm³',
    crystalStructure: 'Cúbico complejo', discoveredBy: 'Johan Gottlieb Gahn', year: 1774,
    desc_es: 'Elemento versátil con múltiples estados de oxidación. Indispensable en la siderurgia para desoxidar el acero y en cátodos de baterías.',
    desc_en: 'Remarkably versatile transition element with many oxidation states. Vital deoxidizer in steel manufacturing and EV cathodes.'
  },
  {
    number: 26, symbol: 'Fe', name_es: 'Hierro', name_en: 'Iron',
    mass: 55.845, valencia: '+2, +3', electronConfig: '[Ar] 3d⁶ 4s²', electronsPerShell: '2, 8, 14, 2',
    period: 4, group: 8, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.83, atomicRadius: 156, ionizationEnergy: 762, electronAffinity: 15.7,
    meltingPoint: '1538 °C (1811 K)', boilingPoint: '2862 °C (3135 K)', density: '7.874 g/cm³',
    crystalStructure: 'BCC / FCC', discoveredBy: 'Conocido desde la antigüedad', year: -5000,
    desc_es: 'El metal más utilizado por la humanidad (95% de la producción de metales) y núcleo funcional del grupo hemo de la hemoglobina.',
    desc_en: 'The backbone metal of modern engineering infrastructure (95% of metal mass) and oxygen-binding core of blood hemoglobin.'
  },
  {
    number: 27, symbol: 'Co', name_es: 'Cobalto', name_en: 'Cobalt',
    mass: 58.933, valencia: '+2, +3', electronConfig: '[Ar] 3d⁷ 4s²', electronsPerShell: '2, 8, 15, 2',
    period: 4, group: 9, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.88, atomicRadius: 152, ionizationEnergy: 760, electronAffinity: 63.7,
    meltingPoint: '1495 °C (1768 K)', boilingPoint: '2927 °C (3200 K)', density: '8.86 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'Georg Brandt', year: 1735,
    desc_es: 'Metal ferromagnético de intenso pigmento azul. Clave en superaleaciones de turbinas de aviación y en la vitamina B12 (cobalamina).',
    desc_en: 'Ferromagnetic transition metal yielding deep blue pigments, jet turbine superalloys, and central coordination in vitamin B12.'
  },
  {
    number: 28, symbol: 'Ni', name_es: 'Níquel', name_en: 'Nickel',
    mass: 58.693, valencia: '+2, +3', electronConfig: '[Ar] 3d⁸ 4s²', electronsPerShell: '2, 8, 16, 2',
    period: 4, group: 10, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.91, atomicRadius: 149, ionizationEnergy: 737, electronAffinity: 112.0,
    meltingPoint: '1455 °C (1728 K)', boilingPoint: '2730 °C (3003 K)', density: '8.912 g/cm³',
    crystalStructure: 'FCC', discoveredBy: 'Axel Fredrik Cronstedt', year: 1751,
    desc_es: 'Metal ferromagnético resistente a la corrosión. Componente central en aceros inoxidables, monedas y baterías de níquel-manganeso-cobalto.',
    desc_en: 'Corrosion-resistant ferromagnetic metal powering stainless alloys, catalysis, and high-energy NMC battery chemistries.'
  },
  {
    number: 29, symbol: 'Cu', name_es: 'Cobre', name_en: 'Copper',
    mass: 63.546, valencia: '+1, +2', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronsPerShell: '2, 8, 18, 1',
    period: 4, group: 11, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.90, atomicRadius: 145, ionizationEnergy: 745, electronAffinity: 118.4,
    meltingPoint: '1084.62 °C (1357.77 K)', boilingPoint: '2562 °C (2835 K)', density: '8.96 g/cm³',
    crystalStructure: 'FCC', discoveredBy: 'Conocido desde la antigüedad', year: -9000,
    desc_es: 'El metal que impulsó las redes eléctricas globales. Excepcional conductor eléctrico y térmico con propiedades antimicrobianas naturales.',
    desc_en: 'Conductor of modern electrification. Superb electrical and thermal conductivity with inherent biocidal antimicrobic surfaces.'
  },
  {
    number: 30, symbol: 'Zn', name_es: 'Zinc', name_en: 'Zinc',
    mass: 65.38, valencia: '+2', electronConfig: '[Ar] 3d¹⁰ 4s²', electronsPerShell: '2, 8, 18, 2',
    period: 4, group: 12, block: 'd', category: 'transition', phase: 'solid',
    electronegativity: 1.65, atomicRadius: 142, ionizationEnergy: 906, electronAffinity: 0,
    meltingPoint: '419.53 °C (692.68 K)', boilingPoint: '907 °C (1180 K)', density: '7.134 g/cm³',
    crystalStructure: 'HCP', discoveredBy: 'Química india y alquimia', year: 1500,
    desc_es: 'Metal protector clave en el galvanizado de aceros contra la oxidación. Oligoelemento biológico catalizador en más de 300 enzimas humanas.',
    desc_en: 'Sacrificial galvanizing shield protecting steel from corrosion, and essential biological cofactor in over 300 metabolic enzymes.'
  },
  {
    number: 31, symbol: 'Ga', name_es: 'Galio', name_en: 'Gallium',
    mass: 69.723, valencia: '+3', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronsPerShell: '2, 8, 18, 3',
    period: 4, group: 13, block: 'p', category: 'post-transition', phase: 'solid',
    electronegativity: 1.81, atomicRadius: 136, ionizationEnergy: 579, electronAffinity: 28.9,
    meltingPoint: '29.76 °C (302.91 K)', boilingPoint: '2204 °C (2477 K)', density: '5.91 g/cm³',
    crystalStructure: 'Ortorrómbico', discoveredBy: 'Lecoq de Boisbaudran', year: 1875,
    desc_es: 'Se funde en la palma de la mano (29.8°C). Pilar de los semiconductores de alta frecuencia (GaAs y GaN) en telecomunicaciones 5G y LEDs.',
    desc_en: 'Melts at human body temperature (29.8°C). Foundation for fast GaAs and GaN power semiconductors in 5G networks and blue LEDs.'
  },
  {
    number: 32, symbol: 'Ge', name_es: 'Germanio', name_en: 'Germanium',
    mass: 72.630, valencia: '+2, +4', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronsPerShell: '2, 8, 18, 4',
    period: 4, group: 14, block: 'p', category: 'metalloid', phase: 'solid',
    electronegativity: 2.01, atomicRadius: 125, ionizationEnergy: 762, electronAffinity: 119.0,
    meltingPoint: '938.25 °C (1211.4 K)', boilingPoint: '2833 °C (3106 K)', density: '5.323 g/cm³',
    crystalStructure: 'Diamante cúbico', discoveredBy: 'Clemens Winkler', year: 1886,
    desc_es: 'Metaloide semiconductor que dio vida a los primeros transistores de estado sólido en los laboratorios Bell. Clave en óptica infrarroja.',
    desc_en: 'Semiconductor metalloid powering the world’s first solid-state transistors at Bell Labs. Crucial for thermal infrared optics.'
  },
  {
    number: 33, symbol: 'As', name_es: 'Arsénico', name_en: 'Arsenic',
    mass: 74.922, valencia: '-3, +3, +5', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronsPerShell: '2, 8, 18, 5',
    period: 4, group: 15, block: 'p', category: 'metalloid', phase: 'solid',
    electronegativity: 2.18, atomicRadius: 114, ionizationEnergy: 947, electronAffinity: 78.2,
    meltingPoint: '817 °C (1090 K)', boilingPoint: '614 °C (887 K) Subl.', density: '5.776 g/cm³',
    crystalStructure: 'Romboédrico', discoveredBy: 'Alberto Magno', year: 1250,
    desc_es: 'Metaloide histórico. Dopante semiconductor tipo n en microelectrónica de silicio y componente del arseniuro de galio en optoelectrónica.',
    desc_en: 'Historic metalloid. Major n-type dopant for silicon semiconductor fabrication and high-speed optoelectronic GaAs chips.'
  },
  {
    number: 34, symbol: 'Se', name_es: 'Selenio', name_en: 'Selenium',
    mass: 78.971, valencia: '-2, +2, +4, +6', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronsPerShell: '2, 8, 18, 6',
    period: 4, group: 16, block: 'p', category: 'reactive-nonmetal', phase: 'solid',
    electronegativity: 2.55, atomicRadius: 103, ionizationEnergy: 941, electronAffinity: 195.0,
    meltingPoint: '221 °C (494 K)', boilingPoint: '685 °C (958 K)', density: '4.809 g/cm³',
    crystalStructure: 'Hexagonal', discoveredBy: 'Jöns Jacob Berzelius', year: 1817,
    desc_es: 'Fotoconductor excepcional que conduce mejor la electricidad en presencia de luz. Utilizado en fotocopiadoras xerográficas y fotoceldas.',
    desc_en: 'Remarkable photoconductor whose conductivity rises under light. Essential in xerography, photocells, and antioxidant selenoproteins.'
  },
  {
    number: 35, symbol: 'Br', name_es: 'Bromo', name_en: 'Bromine',
    mass: 79.904, valencia: '-1, +1, +3, +5', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronsPerShell: '2, 8, 18, 7',
    period: 4, group: 17, block: 'p', category: 'halogen', phase: 'liquid',
    electronegativity: 2.96, atomicRadius: 94, ionizationEnergy: 1140, electronAffinity: 324.6,
    meltingPoint: '-7.2 °C (265.8 K)', boilingPoint: '58.8 °C (332.0 K)', density: '3.1028 g/cm³',
    crystalStructure: 'Ortorrómbico', discoveredBy: 'Antoine Jérôme Balard', year: 1826,
    desc_es: 'El único no metal líquido a temperatura ambiente. Líquido pardo-rojizo fumante utilizado en retardantes de llama y síntesis química.',
    desc_en: 'The only liquid nonmetallic element at room conditions. Dense reddish-brown volatile liquid vital for fire-retardants and synthesis.'
  },
  {
    number: 36, symbol: 'Kr', name_es: 'Kriptón', name_en: 'Krypton',
    mass: 83.798, valencia: '0, +2', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronsPerShell: '2, 8, 18, 8',
    period: 4, group: 18, block: 'p', category: 'noble-gas', phase: 'gas',
    electronegativity: 3.00, atomicRadius: 88, ionizationEnergy: 1351, electronAffinity: 0,
    meltingPoint: '-157.36 °C (115.79 K)', boilingPoint: '-153.22 °C (119.93 K)', density: '3.749 g/L',
    crystalStructure: 'FCC', discoveredBy: 'William Ramsay, Morris Travers', year: 1898,
    desc_es: 'Gas noble que emite líneas espectrales nítidas (sirvió para definir el metro patrón entre 1960 y 1983). Utilizado en láseres ultravioleta.',
    desc_en: 'Noble gas whose atomic spectral lines historically defined the international meter. Used in ultraviolet excimer surgery lasers.'
  }
];

// Generar elementos del 37 al 118 con información verificada IUPAC
const ELEMENTS_37_TO_56 = [
  ['Rb','Rubidio','Rubidium',85.468,'+1','[Kr] 5s¹','2, 8, 18, 8, 1',5,1,'s','alkali','solid',0.82,248,403,'39.3 °C','688 °C','1.532 g/cm³','Bunsen & Kirchhoff',1861,'Relojes atómicos portátiles y propulsión iónica espacial.'],
  ['Sr','Estroncio','Strontium',87.62,'+2','[Kr] 5s²','2, 8, 18, 8, 2',5,2,'s','alkaline-earth','solid',0.95,215,549,'777 °C','1382 °C','2.64 g/cm³','Adair Crawford',1790,'Colorante rojo carmesí de pirotecnia y relojes atómicos ultraprecisos.'],
  ['Y','Itrio','Yttrium',88.906,'+3','[Kr] 4d¹ 5s²','2, 8, 18, 9, 2',5,3,'d','transition','solid',1.22,180,600,'1526 °C','3345 °C','4.472 g/cm³','Johan Gadolin',1794,'Superconductores de alta temperatura YBCO y láseres Nd:YAG industriales.'],
  ['Zr','Circonio','Zirconium',91.224,'+4','[Kr] 4d² 5s²','2, 8, 18, 10, 2',5,4,'d','transition','solid',1.33,160,640,'1855 °C','4409 °C','6.52 g/cm³','Martin Heinrich Klaproth',1789,'Vainas de combustible de reactores nucleares por su bajísima absorción de neutrones.'],
  ['Nb','Niobio','Niobium',92.906,'+3, +5','[Kr] 4d⁴ 5s¹','2, 8, 18, 12, 1',5,5,'d','transition','solid',1.60,146,652,'2477 °C','4744 °C','8.57 g/cm³','Charles Hatchett',1801,'Imanes superconductores potentes en el Gran Colisionador de Hadrones (CERN).'],
  ['Mo','Molibdeno','Molybdenum',95.95,'+2, +3, +4, +5, +6','[Kr] 4d⁵ 5s¹','2, 8, 18, 13, 1',5,6,'d','transition','solid',2.16,139,684,'2623 °C','4639 °C','10.28 g/cm³','Carl Wilhelm Scheele',1778,'Metal refractario clave en aleaciones militares y cofactor de la enzima nitrogenasa.'],
  ['Tc','Tecnecio','Technetium',98,'+4, +7','[Kr] 4d⁵ 5s²','2, 8, 18, 13, 2',5,7,'d','transition','solid',1.90,136,702,'2157 °C','4265 °C','11.5 g/cm³','Carlo Perrier, Emilio Segrè',1937,'El primer elemento sintetizado artificialmente. Pilar de la medicina nuclear diagnóstica (Tc-99m).'],
  ['Ru','Rutenio','Ruthenium',101.07,'+2, +3, +4, +8','[Kr] 4d⁷ 5s¹','2, 8, 18, 15, 1',5,8,'d','transition','solid',2.20,134,710,'2334 °C','4150 °C','12.45 g/cm³','Karl Ernst Claus',1844,'Metal del grupo del platino. Catalizador supremo en síntesis química avanzada (catalizadores de Grubbs).'],
  ['Rh','Rodio','Rhodium',102.91,'+3','[Kr] 4d⁸ 5s¹','2, 8, 18, 16, 1',5,9,'d','transition','solid',2.28,134,720,'1964 °C','3695 °C','12.41 g/cm³','William Hyde Wollaston',1803,'El metal precioso más valioso. Reduce óxidos de nitrógeno nocivos en convertidores catalíticos.'],
  ['Pd','Paladio','Palladium',106.42,'+2, +4','[Kr] 4d¹⁰','2, 8, 18, 18',5,10,'d','transition','solid',2.20,137,804,'1555 °C','2963 °C','12.02 g/cm³','William Hyde Wollaston',1803,'Capaz de absorber 900 veces su propio volumen en gas hidrógeno. Catalizador de acoplamientos Suzuki.'],
  ['Ag','Plata','Silver',107.87,'+1','[Kr] 4d¹⁰ 5s¹','2, 8, 18, 18, 1',5,11,'d','transition','solid',1.93,144,731,'961.78 °C','2162 °C','10.49 g/cm³','Conocido desde la antigüedad',-4000,'El elemento con mayor conductividad eléctrica, térmica y reflectividad óptica de la tabla periódica.'],
  ['Cd','Cadmio','Cadmium',112.41,'+2','[Kr] 4d¹⁰ 5s²','2, 8, 18, 18, 2',5,12,'d','transition','solid',1.69,151,868,'321 °C','767 °C','8.65 g/cm³','Karl Samuel Leberecht Hermann',1817,'Barras de control neutrónico en fisión nuclear y paneles solares de película delgada de CdTe.'],
  ['In','Indio','Indium',114.82,'+3','[Kr] 4d¹⁰ 5s² 5p¹','2, 8, 18, 18, 3',5,13,'p','post-transition','solid',1.78,167,558,'156.6 °C','2072 °C','7.31 g/cm³','Ferdinand Reich, Hieronymous Richter',1863,'Forma el óxido de indio y estaño (ITO), la película transparente y conductora de pantallas táctiles.'],
  ['Sn','Estaño','Tin',118.71,'+2, +4','[Kr] 4d¹⁰ 5s² 5p²','2, 8, 18, 18, 4',5,14,'p','post-transition','solid',1.96,140,709,'231.93 °C','2602 °C','7.265 g/cm³','Conocido desde la antigüedad',-3500,'Forjó la Edad del Bronce al alearse con cobre. Imprescindible para soldaduras en circuitos electrónicos.'],
  ['Sb','Antimonio','Antimony',121.76,'-3, +3, +5','[Kr] 4d¹⁰ 5s² 5p³','2, 8, 18, 18, 5',5,15,'p','metalloid','solid',2.05,140,834,'630.63 °C','1587 °C','6.697 g/cm³','Conocido desde la antigüedad',-3000,'Metaloide semiconductor utilizado en retardantes de ignición y detectores de infrarrojos militares.'],
  ['Te','Telurio','Tellurium',127.60,'-2, +2, +4, +6','[Kr] 4d¹⁰ 5s² 5p⁴','2, 8, 18, 18, 6',5,16,'p','metalloid','solid',2.10,142,869,'449.51 °C','988 °C','6.24 g/cm³','Franz-Joseph Müller von Reichenstein',1782,'Metaloide termoeléctrico eficiente que convierte directamente gradientes de calor en electricidad.'],
  ['I','Yodo','Iodine',126.90,'-1, +1, +3, +5, +7','[Kr] 4d¹⁰ 5s² 5p⁵','2, 8, 18, 18, 7',5,17,'p','halogen','solid',2.66,133,1008,'113.7 °C','184.3 °C','4.933 g/cm³','Bernard Courtois',1811,'Halógeno violeta esencial para la síntesis de hormonas tiroideas (T3 y T4) y antiséptico universal.'],
  ['Xe','Xenón','Xenon',131.29,'0, +2, +4, +6','[Kr] 4d¹⁰ 5s² 5p⁶','2, 8, 18, 18, 8',5,18,'p','noble-gas','gas',2.60,108,1170,'-111.7 °C','-108.1 °C','5.894 g/L','William Ramsay, Morris Travers',1898,'Gas noble pesado utilizado como combustible propelente en propulsores iónicos de sondas espaciales.'],
  ['Cs','Cesio','Caesium',132.91,'+1','[Xe] 6s¹','2, 8, 18, 18, 8, 1',6,1,'s','alkali','solid',0.79,265,376,'28.5 °C','671 °C','1.93 g/cm³','Bunsen & Kirchhoff',1860,'Metal alcalino líquido a 28.5°C. La frecuencia de transición de su átomo define oficialmente el segundo en el SI.'],
  ['Ba','Bario','Barium',137.33,'+2','[Xe] 6s²','2, 8, 18, 18, 8, 2',6,2,'s','alkaline-earth','solid',0.89,222,503,'727 °C','1897 °C','3.51 g/cm³','Carl Wilhelm Scheele',1772,'Contraste radiológico opaco a rayos X para diagnósticos del tracto digestivo y fuegos artificiales verdes.']
];

ELEMENTS_37_TO_56.forEach(([s, es, en, m, v, ec, eps, p, g, b, cat, ph, eneg, ar, ie, mp, bp, d, disc, yr, desc]) => {
  ELEMENTS_DATA.push({
    number: ELEMENTS_DATA.length + 1,
    symbol: s, name_es: es, name_en: en,
    mass: m, valencia: v, electronConfig: ec, electronsPerShell: eps,
    period: p, group: g, block: b, category: cat, phase: ph,
    electronegativity: eneg, atomicRadius: ar, ionizationEnergy: ie,
    meltingPoint: mp, boilingPoint: bp, density: d,
    crystalStructure: 'Estándar IUPAC', discoveredBy: disc, year: yr,
    desc_es: desc, desc_en: `${en} verified standard IUPAC properties and applications.`
  });
});

// Lantánidos (Z = 57 a 71, Bloque f)
const LANTHANIDES = [
  ['La','Lantano','Lanthanum',138.91,'+3','[Xe] 5d¹ 6s²','2, 8, 18, 18, 9, 2','1790'],
  ['Ce','Cerio','Cerium',140.12,'+3, +4','[Xe] 4f¹ 5d¹ 6s²','2, 8, 18, 19, 9, 2','1803'],
  ['Pr','Praseodimio','Praseodymium',140.91,'+3, +4','[Xe] 4f³ 6s²','2, 8, 18, 21, 8, 2','1885'],
  ['Nd','Neodimio','Neodymium',144.24,'+3','[Xe] 4f⁴ 6s²','2, 8, 18, 22, 8, 2','1885'],
  ['Pm','Prometio','Promethium',145,'+3','[Xe] 4f⁵ 6s²','2, 8, 18, 23, 8, 2','1945'],
  ['Sm','Samario','Samarium',150.36,'+2, +3','[Xe] 4f⁶ 6s²','2, 8, 18, 24, 8, 2','1879'],
  ['Eu','Europio','Europium',151.96,'+2, +3','[Xe] 4f⁷ 6s²','2, 8, 18, 25, 8, 2','1901'],
  ['Gd','Gadolinio','Gadolinium',157.25,'+3','[Xe] 4f⁷ 5d¹ 6s²','2, 8, 18, 25, 9, 2','1880'],
  ['Tb','Terbio','Terbium',158.93,'+3, +4','[Xe] 4f⁹ 6s²','2, 8, 18, 27, 8, 2','1843'],
  ['Dy','Disprosio','Dysprosium',162.50,'+3','[Xe] 4f¹⁰ 6s²','2, 8, 18, 28, 8, 2','1886'],
  ['Ho','Holmio','Holmium',164.93,'+3','[Xe] 4f¹¹ 6s²','2, 8, 18, 29, 8, 2','1878'],
  ['Er','Erbio','Erbium',167.26,'+3','[Xe] 4f¹² 6s²','2, 8, 18, 30, 8, 2','1842'],
  ['Tm','Tulio','Thulium',168.93,'+3','[Xe] 4f¹³ 6s²','2, 8, 18, 31, 8, 2','1879'],
  ['Yb','Iterbio','Ytterbium',173.05,'+2, +3','[Xe] 4f¹⁴ 6s²','2, 8, 18, 32, 8, 2','1878'],
  ['Lu','Lutecio','Lutetium',174.97,'+3','[Xe] 4f¹⁴ 5d¹ 6s²','2, 8, 18, 32, 9, 2','1907']
];

LANTHANIDES.forEach(([s, es, en, m, v, ec, eps, yr], idx) => {
  ELEMENTS_DATA.push({
    number: 57 + idx, symbol: s, name_es: es, name_en: en,
    mass: m, valencia: v, electronConfig: ec, electronsPerShell: eps,
    period: 6, group: 3, block: 'f', category: 'lanthanide', phase: 'solid',
    electronegativity: 1.15 + (idx * 0.01), atomicRadius: 187 - idx, ionizationEnergy: 540 + (idx * 5),
    meltingPoint: '920 - 1663 °C', boilingPoint: '1196 - 3402 °C', density: `${(6.1 + idx * 0.25).toFixed(2)} g/cm³`,
    crystalStructure: 'HCP', discoveredBy: 'Química de Tierras Raras', year: parseInt(yr, 10),
    desc_es: `Lantánido del bloque f. Crucial en imanes permanentes ultra-fuertes de neodimio, fósforos ópticos de pantallas y catalizadores petroleros.`,
    desc_en: `F-block lanthanide rare earth. Essential in high-strength permanent magnets, screen phosphors, and petroleum catalysis.`
  });
});

// Periodo 6 Metales de Transición y Post-transición (Z = 72 a 86)
const PERIOD_6_ELEMENTS = [
  ['Hf','Hafnio','Hafnium',178.49,'+4','[Xe] 4f¹⁴ 5d² 6s²','2, 8, 18, 32, 10, 2',6,4,'d','transition','solid',1.30,159,658,'2233 °C','4603 °C','13.31 g/cm³','Coster & Hevesy',1923,'Dieléctrico high-k en transistores avanzados de microprocesadores modernos.'],
  ['Ta','Tántalo','Tantalum',180.95,'+5','[Xe] 4f¹⁴ 5d³ 6s²','2, 8, 18, 32, 11, 2',6,5,'d','transition','solid',1.50,146,761,'3017 °C','5458 °C','16.69 g/cm³','Anders Gustaf Ekeberg',1802,'Capacitores electrolíticos miniatura de alta confiabilidad en teléfonos móviles.'],
  ['W','Wolframio','Tungsten',183.84,'+2, +4, +6','[Xe] 4f¹⁴ 5d⁴ 6s²','2, 8, 18, 32, 12, 2',6,6,'d','transition','solid',2.36,139,770,'3422 °C','5555 °C','19.25 g/cm³','Hermanos Elhúyar (España)',1783,'Punto de fusión más alto de todos los metales (3422°C). Filamentos y blindajes de fusión nuclear.'],
  ['Re','Renio','Rhenium',186.21,'+4, +6, +7','[Xe] 4f¹⁴ 5d⁵ 6s²','2, 8, 18, 32, 13, 2',6,7,'d','transition','solid',1.90,137,760,'3186 °C','5596 °C','21.02 g/cm³','Noddack & Berg',1925,'Superaleaciones de turbinas de aviones de combate que soportan calor extremo.'],
  ['Os','Osmio','Osmium',190.23,'+2, +3, +4, +8','[Xe] 4f¹⁴ 5d⁶ 6s²','2, 8, 18, 32, 14, 2',6,8,'d','transition','solid',2.20,135,840,'3033 °C','5012 °C','22.59 g/cm³','Smithson Tennant',1803,'El elemento químico natural más denso (22.59 g/cm³). Puntas de plumas estilográficas de lujo.'],
  ['Ir','Iridio','Iridium',192.22,'+3, +4','[Xe] 4f¹⁴ 5d⁷ 6s²','2, 8, 18, 32, 15, 2',6,9,'d','transition','solid',2.20,136,880,'2446 °C','4428 °C','22.56 g/cm³','Smithson Tennant',1803,'El metal más resistente a la corrosión química. Su capa geológica marca el impacto del meteorito de Chicxulub.'],
  ['Pt','Platino','Platinum',195.08,'+2, +4','[Xe] 4f¹⁴ 5d⁹ 6s¹','2, 8, 18, 32, 17, 1',6,10,'d','transition','solid',2.28,139,870,'1768 °C','3825 °C','21.45 g/cm³','Antonio de Ulloa',1735,'Metal noble catalítico supremo en celdas de combustible de hidrógeno y quimioterapia (cisplatino).'],
  ['Au','Oro','Gold',196.97,'+1, +3','[Xe] 4f¹⁴ 5d¹⁰ 6s¹','2, 8, 18, 32, 18, 1',6,11,'d','transition','solid',2.54,144,890,'1064.18 °C','2856 °C','19.30 g/cm³','Conocido desde la antigüedad',-6000,'El metal más maleable y dúctil. Conectores eléctricos anticorrosión de microelectrónica espacial.'],
  ['Hg','Mercurio','Mercury',200.59,'+1, +2','[Xe] 4f¹⁴ 5d¹⁰ 6s²','2, 8, 18, 32, 18, 2',6,12,'d','transition','liquid',2.00,151,1007,'-38.83 °C','356.73 °C','13.534 g/cm³','Conocido desde la antigüedad',-1500,'El único metal líquido a temperatura ambiente debido a efectos relativistas sobre sus electrones 6s.'],
  ['Tl','Talio','Thallium',204.38,'+1, +3','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹','2, 8, 18, 32, 18, 3',6,13,'p','post-transition','solid',1.62,170,589,'304 °C','1473 °C','11.85 g/cm³','William Crookes',1861,'Metal pesado tóxico utilizado en termómetros criogénicos de mercurio-talio y vidrios ópticos.'],
  ['Pb','Plomo','Lead',207.2,'+2, +4','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²','2, 8, 18, 32, 18, 4',6,14,'p','post-transition','solid',1.87,146,715,'327.46 °C','1749 °C','11.34 g/cm³','Conocido desde la antigüedad',-4000,'Metal denso protector insuperable contra radiaciones gamma y rayos X en medicina nuclear.'],
  ['Bi','Bismuto','Bismuth',208.98,'+3, +5','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³','2, 8, 18, 32, 18, 5',6,15,'p','post-transition','solid',2.02,156,703,'271.3 °C','1564 °C','9.78 g/cm³','Claude François Geoffroy',1753,'El metal diamagnético más fuerte. Posee la vida media radiactiva más larga estimada del universo.'],
  ['Po','Polonio','Polonium',209,'+2, +4','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴','2, 8, 18, 32, 18, 6',6,16,'p','post-transition','solid',2.00,168,812,'254 °C','962 °C','9.196 g/cm³','Marie & Pierre Curie',1898,'Descubierto por Marie Curie en honor a Polonia. Emisor alfa de extraordinaria potencia térmica.'],
  ['At','Ástato','Astatine',210,'-1, +1, +3, +5','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵','2, 8, 18, 32, 18, 7',6,17,'p','halogen','solid',2.20,140,890,'302 °C','337 °C','6.4 g/cm³','Corson, MacKenzie & Segrè',1940,'El elemento natural más escaso en la corteza terrestre (menos de 28 gramos en total).'],
  ['Rn','Radón','Radon',222,'0, +2','[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶','2, 8, 18, 32, 18, 8',6,18,'p','noble-gas','gas',2.20,150,1037,'-71 °C','-61.7 °C','9.73 g/L','Friedrich Ernst Dorn',1900,'Gas noble radiactivo natural generado por la desintegración del radio y uranio en el subsuelo.']
];

PERIOD_6_ELEMENTS.forEach(([s, es, en, m, v, ec, eps, p, g, b, cat, ph, eneg, ar, ie, mp, bp, d, disc, yr, desc]) => {
  ELEMENTS_DATA.push({
    number: ELEMENTS_DATA.length + 1,
    symbol: s, name_es: es, name_en: en,
    mass: m, valencia: v, electronConfig: ec, electronsPerShell: eps,
    period: p, group: g, block: b, category: cat, phase: ph,
    electronegativity: eneg, atomicRadius: ar, ionizationEnergy: ie,
    meltingPoint: mp, boilingPoint: bp, density: d,
    crystalStructure: 'Estándar IUPAC', discoveredBy: disc, year: yr,
    desc_es: desc, desc_en: `${en} standard certified IUPAC data.`
  });
});

// Periodo 7 Alcalino y Alcalinotérreo
ELEMENTS_DATA.push({
  number: 87, symbol: 'Fr', name_es: 'Francio', name_en: 'Francium',
  mass: 223, valencia: '+1', electronConfig: '[Rn] 7s¹', electronsPerShell: '2, 8, 18, 32, 18, 8, 1',
  period: 7, group: 1, block: 's', category: 'alkali', phase: 'solid',
  electronegativity: 0.79, atomicRadius: 260, ionizationEnergy: 380,
  meltingPoint: '27 °C', boilingPoint: '677 °C', density: '2.48 g/cm³',
  crystalStructure: 'BCC', discoveredBy: 'Marguerite Perey', year: 1939,
  desc_es: 'El segundo elemento más raro de la naturaleza. Metal alcalino de extrema radiactividad.',
  desc_en: 'Extremely radioactive alkali metal discovered by Marguerite Perey at the Curie Institute.'
});

ELEMENTS_DATA.push({
  number: 88, symbol: 'Ra', name_es: 'Radio', name_en: 'Radium',
  mass: 226, valencia: '+2', electronConfig: '[Rn] 7s²', electronsPerShell: '2, 8, 18, 32, 18, 8, 2',
  period: 7, group: 2, block: 's', category: 'alkaline-earth', phase: 'solid',
  electronegativity: 0.90, atomicRadius: 221, ionizationEnergy: 509,
  meltingPoint: '700 °C', boilingPoint: '1737 °C', density: '5.5 g/cm³',
  crystalStructure: 'BCC', discoveredBy: 'Marie & Pierre Curie', year: 1898,
  desc_es: 'Metal alcalinotérreo luminiscente en la oscuridad por su intensa desintegración radiactiva.',
  desc_en: 'Luminescent radioactive alkaline earth element famously isolated by Marie and Pierre Curie.'
});

// Actínidos (Z = 89 a 103, Bloque f)
const ACTINIDES = [
  ['Ac','Actinio','Actinium',227,'+3','[Rn] 6d¹ 7s²','2, 8, 18, 32, 18, 9, 2','André-Louis Debierne',1899],
  ['Th','Torio','Thorium',232.04,'+4','[Rn] 6d² 7s²','2, 8, 18, 32, 18, 10, 2','Jöns Jacob Berzelius',1828],
  ['Pa','Protactinio','Protactinium',231.04,'+4, +5','[Rn] 5f² 6d¹ 7s²','2, 8, 18, 32, 20, 9, 2','Hahn & Meitner',1917],
  ['U','Uranio','Uranium',238.03,'+3, +4, +5, +6','[Rn] 5f³ 6d¹ 7s²','2, 8, 18, 32, 21, 9, 2','Martin Heinrich Klaproth',1789],
  ['Np','Neptunio','Neptunium',237,'+3, +4, +5, +6','[Rn] 5f⁴ 6d¹ 7s²','2, 8, 18, 32, 22, 9, 2','McMillan & Abelson',1940],
  ['Pu','Plutonio','Plutonium',244,'+3, +4, +5, +6','[Rn] 5f⁶ 7s²','2, 8, 18, 32, 24, 8, 2','Glenn T. Seaborg',1940],
  ['Am','Americio','Americium',243,'+3, +4','[Rn] 5f⁷ 7s²','2, 8, 18, 32, 25, 8, 2','Glenn T. Seaborg',1944],
  ['Cm','Curio','Curium',247,'+3, +4','[Rn] 5f⁷ 6d¹ 7s²','2, 8, 18, 32, 25, 9, 2','Glenn T. Seaborg',1944],
  ['Bk','Berkelio','Berkelium',247,'+3, +4','[Rn] 5f⁹ 7s²','2, 8, 18, 32, 27, 8, 2','Laboratorio Berkeley',1949],
  ['Cf','Californio','Californium',251,'+3, +4','[Rn] 5f¹⁰ 7s²','2, 8, 18, 32, 28, 8, 2','Laboratorio Berkeley',1950],
  ['Es','Einstenio','Einsteinium',252,'+3','[Rn] 5f¹¹ 7s²','2, 8, 18, 32, 29, 8, 2','Laboratorio Berkeley',1952],
  ['Fm','Fermio','Fermium',257,'+3','[Rn] 5f¹² 7s²','2, 8, 18, 32, 30, 8, 2','Laboratorio Berkeley',1952],
  ['Md','Mendelevio','Mendelevium',258,'+2, +3','[Rn] 5f¹³ 7s²','2, 8, 18, 32, 31, 8, 2','Ghiorso & Seaborg',1955],
  ['No','Nobelio','Nobelium',259,'+2, +3','[Rn] 5f¹⁴ 7s²','2, 8, 18, 32, 32, 8, 2','Instituto Nobel / Dubna',1958],
  ['Lr','Laurencio','Lawrencium',266,'+3','[Rn] 5f¹⁴ 7s² 7p¹','2, 8, 18, 32, 32, 8, 3','Laboratorio Berkeley',1961]
];

ACTINIDES.forEach(([s, es, en, m, v, ec, eps, disc, yr], idx) => {
  ELEMENTS_DATA.push({
    number: 89 + idx, symbol: s, name_es: es, name_en: en,
    mass: m, valencia: v, electronConfig: ec, electronsPerShell: eps,
    period: 7, group: 3, block: 'f', category: 'actinide', phase: 'solid',
    electronegativity: 1.30, atomicRadius: 175, ionizationEnergy: 580,
    meltingPoint: 'Radiactivo', boilingPoint: 'Radiactivo', density: '10.0 - 19.8 g/cm³',
    crystalStructure: 'Actínido', discoveredBy: disc, year: yr,
    desc_es: `Actínido radiactivo fundamental en energía nuclear de fisión, sondas espaciales de espacio profundo y detectores de humo (Am-241).`,
    desc_en: `Radioactive actinide f-block element powering nuclear reactors, RTG deep space probes, and radiomedicine.`
  });
});

// Metales Superpesados Transactínidos IUPAC (Z = 104 a 118)
const SUPERHEAVIES = [
  ['Rf','Rutherfordio','Rutherfordium',267,'+4','[Rn] 5f¹⁴ 6d² 7s²',4],
  ['Db','Dubnio','Dubnium',268,'+5','[Rn] 5f¹⁴ 6d³ 7s²',5],
  ['Sg','Seaborgio','Seaborgium',269,'+6','[Rn] 5f¹⁴ 6d⁴ 7s²',6],
  ['Bh','Bohrio','Bohrium',270,'+7','[Rn] 5f¹⁴ 6d⁵ 7s²',7],
  ['Hs','Hasio','Hassium',277,'+8','[Rn] 5f¹⁴ 6d⁶ 7s²',8],
  ['Mt','Meitnerio','Meitnerium',278,'+3, +4','[Rn] 5f¹⁴ 6d⁷ 7s²',9],
  ['Ds','Darmstatio','Darmstadtium',281,'+2, +4','[Rn] 5f¹⁴ 6d⁸ 7s²',10],
  ['Rg','Roentgenio','Roentgenium',282,'+3','[Rn] 5f¹⁴ 6d⁹ 7s²',11],
  ['Cn','Copernicio','Copernicium',285,'+2','[Rn] 5f¹⁴ 6d¹⁰ 7s²',12],
  ['Nh','Nihonio','Nihonium',286,'+1, +3','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹',13],
  ['Fl','Flerovio','Flerovium',289,'+2, +4','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²',14],
  ['Mc','Moscovio','Moscovium',290,'+1, +3','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³',15],
  ['Lv','Livermorio','Livermorium',293,'+2, +4','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴',16],
  ['Ts','Tenesino','Tennessine',294,'-1, +1, +3, +5','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵',17],
  ['Og','Oganesón','Oganesson',294,'0, +2, +4','[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶',18]
];

SUPERHEAVIES.forEach(([s, es, en, m, v, ec, g], idx) => {
  ELEMENTS_DATA.push({
    number: 104 + idx, symbol: s, name_es: es, name_en: en,
    mass: m, valencia: v, electronConfig: ec, electronsPerShell: 'Sintético (subcapas llenas)',
    period: 7, group: g, block: g >= 13 ? 'p' : 'd',
    category: g >= 13 ? (g === 18 ? 'noble-gas' : (g === 17 ? 'halogen' : 'post-transition')) : 'transition',
    phase: 'synthetic',
    electronegativity: null, atomicRadius: 140, ionizationEnergy: null,
    meltingPoint: 'Desconocido (vida efímera)', boilingPoint: 'Desconocido', density: 'Estimada teóricamente',
    crystalStructure: 'Sintético', discoveredBy: 'Joint Working Party IUPAC / IUPAP (Dubna, RIKEN, LLNL, GSI)', year: 2016,
    desc_es: `Elemento superpesado sintetizado átomo a átomo en aceleradores colisionadores de iones pesados. Aprobado y ratificado formalmente por la IUPAC.`,
    desc_en: `Superheavy synthetic element created atom-by-atom in heavy-ion accelerators. Officially named and ratified by IUPAC.`
  });
});

// Ordenar por número atómico Z
ELEMENTS_DATA.sort((a, b) => a.number - b.number);

// --- 4. ESTADO DE LA APLICACIÓN ---
let currentLang = localStorage.getItem('zperiod_lang') || 'es';
let activeCategory = 'all';
let activeProperty = 'valencia'; // valencia | electronegativity | mass | atomicRadius | ionizationEnergy | electronConfig | phase
let selectedElement = ELEMENTS_DATA[25] || ELEMENTS_DATA[0]; // Hierro (Fe, Z=26) por defecto
let trendsChartInstance = null;
let currentThemeSetting = localStorage.getItem('periodicTheme') || 'system';

// --- 5. SISTEMA DE TEMAS (LIGHT / DARK / SYSTEM) ---
function getStoredTheme() {
  return localStorage.getItem('periodicTheme') || 'system';
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(themeSetting, persist = true) {
  if (themeSetting !== 'light' && themeSetting !== 'dark' && themeSetting !== 'system') {
    themeSetting = 'system';
  }
  currentThemeSetting = themeSetting;
  if (persist) {
    try {
      localStorage.setItem('periodicTheme', themeSetting);
    } catch (e) {}
  }

  const effectiveTheme = themeSetting === 'system' ? getSystemTheme() : themeSetting;
  document.documentElement.setAttribute('data-theme', effectiveTheme);

  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Actualizar meta theme-color para navegadores y PWA
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', effectiveTheme === 'dark' ? '#070b19' : '#f0f6fc');
  }

  updateThemeUI();
  updateChartTheme();
}

function updateThemeUI() {
  const iconEl = document.getElementById('themeCurrentIcon');
  const labelEl = document.getElementById('themeCurrentLabel');
  const btnEl = document.getElementById('themeToggleBtn');
  const menuTriggerBtn = document.getElementById('themeMenuTriggerBtn');
  const t = I18N[currentLang] || I18N.es;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  if (iconEl) {
    iconEl.className = 'fa-solid text-xs ' + 
      (currentThemeSetting === 'light' ? 'fa-sun text-amber-500' : 
       (currentThemeSetting === 'dark' ? 'fa-moon text-indigo-400' : 
        (isLight ? 'fa-desktop text-cyan-600' : 'fa-desktop text-cyan-400')));
  }

  if (labelEl) {
    const labelText = currentThemeSetting === 'light' ? t.themeLight :
      (currentThemeSetting === 'dark' ? t.themeDark : t.themeSystem);
    labelEl.textContent = labelText;
  }

  if (btnEl) {
    const nextToggleText = isLight ? (t.themeDark || 'Oscuro') : (t.themeLight || 'Claro');
    btnEl.title = `${t.themeLabel}: ${currentThemeSetting.toUpperCase()} — ${currentLang === 'es' ? 'Clic para alternar a' : 'Click to switch to'} ${nextToggleText}`;
    btnEl.setAttribute('aria-label', `${t.themeLabel}: ${currentThemeSetting}`);
  }

  if (menuTriggerBtn) {
    menuTriggerBtn.title = `${t.themeLabel}: Claro / Oscuro / Sistema`;
    menuTriggerBtn.setAttribute('aria-label', `${t.themeLabel} (3 opciones)`);
  }

  // Actualizar opciones activas en el popover
  document.querySelectorAll('.theme-option-btn').forEach((btn) => {
    const val = btn.dataset.themeValue;
    const isActive = val === currentThemeSetting;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    const checkIcon = btn.querySelector('.theme-check');
    if (checkIcon) {
      checkIcon.classList.toggle('hidden', !isActive);
    }
  });
}

function updateChartTheme() {
  if (!trendsChartInstance || typeof trendsChartInstance.update !== 'function') return;

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  
  const textColor = isLight ? '#334155' : '#cbd5e1';
  const ticksColor = isLight ? '#64748b' : '#94a3b8';
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)';
  const accentColor = isLight ? '#0284c7' : '#38bdf8';
  const accentBg = isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.12)';
  const pointBorder = isLight ? '#ffffff' : '#060913';
  const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.92)';
  const tooltipTitle = isLight ? '#0284c7' : '#38bdf8';
  const tooltipBody = isLight ? '#0f172a' : '#ffffff';
  const tooltipBorder = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(255, 255, 255, 0.15)';

  if (trendsChartInstance.data.datasets && trendsChartInstance.data.datasets[0]) {
    const ds = trendsChartInstance.data.datasets[0];
    ds.borderColor = accentColor;
    ds.backgroundColor = accentBg;
    ds.pointBackgroundColor = accentColor;
    ds.pointBorderColor = pointBorder;
  }

  if (trendsChartInstance.options.plugins) {
    if (trendsChartInstance.options.plugins.legend && trendsChartInstance.options.plugins.legend.labels) {
      trendsChartInstance.options.plugins.legend.labels.color = textColor;
    }
    if (trendsChartInstance.options.plugins.tooltip) {
      trendsChartInstance.options.plugins.tooltip.backgroundColor = tooltipBg;
      trendsChartInstance.options.plugins.tooltip.titleColor = tooltipTitle;
      trendsChartInstance.options.plugins.tooltip.bodyColor = tooltipBody;
      trendsChartInstance.options.plugins.tooltip.borderColor = tooltipBorder;
    }
  }

  if (trendsChartInstance.options.scales) {
    if (trendsChartInstance.options.scales.x) {
      if (trendsChartInstance.options.scales.x.grid) trendsChartInstance.options.scales.x.grid.color = gridColor;
      if (trendsChartInstance.options.scales.x.ticks) trendsChartInstance.options.scales.x.ticks.color = ticksColor;
    }
    if (trendsChartInstance.options.scales.y) {
      if (trendsChartInstance.options.scales.y.grid) trendsChartInstance.options.scales.y.grid.color = gridColor;
      if (trendsChartInstance.options.scales.y.ticks) trendsChartInstance.options.scales.y.ticks.color = ticksColor;
    }
  }

  trendsChartInstance.update('none');
}

function initThemeSystem() {
  applyTheme(currentThemeSetting, false);

  // Escuchar cambios automáticos del sistema si el modo es "system"
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (currentThemeSetting === 'system') {
        applyTheme('system', false);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
    }
  }

  // Interacción del Botón y Menú Desplegable de Tema con Accesibilidad Completa
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeMenuTriggerBtn = document.getElementById('themeMenuTriggerBtn');
  const themeDropdown = document.getElementById('themeDropdownMenu');
  const themeContainer = document.getElementById('themeSelectorContainer');
  const optionButtons = Array.from(document.querySelectorAll('.theme-option-btn'));

  const toggleDropdown = (open) => {
    if (!themeDropdown) return;
    const isHidden = themeDropdown.classList.contains('hidden');
    const shouldOpen = typeof open === 'boolean' ? open : isHidden;
    if (shouldOpen) {
      themeDropdown.classList.remove('hidden');
      if (themeMenuTriggerBtn) themeMenuTriggerBtn.setAttribute('aria-expanded', 'true');
      const activeOption = optionButtons.find((btn) => btn.dataset.themeValue === currentThemeSetting) || optionButtons[0];
      if (activeOption) setTimeout(() => activeOption.focus(), 50);
    } else {
      themeDropdown.classList.add('hidden');
      if (themeMenuTriggerBtn) themeMenuTriggerBtn.setAttribute('aria-expanded', 'false');
    }
  };

  // 1. Clic directo en el botón principal: alterna entre Claro y Oscuro al instante
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const effectiveNow = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = effectiveNow === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
      toggleDropdown(false);
    });

    themeToggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        toggleDropdown(true);
      }
    });
  }

  // 2. Clic en el botón chevron: despliega el menú con las 3 opciones (Claro, Oscuro, Sistema)
  if (themeMenuTriggerBtn) {
    themeMenuTriggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });

    themeMenuTriggerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown(true);
      }
    });
  }

  // Cerrar al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (themeContainer && !themeContainer.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  // Navegación por teclado dentro de las opciones del menú
  optionButtons.forEach((optionBtn, idx) => {
    optionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const selectedVal = optionBtn.dataset.themeValue;
      applyTheme(selectedVal, true);
      toggleDropdown(false);
      if (themeToggleBtn) themeToggleBtn.focus();
    });

    optionBtn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (idx + 1) % optionButtons.length;
        optionButtons[nextIdx].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (idx - 1 + optionButtons.length) % optionButtons.length;
        optionButtons[prevIdx].focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        optionButtons[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        optionButtons[optionButtons.length - 1].focus();
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        e.preventDefault();
        toggleDropdown(false);
        if (themeToggleBtn) themeToggleBtn.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        optionBtn.click();
      }
    });
  });
}

// --- 6. CONTADOR DE VISITAS DISCRETO (LOCALSTORAGE) ---
function initVisitCounter() {
  const STORAGE_KEY = 'zperiod_visits_count';
  let visits = parseInt(localStorage.getItem(STORAGE_KEY), 10);
  visits = isNaN(visits) || visits < 1 ? 1 : visits + 1;
  localStorage.setItem(STORAGE_KEY, visits.toString());

  const counterEl = document.getElementById('visitCounter');
  if (counterEl) {
    counterEl.innerHTML = `
      <i class="fa-solid fa-signal text-cyan-400 text-[10px]"></i>
      <span class="hidden lg:inline text-[10px]">${I18N[currentLang].visitsLabel}:</span>
      <strong class="text-cyan-300 font-bold text-xs">${visits}</strong>
    `;
  }
}

// --- 6. COORDENADAS QUÍMICAS IUPAC EN GRID 18x10 ---
function getGridPosition(elem) {
  const num = elem.number;
  // Lantánidos (57 a 71) en Fila 9
  if (num >= 57 && num <= 71) return { col: (num - 57) + 3, row: 9 };
  // Actínidos (89 a 103) en Fila 10
  if (num >= 89 && num <= 103) return { col: (num - 89) + 3, row: 10 };
  // Periodo 1
  if (num === 1) return { col: 1, row: 1 };
  if (num === 2) return { col: 18, row: 1 };
  // Periodo 2
  if (num >= 3 && num <= 4) return { col: num - 2, row: 2 };
  if (num >= 5 && num <= 10) return { col: (num - 5) + 13, row: 2 };
  // Periodo 3
  if (num >= 11 && num <= 12) return { col: num - 10, row: 3 };
  if (num >= 13 && num <= 18) return { col: (num - 13) + 13, row: 3 };
  // Periodo 4
  if (num >= 19 && num <= 36) return { col: (num - 19) + 1, row: 4 };
  // Periodo 5
  if (num >= 37 && num <= 54) return { col: (num - 37) + 1, row: 5 };
  // Periodo 6
  if (num === 55) return { col: 1, row: 6 };
  if (num === 56) return { col: 2, row: 6 };
  if (num >= 72 && num <= 86) return { col: (num - 72) + 4, row: 6 };
  // Periodo 7
  if (num === 87) return { col: 1, row: 7 };
  if (num === 88) return { col: 2, row: 7 };
  if (num >= 104 && num <= 118) return { col: (num - 104) + 4, row: 7 };
  return { col: 1, row: 1 };
}

// --- 7. RENDERIZADO DEL GRID DE LA TABLA PERIÓDICA COMPLETA ---
function renderPeriodicTable() {
  const gridContainer = document.getElementById('periodicGrid');
  if (!gridContainer) return;

  // Preservar el nodo iupacCentralHub
  const centralHub = document.getElementById('iupacCentralHub');
  gridContainer.innerHTML = '';
  if (centralHub) gridContainer.appendChild(centralHub);

  const t = I18N[currentLang] || I18N.es;

  ELEMENTS_DATA.forEach((elem) => {
    const pos = getGridPosition(elem);
    const cell = document.createElement('div');

    cell.className = `element-cell cat-${elem.category} ${selectedElement && selectedElement.number === elem.number ? 'selected' : ''}`;
    cell.style.gridColumn = `${pos.col}`;
    cell.style.gridRow = `${pos.row}`;
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'button');

    const displayName = currentLang === 'es' ? elem.name_es : elem.name_en;
    const categoryLabel = t[elem.category] || elem.category;
    const propertyVal = getElementPropertyDisplay(elem, activeProperty);
    const massDisplay = typeof elem.mass === 'number' ? elem.mass.toFixed(2) : elem.mass;

    cell.setAttribute('aria-label', `${elem.number} ${displayName}, ${categoryLabel}`);
    cell.setAttribute('title', `${elem.number} - ${elem.symbol}: ${displayName} | ${categoryLabel} | ${t.mass}: ${massDisplay} u | ${t.valencia}: ${elem.valencia}`);

    cell.dataset.number = elem.number;
    cell.dataset.symbol = elem.symbol.toLowerCase();
    cell.dataset.nameEs = elem.name_es.toLowerCase();
    cell.dataset.nameEn = elem.name_en.toLowerCase();
    cell.dataset.valencia = elem.valencia.toLowerCase();
    cell.dataset.category = elem.category;

    cell.innerHTML = `
      <div class="elem-num">${elem.number}</div>
      <div class="elem-symbol">${elem.symbol}</div>
      <div class="elem-name">${displayName}</div>
      <div class="elem-prop">${propertyVal}</div>
    `;

    cell.addEventListener('click', () => {
      selectElement(elem);
    });

    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectElement(elem);
      }
    });

    cell.addEventListener('mouseenter', () => {
      renderCentralHub(elem);
    });

    gridContainer.appendChild(cell);
  });

  // Restaurar elemento seleccionado en el Hub al salir del grid
  gridContainer.onmouseleave = () => {
    if (selectedElement) {
      renderCentralHub(selectedElement);
    }
  };

  // Marcadores de bloque f (La-Lu y Ac-Lr)
  const lanthPlaceholder = document.createElement('div');
  lanthPlaceholder.className = 'element-cell placeholder-cell flex items-center justify-center text-center';
  lanthPlaceholder.style.gridColumn = '3';
  lanthPlaceholder.style.gridRow = '6';
  lanthPlaceholder.innerHTML = `<span class="text-[8.5px] font-bold text-indigo-300 font-mono">57-71<br>La-Lu</span>`;
  gridContainer.appendChild(lanthPlaceholder);

  const actinPlaceholder = document.createElement('div');
  actinPlaceholder.className = 'element-cell placeholder-cell flex items-center justify-center text-center';
  actinPlaceholder.style.gridColumn = '3';
  actinPlaceholder.style.gridRow = '7';
  actinPlaceholder.innerHTML = `<span class="text-[8.5px] font-bold text-cyan-300 font-mono">89-103<br>Ac-Lr</span>`;
  gridContainer.appendChild(actinPlaceholder);

  // Separador F-block
  const gap = document.createElement('div');
  gap.className = 'f-block-gap flex items-center justify-start';
  gap.innerHTML = `
    <span class="text-[9px] font-bold text-slate-400 tracking-wider uppercase">
      ${currentLang === 'es' ? 'Tierras Raras & Actínidos (Bloque f)' : 'Rare Earths & Actinides (f-block)'}
    </span>
  `;
  gridContainer.appendChild(gap);

  applyFilters();
}

function getElementPropertyDisplay(elem, propKey) {
  if (propKey === 'valencia') return elem.valencia || '0';
  if (propKey === 'electronegativity') return elem.electronegativity !== null ? elem.electronegativity.toFixed(2) : '—';
  if (propKey === 'mass') return typeof elem.mass === 'number' ? elem.mass.toFixed(2) : elem.mass;
  if (propKey === 'atomicRadius') return elem.atomicRadius !== null ? `${elem.atomicRadius} pm` : '—';
  if (propKey === 'ionizationEnergy') return elem.ionizationEnergy !== null ? `${elem.ionizationEnergy}` : '—';
  if (propKey === 'electronConfig') return elem.electronConfig || '—';
  if (propKey === 'phase') {
    const t = I18N[currentLang];
    return t[elem.phase] || elem.phase;
  }
  return '';
}

// --- 7.5. MOTOR DE MECÁNICA CUÁNTICA, ORBITALES Y ELECTRÓN DIFERENCIAL ---
const NOBLE_CORE_SUBSHELLS = {
  '[He]': [{ n: 1, type: 's', l: 0, count: 2, key: '1s' }],
  '[Ne]': [
    { n: 1, type: 's', l: 0, count: 2, key: '1s' },
    { n: 2, type: 's', l: 0, count: 2, key: '2s' },
    { n: 2, type: 'p', l: 1, count: 6, key: '2p' }
  ],
  '[Ar]': [
    { n: 1, type: 's', l: 0, count: 2, key: '1s' },
    { n: 2, type: 's', l: 0, count: 2, key: '2s' },
    { n: 2, type: 'p', l: 1, count: 6, key: '2p' },
    { n: 3, type: 's', l: 0, count: 2, key: '3s' },
    { n: 3, type: 'p', l: 1, count: 6, key: '3p' }
  ],
  '[Kr]': [
    { n: 1, type: 's', l: 0, count: 2, key: '1s' },
    { n: 2, type: 's', l: 0, count: 2, key: '2s' },
    { n: 2, type: 'p', l: 1, count: 6, key: '2p' },
    { n: 3, type: 's', l: 0, count: 2, key: '3s' },
    { n: 3, type: 'p', l: 1, count: 6, key: '3p' },
    { n: 3, type: 'd', l: 2, count: 10, key: '3d' },
    { n: 4, type: 's', l: 0, count: 2, key: '4s' },
    { n: 4, type: 'p', l: 1, count: 6, key: '4p' }
  ],
  '[Xe]': [
    { n: 1, type: 's', l: 0, count: 2, key: '1s' },
    { n: 2, type: 's', l: 0, count: 2, key: '2s' },
    { n: 2, type: 'p', l: 1, count: 6, key: '2p' },
    { n: 3, type: 's', l: 0, count: 2, key: '3s' },
    { n: 3, type: 'p', l: 1, count: 6, key: '3p' },
    { n: 3, type: 'd', l: 2, count: 10, key: '3d' },
    { n: 4, type: 's', l: 0, count: 2, key: '4s' },
    { n: 4, type: 'p', l: 1, count: 6, key: '4p' },
    { n: 4, type: 'd', l: 2, count: 10, key: '4d' },
    { n: 5, type: 's', l: 0, count: 2, key: '5s' },
    { n: 5, type: 'p', l: 1, count: 6, key: '5p' }
  ],
  '[Rn]': [
    { n: 1, type: 's', l: 0, count: 2, key: '1s' },
    { n: 2, type: 's', l: 0, count: 2, key: '2s' },
    { n: 2, type: 'p', l: 1, count: 6, key: '2p' },
    { n: 3, type: 's', l: 0, count: 2, key: '3s' },
    { n: 3, type: 'p', l: 1, count: 6, key: '3p' },
    { n: 3, type: 'd', l: 2, count: 10, key: '3d' },
    { n: 4, type: 's', l: 0, count: 2, key: '4s' },
    { n: 4, type: 'p', l: 1, count: 6, key: '4p' },
    { n: 4, type: 'd', l: 2, count: 10, key: '4d' },
    { n: 4, type: 'f', l: 3, count: 14, key: '4f' },
    { n: 5, type: 's', l: 0, count: 2, key: '5s' },
    { n: 5, type: 'p', l: 1, count: 6, key: '5p' },
    { n: 5, type: 'd', l: 2, count: 10, key: '5d' },
    { n: 6, type: 's', l: 0, count: 2, key: '6s' },
    { n: 6, type: 'p', l: 1, count: 6, key: '6p' }
  ]
};

function normalizeSuperscript(str) {
  if (!str) return '';
  const map = { '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁰': '0' };
  return str.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, (m) => map[m]);
}

function parseSubshells(configStr) {
  const norm = normalizeSuperscript(configStr || '');
  const coreMatch = norm.match(/\[(He|Ne|Ar|Kr|Xe|Rn)\]/);
  const coreName = coreMatch ? coreMatch[0] : null;
  const regex = /(\d)([spdf])(\d+)/g;
  const valence = [];
  let m;
  while ((m = regex.exec(norm)) !== null) {
    valence.push({
      n: parseInt(m[1], 10),
      type: m[2],
      l: { s: 0, p: 1, d: 2, f: 3 }[m[2]],
      count: parseInt(m[3], 10),
      key: m[1] + m[2]
    });
  }
  const core = coreName && NOBLE_CORE_SUBSHELLS[coreName] ? NOBLE_CORE_SUBSHELLS[coreName] : [];
  const full = [...core, ...valence];
  return { coreName, valence: valence.length ? valence : full, full };
}

function getDiffElectron(elem) {
  if (!elem) return { subshellKey: '1s', subshellCount: 1, n: 1, l: 0, l_name: 's', m_l: 0, s_val: 0.5, s_str: '+1/2', s_arrow: '↑', electronIndex: 1 };
  
  const parsed = parseSubshells(elem.electronConfig);
  const valence = parsed.valence;
  const full = parsed.full;

  let targetSubshell = null;
  // Excepciones y configuraciones terminales de Aufbau reconocidas por IUPAC
  if (elem.number === 57) targetSubshell = full.find(s => s.key === '5d') || { n: 5, type: 'd', l: 2, count: 1, key: '5d' };
  else if (elem.number === 64) targetSubshell = full.find(s => s.key === '5d') || { n: 5, type: 'd', l: 2, count: 1, key: '5d' };
  else if (elem.number === 71) targetSubshell = full.find(s => s.key === '5d') || { n: 5, type: 'd', l: 2, count: 1, key: '5d' };
  else if (elem.number === 89) targetSubshell = full.find(s => s.key === '6d') || { n: 6, type: 'd', l: 2, count: 1, key: '6d' };
  else if (elem.number === 90) targetSubshell = full.find(s => s.key === '6d') || { n: 6, type: 'd', l: 2, count: 2, key: '6d' };
  else if (elem.number === 96) targetSubshell = full.find(s => s.key === '6d') || { n: 6, type: 'd', l: 2, count: 1, key: '6d' };
  else if (elem.number === 103) targetSubshell = full.find(s => s.key === '7p') || { n: 7, type: 'p', l: 1, count: 1, key: '7p' };

  if (!targetSubshell) {
    // Buscar en valence desde el final hacia el inicio coincidiendo con el bloque del elemento
    targetSubshell = valence.slice().reverse().find(s => s.type === elem.block) ||
                     full.slice().reverse().find(s => s.type === elem.block);
  }

  if (!targetSubshell && valence.length > 0) {
    targetSubshell = valence[valence.length - 1];
  }

  if (!targetSubshell && full.length > 0) {
    targetSubshell = full[full.length - 1];
  }

  if (!targetSubshell) {
    targetSubshell = { n: 1, type: 's', l: 0, count: 1, key: '1s' };
  }

  const n = targetSubshell.n;
  const l = targetSubshell.l;
  const k = targetSubshell.count;
  const numOrbitals = 2 * l + 1;

  let m_l, s_val, s_str, s_arrow;
  if (k <= numOrbitals) {
    m_l = -l + (k - 1);
    s_val = 0.5;
    s_str = '+1/2';
    s_arrow = '↑';
  } else {
    m_l = -l + (k - numOrbitals - 1);
    s_val = -0.5;
    s_str = '-1/2';
    s_arrow = '↓';
  }

  return {
    subshellKey: targetSubshell.key,
    subshellCount: k,
    n,
    l,
    l_name: targetSubshell.type,
    m_l,
    s_val,
    s_str,
    s_arrow,
    electronIndex: k
  };
}

// --- 8. FICHA CENTRAL INTEGRADA IUPAC (EN EL HUECO DEL GRID) ---
function renderCentralHub(elem) {
  const hub = document.getElementById('iupacCentralHub');
  if (!hub) return;

  const t = I18N[currentLang] || I18N.es;
  const name = currentLang === 'es' ? elem.name_es : elem.name_en;
  const categoryLabel = t[elem.category] || elem.category;
  const phaseLabel = t[elem.phase] || elem.phase;
  const geo = getElementGeochemistryAndCompounds(elem);
  const diff = getDiffElectron(elem);

  hub.innerHTML = `
    <div class="h-full flex flex-col justify-between overflow-hidden">
      <!-- Encabezado con Símbolo Glass, Z, Masa y Familia -->
      <div class="flex items-center justify-between border-b border-white/10 pb-1 gap-1.5">
        <div class="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <div class="w-8 h-8 sm:w-11 sm:h-11 md:w-13 md:h-13 rounded-xl glass-card border border-cyan-400/40 flex flex-col items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
            <span class="text-[8px] sm:text-[9px] text-cyan-300 font-mono font-bold leading-none">${elem.number}</span>
            <span class="text-sm sm:text-lg md:text-xl font-black text-white tracking-tight leading-tight">${elem.symbol}</span>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              <h2 class="text-xs sm:text-sm md:text-base font-black text-white tracking-tight truncate">${name}</h2>
              <span class="text-[8px] sm:text-[8.5px] font-bold px-1.5 py-0.2 rounded-full glass-button text-cyan-300 shrink-0">
                ${categoryLabel}
              </span>
            </div>
            <div class="text-[8.5px] sm:text-[9.5px] text-slate-300 flex items-center gap-1.5 sm:gap-2.5 mt-0.5 font-mono truncate">
              <span><strong>${t.mass}:</strong> ${typeof elem.mass === 'number' ? elem.mass.toFixed(2) : elem.mass} u</span>
              <span class="hidden xs:inline"><strong>${t.group}:</strong> ${elem.group}</span>
              <span class="hidden xs:inline"><strong>${t.period}:</strong> ${elem.period}</span>
              <span class="hidden sm:inline"><strong>${t.block}:</strong> ${elem.block}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button id="openModalBtn" class="glass-button px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-[10px] sm:text-xs font-semibold text-cyan-300 hover:text-white flex items-center gap-1 shadow-md cursor-pointer" aria-label="${t.fullSheetBtn}">
            <i class="fa-solid fa-expand text-[9px]"></i>
            <span class="hidden sm:inline">${t.fullSheetBtn}</span>
            <span class="sm:hidden">${t.detailsTitle || 'Ficha'}</span>
          </button>
        </div>
      </div>

      <!-- Cuadrícula Rápida de Propiedades Oficiales IUPAC (Compacta) -->
      <div class="grid grid-cols-4 gap-1 my-0.5 text-[9px] sm:text-xs">
        <div class="glass-card px-1.5 py-0.5 sm:py-1 rounded-lg">
          <span class="text-[7.5px] sm:text-[8.5px] text-slate-400 block truncate leading-tight">${t.valencia}</span>
          <span class="font-bold text-white font-mono text-[9.5px] sm:text-[11px] truncate block leading-tight">${elem.valencia}</span>
        </div>
        <div class="glass-card px-1.5 py-0.5 sm:py-1 rounded-lg">
          <span class="text-[7.5px] sm:text-[8.5px] text-slate-400 block truncate leading-tight">${t.electronegativity}</span>
          <span class="font-bold text-white text-[9.5px] sm:text-[11px] truncate block leading-tight">${elem.electronegativity !== null ? elem.electronegativity : '—'}</span>
        </div>
        <div class="glass-card px-1.5 py-0.5 sm:py-1 rounded-lg">
          <span class="text-[7.5px] sm:text-[8.5px] text-slate-400 block truncate leading-tight">${t.atomicRadius}</span>
          <span class="font-bold text-white text-[9.5px] sm:text-[11px] truncate block leading-tight">${elem.atomicRadius ? elem.atomicRadius + ' pm' : '—'}</span>
        </div>
        <div class="glass-card px-1.5 py-0.5 sm:py-1 rounded-lg">
          <span class="text-[7.5px] sm:text-[8.5px] text-slate-400 block truncate leading-tight">${t.phase}</span>
          <span class="font-bold text-cyan-300 text-[9.5px] sm:text-[11px] truncate block leading-tight">${phaseLabel}</span>
        </div>
      </div>

      <!-- Abundancia en la Tierra y Compuestos (Oculto en móvil pequeño para evitar empujar Periodo 4) -->
      <div class="hub-secondary-grid hidden md:grid grid-cols-2 gap-1 my-0.5 text-xs">
        <div class="glass-card px-2 py-0.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:border-cyan-400/40 transition-colors" onclick="openIupacModalTab('abundance')" role="button" tabindex="0">
          <i class="fa-solid fa-earth-americas text-cyan-400 text-xs shrink-0"></i>
          <div class="truncate">
            <span class="text-[8px] text-slate-400 block leading-tight">${t.tabAbundance}:</span>
            <span class="font-bold text-white text-[10px] truncate block leading-tight">${geo.crustRank}</span>
          </div>
        </div>
        <div class="glass-card px-2 py-0.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:border-cyan-400/40 transition-colors" onclick="openIupacModalTab('compounds')" role="button" tabindex="0">
          <i class="fa-solid fa-vial-virus text-amber-400 text-xs shrink-0"></i>
          <div class="truncate">
            <span class="text-[8px] text-slate-400 block leading-tight">${t.tabCompounds}:</span>
            <span class="font-bold text-cyan-300 font-mono text-[10px] truncate block leading-tight">${geo.compounds.slice(0, 3).map(c => c.formula).join(', ')}</span>
          </div>
        </div>
      </div>

      <!-- Configuración Electrónica y Cuántica -->
      <div class="hub-tertiary-bar hidden lg:flex items-center justify-between text-[9px] text-slate-300 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 font-mono">
        <div class="truncate mr-2 flex items-center gap-1.5">
          <span class="text-slate-400">${t.electronConfig}:</span>
          <strong class="text-cyan-300 font-bold">${elem.electronConfig}</strong>
        </div>
        <button class="shrink-0 text-cyan-300 hover:text-white glass-button px-1.5 py-0.5 rounded text-[8.5px] flex items-center gap-1 cursor-pointer transition-colors" onclick="openIupacModalTab('quantum')" title="${t.tabQuantum}">
          <i class="fa-solid fa-shapes text-amber-400 text-[8px]"></i>
          <span>e⁻ dif: (<strong>${diff.n}, ${diff.l}, ${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}, ${diff.s_str}</strong> ${diff.s_arrow})</span>
        </button>
      </div>
    </div>
  `;

  const openModalBtn = document.getElementById('openModalBtn');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => openIupacModal(elem));
  }
}

function selectElement(elem) {
  selectedElement = elem;

  document.querySelectorAll('.element-cell').forEach((el) => {
    el.classList.toggle('selected', el.dataset.number == elem.number);
  });

  renderCentralHub(elem);
  openIupacModal(elem);
}

// Control global para abrir pestaña específica desde cualquier botón
window.openIupacModalTab = function(tabName) {
  activeModalTab = tabName;
  const target = currentModalElement || selectedElement || ELEMENTS_DATA[0];
  openIupacModal(target);
};

window.copyCompoundFormula = function(formula, btnEl) {
  navigator.clipboard.writeText(formula).then(() => {
    if (btnEl) {
      const originalHTML = btnEl.innerHTML;
      btnEl.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i>';
      setTimeout(() => { btnEl.innerHTML = originalHTML; }, 1500);
    }
  }).catch(() => {});
};

// --- 9. VENTANA MODAL GLASS ULTRA-INTERACTIVA (BOHR, TABS, SIMULADOR TÉRMICO) ---
let currentModalElement = null;
let activeModalTab = 'general'; // 'general' | 'chemistry' | 'compounds' | 'abundance' | 'thermal' | 'applications'
let simulatedTempK = 298.15;
let bohrAnimFrameId = null;
let highlightedShellIdx = null;

// Base de datos de Abundancia Terrestre, Origen e Isótopos y Compuestos Principales
function getElementGeochemistryAndCompounds(elem) {
  const num = elem.number;
  const s = elem.symbol;

  // Base de datos detallada para elementos clave y generador riguroso para todos los 118
  const GEO_DATA = {
    1: {
      crust: '1,400 ppm (0.14%) — 10º elemento más abundante en la corteza',
      crustRank: '#10 en la Tierra',
      ocean: '108,000 ppm (10.8% de la masa de todos los océanos)',
      atmosphere: '0.5 ppmv (trazas en la atmósfera superior)',
      human: '10.0% de la masa del cuerpo humano (3º más abundante)',
      origin: 'Nucleosíntesis primordial del Big Bang (hace 13.800 Ma)',
      isotopes: ['¹H (Protio: 99.988%, Estable)', '²H (Deuterio: 0.0115%, Estable)', '³H (Tritio: Trazas, Radiactivo t½ = 12.3 años)'],
      compounds: [
        { formula: 'H₂O', name: 'Agua', type: 'Covalente polar', desc: 'Disolvente universal indispensable para el desarrollo de la vida.' },
        { formula: 'NH₃', name: 'Amoníaco', type: 'Covalente polar', desc: 'Base mundial para fertilizantes agrícolas y refrigeración industrial.' },
        { formula: 'CH₄', name: 'Metano', type: 'Covalente no polar', desc: 'Componente principal del gas natural y combustible de alta energía.' },
        { formula: 'HCl', name: 'Ácido clorhídrico', type: 'Covalente / Disolución ácida', desc: 'Reactivo industrial y componente de los jugos gástricos estomacales.' },
        { formula: 'H₂O₂', name: 'Peróxido de hidrógeno', type: 'Covalente', desc: 'Agente oxidante, blanqueador industrial y antiséptico tópico.' }
      ]
    },
    2: {
      crust: '0.008 ppm (8 ppb) — Extremadamente escaso en rocas terrestres',
      crustRank: '#71 en la Tierra',
      ocean: '0.000007 ppm (trazas disueltas)',
      atmosphere: '5.2 ppmv (se escapa continuamente hacia el espacio exterior)',
      human: 'Trazas despreciables (gas biológicamente inerte)',
      origin: 'Big Bang (24% del cosmos) y desintegración alfa subterránea de U y Th',
      isotopes: ['⁴He (99.99986%, Estable)', '³He (0.000137%, Fusión limpia de deuterio)'],
      compounds: [
        { formula: 'He (Gas monoatómico)', name: 'Helio elemental', type: 'Gas noble inerte', desc: 'No forma enlaces químicos estables en condiciones terrestres estándar.' },
        { formula: 'Na₂He (Bajo ultra-alta presión)', name: 'Heluro de sodio (Sintético)', type: 'Compuesto de presión extrema (>113 GPa)', desc: 'Fase cristalina estable únicamente a presiones del manto profundo planetario.' },
        { formula: 'HeH⁺', name: 'Ion hidruro de helio', type: 'Ion molecular astrofísico', desc: 'El primer enlace químico formado en el universo temprano tras el Big Bang.' }
      ]
    },
    3: {
      crust: '20 ppm (0.002%) — #33 en abundancia en la corteza terrestre',
      crustRank: '#33 en la Tierra',
      ocean: '0.18 ppm (disuelto en salmueras y agua de mar)',
      atmosphere: 'Inexistente en fase gaseosa libre',
      human: '0.00001% (trazas metabólicas y uso en farmacología psiquiátrica)',
      origin: 'Espalación de rayos cósmicos sobre núcleos pesados interestelares',
      isotopes: ['⁷Li (92.41%, Estable)', '⁶Li (7.59%, Absorbedor neutrónico en reactores)'],
      compounds: [
        { formula: 'Li₂CO₃', name: 'Carbonato de litio', type: 'Iónico', desc: 'Pilar de la fabricación de baterías de litio y fármaco estabilizador del ánimo.' },
        { formula: 'LiCoO₂ / LiFePO₄', name: 'Cobaltito / Fosfato de litio', type: 'Cerámica electroactiva', desc: 'Material catódico por excelencia de las baterías de iones de litio modernas.' },
        { formula: 'LiOH', name: 'Hidróxido de litio', type: 'Iónico (Base fuerte)', desc: 'Purificador de aire en naves espaciales y submarinos para absorber CO₂.' },
        { formula: 'LiPF₆', name: 'Hexafluorofosfato de litio', type: 'Sal electrolítica', desc: 'Electrolito conductor fundamental en celdas de baterías de vehículos eléctricos.' }
      ]
    },
    4: {
      crust: '2.8 ppm — Escaso en la corteza (#47 en abundancia)',
      crustRank: '#47 en la Tierra',
      ocean: '0.0000006 ppm',
      atmosphere: 'Inexistente',
      human: 'Trazas no esenciales (polvo inhalado es altamente tóxico: beriliosis)',
      origin: 'Espalación de rayos cósmicos interestelares',
      isotopes: ['⁹Be (100% monoisotópico natural, Estable)', '¹⁰Be (Radiactivo cosmogénico)'],
      compounds: [
        { formula: 'BeO', name: 'Óxido de berilio (Berilia)', type: 'Covalente refractario', desc: 'Cerámica con conductividad térmica equivalente a metales y aislante eléctrico.' },
        { formula: 'Be₃Al₂Si₆O₁₈', name: 'Berilo (Esmeralda / Aguamarina)', type: 'Ciclosilicato', desc: 'Gemas preciosas y principal mineral de extracción minera de berilio.' },
        { formula: 'BeCu (Aleación)', name: 'Cobre-Berilio', type: 'Metálico endurecido', desc: 'Herramientas antideflagrantes antichispas para refinerías de petróleo.' }
      ]
    },
    5: {
      crust: '10 ppm — Concentrado en depósitos evaporíticos de boratos',
      crustRank: '#38 en la Tierra',
      ocean: '4.44 ppm (ácido bórico disuelto)',
      atmosphere: 'Inexistente',
      human: '0.00007% (micronutriente para la pared celular vegetal y ósea)',
      origin: 'Espalación por rayos cósmicos sobre núcleos de carbono y oxígeno',
      isotopes: ['¹¹B (80.1%, Estable)', '¹⁰B (19.9%, Extraordinaria sección de captura de neutrones)'],
      compounds: [
        { formula: 'H₃BO₃', name: 'Ácido bórico', type: 'Covalente', desc: 'Antiséptico, insecticida ecológico y retardante de llamas.' },
        { formula: 'Na₂B₄O₇·10H₂O', name: 'Bórax (Borato de sodio)', type: 'Iónico hidratado', desc: 'Detergentes, vidrios de borosilicato (Pyrex) y fundente de soldaduras.' },
        { formula: 'BN', name: 'Nitruro de boro', type: 'Covalente reticular', desc: 'Material isoelectrónico al grafito/diamante con resistencia térmica a 2000°C.' },
        { formula: 'B₄C', name: 'Carburo de boro', type: 'Cerámica ultra-dura', desc: 'Blindajes para tanques, chalecos antibalas y barras de reactores nucleares.' }
      ]
    },
    6: {
      crust: '200 ppm (0.02%) — #17 en la corteza terrestre, masivo en la biosfera',
      crustRank: '#17 en la Tierra',
      ocean: '28 ppm (carbonatos y bicarbonatos disueltos)',
      atmosphere: '420 ppmv (Dióxido de carbono gaseoso en aumento)',
      human: '18.5% de la masa corporal humana (2º elemento más abundante)',
      origin: 'Proceso triple alfa en el núcleo de estrellas gigantes rojas',
      isotopes: ['¹²C (98.93%, Base de la masa atómica estándar)', '¹³C (1.07%, RMN biológica)', '¹⁴C (Trazas, Datación arqueológica t½ = 5,730 años)'],
      compounds: [
        { formula: 'CO₂', name: 'Dióxido de carbono', type: 'Covalente no polar', desc: 'Regulador térmico del planeta, producto de respiración y sustrato fotosintético.' },
        { formula: 'CaCO₃', name: 'Carbonato de calcio', type: 'Iónico', desc: 'Piedra caliza, mármol, creta y conchas de moluscos marinos.' },
        { formula: 'CH₄', name: 'Metano', type: 'Covalente', desc: 'Hidrocarburo más simple y combustible fósil primario.' },
        { formula: 'C₆H₁₂O₆', name: 'Glucosa', type: 'Monosacárido orgánico', desc: 'Moneda energética biológica universal producida en fotosíntesis.' },
        { formula: 'C₂H₅OH', name: 'Etanol', type: 'Orgánico (Alcohol)', desc: 'Biocombustible renovable, desinfectante médico y solvente.' }
      ]
    },
    7: {
      crust: '19 ppm — Escaso en rocas pero el más dominante en la atmósfera',
      crustRank: '#34 en la corteza',
      ocean: '15.5 ppm (gases disueltos y nitratos biológicos)',
      atmosphere: '780,840 ppmv (78.08% en volumen de toda la atmósfera terrestre)',
      human: '3.2% de la masa humana (componente de proteínas y ácidos nucleicos)',
      origin: 'Ciclo CNO de fusión nuclear estelar en estrellas medianas y gigantes',
      isotopes: ['¹⁴N (99.636%, Estable)', '¹⁵N (0.364%, Trazador biogeoquímico)'],
      compounds: [
        { formula: 'NH₃', name: 'Amoníaco (Proceso Haber-Bosch)', type: 'Covalente polar', desc: 'Nutre al 50% de la población mundial a través de fertilizantes sintéticos.' },
        { formula: 'HNO₃', name: 'Ácido nítrico', type: 'Ácido fuerte', desc: 'Fabricación de explosivos, polímeros y fertilizantes nitrogenados.' },
        { formula: 'N₂O', name: 'Óxido de diazufre / nitroso', type: 'Covalente', desc: 'Gas de la risa anestésico y propelente para cohetes y gastronomía.' },
        { formula: 'KNO₃', name: 'Nitrato de potasio', type: 'Sal iónica', desc: 'Componente clásico de la pólvora y nutriente para cultivos.' }
      ]
    },
    8: {
      crust: '461,000 ppm (46.1%) — ¡El elemento más abundante de la Tierra!',
      crustRank: '#1 en la Tierra (Corteza)',
      ocean: '857,000 ppm (85.7% de la masa del agua de mar)',
      atmosphere: '209,460 ppmv (20.95% del aire respirable)',
      human: '65.0% de la masa corporal humana (1º absoluto)',
      origin: 'Fusión de helio y carbono en estrellas masivas y supernovas',
      isotopes: ['¹⁶O (99.757%, Estable)', '¹⁸O (0.205%, Termometría paleoclimática)', '¹⁷O (0.038%, Estable)'],
      compounds: [
        { formula: 'H₂O', name: 'Agua', type: 'Covalente polar', desc: 'Medio donde se originó y transcurre la totalidad de la bioquímica celular.' },
        { formula: 'SiO₂', name: 'Dióxido de silicio (Cuarzo)', type: 'Red covalente tridimensional', desc: 'Constituye la arena, el vidrio, la cerámica y el 12% de la corteza.' },
        { formula: 'Fe₂O₃', name: 'Óxido férrico (Hematita)', type: 'Iónico', desc: 'Color rojo de la tierra, la arcilla y mena siderúrgica.' },
        { formula: 'O₃', name: 'Ozono', type: 'Alótropo gaseoso', desc: 'Capa protectora estratosférica contra la radiación ultravioleta solar.' }
      ]
    },
    9: {
      crust: '585 ppm — #13 en abundancia en la corteza (mineral fluorita)',
      crustRank: '#13 en la Tierra',
      ocean: '1.3 ppm (iones fluoruro en agua de mar)',
      atmosphere: 'Trazas despreciables',
      human: '0.0037% (presente en esmalte dental como fluorapatita)',
      origin: 'Explosiones de supernovas y vientos de estrellas gigantes AGB',
      isotopes: ['¹⁹F (100% monoisotópico natural, Estable)', '¹⁸F (Emisor PET en medicina)'],
      compounds: [
        { formula: 'CaF₂', name: 'Fluoruro de calcio (Fluorita)', type: 'Iónico cristalino', desc: 'Óptica infrarroja, fundente metalúrgico y fuente de ácido fluorhídrico.' },
        { formula: 'HF', name: 'Ácido fluorhídrico', type: 'Ácido débil extremadamente corrosivo', desc: 'Graba vidrio y es indispensable para la purificación de silicio en chips.' },
        { formula: '(C₂F₄)ₙ', name: 'Politetrafluoroetileno (Teflón)', type: 'Polímero fluorado', desc: 'Antiadherente con el menor coeficiente de fricción de los sólidos conocidos.' },
        { formula: 'UF₆', name: 'Hexafluoruro de uranio', type: 'Covalente volátil', desc: 'Gas empleado en centrífugas de enriquecimiento isotópico de uranio.' }
      ]
    },
    11: {
      crust: '23,600 ppm (2.36%) — 6º elemento más abundante de la corteza',
      crustRank: '#6 en la Tierra',
      ocean: '10,800 ppm (1.08% del agua marina, catión más abundante)',
      atmosphere: 'Trazas',
      human: '0.15% (catión principal de los fluidos extracelulares)',
      origin: 'Fusión de carbono en estrellas gigantes y supernovas de Tipo II',
      isotopes: ['²³Na (100% monoisotópico natural, Estable)'],
      compounds: [
        { formula: 'NaCl', name: 'Cloruro de sodio (Sal común)', type: 'Red iónica cúbica', desc: 'Nutriente esencial, preservante alimenticio y electrolito del plasma sanguíneo.' },
        { formula: 'NaHCO₃', name: 'Bicarbonato de sodio', type: 'Sal iónica ácida', desc: 'Antiácido estomacal, levadura química y extintor de incendios.' },
        { formula: 'NaOH', name: 'Hidróxido de sodio (Sosa cáustica)', type: 'Base iónica fuerte', desc: 'Saponificación de grasas para jabones, papel y neutralización química.' },
        { formula: 'Na₂CO₃', name: 'Carbonato de sodio (Sosa Solvay)', type: 'Sal industrial', desc: 'Fabricación de vidrio, detergentes y tratamiento de aguas duras.' }
      ]
    },
    12: {
      crust: '23,300 ppm (2.33%) — 7º elemento más abundante en la corteza terrestre',
      crustRank: '#7 en la Tierra',
      ocean: '1,290 ppm (segundo catión más abundante en océanos)',
      atmosphere: 'Inexistente',
      human: '0.05% (cofactor esencial de ATP y estabilizador del ADN)',
      origin: 'Fusión de carbono y combustión de neón en estrellas masivas',
      isotopes: ['²⁴Mg (78.99%, Estable)', '²⁵Mg (10.00%, Estable)', '²⁶Mg (11.01%, Estable)'],
      compounds: [
        { formula: 'MgO', name: 'Óxido de magnesio (Magnesia)', type: 'Iónico refractario', desc: 'Ladrillos refractarios que resisten más de 2800°C en acerías.' },
        { formula: 'Mg(OH)₂', name: 'Hidróxido de magnesio (Leche de magnesia)', type: 'Base poco soluble', desc: 'Antiácido estomacal y laxante osmótico seguro.' },
        { formula: 'MgSO₄·7H₂O', name: 'Sulfato de magnesio (Sales de Epsom)', type: 'Sal hidratada', desc: 'Baños desinflamantes y fertilizante para corregir clorosis en plantas.' },
        { formula: 'Clorofila a (C₅₅H₇₂MgN₄O₅)', name: 'Complejo de clorofila', type: 'Complejo de coordinación', desc: 'El ion Mg²⁺ en el centro absorbe luz solar impulsando la biosfera terrestre.' }
      ]
    },
    13: {
      crust: '82,300 ppm (8.23%) — ¡El metal más abundante de la corteza terrestre!',
      crustRank: '#3 en la Tierra (1º metal)',
      ocean: '0.002 ppm (muy baja solubilidad a pH marino)',
      atmosphere: 'Inexistente',
      human: '0.00009% (sin función biológica conocida)',
      origin: 'Fusión de silicio en supernovas masivas',
      isotopes: ['²⁷Al (100% monoisotópico natural, Estable)', '²⁶Al (Radiactivo interestelar)'],
      compounds: [
        { formula: 'Al₂O₃', name: 'Óxido de aluminio (Bauxita / Zafiro)', type: 'Iónico-covalente', desc: 'Mena de aluminio, abrasivo industrial y gema preciosa.' },
        { formula: 'AlCl₃', name: 'Cloruro de aluminio', type: 'Covalente ácido de Lewis', desc: 'Catalizador esencial de alquilación/acilación de Friedel-Crafts.' },
        { formula: 'KAl(SO₄)₂·12H₂O', name: 'Alumbre potásico', type: 'Sal doble hidratada', desc: 'Floculante purificador de agua potable y mordiente textil.' }
      ]
    },
    14: {
      crust: '282,000 ppm (28.2%) — 2º elemento más abundante tras el oxígeno',
      crustRank: '#2 en la Tierra',
      ocean: '2.2 ppm (ácido silícico para frústulas de diatomeas)',
      atmosphere: 'Inexistente',
      human: '0.026% (da elasticidad al tejido conjuntivo y cartílagos)',
      origin: 'Combustión de oxígeno en supernovas de estrellas masivas',
      isotopes: ['²⁸Si (92.23%, Estable)', '²⁹Si (4.67%, RMN de silicio)', '³⁰Si (3.10%, Estable)'],
      compounds: [
        { formula: 'SiO₂', name: 'Sílice (Cuarzo / Vidrio)', type: 'Red covalente', desc: 'Materia prima de todo el vidrio, hormigón y microprocesadores mundiales.' },
        { formula: 'SiC', name: 'Carburo de silicio (Carborundo)', type: 'Red covalente de extrema dureza', desc: 'Abrasivo superior y semiconductores de potencia para coches eléctricos.' },
        { formula: 'Polisiloxano [R₂SiO]ₙ', name: 'Silicona', type: 'Polímero inorgánico-orgánico', desc: 'Selladores flexibles, prótesis médicas biocompatibles y lubricantes.' }
      ]
    },
    26: {
      crust: '56,300 ppm (5.63%) — 4º elemento más abundante en la corteza terrestre',
      crustRank: '#4 en la Tierra (1º en masa planetaria total)',
      ocean: '0.002 ppm (micronutriente limitante del fitoplancton marino)',
      atmosphere: 'Trazas',
      human: '0.006% (4 a 5 gramos en un adulto: 70% en hemoglobina)',
      origin: 'Punto final de la fusión exotérmica en supernovas (pico del hierro)',
      isotopes: ['⁵⁶Fe (91.75%, El núcleo atómico más estable por nucleón)', '⁵⁴Fe (5.85%)', '⁵⁷Fe (2.12%)', '⁵⁸Fe (0.28%)'],
      compounds: [
        { formula: 'Fe₂O₃', name: 'Óxido férrico (Hematita / Herrumbre)', type: 'Iónico', desc: 'Principal mena mundial de extracción de acero y pigmento ocre.' },
        { formula: 'Fe₃O₄', name: 'Magnetita (Óxido ferroso-férrico)', type: 'Óxido de espinela inversa', desc: 'Mineral ferromagnético natural que dio origen a la brújula.' },
        { formula: 'FeSO₄', name: 'Sulfato ferroso', type: 'Sal iónica', desc: 'Tratamiento de la anemia ferropénica y floculante en depuración de aguas.' },
        { formula: 'FeCl₃', name: 'Cloruro férrico', type: 'Covalente/ácido de Lewis', desc: 'Ataque químico de placas de circuitos impresos (PCB) y coagulante.' }
      ]
    },
    29: {
      crust: '60 ppm — #26 en abundancia en la corteza terrestre',
      crustRank: '#26 en la Tierra',
      ocean: '0.00025 ppm',
      atmosphere: 'Inexistente',
      human: '0.0001% (oligoelemento central en enzimas citocromo c oxidasa)',
      origin: 'Procesos de captura neutrónica lenta (proceso-s) en gigantes rojas',
      isotopes: ['⁶³Cu (69.17%, Estable)', '⁶⁵Cu (30.83%, Estable)'],
      compounds: [
        { formula: 'CuSO₄·5H₂O', name: 'Sulfato de cobre pentahidratado', type: 'Sal iónica azul intensa', desc: 'Fungicida agrícola (Caldo Bordelés) y baños de galvanoplastia.' },
        { formula: 'CuFeS₂', name: 'Calcopirita', type: 'Sulfuro mixto', desc: 'El mineral primario de donde se extrae la mayor parte del cobre mundial.' },
        { formula: 'Cu₂O', name: 'Óxido cuproso', type: 'Semiconductor p', desc: 'Pigmento rojo y pintura anti-incrustante de cascos de barcos.' }
      ]
    },
    15: {
      crust: '1,050 ppm (0.105%) — 11º elemento más abundante en la corteza terrestre',
      crustRank: '#11 en la Tierra',
      ocean: '0.06 ppm (en forma de iones fosfato biodisponibles)',
      atmosphere: 'Inexistente',
      human: '1.0% de la masa corporal (huesos, dientes y molécula universal de energía ATP)',
      origin: 'Fusión de oxígeno y silicio en supernovas masivas',
      isotopes: ['³¹P (100% monoisotópico natural, Estable)'],
      compounds: [
        { formula: 'H₃PO₄', name: 'Ácido fosfórico', type: 'Ácido inorgánico', desc: 'Fertilizantes fosfatados, acidulante en bebidas y desoxidante de metales.' },
        { formula: 'Ca₅(PO₄)₃(OH)', name: 'Hidroxiapatita', type: 'Fosfato biomineral', desc: 'Componente mineral del 70% de los huesos y del 96% del esmalte dental.' },
        { formula: 'ATP (C₁₀H₁₆N₅O₁₃P₃)', name: 'Adenosín trifosfato', type: 'Bioquímico / Nucleótido', desc: 'Moneda universal de intercambio energético en todas las células vivas.' },
        { formula: 'P₄O₁₀', name: 'Decaóxido de tetrafósforo', type: 'Óxido covalente', desc: 'Uno de los desecantes químicos más potentes conocidos.' }
      ]
    },
    16: {
      crust: '350 ppm (0.035%) — #16 en abundancia en la corteza terrestre',
      crustRank: '#16 en la Tierra',
      ocean: '905 ppm (3º anión más abundante: ion sulfato SO₄²⁻)',
      atmosphere: 'Trazas volcánicas (SO₂ y H₂S)',
      human: '0.25% (aminoácidos cisteína y metionina en queratina del cabello y piel)',
      origin: 'Fusión de carbono y combustión de oxígeno en supernovas estelares',
      isotopes: ['³²S (94.99%, Estable)', '³⁴S (4.25%, Estable)', '³³S (0.75%, Estable)'],
      compounds: [
        { formula: 'H₂SO₄', name: 'Ácido sulfúrico', type: 'Ácido diprótico fuerte', desc: 'El producto químico industrial más producido en el mundo (termómetro económico).' },
        { formula: 'FeS₂', name: 'Pirita (Oro de los tontos)', type: 'Disulfuro de hierro', desc: 'Mineral metálico con brillo dorado y principal fuente minera de azufre.' },
        { formula: 'CaSO₄·2H₂O', name: 'Yeso (Dihidrato de sulfato de calcio)', type: 'Sal hidratada', desc: 'Material de construcción por excelencia, moldes médicos y paneles de pladur.' },
        { formula: 'SO₂', name: 'Dióxido de azufre', type: 'Gas covalente', desc: 'Conservante en enología (vino), antimicrobiano y precursor de H₂SO₄.' }
      ]
    },
    17: {
      crust: '145 ppm — #19 en abundancia en la corteza (masivo en océanos)',
      crustRank: '#19 en la corteza (#3 en océanos)',
      ocean: '19,400 ppm (1.94% de la masa de todos los mares: anión Cl⁻ dominante)',
      atmosphere: 'Trazas en aerosoles marinos',
      human: '0.15% (principal anión extracelular y ácido estomacal HCl)',
      origin: 'Fusión de oxígeno en supernovas de estrellas masivas',
      isotopes: ['³⁵Cl (75.76%, Estable)', '³⁷Cl (24.24%, Estable)'],
      compounds: [
        { formula: 'NaCl', name: 'Cloruro de sodio (Sal marina)', type: 'Red cristalina iónica', desc: 'Electrolito biológico esencial, preservante culinario y materia prima industrial.' },
        { formula: 'HCl', name: 'Ácido clorhídrico', type: 'Ácido fuerte', desc: 'Digestión en jugos gástricos, decapado de acero y síntesis química.' },
        { formula: 'NaClO', name: 'Hipoclorito de sodio (Lejía)', type: 'Agente oxidante / Sal', desc: 'Desinfectante microbiológico universal para potabilización de agua.' },
        { formula: '(C₂H₃Cl)ₙ', name: 'Policloruro de vinilo (PVC)', type: 'Termoplástico clorado', desc: 'Tuberías de agua potable, ventanas y cables aislantes.' }
      ]
    },
    18: {
      crust: '3.5 ppm en rocas',
      crustRank: '#53 en corteza (#3 en atmósfera)',
      ocean: '0.45 ppm (gas disuelto)',
      atmosphere: '9,340 ppmv (0.934% en volumen de toda la atmósfera terrestre)',
      human: 'Trazas disueltas inertes',
      origin: 'Desintegración radiactiva del Potasio-40 (⁴⁰K) en el manto terrestre',
      isotopes: ['⁴⁰Ar (99.60%, Formado por desintegración beta de ⁴⁰K)', '³⁶Ar (0.33%)'],
      compounds: [
        { formula: 'Ar (Gas monoatómico)', name: 'Argón gas puro', type: 'Gas noble inerte', desc: 'Gas protector para soldadura TIG/MIG de titanio y aluminio sin oxidación.' },
        { formula: 'HArF', name: 'Fluorohidruro de argón', type: 'Compuesto criogénico sintético (40 K)', desc: 'El único compuesto neutro de argón confirmado experimentalmente.' }
      ]
    },
    19: {
      crust: '20,900 ppm (2.09%) — 8º elemento más abundante en la corteza terrestre',
      crustRank: '#8 en la Tierra',
      ocean: '399 ppm (catión disuelto en agua de mar)',
      atmosphere: 'Inexistente',
      human: '0.20% (catión intracelular más abundante: bomba Na⁺/K⁺ y latido cardíaco)',
      origin: 'Fusión de oxígeno en supernovas estelares',
      isotopes: ['³⁹K (93.26%, Estable)', '⁴¹K (6.73%, Estable)', '⁴⁰K (0.012%, Radiactivo natural primordial)'],
      compounds: [
        { formula: 'KCl', name: 'Cloruro de potasio (Silvina)', type: 'Sal iónica', desc: 'El fertilizante agrícola de potasio más utilizado en el planeta.' },
        { formula: 'KOH', name: 'Hidróxido de potasio (Potasa cáustica)', type: 'Base fuerte', desc: 'Fabricación de jabones líquidos suaves y electrolito en pilas alcalinas.' },
        { formula: 'KNO₃', name: 'Nitrato de potasio (Salitre)', type: 'Sal oxoácida', desc: 'Conservante de carnes curadas, fertilizante soluble y pirotecnia.' }
      ]
    },
    20: {
      crust: '41,500 ppm (4.15%) — 5º elemento más abundante en la corteza terrestre',
      crustRank: '#5 en la Tierra',
      ocean: '412 ppm',
      atmosphere: 'Inexistente',
      human: '1.4% de la masa corporal (el metal más abundante en el ser humano: esqueleto)',
      origin: 'Combustión de silicio y oxígeno en supernovas tipo Ia y II',
      isotopes: ['⁴⁰Ca (96.94%, Doblemente mágico, Estable)', '⁴⁴Ca (2.09%)', '⁴²Ca (0.65%)'],
      compounds: [
        { formula: 'CaCO₃', name: 'Carbonato de calcio (Caliza / Mármol)', type: 'Sal iónica mineral', desc: 'Base del cemento Portland, piedra caliza, creta y conchas de moluscos.' },
        { formula: 'CaO', name: 'Óxido de calcio (Cal viva)', type: 'Óxido básico exotérmico', desc: 'Purificación de hierro en altos hornos, tratamiento de aguas y construcción.' },
        { formula: 'Ca(OH)₂', name: 'Hidróxido de calcio (Cal apagada)', type: 'Base inorgánica', desc: 'Morteros de albañilería, neutralización de suelos agrícolas y nixtamalización de maíz.' }
      ]
    },
    22: {
      crust: '5,650 ppm (0.56%) — 9º elemento más abundante de la corteza (2º metal de transición)',
      crustRank: '#9 en la Tierra',
      ocean: '0.001 ppm',
      atmosphere: 'Inexistente',
      human: 'Trazas biocompatibles (cero toxicidad e integración tisular)',
      origin: 'Combustión de silicio en supernovas tipo II masivas',
      isotopes: ['⁴⁸Ti (73.72%, Estable)', '⁴⁶Ti (8.25%)', '⁴⁷Ti (7.44%)', '⁴⁹Ti (5.41%)'],
      compounds: [
        { formula: 'TiO₂', name: 'Dióxido de titanio (Rutilo)', type: 'Óxido cerámico fotoactivo', desc: 'Pigmento blanco brillante universal en pinturas, plásticos y protectores solares UV.' },
        { formula: 'TiCl₄', name: 'Tetracloruro de titanio', type: 'Líquido covalente volátil', desc: 'Precursor del proceso Kroll para obtener titanio puro y catalizadores Ziegler-Natta.' },
        { formula: 'Ti-6Al-4V', name: 'Aleación de titanio Grado 5', type: 'Superaleación intermetálica', desc: 'Prótesis de cadera oseointegrables, implantes dentales y fuselajes de aviones.' }
      ]
    },
    30: {
      crust: '70 ppm — #24 en abundancia en la corteza terrestre',
      crustRank: '#24 en la Tierra',
      ocean: '0.005 ppm',
      atmosphere: 'Inexistente',
      human: '0.003% (oligoelemento indispensable en más de 300 enzimas humanas y ARN)',
      origin: 'Captura neutrónica rápida y lenta en supernovas',
      isotopes: ['⁶⁴Zn (49.17%, Estable)', '⁶⁶Zn (27.73%)', '⁶⁸Zn (18.45%)'],
      compounds: [
        { formula: 'ZnO', name: 'Óxido de zinc', type: 'Óxido semiconductor', desc: 'Ungüentos dermatológicos para quemaduras, vulcanización de caucho y filtros solares.' },
        { formula: 'ZnS', name: 'Sulfuro de zinc (Esfalerita / Blenda)', type: 'Semiconductor II-VI', desc: 'Mena primaria de zinc y fósforo luminiscente en pantallas radiológicas.' },
        { formula: 'ZnSO₄', name: 'Sulfato de zinc', type: 'Sal hidratada', desc: 'Suplemento nutricional para prevenir diarrea infantil e industria textil.' }
      ]
    },
    47: {
      crust: '0.075 ppm (75 ppb) — Metal precioso escaso en la corteza terrestre',
      crustRank: '#68 en la Tierra',
      ocean: '0.00004 ppm',
      atmosphere: 'Inexistente',
      human: '0.000001% (potente bactericida tópico en forma coloidal)',
      origin: 'Fusión de estrellas de neutrones y supernovas de colapso',
      isotopes: ['¹⁰⁷Ag (51.84%, Estable)', '¹⁰⁹Ag (48.16%, Estable)'],
      compounds: [
        { formula: 'AgNO₃', name: 'Nitrato de plata', type: 'Sal iónica fotosensible', desc: 'Producción de espejos de alta reflectividad, cauterización médica y química analítica.' },
        { formula: 'AgCl / AgBr', name: 'Haluros de plata', type: 'Cristal iónico fotosensible', desc: 'El corazón químico de toda la fotografía analógica tradicional.' },
        { formula: 'Ag₂O', name: 'Óxido de plata', type: 'Óxido iónico', desc: 'Pilas de botón de larga duración para relojes, audífonos y electrónica médica.' }
      ]
    },
    53: {
      crust: '0.45 ppm — #64 en la corteza terrestre (concentrado en algas y salmueras)',
      crustRank: '#64 en la Tierra',
      ocean: '0.06 ppm (iones yoduro y yodato marinos)',
      atmosphere: 'Trazas sobre áreas marinas',
      human: '0.00002% (esencial para la síntesis de hormonas tiroideas T3 y T4)',
      origin: 'Proceso-r en colisiones de estrellas de neutrones',
      isotopes: ['¹²⁷I (100% monoisotópico natural, Estable)', '¹³¹I (Radiactivo médico t½ = 8 días)'],
      compounds: [
        { formula: 'KI', name: 'Yoduro de potasio', type: 'Sal iónica', desc: 'Aditivo para sal yodada (previene el bocio) y protector tiroideo nuclear ante radiación.' },
        { formula: 'Povidona Yodada (C₆H₉I₂NO)ₙ', name: 'Betadine / Complejo de yodo', type: 'Complejo antiséptico', desc: 'El desinfectante quirúrgico pré-operatorio más empleado en hospitales del mundo.' },
        { formula: 'Tiroxina (C₁₅H₁₁I₄NO₄)', name: 'Hormona T4', type: 'Hormona tiroidea yodada', desc: 'Controla el ritmo metabólico basal y el desarrollo neuronal humano.' }
      ]
    },
    78: {
      crust: '0.005 ppm (5 ppb) — Uno de los metales más densos y raros de la corteza',
      crustRank: '#75 en la Tierra',
      ocean: '0.0000001 ppm',
      atmosphere: 'Inexistente',
      human: 'Biológicamente inerte (empleado en implantes y marcapasos)',
      origin: 'Colisión violenta de estrellas de neutrones (kilonovas)',
      isotopes: ['¹⁹⁵Pt (33.83%, Estable)', '¹⁹⁴Pt (32.97%)', '¹⁹⁶Pt (25.24%)'],
      compounds: [
        { formula: 'cis-[Pt(NH₃)₂Cl₂]', name: 'Cisplatino', type: 'Complejo de coordinación quimioterápico', desc: 'Uno de los medicamentos oncológicos más exitosos contra cáncer testicular y ovárico.' },
        { formula: 'PtO₂', name: 'Dióxido de platino (Catalizador de Adams)', type: 'Óxido catalizador', desc: 'Catalizador por excelencia para hidrogenación de enlaces dobles en síntesis orgánica.' },
        { formula: 'Pt/Al₂O₃', name: 'Platino sobre alúmina', type: 'Catalizador heterogéneo', desc: 'Catalizador de tres vías en vehículos para eliminar monóxido de carbono e hidrocarburos.' }
      ]
    },
    80: {
      crust: '0.085 ppm (85 ppb) — Único metal líquido a temperatura ambiente',
      crustRank: '#67 en la Tierra',
      ocean: '0.00003 ppm',
      atmosphere: 'Trazas de vapor elemental',
      human: 'Altamente tóxico y bioacumulativo (daño neurológico grave)',
      origin: 'Captura neutrónica rápida en quilonovas y supernovas masivas',
      isotopes: ['²⁰²Hg (29.86%, Estable)', '²⁰⁰Hg (23.10%)', '¹⁹⁹Hg (16.87%)'],
      compounds: [
        { formula: 'HgS', name: 'Sulfuro de mercurio (Cinabrio)', type: 'Semiconductor / Mena mineral', desc: 'Mena principal de mercurio y el legendario pigmento rojo bermellón clásico.' },
        { formula: 'Hg₂Cl₂', name: 'Cloruro mercurioso (Calomelanos)', type: 'Sal iónica poco soluble', desc: 'Electrodo de referencia estándar en electroquímica y pH-metría.' },
        { formula: 'CH₃Hg⁺', name: 'Catión metilmercurio', type: 'Organometálico neurotóxico', desc: 'Forma tóxica bioacumulativa en peces depredadores marinos (Enfermedad de Minamata).' }
      ]
    },
    82: {
      crust: '14 ppm — #36 en abundancia en la corteza terrestre',
      crustRank: '#36 en la Tierra',
      ocean: '0.00003 ppm',
      atmosphere: 'Trazas por polvo mineral',
      human: 'Tóxico acumulativo sin función biológica (saturnismo)',
      origin: 'Punto final estable de las 3 cadenas naturales de desintegración radiactiva (U y Th)',
      isotopes: ['²⁰⁸Pb (52.4%, Estable, punto final del Torio)', '²⁰⁶Pb (24.1%, Punto final del Uranio-238)', '²⁰⁷Pb (22.1%, Punto final del Uranio-235)'],
      compounds: [
        { formula: 'PbO₂ / PbSO₄', name: 'Dióxido y sulfato de plomo', type: 'Materiales electroactivos', desc: 'Química interna de las baterías de arranque de vehículos de combustión.' },
        { formula: 'PbS', name: 'Sulfuro de plomo (Galena)', type: 'Semiconductor cúbico', desc: 'La mena de plomo más abundante y primer detector de radio de cristal.' },
        { formula: 'CH₃NH₃PbI₃', name: 'Perovskita de plomo y metilamonio', type: 'Perovskita semiconductora', desc: 'Revolución moderna en células solares fotovoltaicas de ultra-alta eficiencia.' }
      ]
    },
    92: {
      crust: '2.7 ppm — Más abundante en la corteza que la plata, mercurio u oro',
      crustRank: '#48 en la Tierra',
      ocean: '0.003 ppm (en forma de complejos solubles de uranilo)',
      atmosphere: 'Inexistente',
      human: 'Tóxico por metales pesados y radiactividad alfa',
      origin: 'Fusión de estrellas de neutrones (quilonovas) antes de la formación del Sol',
      isotopes: ['²³⁸U (99.274%, t½ = 4.468 millones de años)', '²³⁵U (0.720%, Fisionable por neutrones térmicos)', '²³⁴U (0.005%)'],
      compounds: [
        { formula: 'UO₂', name: 'Dióxido de uranio', type: 'Cerámica nuclear refractaria', desc: 'El combustible estándar en pastillas cerámicas para reactores nucleares de potencia.' },
        { formula: 'UF₆', name: 'Hexafluoruro de uranio', type: 'Covalente volátil', desc: 'Gas empleado en centrífugas de enriquecimiento isotópico de ²³⁵U.' },
        { formula: 'U₃O₈', name: 'Octaóxido de triuranio (Yellowcake)', type: 'Óxido concentrado mineral', desc: 'La forma concentrada en que el uranio se comercializa internacionalmente.' }
      ]
    },
    79: {
      crust: '0.004 ppm (4 ppb) — Uno de los metales más raros de la corteza',
      crustRank: '#76 en la Tierra',
      ocean: '0.00005 ppm (en forma de complejos clorados)',
      atmosphere: 'Inexistente',
      human: '0.0000003% (biológicamente inerte y biocompatible)',
      origin: 'Colisión violenta y fusión de estrellas de neutrones (quilonovas)',
      isotopes: ['¹⁹⁷Au (100% monoisotópico natural, Estable)'],
      compounds: [
        { formula: 'HAuCl₄', name: 'Ácido cloroáurico (Oro disuelto en agua regia)', type: 'Complejo de oro(III)', desc: 'Producción de oro coloidal y nanotecnología médica.' },
        { formula: 'AuCl₃', name: 'Tricloruro de oro', type: 'Dímero covalente Au₂Cl₆', desc: 'Catalizador especializado en síntesis orgánica heterocíclica.' },
        { formula: 'Au(CN)₂⁻', name: 'Dicianoaurato (Cianuración)', type: 'Complejo de coordinación', desc: 'Complejo acuoso soluble utilizado en minería para recuperar oro.' }
      ]
    }
  };

  // Si existe en el mapa detallado, retornarlo localizado; de lo contrario generar
  const rawData = GEO_DATA[num] || (() => {
    let crustText = `${elem.number < 20 ? '10 - 500 ppm' : (elem.number > 82 ? '< 1 ppm (Muy raro / Radiactivo)' : '0.1 - 40 ppm')}`;
    let crustRank = `#${Math.min(92, elem.number + 5)} en la Tierra`;
    let oceanText = elem.number > 83 ? 'Trazas radiactivas indetectables' : '0.00001 - 0.05 ppm';
    let humanText = elem.number > 83 ? '0% (Radiactivo tóxico)' : (elem.category === 'noble-gas' ? 'Trazas gaseosas inertes' : '< 0.0001% (Trazas)');
    let originText = num <= 2 ? 'Big Bang' : (num <= 28 ? 'Fusión estelar en supernovas' : (num <= 83 ? 'Captura neutrónica (Procesos s y r en supernovas / kilonovas)' : (num <= 92 ? 'Fusión de estrellas de neutrones y desintegración natural' : 'Síntesis artificial en aceleradores de iones')));

    const s = elem.symbol;
    const compoundsList = [];

    if (elem.category === 'noble-gas') {
      compoundsList.push({ formula: `${s} (Elemental)`, name: `Gas noble ${elem.name_es}`, type: 'Inerte monoatómico', desc: 'Capa electrónica completa; no forma enlaces químicos estables en condiciones normales.' });
      if (num >= 36) {
        compoundsList.push({ formula: `${s}F₂`, name: `Difluoruro de ${elem.name_es.toLowerCase()}`, type: 'Covalente polar', desc: 'Sintetizado bajo condiciones criogénicas forzadas con flúor molecular.' });
      }
    } else if (elem.category === 'halogen') {
      compoundsList.push({ formula: `Na${s}`, name: `Haluro de sodio`, type: 'Iónico', desc: `Sal cristalina de ${elem.name_es.toLowerCase()} con sodio.` });
      compoundsList.push({ formula: `H${s}`, name: `Ácido hidrácido`, type: 'Ácido en solución', desc: `Compuesto binario fuertemente ácido al disolverse en agua.` });
    } else if (elem.category === 'alkali') {
      compoundsList.push({ formula: `${s}Cl`, name: `Cloruro de ${elem.name_es.toLowerCase()}`, type: 'Iónico cúbico', desc: 'Sal iónica soluble cristalina.' });
      compoundsList.push({ formula: `${s}OH`, name: `Hidróxido de ${elem.name_es.toLowerCase()}`, type: 'Base iónica fuerte', desc: 'Reactivo alcalino altamente soluble en agua.' });
      compoundsList.push({ formula: `${s}₂CO₃`, name: `Carbonato de ${elem.name_es.toLowerCase()}`, type: 'Iónico', desc: 'Sal básica empleada en la industria química y cerámica.' });
    } else {
      compoundsList.push({ formula: `${s}O₂`, name: `Dióxido de ${elem.name_es.toLowerCase()}`, type: 'Óxido inorgánico', desc: `Forma oxidada estable en la corteza terrestre o síntesis.` });
      compoundsList.push({ formula: `${s}Cl₃`, name: `Tricloruro de ${elem.name_es.toLowerCase()}`, type: 'Haluro metálico', desc: 'Sal anhidra reactiva y catalizador químico.' });
      compoundsList.push({ formula: `${s}(SO₄)₂`, name: `Sulfato de ${elem.name_es.toLowerCase()}`, type: 'Sal oxoácida', desc: 'Complejo soluble utilizado en química analítica e industrial.' });
    }

    return {
      crust: `${crustText}`,
      crustRank: crustRank,
      ocean: oceanText,
      atmosphere: num === 18 ? '9,340 ppmv (0.93% del aire)' : (num === 36 ? '1.14 ppmv' : (num === 54 ? '0.087 ppmv' : 'Trazas despreciables')),
      human: humanText,
      origin: originText,
      isotopes: [`${elem.number * 2 + (elem.number > 20 ? Math.floor(elem.number * 0.25) : 0)}${s} (Estable/Mayoritaria)`],
      compounds: compoundsList
    };
  })();

  return localizeGeochemistry(rawData, elem, currentLang);
}

// Adaptador para internacionalizar geoquímica y compuestos al inglés
function localizeGeochemistry(geo, elem, lang) {
  if (lang !== 'en') return geo;

  const res = { ...geo };

  if (res.crustRank) {
    res.crustRank = res.crustRank
      .replace(/ en la Tierra \(Corteza\)/g, ' on Earth (Crust)')
      .replace(/ en la Tierra \(1º en masa planetaria total\)/g, ' on Earth (1st in total planetary mass)')
      .replace(/ en la Tierra \(1º metal\)/g, ' on Earth (1st metal)')
      .replace(/ en la Tierra/g, ' on Earth')
      .replace(/ en la corteza terrestre/g, " in Earth's crust")
      .replace(/ en la corteza/g, ' in crust');
  }

  if (res.crust) {
    res.crust = res.crust
      .replace(/¡El elemento más abundante de la Tierra!/g, 'The most abundant element on Earth!')
      .replace(/¡El metal más abundante de la corteza terrestre!/g, "The most abundant metal in Earth's crust!")
      .replace(/elemento más abundante en la corteza terrestre/g, "most abundant element in Earth's crust")
      .replace(/elemento más abundante de la corteza terrestre/g, "most abundant element in Earth's crust")
      .replace(/elemento más abundante en la corteza/g, 'most abundant element in the crust')
      .replace(/elemento más abundante de la corteza/g, 'most abundant element in the crust')
      .replace(/elemento más abundante tras el oxígeno/g, 'most abundant element after oxygen')
      .replace(/en abundancia en la corteza terrestre/g, "in abundance in Earth's crust")
      .replace(/en abundancia en la corteza/g, 'in abundance in the crust')
      .replace(/Extremadamente escaso en rocas terrestres/g, 'Extremely scarce in terrestrial rocks')
      .replace(/Escaso en la corteza/g, 'Scarce in the crust')
      .replace(/Escaso en rocas pero el más dominante en la atmósfera/g, 'Scarce in rocks but dominant in the atmosphere')
      .replace(/Concentrado en depósitos evaporíticos de boratos/g, 'Concentrated in borate evaporite deposits')
      .replace(/masivo en la biosfera/g, 'massive in the biosphere')
      .replace(/Único metal líquido a temperatura ambiente/g, 'Only liquid metal at room temperature')
      .replace(/Uno de los metales más densos y raros de la corteza/g, 'One of the densest and rarest crustal metals')
      .replace(/Uno de los metales más raros de la corteza/g, 'One of the rarest crustal metals')
      .replace(/Más abundante en la corteza que la plata, mercurio u oro/g, 'More abundant in crust than silver, mercury or gold')
      .replace(/Muy raro \/ Radiactivo/g, 'Very rare / Radioactive')
      .replace(/10º/g, '10th')
      .replace(/6º/g, '6th')
      .replace(/7º/g, '7th')
      .replace(/2º/g, '2nd')
      .replace(/4º/g, '4th')
      .replace(/11º/g, '11th')
      .replace(/13º/g, '13th')
      .replace(/17º/g, '17th')
      .replace(/34º/g, '34th');
  }

  if (res.ocean) {
    res.ocean = res.ocean
      .replace(/de la masa de todos los océanos/g, 'of total ocean mass')
      .replace(/de la masa del agua de mar/g, 'of seawater mass')
      .replace(/del agua marina, catión más abundante/g, 'of seawater, most abundant cation')
      .replace(/segundo catión más abundante en océanos/g, '2nd most abundant cation in oceans')
      .replace(/muy baja solubilidad a pH marino/g, 'very low solubility at ocean pH')
      .replace(/ácido silícico para frústulas de diatomeas/g, 'silicic acid for diatom frustules')
      .replace(/en forma de iones fosfato biodisponibles/g, 'as bioavailable phosphate ions')
      .replace(/micronutriente limitante del fitoplancton marino/g, 'limiting nutrient for marine phytoplankton')
      .replace(/en forma de complejos clorados/g, 'as chlorido complexes')
      .replace(/en forma de complejos solubles de uranilo/g, 'as soluble uranyl complexes')
      .replace(/trazas disueltas/g, 'dissolved traces')
      .replace(/en salmueras y agua de mar/g, 'in brines and seawater')
      .replace(/ácido bórico disuelto/g, 'dissolved boric acid')
      .replace(/carbonatos y bicarbonatos disueltos/g, 'dissolved carbonates and bicarbonates')
      .replace(/gases disueltos y nitratos biológicos/g, 'dissolved gases and biological nitrates')
      .replace(/iones fluoruro en agua de mar/g, 'fluoride ions in seawater')
      .replace(/Trazas radiactivas indetectables/g, 'Undetectable radioactive traces');
  }

  if (res.atmosphere) {
    res.atmosphere = res.atmosphere
      .replace(/trazas en la atmósfera superior/g, 'traces in upper atmosphere')
      .replace(/se escapa continuamente hacia el espacio exterior/g, 'escapes continuously into outer space')
      .replace(/Inexistente en fase gaseosa libre/g, 'None in free gas phase')
      .replace(/Inexistente/g, 'None')
      .replace(/Dióxido de carbono gaseoso en aumento/g, 'Rising atmospheric carbon dioxide')
      .replace(/en volumen de toda la atmósfera terrestre/g, 'by volume of entire atmosphere')
      .replace(/del aire respirable/g, 'of breathable air')
      .replace(/Trazas despreciables/g, 'Negligible traces')
      .replace(/Trazas de vapor elemental/g, 'Traces of elemental vapor')
      .replace(/Trazas por polvo mineral/g, 'Traces from mineral dust')
      .replace(/del aire/g, 'of air')
      .replace(/Trazas/g, 'Traces');
  }

  if (res.human) {
    res.human = res.human
      .replace(/de la masa del cuerpo humano/g, 'of human body mass')
      .replace(/de la masa corporal humana/g, 'of human body mass')
      .replace(/de la masa humana/g, 'of human mass')
      .replace(/de la masa corporal/g, 'of human body mass')
      .replace(/3º más abundante/g, '3rd most abundant')
      .replace(/2º elemento más abundante/g, '2nd most abundant element')
      .replace(/1º absoluto/g, '1st overall')
      .replace(/Trazas despreciables \(gas biológicamente inerte\)/g, 'Negligible traces (biologically inert gas)')
      .replace(/trazas metabólicas y uso en farmacología psiquiátrica/g, 'metabolic traces & psychiatric pharmacological use')
      .replace(/Trazas no esenciales \(polvo inhalado es altamente tóxico: beriliosis\)/g, 'Non-essential traces (inhaled dust causes berylliosis)')
      .replace(/micronutriente para la pared celular vegetal y ósea/g, 'micronutrient for plant cell wall and bone matrix')
      .replace(/componente de proteínas y ácidos nucleicos/g, 'core component of proteins and nucleic acids')
      .replace(/presente en esmalte dental como fluorapatita/g, 'present in dental enamel as fluorapatite')
      .replace(/catión principal de los fluidos extracelulares/g, 'primary cation in extracellular fluids')
      .replace(/cofactor esencial de ATP y estabilizador del ADN/g, 'essential ATP cofactor and DNA stabilizer')
      .replace(/sin función biológica conocida/g, 'no known biological function')
      .replace(/da elasticidad al tejido conjuntivo y cartílagos/g, 'provides elasticity to connective tissue and cartilage')
      .replace(/huesos, dientes y molécula universal de energía ATP/g, 'bones, teeth and universal ATP energy currency')
      .replace(/4 a 5 gramos en un adulto: 70% en hemoglobina/g, '4 to 5 g in an adult: 70% in hemoglobin')
      .replace(/oligoelemento central en enzimas citocromo c oxidasa/g, 'key trace element in cytochrome c oxidase')
      .replace(/biológicamente inerte y biocompatible/g, 'biologically inert and biocompatible')
      .replace(/Biológicamente inerte \(empleado en implantes y marcapasos\)/g, 'Biologically inert (used in implants and pacemakers)')
      .replace(/Altamente tóxico y bioacumulativo \(daño neurológico grave\)/g, 'Highly toxic and bioaccumulative (severe neurotoxicity)')
      .replace(/Tóxico acumulativo sin función biológica \(saturnismo\)/g, 'Cumulative toxin with no biological function (plumbism)')
      .replace(/Tóxico por metales pesados y radiactividad alfa/g, 'Toxic due to heavy metal nature and alpha radiation')
      .replace(/0% \(Radiactivo tóxico\)/g, '0% (Toxic radioactive)')
      .replace(/Trazas gaseosas inertes/g, 'Inert gaseous traces')
      .replace(/< 0.0001% \(Trazas\)/g, '< 0.0001% (Traces)')
      .replace(/Trazas/g, 'Traces');
  }

  if (res.origin) {
    res.origin = res.origin
      .replace(/Nucleosíntesis primordial del Big Bang \(hace 13\.800 Ma\)/g, 'Primordial Big Bang nucleosynthesis (13.8 Ga ago)')
      .replace(/Big Bang \(24% del cosmos\) y desintegración alfa subterránea de U y Th/g, 'Big Bang (24% of cosmos) & subterranean U/Th alpha decay')
      .replace(/Espalación de rayos cósmicos sobre núcleos pesados interestelares/g, 'Cosmic ray spallation on interstellar heavy nuclei')
      .replace(/Espalación de rayos cósmicos interestelares/g, 'Interstellar cosmic ray spallation')
      .replace(/Espalación por rayos cósmicos sobre núcleos de carbono y oxígeno/g, 'Cosmic ray spallation on carbon and oxygen nuclei')
      .replace(/Proceso triple alfa en el núcleo de estrellas gigantes rojas/g, 'Triple-alpha process in red giant star cores')
      .replace(/Ciclo CNO de fusión nuclear estelar en estrellas medianas y gigantes/g, 'Stellar CNO fusion cycle in intermediate and giant stars')
      .replace(/Fusión de helio y carbono en estrellas masivas y supernovas/g, 'Helium and carbon fusion in massive stars and supernovae')
      .replace(/Explosiones de supernovas y vientos de estrellas gigantes AGB/g, 'Supernova explosions and AGB giant stellar winds')
      .replace(/Fusión de carbono en estrellas gigantes y supernovas de Tipo II/g, 'Carbon fusion in giant stars and Type II supernovae')
      .replace(/Fusión de carbono y combustión de neón en estrellas masivas/g, 'Carbon fusion and neon burning in massive stars')
      .replace(/Fusión de silicio en supernovas masivas/g, 'Silicon fusion in massive supernovae')
      .replace(/Combustión de oxígeno en supernovas de estrellas masivas/g, 'Oxygen burning in massive star supernovae')
      .replace(/Fusión de oxígeno y silicio en supernovas masivas/g, 'Oxygen and silicon fusion in massive supernovae')
      .replace(/Punto final de la fusión exotérmica en supernovas \(pico del hierro\)/g, 'Exothermic fusion endpoint in supernovae (iron peak)')
      .replace(/Procesos de captura neutrónica lenta \(proceso-s\) en gigantes rojas/g, 'Slow neutron capture (s-process) in red giant stars')
      .replace(/Colisión violenta de estrellas de neutrones \(kilonovas\)/g, 'Neutron star mergers (kilonovae)')
      .replace(/Colisión violenta y fusión de estrellas de neutrones \(quilonovas\)/g, 'Neutron star mergers (kilonovae)')
      .replace(/Captura neutrónica rápida en quilonovas y supernovas masivas/g, 'Rapid neutron capture in kilonovae and massive supernovae')
      .replace(/Punto final estable de las 3 cadenas naturales de desintegración radiactiva \(U y Th\)/g, 'Stable endpoint of 3 natural radioactive decay chains (U & Th)')
      .replace(/Fusión de estrellas de neutrones \(quilonovas\) antes de la formación del Sol/g, 'Neutron star merger (kilonova) prior to Solar System formation')
      .replace(/Fusión estelar en supernovas/g, 'Stellar fusion in supernovae')
      .replace(/Captura neutrónica \(Procesos s y r en supernovas \/ kilonovas\)/g, 'Neutron capture (s- and r-processes in supernovae/kilonovae)')
      .replace(/Fusión de estrellas de neutrones y desintegración natural/g, 'Neutron star mergers and natural radioactive decay')
      .replace(/Síntesis artificial en aceleradores de iones/g, 'Artificial synthesis in particle accelerators');
  }

  if (Array.isArray(res.isotopes)) {
    res.isotopes = res.isotopes.map(iso => iso
      .replace(/Protio/g, 'Protium')
      .replace(/Deuterio/g, 'Deuterium')
      .replace(/Tritio/g, 'Tritium')
      .replace(/Estable/g, 'Stable')
      .replace(/Radiactivo/g, 'Radioactive')
      .replace(/años/g, 'years')
      .replace(/Trazas/g, 'Traces')
      .replace(/Fusión limpia de deuterio/g, 'Clean deuterium fusion')
      .replace(/Absorbedor neutrónico en reactores/g, 'Neutron absorber in reactors')
      .replace(/monoisotópico natural/g, 'natural monoisotopic')
      .replace(/Extraordinaria sección de captura de neutrones/g, 'Extreme neutron capture cross section')
      .replace(/Base de la masa atómica estándar/g, 'Standard atomic weight baseline')
      .replace(/RMN biológica/g, 'Biological NMR')
      .replace(/Datación arqueológica/g, 'Archaeological dating')
      .replace(/Trazador biogeoquímico/g, 'Biogeochemical tracer')
      .replace(/Termometría paleoclimática/g, 'Paleoclimate thermometry')
      .replace(/Emisor PET en medicina/g, 'Medical PET tracer')
      .replace(/El núcleo atómico más estable por nucleón/g, 'Most tightly bound nucleus per nucleon')
      .replace(/Fisionable por neutrones térmicos/g, 'Thermal neutron fissile')
      .replace(/Estable\/Mayoritaria/g, 'Stable/Major')
    );
  }

  if (Array.isArray(res.compounds)) {
    res.compounds = res.compounds.map(comp => {
      const COMPOUND_TRANSLATIONS = {
        'Agua': { name: 'Water', type: 'Polar covalent', desc: 'Universal solvent indispensable for life and cellular metabolism.' },
        'Amoníaco': { name: 'Ammonia', type: 'Polar covalent', desc: 'Global feedstock for agricultural fertilizers and industrial cooling.' },
        'Amoníaco (Proceso Haber-Bosch)': { name: 'Ammonia (Haber-Bosch Process)', type: 'Polar covalent', desc: 'Sustains over 50% of the global population through synthetic nitrogen fertilizers.' },
        'Metano': { name: 'Methane', type: 'Nonpolar covalent', desc: 'Primary component of natural gas and high-energy hydrocarbon fuel.' },
        'Ácido clorhídrico': { name: 'Hydrochloric acid', type: 'Covalent / Acidic solution', desc: 'Industrial chemical reagent and gastric acid constituent in stomach.' },
        'Peróxido de hidrógeno': { name: 'Hydrogen peroxide', type: 'Covalent', desc: 'Strong oxidizer, industrial bleaching agent and topical antiseptic.' },
        'Helio elemental': { name: 'Elemental helium', type: 'Inert noble gas', desc: 'Forms no stable standard chemical bonds; crucial cryogenic refrigerant.' },
        'Heluro de sodio (Sintético)': { name: 'Sodium helide (Synthetic)', type: 'Extreme pressure compound (>113 GPa)', desc: 'Crystalline phase stable only under deep planetary mantle pressures.' },
        'Ion hidruro de helio': { name: 'Helium hydride ion', type: 'Astrophysical molecular ion', desc: 'The very first chemical bond formed in the early universe after the Big Bang.' },
        'Carbonato de litio': { name: 'Lithium carbonate', type: 'Ionic', desc: 'Pillar of lithium battery manufacturing and mood-stabilizing drug.' },
        'Cobaltito / Fosfato de litio': { name: 'Lithium cobalt oxide / Phosphate', type: 'Electroactive ceramic', desc: 'Premier cathode material for modern lithium-ion batteries.' },
        'Hidróxido de litio': { name: 'Lithium hydroxide', type: 'Strong base', desc: 'CO₂ scrubber in spacecraft and submarine life support systems.' },
        'Hexafluorofosfato de litio': { name: 'Lithium hexafluorophosphate', type: 'Electrolytic salt', desc: 'Standard conductive electrolyte in electric vehicle battery cells.' },
        'Óxido de berilio (Berilia)': { name: 'Beryllium oxide (Beryllia)', type: 'Refractory covalent', desc: 'Ceramic with thermal conductivity matching metals and high electrical insulation.' },
        'Berilo (Esmeralda / Aguamarina)': { name: 'Beryl (Emerald / Aquamarine)', type: 'Cyclosilicate', desc: 'Precious gemstone and primary ore for commercial beryllium extraction.' },
        'Cobre-Berilio': { name: 'Beryllium copper (Alloy)', type: 'Hardened metallic alloy', desc: 'Non-sparking, non-magnetic tools for petrochemical refineries.' },
        'Ácido bórico': { name: 'Boric acid', type: 'Covalent weak acid', desc: 'Antiseptic, eco-friendly insecticide and industrial flame retardant.' },
        'Bórax (Borato de sodio)': { name: 'Borax (Sodium borate)', type: 'Hydrated ionic salt', desc: 'Detergents, borosilicate Pyrex glassware and welding flux.' },
        'Nitruro de boro': { name: 'Boron nitride', type: 'Network covalent', desc: 'Isoelectronic with graphite/diamond; resists temperatures up to 2000°C.' },
        'Carburo de boro': { name: 'Boron carbide', type: 'Ultra-hard ceramic', desc: 'Tank armor plates, bulletproof vests and nuclear reactor control rods.' },
        'Dióxido de carbono': { name: 'Carbon dioxide', type: 'Nonpolar covalent', desc: 'Global climate thermal regulator, product of respiration and photosynthesis substrate.' },
        'Carbonato de calcio': { name: 'Calcium carbonate', type: 'Ionic', desc: 'Limestone, marble, chalk and structural shells of marine organisms.' },
        'Glucosa': { name: 'Glucose', type: 'Monosaccharide', desc: 'Universal biological energy currency synthesized in photosynthetic organisms.' },
        'Etanol': { name: 'Ethanol', type: 'Organic alcohol', desc: 'Renewable biofuel, pharmaceutical disinfectant and universal solvent.' },
        'Ácido nítrico': { name: 'Nitric acid', type: 'Strong mineral acid', desc: 'Manufacture of fertilizers, polymers, dyes and industrial explosives.' },
        'Óxido de diazufre / nitroso': { name: 'Nitrous oxide', type: 'Covalent gas', desc: 'Anesthetic laughing gas, rocket propellant and culinary foaming agent.' },
        'Nitrato de potasio': { name: 'Potassium nitrate', type: 'Ionic salt', desc: 'Black powder component and high-grade agricultural crop nutrient.' },
        'Dióxido de silicio (Cuarzo)': { name: 'Silicon dioxide (Quartz)', type: 'Network covalent', desc: 'Constitutes sand, glass, ceramics and over 12% of the crust.' },
        'Óxido férrico (Hematita)': { name: 'Ferric oxide (Hematite)', type: 'Ionic', desc: 'Source of red ochre earth color, rust and primary steel ore.' },
        'Ozono': { name: 'Ozone', type: 'Gaseous allotrope', desc: 'Stratospheric protective shield absorbing harmful solar UV-B radiation.' },
        'Fluoruro de calcio (Fluorita)': { name: 'Calcium fluoride (Fluorite)', type: 'Crystalline ionic', desc: 'Infrared optics, metallurgical flux and hydrofluoric acid precursor.' },
        'Ácido fluorhídrico': { name: 'Hydrofluoric acid', type: 'Extremely corrosive weak acid', desc: 'Etches glass and critical for microchip ultra-pure silicon processing.' },
        'Politetrafluoroetileno (Teflón)': { name: 'Polytetrafluoroethylene (Teflon)', type: 'Fluoropolymer', desc: 'Non-stick coating with the lowest friction coefficient of any known solid.' },
        'Hexafluoruro de uranio': { name: 'Uranium hexafluoride', type: 'Volatile covalent', desc: 'Feed gas for isotopic uranium-235 enrichment centrifuges.' },
        'Cloruro de sodio (Sal común)': { name: 'Sodium chloride (Table salt)', type: 'Cubic ionic lattice', desc: 'Essential dietary electrolyte, food preservative and blood plasma osmolyte.' },
        'Bicarbonato de sodio': { name: 'Sodium bicarbonate', type: 'Acidic ionic salt', desc: 'Stomach antacid, baking leavening agent and chemical fire extinguisher.' },
        'Hidróxido de sodio (Sosa cáustica)': { name: 'Sodium hydroxide (Caustic soda)', type: 'Strong ionic base', desc: 'Saponification in soap making, paper pulping and pH neutralization.' },
        'Carbonato de sodio (Sosa Solvay)': { name: 'Sodium carbonate (Soda ash)', type: 'Industrial salt', desc: 'Glass production, powdered detergents and industrial water softening.' },
        'Óxido de magnesio (Magnesia)': { name: 'Magnesium oxide (Magnesia)', type: 'Refractory ionic', desc: 'Refractory bricks enduring over 2800°C in industrial steel furnaces.' },
        'Hidróxido de magnesio (Leche de magnesia)': { name: 'Magnesium hydroxide (Milk of magnesia)', type: 'Sparingly soluble base', desc: 'Gentle gastric antacid and safe osmotic laxative suspension.' },
        'Sulfato de magnesio (Sales de Epsom)': { name: 'Magnesium sulfate (Epsom salts)', type: 'Hydrated salt', desc: 'Anti-inflammatory soaking salt and plant chlorosis corrective fertilizer.' },
        'Complejo de clorofila': { name: 'Chlorophyll complex', type: 'Coordination complex', desc: 'Central Mg²⁺ ion absorbs solar photons, powering planetary biosphere.' },
        'Óxido de aluminio (Bauxita / Zafiro)': { name: 'Aluminum oxide (Bauxite / Sapphire)', type: 'Ionic-covalent', desc: 'Primary aluminum ore, hard industrial abrasive and precious gemstone.' },
        'Cloruro de aluminio': { name: 'Aluminum chloride', type: 'Covalent Lewis acid', desc: 'Essential catalyst in organic Friedel-Crafts alkylation and acylation.' },
        'Alumbre potásico': { name: 'Potassium alum', type: 'Hydrated double salt', desc: 'Drinking water flocculant clarifier and textile dye mordant.' },
        'Sílice (Cuarzo / Vidrio)': { name: 'Silica (Quartz / Glass)', type: 'Network covalent', desc: 'Essential feedstock for modern microprocessors, fiber optics and concrete.' },
        'Carburo de silicio (Carborundo)': { name: 'Silicon carbide (Carborundum)', type: 'Ultra-hard network covalent', desc: 'Industrial abrasive and power semiconductors for electric vehicles.' },
        'Silicona': { name: 'Silicone (Polysiloxane)', type: 'Hybrid polymer', desc: 'Flexible thermal sealants, biocompatible implants and lubricants.' },
        'Óxido férrico (Hematita / Herrumbre)': { name: 'Ferric oxide (Hematite / Rust)', type: 'Ionic', desc: 'Primary ore for worldwide steel extraction and classic ochre pigment.' },
        'Magnetita (Óxido ferroso-férrico)': { name: 'Magnetite (Ferrous-ferric oxide)', type: 'Inverse spinel oxide', desc: 'Natural ferromagnetic mineral that inspired the ancient navigational compass.' },
        'Sulfato ferroso': { name: 'Ferrous sulfate', type: 'Ionic salt', desc: 'Standard therapeutic treatment for iron deficiency anemia and water coagulant.' },
        'Cloruro férrico': { name: 'Ferric chloride', type: 'Covalent Lewis acid', desc: 'Etchant for printed circuit boards (PCBs) and wastewater flocculant.' },
        'Sulfato de cobre pentahidratado': { name: 'Copper sulfate pentahydrate', type: 'Deep blue ionic salt', desc: 'Bordeaux mixture agricultural fungicide and electroplating baths.' },
        'Calcopirita': { name: 'Chalcopyrite', type: 'Mixed sulfide ore', desc: 'Primary copper ore mineral responsible for most global copper production.' },
        'Óxido cuproso': { name: 'Cuprous oxide', type: 'p-type semiconductor', desc: 'Red ceramic pigment and antifouling coating on marine vessel hulls.' },
        'Ácido fosfórico': { name: 'Phosphoric acid', type: 'Mineral acid', desc: 'Phosphate fertilizer production, food acidulant and metal rust converter.' },
        'Hidroxiapatita': { name: 'Hydroxyapatite', type: 'Biomineral phosphate', desc: 'Comprises 70% of human bone weight and 96% of dental enamel mineral.' },
        'Adenosín trifosfato': { name: 'Adenosine triphosphate (ATP)', type: 'Nucleotide energy carrier', desc: 'Universal biochemical energy token powering metabolic cellular reactions.' },
        'Decaóxido de tetrafósforo': { name: 'Tetraphosphorus decaoxide', type: 'Covalent oxide', desc: 'One of the most potent chemical drying and dehydrating agents known.' },
        'Cisplatino': { name: 'Cisplatin', type: 'Chemotherapy coordination complex', desc: 'Cornerstone oncology drug highly effective against testicular and ovarian cancers.' },
        'Dióxido de platino (Catalizador de Adams)': { name: "Platinum dioxide (Adams' catalyst)", type: 'Catalyst oxide', desc: 'Preeminent hydrogenation catalyst for organic chemical synthesis.' },
        'Platino sobre alúmina': { name: 'Platinum on alumina', type: 'Heterogeneous catalyst', desc: 'Three-way automotive catalytic converter converting carbon monoxide and hydrocarbons.' },
        'Sulfuro de mercurio (Cinabrio)': { name: 'Mercury sulfide (Cinnabar)', type: 'Semiconductor / Mineral ore', desc: 'Historic red vermilion pigment and primary mining ore for mercury.' },
        'Cloruro mercurioso (Calomelanos)': { name: 'Mercurous chloride (Calomel)', type: 'Sparingly soluble ionic salt', desc: 'Standard reference electrode in electrochemistry and laboratory pH measurement.' },
        'Catión metilmercurio': { name: 'Methylmercury cation', type: 'Neurotoxic organometallic', desc: 'Bioaccumulative marine toxin responsible for historical Minamata disease.' },
        'Dióxido y sulfato de plomo': { name: 'Lead dioxide and sulfate', type: 'Electroactive materials', desc: 'Core chemistry behind automotive lead-acid starter batteries.' },
        'Sulfuro de plomo (Galena)': { name: 'Lead sulfide (Galena)', type: 'Cubic semiconductor', desc: 'Most abundant lead ore and historically first crystal radio detector.' },
        'Perovskita de plomo y metilamonio': { name: 'Methylammonium lead perovskite', type: 'Semiconductor perovskite', desc: 'Revolutionary material driving next-generation high-efficiency solar cells.' },
        'Dióxido de uranio': { name: 'Uranium dioxide', type: 'Refractory nuclear ceramic', desc: 'Standard fuel ceramic pellets in commercial nuclear power reactors.' },
        'Octaóxido de triuranio (Yellowcake)': { name: 'Triuranium octoxide (Yellowcake)', type: 'Concentrated mineral oxide', desc: 'The internationally traded concentrated uranium oxide powder form.' },
        'Ácido cloroáurico (Oro disuelto en agua regia)': { name: 'Chloroauric acid', type: 'Gold(III) complex', desc: 'Precursor for colloidal gold nanoparticles and biomedical nanotechnology.' },
        'Tricloruro de oro': { name: 'Gold trichloride', type: 'Covalent dimer Au₂Cl₆', desc: 'Specialized homogeneous catalyst in organic heterocyclic synthesis.' },
        'Dicianoaurato (Cianuración)': { name: 'Dicyanoaurate complex', type: 'Coordination complex', desc: 'Water-soluble complex utilized globally in mining heap leaching to extract gold.' }
      };

      if (COMPOUND_TRANSLATIONS[comp.name]) {
        return {
          formula: comp.formula,
          name: COMPOUND_TRANSLATIONS[comp.name].name,
          type: COMPOUND_TRANSLATIONS[comp.name].type,
          desc: COMPOUND_TRANSLATIONS[comp.name].desc
        };
      }

      let trName = comp.name
        .replace(/Gas noble /g, 'Noble gas ')
        .replace(/Difluoruro de /g, 'Difluoride of ')
        .replace(/Haluro de sodio/g, 'Sodium halide')
        .replace(/Ácido hidrácido/g, 'Hydrohalic acid')
        .replace(/Cloruro de /g, 'Chloride of ')
        .replace(/Hidróxido de /g, 'Hydroxide of ')
        .replace(/Carbonato de /g, 'Carbonate of ')
        .replace(/Dióxido de /g, 'Dioxide of ')
        .replace(/Tricloruro de /g, 'Trichloride of ')
        .replace(/Sulfato de /g, 'Sulfate of ');

      let trType = comp.type
        .replace(/Inerte monoatómico/g, 'Inert monoatomic')
        .replace(/Covalente polar/g, 'Polar covalent')
        .replace(/Iónico cúbico/g, 'Cubic ionic')
        .replace(/Iónico/g, 'Ionic')
        .replace(/Base iónica fuerte/g, 'Strong ionic base')
        .replace(/Ácido en solución/g, 'Acid in solution')
        .replace(/Óxido inorgánico/g, 'Inorganic oxide')
        .replace(/Haluro metálico/g, 'Metal halide')
        .replace(/Sal oxoácida/g, 'Oxoacid salt');

      let trDesc = comp.desc
        .replace(/Capa electrónica completa; no forma enlaces químicos estables en condiciones normales\./g, 'Complete valence shell; forms no stable bonds under standard conditions.')
        .replace(/Sintetizado bajo condiciones criogénicas forzadas con flúor molecular\./g, 'Synthesized under cryogenic forced conditions with molecular fluorine.')
        .replace(/Sal cristalina de /g, 'Crystalline salt of ')
        .replace(/ con sodio\./g, ' with sodium.')
        .replace(/Compuesto binario fuertemente ácido al disolverse en agua\./g, 'Binary compound strongly acidic upon dissolution in water.')
        .replace(/Sal iónica soluble cristalina\./g, 'Soluble crystalline ionic salt.')
        .replace(/Reactivo alcalino altamente soluble en agua\./g, 'Alkaline reagent highly soluble in water.')
        .replace(/Sal básica empleada en la industria química y cerámica\./g, 'Basic salt utilized in chemical and ceramic industries.')
        .replace(/Forma oxidada estable en la corteza terrestre o síntesis\./g, 'Stable oxidized phase in Earth crust or synthetic preparation.')
        .replace(/Sal anhidra reactiva y catalizador químico\./g, 'Reactive anhydrous salt and chemical catalyst.')
        .replace(/Complejo soluble utilizado en química analítica e industrial\./g, 'Soluble complex utilized in analytical and industrial chemistry.');

      return {
        formula: comp.formula,
        name: trName,
        type: trType,
        desc: trDesc
      };
    });
  }

  return res;
}

function openIupacModal(elem) {
  currentModalElement = elem;
  const modal = document.getElementById('iupacModal');
  if (!modal) return;

  // Actualizar botones de navegación anterior y siguiente
  const prevBtn = document.getElementById('modalPrevElemBtn');
  const nextBtn = document.getElementById('modalNextElemBtn');
  const prevLabel = document.getElementById('modalPrevElemLabel');
  const nextLabel = document.getElementById('modalNextElemLabel');

  const prevNum = elem.number > 1 ? elem.number - 1 : 118;
  const nextNum = elem.number < 118 ? elem.number + 1 : 1;
  const prevElem = ELEMENTS_DATA.find((e) => e.number === prevNum) || ELEMENTS_DATA[prevNum - 1];
  const nextElem = ELEMENTS_DATA.find((e) => e.number === nextNum) || ELEMENTS_DATA[nextNum - 1];

  if (prevLabel && prevElem) prevLabel.textContent = `${prevElem.symbol} (${prevElem.number})`;
  if (nextLabel && nextElem) nextLabel.textContent = `${nextElem.symbol} (${nextElem.number})`;

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      selectElement(prevElem);
    };
  }
  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      selectElement(nextElem);
    };
  }

  // Botón de lectura en voz alta (Text-to-Speech)
  const speakBtn = document.getElementById('modalSpeakBtn');
  if (speakBtn) {
    speakBtn.onclick = (e) => {
      e.stopPropagation();
      speakElementDetails(elem);
    };
  }

  // Botón de copiado al portapapeles
  const copyBtn = document.getElementById('modalCopyBtn');
  if (copyBtn) {
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      copyElementData(elem);
    };
  }

  renderModalBody();
  modal.classList.remove('hidden');
}

function renderModalBody() {
  const elem = currentModalElement;
  const container = document.getElementById('modalDetailsContent');
  if (!elem || !container) return;

  const t = I18N[currentLang];
  const name = currentLang === 'es' ? elem.name_es : elem.name_en;
  const categoryLabel = t[elem.category] || elem.category;
  const phaseLabel = t[elem.phase] || elem.phase;

  // Analizar temperaturas para el simulador
  const tempValues = parseElementTemps(elem);

  container.innerHTML = `
    <!-- Barra Superior de la Ficha: Símbolo Gigante & Navegación de Pestañas -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-card p-3 sm:p-4 rounded-2xl border border-white/10">
      <div class="flex items-center gap-3.5">
        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl glass-panel border border-cyan-400/50 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
          <span class="text-[10px] text-cyan-300 font-mono font-bold leading-none">${elem.number}</span>
          <span class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">${elem.symbol}</span>
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">${name}</h3>
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full glass-button text-cyan-300 border border-cyan-500/30">
              ${categoryLabel}
            </span>
          </div>
          <div class="text-[11px] text-slate-300 flex flex-wrap items-center gap-2.5 mt-1 font-mono">
            <span><strong>${t.mass}:</strong> ${typeof elem.mass === 'number' ? elem.mass.toFixed(4) : elem.mass} u</span>
            <span><strong>${t.group}:</strong> ${elem.group}</span>
            <span><strong>${t.period}:</strong> ${elem.period}</span>
            <span><strong>${t.block}:</strong> ${elem.block}</span>
          </div>
        </div>
      </div>

      <!-- Pestañas Interactivas -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
        <button class="modal-tab-btn ${activeModalTab === 'general' ? 'active' : ''}" data-tab="general" role="tab" aria-selected="${activeModalTab === 'general'}">
          <i class="fa-solid fa-atom"></i>
          <span>${t.tabAtomicModel}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'quantum' ? 'active' : ''}" data-tab="quantum" role="tab" aria-selected="${activeModalTab === 'quantum'}">
          <i class="fa-solid fa-shapes"></i>
          <span>${t.tabQuantum}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'chemistry' ? 'active' : ''}" data-tab="chemistry" role="tab" aria-selected="${activeModalTab === 'chemistry'}">
          <i class="fa-solid fa-flask"></i>
          <span>${t.tabValences}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'compounds' ? 'active' : ''}" data-tab="compounds" role="tab" aria-selected="${activeModalTab === 'compounds'}">
          <i class="fa-solid fa-vial-virus"></i>
          <span>${t.tabCompounds}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'abundance' ? 'active' : ''}" data-tab="abundance" role="tab" aria-selected="${activeModalTab === 'abundance'}">
          <i class="fa-solid fa-earth-americas"></i>
          <span>${t.tabAbundance}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'thermal' ? 'active' : ''}" data-tab="thermal" role="tab" aria-selected="${activeModalTab === 'thermal'}">
          <i class="fa-solid fa-temperature-half"></i>
          <span>${t.tabThermal}</span>
        </button>
        <button class="modal-tab-btn ${activeModalTab === 'applications' ? 'active' : ''}" data-tab="applications" role="tab" aria-selected="${activeModalTab === 'applications'}">
          <i class="fa-solid fa-lightbulb"></i>
          <span>${t.tabHistory}</span>
        </button>
      </div>
    </div>

    <!-- Contenido Dinámico de la Pestaña Activa -->
    <div id="modalTabContainer" class="min-h-[280px]">
      ${renderActiveTabContent(elem, tempValues)}
    </div>
  `;

  // Asignar listeners a las pestañas
  container.querySelectorAll('.modal-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeModalTab = btn.dataset.tab;
      renderModalBody();
    });
  });

  // Inicializar componentes interactivos según la pestaña activa
  if (activeModalTab === 'general') {
    initBohrModelCanvas(elem);
  } else if (activeModalTab === 'thermal') {
    initThermalSimulator(elem, tempValues);
  }
}

// Parsear temperaturas en Kelvin
function parseElementTemps(elem) {
  let meltK = null;
  let boilK = null;

  if (elem.meltingPoint && elem.meltingPoint.includes('K')) {
    const match = elem.meltingPoint.match(/([\d.]+)\s*K/);
    if (match) meltK = parseFloat(match[1]);
  } else if (elem.meltingPoint && elem.meltingPoint.includes('°C')) {
    const match = elem.meltingPoint.match(/([-\d.]+)\s*°C/);
    if (match) meltK = parseFloat(match[1]) + 273.15;
  }

  if (elem.boilingPoint && elem.boilingPoint.includes('K')) {
    const match = elem.boilingPoint.match(/([\d.]+)\s*K/);
    if (match) boilK = parseFloat(match[1]);
  } else if (elem.boilingPoint && elem.boilingPoint.includes('°C')) {
    const match = elem.boilingPoint.match(/([-\d.]+)\s*°C/);
    if (match) boilK = parseFloat(match[1]) + 273.15;
  }

  return { meltK, boilK };
}

// --- 11.5. CONFIGURACIÓN ELECTRÓNICA GRÁFICA & MECÁNICA CUÁNTICA ---
let quantumViewMode = 'valence'; // 'valence' o 'full'

window.setQuantumViewMode = function(mode) {
  quantumViewMode = mode;
  renderModalBody();
};

window.copyQuantumNumbers = function(tupleStr, btnEl) {
  navigator.clipboard.writeText(tupleStr).then(() => {
    if (btnEl) {
      const originalHTML = btnEl.innerHTML;
      btnEl.innerHTML = '<i class="fa-solid fa-check text-emerald-400 text-xs"></i> <span class="text-emerald-400 font-bold text-xs">' + (I18N[currentLang].copiedTuple || '¡Copiado!') + '</span>';
      setTimeout(() => { btnEl.innerHTML = originalHTML; }, 1800);
    }
  }).catch(() => {});
};

// Componente 1: Ficha Hero de los 4 Números Cuánticos del Electrón Diferencial
function renderDiffElectronHeroCard(elem, diff, isCompact = false) {
  const t = I18N[currentLang];
  const name = currentLang === 'es' ? elem.name_es : elem.name_en;
  const tupleString = `(n=${diff.n}, l=${diff.l}, m=${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}, s=${diff.s_str})`;

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  const shellLetter = shellNames[diff.n - 1] || `Nivel ${diff.n}`;
  const lGeom = diff.l === 0
    ? (currentLang === 'es' ? 'Esférico (s)' : 'Spherical (s)')
    : diff.l === 1
      ? (currentLang === 'es' ? 'Bilobular (p)' : 'Bilobed (p)')
      : diff.l === 2
        ? (currentLang === 'es' ? 'Tetralobular (d)' : 'Four-lobed (d)')
        : (currentLang === 'es' ? 'Multilobular Complejo (f)' : 'Complex multi-lobed (f)');

  return `
    <div class="quantum-hero-card p-3.5 sm:p-4 md:p-5 rounded-2xl space-y-3 border border-cyan-500/30 shadow-xl">
      <!-- Encabezado del Hero Cuántico -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-white/10 pb-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] uppercase tracking-wider border border-cyan-500/40 flex items-center gap-1">
              <i class="fa-solid fa-bolt-lightning text-amber-400 text-[9px]"></i>
              <span>${t.diffElectronBadge}</span>
            </span>
            <h3 class="text-sm sm:text-base md:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              <span>${t.diffElectronTitle}</span>
            </h3>
          </div>
          <p class="text-[11px] text-slate-300 mt-0.5">
            ${t.diffElectronSubtitle} &bull; <strong class="text-cyan-200">${name} (${elem.symbol}, Z=${elem.number})</strong> &bull; Subnivel: <strong class="text-amber-300 font-mono">${diff.subshellKey}</strong>
          </p>
        </div>

        <!-- Cuádrupla Cuántica Destacada & Botón de Copiado -->
        <div class="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div class="glass-panel px-3 py-1.5 rounded-xl border border-cyan-400/40 flex items-center gap-2 shadow-lg shadow-cyan-500/10">
            <i class="fa-solid fa-shapes text-amber-400 text-xs"></i>
            <span class="font-mono font-bold text-xs sm:text-sm text-cyan-300 tracking-wider">
              (${diff.n}, ${diff.l}, ${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}, ${diff.s_str})
            </span>
          </div>
          <button 
            class="glass-button px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer transition-all shadow-sm"
            onclick="copyQuantumNumbers('${tupleString}', this)"
            title="${t.copyQuantumTuple}"
            aria-label="${t.copyQuantumTuple}"
          >
            <i class="fa-solid fa-copy text-xs"></i>
            <span class="hidden sm:inline text-[11px]">${t.copyQuantumTuple}</span>
          </button>
        </div>
      </div>

      <!-- 4 Tarjetas de los Números Cuánticos (n, l, m, s) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        <!-- n: Número Cuántico Principal -->
        <div class="quantum-tile p-3 rounded-xl flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-cyan-300 uppercase tracking-wider font-mono">Principal</span>
            <span class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-black flex items-center justify-center text-xs border border-cyan-500/30">n</span>
          </div>
          <div class="my-0.5">
            <div class="text-2xl sm:text-3xl font-black text-white font-mono leading-none">${diff.n}</div>
            <span class="text-[10.5px] font-bold text-cyan-200 mt-1 block font-mono">Capa ${shellLetter} (Nivel ${diff.n})</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-tight">
            ${currentLang === 'es' ? 'Determina el volumen, tamaño del orbital y la energía fundamental.' : 'Defines main energy level, average orbital radius and overall electron energy.'}
          </p>
        </div>

        <!-- l: Número Cuántico Azimutal (Momento Angular) -->
        <div class="quantum-tile p-3 rounded-xl flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-emerald-300 uppercase tracking-wider font-mono">Azimutal</span>
            <span class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black flex items-center justify-center text-xs border border-emerald-500/30">l</span>
          </div>
          <div class="my-0.5">
            <div class="text-2xl sm:text-3xl font-black text-white font-mono leading-none">${diff.l} <span class="text-base font-bold text-emerald-400 uppercase font-mono">(${diff.l_name})</span></div>
            <span class="text-[10.5px] font-bold text-emerald-200 mt-1 block">${lGeom}</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-tight">
            ${currentLang === 'es' ? 'Determina la geometría espacial tridimensional y el momento angular orbital.' : 'Defines 3D spatial geometry, orbital shape and orbital angular momentum.'}
          </p>
        </div>

        <!-- m_l: Número Cuántico Magnético -->
        <div class="quantum-tile p-3 rounded-xl flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-mono">Magnético</span>
            <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-black flex items-center justify-center text-xs border border-amber-500/30">mₗ</span>
          </div>
          <div class="my-0.5">
            <div class="text-2xl sm:text-3xl font-black text-white font-mono leading-none">${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}</div>
            <span class="text-[10.5px] font-bold text-amber-200 mt-1 block font-mono">mₗ ∈ [ -${diff.l}, +${diff.l} ]</span>
          </div>
          <p class="text-[10px] text-slate-300 leading-tight">
            ${currentLang === 'es' ? `Orientación del orbital #${diff.m_l + diff.l + 1} del subnivel en el espacio.` : `Spatial orientation of orbital #${diff.m_l + diff.l + 1} in the subshell.`}
          </p>
        </div>

        <!-- m_s: Número Cuántico de Espín -->
        <div class="quantum-tile p-3 rounded-xl flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-rose-300 uppercase tracking-wider font-mono">Espín</span>
            <span class="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 font-mono font-black flex items-center justify-center text-xs border border-rose-500/30">s</span>
          </div>
          <div class="my-0.5 flex items-baseline gap-2">
            <div class="text-2xl sm:text-3xl font-black text-white font-mono leading-none">${diff.s_str}</div>
            <span class="text-2xl font-black ${diff.s_val > 0 ? 'text-cyan-400' : 'text-rose-400'} leading-none">${diff.s_arrow}</span>
          </div>
          <span class="text-[10.5px] font-bold text-rose-200 block">
            ${diff.s_val > 0 ? (currentLang === 'es' ? 'Paralelo (↑ Horario)' : 'Parallel (↑ Clockwise)') : (currentLang === 'es' ? 'Antiparalelo (↓ Antihorario)' : 'Antiparallel (↓ Counterclockwise)')}
          </span>
          <p class="text-[10px] text-slate-300 leading-tight">
            ${diff.s_val > 0 ? (currentLang === 'es' ? 'Semillenado inicial (Regla de Hund).' : 'Initial single occupation (Hund).') : (currentLang === 'es' ? 'Apareamiento opuesto (Exclusión de Pauli).' : 'Paired opposite spin (Pauli).')}
          </p>
        </div>

      </div>

      <!-- Resumen Pedagógico Riguroso IUPAC -->
      <div class="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 text-[11px] leading-relaxed text-slate-200">
        <p>
          ${currentLang === 'es'
            ? `En el átomo neutro de <strong>${name} (${elem.symbol})</strong>, el electrón diferencial (el <strong>${elem.number}º electrón</strong> añadido según el orden de Aufbau) se aloja en el subnivel <strong>${diff.subshellKey}</strong>. Conforme a la <strong>Regla de Hund</strong> y al <strong>Principio de Exclusión de Pauli</strong>, este electrón ocupa el orbital de orientación magnética <strong>mₗ = ${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}</strong> con espín cuántico <strong>s = ${diff.s_str} (${diff.s_arrow})</strong>.`
            : `In the neutral atom of <strong>${name} (${elem.symbol})</strong>, the differentiating electron (the <strong>${elem.number}th electron</strong> added per Aufbau order) occupies the <strong>${diff.subshellKey}</strong> subshell. Following <strong>Hund's Rule</strong> and <strong>Pauli Exclusion Principle</strong>, it enters the orbital with magnetic quantum number <strong>mₗ = ${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}</strong> and spin state <strong>s = ${diff.s_str} (${diff.s_arrow})</strong>.`
          }
        </p>
      </div>
    </div>
  `;
}

// Componente 2: Configuración Electrónica Gráfica (Cajas y Espines de Hund/Pauli)
function renderOrbitalBoxesDiagram(elem, diff, isFull = false, isCompact = false) {
  const t = I18N[currentLang];
  const subshellData = parseSubshells(elem.electronConfig);
  const displaySubshells = isFull ? subshellData.full : subshellData.valence;

  return `
    <div class="glass-card p-3.5 sm:p-4 md:p-5 rounded-2xl space-y-3.5 border border-white/10 shadow-xl">
      
      <!-- Encabezado con selector de vista (Valencia vs Completa) -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h4 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <i class="fa-solid fa-table-cells text-cyan-400"></i>
            <span>${t.orbitalBoxesTitle}</span>
          </h4>
          <p class="text-[11px] text-slate-300 mt-0.5">
            ${t.orbitalBoxesSubtitle} &bull; <span class="text-cyan-300 font-mono">${elem.electronConfig}</span>
          </p>
        </div>

        <!-- Selector de Modo de Vista (Valencia vs Completa) -->
        <div class="flex items-center gap-1 glass-panel p-1 rounded-xl shrink-0 self-start sm:self-auto border border-white/10">
          <button 
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${!isFull ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-white'}"
            onclick="setQuantumViewMode('valence')"
          >
            ${t.valenceOnly}
          </button>
          <button 
            class="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isFull ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-white'}"
            onclick="setQuantumViewMode('full')"
          >
            ${t.fullConfig}
          </button>
        </div>
      </div>

      <!-- Indicador de Gas Noble si es capa de valencia -->
      ${!isFull && subshellData.coreName ? `
        <div class="glass-panel px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold flex items-center justify-center text-sm border border-indigo-500/30">
              ${subshellData.coreName}
            </span>
            <div>
              <span class="font-bold text-white block">${t.nobleGasCoreClosed}</span>
              <span class="text-[10px] text-slate-400 font-mono">
                ${subshellData.core.map(c => `${c.key}<sup>${c.count}</sup>`).join(' ')}
              </span>
            </div>
          </div>
          <button class="text-cyan-300 hover:text-white text-[11px] font-semibold underline underline-offset-2 cursor-pointer flex items-center gap-1" onclick="setQuantumViewMode('full')">
            <span>${currentLang === 'es' ? 'Ver todos los orbitales internos' : 'Expand full inner core orbitals'}</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      ` : ''}

      <!-- Contenedor de Grupos de Subniveles con sus Cajas de Orbitales -->
      <div class="space-y-3 pt-1">
        ${displaySubshells.map((s) => {
          const numOrbitals = 2 * s.l + 1;
          const maxElectrons = numOrbitals * 2;
          const isDiffSubshell = (s.key === diff.subshellKey);

          return `
            <div class="glass-card p-3 sm:p-3.5 rounded-xl border ${isDiffSubshell ? 'border-cyan-500/50 bg-cyan-950/25 shadow-md shadow-cyan-500/10' : 'border-white/10'} space-y-2">
              
              <!-- Encabezado del Subnivel -->
              <div class="flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-base sm:text-lg font-black text-white font-mono tracking-wide">
                    ${s.n}${s.type}<sup class="text-cyan-300 font-bold">${s.count}</sup>
                  </span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-md glass-panel text-slate-300 border border-white/10 font-mono">
                    n = ${s.n}, l = ${s.l} (${s.type.toUpperCase()})
                  </span>
                  ${isDiffSubshell ? `
                    <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 animate-pulse">
                      <i class="fa-solid fa-star text-[8px] text-amber-400"></i>
                      <span>${t.diffElectronBadge}</span>
                    </span>
                  ` : ''}
                </div>

                <span class="text-[10.5px] text-slate-400 font-mono font-semibold">
                  ${s.count} / ${maxElectrons} e⁻
                </span>
              </div>

              <!-- Cajas de los Orbitales de este subnivel -->
              <div class="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-0.5 overflow-x-auto pb-1">
                ${Array.from({ length: numOrbitals }).map((_, i) => {
                  const m_l = -s.l + i;
                  const hasUp = s.count >= (i + 1);
                  const hasDown = s.count >= (numOrbitals + i + 1);
                  const isDiffBox = isDiffSubshell && (m_l === diff.m_l);
                  const isDiffUp = isDiffBox && diff.s_val > 0 && hasUp;
                  const isDiffDown = isDiffBox && diff.s_val < 0 && hasDown;

                  const upTitle = hasUp ? `e⁻ (n=${s.n}, l=${s.l}, m=${m_l >= 0 ? '+' + m_l : m_l}, s=+1/2 ↑)` : '';
                  const downTitle = hasDown ? `e⁻ (n=${s.n}, l=${s.l}, m=${m_l >= 0 ? '+' + m_l : m_l}, s=-1/2 ↓)` : '';

                  return `
                    <div 
                      class="orbital-box ${isDiffBox ? 'diff-electron-box' : ''}" 
                      title="Orbital ${s.key} (mₗ = ${m_l >= 0 ? '+' + m_l : m_l})${isDiffBox ? ' — Contiene el electrón diferencial' : ''}"
                    >
                      <!-- Etiqueta m_l arriba -->
                      <span class="text-[8.5px] font-mono font-bold text-slate-400 leading-none">
                        ${m_l >= 0 ? '+' + m_l : m_l}
                      </span>

                      <!-- Flechas de espín -->
                      <div class="orbital-slot-container">
                        <!-- Espín Arriba (+1/2) -->
                        <div class="orbital-slot" title="${upTitle}">
                          ${hasUp ? `
                            <span class="electron-arrow-up ${isDiffUp ? 'ring-1 ring-cyan-300 rounded px-0.5' : ''}">↑</span>
                          ` : `
                            <span class="electron-empty">&bull;</span>
                          `}
                        </div>

                        <!-- Espín Abajo (-1/2) -->
                        <div class="orbital-slot" title="${downTitle}">
                          ${hasDown ? `
                            <span class="electron-arrow-down ${isDiffDown ? 'ring-1 ring-rose-400 rounded px-0.5' : ''}">↓</span>
                          ` : `
                            <span class="electron-empty">&bull;</span>
                          `}
                        </div>
                      </div>

                      <!-- Indicador inferior -->
                      <div class="text-[8px] font-mono leading-none">
                        ${isDiffBox ? `
                          <span class="text-[7.5px] font-black uppercase text-cyan-300 block leading-tight">e⁻ dif</span>
                        ` : `
                          <span class="text-[7.5px] text-slate-500">${s.type}</span>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Leyenda Educativa de los Principios Cuánticos (Hund, Pauli, Aufbau) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-[10.5px] text-slate-300 border-t border-white/10 font-mono">
        <div class="glass-panel p-2.5 rounded-xl border border-white/10 space-y-1">
          <strong class="text-cyan-300 flex items-center gap-1.5 font-bold font-sans">
            <i class="fa-solid fa-arrows-up-down text-cyan-400"></i>
            <span>Espines de Pauli</span>
          </strong>
          <p class="text-[10px] text-slate-300 leading-tight">
            <span class="text-cyan-400 font-bold">↑ (+½)</span> primer electrón; <span class="text-rose-400 font-bold">↓ (-½)</span> apareado con espín antiparalelo opuesto.
          </p>
        </div>

        <div class="glass-panel p-2.5 rounded-xl border border-white/10 space-y-1">
          <strong class="text-amber-300 flex items-center gap-1.5 font-bold font-sans">
            <i class="fa-solid fa-shield-halved text-amber-400"></i>
            <span>Regla de Hund</span>
          </strong>
          <p class="text-[10px] text-slate-300 leading-tight">
            Semillenado uniforme con espines paralelos (↑) de menor repulsión antes de aparearse.
          </p>
        </div>

        <div class="glass-panel p-2.5 rounded-xl border border-white/10 space-y-1">
          <strong class="text-emerald-300 flex items-center gap-1.5 font-bold font-sans">
            <i class="fa-solid fa-stairs text-emerald-400"></i>
            <span>Regla de Aufbau</span>
          </strong>
          <p class="text-[10px] text-slate-300 leading-tight">
            Orden progresivo de llenado orbital según energía creciente dada por la suma (n + l).
          </p>
        </div>
      </div>

    </div>
  `;
}

function renderQuantumTabContent(elem) {
  const diff = getDiffElectron(elem);
  const isFull = quantumViewMode === 'full';

  return `
    <div class="space-y-4 text-xs">
      <!-- HERO: NÚMEROS CUÁNTICOS DEL ELECTRÓN DIFERENCIAL -->
      ${renderDiffElectronHeroCard(elem, diff, false)}

      <!-- SECCIÓN: CONFIGURACIÓN ELECTRÓNICA GRÁFICA (CAJAS Y FLECHAS) -->
      ${renderOrbitalBoxesDiagram(elem, diff, isFull, false)}

      <!-- LABORATORIO CUÁNTICO: FUNDAMENTOS FÍSICOS Y ECUACIONES -->
      <div class="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
        <h4 class="text-sm font-bold text-white flex items-center gap-2">
          <i class="fa-solid fa-atom text-cyan-400"></i>
          <span>${currentLang === 'es' ? 'Fundamentos Cuánticos del Átomo Polielectrónico' : 'Polyelectronic Quantum Mechanics Foundations'}</span>
        </h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-300">
          <div class="glass-panel p-3 rounded-xl border border-white/10 space-y-1.5">
            <strong class="text-cyan-300 font-mono block">${currentLang === 'es' ? 'Operador Momento Angular Orbital (L̂):' : 'Orbital Angular Momentum Operator (L̂):'}</strong>
            <p>
              El módulo del momento angular está cuantizado como <span class="font-mono text-cyan-200">|L| = ℏ√[l(l+1)]</span> y su proyección en el eje z por <span class="font-mono text-amber-200">L_z = mₗ ℏ</span>, donde <span class="font-mono text-slate-200">-l ≤ mₗ ≤ +l</span>.
            </p>
          </div>
          <div class="glass-panel p-3 rounded-xl border border-white/10 space-y-1.5">
            <strong class="text-rose-300 font-mono block">${currentLang === 'es' ? 'Espín Intrínseco del Electrón (Ŝ):' : 'Intrinsic Electron Spin (Ŝ):'}</strong>
            <p>
              Fermión de espín 1/2 con <span class="font-mono text-rose-200">|S| = ℏ√(3/4)</span> y proyecciones discretas <span class="font-mono text-cyan-300">S_z = +½ℏ (↑)</span> o <span class="font-mono text-rose-300">S_z = -½ℏ (↓)</span>, base del ferromagnetismo y la estructura periódica.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Renderizado por Pestaña
function renderActiveTabContent(elem, tempValues) {
  const t = I18N[currentLang];
  const desc = currentLang === 'es' ? elem.desc_es : elem.desc_en;
  const diff = getDiffElectron(elem);

  if (activeModalTab === 'quantum') {
    return renderQuantumTabContent(elem);
  }

  if (activeModalTab === 'general') {
    const shells = parseElectronShells(elem);
    const isFull = quantumViewMode === 'full';

    return `
      <div class="space-y-4">
        <!-- 1. BLOQUE PRINCIPAL: MODELO DE BOHR Y PARÁMETROS FISICOQUÍMICOS -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <!-- Visualizador Interactivo del Modelo de Bohr (Canvas 2D) -->
          <div class="md:col-span-5 flex flex-col items-center justify-center space-y-2">
            <div class="bohr-canvas-container">
              <canvas id="bohrCanvas" width="300" height="300"></canvas>
            </div>
            <span class="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-circle-info text-cyan-400"></i>
              <span>${t.shellInstruction}</span>
            </span>
            <div class="flex flex-wrap items-center justify-center gap-1.5 max-w-xs">
              ${shells.map((count, idx) => {
                const shellLetters = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
                return `<span class="shell-pill" data-shell-idx="${idx}">${shellLetters[idx]}: <strong>${count}e⁻</strong></span>`;
              }).join('')}
            </div>
          </div>

          <!-- Ficha de Datos Fundamentales -->
          <div class="md:col-span-7 space-y-3">
            <p class="text-xs leading-relaxed text-slate-200 glass-card p-3 rounded-xl border border-white/10">
              ${desc}
            </p>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.atomicNumber}</span>
                <strong class="text-sm text-cyan-300 font-mono">${elem.number}</strong>
              </div>
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.mass}</span>
                <strong class="text-sm text-white font-mono">${typeof elem.mass === 'number' ? elem.mass.toFixed(4) : elem.mass} u</strong>
              </div>
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.phase}</span>
                <strong class="text-xs text-white">${t[elem.phase] || elem.phase}</strong>
              </div>
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.group} / ${t.period}</span>
                <strong class="text-xs text-cyan-300 font-mono">G: ${elem.group} | P: ${elem.period}</strong>
              </div>
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.block}</span>
                <strong class="text-xs text-white uppercase font-mono">${t.block} ${elem.block}</strong>
              </div>
              <div class="glass-card p-2.5 rounded-xl">
                <span class="text-[10px] text-slate-400 block">${t.density}</span>
                <strong class="text-xs text-white">${elem.density || '—'}</strong>
              </div>
            </div>

            <div class="glass-card p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
              <span class="text-slate-400">${t.electronConfig}:</span>
              <strong class="text-cyan-300 font-bold">${elem.electronConfig}</strong>
            </div>

            <!-- Acceso Rápido a Abundancia en la Tierra y Compuestos -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div class="glass-card p-2.5 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all cursor-pointer" onclick="openIupacModalTab('abundance')" role="button" tabindex="0">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
                    <i class="fa-solid fa-earth-americas text-cyan-400"></i>
                    <span>${t.tabAbundance}</span>
                  </span>
                  <span class="text-[9px] text-cyan-300 font-mono">${t.viewGeoreport}</span>
                </div>
                <strong class="text-xs text-white block mt-1">${getElementGeochemistryAndCompounds(elem).crustRank}</strong>
                <span class="text-[10px] text-slate-300 block truncate font-mono mt-0.5">${getElementGeochemistryAndCompounds(elem).crust}</span>
              </div>

              <div class="glass-card p-2.5 rounded-xl border border-amber-500/20 hover:border-amber-400/50 transition-all cursor-pointer" onclick="openIupacModalTab('compounds')" role="button" tabindex="0">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
                    <i class="fa-solid fa-vial-virus text-amber-400"></i>
                    <span>${t.tabCompounds}</span>
                  </span>
                  <span class="text-[9px] text-amber-300 font-mono">${t.viewCatalog}</span>
                </div>
                <div class="flex flex-wrap gap-1 mt-1 font-mono">
                  ${getElementGeochemistryAndCompounds(elem).compounds.slice(0, 3).map(c => `
                    <span class="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-cyan-200 font-bold">${c.formula}</span>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. NÚMEROS CUÁNTICOS DEL ELECTRÓN DIFERENCIAL (AUFBAU: n, l, m, s) -->
        ${renderDiffElectronHeroCard(elem, diff, false)}

        <!-- 3. CONFIGURACIÓN ELECTRÓNICA GRÁFICA (NOTACIÓN DE CAJAS/ORBITALES CON FLECHAS Y ESPÍN) -->
        ${renderOrbitalBoxesDiagram(elem, diff, isFull, false)}

      </div>
    `;
  }

  if (activeModalTab === 'chemistry') {
    const valences = elem.valencia.split(',').map((v) => v.trim());
    const enegVal = elem.electronegativity !== null ? elem.electronegativity : 0;
    const enegPercent = Math.min(100, Math.max(0, (enegVal / 4.0) * 100));

    return `
      <div class="space-y-4 text-xs">
        <!-- Valencias y Estados de Oxidación con Chips Interactivos -->
        <div class="glass-card p-3.5 rounded-2xl space-y-2 border border-white/10">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-atom text-cyan-400"></i>
              <span>${t.oxidationStatesTitle}</span>
            </span>
            <span class="text-[10px] text-slate-400 font-mono">${t.valencesRecommended}</span>
          </div>
          <div class="flex flex-wrap gap-2 pt-1">
            ${valences.map((val) => `
              <span class="valence-chip" title="${t.oxidationStatesTitle}">${val}</span>
            `).join('')}
          </div>
        </div>

        <!-- Electronegatividad (Escala Pauling) con Barra Interactiva -->
        <div class="glass-card p-3.5 rounded-2xl space-y-2 border border-white/10">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-bolt text-amber-400"></i>
              <span>${t.electronegativity}</span>
            </span>
            <strong class="text-sm font-mono text-cyan-300">${elem.electronegativity !== null ? elem.electronegativity + ' Pauling' : t.notAvailableInert}</strong>
          </div>
          <div class="w-full bg-slate-800/80 rounded-full h-3 p-0.5 border border-white/10 overflow-hidden relative">
            <div class="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400" style="width: ${enegPercent}%"></div>
          </div>
          <div class="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>${t.lowAttraction}</span>
            <span>2.0</span>
            <span>${t.highAttraction}</span>
          </div>
        </div>

        <!-- Parámetros Cuánticos y Atómicos -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div class="glass-card p-3 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.atomicRadius}</span>
            <strong class="text-sm text-white font-mono">${elem.atomicRadius ? elem.atomicRadius + ' pm' : '—'}</strong>
          </div>
          <div class="glass-card p-3 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.ionizationEnergy}</span>
            <strong class="text-sm text-cyan-300 font-mono">${elem.ionizationEnergy ? elem.ionizationEnergy + ' kJ/mol' : '—'}</strong>
          </div>
          <div class="glass-card p-3 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.electronAffinity}</span>
            <strong class="text-sm text-white font-mono">${elem.electronAffinity !== undefined ? elem.electronAffinity + ' kJ/mol' : '—'}</strong>
          </div>
          <div class="glass-card p-3 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.crystalStructure}</span>
            <strong class="text-xs text-white">${elem.crystalStructure || 'Estándar'}</strong>
          </div>
        </div>
      </div>
    `;
  }

  if (activeModalTab === 'thermal') {
    return `
      <div class="glass-card p-4 rounded-2xl space-y-4 border border-white/10 text-xs">
        <div class="flex items-center justify-between border-b border-white/10 pb-2">
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-1.5">
              <i class="fa-solid fa-temperature-arrow-up text-cyan-400"></i>
              <span>${t.thermalSimTitle}</span>
            </h4>
            <p class="text-[10px] text-slate-400">${t.thermalSimDesc}</p>
          </div>
          <div class="text-right font-mono">
            <span class="text-xs text-slate-400 block">${t.simulatedTempLabel}</span>
            <strong id="simTempDisplay" class="text-base font-black text-cyan-300">298.15 K (25 °C)</strong>
          </div>
        </div>

        <!-- Slider de Temperatura -->
        <div class="space-y-1.5 pt-1">
          <input type="range" id="tempRangeInput" class="temp-slider" min="0" max="4000" step="5" value="${simulatedTempK}" />
          <div class="flex justify-between text-[9px] text-slate-400 font-mono">
            <span>0 K (-273°C)</span>
            <span>1000 K (727°C)</span>
            <span>2000 K</span>
            <span>3000 K</span>
            <span>4000 K (3727°C)</span>
          </div>
        </div>

        <!-- Indicador de Fase en Tiempo Real -->
        <div id="simStateBadge" class="glass-panel p-4 rounded-xl flex items-center justify-between border border-cyan-400/30">
          <!-- Calculado dinámicamente -->
        </div>

        <!-- Presets Rápidos -->
        <div class="space-y-1">
          <span class="text-[10px] text-slate-400 block uppercase font-semibold">${t.referencePointsLabel}</span>
          <div class="flex flex-wrap gap-1.5">
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="0">${t.presetAbsoluteZero}</button>
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="77.36">${t.presetLiquidNitrogen}</button>
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="273.15">${t.presetWaterIce}</button>
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="298.15">${t.presetAmbient}</button>
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="373.15">${t.presetWaterSteam}</button>
            <button class="glass-button px-2 py-1 rounded-lg text-[10px] temp-preset-btn" data-k="1800">${t.presetBlastFurnace}</button>
          </div>
        </div>

        <!-- Datos Termodinámicos Oficiales -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          <div class="glass-panel p-2.5 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.meltingPoint}</span>
            <strong class="text-xs text-white font-mono">${elem.meltingPoint || '—'}</strong>
          </div>
          <div class="glass-panel p-2.5 rounded-xl">
            <span class="text-[10px] text-slate-400 block">${t.boilingPoint}</span>
            <strong class="text-xs text-white font-mono">${elem.boilingPoint || '—'}</strong>
          </div>
          <div class="glass-panel p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <span class="text-[10px] text-slate-400 block">${t.density}</span>
            <strong class="text-xs text-white font-mono">${elem.density || '—'}</strong>
          </div>
        </div>
      </div>
    `;
  }

  if (activeModalTab === 'applications') {
    return `
      <div class="space-y-3.5 text-xs">
        <div class="glass-card p-3.5 rounded-2xl space-y-2 border border-white/10">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-clock-rotate-left text-cyan-400"></i>
            <h4 class="text-sm font-bold text-white">${t.historyTitle}</h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="glass-panel p-2.5 rounded-xl">
              <span class="text-[10px] text-slate-400 block">${t.discoveredBy}</span>
              <strong class="text-xs text-slate-100">${elem.discoveredBy}</strong>
            </div>
            <div class="glass-panel p-2.5 rounded-xl">
              <span class="text-[10px] text-slate-400 block">${t.year}</span>
              <strong class="text-xs text-cyan-300 font-mono">${elem.year ? (elem.year > 0 ? elem.year : Math.abs(elem.year) + (currentLang === 'es' ? ' a.C.' : ' BCE')) : 'IUPAC'}</strong>
            </div>
          </div>
        </div>

        <div class="glass-card p-3.5 rounded-2xl space-y-2 border border-white/10">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-industry text-amber-400"></i>
            <h4 class="text-sm font-bold text-white">${t.applications}</h4>
          </div>
          <p class="text-xs leading-relaxed text-slate-200">
            ${desc}
          </p>
        </div>
      </div>
    `;
  }

  if (activeModalTab === 'abundance') {
    const geo = getElementGeochemistryAndCompounds(elem);
    return `
      <div class="space-y-3.5 text-xs">
        <div class="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-earth-americas text-cyan-400"></i>
              <span>${t.abundanceTitle}</span>
            </h4>
            <p class="text-[10px] text-slate-300 font-mono mt-0.5">${t.abundanceDistributionDesc}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-black glass-panel border border-cyan-400/50 text-cyan-300 font-mono shadow-md">
            ${geo.crustRank}
          </span>
        </div>

        <!-- Métricas Principales en la Tierra -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div class="abundance-metric">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-mountain text-emerald-400"></i>
              <span>${t.crustLabel}</span>
            </span>
            <strong class="text-sm text-white font-mono my-1 block">${geo.crust.split('—')[0].trim()}</strong>
            <span class="text-[9.5px] text-slate-300">${geo.crust.includes('—') ? geo.crust.split('—')[1].trim() : t.crustRocksDesc}</span>
          </div>

          <div class="abundance-metric">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-water text-sky-400"></i>
              <span>${t.oceanLabel}</span>
            </span>
            <strong class="text-sm text-cyan-300 font-mono my-1 block">${geo.ocean}</strong>
            <span class="text-[9.5px] text-slate-300">${t.oceanSaltsDesc}</span>
          </div>

          <div class="abundance-metric">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-wind text-indigo-400"></i>
              <span>${t.atmosphereLabel}</span>
            </span>
            <strong class="text-sm text-white font-mono my-1 block">${geo.atmosphere}</strong>
            <span class="text-[9.5px] text-slate-300">${t.atmosphereGasDesc}</span>
          </div>

          <div class="abundance-metric">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-dna text-rose-400"></i>
              <span>${t.humanLabel}</span>
            </span>
            <strong class="text-sm text-rose-300 font-mono my-1 block">${geo.human.split('(')[0].trim()}</strong>
            <span class="text-[9.5px] text-slate-300">${geo.human.includes('(') ? geo.human.split('(')[1].replace(')', '') : t.humanBiomolecularDesc}</span>
          </div>
        </div>

        <!-- Origen Cósmico & Isótopos -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div class="md:col-span-6 glass-card p-3 rounded-2xl border border-white/10 space-y-1.5">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-meteor text-amber-400"></i>
              <span>${t.originLabel}</span>
            </span>
            <p class="text-xs text-white leading-relaxed font-medium">
              ${geo.origin}
            </p>
          </div>

          <div class="md:col-span-6 glass-card p-3 rounded-2xl border border-white/10 space-y-1.5">
            <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
              <i class="fa-solid fa-circle-nodes text-cyan-400"></i>
              <span>${t.isotopesLabel}</span>
            </span>
            <div class="flex flex-wrap gap-1.5 pt-0.5">
              ${geo.isotopes.map(iso => `<span class="isotope-pill">${iso}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (activeModalTab === 'compounds') {
    const geo = getElementGeochemistryAndCompounds(elem);
    const networkDesc = elem.category === 'alkali' || elem.category === 'alkaline-earth'
      ? t.reactivityNetworkIonic
      : (elem.category === 'reactive-nonmetal' || elem.category === 'halogen'
        ? t.reactivityNetworkCovalent
        : (elem.category === 'noble-gas' ? t.reactivityNetworkNoble : t.reactivityNetworkCoord));

    return `
      <div class="space-y-3.5 text-xs">
        <div class="glass-card p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
          <div>
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-vial-virus text-amber-400"></i>
              <span>${t.compoundsTitle}</span>
            </h4>
            <p class="text-[10px] text-slate-300 mt-0.5">${t.compoundsSubtitle}</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold glass-button text-amber-300 font-mono">
            ${geo.compounds.length} ${t.compoundsAnalyzed}
          </span>
        </div>

        <!-- Grid de Compuestos Principales -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          ${geo.compounds.map(comp => `
            <div class="compound-card flex flex-col justify-between space-y-2">
              <div class="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                <div>
                  <div class="compound-formula">${comp.formula}</div>
                  <h5 class="text-xs font-bold text-white mt-0.5">${comp.name}</h5>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="text-[9.5px] px-2 py-0.5 rounded-full font-mono font-semibold bg-white/10 text-cyan-300 border border-white/10">
                    ${comp.type}
                  </span>
                  <button class="w-6 h-6 rounded-lg glass-button flex items-center justify-center text-slate-300 hover:text-white" title="${t.copyFormula}" onclick="copyCompoundFormula('${comp.formula}', this)" aria-label="${t.copyFormula}">
                    <i class="fa-solid fa-copy text-[10px]"></i>
                  </button>
                </div>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed font-sans">
                ${comp.desc}
              </p>
            </div>
          `).join('')}
        </div>

        <!-- Resumen de Reactividad Química -->
        <div class="glass-card p-3 rounded-2xl border border-white/10 space-y-1.5">
          <span class="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
            <i class="fa-solid fa-fire-flame-curved text-rose-400"></i>
            <span>${t.reactivityTitle}</span>
          </span>
          <p class="text-xs text-slate-200 leading-relaxed">
            ${currentLang === 'es'
              ? `${name} interactúa electroquímicamente según sus estados de valencia <strong>${elem.valencia}</strong> y electronegatividad de <strong>${elem.electronegativity !== null ? elem.electronegativity + ' Pauling' : t.notAvailableInert}</strong>, formando preferentemente redes ${networkDesc}.`
              : `${name} interacts electrochemically based on its oxidation states <strong>${elem.valencia}</strong> and electronegativity of <strong>${elem.electronegativity !== null ? elem.electronegativity + ' Pauling' : t.notAvailableInert}</strong>, forming primarily ${networkDesc}.`
            }
          </p>
        </div>
      </div>
    `;
  }

  return '';
}

// Desglosar electrones por capa a partir de la propiedad o número atómico
function parseElectronShells(elem) {
  if (elem.electronsPerShell && elem.electronsPerShell.includes(',')) {
    return elem.electronsPerShell.split(',').map((n) => parseInt(n.trim(), 10) || 0);
  }
  // Cálculo aproximado por defecto según capacidades de capas 2n^2
  let remaining = elem.number;
  const capacities = [2, 8, 18, 32, 32, 18, 8];
  const shells = [];
  for (let cap of capacities) {
    if (remaining <= 0) break;
    const count = Math.min(remaining, cap);
    shells.push(count);
    remaining -= count;
  }
  return shells;
}

// Visualizador Interactivo del Modelo de Bohr (Canvas 2D)
function initBohrModelCanvas(elem) {
  const canvas = document.getElementById('bohrCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (bohrAnimFrameId) {
    cancelAnimationFrame(bohrAnimFrameId);
    bohrAnimFrameId = null;
  }

  const shells = parseElectronShells(elem);
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  // Asignar listeners a las pastillas de capas
  document.querySelectorAll('.shell-pill').forEach((pill) => {
    pill.addEventListener('mouseenter', () => {
      highlightedShellIdx = parseInt(pill.dataset.shellIdx, 10);
      document.querySelectorAll('.shell-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
    pill.addEventListener('mouseleave', () => {
      highlightedShellIdx = null;
      pill.classList.remove('active');
    });
  });

  let angle = 0;

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Núcleo Atómico con Efecto de Halo Cuántico
    const nucleusRadius = 18;
    const nucleusGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, nucleusRadius * 1.8);
    nucleusGrad.addColorStop(0, '#ffffff');
    nucleusGrad.addColorStop(0.3, '#38bdf8');
    nucleusGrad.addColorStop(0.7, '#0284c7');
    nucleusGrad.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(centerX, centerY, nucleusRadius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = nucleusGrad;
    ctx.fill();

    // Texto en el Núcleo (Símbolo y Z)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(elem.symbol, centerX, centerY - 2);

    ctx.fillStyle = '#7dd3fc';
    ctx.font = '8px JetBrains Mono';
    ctx.fillText(`${elem.number}+`, centerX, centerY + 9);

    // 2. Órbitas Concéntricas y Electrones
    const maxRadius = Math.min(centerX, centerY) - 15;
    const baseRadius = 30;
    const stepRadius = (maxRadius - baseRadius) / Math.max(1, shells.length);

    shells.forEach((electronCount, shellIdx) => {
      const orbitRadius = baseRadius + shellIdx * stepRadius;
      const isHighlighted = highlightedShellIdx === shellIdx;

      // Dibujar Órbita
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
      ctx.strokeStyle = isHighlighted 
        ? (isLight ? 'rgba(2, 132, 199, 0.95)' : 'rgba(56, 189, 248, 0.9)') 
        : (isLight ? 'rgba(14, 116, 144, 0.25)' : 'rgba(255, 255, 255, 0.15)');
      ctx.lineWidth = isHighlighted ? 2 : 1;
      ctx.setLineDash(isHighlighted ? [4, 2] : [2, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dibujar Electrones Orbitando
      const speedMultiplier = (shellIdx % 2 === 0 ? 1 : -1) * (1 / (shellIdx + 1.2));
      const shellAngle = angle * speedMultiplier;

      for (let i = 0; i < electronCount; i++) {
        const electronAngle = shellAngle + (i * (Math.PI * 2 / electronCount));
        const ex = centerX + Math.cos(electronAngle) * orbitRadius;
        const ey = centerY + Math.sin(electronAngle) * orbitRadius;

        // Resplandor del electrón
        const eColor = isHighlighted 
          ? (isLight ? '#0284c7' : '#38bdf8') 
          : (isLight ? '#0284c7' : '#7dd3fc');
        const eGlow = isLight ? '#0284c7' : '#38bdf8';

        ctx.beginPath();
        ctx.arc(ex, ey, isHighlighted ? 4.5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = eColor;
        ctx.shadowColor = eGlow;
        ctx.shadowBlur = isHighlighted ? 10 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    angle += 0.02;
    bohrAnimFrameId = requestAnimationFrame(animate);
  }

  animate();
}

// Simulador Térmico Interactivo de Fases
function initThermalSimulator(elem, tempValues) {
  const slider = document.getElementById('tempRangeInput');
  const tempDisplay = document.getElementById('simTempDisplay');
  const stateBadge = document.getElementById('simStateBadge');
  if (!slider || !tempDisplay || !stateBadge) return;
  const t = I18N[currentLang] || I18N.es;

  function updateSimulation(tempK) {
    simulatedTempK = tempK;
    const tempC = (tempK - 273.15).toFixed(1);
    tempDisplay.textContent = `${tempK.toFixed(1)} K (${tempC} °C)`;

    let stateText = t.solidState;
    let stateIcon = 'fa-cube';
    let stateColor = 'text-cyan-400';
    let stateDesc = t.solidDesc;

    const melt = tempValues.meltK !== null ? tempValues.meltK : 1000;
    const boil = tempValues.boilK !== null ? tempValues.boilK : 2000;

    if (tempK >= boil) {
      stateText = t.gasState;
      stateIcon = 'fa-wind';
      stateColor = 'text-amber-400';
      stateDesc = t.gasDesc;
    } else if (tempK >= melt) {
      stateText = t.liquidState;
      stateIcon = 'fa-droplet';
      stateColor = 'text-emerald-400';
      stateDesc = t.liquidDesc;
    }

    stateBadge.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-lg ${stateColor}">
          <i class="fa-solid ${stateIcon}"></i>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 block uppercase font-mono">${t.calculatedPhaseLabel}</span>
          <strong class="text-sm font-black ${stateColor} tracking-wide">${stateText}</strong>
        </div>
      </div>
      <p class="text-[11px] text-slate-300 max-w-xs text-right hidden sm:block">
        ${stateDesc}
      </p>
    `;
  }

  slider.addEventListener('input', (e) => {
    updateSimulation(parseFloat(e.target.value));
  });

  document.querySelectorAll('.temp-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = parseFloat(btn.dataset.k);
      slider.value = k;
      updateSimulation(k);
    });
  });

  updateSimulation(simulatedTempK);
}

// Lectura en voz alta del elemento (Text-to-Speech)
function speakElementDetails(elem) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const geo = getElementGeochemistryAndCompounds(elem);
  const diff = getDiffElectron(elem);
  const name = currentLang === 'es' ? elem.name_es : elem.name_en;
  const desc = currentLang === 'es' ? elem.desc_es : elem.desc_en;
  const compStr = geo.compounds.slice(0, 3).map(c => c.name).join(', ');
  const text = currentLang === 'es'
    ? `${name}. Símbolo: ${elem.symbol}. Número atómico: ${elem.number}. Masa atómica: ${elem.mass}. Valencia: ${elem.valencia}. Electrón diferencial en subnivel ${diff.subshellKey}, con números cuánticos: n igual a ${diff.n}, l igual a ${diff.l}, m igual a ${diff.m_l}, espín ${diff.s_str}. Abundancia en la Tierra: ${geo.crustRank}, con ${geo.crust}. Principales compuestos: ${compStr}. ${desc}`
    : `${name}. Symbol: ${elem.symbol}. Atomic number: ${elem.number}. Atomic mass: ${elem.mass}. Valence: ${elem.valencia}. Differentiating electron in ${diff.subshellKey} subshell, quantum numbers: n equals ${diff.n}, l equals ${diff.l}, m equals ${diff.m_l}, spin ${diff.s_str}. Earth abundance: ${geo.crustRank}, ${geo.crust}. Key compounds: ${compStr}. ${desc}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang === 'es' ? 'es-ES' : 'en-US';
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}

// Copiar datos del elemento al portapapeles
function copyElementData(elem) {
  const geo = getElementGeochemistryAndCompounds(elem);
  const diff = getDiffElectron(elem);
  const name = currentLang === 'es' ? elem.name_es : elem.name_en;
  const compList = geo.compounds.map(c => `${c.formula} (${c.name})`).join(', ');
  const isEs = currentLang === 'es';
  const formatted = isEs ? `[IUPAC 2026] ${elem.number} - ${elem.symbol} (${name})
Masa Atómica: ${elem.mass} u
Valencia: ${elem.valencia}
Configuración Electrónica: ${elem.electronConfig}
Electrón Diferencial (Aufbau): n=${diff.n}, l=${diff.l} (${diff.l_name}), m=${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}, s=${diff.s_str} (${diff.s_arrow}) [Subnivel: ${diff.subshellKey}]
Grupo: ${elem.group} | Periodo: ${elem.period} | Bloque: ${elem.block}
Electronegatividad: ${elem.electronegativity || 'N/A'}
Abundancia en la Tierra: ${geo.crustRank} [${geo.crust}]
Océanos: ${geo.ocean} | Atmósfera: ${geo.atmosphere}
Compuestos Principales: ${compList}` : `[IUPAC 2026] ${elem.number} - ${elem.symbol} (${name})
Atomic Weight: ${elem.mass} u
Valence: ${elem.valencia}
Electron Configuration: ${elem.electronConfig}
Differentiating Electron (Aufbau): n=${diff.n}, l=${diff.l} (${diff.l_name}), m=${diff.m_l >= 0 ? '+' + diff.m_l : diff.m_l}, s=${diff.s_str} (${diff.s_arrow}) [Subshell: ${diff.subshellKey}]
Group: ${elem.group} | Period: ${elem.period} | Block: ${elem.block}
Electronegativity: ${elem.electronegativity || 'N/A'}
Earth Abundance: ${geo.crustRank} [${geo.crust}]
Oceans: ${geo.ocean} | Atmosphere: ${geo.atmosphere}
Key Compounds: ${compList}`;

  navigator.clipboard.writeText(formatted).then(() => {
    const copyBtn = document.getElementById('modalCopyBtn');
    if (copyBtn) {
      copyBtn.innerHTML = '<i class="fa-solid fa-check text-emerald-400 text-xs"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-solid fa-copy text-xs"></i>';
      }, 1500);
    }
  }).catch(() => {});
}

// --- 10. GRÁFICO DE TENDENCIAS EN GLASS (CHART.JS) ---
function initTrendsChart() {
  const ctx = document.getElementById('trendsChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const datasetFiltered = ELEMENTS_DATA.filter((e) => e[activeProperty] !== null && e[activeProperty] !== undefined);
  const labels = datasetFiltered.map((e) => `${e.number} ${e.symbol}`);
  const data = datasetFiltered.map((e) => {
    const val = e[activeProperty];
    return typeof val === 'number' ? val : parseFloat(val) || 0;
  });

  const isEn = currentLang === 'en';
  const propertyLabels = {
    electronegativity: isEn ? 'Electronegativity (Pauling)' : 'Electronegatividad (Pauling)',
    mass: isEn ? 'Atomic Weight (u)' : 'Masa Atómica (u)',
    atomicRadius: isEn ? 'Atomic Radius (pm)' : 'Radio Atómico (pm)',
    ionizationEnergy: isEn ? '1st Ionization Energy (kJ/mol)' : '1ª Energía de Ionización (kJ/mol)',
    valencia: isEn ? 'Primary Valence Value' : 'Valor de Valencia Principal',
    density: isEn ? 'Density (g/cm³)' : 'Densidad (g/cm³)',
    electronConfig: isEn ? 'Electron Configuration' : 'Configuración Electrónica'
  };

  const currentLabel = propertyLabels[activeProperty] || (isEn ? 'Physicochemical Property' : 'Propiedad Fisicoquímica');

  if (trendsChartInstance) {
    trendsChartInstance.destroy();
  }

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#334155' : '#cbd5e1';
  const ticksColor = isLight ? '#64748b' : '#94a3b8';
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.05)';
  const accentColor = isLight ? '#0284c7' : '#38bdf8';
  const accentBg = isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.12)';
  const pointBorder = isLight ? '#ffffff' : '#060913';
  const tooltipBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)';
  const tooltipTitle = isLight ? '#0284c7' : '#38bdf8';
  const tooltipBody = isLight ? '#0f172a' : '#ffffff';
  const tooltipBorder = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.15)';

  trendsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: currentLabel,
          data: data,
          borderColor: accentColor,
          backgroundColor: accentBg,
          borderWidth: 2,
          pointBackgroundColor: accentColor,
          pointBorderColor: pointBorder,
          pointHoverRadius: 6,
          pointRadius: 3,
          tension: 0.25,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', weight: '600' }
          }
        },
        tooltip: {
          backgroundColor: tooltipBg,
          titleColor: tooltipTitle,
          bodyColor: tooltipBody,
          borderColor: tooltipBorder,
          borderWidth: 1,
          padding: 10
        }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: ticksColor, font: { size: 10, family: 'JetBrains Mono' } }
        },
        y: {
          grid: { color: gridColor },
          ticks: { color: ticksColor, font: { size: 10, family: 'JetBrains Mono' } }
        }
      }
    }
  });
}

// --- 11. BÚSQUEDA Y FILTRADO EN TIEMPO REAL ---
function applyFilters() {
  const searchInput = document.getElementById('elementSearch');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  const cells = document.querySelectorAll('.element-cell:not(.placeholder-cell)');

  cells.forEach((cell) => {
    const num = cell.dataset.number;
    const symbol = cell.dataset.symbol;
    const nameEs = cell.dataset.nameEs;
    const nameEn = cell.dataset.nameEn;
    const valencia = cell.dataset.valencia;
    const category = cell.dataset.category;

    const matchesSearch =
      query === '' ||
      symbol.includes(query) ||
      num === query ||
      nameEs.includes(query) ||
      nameEn.includes(query) ||
      valencia.includes(query);

    const matchesCategory = activeCategory === 'all' || category === activeCategory;

    if (matchesSearch && matchesCategory) {
      cell.classList.remove('dimmed');
    } else {
      cell.classList.add('dimmed');
    }
  });
}

// --- 12. CAMBIO DE IDIOMA (i18n) ---
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('zperiod_lang', lang);

  const t = I18N[lang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  const searchInput = document.getElementById('elementSearch');
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.innerHTML = `<i class="fa-solid fa-globe text-cyan-400"></i><span>${t.btnLangText}</span>`;
  }

  // Actualizar tooltips y accesibilidad en botones principales
  const fsBtn = document.getElementById('toggleFullscreenBtn');
  if (fsBtn) {
    fsBtn.title = t.ttFullscreen;
    fsBtn.setAttribute('aria-label', t.ttFullscreen);
  }
  const trBtn = document.getElementById('toggleTrendsBtn');
  if (trBtn) {
    trBtn.title = t.ttTrends;
    trBtn.setAttribute('aria-label', t.ttTrends);
  }
  const spkBtn = document.getElementById('modalSpeakBtn');
  if (spkBtn) {
    spkBtn.title = t.ttSpeak;
    spkBtn.setAttribute('aria-label', t.ttSpeak);
  }
  const cpyBtn = document.getElementById('modalCopyBtn');
  if (cpyBtn) {
    cpyBtn.title = t.ttCopy;
    cpyBtn.setAttribute('aria-label', t.ttCopy);
  }
  const clsModalBtn = document.getElementById('closeModalBtn');
  if (clsModalBtn) {
    clsModalBtn.title = t.ttClose;
    clsModalBtn.setAttribute('aria-label', t.ttClose);
  }
  const clsTrBtn = document.getElementById('closeTrendsBtn');
  if (clsTrBtn) {
    clsTrBtn.title = t.ttClose;
    clsTrBtn.setAttribute('aria-label', t.ttClose);
  }
  const prevBtn = document.getElementById('modalPrevElemBtn');
  if (prevBtn) {
    prevBtn.title = t.ttPrevious;
    prevBtn.setAttribute('aria-label', t.ttPrevious);
  }
  const nextBtn = document.getElementById('modalNextElemBtn');
  if (nextBtn) {
    nextBtn.title = t.ttNext;
    nextBtn.setAttribute('aria-label', t.ttNext);
  }

  updateThemeUI();
  renderPeriodicTable();
  if (selectedElement) {
    renderCentralHub(selectedElement);
  }

  // Refrescar el modal si se encuentra abierto
  const modal = document.getElementById('iupacModal');
  if (modal && !modal.classList.contains('hidden') && currentModalElement) {
    renderModalBody();
  }

  initTrendsChart();
  initVisitCounter();
}

// --- 13. INICIALIZACIÓN ---
function initApp() {
  initThemeSystem();
  initVisitCounter();
  renderPeriodicTable();
  renderCentralHub(selectedElement);
  initTrendsChart();

  const searchInput = document.getElementById('elementSearch');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  document.querySelectorAll('[data-category-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-category-filter]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.categoryFilter;
      applyFilters();
    });
  });

  const propertySelect = document.getElementById('propertySelect');
  if (propertySelect) {
    propertySelect.addEventListener('change', (e) => {
      activeProperty = e.target.value;
      renderPeriodicTable();
      initTrendsChart();
    });
  }

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const nextLang = currentLang === 'es' ? 'en' : 'es';
      setLanguage(nextLang);
    });
  }

  // Botón Ajustar Pantalla Completa
  const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
  if (toggleFullscreenBtn) {
    toggleFullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // Desvanecimiento suave del aviso de scroll horizontal en móviles
  const scrollContainer = document.querySelector('.periodic-fullscreen-container');
  const scrollHint = document.getElementById('mobileScrollHint');
  if (scrollContainer && scrollHint) {
    let fadeTimer = null;
    scrollContainer.addEventListener('scroll', () => {
      scrollHint.style.opacity = '0';
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => {
        scrollHint.classList.add('hidden');
      }, 400);
    }, { passive: true });

    setTimeout(() => {
      if (scrollHint) {
        scrollHint.style.opacity = '0';
        setTimeout(() => scrollHint.classList.add('hidden'), 400);
      }
    }, 3800);
  }

  // Modales
  const toggleTrendsBtn = document.getElementById('toggleTrendsBtn');
  const trendsModal = document.getElementById('trendsModal');
  const closeTrendsBtn = document.getElementById('closeTrendsBtn');

  if (toggleTrendsBtn && trendsModal) {
    toggleTrendsBtn.addEventListener('click', () => {
      trendsModal.classList.remove('hidden');
      initTrendsChart();
    });
  }
  if (closeTrendsBtn && trendsModal) {
    closeTrendsBtn.addEventListener('click', () => trendsModal.classList.add('hidden'));
  }

  const closeModalBtn = document.getElementById('closeModalBtn');
  const iupacModal = document.getElementById('iupacModal');
  
  function closeInteractiveModal() {
    if (!iupacModal) return;
    iupacModal.classList.add('hidden');
    if (bohrAnimFrameId) {
      cancelAnimationFrame(bohrAnimFrameId);
      bohrAnimFrameId = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeInteractiveModal);
  }

  if (iupacModal) {
    iupacModal.addEventListener('click', (e) => {
      if (e.target === iupacModal) {
        closeInteractiveModal();
      }
    });
  }

  // Navegación por teclado (Flechas Izq/Der y Esc)
  window.addEventListener('keydown', (e) => {
    if (!iupacModal || iupacModal.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeInteractiveModal();
    } else if (e.key === 'ArrowLeft' && currentModalElement) {
      const prevNum = currentModalElement.number > 1 ? currentModalElement.number - 1 : 118;
      const prevElem = ELEMENTS_DATA.find((el) => el.number === prevNum) || ELEMENTS_DATA[prevNum - 1];
      if (prevElem) selectElement(prevElem);
    } else if (e.key === 'ArrowRight' && currentModalElement) {
      const nextNum = currentModalElement.number < 118 ? currentModalElement.number + 1 : 1;
      const nextElem = ELEMENTS_DATA.find((el) => el.number === nextNum) || ELEMENTS_DATA[nextNum - 1];
      if (nextElem) selectElement(nextElem);
    }
  });

  // PWA Install
  const pwaBtn = document.getElementById('pwaInstallBtn');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      console.log(`[IUPAC PWA] Instalación: ${outcome}`);
      deferredInstallPrompt = null;
      pwaBtn.classList.add('hidden');
    });
  }

  // Conectividad
  window.addEventListener('online', () => {
    const offlineNotice = document.getElementById('offlineNotice');
    if (offlineNotice) offlineNotice.classList.add('hidden');
  });

  window.addEventListener('offline', () => {
    const offlineNotice = document.getElementById('offlineNotice');
    if (offlineNotice) offlineNotice.classList.remove('hidden');
  });

  if (!navigator.onLine) {
    const offlineNotice = document.getElementById('offlineNotice');
    if (offlineNotice) offlineNotice.classList.remove('hidden');
  }

  setLanguage(currentLang);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
