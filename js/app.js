/* Finanzas personales — lógica de la aplicación */

const $ = (id) => document.getElementById(id);

/* ==========================================
   1. MAPA MAESTRO DE ICONOS SVG
   ========================================== */
const categoryIconsMap = {
    "Ingresos": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M7.5 5h-1.5a1 1 0 0 0 0 2h1a1 1 0 0 1 0 2H5.5"/><path d="M6.5 4v.5M6.5 8.5V9"/><path d="M14 3h3a2 2 0 0 1 2 2v4"/><path d="M16.5 6.5L19 9l2.5-2.5"/><path d="M14 9v3M12.5 10.5h3"/><path d="M2 21v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1H8"/><path d="M14 16l4-3.5a1.5 1.5 0 0 1 2.2 2L16 19.5c-1 .8-2.2 1.5-3.5 1.5H2"/></svg>`,
    "Devolver": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M7.5 5h-1.5a1 1 0 0 0 0 2h1a1 1 0 0 1 0 2H5.5"/><path d="M6.5 4v.5M6.5 8.5V9"/><circle cx="18.5" cy="4.5" r="1.8" fill="currentColor"/><path d="M15.5 11v-.5a3 3 0 0 1 6 0v.5"/><path d="M2 21v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1H8"/><path d="M14 16l4-3.5a1.5 1.5 0 0 1 2.2 2L16 19.5c-1 .8-2.2 1.5-3.5 1.5H2"/></svg>`,
    "Billetera": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="M3 7a2 2 0 0 0 2 2h8"/><path d="M18 3v6"/><path d="M15.5 6.5L18 9l2.5-2.5"/><circle cx="17.5" cy="14.5" r="1" fill="currentColor"/></svg>`,
    "Pantalla": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="3" width="20" height="14" rx="4" /><path d="M12 17v3" /><path d="M8 20h8" /><circle cx="11" cy="12" r="1.5" fill="currentColor" /><path d="M13 12V7h2" /></svg>`,
    "Familia": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="4" r="1.8" fill="currentColor"/><path d="M7.5 8.5H5a2 2 0 0 0-2 2v5a1.5 1.5 0 0 0 1.5 1.5h3"/><path d="M5.5 17v4"/><circle cx="18.5" cy="4" r="1.8" fill="currentColor"/><path d="M16.5 8.5H19a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5h-3"/><path d="M18.5 17v4"/><circle cx="12" cy="8.5" r="1.6" fill="currentColor"/><rect x="9.5" y="12" width="5" height="5" rx="1.5"/><path d="M10.8 17v4M13.2 17v4"/></svg>`,
    "Transporte": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3c4.5-1.3 9.5-1.3 14 0"/><path d="M12 2v4"/><rect x="4" y="6" width="16" height="14" rx="4"/><path d="M4 10h16"/><path d="M4 14h16"/><path d="M12 10v4"/><path d="M8 16v1"/><path d="M16 16v1"/><path d="M8 20l-1.5 2"/><path d="M16 20l1.5 2"/></svg>`,
    "Alimentacion": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18l-1.5 7.5a2 2 0 0 1-2 1.5h-11a2 2 0 0 1-2-1.5L3 11z"/><path d="M8 14v3M12 14v3M16 14v3"/><path d="M6.5 3h4"/><path d="M7.5 3v3L6 8.5V11M9.5 3v3L11 8.5V11"/><path d="M13 11l3.5-6.5a2.2 2.2 0 0 1 3.7 2.2L17.5 11"/></svg>`,
    "Compras": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h1.5a2 2 0 0 1 1.98 1.7L6.7 14.3A2 2 0 0 0 8.68 16H19"/><path d="M5.6 6h14.1a2 2 0 0 1 1.97 2.35l-.72 4A2 2 0 0 1 19 14H6.65"/><circle cx="8" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    "Combustible": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16H3z"/><path d="M3 10h11"/><path d="M14 14h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V8l-3-3"/><path d="M18 4l2 2v3h-2V4z" fill="currentColor" stroke="none"/></svg>`,
    "Grifo": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v6" /><path d="M8 4h8" /><path d="M3 10h11a5 5 0 0 1 5 5v2" /><path d="M3 15h10a1 1 0 0 1 1 1v1" /><path d="M13 17h7" /><path d="M16.5 20.5c-.83 0-1.5-.67-1.5-1.5 0-1 1.5-2.5 1.5-2.5s1.5 1.5 1.5 2.5c0 .83-.67 1.5-1.5 1.5z" fill="currentColor" stroke="none" /></svg>`,
    "Auto": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l2.2-5.5A4 4 0 0 1 8.9 3h3.6a4 4 0 0 1 3.3 1.7L20 11" /><path d="M10 3v8" /><path d="M4 11h15a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3z" /><path d="M4 17v1a2.5 2.5 0 0 0 5 0v-1" /><path d="M15 17v1a2.5 2.5 0 0 0 5 0v-1" /></svg>`,
    "Casa": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5a2 2 0 0 0-.6-1.4l-7-6.8a2 2 0 0 0-2.8 0l-7 6.8a2 2 0 0 0-.6 1.4z"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/></svg>`,
    "Monedas": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8.5" cy="11" rx="6.5" ry="3"/><path d="M2 11v8c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-8"/><path d="M2 15c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3"/><ellipse cx="15.5" cy="5" rx="6.5" ry="3"/><path d="M9 5v3.1"/><path d="M22 5v12c0 1.66-2.91 3-6.5 3-.6 0-1.18-.04-1.73-.11"/><path d="M22 9c0 1.66-2.91 3-6.5 3-.45 0-.89-.02-1.31-.06"/><path d="M22 13c0 1.66-2.91 3-6.5 3-.17 0-.34 0-.5-.01"/></svg>`,
    "Regalo": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13v4a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-4M2 13h20v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2zM12 8v14m0-14c-1.5-2.5-2-4.5-2-5.5a2 2 0 0 1 4 0c0 1-.5 3-2 5.5zm0 0C7.5 8 5 6 5 3m7 5c4.5 0 7-2 7-5"/></svg>`,
    "Torta": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22h20M4 22v-7a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v7M4 16a3 3 0 0 0 3-2 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 3 2M12 10V6"/><path fill="currentColor" stroke="none" d="M12 1c-1.5 1.8-2.5 3.3-2.5 4.5a2.5 2.5 0 0 0 5 0C14.5 4.3 13.5 2.8 12 1z"/></svg>`,
    "Restaurante": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22L20 4M17 2l-5 5a4.24 4.24 0 0 0 0 6 4.24 4.24 0 0 0 6 0l5-5M7 11L2 6c0-2.5.5-4 1-4l5 5m5 9c1.2.5 2.5.6 4 .5l5 5"/></svg>`,
    "Copas": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M7 2.5l1 1.8m9-1.8l-1 1.8M5 6.5l4.8 1.5a2 2 0 0 1 1.3 2.5l-1.5 4.8a4 4 0 0 1-5 2.6 4 4 0 0 1-2.6-5l1.5-4.8A2 2 0 0 1 5 6.5zm-1.4 4.3h7M5.5 18l-1.3 4M2 21.3l4.5 1.4M19 6.5l-4.8 1.5a2 2 0 0 0-1.3 2.5l1.5 4.8a4 4 0 0 0 5 2.6 4 4 0 0 0 2.6-5l-1.5-4.8A2 2 0 0 0 19 6.5zm1.4 4.3h-7M18.5 18l1.3 4M22 21.3l-4.5 1.4"/></svg>`,
    "Musica": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M9 17.5V6a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v11.5"/></svg>`,
    "Niño": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2a3 3 0 0 0 0 6 3 3 0 0 0 2.8-2M4.3 9.2a2.5 2.5 0 0 0 0 4.6 8 8 0 0 0 15.4 0 2.5 2.5 0 0 0 0-4.6 8 8 0 0 0-15.4 0zM6.5 18.5A9 9 0 0 0 4 22m13.5-3.5A9 9 0 0 1 20 22"/><circle cx="9.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11.5" r="1.2" fill="currentColor" stroke="none"/></svg>`,
    "Avión": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12l-1.2-3.2A1.8 1.8 0 0 1 3.9 7.4L6 10h5.5L8.7 3.2A1.8 1.8 0 0 1 11.9 1.6L16.5 10H20a2 2 0 0 1 0 4h-3.5l-4.6 8.4a1.8 1.8 0 0 1-3.2-1.6L11.5 14H6l-2.1 2.6a1.8 1.8 0 0 1-3.1-1.4L2 12z"/></svg>`,
    "Smartphone": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="1" width="14" height="22" rx="4"/><path d="M5 17h14"/><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/></svg>`,
    "Teléfono": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" transform="matrix(-1 0 0 1 24 0)"/></svg>`,
    "Foco": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M9 18a3 3 0 0 0 6 0M9 18c-.2-1.7-1.1-3.3-2.4-4.4a7.5 7.5 0 1 1 10.8 0c-1.3 1.1-2.2 2.7-2.4 4.4M12 18v-6.5m-2-2a2 2 0 0 0 4 0"/></svg>`,
    "Bolsa de compras": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 10V7a4 4 0 0 1 8 0v3"/><rect x="3" y="8" width="18" height="13" rx="3.5"/></svg>`,
    "Bolsa de dinero": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6.5C8 5.2 7.5 4 7.5 3.2A1.2 1.2 0 0 1 8.7 2h6.6a1.2 1.2 0 0 1 1.2 1.2c0 .8-.5 2-2 3.3M9.5 6.5h5M9.5 6.5C5.5 8.5 3.5 13 3.5 17a5 5 0 0 0 5 5h7a5 5 0 0 0 5-5c0-4-2-8.5-6-10.5M14.2 11.2a2.2 2.2 0 0 0-2-.7h-.7a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1a2.2 2.2 0 0 1-2-.8M12 9v1.5m0 8V20"/></svg>`
};

const warningIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`;

/* ==========================================
   2. ESTADO GLOBAL Y CONSTANTES
   ========================================== */
const DEFAULT_CONFIG = {
    currency: 'EUR',
    theme: 'light',
    colorCounter: 0,
    utilities: {
        financeManager: true,
        remittances: true,
        installments: true,
        dayCounter: true
    },
    categories: {
        expense: [
            { name: 'Vivienda', color: '#3b82f6', icon: 'Casa' },
            { name: 'Coche', color: '#d97706', icon: 'Auto' },
            { name: 'Combustible', color: '#ec48e4', icon: 'Combustible' },
            { name: 'Compras', color: '#ef4444', icon: 'Compras' },
            { name: 'Alimentación', color: '#8b5cf6', icon: 'Alimentacion' },
            { name: 'Transporte', color: '#10b981', icon: 'Transporte' },
            { name: 'Manutención', color: '#f59e0b', icon: 'Familia' },
            { name: 'Servicios', color: '#6366f1', icon: 'Grifo' },
            { name: 'Suscripciones', color: '#b87114', icon: 'Pantalla' }
        ],
        income: [
            { name: 'Salario', color: '#22c55e', icon: 'Billetera' },
            { name: 'Ingresos extra', color: '#528800', icon: 'Ingresos' },
            { name: 'Devoluciones', color: '#0ea5e9', icon: 'Devolver' }
        ]
    }
};

const FILTER_STORAGE_KEY = 'finanzas_filtros_v1';

const DEFAULT_MOVEMENT_FILTERS = {
    query: '',
    kind: 'all',     // 'all' | 'expense' | 'income'
    category: 'all', // 'all' o nombre de categoría
    dateMode: 'all', // 'all' | 'day' | 'week' | 'month' | 'year' | 'custom'
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null
};

const SECTION_LABELS = {
    financeManager: 'Gestor financiero',
    remittances: 'Calcular remesas',
    installments: 'Compras en cuotas',
    dayCounter: 'Días trabajados'
};

const SPANISH_MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAY_LABELS_MON = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const today = new Date();
const pad = (number) => String(number).padStart(2, '0');
const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

function loadSavedFilters() {
    try {
        const raw = localStorage.getItem(FILTER_STORAGE_KEY);
        if (!raw) return { ...DEFAULT_MOVEMENT_FILTERS };
        const parsed = JSON.parse(raw);
        return {
            query: typeof parsed.query === 'string' ? parsed.query : '',
            kind: ['all', 'expense', 'income'].includes(parsed.kind) ? parsed.kind : 'all',
            category: typeof parsed.category === 'string' && parsed.category ? parsed.category : 'all',
            dateMode: ['all', 'day', 'week', 'month', 'year', 'custom'].includes(parsed.dateMode) ? parsed.dateMode : 'all',
            startDate: typeof parsed.startDate === 'string' ? parsed.startDate : '',
            endDate: typeof parsed.endDate === 'string' ? parsed.endDate : '',
            minAmount: typeof parsed.minAmount === 'number' && !isNaN(parsed.minAmount) ? parsed.minAmount : null,
            maxAmount: typeof parsed.maxAmount === 'number' && !isNaN(parsed.maxAmount) ? parsed.maxAmount : null
        };
    } catch {
        return { ...DEFAULT_MOVEMENT_FILTERS };
    }
}

let appConfig = JSON.parse(localStorage.getItem('finanzas_config_v1')) || DEFAULT_CONFIG;
let movements = JSON.parse(localStorage.getItem('finanzas_movimientos_v1') || '[]');
let remittancesList = JSON.parse(localStorage.getItem('finanzas_remesas_cards_v3') || '[]').map(r => ({ ...r, expanded: false }));
let installmentsPurchases = JSON.parse(localStorage.getItem('finanzas_cuotas_v1') || '[]').map(p => ({ ...p, expanded: false }));
let dayCounterMonths = JSON.parse(localStorage.getItem('finanzas_day_counter_v1') || '[]').map(m => ({ ...m, expanded: false }));

let editingId = null;
let editingInstallmentId = null;
let editingRemittanceId = null;
let editingCategoryData = null;
let editingMonthId = null;
let editingDayMonthId = null;
let editingDayIndex = null;

let activeFinanceViewMode = 'movements'; // 'movements' | 'categories'
let activeAppSection = 'financeManager'; // 'financeManager' | 'remittances' | 'installments' | 'dayCounter'
let currentCatKind = 'expense';
let selectedDonutCategory = null;
let currentUsageText = 'Sin movimientos registrados';
let pendingParsedSections = null;

let movementFilters = loadSavedFilters();

let filterDraft = {
    query: '',
    kind: 'all',
    category: 'all',
    dateMode: 'all',
    pickerOpen: false,
    startDate: '',
    endDate: '',
    anchorDate: '',
    minAmount: null,
    maxAmount: null,
    calYear: today.getFullYear(),
    calMonth: today.getMonth(),
    pickerYear: today.getFullYear(),
    pickerMonth: today.getMonth()
};

/* ==========================================
   3. UTILIDADES DE FORMATO, FECHAS Y MODALES
   ========================================== */
const CURRENCY_SYMBOLS = { EUR: '€', USD: '$', PEN: 'S/.' };
const getCurrencySymbol = (code) => CURRENCY_SYMBOLS[code] || '€';

const formatCurrencyCustom = (amount, code) => {
    const num = Number(amount) || 0;
    const [intPart, decPart] = num.toFixed(2).split('.');
    if (code === 'PEN') return `S/ ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decPart}`;
    if (code === 'USD') return `$${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decPart}`;
    return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decPart} €`;
};

const formatMoney = (amount) => formatCurrencyCustom(amount, appConfig.currency);

const formatPlainInputValue = (val, currCode) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) return '';
    const useDotDecimal = currCode === 'PEN' || currCode === 'USD';
    const thousandsSep = useDotDecimal ? ',' : '.';
    const decimalSep = useDotDecimal ? '.' : ',';
    const rounded = Math.round(num * 10000) / 10000;
    const [intPart, decPart] = String(rounded).split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return decPart ? `${formattedInt}${decimalSep}${decPart}` : formattedInt;
};

const formatNumberDisplay = (val, currCode) => (isNaN(val) || val <= 0) ? '' : formatCurrencyCustom(val, currCode);

const formatTcInputValue = (val, recvCurrCode) => {
    if (isNaN(val) || val <= 0) return '';
    const [intPart, decPart] = Number(val).toFixed(4).split('.');
    const cleanDecimal = decPart.replace(/0+$/, '');
    const str = cleanDecimal ? `${intPart}.${cleanDecimal}` : intPart;
    return recvCurrCode === 'EUR' ? str.replace('.', ',') : str;
};

function parseInputNumber(rawValue) {
    if (!rawValue) return 0;
    let s = String(rawValue).replace(/S\/\.?|[€$A-Za-z\s]/g, '').trim();

    if (s.includes(',') && s.includes('.')) {
        s = s.lastIndexOf(',') > s.lastIndexOf('.')
            ? s.replace(/\./g, '').replace(',', '.')
            : s.replace(/,/g, '');
    } else if (s.includes(',')) {
        s = /^\d{1,3}(,\d{3})+$/.test(s) ? s.replace(/,/g, '') : s.replace(',', '.');
    }
    return parseFloat(s) || 0;
}

const HTML_ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);

function formatDateEs(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function addMonthsToDate(dateStr, monthsToAdd) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const isEndOfMonth = d >= new Date(y, m, 0).getDate();

    const totalMonths = (m - 1) + monthsToAdd;
    const targetYear = y + Math.floor(totalMonths / 12);
    const targetMonth = totalMonths % 12;

    const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const targetDay = (isEndOfMonth || d > lastDayOfTargetMonth) ? lastDayOfTargetMonth : d;

    return `${targetYear}-${pad(targetMonth + 1)}-${pad(targetDay)}`;
}

function calculateExitTime(entryTimeStr) {
    if (!entryTimeStr) return '06:00';
    const [hours, minutes] = entryTimeStr.split(':').map(Number);
    return `${pad((hours + 12) % 24)}:${pad(minutes)}`;
}

function getDayNameFromDate(dateStr) {
    if (!dateStr) return '';
    const name = new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function clearValidationErrors(formEl) {
    formEl?.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function validateRequiredFields(formEl, fields) {
    let isValid = true;
    fields.forEach(el => {
        if (!el) return;
        const empty = !el.value.trim();
        el.classList.toggle('input-error', empty);
        if (empty) isValid = false;
    });
    if (!isValid) formEl?.querySelector('.input-error')?.focus();
    return isValid;
}

function scrollCardIntoView(cardEl, shouldScroll = true) {
    if (!shouldScroll || !cardEl) return;
    requestAnimationFrame(() => {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

function lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('no-scroll');
}

function openModal(dialogEl) {
    if (!dialogEl) return;
    lockBodyScroll();
    dialogEl.showModal();
}

function closeModal(dialogEl) {
    if (!dialogEl) return;
    dialogEl.close();
    if (!$('navDrawer')?.classList.contains('is-open')) {
        document.body.classList.remove('no-scroll');
    }
}

/* ==========================================
   4. PERSISTENCIA Y CONFIGURACIÓN UI
   ========================================== */
const persist = () => localStorage.setItem('finanzas_movimientos_v1', JSON.stringify(movements));
const persistFilters = () => localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(movementFilters));
const persistRemittancesList = () => localStorage.setItem('finanzas_remesas_cards_v3', JSON.stringify(remittancesList));
const persistInstallments = () => localStorage.setItem('finanzas_cuotas_v1', JSON.stringify(installmentsPurchases));
const persistDayCounter = () => localStorage.setItem('finanzas_day_counter_v1', JSON.stringify(dayCounterMonths));

const persistConfig = () => {
    localStorage.setItem('finanzas_config_v1', JSON.stringify(appConfig));
    updateUserDisplay();
    applyTheme();
    applyUtilitiesVisibility();
    updateCurrencyLabels();
};

const applyTheme = () => {
    const isDark = appConfig.theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', isDark ? '#121212' : '#FFFFFF');
    }
};

function updateCurrencyLabels() {
    const symbol = getCurrencySymbol(appConfig.currency);
    if ($('newAmountLabel')) $('newAmountLabel').textContent = `Importe (${symbol})`;
    if ($('editAmountLabel')) $('editAmountLabel').textContent = `Importe (${symbol})`;
    if ($('filterCurrMin')) $('filterCurrMin').textContent = symbol;
    if ($('filterCurrMax')) $('filterCurrMax').textContent = symbol;
}

/* ==========================================
   5. NAVEGACIÓN, MENÚ LATERAL Y SECCIONES
   ========================================== */
function normalizeActiveSection(section) {
    return Object.prototype.hasOwnProperty.call(SECTION_LABELS, section) ? section : 'financeManager';
}

function getInitialSectionFromConfig() {
    const utils = appConfig.utilities || {};
    if (utils.financeManager !== false) return 'financeManager';
    if (utils.remittances) return 'remittances';
    if (utils.installments) return 'installments';
    if (utils.dayCounter) return 'dayCounter';
    return 'financeManager';
}

function syncSectionUtilitiesFlag(section) {
    appConfig.utilities = {
        financeManager: section === 'financeManager',
        remittances: section === 'remittances',
        installments: section === 'installments',
        dayCounter: section === 'dayCounter'
    };
    localStorage.setItem('finanzas_config_v1', JSON.stringify(appConfig));
}

function openNavDrawer() {
    const drawer = $('navDrawer');
    const backdrop = $('navDrawerBackdrop');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) {
        backdrop.classList.remove('is-hidden');
        backdrop.setAttribute('aria-hidden', 'false');
    }
    syncDrawerControlsState();
    lockBodyScroll();
}

function closeNavDrawer() {
    const drawer = $('navDrawer');
    const backdrop = $('navDrawerBackdrop');
    const moreBtn = $('navMoreBackupBtn');
    toggleBackupPopover(false);
    if (drawer) {
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) {
        backdrop.classList.add('is-hidden');
        backdrop.setAttribute('aria-hidden', 'true');
    }
    if (moreBtn) {
        moreBtn.classList.remove('is-active');
        moreBtn.setAttribute('aria-expanded', 'false');
    }
    if (!document.querySelector('dialog[open]')) {
        document.body.classList.remove('no-scroll');
    }
}

function toggleBackupPopover(forceState) {
    const popover = $('navBackupPopover');
    const backdrop = $('navBackupBackdrop');
    const moreBtn = $('navMoreBackupBtn');
    if (!popover) return;
    const shouldOpen = typeof forceState === 'boolean'
        ? forceState
        : popover.classList.contains('is-hidden');
    popover.classList.toggle('is-hidden', !shouldOpen);
    popover.setAttribute('aria-hidden', String(!shouldOpen));
    if (backdrop) {
        backdrop.classList.toggle('is-hidden', !shouldOpen);
        backdrop.setAttribute('aria-hidden', String(!shouldOpen));
    }
    if (moreBtn) {
        moreBtn.classList.toggle('is-active', shouldOpen);
        moreBtn.setAttribute('aria-expanded', String(shouldOpen));
    }
}

function syncDrawerControlsState() {
    document.querySelectorAll('[data-nav-section]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.navSection === activeAppSection);
    });
    if ($('currencySelect')) {
        $('currencySelect').value = appConfig.currency || 'EUR';
    }
    const isDark = appConfig.theme === 'dark';
    $('themeLightBtn')?.classList.toggle('active', !isDark);
    $('themeDarkBtn')?.classList.toggle('active', isDark);
}

function syncHeaderSectionActionButton() {
    const btn = $('headerSectionNewBtn');
    if (!btn) return;

    const showForSection = ['remittances', 'installments', 'dayCounter'].includes(activeAppSection);
    btn.classList.toggle('is-hidden', !showForSection);

    const ariaMap = {
        remittances: 'Nueva remesa',
        installments: 'Nueva compra en cuotas',
        dayCounter: 'Nuevo mes de trabajo'
    };
    btn.setAttribute('aria-label', ariaMap[activeAppSection] || 'Nuevo');
}

function updateUserDisplay() {
    const headerTitle = $('sectionHeaderTitle');
    if (headerTitle) {
        headerTitle.textContent = SECTION_LABELS[normalizeActiveSection(activeAppSection)] || 'Gestor financiero';
    }
    syncDrawerControlsState();
    syncHeaderSectionActionButton();
}

function applyUtilitiesVisibility() {
    const section = normalizeActiveSection(activeAppSection);
    activeAppSection = section;

    const showFinance = section === 'financeManager';
    const showRemit = section === 'remittances';
    const showInst = section === 'installments';
    const showDays = section === 'dayCounter';

    if ($('financeManagerLayout')) $('financeManagerLayout').style.display = showFinance ? '' : 'none';
    if ($('remittancesCard')) $('remittancesCard').style.display = showRemit ? '' : 'none';
    if ($('installmentsCard')) $('installmentsCard').style.display = showInst ? '' : 'none';
    if ($('dayCounterCard')) $('dayCounterCard').style.display = showDays ? '' : 'none';

    const utilSection = $('utilitiesSection');
    if (utilSection) {
        utilSection.style.display = (showRemit || showInst || showDays) ? '' : 'none';
        utilSection.classList.toggle('single-utility-view', showRemit || showInst || showDays);
    }

    updateUserDisplay();
}

function selectAppSection(section, options = {}) {
    const normalized = normalizeActiveSection(section);
    activeAppSection = normalized;
    syncSectionUtilitiesFlag(normalized);
    applyUtilitiesVisibility();
    syncDrawerControlsState();

    if (options.expandActiveUtility) {
        if (normalized === 'remittances') {
            remittancesList = remittancesList.map(r => ({ ...r, expanded: false }));
            renderRemittancesList();
        } else if (normalized === 'installments') {
            installmentsPurchases = installmentsPurchases.map(p => ({ ...p, expanded: false }));
            renderInstallments();
        } else if (normalized === 'dayCounter') {
            dayCounterMonths = dayCounterMonths.map(m => ({ ...m, expanded: false }));
            renderDayCounter();
        }
    }

    if (options.closeDrawer) {
        closeNavDrawer();
    }
}

/* ==========================================
   6. EXPORTAR E IMPORTAR CSV MULTI-SECCIÓN
   ========================================== */
const csvQuote = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
const unquoteCsv = (val) => String(val || '').replace(/^"|"$/g, '').replace(/""/g, '"');

function parseCsvLine(line) {
    const row = [];
    let inQuotes = false;
    let currentVal = '';
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                currentVal += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(currentVal.trim());
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    row.push(currentVal.trim());
    return row;
}

function normalizeDateToIso(dateStr) {
    if (!dateStr) return '';
    const clean = dateStr.replace(/^"|"$/g, '').trim();
    if (clean.includes('/')) {
        const parts = clean.split('/');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
            return `${year}-${month}-${day}`;
        }
    }
    return clean;
}

function executeCustomExport() {
    const includeMovs = $('expMovements')?.checked;
    const includeRemit = $('expRemittances')?.checked;
    const includeInst = $('expInstallments')?.checked;
    const includeDays = $('expDayCounter')?.checked;

    if (!includeMovs && !includeRemit && !includeInst && !includeDays) {
        alert('Debes seleccionar al menos una sección para exportar.');
        return;
    }

    const csvRows = [];

    if (includeMovs) {
        csvRows.push('--- SECCION: MOVIMIENTOS ---');
        csvRows.push('FECHA,MOVIMIENTO,TIPO,CATEGORIA,IMPORTE,NOTAS');
        movements.forEach(m => {
            const formattedDate = m.date?.includes('-') ? formatDateEs(m.date) : m.date;
            const tipoStr = m.kind === 'income' ? 'Ingreso' : 'Gasto';
            csvRows.push([formattedDate, csvQuote(m.desc), tipoStr, csvQuote(m.category), m.amount, csvQuote(m.notes)].join(','));
        });
        csvRows.push('');
    }

    if (includeRemit) {
        csvRows.push('--- SECCION: REMESAS ---');
        csvRows.push('NOMBRE_REMESA,MONEDA_ENVIO,MONEDA_RECEPCION,TIPO_CAMBIO,COMISION,CONCEPTO_ITEM,IMPORTE_RECEPCION_ITEM');
        remittancesList.forEach(r => {
            if (!r.items?.length) {
                csvRows.push(`${csvQuote(r.name)},${csvQuote(r.sendCurr)},${csvQuote(r.recvCurr)},${r.tc},${r.commission},"" ,0`);
            } else {
                r.items.forEach(item => {
                    csvRows.push(`${csvQuote(r.name)},${csvQuote(r.sendCurr)},${csvQuote(r.recvCurr)},${r.tc},${r.commission},${csvQuote(item.concept)},${item.recvAmount}`);
                });
            }
        });
        csvRows.push('');
    }

    if (includeInst) {
        csvRows.push('--- SECCION: COMPRAS EN CUOTAS ---');
        csvRows.push('COMPRA,MONEDA,FINANCED_AMOUNT,INTEREST_AMOUNT,TOTAL_CUOTAS,NUMERO_CUOTA,FECHA_CUOTA,IMPORTE_CUOTA,FINAL_AMOUNT,PAGADO');
        installmentsPurchases.forEach(p => {
            p.installments.forEach(inst => {
                const formattedDate = inst.date?.includes('-') ? formatDateEs(inst.date) : inst.date;
                csvRows.push(`${csvQuote(p.name)},${csvQuote(p.currency || 'EUR')},${p.financedAmount || 0},${p.interestAmount || 0},${p.totalCount},${inst.number},${formattedDate},${inst.amount},${p.finalAmount || inst.amount},${inst.paid ? 'SI' : 'NO'}`);
            });
        });
        csvRows.push('');
    }

    if (includeDays) {
        csvRows.push('--- SECCION: CONTADOR DE DIAS TRABAJADOS ---');
        csvRows.push('MES,DIAS_OBJETIVO,FECHA_DIA,DIA_SEMANA,ENTRADA,SALIDA,LUGAR');
        dayCounterMonths.forEach(m => {
            if (!m.days?.length) {
                csvRows.push(`${csvQuote(m.name)},${m.targetDays},"" ,"" ,"" ,"" ,""`);
            } else {
                m.days.forEach(d => {
                    const formattedDate = d.date?.includes('-') ? formatDateEs(d.date) : d.date;
                    csvRows.push(`${csvQuote(m.name)},${m.targetDays},${formattedDate},${csvQuote(d.dayName)},${csvQuote(d.entryTime)},${csvQuote(d.exitTime)},${csvQuote(d.location)}`);
                });
            }
        });
    }

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));

    const link = document.createElement('a');
    link.href = url;
    link.download = `copia_seguridad_finanzas_${today.toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    closeModal($('exportDlg'));
}

function importMovementsCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const lines = e.target.result.split(/\r?\n/);
            if (lines.length < 2) {
                alert('El archivo CSV está vacío o no tiene el formato correcto.');
                return;
            }

            let currentSection = 'MOVIMIENTOS';
            const rawRemitMap = {};
            const rawInstMap = {};
            const rawDaysMap = {};
            const tempMovements = [];
            const detectedSections = new Set();

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                if (line.startsWith('--- SECCION:')) {
                    if (line.includes('MOVIMIENTOS')) { currentSection = 'MOVIMIENTOS'; detectedSections.add('MOVIMIENTOS'); }
                    else if (line.includes('REMESAS')) { currentSection = 'REMESAS'; detectedSections.add('REMESAS'); }
                    else if (line.includes('COMPRAS EN CUOTAS')) { currentSection = 'CUOTAS'; detectedSections.add('CUOTAS'); }
                    else if (line.includes('CONTADOR DE DIAS')) { currentSection = 'DIAS'; detectedSections.add('DIAS'); }
                    continue;
                }

                if (/^(FECHA|NOMBRE_REMESA|COMPRA|MES),/.test(line)) continue;

                const row = parseCsvLine(line);

                if (currentSection === 'MOVIMIENTOS' && row.length >= 5) {
                    const [rawDate, desc, tipo, category, amountStr, notes = ''] = row;
                    const date = normalizeDateToIso(rawDate);
                    const cleanDesc = unquoteCsv(desc);
                    const cleanCat = unquoteCsv(category);
                    const cleanNotes = unquoteCsv(notes);
                    const amount = parseFloat(amountStr.replace(',', '.')) || 0;
                    const kindNormalized = (tipo.toLowerCase().includes('ingreso') || tipo.toLowerCase() === 'income') ? 'income' : 'expense';

                    if (date && cleanDesc && amount > 0) {
                        tempMovements.push({
                            id: crypto.randomUUID(),
                            timestamp: Date.now() + i,
                            desc: cleanDesc,
                            kind: kindNormalized,
                            amount: Math.round(amount * 100) / 100,
                            date,
                            category: cleanCat || (kindNormalized === 'income' ? 'Salario' : 'Compras'),
                            notes: cleanNotes
                        });
                    }
                } else if (currentSection === 'REMESAS' && row.length >= 7) {
                    const [rawRemName, sendCurr, recvCurr, tcStr, commStr, concept, recvAmtStr] = row;
                    const remName = unquoteCsv(rawRemName);
                    if (!remName) continue;

                    if (!rawRemitMap[remName]) {
                        rawRemitMap[remName] = {
                            id: crypto.randomUUID(),
                            name: remName,
                            sendCurr: unquoteCsv(sendCurr) || 'EUR',
                            recvCurr: unquoteCsv(recvCurr) || 'PEN',
                            tc: parseFloat(tcStr.replace(',', '.')) || 3.75,
                            commission: parseFloat(commStr.replace(',', '.')) || 0,
                            expanded: false,
                            items: []
                        };
                    }
                    const cleanConcept = unquoteCsv(concept);
                    const recvAmt = parseFloat(recvAmtStr.replace(',', '.')) || 0;
                    if (cleanConcept) {
                        rawRemitMap[remName].items.push({ concept: cleanConcept, recvAmount: recvAmt });
                    }
                } else if (currentSection === 'CUOTAS' && row.length >= 7) {
                    let rawPName, curr, financedAmt, interestAmt, totalCountStr, instNumStr, instDate, instAmtStr, finalAmt, paidStr;

                    if (row.length >= 10) {
                        [rawPName, curr, financedAmt, interestAmt, totalCountStr, instNumStr, instDate, instAmtStr, finalAmt, paidStr] = row;
                    } else {
                        [rawPName, curr, totalCountStr, instNumStr, instDate, instAmtStr, paidStr] = row;
                        financedAmt = interestAmt = finalAmt = 0;
                    }

                    const pName = unquoteCsv(rawPName);
                    if (!pName) continue;

                    if (!rawInstMap[pName]) {
                        rawInstMap[pName] = {
                            id: crypto.randomUUID(),
                            name: pName,
                            currency: unquoteCsv(curr) || 'EUR',
                            rawFinanced: parseFloat(financedAmt) || 0,
                            rawInterest: parseFloat(interestAmt) || 0,
                            rawFinal: parseFloat(finalAmt) || 0,
                            totalCount: parseInt(totalCountStr) || 1,
                            expanded: false,
                            installments: []
                        };
                    }

                    rawInstMap[pName].installments.push({
                        number: parseInt(instNumStr) || 1,
                        amount: Math.round((parseFloat(instAmtStr.replace(',', '.')) || 0) * 100) / 100,
                        date: normalizeDateToIso(instDate),
                        paid: paidStr.toUpperCase().includes('SI')
                    });
                } else if (currentSection === 'DIAS' && row.length >= 7) {
                    const [rawMName, targetStr, dDate, dName, entryT, exitT, loc] = row;
                    const mName = unquoteCsv(rawMName);
                    if (!mName) continue;

                    if (!rawDaysMap[mName]) {
                        rawDaysMap[mName] = {
                            id: crypto.randomUUID(),
                            name: mName,
                            targetDays: parseInt(targetStr) || 15,
                            expanded: false,
                            days: []
                        };
                    }
                    const formattedDate = normalizeDateToIso(dDate);
                    if (formattedDate) {
                        rawDaysMap[mName].days.push({
                            date: formattedDate,
                            dayName: unquoteCsv(dName),
                            entryTime: unquoteCsv(entryT),
                            exitTime: unquoteCsv(exitT),
                            location: unquoteCsv(loc)
                        });
                    }
                }
            }

            const parsedRemit = Object.values(rawRemitMap);
            const parsedInst = Object.values(rawInstMap).map(p => {
                const roundedSum = Math.round(p.installments.reduce((acc, curr) => acc + curr.amount, 0) * 100) / 100;
                const financed = p.rawFinanced > 0 ? p.rawFinanced : roundedSum;
                const interest = p.rawInterest >= 0 ? p.rawInterest : 0;

                return {
                    ...p,
                    financedAmount: financed,
                    interestAmount: interest,
                    totalAmount: Math.round((financed + interest) * 100) / 100,
                    regularAmount: p.installments.length > 1 ? p.installments[0].amount : roundedSum,
                    finalAmount: p.rawFinal > 0 ? p.rawFinal : (p.installments.at(-1)?.amount || 0),
                    firstDate: p.installments[0]?.date || ''
                };
            });
            const parsedDays = Object.values(rawDaysMap).map(m => {
                m.days.sort((a, b) => b.date.localeCompare(a.date));
                return m;
            });

            pendingParsedSections = {
                movements: tempMovements,
                remittances: parsedRemit,
                installments: parsedInst,
                dayCounter: parsedDays
            };

            if (detectedSections.size > 1) {
                if ($('impMovCount')) $('impMovCount').textContent = tempMovements.length;
                if ($('impRemitCount')) $('impRemitCount').textContent = parsedRemit.length;
                if ($('impInstCount')) $('impInstCount').textContent = parsedInst.length;
                if ($('impDaysCount')) $('impDaysCount').textContent = parsedDays.length;
                if ($('importSelectDlg')) openModal($('importSelectDlg'));
            } else {
                applyImportSelection({ movements: true, remittances: true, installments: true, dayCounter: true });
            }

            event.target.value = '';
        } catch (err) {
            console.error(err);
            alert('Hubo un error al procesar el archivo de copia de seguridad.');
        }
    };
    reader.readAsText(file);
}

function applyImportSelection(selection) {
    if (!pendingParsedSections) return;

    const importedSummary = [];

    if (selection.movements && pendingParsedSections.movements.length > 0) {
        movements = pendingParsedSections.movements;
        persist();
        importedSummary.push(`• Movimientos: ${movements.length}`);
    }
    if (selection.remittances && pendingParsedSections.remittances.length > 0) {
        remittancesList = pendingParsedSections.remittances;
        persistRemittancesList();
        importedSummary.push(`• Cálculos de remesas: ${remittancesList.length}`);
    }
    if (selection.installments && pendingParsedSections.installments.length > 0) {
        installmentsPurchases = pendingParsedSections.installments;
        persistInstallments();
        importedSummary.push(`• Gestores de cuotas: ${installmentsPurchases.length}`);
    }
    if (selection.dayCounter && pendingParsedSections.dayCounter.length > 0) {
        dayCounterMonths = pendingParsedSections.dayCounter;
        persistDayCounter();
        importedSummary.push(`• Contadores de días: ${dayCounterMonths.length}`);
    }

    render();
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();

    alert(importedSummary.length
    ? `¡Restauración exitosa!\n${importedSummary.join('\n')}`
    : 'No se encontraron registros válidos para importar en el archivo seleccionado.'
    );

    pendingParsedSections = null;
    if ($('importSelectDlg')) closeModal($('importSelectDlg'));
}

/* ==========================================
   7. GESTOR FINANCIERO: FILTROS, MOVIMIENTOS Y CATEGORÍAS
   ========================================== */
function isDesktopFinanceLayout() {
    return window.matchMedia && window.matchMedia('(min-width: 761px)').matches;
}

function setFinanceViewMode(mode) {
    activeFinanceViewMode = mode === 'categories' ? 'categories' : 'movements';
    selectedDonutCategory = null;

    const btnMov = $('switchModeMovements');
    const btnCat = $('switchModeCategories');
    const titleEl = $('activeViewTitle');
    const isCategories = activeFinanceViewMode === 'categories';

    btnMov?.classList.toggle('active', !isCategories);
    btnMov?.setAttribute('aria-selected', String(!isCategories));

    btnCat?.classList.toggle('active', isCategories);
    btnCat?.setAttribute('aria-selected', String(isCategories));

    if (titleEl) {
        titleEl.textContent = 'Movimientos';
    }

    updateActiveFilterCaption();

    $('movementsCard')?.classList.toggle('is-hidden', isCategories);
    $('categoriesCard')?.classList.toggle('is-hidden', !isCategories);

    render();
}

const getSortedCategories = (kind) =>
    [...(appConfig.categories[kind] || [])].sort((a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

function updateCategoryOptions(prefix) {
    const kind = $(`${prefix}Kind`).value;
    $(`${prefix}Category`).innerHTML = getSortedCategories(kind)
        .map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`)
        .join('');
}

function refreshCategoryUI() {
    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    if (movementFilters.kind !== 'all' && movementFilters.category !== 'all') {
        const stillExists = getSortedCategories(movementFilters.kind).some(c => c.name === movementFilters.category);
        if (!stillExists) {
            movementFilters.category = 'all';
            persistFilters();
        }
    }
    updateFilterButtonIndicator();
    updateActiveFilterCaption();
    render();
}

/* --- Helpers de fechas para filtros --- */
function toIsoDateLocal(dateObj) {
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
}

function parseIsoParts(isoStr) {
    const [y, m, d] = String(isoStr || '').split('-').map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d };
}

function toIsoFromParts(y, mZeroBased, d) {
    return `${y}-${pad(mZeroBased + 1)}-${pad(d)}`;
}

function getMonthRangeIso(year, monthZeroBased) {
    const startDate = toIsoFromParts(year, monthZeroBased, 1);
    const lastDay = new Date(year, monthZeroBased + 1, 0).getDate();
    const endDate = toIsoFromParts(year, monthZeroBased, lastDay);
    return { startDate, endDate };
}

function getYearRangeIso(year) {
    return { startDate: `${year}-01-01`, endDate: `${year}-12-31` };
}

function getMondayToSundayWeekRange(isoDateStr) {
    const parts = parseIsoParts(isoDateStr) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };
    const jsDay = new Date(parts.y, parts.m - 1, parts.d).getDay();
    const diffFromMonday = (jsDay + 6) % 7;

    const monday = new Date(parts.y, parts.m - 1, parts.d - diffFromMonday);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

    return {
        startDate: toIsoDateLocal(monday),
        endDate: toIsoDateLocal(sunday)
    };
}

function getAvailableFilterYears() {
    const years = new Set();
    for (let y = 1990; y <= 2050; y++) years.add(y);
    movements.forEach(m => {
        const y = Number(String(m.date || '').slice(0, 4));
        if (y) years.add(y);
    });
    const pickerY = Number(filterDraft.pickerYear);
    if (pickerY) years.add(pickerY);
    return Array.from(years).sort((a, b) => a - b);
}

function computeRangeForMode(mode, seedDateStr, yearVal, monthZeroBased) {
    if (mode === 'all') {
        return { startDate: '', endDate: '', anchorDate: seedDateStr || toIsoDateLocal(today) };
    }

    const safeSeed = seedDateStr || toIsoDateLocal(today);
    const seedParts = parseIsoParts(safeSeed) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };

    if (mode === 'day') return { startDate: safeSeed, endDate: safeSeed, anchorDate: safeSeed };
    if (mode === 'week') {
        const wk = getMondayToSundayWeekRange(safeSeed);
        return { startDate: wk.startDate, endDate: wk.endDate, anchorDate: safeSeed };
    }
    if (mode === 'year') {
        const yr = getYearRangeIso(yearVal);
        return { startDate: yr.startDate, endDate: yr.endDate, anchorDate: safeSeed };
    }
    if (mode === 'custom') {
        const fallbackMonth = getMonthRangeIso(yearVal, monthZeroBased);
        return {
            startDate: filterDraft.startDate || fallbackMonth.startDate,
            endDate: filterDraft.endDate || fallbackMonth.endDate,
            anchorDate: safeSeed
        };
    }

    const mr = getMonthRangeIso(yearVal, monthZeroBased);
    const clampedDay = Math.min(seedParts.d, new Date(yearVal, monthZeroBased + 1, 0).getDate());
    return {
        startDate: mr.startDate,
        endDate: mr.endDate,
        anchorDate: toIsoFromParts(yearVal, monthZeroBased, clampedDay)
    };
}

function scrollActiveWheelOptionsIntoView() {
    requestAnimationFrame(() => {
        const panel = $('filterDatePickerPanel');
        panel?.querySelectorAll('.filter-wheel-col').forEach(col => {
            const activeOpt = col.querySelector('.filter-wheel-option.active');
            if (activeOpt) activeOpt.scrollIntoView({ block: 'center', behavior: 'instant' });
        });
    });
}

function renderFilterDatePanel() {
    const panel = $('filterDatePickerPanel');
    if (!panel) return;

    document.querySelectorAll('#filterDlg .filter-date-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.dateMode === filterDraft.dateMode);
    });

    if (!filterDraft.pickerOpen || filterDraft.dateMode === 'all') {
        panel.classList.add('is-hidden');
        panel.innerHTML = '';
        return;
    }

    panel.classList.remove('is-hidden');

    if (filterDraft.dateMode === 'day' || filterDraft.dateMode === 'week') {
        const { calYear, calMonth, anchorDate, startDate, endDate } = filterDraft;
        const firstOfMonth = new Date(calYear, calMonth, 1);
        const startOffset = (firstOfMonth.getDay() + 6) % 7;
        const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        const prevMonthDays = new Date(calYear, calMonth, 0).getDate();
        const todayIso = toIsoDateLocal(today);

        const cells = [];
        for (let i = startOffset - 1; i >= 0; i--) {
            const dNum = prevMonthDays - i;
            const prevM = calMonth === 0 ? 11 : calMonth - 1;
            const prevY = calMonth === 0 ? calYear - 1 : calYear;
            cells.push({ iso: toIsoFromParts(prevY, prevM, dNum), label: dNum, outside: true });
        }
        for (let dNum = 1; dNum <= daysInMonth; dNum++) {
            cells.push({ iso: toIsoFromParts(calYear, calMonth, dNum), label: dNum, outside: false });
        }
        const remainder = cells.length % 7;
        if (remainder !== 0) {
            const nextCount = 7 - remainder;
            const nextM = calMonth === 11 ? 0 : calMonth + 1;
            const nextY = calMonth === 11 ? calYear + 1 : calYear;
            for (let dNum = 1; dNum <= nextCount; dNum++) {
                cells.push({ iso: toIsoFromParts(nextY, nextM, dNum), label: dNum, outside: true });
            }
        }

        const daysHtml = cells.map((c, idx) => {
            const isSelected = filterDraft.dateMode === 'day' && c.iso === anchorDate;
            const isInWeek = filterDraft.dateMode === 'week' && startDate && endDate && c.iso >= startDate && c.iso <= endDate;
            const isWeekStart = isInWeek && (idx % 7 === 0 || c.iso === startDate);
            const isWeekEnd = isInWeek && (idx % 7 === 6 || c.iso === endDate);
            const isToday = c.iso === todayIso;

            const classes = [
                'filter-cal-day',
                c.outside ? 'is-outside' : '',
                isToday ? 'is-today' : '',
                isInWeek ? 'is-in-week' : '',
                isWeekStart ? 'is-week-start' : '',
                isWeekEnd ? 'is-week-end' : '',
                isSelected ? 'is-selected' : ''
            ].filter(Boolean).join(' ');

            return `<button type="button" class="${classes}" data-cal-iso="${c.iso}">${c.label}</button>`;
        }).join('');

        panel.innerHTML = `
            <div class="filter-cal-header">
                <span class="filter-cal-title">${SPANISH_MONTH_NAMES[calMonth]} ${calYear}</span>
                <div class="filter-cal-nav">
                    <button type="button" class="filter-cal-nav-btn" data-cal-nav="prev" aria-label="Mes anterior">‹</button>
                    <button type="button" class="filter-cal-nav-btn" data-cal-nav="next" aria-label="Mes siguiente">›</button>
                </div>
            </div>
            <div class="filter-cal-weekdays">
                ${WEEKDAY_LABELS_MON.map(w => `<span class="filter-cal-weekday">${w}</span>`).join('')}
            </div>
            <div class="filter-cal-grid">${daysHtml}</div>
        `;
    } else if (filterDraft.dateMode === 'month') {
        const years = getAvailableFilterYears();
        const monthsHtml = SPANISH_MONTH_NAMES.map((name, idx) => `
            <button type="button" class="filter-wheel-option ${idx === filterDraft.pickerMonth ? 'active' : ''}" data-pick-month="${idx}">${name}</button>
        `).join('');

        const yearsHtml = years.map(y => `
            <button type="button" class="filter-wheel-option ${y === filterDraft.pickerYear ? 'active' : ''}" data-pick-year="${y}">${y}</button>
        `).join('');

        panel.innerHTML = `
            <div class="filter-picker-cols">
                <div class="filter-wheel-col" id="filterMonthCol">${monthsHtml}</div>
                <div class="filter-wheel-col" id="filterYearCol">${yearsHtml}</div>
            </div>
        `;
        scrollActiveWheelOptionsIntoView();
    } else if (filterDraft.dateMode === 'year') {
        const years = getAvailableFilterYears();
        const yearsHtml = years.map(y => `
            <button type="button" class="filter-wheel-option ${y === filterDraft.pickerYear ? 'active' : ''}" data-pick-year="${y}">${y}</button>
        `).join('');

        panel.innerHTML = `
            <div class="filter-picker-cols single-col">
                <div class="filter-wheel-col" id="filterYearCol">${yearsHtml}</div>
            </div>
        `;
        scrollActiveWheelOptionsIntoView();
    } else if (filterDraft.dateMode === 'custom') {
        panel.innerHTML = `
            <div class="filter-two-cols">
                <div class="field">
                    <label for="filterStartDate">Desde</label>
                    <input type="date" id="filterStartDate" value="${escapeHtml(filterDraft.startDate || '')}">
                </div>
                <div class="field">
                    <label for="filterEndDate">Hasta</label>
                    <input type="date" id="filterEndDate" value="${escapeHtml(filterDraft.endDate || '')}">
                </div>
            </div>
        `;
    }
}

function handleFilterDateTabClick(newMode) {
    filterDraft.dateMode = newMode;

    if (newMode === 'all') {
        filterDraft.pickerOpen = false;
        filterDraft.startDate = '';
        filterDraft.endDate = '';
        renderFilterDatePanel();
        return;
    }

    filterDraft.pickerOpen = true;

    const refParts = parseIsoParts(
        (newMode === 'day' || newMode === 'week')
            ? (filterDraft.anchorDate || filterDraft.startDate)
            : (filterDraft.startDate || filterDraft.anchorDate)
    ) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };

    filterDraft.calYear = refParts.y;
    filterDraft.calMonth = refParts.m - 1;
    filterDraft.pickerYear = refParts.y;
    filterDraft.pickerMonth = refParts.m - 1;

    const seedIso = (newMode === 'day' || newMode === 'week')
        ? toIsoFromParts(refParts.y, refParts.m - 1, refParts.d)
        : (filterDraft.anchorDate || toIsoDateLocal(today));

    const computed = computeRangeForMode(newMode, seedIso, filterDraft.pickerYear, filterDraft.pickerMonth);
    filterDraft.startDate = computed.startDate;
    filterDraft.endDate = computed.endDate;
    filterDraft.anchorDate = computed.anchorDate;

    renderFilterDatePanel();
}

function populateFilterCategorySelect(kind, selectedCat = 'all') {
    const box = $('filterCategoryBox');
    const label = $('filterCategoryLabel');
    const select = $('filterCategorySelect');
    if (!box || !label || !select) return;

    if (kind === 'all') {
        box.classList.add('is-hidden');
        select.innerHTML = '<option value="all">Todas las categorías</option>';
        select.value = 'all';
        return;
    }

    const cats = getSortedCategories(kind);
    label.textContent = kind === 'income' ? 'Categoría de ingresos' : 'Categoría de gastos';
    select.innerHTML = [
        `<option value="all">${kind === 'income' ? 'Todos los ingresos' : 'Todos los gastos'}</option>`,
        ...cats.map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`)
    ].join('');

    const exists = Array.from(select.options).some(o => o.value === selectedCat);
    select.value = exists ? selectedCat : 'all';
    box.classList.remove('is-hidden');
}

function syncFilterUIState(kind) {
    document.querySelectorAll('#filterDlg .filter-seg-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filterKind === kind);
    });
}

function hasActiveFilters(filters = movementFilters) {
    return Boolean(
        (filters.query && filters.query.trim()) ||
        (filters.kind && filters.kind !== 'all') ||
        (filters.category && filters.category !== 'all') ||
        (filters.dateMode && filters.dateMode !== 'all') ||
        filters.minAmount !== null ||
        filters.maxAmount !== null
    );
}

function formatActiveFilterLabel(filters = movementFilters) {
    const parts = [];

    const q = (filters.query || '').trim();
    if (q) parts.push(`Buscando: ${q}`);

    const mode = filters.dateMode || 'all';
    if (mode === 'day' && filters.startDate) {
        parts.push(`Día ${formatDateEs(filters.startDate)}`);
    } else if (mode === 'week' && filters.startDate && filters.endDate) {
        parts.push(`Semana: ${formatDateEs(filters.startDate)} al ${formatDateEs(filters.endDate)}`);
    } else if (mode === 'month' && filters.startDate) {
        const p = parseIsoParts(filters.startDate);
        if (p) parts.push(`Mes: ${SPANISH_MONTH_NAMES[p.m - 1] || ''} ${p.y}`);
    } else if (mode === 'year' && filters.startDate) {
        const yearStr = String(filters.startDate).slice(0, 4);
        if (yearStr) parts.push(`Año: ${yearStr}`);
    } else if (mode === 'custom' && (filters.startDate || filters.endDate)) {
        const fromStr = filters.startDate ? formatDateEs(filters.startDate) : '...';
        const toStr = filters.endDate ? formatDateEs(filters.endDate) : '...';
        parts.push(`Rango ${fromStr} al ${toStr}`);
    }

    if (filters.kind === 'expense') {
        parts.push(filters.category && filters.category !== 'all' ? `Gastos: ${filters.category}` : 'Gastos');
    } else if (filters.kind === 'income') {
        parts.push(filters.category && filters.category !== 'all' ? `Ingresos: ${filters.category}` : 'Ingresos');
    }

    if (filters.minAmount !== null && filters.maxAmount !== null) {
        parts.push(`Importe: ${formatMoney(filters.minAmount)} a ${formatMoney(filters.maxAmount)}`);
    } else if (filters.minAmount !== null) {
        parts.push(`Importe desde ${formatMoney(filters.minAmount)}`);
    } else if (filters.maxAmount !== null) {
        parts.push(`Importe hasta ${formatMoney(filters.maxAmount)}`);
    }

    return parts.length ? parts.join(' · ') : 'Sin filtros';
}

function updateActiveFilterCaption() {
    const labelText = formatActiveFilterLabel(movementFilters);
    const captionEl = $('activeFilterCaption');
    const catCaptionEl = $('activeCategoryFilterCaption');
    if (captionEl) captionEl.textContent = labelText;
    if (catCaptionEl) catCaptionEl.textContent = labelText;
}

function updateFilterButtonIndicator() {
    $('openFilterBtn')?.classList.toggle('has-active-filters', hasActiveFilters(movementFilters));
}

function openFilterDialog() {
    updateCurrencyLabels();

    const activeStart = movementFilters.startDate || toIsoDateLocal(today);
    const activeEnd = movementFilters.endDate || '';
    const refParts = parseIsoParts(activeStart) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };

    filterDraft = {
        query: movementFilters.query || '',
        kind: movementFilters.kind || 'all',
        category: movementFilters.category || 'all',
        dateMode: movementFilters.dateMode || 'all',
        pickerOpen: false,
        startDate: movementFilters.startDate || '',
        endDate: activeEnd,
        anchorDate: activeStart,
        minAmount: movementFilters.minAmount,
        maxAmount: movementFilters.maxAmount,
        calYear: refParts.y,
        calMonth: refParts.m - 1,
        pickerYear: refParts.y,
        pickerMonth: refParts.m - 1
    };

    if ($('filterSearchInput')) $('filterSearchInput').value = filterDraft.query;
    syncFilterUIState(filterDraft.kind);
    populateFilterCategorySelect(filterDraft.kind, filterDraft.category);
    renderFilterDatePanel();

    if ($('filterMinAmount')) {
        $('filterMinAmount').value = filterDraft.minAmount !== null
            ? String(filterDraft.minAmount).replace('.', ',')
            : '';
    }
    if ($('filterMaxAmount')) {
        $('filterMaxAmount').value = filterDraft.maxAmount !== null
            ? String(filterDraft.maxAmount).replace('.', ',')
            : '';
    }

    openModal($('filterDlg'));
}

function clearFilterDialogDraft() {
    filterDraft = {
        query: '',
        kind: 'all',
        category: 'all',
        dateMode: 'all',
        pickerOpen: false,
        startDate: '',
        endDate: '',
        anchorDate: toIsoDateLocal(today),
        minAmount: null,
        maxAmount: null,
        calYear: today.getFullYear(),
        calMonth: today.getMonth(),
        pickerYear: today.getFullYear(),
        pickerMonth: today.getMonth()
    };

    if ($('filterSearchInput')) $('filterSearchInput').value = '';
    if ($('filterMinAmount')) $('filterMinAmount').value = '';
    if ($('filterMaxAmount')) $('filterMaxAmount').value = '';

    syncFilterUIState('all');
    populateFilterCategorySelect('all', 'all');
    renderFilterDatePanel();
}

function getFilteredMovements() {
    const query = (movementFilters.query || '').trim().toLowerCase();
    const startRange = movementFilters.startDate || '';
    const endRange = movementFilters.endDate || '';

    return movements
        .filter(item => {
            if (startRange && item.date < startRange) return false;
            if (endRange && item.date > endRange) return false;

            if (movementFilters.kind !== 'all' && item.kind !== movementFilters.kind) return false;
            if (movementFilters.kind !== 'all' && movementFilters.category !== 'all' && item.category !== movementFilters.category) {
                return false;
            }

            if (movementFilters.minAmount !== null && item.amount < movementFilters.minAmount) return false;
            if (movementFilters.maxAmount !== null && item.amount > movementFilters.maxAmount) return false;

            if (query && !`${item.desc} ${item.category} ${item.notes || ''}`.toLowerCase().includes(query)) return false;

            return true;
        })
        .sort((a, b) => b.date.localeCompare(a.date) || (b.timestamp || 0) - (a.timestamp || 0));
}

function updateCashflowUsageBar(totalIncome, totalExpenses) {
    const incomeFillEl = $('cashflowIncomeFill');
    const expenseFillEl = $('cashflowExpenseFill');
    const tooltipEl = $('cashflowUsageTooltip');
    const barEl = $('cashflowUsageBar');
    if (!incomeFillEl || !expenseFillEl || !tooltipEl || !barEl) return;

    if (totalIncome <= 0 && totalExpenses <= 0) {
        incomeFillEl.style.width = '0%';
        expenseFillEl.style.width = '0%';
        currentUsageText = '0,0% de uso · Sin movimientos';
    } else if (totalIncome > 0 && totalExpenses <= 0) {
        incomeFillEl.style.width = '100%';
        expenseFillEl.style.width = '0%';
        currentUsageText = '0,0% de uso · 100% ingresos disponibles';
    } else if (totalIncome <= 0 && totalExpenses > 0) {
        incomeFillEl.style.width = '0%';
        expenseFillEl.style.width = '50%';
        currentUsageText = 'Gastos sin ingresos registrados';
    } else {
        const usageRatio = totalExpenses / totalIncome;
        const usagePct = usageRatio * 100;
        const expenseBarPct = Math.min(50, Math.max(0, usageRatio * 50));

        incomeFillEl.style.width = '100%';
        expenseFillEl.style.width = `${expenseBarPct}%`;

        currentUsageText = usagePct > 100
            ? `${usagePct.toFixed(1)}% de uso · Gastos superan ingresos`
            : `${usagePct.toFixed(1)}% de uso de ingresos`;
    }

    tooltipEl.textContent = currentUsageText;
}

function toggleCashflowUsageTooltip(forceState) {
    const barEl = $('cashflowUsageBar');
    const tooltipEl = $('cashflowUsageTooltip');
    if (!barEl || !tooltipEl) return;

    const nextState = typeof forceState === 'boolean'
        ? forceState
        : !barEl.classList.contains('show-percentage');

    barEl.classList.toggle('show-percentage', nextState);
    barEl.setAttribute('aria-expanded', String(nextState));
    tooltipEl.textContent = currentUsageText;
}

/* --- Renderizado de Movimientos --- */
function render() {
    const visibleMovements = getFilteredMovements();

    let totalIncome = 0;
    let totalExpenses = 0;
    visibleMovements.forEach(item => {
        if (item.kind === 'income') totalIncome += item.amount;
        else totalExpenses += item.amount;
    });

    $('income').textContent = formatMoney(totalIncome);
    $('expense').textContent = formatMoney(totalExpenses);
    $('balance').textContent = formatMoney(totalIncome - totalExpenses);
    updateCashflowUsageBar(totalIncome, totalExpenses);
    updateFilterButtonIndicator();
    updateActiveFilterCaption();

    const chronologicalMovements = [...movements].sort((a, b) => {
        const dateCmp = String(a.date || '').localeCompare(String(b.date || ''));
        if (dateCmp !== 0) return dateCmp;
        return (a.timestamp || 0) - (b.timestamp || 0);
    });

    let runningBalance = 0;
    const runningBalanceById = new Map();
    chronologicalMovements.forEach(item => {
        const amt = Number(item.amount) || 0;
        runningBalance += item.kind === 'income' ? amt : -amt;
        runningBalanceById.set(item.id, Math.round(runningBalance * 100) / 100);
    });

    const formattedDates = visibleMovements.map(item =>
        new Date(item.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })
    );

    let rowsHtml = '';
    visibleMovements.forEach((item, index) => {
        const dateFormatted = formattedDates[index];
        const prevDate = formattedDates[index - 1] || null;
        const nextDate = formattedDates[index + 1] || null;

        if (dateFormatted !== prevDate) {
            rowsHtml += `
                <tr class="date-header-row">
                    <td colspan="4"><span>${dateFormatted}</span></td>
                </tr>
            `;
        }

        const borderClass = dateFormatted !== nextDate ? 'no-border' : '';
        const { accentColor: catColor, iconSvg } = getCategoryMeta(item.kind, item.category);
        const remainingAfterMove = runningBalanceById.get(item.id) ?? 0;

        rowsHtml += `
            <tr class="movement-row ${borderClass}" data-movement-id="${item.id}">
                <td>
                    <div class="movement-name-wrapper">
                        <span class="category-icon-wrapper" style="color: ${catColor};">${iconSvg}</span>
                        <div class="movement-text-stack">
                            <span class="movement-title">${escapeHtml(item.desc)}</span>
                            <span class="movement-mobile-category">${escapeHtml(item.category)}</span>
                        </div>
                    </div>
                </td>
                <td class="text-right">
                    <span class="category-text">${escapeHtml(item.category)}</span>
                </td>
                <td class="amount ${item.kind === 'income' ? 'income' : 'expense'}">
                    <div class="movement-amount-stack">
                        <span>${item.kind === 'income' ? '+' : '−'}${formatMoney(item.amount)}</span>
                        <span class="movement-balance-sub">${formatMoney(remainingAfterMove)}</span>
                    </div>
                </td>
            </tr>
        `;
    });

    $('rows').innerHTML = rowsHtml;
    $('empty').style.display = visibleMovements.length ? 'none' : 'block';

    if (activeFinanceViewMode === 'categories' || isDesktopFinanceLayout()) {
        renderCategoriesRedesign(visibleMovements);
    }
}

/* --- Modales de Movimientos (Crear, Editar, Detalle) --- */
function openNewMovement() {
    editingId = null;
    $('newForm')?.reset();
    if ($('newKind')) $('newKind').value = 'expense';
    updateCategoryOptions('new');
    if ($('newDate')) $('newDate').value = `${currentMonth}-${pad(today.getDate())}`;
    clearValidationErrors($('newForm'));
    openModal($('newDlg'));
}

function editMovement(id) {
    const item = movements.find(m => m.id === id);
    if (!item) return;

    editingId = id;
    $('editDesc').value = item.desc;
    $('editKind').value = item.kind;
    updateCategoryOptions('edit');
    $('editAmount').value = item.amount;
    $('editDate').value = item.date;
    $('editCategory').value = item.category;
    $('editNotes').value = item.notes || '';

    if ($('deleteMovementModalBtn')) {
        $('deleteMovementModalBtn').onclick = () => {
            if (!confirm('¿Eliminar este movimiento?')) return;
            movements = movements.filter(m => m.id !== editingId);
            persist();
            closeModal($('editDlg'));
            render();
        };
    }

    clearValidationErrors($('editForm'));
    openModal($('editDlg'));
}

function showMovementDetail(id) {
    const item = movements.find(m => m.id === id);
    if (!item) return;

    if ($('detailEditBtn')) $('detailEditBtn').dataset.movementId = item.id;
    if ($('detailConcept')) $('detailConcept').textContent = item.desc || 'Sin concepto';
    if ($('detailContent')) {
        $('detailContent').innerHTML = `
            <table class="detail-table">
                <tr><th>Categoría</th><td>${escapeHtml(item.category)}</td></tr>
                <tr><th>Importe</th><td>${formatMoney(item.amount)}</td></tr>
                <tr><th>Fecha</th><td>${formatDateEs(item.date)}</td></tr>
                <tr><th>Notas</th><td>${escapeHtml(item.notes || '')}</td></tr>
            </table>
        `;
    }
    openModal($('detailDlg'));
}

/* --- Vista y Gestión de Categorías --- */
function setupCategoryTabs() {
    const btnExpense = $('catTabExpense');
    const btnIncome = $('catTabIncome');
    if (!btnExpense || !btnIncome) return;

    const switchTab = (kind) => {
        currentCatKind = kind;
        selectedDonutCategory = null;
        btnExpense.classList.toggle('active', kind === 'expense');
        btnExpense.setAttribute('aria-pressed', String(kind === 'expense'));
        btnIncome.classList.toggle('active', kind === 'income');
        btnIncome.setAttribute('aria-pressed', String(kind === 'income'));
        renderCategoriesRedesign();
    };

    btnExpense.addEventListener('click', () => switchTab('expense'));
    btnIncome.addEventListener('click', () => switchTab('income'));
}

function toggleDonutSegment(categoryName, options = {}) {
    selectedDonutCategory = (selectedDonutCategory === categoryName) ? null : categoryName;
    renderCategoriesRedesign(getFilteredMovements(), {
        scrollToSelected: Boolean(options.scrollToSelected && selectedDonutCategory)
    });
}

function getCategoryMeta(kind, name) {
    const catObj = (appConfig.categories[kind] || []).find(c => c.name === name);
    if (!catObj) {
        return {
            color: 'var(--fondo)',
            accentColor: 'var(--red)',
            iconSvg: warningIconSvg
        };
    }
    const color = catObj.color || 'var(--secundario)';
    const iconKey = catObj.icon || 'Compras';
    const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];
    return { color, accentColor: color, iconSvg };
}

function renderCategoriesRedesign(sourceMovements = getFilteredMovements(), options = {}) {    const activeMovements = sourceMovements.filter(item => item.kind === currentCatKind);

    const categoryTotals = {};
    activeMovements.forEach(item => {
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const totalSum = sortedCategories.reduce((sum, [, amt]) => sum + amt, 0);

    const chartWrapper = $('catChartWrapper');
    const listContainer = $('categories');

    if (!sortedCategories.length) {
        if (chartWrapper) {
            chartWrapper.innerHTML = `
                <svg viewBox="0 0 100 100" class="cat-donut-svg">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--fondo)" stroke-width="16"></circle>
                </svg>
                <div class="cat-center-info">
                    <span class="cat-center-label">Total</span>
                    <span class="cat-center-value">${formatMoney(0)}</span>
                </div>
            `;
        }
        if (listContainer) {
            listContainer.innerHTML = `<div class="empty">No hay ${currentCatKind === 'expense' ? 'gastos' : 'ingresos'} en la selección actual.</div>`;
        }
        return;
    }

    let cumulativePercent = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    let svgSegments = '';
    let floatingBadgeHtml = '';

    sortedCategories.forEach(([name, amount]) => {
        const { color, accentColor, iconSvg } = getCategoryMeta(currentCatKind, name);
        const percentage = totalSum > 0 ? (amount / totalSum) * 100 : 0;
        const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
        const strokeDashoffset = -((cumulativePercent * circumference) / 100);

        const midPercent = cumulativePercent + percentage / 2;
        cumulativePercent += percentage;

        const isSelected = selectedDonutCategory === name;

        svgSegments += `
            <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${color}" stroke-width="${isSelected ? 20 : 16}"
                stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashoffset}" 
                class="cat-donut-segment ${isSelected ? 'selected' : ''}" 
                data-donut-category="${escapeHtml(name)}">
                <title>${escapeHtml(name)}: ${formatMoney(amount)} (${percentage.toFixed(1)}%)</title>
            </circle>
        `;

        if (isSelected) {
            const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
            const badgeRadius = 57;
            const x = 50 + badgeRadius * Math.cos(angle);
            const y = 50 + badgeRadius * Math.sin(angle);

            floatingBadgeHtml = `
                <div class="cat-floating-badge" style="top: ${y}%; left: ${x}%; color: ${accentColor}; border-color: ${accentColor};">
                    <span class="cat-badge-icon" style="color: ${accentColor};">${iconSvg}</span>
                    <span class="cat-badge-text">${percentage.toFixed(1)}%</span>
                </div>
            `;
        }
    });

    if (chartWrapper) {
        chartWrapper.innerHTML = `
            <svg viewBox="0 0 100 100" class="cat-donut-svg">
                <circle cx="50" cy="50" r="${radius}" fill="none" stroke="var(--fondo)" stroke-width="16"></circle>
                ${svgSegments}
            </svg>
            <div class="cat-center-info">
                <span class="cat-center-label">${currentCatKind === 'expense' ? 'Gastos' : 'Ingresos'}</span>
                <span class="cat-center-value">${formatMoney(totalSum)}</span>
            </div>
            ${floatingBadgeHtml}
        `;
    }

    if (listContainer) {
        listContainer.innerHTML = sortedCategories.map(([name, amount]) => {
            const isSelected = selectedDonutCategory === name;
            const { accentColor, iconSvg } = getCategoryMeta(currentCatKind, name);
            const usagePercentage = totalSum > 0 ? ((amount / totalSum) * 100).toFixed(1) : 0;

            return `
                <div class="cat-breakdown-item ${isSelected ? 'selected' : ''}"
                     style="--cat-color: ${accentColor};"
                     data-list-category="${escapeHtml(name)}" role="button" tabindex="0"
                     aria-pressed="${isSelected}">
                    <div class="cat-breakdown-left">
                        <span class="category-icon-wrapper" style="color: ${accentColor};">${iconSvg}</span>
                        <span class="cat-breakdown-name">${escapeHtml(name)}</span>
                    </div>
                    <div class="cat-breakdown-right-group">
                        <span class="cat-breakdown-right">${formatMoney(amount)}</span>
                        <span class="cat-percentage-badge">${usagePercentage}%</span>
                    </div>
                </div>
            `;
        }).join('');

        if (options.scrollToSelected && selectedDonutCategory) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const targetItem = Array.from(listContainer.querySelectorAll('[data-list-category]'))
                        .find(el => el.dataset.listCategory === selectedDonutCategory);
                    if (!targetItem) return;

                    const containerRect = listContainer.getBoundingClientRect();
                    const itemRect = targetItem.getBoundingClientRect();
                    const isPartiallyOrFullyHidden =
                        itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom;

                    if (isPartiallyOrFullyHidden) {
                        const itemTopRelativeToContainer =
                            itemRect.top - containerRect.top + listContainer.scrollTop;
                        const centeredOffset =
                            itemTopRelativeToContainer -
                            (listContainer.clientHeight - targetItem.clientHeight) / 2;

                        listContainer.scrollTo({
                            top: Math.max(0, centeredOffset),
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }
}

function renderConfigCategories() {
    const list = $('categoryManagerList');
    if (!list) return;

    list.innerHTML = ['expense', 'income'].map((kind, idx) => {
        const title = kind === 'expense' ? 'Gastos' : 'Ingresos';
        const sectionClass = idx > 0 ? 'category-section-title category-section-divider' : 'category-section-title';

        const itemsHtml = getSortedCategories(kind).map((cat) => {
            const originalIndex = appConfig.categories[kind].findIndex(c => c.name === cat.name);
            const iconSvg = categoryIconsMap[cat.icon || 'Compras'] || categoryIconsMap['Compras'];

            return `
                <div class="category-item-row">
                    <div class="flex-center-gap">
                        <span class="editcategory-icon-wrapper" style="color: ${cat.color}; width: 28px; height: 28px;">${iconSvg}</span>
                        <span class="category-item-name">${escapeHtml(cat.name)}</span>
                    </div>
                    <div class="category-item-controls">
                        <button type="button" class="edit-category-button" data-action="open-edit-category" data-kind="${kind}" data-index="${originalIndex}" title="Editar categoría" aria-label="Editar categoría">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `<strong class="${sectionClass}">${title}</strong>${itemsHtml}`;
    }).join('');
}

function removeCategory(kind, index) {
    const cat = appConfig.categories[kind]?.[index];
    if (!cat) return;

    const usageCount = movements.filter(m => m.kind === kind && m.category === cat.name).length;
    const message = usageCount > 0
        ? `Hay ${usageCount} movimiento${usageCount === 1 ? '' : 's'} que usa${usageCount === 1 ? '' : 'n'} la categoría "${cat.name}". ¿Eliminarla de todos modos?`
        : `¿Estás seguro de eliminar la categoría "${cat.name}"?`;

    if (!confirm(message)) return;

    appConfig.categories[kind].splice(index, 1);
    persistConfig();
    refreshCategoryUI();
}

function renderIconGrid(containerId, hiddenInputId, selectedIcon) {
    const gridContainer = $(containerId);
    const hiddenInput = $(hiddenInputId);
    if (!gridContainer || !hiddenInput) return;

    hiddenInput.value = selectedIcon || '';
    gridContainer.innerHTML = Object.keys(categoryIconsMap).map(iconKey => `
        <div class="icon-option-item ${iconKey === selectedIcon ? 'selected' : ''}" data-icon="${iconKey}" title="${iconKey}">
            ${categoryIconsMap[iconKey]}
        </div>
    `).join('');
}

function openEditCategoryModal(kind, index) {
    const cat = appConfig.categories[kind][index];
    if (!cat) return;

    editingCategoryData = { kind, index };
    if ($('editCatName')) $('editCatName').value = cat.name;
    if ($('editCatKind')) $('editCatKind').value = kind;

    renderIconGrid('editIconSelectorGrid', 'editCatIcon', cat.icon || 'Compras');
    clearValidationErrors($('categoryEditForm'));
    openModal($('categoryEditDlg'));
}

function selectCategoryIcon(iconKey, targetInputId, containerSelector) {
    const hiddenInput = $(targetInputId);
    if (hiddenInput) hiddenInput.value = iconKey;

    document.querySelectorAll(`${containerSelector} .icon-option-item`).forEach(el => {
        el.classList.toggle('selected', el.dataset.icon === iconKey);
    });
}

/* ==========================================
   8. UTILIDAD 1: GESTOR DE REMESAS
   ========================================== */
function openNewRemittanceModal() {
    $('remitNewForm')?.reset();
    if ($('newRemitName')) {
        $('newRemitName').value = `${SPANISH_MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;
    }
    clearValidationErrors($('remitNewForm'));
    openModal($('remitNewDlg'));
}

function updateRemitDOMTotals(rem) {
    const tc = rem.tc || 1;
    let totalRecv = 0;
    let totalSend = 0;

    (rem.items || []).forEach((item, i) => {
        const rVal = item.recvAmount || 0;
        const sVal = tc > 0 ? rVal / tc : 0;
        totalRecv += rVal;
        totalSend += sVal;

        const sendSpan = $(`remit_send_${rem.id}_${i}`);
        if (sendSpan) sendSpan.textContent = formatCurrencyCustom(sVal, rem.sendCurr);
    });

    const grandTotal = totalSend + (rem.commission || 0);
    const tSendEl = $(`total_send_${rem.id}`);
    const tRecvEl = $(`total_recv_${rem.id}`);
    const gTotalEl = $(`grand_total_${rem.id}`);
    const headerSummaryEl = $(`remit_header_summary_${rem.id}`);

    if (tSendEl) tSendEl.textContent = formatCurrencyCustom(totalSend, rem.sendCurr);
    if (tRecvEl) tRecvEl.textContent = formatCurrencyCustom(totalRecv, rem.recvCurr);
    if (gTotalEl) gTotalEl.textContent = formatCurrencyCustom(grandTotal, rem.sendCurr);
    if (headerSummaryEl) {
        headerSummaryEl.textContent = `${rem.sendCurr} → ${rem.recvCurr} • Total: ${formatCurrencyCustom(grandTotal, rem.sendCurr)}`;
    }
}

function renderRemittancesList() {
    const listContainer = $('remittancesList');
    if (!listContainer) return;

    if (!remittancesList?.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay remesas registradas.</div>';
        return;
    }

    listContainer.innerHTML = remittancesList.map((rem) => {
        const tc = rem.tc || 3.75;
        let totalSend = 0;
        let totalRecv = 0;

        (rem.items || []).forEach(item => {
            const recvVal = item.recvAmount || 0;
            totalRecv += recvVal;
            totalSend += tc > 0 ? recvVal / tc : 0;
        });

        const comm = rem.commission || 0;
        const grandTotal = totalSend + comm;
        const formattedComm = formatNumberDisplay(comm, rem.sendCurr);
        const formattedTc = formatTcInputValue(tc, rem.recvCurr);

        const itemsHtml = (rem.items || []).map((item, idx) => {
            const recvVal = item.recvAmount || 0;
            const sendVal = tc > 0 ? recvVal / tc : 0;
            const formattedVal = formatNumberDisplay(recvVal, rem.recvCurr);
            const isLastClass = idx === rem.items.length - 1 ? 'is-last' : '';

            return `
                <div class="remit-item-row ${isLastClass}">
                    <div class="flex-col-grow">
                        <span class="remit-item-concept">${escapeHtml(item.concept)}</span>
                        <span class="remit-item-send-val" id="remit_send_${rem.id}_${idx}">${formatCurrencyCustom(sendVal, rem.sendCurr)}</span>
                    </div>
                    <div class="flex-center-gap">
                        <input type="text" inputmode="decimal" enterkeyhint="done" class="remit-recv-input remit-input-num" data-remit-id="${rem.id}" data-index="${idx}" value="${formattedVal}" placeholder="0,00">
                        <button type="button" class="small-delete-button" data-action="remove-remit-item" data-remit-id="${rem.id}" data-index="${idx}" title="Eliminar concepto" aria-label="Eliminar concepto">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="installment-purchase-card ${rem.expanded ? 'is-open' : ''}" id="remit_box_${rem.id}">
                <div class="installment-purchase-header" data-action="toggle-remit" data-remit-id="${rem.id}">
                    <div class="flex-col">
                        <span class="installment-card-title">${escapeHtml(rem.name)}</span>
                        <span class="installment-card-subtitle" id="remit_header_summary_${rem.id}">
                            ${rem.sendCurr} → ${rem.recvCurr} • Total: ${formatCurrencyCustom(grandTotal, rem.sendCurr)} 
                        </span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="editbutton-xs" data-action="edit-remit" data-remit-id="${rem.id}" title="Detalles de la remesa" aria-label="Detalles de la remesa">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>

                <div id="remit_details_${rem.id}" class="installment-installments-list-remesas remit-details-body" style="display: ${rem.expanded ? 'flex' : 'none'};">
                    <div class="remit-tc-row">
                        <span class="remit-tc-label">Tipo de cambio:</span>
                        <input type="text" class="remit-tc-input remit-input-num" data-remit-id="${rem.id}" value="${formattedTc}" placeholder="0,00" inputmode="decimal" enterkeyhint="done">
                    </div>

                    <div class="remit-items-wrapper">
                        ${itemsHtml || '<div class="empty empty-mini">Sin conceptos añadidos.</div>'}
                    </div>

                    <div class="remit-new-row">
                        <input type="text" id="new_concept_input_${rem.id}" placeholder=" Nuevo concepto" class="remit-new-input remit-concept-field" data-remit-id="${rem.id}" enterkeyhint="done">
                        <button type="button" class="remit-add-btn" data-action="add-remit-item" data-remit-id="${rem.id}">Añadir</button>
                    </div>

                    <div class="remit-totals-box">
                        <div class="remit-total-line">
                            <span class="remit-total-label">A enviar:</span>
                            <div>
                                <span id="total_send_${rem.id}" class="remit-total-send">${formatCurrencyCustom(totalSend, rem.sendCurr)}</span>
                                <span id="total_recv_${rem.id}" class="remit-total-recv">${formatCurrencyCustom(totalRecv, rem.recvCurr)}</span>
                            </div>
                        </div>
                        <div class="remit-commission-line">
                            <span class="remit-commission-label">Comisión:</span>
                            <input type="text" class="remit-comm-input remit-input-num" data-remit-id="${rem.id}" value="${formattedComm}" placeholder="0,00" inputmode="decimal" enterkeyhint="done">
                        </div>
                        <div class="remit-grand-total">
                            <span>Costo total:</span>
                            <span id="grand_total_${rem.id}" class="remit-grand-total-val">${formatCurrencyCustom(grandTotal, rem.sendCurr)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleRemitAccordion(remId) {
    const rem = remittancesList.find(r => r.id === remId);
    if (!rem) return;

    const willBeExpanded = !rem.expanded;
    remittancesList.forEach(r => { r.expanded = r.id === remId ? willBeExpanded : false; });
    persistRemittancesList();
    renderRemittancesList();
    scrollCardIntoView($(`remit_box_${remId}`), willBeExpanded);
}

function deleteRemittance(remId) {
    if (!confirm('¿Eliminar esta remesa y todo su registro?')) return;
    remittancesList = remittancesList.filter(r => r.id !== remId);
    persistRemittancesList();
    closeModal($('remitEditDlg'));
    renderRemittancesList();
}

function editRemittance(remId) {
    const rem = remittancesList.find(r => r.id === remId);
    if (!rem) return;

    editingRemittanceId = remId;
    $('editRemitName').value = rem.name;
    $('editRemitSendCurr').value = rem.sendCurr || 'EUR';
    $('editRemitRecvCurr').value = rem.recvCurr || 'PEN';

    if ($('deleteRemitModalBtn')) {
        $('deleteRemitModalBtn').onclick = () => deleteRemittance(editingRemittanceId);
    }

    clearValidationErrors($('remitEditForm'));
    if ($('remitEditDlg')) openModal($('remitEditDlg'));
}

function removeRemitItem(remId, index) {
    const rem = remittancesList.find(r => r.id === remId);
    if (!rem) return;
    rem.items.splice(index, 1);
    persistRemittancesList();
    renderRemittancesList();
}

function addRemitItem(remId) {
    const inputEl = $(`new_concept_input_${remId}`);
    const conceptName = inputEl?.value.trim();
    if (!conceptName) return;

    const rem = remittancesList.find(r => r.id === remId);
    if (!rem) return;

    rem.items.push({ concept: conceptName, recvAmount: 0 });
    persistRemittancesList();
    renderRemittancesList();

    const nextInput = $(`new_concept_input_${remId}`);
    if (nextInput) {
        nextInput.value = '';
        nextInput.focus();
        nextInput.setSelectionRange?.(0, 0);
    }
}

/* ==========================================
   9. UTILIDAD 2: GESTOR DE COMPRAS EN CUOTAS
   ========================================== */
function openNewInstallmentPurchaseModal() {
    $('installmentNewForm')?.reset();
    if ($('newInstCurrency')) $('newInstCurrency').value = appConfig.currency || 'EUR';
    if ($('newInstFirstDate')) $('newInstFirstDate').value = `${currentMonth}-${pad(today.getDate())}`;
    clearValidationErrors($('installmentNewForm'));
    openModal($('installmentNewDlg'));
}

function autoCalculateInstallment(prefix) {
    const financed = parseFloat($(`${prefix}InstFinancedAmount`).value.replace(',', '.')) || 0;
    const interest = parseFloat($(`${prefix}InstInterestAmount`).value.replace(',', '.')) || 0;
    const count = parseInt($(`${prefix}InstTotalCount`).value) || 0;
    const total = financed + interest;

    $(`${prefix}InstTotalAmount`).value = total > 0 ? total.toFixed(2).replace('.', ',') : '';
    if (total > 0 && count > 0) {
        $(`${prefix}InstRegularAmount`).value = (total / count).toFixed(2).replace('.', ',');
    }
}

function readInstallmentForm(prefix) {
    const nameInput = $(`${prefix}InstName`);
    const financedInput = $(`${prefix}InstFinancedAmount`);
    const countInput = $(`${prefix}InstTotalCount`);
    const regularInput = $(`${prefix}InstRegularAmount`);
    const dateInput = $(`${prefix}InstFirstDate`);

    if (!validateRequiredFields($(`installment${prefix === 'new' ? 'New' : 'Edit'}Form`), [nameInput, financedInput, countInput, regularInput, dateInput])) {
        return null;
    }

    const financedAmount = parseFloat(financedInput.value.replace(',', '.')) || 0;
    const interestAmount = parseFloat($(`${prefix}InstInterestAmount`).value.replace(',', '.')) || 0;
    const totalCount = parseInt(countInput.value) || 1;
    const regularAmount = parseFloat(regularInput.value.replace(',', '.')) || 0;
    const finalAmountRaw = $(`${prefix}InstFinalAmount`).value.trim();

    return {
        name: nameInput.value.trim(),
        currency: $(`${prefix}InstCurrency`).value,
        financedAmount,
        interestAmount,
        totalAmount: financedAmount + interestAmount,
        totalCount,
        regularAmount,
        finalAmount: finalAmountRaw ? parseFloat(finalAmountRaw.replace(',', '.')) : regularAmount,
        firstDate: dateInput.value
    };
}

function buildInstallmentsArray(totalCount, regularAmount, finalAmount, firstDateStr, existingInstallments = []) {
    const installments = [];
    for (let i = 1; i <= totalCount; i++) {
        const oldInst = existingInstallments.find(ins => ins.number === i);
        installments.push({
            number: i,
            amount: (i === totalCount) ? finalAmount : regularAmount,
            date: addMonthsToDate(firstDateStr, i - 1),
            paid: oldInst ? oldInst.paid : false
        });
    }
    return installments;
}

function renderInstallments() {
    const listContainer = $('installmentsList');
    if (!listContainer) return;

    if (!installmentsPurchases.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay compras registradas.</div>';
        return;
    }

    listContainer.innerHTML = installmentsPurchases.map((purchase) => {
        const curr = purchase.currency || 'EUR';
        const totalPaidCount = purchase.installments.filter(i => i.paid).length;
        const allPaid = purchase.installments.length > 0 && totalPaidCount === purchase.installments.length;

        const installmentsHtml = purchase.installments.map((inst) => `
            <div class="installment-row ${inst.paid ? 'paid' : ''}" data-action="toggle-inst-paid" data-purchase-id="${purchase.id}" data-inst-number="${inst.number}">
                <div class="flex-col">
                    <span class="installment-row-title">Cuota ${inst.number} de ${purchase.totalCount}</span>
                    <span class="installment-row-date">Vencimiento: ${formatDateEs(inst.date)}</span>
                </div>
                <div class="installment-row-right">
                    <span class="installment-row-amount">${formatCurrencyCustom(inst.amount, curr)}</span>
                    <input type="checkbox" class="installment-checkbox" ${inst.paid ? 'checked' : ''} data-stop-propagation="true">
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card ${purchase.expanded ? 'is-open' : ''}" id="purchase_box_${purchase.id}">
                <div class="installment-purchase-header ${allPaid ? 'all-paid' : ''}" data-action="toggle-purchase" data-purchase-id="${purchase.id}">
                    <div class="flex-col">
                        <span class="installment-card-title">${escapeHtml(purchase.name)}</span>
                        <span class="installment-card-subtitle">Total: ${formatCurrencyCustom(purchase.totalAmount, curr)} • Pagadas: ${totalPaidCount}/${purchase.totalCount}</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="editbutton-xs" data-action="edit-purchase" data-purchase-id="${purchase.id}" title="Detalles de la compra" aria-label="Detalles de la compra">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div class="installment-scroll-shell">
                    <div id="purchase_details_${purchase.id}" class="installment-installments-list-compras" style="display: ${purchase.expanded ? 'flex' : 'none'};">
                        ${installmentsHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function togglePurchaseAccordion(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    const willBeExpanded = !purchase.expanded;
    installmentsPurchases.forEach(p => { p.expanded = p.id === purchaseId ? willBeExpanded : false; });
    persistInstallments();
    renderInstallments();
    scrollCardIntoView($(`purchase_box_${purchaseId}`), willBeExpanded);
}

function toggleInstallmentPaid(purchaseId, instNumber) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    const inst = purchase?.installments.find(i => i.number === instNumber);
    if (!inst) return;

    inst.paid = !inst.paid;
    persistInstallments();
    renderInstallments();
}

function editPurchase(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    editingInstallmentId = purchaseId;
    $('editInstName').value = purchase.name;
    $('editInstCurrency').value = purchase.currency || 'EUR';
    $('editInstFinancedAmount').value = String(purchase.financedAmount || 0).replace('.', ',');
    $('editInstInterestAmount').value = purchase.interestAmount ? String(purchase.interestAmount).replace('.', ',') : '';
    $('editInstTotalAmount').value = String(purchase.totalAmount || 0).replace('.', ',');
    $('editInstTotalCount').value = purchase.totalCount;
    $('editInstRegularAmount').value = String(purchase.regularAmount || 0).replace('.', ',');
    $('editInstFinalAmount').value = (purchase.finalAmount && purchase.finalAmount !== purchase.regularAmount)
        ? String(purchase.finalAmount).replace('.', ',')
        : '';
    $('editInstFirstDate').value = purchase.firstDate;

    clearValidationErrors($('installmentEditForm'));
    openModal($('installmentEditDlg'));
}

/* ==========================================
   10. UTILIDAD 3: CONTADOR DE DÍAS TRABAJADOS
   ========================================== */
function openNewDayCounterMonthModal() {
    $('dayCounterMonthNewForm')?.reset();
    if ($('newMonthName')) {
        $('newMonthName').value = `${SPANISH_MONTH_NAMES[today.getMonth()]} ${today.getFullYear()}`;
    }
    if ($('newMonthTarget')) $('newMonthTarget').value = '15';
    clearValidationErrors($('dayCounterMonthNewForm'));
    openModal($('dayCounterMonthNewDlg'));
}

function renderDayCounter() {
    const container = $('dayCounterMonthsList');
    if (!container) return;

    if (!dayCounterMonths.length) {
        container.innerHTML = '<div class="empty empty-compact">Aún no hay meses registrados.</div>';
        return;
    }

    container.innerHTML = dayCounterMonths.map((month) => {
        const daysCount = month.days.length;
        const target = month.targetDays || 15;
        const extraDays = Math.max(0, daysCount - target);

        const daysHtml = month.days.map((day, idx) => `
            <div class="dc-day-row">
                <div class="dc-day-left">
                    <span class="dc-day-name">${escapeHtml(day.dayName)}</span>
                    <span class="dc-day-date">${formatDateEs(day.date)}</span>
                </div>
                <div class="dc-day-middle">
                    <span class="dc-day-loc">${escapeHtml(day.location)}</span>
                    <span class="dc-day-time">${escapeHtml(day.entryTime)} – ${escapeHtml(day.exitTime)}</span>
                </div>
                <div class="dc-day-right">
                    <button type="button" class="editdaysbutton-xs" data-action="edit-day" data-month-id="${month.id}" data-day-index="${idx}" title="Editar día" aria-label="Editar día">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card ${month.expanded ? 'is-open' : ''}" id="dc_month_box_${month.id}">
                <div class="installment-purchase-header" data-action="toggle-dc-month" data-month-id="${month.id}">
                    <div class="flex-col">
                        <span class="installment-card-title">${escapeHtml(month.name)}</span>
                        <span class="installment-card-subtitle">Trabajados: ${daysCount} • Extras: ${extraDays}</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="editbutton-xs" data-action="edit-dc-month" data-month-id="${month.id}" title="Editar mes" aria-label="Editar mes">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div id="dc_month_details_${month.id}" class="installment-installments-list-dias" style="display: ${month.expanded ? 'flex' : 'none'};">
                    <div class="dc-days-wrapper">
                        ${daysHtml || '<div class="empty empty-compact">Aún no se han registrado días.</div>'}
                    </div>
                    <button type="button" class="day-newbutton" data-action="open-new-day" data-month-id="${month.id}">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Registrar día
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleDayCounterMonthAccordion(monthId) {
    const month = dayCounterMonths.find(m => m.id === monthId);
    if (!month) return;

    const willBeExpanded = !month.expanded;
    dayCounterMonths.forEach(m => { m.expanded = m.id === monthId ? willBeExpanded : false; });
    persistDayCounter();
    renderDayCounter();
    scrollCardIntoView($(`dc_month_box_${monthId}`), willBeExpanded);
}

function editDayCounterMonth(monthId) {
    const month = dayCounterMonths.find(m => m.id === monthId);
    if (!month) return;

    editingMonthId = monthId;
    $('editMonthName').value = month.name;
    $('editMonthTarget').value = month.targetDays;

    if ($('deleteMonthModalBtn')) {
        $('deleteMonthModalBtn').onclick = () => {
            if (!confirm('¿Eliminar este mes y todos los días registrados en él?')) return;
            dayCounterMonths = dayCounterMonths.filter(m => m.id !== editingMonthId);
            persistDayCounter();
            closeModal($('dayCounterMonthEditDlg'));
            renderDayCounter();
        };
    }

    clearValidationErrors($('dayCounterMonthEditForm'));
    openModal($('dayCounterMonthEditDlg'));
}

function openDayCounterDayModal(monthId, dayIndex = null) {
    const month = dayCounterMonths.find(m => m.id === monthId);
    if (!month) return;

    editingDayMonthId = monthId;
    editingDayIndex = dayIndex;
    clearValidationErrors($('dayCounterDayForm'));

    const isEditing = dayIndex !== null && month.days[dayIndex];
    const copyWrapper = $('copyPreviousDayWrapper');

    if (isEditing) {
        const day = month.days[dayIndex];
        $('dayDlgTitle').textContent = 'Editar día';
        $('dayDate').value = day.date;
        $('dayNameDisplay').value = day.dayName;
        $('dayEntryTime').value = day.entryTime;
        $('dayExitTime').value = day.exitTime;
        $('dayLocation').value = day.location;

        if (copyWrapper) copyWrapper.style.display = 'none';
        $('dayModalActionsSplit').style.display = 'flex';
        $('dayModalActionsNormal').style.display = 'none';
    } else {
        $('dayDlgTitle').textContent = 'Registrar día';
        const defaultDate = `${currentMonth}-${pad(today.getDate())}`;
        $('dayDate').value = defaultDate;
        $('dayNameDisplay').value = getDayNameFromDate(defaultDate);
        $('dayEntryTime').value = '18:00';
        $('dayExitTime').value = '06:00';
        $('dayLocation').value = '';

        if (copyWrapper) copyWrapper.style.display = month.days.length > 0 ? 'block' : 'none';
        $('dayModalActionsSplit').style.display = 'none';
        $('dayModalActionsNormal').style.display = 'flex';
    }

    openModal($('dayCounterDayDlg'));
}

function addDaysToIsoDate(dateStr, daysToAdd) {
    const parts = parseIsoParts(dateStr);
    if (!parts) return dateStr || '';
    const nextDate = new Date(parts.y, parts.m - 1, parts.d + daysToAdd);
    return toIsoDateLocal(nextDate);
}

function copyLastDayData() {
    const month = dayCounterMonths.find(m => m.id === editingDayMonthId);
    if (!month?.days.length) return;

    const lastDay = month.days[0];
    if (lastDay.date) {
        const nextIsoDate = addDaysToIsoDate(lastDay.date, 1);
        $('dayDate').value = nextIsoDate;
        $('dayNameDisplay').value = getDayNameFromDate(nextIsoDate);
    }
    $('dayEntryTime').value = lastDay.entryTime || '';
    $('dayExitTime').value = lastDay.exitTime || '';
    $('dayLocation').value = lastDay.location || '';
    clearValidationErrors($('dayCounterDayForm'));
}

/* ==========================================
   11. EVENTOS Y ARRANQUE DE LA APLICACIÓN
   ========================================== */
function bindDelegatedEvents() {
    $('rows')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr.movement-row');
        if (row) showMovementDetail(row.dataset.movementId);
    });

     $('catChartWrapper')?.addEventListener('click', (e) => {
        const seg = e.target.closest('[data-donut-category]');
        if (seg) {
            e.stopPropagation();
            toggleDonutSegment(seg.dataset.donutCategory, { scrollToSelected: true });
        }
    });

    $('categories')?.addEventListener('click', (e) => {
        const item = e.target.closest('[data-list-category]');
        if (item) {
            e.stopPropagation();
            toggleDonutSegment(item.dataset.listCategory);
        }
    });

    $('categories')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const item = e.target.closest('[data-list-category]');
            if (item) {
                e.preventDefault();
                toggleDonutSegment(item.dataset.listCategory);
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (!selectedDonutCategory) return;

        const clickedInsideChart = e.target.closest('#catChartWrapper');
        const clickedInsideList = e.target.closest('[data-list-category]');

        if (!clickedInsideChart && !clickedInsideList) {
            selectedDonutCategory = null;
            renderCategoriesRedesign();
        }
    });

    $('categoryManagerList')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="open-edit-category"]');
        if (btn) openEditCategoryModal(btn.dataset.kind, Number(btn.dataset.index));
    });

    $('iconSelectorGrid')?.addEventListener('click', (e) => {
        const item = e.target.closest('.icon-option-item');
        if (item) selectCategoryIcon(item.dataset.icon, 'newCatIcon', '#iconSelectorGrid');
    });

    $('editIconSelectorGrid')?.addEventListener('click', (e) => {
        const item = e.target.closest('.icon-option-item');
        if (item) selectCategoryIcon(item.dataset.icon, 'editCatIcon', '#editIconSelectorGrid');
    });

    $('remittancesList')?.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const { action, remitId, index } = target.dataset;
        if (action === 'toggle-remit') toggleRemitAccordion(remitId);
        else if (action === 'edit-remit') { e.stopPropagation(); editRemittance(remitId); }
        else if (action === 'remove-remit-item') removeRemitItem(remitId, Number(index));
        else if (action === 'add-remit-item') addRemitItem(remitId);
    });

    $('remittancesList')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.classList.contains('remit-concept-field')) {
            e.preventDefault();
            addRemitItem(e.target.dataset.remitId);
        } else if (e.key === 'Enter' && e.target.classList.contains('remit-tc-input')) {
            e.preventDefault();
            const input = e.target;
            const rem = remittancesList.find(r => r.id === input.dataset.remitId);
            if (rem) {
                const val = parseInputNumber(input.value);
                rem.tc = val;
                persistRemittancesList();
                input.value = val > 0 ? formatTcInputValue(val, rem.recvCurr) : '';
                updateRemitDOMTotals(rem);
            }
            input.blur();
        } else if (e.key === 'Enter' && e.target.classList.contains('remit-recv-input')) {
            e.preventDefault();
            const input = e.target;
            const rem = remittancesList.find(r => r.id === input.dataset.remitId);
            if (rem) {
                const idx = Number(input.dataset.index);
                const val = parseInputNumber(input.value);
                if (rem.items[idx]) {
                    rem.items[idx].recvAmount = val;
                    persistRemittancesList();
                    input.value = formatNumberDisplay(val, rem.recvCurr);
                    updateRemitDOMTotals(rem);
                }
            }
            input.blur();
        }
    });

    $('remittancesList')?.addEventListener('input', (e) => {
        const input = e.target;
        const rem = remittancesList.find(r => r.id === input.dataset.remitId);
        if (!rem) return;

        if (input.classList.contains('remit-tc-input')) {
            rem.tc = parseInputNumber(input.value) || 0;
            persistRemittancesList();
            updateRemitDOMTotals(rem);
        } else if (input.classList.contains('remit-recv-input')) {
            const idx = Number(input.dataset.index);
            if (rem.items[idx]) {
                rem.items[idx].recvAmount = parseInputNumber(input.value);
                persistRemittancesList();
                updateRemitDOMTotals(rem);
            }
        } else if (input.classList.contains('remit-comm-input')) {
            rem.commission = parseInputNumber(input.value);
            persistRemittancesList();
            updateRemitDOMTotals(rem);
        }
    });

    $('remittancesList')?.addEventListener('focus', (e) => {
        const input = e.target;
        const rem = remittancesList.find(r => r.id === input.dataset.remitId);
        if (!rem) return;

        if (input.classList.contains('remit-recv-input')) {
            const idx = Number(input.dataset.index);
            const val = rem.items[idx]?.recvAmount ?? parseInputNumber(input.value);
            input.value = formatPlainInputValue(val, rem.recvCurr);
        } else if (input.classList.contains('remit-comm-input')) {
            const val = rem.commission ?? parseInputNumber(input.value);
            input.value = formatPlainInputValue(val, rem.sendCurr);
        }
    }, true);

    $('remittancesList')?.addEventListener('blur', (e) => {
        const input = e.target;
        const rem = remittancesList.find(r => r.id === input.dataset.remitId);
        if (!rem) return;

        if (input.classList.contains('remit-tc-input')) {
            const val = parseInputNumber(input.value);
            rem.tc = val;
            persistRemittancesList();
            input.value = val > 0 ? formatTcInputValue(val, rem.recvCurr) : '';
            updateRemitDOMTotals(rem);
        } else if (input.classList.contains('remit-recv-input')) {
            const idx = Number(input.dataset.index);
            const val = parseInputNumber(input.value);
            if (rem.items[idx]) {
                rem.items[idx].recvAmount = val;
                persistRemittancesList();
                input.value = formatNumberDisplay(val, rem.recvCurr);
                updateRemitDOMTotals(rem);
            }
        } else if (input.classList.contains('remit-comm-input')) {
            const val = parseInputNumber(input.value);
            rem.commission = val;
            persistRemittancesList();
            input.value = formatNumberDisplay(val, rem.sendCurr);
            updateRemitDOMTotals(rem);
        }
    }, true);

    $('installmentsList')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-action="edit-purchase"]');
        if (editBtn) { e.stopPropagation(); editPurchase(editBtn.dataset.purchaseId); return; }

        const row = e.target.closest('[data-action="toggle-inst-paid"]');
        if (row) { toggleInstallmentPaid(row.dataset.purchaseId, Number(row.dataset.instNumber)); return; }

        const header = e.target.closest('[data-action="toggle-purchase"]');
        if (header) togglePurchaseAccordion(header.dataset.purchaseId);
    });

    $('dayCounterMonthsList')?.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const { action, monthId, dayIndex } = target.dataset;
        if (action === 'toggle-dc-month') toggleDayCounterMonthAccordion(monthId);
        else if (action === 'edit-dc-month') { e.stopPropagation(); editDayCounterMonth(monthId); }
        else if (action === 'open-new-day') openDayCounterDayModal(monthId, null);
        else if (action === 'edit-day') openDayCounterDayModal(monthId, Number(dayIndex));
    });
}

function bindFilterEvents() {
    $('openFilterBtn')?.addEventListener('click', openFilterDialog);
    $('cancelFilterBtn')?.addEventListener('click', () => closeModal($('filterDlg')));
    $('resetFiltersBtn')?.addEventListener('click', clearFilterDialogDraft);

    document.querySelectorAll('#filterDlg .filter-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextKind = btn.dataset.filterKind;
            filterDraft.kind = nextKind;
            filterDraft.category = 'all';
            syncFilterUIState(nextKind);
            populateFilterCategorySelect(nextKind, 'all');
        });
    });

    $('filterCategorySelect')?.addEventListener('change', (e) => {
        filterDraft.category = e.target.value;
    });

    document.querySelectorAll('#filterDlg .filter-date-tab').forEach(tab => {
        tab.addEventListener('click', () => handleFilterDateTabClick(tab.dataset.dateMode));
    });

    $('filterDatePickerPanel')?.addEventListener('click', (e) => {
        const navBtn = e.target.closest('[data-cal-nav]');
        if (navBtn) {
            const delta = navBtn.dataset.calNav === 'next' ? 1 : -1;
            const nextDate = new Date(filterDraft.calYear, filterDraft.calMonth + delta, 1);
            filterDraft.calYear = nextDate.getFullYear();
            filterDraft.calMonth = nextDate.getMonth();
            renderFilterDatePanel();
            return;
        }

        const dayBtn = e.target.closest('[data-cal-iso]');
        if (dayBtn) {
            const iso = dayBtn.dataset.calIso;
            const parts = parseIsoParts(iso);
            filterDraft.anchorDate = iso;
            if (parts) {
                filterDraft.calYear = parts.y;
                filterDraft.calMonth = parts.m - 1;
            }
            if (filterDraft.dateMode === 'day') {
                filterDraft.startDate = iso;
                filterDraft.endDate = iso;
            } else if (filterDraft.dateMode === 'week') {
                const wk = getMondayToSundayWeekRange(iso);
                filterDraft.startDate = wk.startDate;
                filterDraft.endDate = wk.endDate;
            }
            renderFilterDatePanel();
            return;
        }

        const monthBtn = e.target.closest('[data-pick-month]');
        if (monthBtn) {
            filterDraft.pickerMonth = Number(monthBtn.dataset.pickMonth);
            const range = computeRangeForMode('month', filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth);
            filterDraft.startDate = range.startDate;
            filterDraft.endDate = range.endDate;
            filterDraft.anchorDate = range.anchorDate;
            renderFilterDatePanel();
            return;
        }

        const yearBtn = e.target.closest('[data-pick-year]');
        if (yearBtn) {
            filterDraft.pickerYear = Number(yearBtn.dataset.pickYear);
            const modeToCompute = filterDraft.dateMode === 'year' ? 'year' : 'month';
            const range = computeRangeForMode(modeToCompute, filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth);
            filterDraft.startDate = range.startDate;
            filterDraft.endDate = range.endDate;
            filterDraft.anchorDate = range.anchorDate;
            renderFilterDatePanel();
        }
    });

    $('filterDatePickerPanel')?.addEventListener('change', (e) => {
        if (e.target.id === 'filterStartDate') filterDraft.startDate = e.target.value;
        if (e.target.id === 'filterEndDate') filterDraft.endDate = e.target.value;
    });

    $('filterForm')?.addEventListener('submit', (e) => {
        e.preventDefault();

        const queryVal = ($('filterSearchInput')?.value || '').trim();
        const kindVal = filterDraft.kind || 'all';
        const catVal = kindVal === 'all' ? 'all' : ($('filterCategorySelect')?.value || 'all');
        const dateModeVal = filterDraft.dateMode || 'all';

        let startVal = '';
        let endVal = '';

        if (dateModeVal !== 'all') {
            if (dateModeVal === 'custom') {
                startVal = ($('filterStartDate')?.value || filterDraft.startDate || '').trim();
                endVal = ($('filterEndDate')?.value || filterDraft.endDate || '').trim();
                if (startVal && endVal && startVal > endVal) {
                    const tmp = startVal;
                    startVal = endVal;
                    endVal = tmp;
                }
            } else {
                startVal = filterDraft.startDate || '';
                endVal = filterDraft.endDate || '';
            }
        }

        const rawMin = ($('filterMinAmount')?.value || '').trim();
        const rawMax = ($('filterMaxAmount')?.value || '').trim();
        let minVal = rawMin ? parseInputNumber(rawMin) : null;
        let maxVal = rawMax ? parseInputNumber(rawMax) : null;

        if (minVal !== null && isNaN(minVal)) minVal = null;
        if (maxVal !== null && isNaN(maxVal)) maxVal = null;
        if (minVal !== null && maxVal !== null && minVal > maxVal) {
            const tmpAmt = minVal;
            minVal = maxVal;
            maxVal = tmpAmt;
        }

        movementFilters = {
            query: queryVal,
            kind: kindVal,
            category: catVal,
            dateMode: dateModeVal,
            startDate: startVal,
            endDate: endVal,
            minAmount: minVal,
            maxAmount: maxVal
        };

        persistFilters();
        closeModal($('filterDlg'));
        render();
    });
}

function bindEvents() {
    $('openNavDrawerBtn')?.addEventListener('click', openNavDrawer);
    $('closeNavDrawerBtn')?.addEventListener('click', closeNavDrawer);
    $('navDrawerBackdrop')?.addEventListener('click', closeNavDrawer);

    document.querySelectorAll('[data-nav-section]').forEach(btn => {
        btn.addEventListener('click', () => {
            selectAppSection(btn.dataset.navSection, {
                closeDrawer: true,
                expandActiveUtility: true
            });
        });
    });

    let openTouchStartX = 0;
    let openTouchStartY = 0;
    let isSwipingToOpenDrawer = false;
    let currentOpenDrawerOffset = 0;

    document.addEventListener('touchstart', (e) => {
        const navDrawer = $('navDrawer');
        const navBackdrop = $('navDrawerBackdrop');
        if (!navDrawer || navDrawer.classList.contains('is-open') || document.querySelector('dialog[open]')) {
            isSwipingToOpenDrawer = false;
            return;
        }

        const touch = e.touches[0];
        openTouchStartX = touch.clientX;
        openTouchStartY = touch.clientY;
        isSwipingToOpenDrawer = false;
        currentOpenDrawerOffset = 0;

        if (openTouchStartX <= 2) {
            const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);
            navDrawer.classList.add('is-dragging');
            navDrawer.style.transform = `translateX(${-drawerWidth}px)`;
            if (navBackdrop) {
                navBackdrop.classList.remove('is-hidden');
                navBackdrop.style.opacity = '0';
            }
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        const navDrawer = $('navDrawer');
        const navBackdrop = $('navDrawerBackdrop');
        if (!navDrawer || navDrawer.classList.contains('is-open') || openTouchStartX > 36) return;

        const touch = e.touches[0];
        const dx = touch.clientX - openTouchStartX;
        const dy = touch.clientY - openTouchStartY;

        if (!isSwipingToOpenDrawer) {
            if (Math.abs(dy) > 15 && Math.abs(dy) > Math.abs(dx)) {
                openTouchStartX = 0;
                navDrawer.classList.remove('is-dragging');
                navDrawer.style.transform = '';
                if (navBackdrop) {
                    navBackdrop.classList.add('is-hidden');
                    navBackdrop.style.opacity = '';
                }
                return;
            }
            if (dx > 8 && Math.abs(dx) > Math.abs(dy)) {
                isSwipingToOpenDrawer = true;
                lockBodyScroll();
            }
        }

        if (isSwipingToOpenDrawer) {
            const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);
            const clampedDx = Math.max(0, Math.min(drawerWidth, dx));
            currentOpenDrawerOffset = clampedDx - drawerWidth;
            navDrawer.style.transform = `translateX(${currentOpenDrawerOffset}px)`;

            if (navBackdrop) {
                const progress = clampedDx / drawerWidth;
                navBackdrop.style.opacity = String(progress);
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        const navDrawer = $('navDrawer');
        const navBackdrop = $('navDrawerBackdrop');
        if (!navDrawer || navDrawer.classList.contains('is-open')) return;

        const wasSwiping = isSwipingToOpenDrawer;
        const finalOffset = currentOpenDrawerOffset;
        const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);

        openTouchStartX = 0;
        openTouchStartY = 0;
        isSwipingToOpenDrawer = false;
        currentOpenDrawerOffset = 0;

        navDrawer.classList.remove('is-dragging');
        navDrawer.style.transform = '';
        if (navBackdrop) {
            navBackdrop.style.opacity = '';
        }

        if (!wasSwiping) {
            if (navBackdrop) navBackdrop.classList.add('is-hidden');
            if (!document.querySelector('dialog[open]')) {
                document.body.classList.remove('no-scroll');
            }
            return;
        }

        const draggedDistance = drawerWidth + finalOffset;
        if (draggedDistance > drawerWidth * 0.35 || draggedDistance > 75) {
            openNavDrawer();
        } else {
            if (navBackdrop) {
                navBackdrop.classList.add('is-hidden');
                navBackdrop.setAttribute('aria-hidden', 'true');
            }
            if (!document.querySelector('dialog[open]')) {
                document.body.classList.remove('no-scroll');
            }
        }
    }, { passive: true });

    $('navMoreBackupBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBackupPopover();
    });
    $('navBackupBackdrop')?.addEventListener('click', () => toggleBackupPopover(false));

    $('importCsvBtn')?.addEventListener('click', () => {
        toggleBackupPopover(false);
        $('csvFileInput')?.click();
    });
    $('openExportDlgBtn')?.addEventListener('click', () => {
        toggleBackupPopover(false);
        if ($('expMovements')) $('expMovements').checked = true;
        if ($('expRemittances')) $('expRemittances').checked = true;
        if ($('expInstallments')) $('expInstallments').checked = true;
        if ($('expDayCounter')) $('expDayCounter').checked = true;
        openModal($('exportDlg'));
    });

    $('currencySelect')?.addEventListener('change', (e) => {
        appConfig.currency = e.target.value;
        persistConfig();
        render();
        renderRemittancesList();
        renderInstallments();
    });

    document.querySelectorAll('[data-theme-value]').forEach(btn => {
        btn.addEventListener('click', () => {
            appConfig.theme = btn.dataset.themeValue === 'dark' ? 'dark' : 'light';
            persistConfig();
        });
    });

    const drawer = $('navDrawer');
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwipingDrawer = false;
    let currentDrawerOffset = 0;

    drawer?.addEventListener('touchstart', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        isSwipingDrawer = false;
        currentDrawerOffset = 0;
        drawer.classList.add('is-dragging');
    }, { passive: true });

    drawer?.addEventListener('touchmove', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (!isSwipingDrawer && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
            isSwipingDrawer = true;
        }
        if (isSwipingDrawer) {
            currentDrawerOffset = Math.min(0, dx);
            drawer.style.transform = `translateX(${currentDrawerOffset}px)`;
        }
    }, { passive: true });

    drawer?.addEventListener('touchend', () => {
        if (!drawer.classList.contains('is-open')) return;
        drawer.classList.remove('is-dragging');
        drawer.style.transform = '';
        if (isSwipingDrawer && currentDrawerOffset < -75) {
            closeNavDrawer();
        }
        isSwipingDrawer = false;
        currentDrawerOffset = 0;
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!$('navBackupPopover')?.classList.contains('is-hidden')) {
                toggleBackupPopover(false);
            } else if ($('navDrawer')?.classList.contains('is-open')) {
                closeNavDrawer();
            }
        }
    });

    $('headerSectionNewBtn')?.addEventListener('click', () => {
        if (activeAppSection === 'remittances') openNewRemittanceModal();
        else if (activeAppSection === 'installments') openNewInstallmentPurchaseModal();
        else if (activeAppSection === 'dayCounter') openNewDayCounterMonthModal();
    });

    const usageBar = $('cashflowUsageBar');
    usageBar?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCashflowUsageTooltip();
    });
    usageBar?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleCashflowUsageTooltip();
        }
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#cashflowUsageBar')) {
            toggleCashflowUsageTooltip(false);
        }
    });

    document.querySelectorAll('.view-mode-option[data-view-mode]').forEach(btn => {
        btn.addEventListener('click', () => setFinanceViewMode(btn.dataset.viewMode));
    });

    bindFilterEvents();

    $('addBtn')?.addEventListener('click', openNewMovement);
    $('cancelNew')?.addEventListener('click', () => closeModal($('newDlg')));
    $('newKind')?.addEventListener('change', () => updateCategoryOptions('new'));

    $('newForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const descInput = $('newDesc');
        const amountInput = $('newAmount');
        const dateInput = $('newDate');

        if (!validateRequiredFields($('newForm'), [descInput, amountInput, dateInput])) return;

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            amountInput.classList.add('input-error');
            amountInput.focus();
            return;
        }

        movements.unshift({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            desc: descInput.value.trim(),
            kind: $('newKind').value,
            amount: Math.round(amount * 100) / 100,
            date: dateInput.value,
            category: $('newCategory').value,
            notes: $('newNotes').value.trim()
        });

        persist();
        closeModal($('newDlg'));
        render();
    });

    $('cancelEdit')?.addEventListener('click', () => closeModal($('editDlg')));
    $('editKind')?.addEventListener('change', () => updateCategoryOptions('edit'));

    $('editForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const descInput = $('editDesc');
        const amountInput = $('editAmount');
        const dateInput = $('editDate');

        if (!validateRequiredFields($('editForm'), [descInput, amountInput, dateInput])) return;

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            amountInput.classList.add('input-error');
            amountInput.focus();
            return;
        }

        const item = movements.find(m => m.id === editingId);
        if (item) {
            item.desc = descInput.value.trim();
            item.kind = $('editKind').value;
            item.amount = Math.round(amount * 100) / 100;
            item.date = dateInput.value;
            item.category = $('editCategory').value;
            item.notes = $('editNotes').value.trim();
            persist();
        }

        closeModal($('editDlg'));
        render();
    });

    $('closeDetailBtn')?.addEventListener('click', () => closeModal($('detailDlg')));
    $('detailEditBtn')?.addEventListener('click', () => {
        const movId = $('detailEditBtn')?.dataset.movementId;
        closeModal($('detailDlg'));
        if (movId) editMovement(movId);
    });

    $('editCategoriesBtn')?.addEventListener('click', () => {
        renderConfigCategories();
        openModal($('categoriesDlg'));
    });
    $('closeCategoriesDlg')?.addEventListener('click', () => closeModal($('categoriesDlg')));

    $('openCreateCategoryBtn')?.addEventListener('click', () => {
        $('categoryCreateForm')?.reset();
        $('newCatKind').value = currentCatKind;
        renderIconGrid('iconSelectorGrid', 'newCatIcon', 'Compras');
        clearValidationErrors($('categoryCreateForm'));
        openModal($('categoryCreateDlg'));
    });
    $('cancelCreateCategoryBtn')?.addEventListener('click', () => closeModal($('categoryCreateDlg')));

    $('categoryCreateForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newCatName');
        if (!validateRequiredFields($('categoryCreateForm'), [nameInput])) return;

        const name = nameInput.value.trim();
        const kind = $('newCatKind').value;
        const icon = $('newCatIcon').value || 'Compras';

        if (appConfig.categories[kind].some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Ya existe una categoría con ese nombre en este apartado.');
            return;
        }

        appConfig.colorCounter = (appConfig.colorCounter || 0) + 1;
        const color = `hsl(${(appConfig.colorCounter * 137.508) % 360}, 70%, 50%)`;

        appConfig.categories[kind].push({ name, color, icon });
        persistConfig();
        refreshCategoryUI();
        closeModal($('categoryCreateDlg'));
    });

    $('cancelEditCategoryBtn')?.addEventListener('click', () => closeModal($('categoryEditDlg')));
    $('deleteCategoryBtn')?.addEventListener('click', () => {
        if (!editingCategoryData) return;
        const { kind, index } = editingCategoryData;
        closeModal($('categoryEditDlg'));
        removeCategory(kind, index);
    });

    $('categoryEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingCategoryData) return;

        const nameInput = $('editCatName');
        if (!validateRequiredFields($('categoryEditForm'), [nameInput])) return;

        const newName = nameInput.value.trim();
        const newKind = $('editCatKind').value;
        const newIcon = $('editCatIcon').value || 'Compras';
        const { kind: oldKind, index: oldIndex } = editingCategoryData;
        const oldCat = appConfig.categories[oldKind][oldIndex];

        if (appConfig.categories[newKind].some((c, i) => !(newKind === oldKind && i === oldIndex) && c.name.toLowerCase() === newName.toLowerCase())) {
            alert('Ya existe una categoría con ese nombre en este apartado.');
            return;
        }

        if (oldKind === newKind) {
            oldCat.name = newName;
            oldCat.icon = newIcon;
        } else {
            appConfig.categories[oldKind].splice(oldIndex, 1);
            appConfig.categories[newKind].push({
                name: newName,
                color: oldCat.color || 'var(--secundario)',
                icon: newIcon
            });
        }

        if (oldCat.name !== newName || oldKind !== newKind) {
            movements.forEach(m => {
                if (m.kind === oldKind && m.category === oldCat.name) {
                    m.category = newName;
                    m.kind = newKind;
                }
            });
            persist();
        }

        persistConfig();
        refreshCategoryUI();
        closeModal($('categoryEditDlg'));
    });

    $('cancelNewRemitBtn')?.addEventListener('click', () => closeModal($('remitNewDlg')));
    $('remitNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newRemitName');
        if (!validateRequiredFields($('remitNewForm'), [nameInput])) return;

        const newId = crypto.randomUUID();
        remittancesList.forEach(r => { r.expanded = false; });
        remittancesList.unshift({
            id: newId,
            name: nameInput.value.trim(),
            sendCurr: $('newRemitSendCurr').value,
            recvCurr: $('newRemitRecvCurr').value,
            tc: 3.75,
            commission: 0,
            expanded: true,
            items: []
        });

        persistRemittancesList();
        closeModal($('remitNewDlg'));
        renderRemittancesList();
        scrollCardIntoView($(`remit_box_${newId}`), true);
    });

    $('cancelEditRemitBtn')?.addEventListener('click', () => closeModal($('remitEditDlg')));
    $('remitEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('editRemitName');
        if (!validateRequiredFields($('remitEditForm'), [nameInput])) return;

        const rem = remittancesList.find(r => r.id === editingRemittanceId);
        if (rem) {
            rem.name = nameInput.value.trim();
            rem.sendCurr = $('editRemitSendCurr').value;
            rem.recvCurr = $('editRemitRecvCurr').value;
            persistRemittancesList();
        }

        closeModal($('remitEditDlg'));
        renderRemittancesList();
    });

    $('cancelNewInstallmentBtn')?.addEventListener('click', () => closeModal($('installmentNewDlg')));
    ['newInstFinancedAmount', 'newInstInterestAmount', 'newInstTotalCount'].forEach(id => {
        $(id)?.addEventListener('input', () => autoCalculateInstallment('new'));
    });

    $('installmentNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = readInstallmentForm('new');
        if (!data) return;

        const newId = crypto.randomUUID();
        installmentsPurchases.forEach(p => { p.expanded = false; });
        installmentsPurchases.unshift({
            id: newId,
            ...data,
            expanded: true,
            installments: buildInstallmentsArray(data.totalCount, data.regularAmount, data.finalAmount, data.firstDate)
        });

        persistInstallments();
        closeModal($('installmentNewDlg'));
        renderInstallments();
        scrollCardIntoView($(`purchase_box_${newId}`), true);
    });

    ['editInstFinancedAmount', 'editInstInterestAmount', 'editInstTotalCount'].forEach(id => {
        $(id)?.addEventListener('input', () => autoCalculateInstallment('edit'));
    });

    $('installmentEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const purchase = installmentsPurchases.find(p => p.id === editingInstallmentId);
        if (!purchase) return;

        const data = readInstallmentForm('edit');
        if (!data) return;

        Object.assign(purchase, data, {
            installments: buildInstallmentsArray(data.totalCount, data.regularAmount, data.finalAmount, data.firstDate, purchase.installments)
        });

        persistInstallments();
        closeModal($('installmentEditDlg'));
        renderInstallments();
    });

    $('deleteInstallmentBtn')?.addEventListener('click', () => {
        if (!confirm('¿Eliminar esta compra y todas sus cuotas?')) return;
        installmentsPurchases = installmentsPurchases.filter(p => p.id !== editingInstallmentId);
        persistInstallments();
        closeModal($('installmentEditDlg'));
        renderInstallments();
    });

    $('cancelNewDayCounterMonth')?.addEventListener('click', () => closeModal($('dayCounterMonthNewDlg')));
    $('dayCounterMonthNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newMonthName');
        const targetInput = $('newMonthTarget');

        if (!validateRequiredFields($('dayCounterMonthNewForm'), [nameInput, targetInput])) return;

        const newId = crypto.randomUUID();
        dayCounterMonths.forEach(m => { m.expanded = false; });
        dayCounterMonths.unshift({
            id: newId,
            name: nameInput.value.trim(),
            targetDays: parseInt(targetInput.value) || 15,
            expanded: true,
            days: []
        });

        persistDayCounter();
        closeModal($('dayCounterMonthNewDlg'));
        renderDayCounter();
        scrollCardIntoView($(`dc_month_box_${newId}`), true);
    });

    $('cancelEditDayCounterMonth')?.addEventListener('click', () => closeModal($('dayCounterMonthEditDlg')));
    $('dayCounterMonthEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('editMonthName');
        const targetInput = $('editMonthTarget');

        if (!validateRequiredFields($('dayCounterMonthEditForm'), [nameInput, targetInput])) return;

        const month = dayCounterMonths.find(m => m.id === editingMonthId);
        if (month) {
            month.name = nameInput.value.trim();
            month.targetDays = parseInt(targetInput.value) || 15;
            persistDayCounter();
        }

        closeModal($('dayCounterMonthEditDlg'));
        renderDayCounter();
    });

    $('copyPreviousDayBtn')?.addEventListener('click', copyLastDayData);
    $('dayDate')?.addEventListener('change', (e) => {
        $('dayNameDisplay').value = getDayNameFromDate(e.target.value);
    });
    $('dayEntryTime')?.addEventListener('change', (e) => {
        if (e.target.value) $('dayExitTime').value = calculateExitTime(e.target.value);
    });

    const closeDayModal = () => closeModal($('dayCounterDayDlg'));
    $('cancelDayCounterDay')?.addEventListener('click', closeDayModal);
    $('cancelDayCounterDayNormal')?.addEventListener('click', closeDayModal);

    $('deleteDayModalBtn')?.addEventListener('click', () => {
        if (!confirm('¿Eliminar este registro de día?')) return;
        const month = dayCounterMonths.find(m => m.id === editingDayMonthId);
        if (month && editingDayIndex !== null) {
            month.days.splice(editingDayIndex, 1);
            persistDayCounter();
            renderDayCounter();
        }
        closeModal($('dayCounterDayDlg'));
    });

    $('dayCounterDayForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateInput = $('dayDate');
        const entryInput = $('dayEntryTime');
        const exitInput = $('dayExitTime');
        const locInput = $('dayLocation');

        if (!validateRequiredFields($('dayCounterDayForm'), [dateInput, entryInput, exitInput, locInput])) return;

        const month = dayCounterMonths.find(m => m.id === editingDayMonthId);
        if (!month) return;

        const dayData = {
            date: dateInput.value,
            dayName: getDayNameFromDate(dateInput.value),
            entryTime: entryInput.value,
            exitTime: exitInput.value,
            location: locInput.value.trim()
        };

        if (editingDayIndex !== null && month.days[editingDayIndex]) {
            const duplicateOnEdit = month.days.some((d, idx) => idx !== editingDayIndex && d.date === dayData.date);
            if (duplicateOnEdit) {
                const ok = confirm(`El día ${formatDateEs(dayData.date)} ya está registrado. ¿Deseas registrarlo nuevamente?`);
                if (!ok) return;
            }
            month.days[editingDayIndex] = dayData;
        } else {
            const alreadyRegistered = month.days.some(d => d.date === dayData.date);
            if (alreadyRegistered) {
                const ok = confirm(`El día ${formatDateEs(dayData.date)} ya está registrado. ¿Deseas registrarlo nuevamente?`);
                if (!ok) return;
            }
            month.days.push(dayData);
        }

        month.days.sort((a, b) => b.date.localeCompare(a.date));
        persistDayCounter();
        closeModal($('dayCounterDayDlg'));
        renderDayCounter();
    });

    $('cancelExportBtn')?.addEventListener('click', () => closeModal($('exportDlg')));
    $('exportForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        executeCustomExport();
    });

    $('csvFileInput')?.addEventListener('change', importMovementsCsv);
    $('cancelImportSelect')?.addEventListener('click', () => {
        pendingParsedSections = null;
        closeModal($('importSelectDlg'));
    });

    $('importSelectForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        applyImportSelection({
            movements: $('impSelectMovs')?.checked,
            remittances: $('impSelectRemit')?.checked,
            installments: $('impSelectInst')?.checked,
            dayCounter: $('impSelectDays')?.checked
        });
    });

    window.addEventListener('resize', () => {
        if (activeAppSection === 'financeManager') {
            render();
        }
    });

    const scrollTimeouts = new WeakMap();

    document.addEventListener('scroll', (e) => {
        const target = e.target?.closest?.('.table-wrapper, .cat-breakdown-list, .category-manager-list, .installment-installments-list-compras, .dc-days-wrapper');
        if (!target) return;

        target.classList.add('is-scrolling');
        if (scrollTimeouts.has(target)) {
            clearTimeout(scrollTimeouts.get(target));
        }
        const timeoutId = setTimeout(() => {
            target.classList.remove('is-scrolling');
            scrollTimeouts.delete(target);
        }, 800);
        scrollTimeouts.set(target, timeoutId);
    }, true);
}

function init() {
    activeAppSection = getInitialSectionFromConfig();
    syncSectionUtilitiesFlag(activeAppSection);

    applyTheme();
    applyUtilitiesVisibility();
    updateCurrencyLabels();
    setupCategoryTabs();
    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateFilterButtonIndicator();
    updateActiveFilterCaption();
    bindDelegatedEvents();
    bindEvents();
    render();
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();
}

init();
