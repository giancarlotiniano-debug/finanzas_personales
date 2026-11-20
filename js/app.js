/* Finanzas personales — lógica de la aplicación */

const $ = (id) => document.getElementById(id);

/* ==========================================
   0. MAPA MAESTRO DE ICONOS SVG PARA CATEGORÍAS
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
    "Bolsa de dinero": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 6.5C8 5.2 7.5 4 7.5 3.2A1.2 1.2 0 0 1 8.7 2h6.6a1.2 1.2 0 0 1 1.2 1.2c0 .8-.5 2-2 3.3M9.5 6.5h5M9.5 6.5C5.5 8.5 3.5 13 3.5 17a5 5 0 0 0 5 5h7a5 5 0 0 0 5-5c0-4-2-8.5-6-10.5M14.2 11.2a2.2 2.2 0 0 0-2-.7h-.7a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1a2.2 2.2 0 0 1-2-.8M12 9v1.5m0 8V20"/></svg>`,
};

const warningIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`;

/* ==========================================
   1. ESTADO Y CONFIGURACIÓN GLOBAL
   ========================================== */
const DEFAULT_CONFIG = {
    userName: 'Invitado',
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
            { name: 'Suscripciones', color: '#b87114', icon: 'Pantalla' },
        ],
        income: [
            { name: 'Salario', color: '#22c55e', icon: 'Billetera' },
            { name: 'Ingresos extra', color: '#528800', icon: 'Ingresos' },
            { name: 'Devoluciones', color: '#0ea5e9', icon: 'Devolver' }
        ]
    }
};

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
let currentCatKind = 'expense';
let selectedDonutCategory = null;
let lastAccordionToggleAt = 0;
let currentUsageText = 'Sin movimientos en este mes';

const today = new Date();
const pad = (number) => String(number).padStart(2, '0');
const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

const SPANISH_MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const WEEKDAY_LABELS_MON = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

let movementFilters = {
    query: '',
    kind: 'all', // 'all' | 'expense' | 'income'
    category: 'all', // 'all' o nombre de categoría
    dateMode: 'month', // 'day' | 'week' | 'month' | 'year' | 'custom'
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null
};

let filterDraft = {
    kind: 'all',
    dateMode: 'month',
    pickerOpen: false,
    startDate: '',
    endDate: '',
    anchorDate: '',
    calYear: today.getFullYear(),
    calMonth: today.getMonth(), // 0-11
    pickerYear: today.getFullYear(),
    pickerMonth: today.getMonth() // 0-11
};

const utilityAccordionConfig = [
    { btnId: 'toggleRemitBtn', containerId: 'remitContainer', iconId: 'toggleRemitIcon', cardEl: 'remittancesCard' },
    { btnId: 'toggleInstallmentsBtn', containerId: 'installmentsContainer', iconId: 'toggleInstallmentsIcon', cardEl: 'installmentsCard' },
    { btnId: 'toggleDayCounterBtn', containerId: 'dayCounterContainer', iconId: 'toggleDayCounterIcon', cardEl: 'dayCounterCard' }
];

function setFinanceViewMode(mode) {
    activeFinanceViewMode = mode === 'categories' ? 'categories' : 'movements'; //[cite: 11]
    selectedDonutCategory = null; //[cite: 11]

    const btnMov = $('switchModeMovements'); //[cite: 11]
    const btnCat = $('switchModeCategories'); //[cite: 11]
    const titleEl = $('activeViewTitle'); //[cite: 11]
    const movContainer = $('movementsContainer'); //[cite: 11]
    const catContainer = $('categoriesContainer'); //[cite: 11]
    const editCatsBtn = $('editCategoriesBtn'); //[cite: 11]
    const addBtn = $('addBtn'); //[cite: 11]

    const isCategories = activeFinanceViewMode === 'categories'; //[cite: 11]

    btnMov?.classList.toggle('active', !isCategories); //[cite: 11]
    btnMov?.setAttribute('aria-selected', String(!isCategories)); //[cite: 11]

    btnCat?.classList.toggle('active', isCategories); //[cite: 11]
    btnCat?.setAttribute('aria-selected', String(isCategories)); //[cite: 11]

    if (titleEl) {
        titleEl.textContent = isCategories ? 'Categorías' : 'Movimientos'; //[cite: 11]
    }

    movContainer?.classList.toggle('is-hidden', isCategories); //[cite: 11]
    catContainer?.classList.toggle('is-hidden', !isCategories); //[cite: 11]
    editCatsBtn?.classList.toggle('is-hidden', !isCategories); //[cite: 11]
    addBtn?.classList.toggle('is-hidden', isCategories); //[cite: 11]

    render(); //[cite: 11]
}

/* ==========================================
   2. UTILIDADES DE FORMATO, FECHAS Y MODALES
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
    let s = String(rawValue).replace(/S\/\.|[€$A-Za-z\s]/g, '').trim();

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

function openModal(dialogEl) {
    if (!dialogEl) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('no-scroll');
    dialogEl.showModal();
}

function closeModal(dialogEl) {
    if (!dialogEl) return;
    dialogEl.close();
    document.body.classList.remove('no-scroll');
}

/* ==========================================
   3. PERSISTENCIA Y CONFIGURACIÓN UI
   ========================================== */
const persist = () => localStorage.setItem('finanzas_movimientos_v1', JSON.stringify(movements));
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

const applyTheme = () => document.body.classList.toggle('dark-mode', appConfig.theme === 'dark');

function applyUtilitiesVisibility() {
    const utils = appConfig.utilities || { financeManager: true, remittances: true, installments: true, dayCounter: true };
    const showFinance = utils.financeManager !== false;
    const showRemit = utils.remittances !== false;
    const showInst = utils.installments !== false;
    const showDays = utils.dayCounter !== false;

    const financeLayout = $('financeManagerLayout');
    if (financeLayout) {
        financeLayout.style.display = showFinance ? '' : 'none';
        financeLayout.style.marginBottom = showFinance ? '26px' : '0px';
    }

    if ($('remittancesCard')) $('remittancesCard').style.display = showRemit ? '' : 'none';
    if ($('installmentsCard')) $('installmentsCard').style.display = showInst ? '' : 'none';
    if ($('dayCounterCard')) $('dayCounterCard').style.display = showDays ? '' : 'none';
    if ($('utilitiesSection')) $('utilitiesSection').style.display = (showRemit || showInst || showDays) ? '' : 'none';
}

function updateUserDisplay() {
    if ($('welcomeText')) $('welcomeText').textContent = `Bienvenido, ${appConfig.userName}.`;
    if ($('userInitial')) $('userInitial').textContent = appConfig.userName.charAt(0) || 'I';
}

function updateCurrencyLabels() {
    const symbol = getCurrencySymbol(appConfig.currency);
    if ($('newAmountLabel')) $('newAmountLabel').textContent = `Importe (${symbol})`;
    if ($('editAmountLabel')) $('editAmountLabel').textContent = `Importe (${symbol})`;
    if ($('filterCurrMin')) $('filterCurrMin').textContent = symbol;
    if ($('filterCurrMax')) $('filterCurrMax').textContent = symbol;
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
        if (!stillExists) movementFilters.category = 'all';
    }
    updateFilterButtonIndicator();
    render();
}

function collapseAllInternalCards() {
    if (remittancesList.some(r => r.expanded)) {
        remittancesList.forEach(r => { r.expanded = false; });
        persistRemittancesList();
        renderRemittancesList();
    }

    if (installmentsPurchases.some(p => p.expanded)) {
        installmentsPurchases.forEach(p => { p.expanded = false; });
        persistInstallments();
        renderInstallments();
    }

    if (dayCounterMonths.some(m => m.expanded)) {
        dayCounterMonths.forEach(m => { m.expanded = false; });
        persistDayCounter();
        renderDayCounter();
    }
}

function toggleUtilityAccordionById(containerId, iconId, cardId) {
    const now = Date.now();
    if (now - lastAccordionToggleAt < 180) return;
    lastAccordionToggleAt = now;

    const container = $(containerId);
    const icon = $(iconId);
    const card = $(cardId);
    if (!container) return;

    const willBeExpanded = container.style.display !== 'block';

    utilityAccordionConfig.forEach(item => {
        const c = $(item.containerId);
        const ic = $(item.iconId);
        const cr = $(item.cardEl);
        if (c && c !== container) {
            c.style.display = 'none';
            cr?.classList.remove('expanded');
            if (ic) ic.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
        }
    });

    container.style.display = willBeExpanded ? 'block' : 'none';
    card?.classList.toggle('expanded', willBeExpanded);
    if (icon) {
        icon.innerHTML = willBeExpanded
            ? '<polyline points="18 15 12 9 6 15"></polyline>'
            : '<polyline points="6 9 12 15 18 9"></polyline>';
    }

    collapseAllInternalCards();

    if (willBeExpanded && card && window.innerWidth <= 760) {
        requestAnimationFrame(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

function setupUtilityAccordion(btnId, containerId, iconId, cardId) {
    const btn = $(btnId);
    const card = $(cardId);
    const container = $(containerId);
    const heading = card?.querySelector('.section-heading');

    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleUtilityAccordionById(containerId, iconId, cardId);
    });

    heading?.addEventListener('click', (e) => {
        if (e.target.closest('button, input, select, textarea, a, label')) return;
        toggleUtilityAccordionById(containerId, iconId, cardId);
    });

    container?.addEventListener('click', (e) => e.stopPropagation());
}

/* ==========================================
   4. EXPORTAR E IMPORTAR CSV MULTI-SECCIÓN
   ========================================== */
const csvQuote = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

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

const unquoteCsv = (val) => String(val || '').replace(/^"|"$/g, '').replace(/""/g, '"');

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

let pendingParsedSections = null;

function importMovementsCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const lines = e.target.result.split(/\r\n|\n/);
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
                m.days.sort((a, b) => a.date.localeCompare(b.date));
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
   5. MOVIMIENTOS, FILTROS (DÍA/SEMANA/MES/AÑO/RANGO), BARRA DE USO Y CATEGORÍAS
   ========================================== */
function getMonthBounds(monthStr) {
    const [y, m] = (monthStr || currentMonth).split('-').map(Number);
    const firstDay = `${y}-${pad(m)}-01`;
    const lastDayNum = new Date(y, m, 0).getDate();
    const lastDay = `${y}-${pad(m)}-${pad(lastDayNum)}`;
    return { start: firstDay, end: lastDay };
}

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
    return {
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`
    };
}

function getMondayToSundayWeekRange(isoDateStr) {
    const parts = parseIsoParts(isoDateStr) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };
    const jsDay = new Date(parts.y, parts.m - 1, parts.d).getDay(); // 0=Dom, 1=Lun ... 6=Sáb
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
    for (let y = 1990; y <= 2050; y++) {
        years.add(y);
    }
    movements.forEach(m => {
        const y = Number(String(m.date || '').slice(0, 4));
        if (y) years.add(y);
    });
    const pickerY = Number(filterDraft.pickerYear);
    if (pickerY) years.add(pickerY);
    return Array.from(years).sort((a, b) => a - b);
}

function computeRangeForMode(mode, seedDateStr, yearVal, monthZeroBased) {
    const safeSeed = seedDateStr || toIsoDateLocal(today);
    const seedParts = parseIsoParts(safeSeed) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };

    if (mode === 'day') {
        return { startDate: safeSeed, endDate: safeSeed, anchorDate: safeSeed };
    }
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
            if (activeOpt) {
                activeOpt.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
        });
    });
}

function renderFilterDatePanel() {
    const panel = $('filterDatePickerPanel');
    if (!panel) return;

    document.querySelectorAll('#filterDlg .filter-date-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.dateMode === filterDraft.dateMode);
    });

    if (!filterDraft.pickerOpen) {
        panel.classList.add('is-hidden');
        panel.innerHTML = '';
        return;
    }

    panel.classList.remove('is-hidden');

    if (filterDraft.dateMode === 'day' || filterDraft.dateMode === 'week') {
        const { calYear, calMonth, anchorDate, startDate, endDate } = filterDraft;
        const firstOfMonth = new Date(calYear, calMonth, 1);
        const startOffset = (firstOfMonth.getDay() + 6) % 7; // 0 = Lunes
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
    filterDraft.pickerOpen = true;

    if (newMode === 'day' || newMode === 'week') {
        const curYear = today.getFullYear();
        const curMonth = today.getMonth();
        const curDay = today.getDate();
        const seedIso = toIsoFromParts(curYear, curMonth, curDay);

        filterDraft.calYear = curYear;
        filterDraft.calMonth = curMonth;
        filterDraft.pickerYear = curYear;
        filterDraft.pickerMonth = curMonth;

        const computed = computeRangeForMode(newMode, seedIso, curYear, curMonth);
        filterDraft.startDate = computed.startDate;
        filterDraft.endDate = computed.endDate;
        filterDraft.anchorDate = computed.anchorDate;
    } else {
        const refParts = parseIsoParts(filterDraft.startDate || filterDraft.anchorDate) || {
            y: today.getFullYear(),
            m: today.getMonth() + 1,
            d: today.getDate()
        };
        filterDraft.calYear = refParts.y;
        filterDraft.calMonth = refParts.m - 1;
        filterDraft.pickerYear = refParts.y;
        filterDraft.pickerMonth = refParts.m - 1;

        const computed = computeRangeForMode(
            newMode,
            filterDraft.anchorDate || toIsoDateLocal(today),
            filterDraft.pickerYear,
            filterDraft.pickerMonth
        );
        filterDraft.startDate = computed.startDate;
        filterDraft.endDate = computed.endDate;
        filterDraft.anchorDate = computed.anchorDate;
    }

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

function updateFilterButtonIndicator() {
    const btn = $('openFilterBtn');
    if (!btn) return;

    const bounds = getMonthBounds(currentMonth);
    const isDefaultMonth =
        (movementFilters.dateMode === 'month' && movementFilters.startDate === bounds.start && movementFilters.endDate === bounds.end) ||
        (!movementFilters.startDate && !movementFilters.endDate && movementFilters.dateMode === 'month');

    const isCustom =
        Boolean(movementFilters.query.trim()) ||
        movementFilters.kind !== 'all' ||
        movementFilters.category !== 'all' ||
        !isDefaultMonth ||
        movementFilters.minAmount !== null ||
        movementFilters.maxAmount !== null;

    btn.classList.toggle('has-active-filters', isCustom);
}

function openFilterDialog() {
    const symbol = getCurrencySymbol(appConfig.currency);
    if ($('filterCurrMin')) $('filterCurrMin').textContent = symbol;
    if ($('filterCurrMax')) $('filterCurrMax').textContent = symbol;

    if ($('filterSearchInput')) $('filterSearchInput').value = movementFilters.query || '';

    const bounds = getMonthBounds(currentMonth);
    const activeStart = movementFilters.startDate || bounds.start;
    const activeEnd = movementFilters.endDate || bounds.end;
    const refParts = parseIsoParts(activeStart) || {
        y: today.getFullYear(),
        m: today.getMonth() + 1,
        d: today.getDate()
    };

    filterDraft = {
        kind: movementFilters.kind || 'all',
        dateMode: movementFilters.dateMode || 'month',
        pickerOpen: false,
        startDate: activeStart,
        endDate: activeEnd,
        anchorDate: activeStart,
        calYear: refParts.y,
        calMonth: refParts.m - 1,
        pickerYear: refParts.y,
        pickerMonth: refParts.m - 1
    };

    syncFilterUIState(filterDraft.kind);
    populateFilterCategorySelect(filterDraft.kind, movementFilters.category);
    renderFilterDatePanel();

    if ($('filterMinAmount')) {
        $('filterMinAmount').value = movementFilters.minAmount !== null
            ? String(movementFilters.minAmount).replace('.', ',')
            : '';
    }
    if ($('filterMaxAmount')) {
        $('filterMaxAmount').value = movementFilters.maxAmount !== null
            ? String(movementFilters.maxAmount).replace('.', ',')
            : '';
    }

    openModal($('filterDlg'));
}

function resetFilterDialogToDefault() {
    const bounds = getMonthBounds(currentMonth);
    movementFilters = {
        query: '',
        kind: 'all',
        category: 'all',
        dateMode: 'month',
        startDate: bounds.start,
        endDate: bounds.end,
        minAmount: null,
        maxAmount: null
    };
    updateFilterButtonIndicator();
    closeModal($('filterDlg'));
    render();
}

function getFilteredMovements() {
    const query = (movementFilters.query || '').trim().toLowerCase();
    const bounds = getMonthBounds(currentMonth);
    const startRange = movementFilters.startDate || bounds.start;
    const endRange = movementFilters.endDate || bounds.end;

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
    if (barEl.classList.contains('show-percentage')) {
        tooltipEl.textContent = currentUsageText;
    }
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

function setupCategoryTabs() {
    const btnExpense = $('catTabExpense');
    const btnIncome = $('catTabIncome');
    if (!btnExpense || !btnIncome) return;

    const switchTab = (kind) => {
        currentCatKind = kind;
        selectedDonutCategory = null;
        btnExpense.classList.toggle('active', kind === 'expense');
        btnIncome.classList.toggle('active', kind === 'income');
        renderCategoriesRedesign();
    };

    btnExpense.addEventListener('click', () => switchTab('expense'));
    btnIncome.addEventListener('click', () => switchTab('income'));
}

function toggleDonutSegment(categoryName) {
    selectedDonutCategory = (selectedDonutCategory === categoryName) ? null : categoryName;
    renderCategoriesRedesign();
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

function renderCategoriesRedesign(sourceMovements = getFilteredMovements()) {
    const activeMovements = sourceMovements.filter(item => item.kind === currentCatKind);

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
    }
}

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

        rowsHtml += `
            <tr class="movement-row ${borderClass}">
                <td>
                    <div class="movement-name-wrapper">
                        <span class="category-icon-wrapper" style="color: ${catColor};">${iconSvg}</span>
                        <span class="movement-title">${escapeHtml(item.desc)}</span>
                    </div>
                </td>
                <td class="text-right">
                    <span class="category-text">${escapeHtml(item.category)}</span>
                </td>
                <td class="amount ${item.kind === 'income' ? 'income' : 'expense'}">
                    ${item.kind === 'income' ? '+' : '−'}${formatMoney(item.amount)}
                </td>
                <td>
                    <div class="actions">
                        <button class="editar-movimiento" data-edit="${item.id}" title="Editar" aria-label="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    $('rows').innerHTML = rowsHtml;
    $('empty').style.display = visibleMovements.length ? 'none' : 'block';

    if (activeFinanceViewMode === 'categories') {
        renderCategoriesRedesign(visibleMovements);
    }
}

/* ==========================================
   6. GESTOR DE REMESAS
   ========================================== */
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

                <div id="remit_details_${rem.id}" class="installment-installments-list remit-details-body" style="display: ${rem.expanded ? 'flex' : 'none'};">
                    <div class="remit-tc-row">
                        <span class="remit-tc-label">Tipo de cambio:</span>
                        <input type="text" class="remit-tc-input remit-input-num" data-remit-id="${rem.id}" value="${formattedTc}" placeholder="0,00" inputmode="decimal" enterkeyhint="done">
                    </div>

                    <div class="remit-items-wrapper">
                        ${itemsHtml || '<div class="empty empty-mini">Sin conceptos añadidos.</div>'}
                    </div>

                    <div class="remit-new-row">
                        <input type="text" id="new_concept_input_${rem.id}" placeholder="Nuevo concepto" class="remit-new-input remit-concept-field" data-remit-id="${rem.id}" enterkeyhint="done">
                        <button type="button" class="remit-add-btn" data-action="add-remit-item" data-remit-id="${rem.id}">Añadir</button>
                    </div>

                    <div class="remit-totals-box">
                        <div class="remit-total-line">
                            <span class="remit-total-label">Total a enviar:</span>
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
   7. GESTOR DE CUOTAS
   ========================================== */
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
                    <span class="installment-row-date">Fecha: ${formatDateEs(inst.date)}</span>
                </div>
                <div class="installment-row-right">
                    <span class="installment-row-amount">${formatCurrencyCustom(inst.amount, curr)}</span>
                    <input type="checkbox" class="installment-checkbox" ${inst.paid ? 'checked' : ''} data-action="toggle-inst-paid" data-purchase-id="${purchase.id}" data-inst-number="${inst.number}" title="Marcar como pagado">
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card ${purchase.expanded ? 'is-open' : ''}" id="purchase_box_${purchase.id}">
                <div class="installment-purchase-header ${allPaid ? 'all-paid' : ''}" data-action="toggle-inst-accordion" data-purchase-id="${purchase.id}">
                    <div class="flex-col">
                        <span class="installment-card-title">${escapeHtml(purchase.name)}</span>
                        <span class="installment-card-subtitle">Total: ${formatCurrencyCustom(purchase.totalAmount, curr)} (${totalPaidCount}/${purchase.totalCount} pagadas)</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="editbutton-xs" data-action="edit-inst-purchase" data-purchase-id="${purchase.id}" title="Editar compra" aria-label="Editar compra">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div id="inst_details_${purchase.id}" class="installment-installments-list" style="display: ${purchase.expanded ? 'flex' : 'none'};">
                    ${installmentsHtml}
                </div>
            </div>
        `;
    }).join('');
}

function toggleInstallmentAccordion(purchaseId) {
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
    const currentScrollTop = $(`inst_details_${purchaseId}`)?.scrollTop || 0;
    renderInstallments();
    const updatedListEl = $(`inst_details_${purchaseId}`);
    if (updatedListEl) updatedListEl.scrollTop = currentScrollTop;
}

function deleteInstallmentPurchase(purchaseId) {
    if (!confirm('¿Eliminar esta compra en cuotas y todo su historial?')) return;
    installmentsPurchases = installmentsPurchases.filter(p => p.id !== purchaseId);
    persistInstallments();
    closeModal($('installmentEditDlg'));
    renderInstallments();
}

function editInstallmentPurchase(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    editingInstallmentId = purchaseId;
    $('editInstName').value = purchase.name;
    $('editInstCurrency').value = purchase.currency || 'EUR';
    $('editInstFinancedAmount').value = purchase.financedAmount || purchase.totalAmount;
    $('editInstInterestAmount').value = purchase.interestAmount || '';
    $('editInstTotalAmount').value = purchase.totalAmount;
    $('editInstTotalCount').value = purchase.totalCount;
    $('editInstRegularAmount').value = purchase.regularAmount;
    $('editInstFinalAmount').value = purchase.finalAmount || '';
    $('editInstFirstDate').value = purchase.firstDate;

    if ($('deleteInstallmentBtn')) $('deleteInstallmentBtn').onclick = () => deleteInstallmentPurchase(editingInstallmentId);
    clearValidationErrors($('installmentEditForm'));
    openModal($('installmentEditDlg'));
}

/* ==========================================
   8. CONTADOR DE DÍAS
   ========================================== */
function renderDayCounter() {
    const listContainer = $('dayCounterMonthsList');
    if (!listContainer) return;

    const addMonthBtn = $('addDayCounterMonthBtn');
    if (addMonthBtn?.parentElement) {
        addMonthBtn.parentElement.style.display = dayCounterMonths.some(m => m.expanded) ? 'none' : 'flex';
    }

    if (!dayCounterMonths.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay meses registrados.</div>';
        return;
    }

    listContainer.innerHTML = dayCounterMonths.map((month) => {
        const totalWorked = (month.days || []).length;
        const extras = Math.max(0, totalWorked - (month.targetDays || 0));

        const daysHtml = (month.days || []).map((day, idx) => `
            <div class="dc-day-row">
                <div class="dc-day-left">
                    <span class="dc-day-name">${escapeHtml(day.dayName)}</span>
                    <span class="dc-day-date">${formatDateEs(day.date)}</span>
                </div>
                <div class="dc-day-middle">
                    <span class="dc-day-time">${escapeHtml(day.entryTime)} — ${escapeHtml(day.exitTime)}</span>
                    <span class="dc-day-loc">${escapeHtml(day.location)}</span>
                </div>
                <div class="dc-day-right">
                    <button type="button" class="editbutton-xs" data-action="edit-dc-day" data-month-id="${month.id}" data-index="${idx}" title="Editar día" aria-label="Editar día">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card ${month.expanded ? 'is-open' : ''}" id="dc_month_box_${month.id}">
                <div class="installment-purchase-header" data-action="toggle-dc-month" data-month-id="${month.id}">
                    <div class="flex-col">
                        <span class="installment-card-title">${escapeHtml(month.name)}</span>
                        <span class="installment-card-subtitle">Días trabajados: ${totalWorked} • Días extras: ${extras}</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="editbutton-xs" data-action="edit-dc-month" data-month-id="${month.id}" title="Editar mes" aria-label="Editar mes">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primario)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div id="dc_month_details_${month.id}" class="installment-installments-list" style="display: ${month.expanded ? 'flex' : 'none'};">
                    <div class="dc-days-wrapper">
                        ${daysHtml || '<div class="empty empty-mini">Sin días registrados en este mes.</div>'}
                    </div>
                    <div class="utility-footer-action" style="margin-top: 0;">
                        <button type="button" class="day-newbutton" data-action="open-add-dc-day" data-month-id="${month.id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Nuevo día
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function toggleDayCounterMonthAccordion(monthId) {
    const month = dayCounterMonths.find(x => x.id === monthId);
    if (!month) return;

    const willBeExpanded = !month.expanded;
    dayCounterMonths.forEach(m => { m.expanded = m.id === monthId ? willBeExpanded : false; });
    persistDayCounter();
    renderDayCounter();

    if (willBeExpanded) {
        const daysWrapper = document.querySelector(`#dc_month_details_${monthId} .dc-days-wrapper`);
        if (daysWrapper) daysWrapper.scrollTop = daysWrapper.scrollHeight;
        scrollCardIntoView($(`dc_month_box_${monthId}`), true);
    }
}

/* ==========================================
   9. MODALES Y CATEGORÍAS
   ========================================== */
function openNewMovement() {
    editingId = null;
    $('newForm')?.reset();
    if ($('newKind')) $('newKind').value = 'expense';
    updateCategoryOptions('new');
    if ($('newDate')) {
        $('newDate').value = `${currentMonth}-${pad(today.getDate())}`;
    }
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
                        <span class="category-icon-wrapper" style="color: ${cat.color}; width: 28px; height: 28px;">${iconSvg}</span>
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
   10. REGISTRO DE LISTENERS E INICIALIZACIÓN
   ========================================== */
function bindEvents() {
    utilityAccordionConfig.forEach(item => {
        setupUtilityAccordion(item.btnId, item.containerId, item.iconId, item.cardEl);
    });

    setupCategoryTabs();

    $('switchModeMovements')?.addEventListener('click', () => setFinanceViewMode('movements'));
    $('switchModeCategories')?.addEventListener('click', () => setFinanceViewMode('categories'));

    /* --- Modal de Filtros --- */
    $('openFilterBtn')?.addEventListener('click', openFilterDialog);
    $('cancelFilterBtn')?.addEventListener('click', () => closeModal($('filterDlg')));
    $('resetFiltersBtn')?.addEventListener('click', resetFilterDialogToDefault);

    document.querySelectorAll('#filterDlg .filter-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterDraft.kind = btn.dataset.filterKind;
            syncFilterUIState(filterDraft.kind);
            populateFilterCategorySelect(filterDraft.kind, 'all');
        });
    });

    document.querySelectorAll('#filterDlg .filter-date-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            handleFilterDateTabClick(tab.dataset.dateMode);
        });
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
            if (parts) {
                filterDraft.calYear = parts.y;
                filterDraft.calMonth = parts.m - 1;
                filterDraft.pickerYear = parts.y;
                filterDraft.pickerMonth = parts.m - 1;
            }
            const computed = computeRangeForMode(filterDraft.dateMode, iso, filterDraft.pickerYear, filterDraft.pickerMonth);
            filterDraft.startDate = computed.startDate;
            filterDraft.endDate = computed.endDate;
            filterDraft.anchorDate = computed.anchorDate;
            renderFilterDatePanel();
            return;
        }

        const monthBtn = e.target.closest('[data-pick-month]');
        if (monthBtn) {
            filterDraft.pickerMonth = Number(monthBtn.dataset.pickMonth);
            const computed = computeRangeForMode('month', filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth);
            filterDraft.startDate = computed.startDate;
            filterDraft.endDate = computed.endDate;
            renderFilterDatePanel();
            return;
        }

        const yearBtn = e.target.closest('[data-pick-year]');
        if (yearBtn) {
            filterDraft.pickerYear = Number(yearBtn.dataset.pickYear);
            const computed = computeRangeForMode(filterDraft.dateMode, filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth);
            filterDraft.startDate = computed.startDate;
            filterDraft.endDate = computed.endDate;
            renderFilterDatePanel();
        }
    });

    $('filterDatePickerPanel')?.addEventListener('change', (e) => {
        if (e.target.id === 'filterStartDate') {
            filterDraft.startDate = e.target.value;
        } else if (e.target.id === 'filterEndDate') {
            filterDraft.endDate = e.target.value;
        }
    });

    $('filterForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawMin = $('filterMinAmount')?.value.trim() || '';
        const rawMax = $('filterMaxAmount')?.value.trim() || '';

        let finalStart = filterDraft.startDate;
        let finalEnd = filterDraft.endDate;
        if (filterDraft.dateMode === 'custom') {
            finalStart = $('filterStartDate')?.value || '';
            finalEnd = $('filterEndDate')?.value || '';
            if (finalStart && finalEnd && finalStart > finalEnd) {
                [finalStart, finalEnd] = [finalEnd, finalStart];
            }
        }

        movementFilters = {
            query: $('filterSearchInput')?.value.trim() || '',
            kind: filterDraft.kind,
            category: filterDraft.kind === 'all' ? 'all' : ($('filterCategorySelect')?.value || 'all'),
            dateMode: filterDraft.dateMode,
            startDate: finalStart,
            endDate: finalEnd,
            minAmount: rawMin ? parseInputNumber(rawMin) : null,
            maxAmount: rawMax ? parseInputNumber(rawMax) : null
        };

        updateFilterButtonIndicator();
        closeModal($('filterDlg'));
        render();
    });

    const usageBar = $('cashflowUsageBar');
    if (usageBar) {
        usageBar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCashflowUsageTooltip();
        });
        usageBar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCashflowUsageTooltip();
            }
        });
    }

    document.addEventListener('click', (e) => {
        const barEl = $('cashflowUsageBar');
        if (barEl?.classList.contains('show-percentage') && !e.target.closest('#cashflowUsageBar')) {
            toggleCashflowUsageTooltip(false);
        }
    });

    $('openExportDlgBtn')?.addEventListener('click', () => {
        ['expMovements', 'expRemittances', 'expInstallments', 'expDayCounter'].forEach(id => {
            if ($(id)) $(id).checked = false;
        });
        openModal($('exportDlg'));
    });

    $('cancelExportBtn')?.addEventListener('click', () => closeModal($('exportDlg')));

    $('exportForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        executeCustomExport();
    });

    $('importCsvBtn')?.addEventListener('click', () => $('csvFileInput')?.click());
    $('csvFileInput')?.addEventListener('change', importMovementsCsv);

    $('importSelectForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        applyImportSelection({
            movements: $('impSelectMovs')?.checked || false,
            remittances: $('impSelectRemit')?.checked || false,
            installments: $('impSelectInst')?.checked || false,
            dayCounter: $('impSelectDays')?.checked || false
        });
    });

    $('cancelImportSelect')?.addEventListener('click', () => {
        pendingParsedSections = null;
        closeModal($('importSelectDlg'));
    });

    $('catChartWrapper')?.addEventListener('click', (e) => {
        const segment = e.target.closest('[data-donut-category]');
        if (segment) toggleDonutSegment(segment.dataset.donutCategory);
    });

    if ($('categories')) {
        $('categories').addEventListener('click', (e) => {
            const item = e.target.closest('[data-list-category]');
            if (item) {
                toggleDonutSegment(item.dataset.listCategory);
                setTimeout(() => {
                    if (document.activeElement && document.activeElement.closest('#categories')) {
                        document.activeElement.blur();
                    }
                }, 0);
            }
        });

        $('categories').addEventListener('keydown', (e) => {
            const item = e.target.closest('[data-list-category]');
            if (item && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleDonutSegment(item.dataset.listCategory);
            }
        });
    }

    $('categoriesContainer')?.addEventListener('click', (e) => {
        if (!selectedDonutCategory) return;

        const clickedSegment = e.target.closest('[data-donut-category]');
        const clickedListItem = e.target.closest('[data-list-category]');
        const clickedBadge = e.target.closest('.cat-floating-badge');

        if (!clickedSegment && !clickedListItem && !clickedBadge) {
            selectedDonutCategory = null;
            renderCategoriesRedesign();
        }
    });

    $('editIconSelectorGrid')?.addEventListener('click', (e) => {
        const item = e.target.closest('.icon-option-item');
        if (item?.dataset.icon) selectCategoryIcon(item.dataset.icon, 'editCatIcon', '#editIconSelectorGrid');
    });

    $('iconSelectorGrid')?.addEventListener('click', (e) => {
        const item = e.target.closest('.icon-option-item');
        if (item?.dataset.icon) selectCategoryIcon(item.dataset.icon, 'newCatIcon', '#iconSelectorGrid');
    });

    $('categoryManagerList')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="open-edit-category"]');
        if (btn) openEditCategoryModal(btn.dataset.kind, Number(btn.dataset.index));
    });

    $('openCreateCategoryBtn')?.addEventListener('click', () => {
        if ($('newCatName')) $('newCatName').value = '';
        if ($('newCatKind')) $('newCatKind').value = 'expense';
        renderIconGrid('iconSelectorGrid', 'newCatIcon', null);
        clearValidationErrors($('categoryCreateForm'));
        openModal($('categoryCreateDlg'));
    });

    $('cancelCreateCategoryBtn')?.addEventListener('click', () => {
        clearValidationErrors($('categoryCreateForm'));
        closeModal($('categoryCreateDlg'));
    });

    $('categoryCreateForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newCatName');
        const kindSelect = $('newCatKind');
        const iconSelect = $('newCatIcon');

        if (!validateRequiredFields(e.target, [nameInput])) return;

        if (!iconSelect?.value) {
            alert('Selecciona un icono.');
            return;
        }

        const name = nameInput.value.trim();
        const kind = kindSelect ? kindSelect.value : 'expense';
        const icon = iconSelect.value;

        appConfig.colorCounter = (appConfig.colorCounter || 0) + 1;
        const hue = (appConfig.colorCounter * 137.5) % 360;
        const color = `hsl(${Math.round(hue)}, 70%, 50%)`;

        if (!appConfig.categories[kind].some(c => c.name.toLowerCase() === name.toLowerCase())) {
            appConfig.categories[kind].push({ name, color, icon });
            appConfig.categories[kind].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

            persistConfig();
            closeModal($('categoryCreateDlg'));
            refreshCategoryUI();
        } else {
            alert('Esta categoría ya existe.');
            nameInput.focus();
        }
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
        if (!validateRequiredFields(e.target, [nameInput])) return;

        const newName = nameInput.value.trim();
        const newKind = $('editCatKind').value;
        const newIcon = $('editCatIcon').value;

        const { kind: oldKind, index: oldIndex } = editingCategoryData;
        const targetCat = appConfig.categories[oldKind][oldIndex];

        const exists = appConfig.categories[newKind].some((c, idx) =>
            c.name.toLowerCase() === newName.toLowerCase() && !(oldKind === newKind && idx === oldIndex)
        );
        if (exists) {
            alert('Ya existe una categoría con ese nombre.');
            nameInput.focus();
            return;
        }

        targetCat.name = newName;
        targetCat.icon = newIcon;

        if (oldKind !== newKind) {
            appConfig.categories[oldKind].splice(oldIndex, 1);
            appConfig.categories[newKind].push(targetCat);
        }

        ['expense', 'income'].forEach(k => {
            appConfig.categories[k].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
        });

        persistConfig();
        closeModal($('categoryEditDlg'));
        refreshCategoryUI();
    });

    if ($('remittancesList')) {
        const listContainer = $('remittancesList');

        listContainer.addEventListener('click', (e) => {
            const editRemitBtn = e.target.closest('[data-action="edit-remit"]');
            if (editRemitBtn) {
                e.stopPropagation();
                return editRemittance(editRemitBtn.dataset.remitId);
            }

            const removeItemBtn = e.target.closest('[data-action="remove-remit-item"]');
            if (removeItemBtn) {
                e.stopPropagation();
                return removeRemitItem(removeItemBtn.dataset.remitId, Number(removeItemBtn.dataset.index));
            }

            const addItemBtn = e.target.closest('[data-action="add-remit-item"]');
            if (addItemBtn) {
                e.stopPropagation();
                return addRemitItem(addItemBtn.dataset.remitId);
            }

            const header = e.target.closest('[data-action="toggle-remit"]');
            if (header) {
                e.stopPropagation();
                toggleRemitAccordion(header.dataset.remitId);
            }
        });

        listContainer.addEventListener('keydown', (e) => {
            const remId = e.target.dataset.remitId;
            if (!remId || e.key !== 'Enter') return;
            e.preventDefault();
            e.target.blur();
            if (e.target.classList.contains('remit-concept-field')) addRemitItem(remId);
        });

        listContainer.addEventListener('input', (e) => {
            const remId = e.target.dataset.remitId;
            const rem = remId ? remittancesList.find(r => r.id === remId) : null;
            if (!rem) return;

            if (e.target.classList.contains('remit-recv-input')) {
                rem.items[Number(e.target.dataset.index)].recvAmount = parseInputNumber(e.target.value);
            } else if (e.target.classList.contains('remit-tc-input')) {
                rem.tc = parseInputNumber(e.target.value) || 1;
            } else if (e.target.classList.contains('remit-comm-input')) {
                rem.commission = parseInputNumber(e.target.value);
            } else {
                return;
            }

            persistRemittancesList();
            updateRemitDOMTotals(rem);
        });

        listContainer.addEventListener('focusin', (e) => {
            const remId = e.target.dataset.remitId;
            const rem = remId ? remittancesList.find(r => r.id === remId) : null;
            if (!rem) return;

            let val = 0;
            if (e.target.classList.contains('remit-recv-input')) {
                val = rem.items[Number(e.target.dataset.index)]?.recvAmount || 0;
            } else if (e.target.classList.contains('remit-tc-input')) {
                val = rem.tc || 0;
            } else if (e.target.classList.contains('remit-comm-input')) {
                val = rem.commission || 0;
            } else {
                return;
            }

            e.target.value = val > 0 ? (rem.sendCurr === 'EUR' ? String(val).replace('.', ',') : String(val)) : '';
        });

        listContainer.addEventListener('focusout', (e) => {
            const remId = e.target.dataset.remitId;
            const rem = remId ? remittancesList.find(r => r.id === remId) : null;
            if (!rem) return;

            const isRecv = e.target.classList.contains('remit-recv-input');
            const isTc = e.target.classList.contains('remit-tc-input');
            const isComm = e.target.classList.contains('remit-comm-input');
            if (!isRecv && !isTc && !isComm) return;

            const parsed = parseInputNumber(e.target.value);
            if (isRecv) rem.items[Number(e.target.dataset.index)].recvAmount = parsed;
            else if (isTc) rem.tc = parsed > 0 ? parsed : 1;
            else if (isComm) rem.commission = parsed;

            persistRemittancesList();
            renderRemittancesList();
        });
    }

    $('remitEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingRemittanceId) return;

        const nameInput = $('editRemitName');
        if (!validateRequiredFields(e.target, [nameInput])) return;

        remittancesList = remittancesList.map(r => r.id === editingRemittanceId ? {
            ...r,
            name: nameInput.value.trim(),
            sendCurr: $('editRemitSendCurr').value,
            recvCurr: $('editRemitRecvCurr').value
        } : r);

        persistRemittancesList();
        closeModal($('remitEditDlg'));
        renderRemittancesList();
    });

    $('cancelEditRemitBtn')?.addEventListener('click', () => closeModal($('remitEditDlg')));

    $('installmentsList')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-action="edit-inst-purchase"]');
        if (editBtn) {
            e.stopPropagation();
            return editInstallmentPurchase(editBtn.dataset.purchaseId);
        }

        const paidTarget = e.target.closest('[data-action="toggle-inst-paid"]');
        if (paidTarget) {
            e.stopPropagation();
            return toggleInstallmentPaid(paidTarget.dataset.purchaseId, Number(paidTarget.dataset.instNumber));
        }

        const header = e.target.closest('[data-action="toggle-inst-accordion"]');
        if (header) {
            e.stopPropagation();
            toggleInstallmentAccordion(header.dataset.purchaseId);
        }
    });

    $('addDayCounterMonthBtn')?.addEventListener('click', () => {
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        $('newMonthName').value = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
        $('newMonthTarget').value = '15';
        clearValidationErrors($('dayCounterMonthNewForm'));
        openModal($('dayCounterMonthNewDlg'));
    });

    $('cancelNewDayCounterMonth')?.addEventListener('click', () => closeModal($('dayCounterMonthNewDlg')));

    $('dayCounterMonthNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newMonthName');
        const targetInput = $('newMonthTarget');
        if (!nameInput.value.trim() || !targetInput.value) return;

        const newMonthId = crypto.randomUUID();
        dayCounterMonths.push({
            id: newMonthId,
            name: nameInput.value.trim(),
            targetDays: parseInt(targetInput.value) || 15,
            expanded: true,
            days: []
        });
        persistDayCounter();
        closeModal($('dayCounterMonthNewDlg'));
        renderDayCounter();
        scrollCardIntoView($(`dc_month_box_${newMonthId}`), true);
    });

    $('cancelEditDayCounterMonth')?.addEventListener('click', () => closeModal($('dayCounterMonthEditDlg')));

    $('deleteMonthModalBtn')?.addEventListener('click', () => {
        if (!editingMonthId) return;
        if (confirm('¿Eliminar este mes y todos sus días registrados?')) {
            dayCounterMonths = dayCounterMonths.filter(x => x.id !== editingMonthId);
            persistDayCounter();
            closeModal($('dayCounterMonthEditDlg'));
            renderDayCounter();
        }
    });

    $('dayCounterMonthEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingMonthId) return;

        const nameInput = $('editMonthName');
        const targetInput = $('editMonthTarget');
        if (!nameInput.value.trim() || !targetInput.value) return;

        dayCounterMonths = dayCounterMonths.map(m => m.id === editingMonthId ? {
            ...m,
            name: nameInput.value.trim(),
            targetDays: parseInt(targetInput.value) || 15
        } : m);

        persistDayCounter();
        closeModal($('dayCounterMonthEditDlg'));
        renderDayCounter();
    });

    $('dayCounterMonthsList')?.addEventListener('click', (e) => {
        const editMonthBtn = e.target.closest('[data-action="edit-dc-month"]');
        if (editMonthBtn) {
            e.stopPropagation();
            editingMonthId = editMonthBtn.dataset.monthId;
            const month = dayCounterMonths.find(x => x.id === editingMonthId);
            if (month) {
                $('editMonthName').value = month.name;
                $('editMonthTarget').value = month.targetDays;
                clearValidationErrors($('dayCounterMonthEditForm'));
                openModal($('dayCounterMonthEditDlg'));
            }
            return;
        }

        const toggleHeader = e.target.closest('[data-action="toggle-dc-month"]');
        if (toggleHeader) {
            e.stopPropagation();
            toggleDayCounterMonthAccordion(toggleHeader.dataset.monthId);
            return;
        }

        const openAddDayBtn = e.target.closest('[data-action="open-add-dc-day"]');
        if (openAddDayBtn) {
            e.stopPropagation();
            editingDayMonthId = openAddDayBtn.dataset.monthId;
            editingDayIndex = null;
            $('dayDlgTitle').textContent = 'Registrar día de trabajo';
            $('dayDate').value = `${currentMonth}-${pad(today.getDate())}`;
            $('dayNameDisplay').value = getDayNameFromDate($('dayDate').value);
            $('dayEntryTime').value = '18:00';
            $('dayExitTime').value = calculateExitTime('18:00');
            $('dayLocation').value = '';

            if ($('dayModalActionsSplit')) $('dayModalActionsSplit').style.display = 'none';
            if ($('dayModalActionsNormal')) $('dayModalActionsNormal').style.display = 'flex';

            const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
            if ($('copyPreviousDayWrapper')) {
                $('copyPreviousDayWrapper').style.display = month?.days?.length > 0 ? 'block' : 'none';
            }

            clearValidationErrors($('dayCounterDayForm'));
            openModal($('dayCounterDayDlg'));
            return;
        }

        const editDayBtn = e.target.closest('[data-action="edit-dc-day"]');
        if (editDayBtn) {
            e.stopPropagation();
            editingDayMonthId = editDayBtn.dataset.monthId;
            editingDayIndex = Number(editDayBtn.dataset.index);
            const day = dayCounterMonths.find(x => x.id === editingDayMonthId)?.days[editingDayIndex];
            if (day) {
                $('dayDlgTitle').textContent = 'Editar día de trabajo';
                $('dayDate').value = day.date;
                $('dayNameDisplay').value = day.dayName;
                $('dayEntryTime').value = day.entryTime;
                $('dayExitTime').value = day.exitTime;
                $('dayLocation').value = day.location;
                if ($('copyPreviousDayWrapper')) $('copyPreviousDayWrapper').style.display = 'none';

                if ($('dayModalActionsSplit')) $('dayModalActionsSplit').style.display = 'flex';
                if ($('dayModalActionsNormal')) $('dayModalActionsNormal').style.display = 'none';

                clearValidationErrors($('dayCounterDayForm'));
                openModal($('dayCounterDayDlg'));
            }
        }
    });

    if ($('deleteDayModalBtn')) {
        $('deleteDayModalBtn').onclick = () => {
            if (editingDayMonthId === null || editingDayIndex === null) return;
            if (!confirm('¿Eliminar este día registrado?')) return;

            const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
            if (month?.days) {
                const savedScrollTop = document.querySelector(`#dc_month_details_${editingDayMonthId} .dc-days-wrapper`)?.scrollTop || 0;

                month.days.splice(editingDayIndex, 1);
                persistDayCounter();
                closeModal($('dayCounterDayDlg'));
                renderDayCounter();

                const updatedWrapper = document.querySelector(`#dc_month_details_${editingDayMonthId} .dc-days-wrapper`);
                if (updatedWrapper) updatedWrapper.scrollTop = savedScrollTop;
            }
        };
    }

    $('dayDate')?.addEventListener('change', () => {
        $('dayNameDisplay').value = getDayNameFromDate($('dayDate').value);
    });

    $('dayEntryTime')?.addEventListener('change', () => {
        $('dayExitTime').value = calculateExitTime($('dayEntryTime').value);
    });

    $('copyPreviousDayBtn')?.addEventListener('click', () => {
        const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
        const lastDay = month?.days?.at(-1);
        if (lastDay) {
            $('dayEntryTime').value = lastDay.entryTime;
            $('dayExitTime').value = lastDay.exitTime;
            $('dayLocation').value = lastDay.location;
        }
    });

    $('cancelDayCounterDay')?.addEventListener('click', () => closeModal($('dayCounterDayDlg')));
    $('cancelDayCounterDayNormal')?.addEventListener('click', () => closeModal($('dayCounterDayDlg')));

    $('dayCounterDayForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
        const dateStr = $('dayDate').value;
        if (!month || !dateStr) return;

        if (!month.days) month.days = [];
        const duplicateIndex = month.days.findIndex((d, idx) => d.date === dateStr && (editingDayIndex === null || idx !== editingDayIndex));

        if (duplicateIndex !== -1) {
            alert('Este día ya ha sido registrado en este mes.');
            $('dayDate').focus();
            return;
        }

        const savedScrollTop = document.querySelector(`#dc_month_details_${month.id} .dc-days-wrapper`)?.scrollTop || 0;

        const dayObj = {
            date: dateStr,
            dayName: getDayNameFromDate(dateStr),
            entryTime: $('dayEntryTime').value,
            exitTime: $('dayExitTime').value,
            location: $('dayLocation').value.trim()
        };

        if (editingDayIndex !== null && editingDayIndex >= 0) {
            month.days[editingDayIndex] = dayObj;
        } else {
            month.days.push(dayObj);
            month.days.sort((a, b) => a.date.localeCompare(b.date));
        }

        persistDayCounter();
        closeModal($('dayCounterDayDlg'));
        renderDayCounter();

        const daysWrapperAfter = document.querySelector(`#dc_month_details_${month.id} .dc-days-wrapper`);
        if (daysWrapperAfter) {
            daysWrapperAfter.scrollTop = editingDayIndex === null ? daysWrapperAfter.scrollHeight : savedScrollTop;
        }
    });

    $('addBtn')?.addEventListener('click', openNewMovement);

    $('cancelNew')?.addEventListener('click', () => {
        clearValidationErrors($('newForm'));
        closeModal($('newDlg'));
    });

    $('cancelEdit')?.addEventListener('click', () => {
        clearValidationErrors($('editForm'));
        closeModal($('editDlg'));
    });

    $('newKind')?.addEventListener('change', () => updateCategoryOptions('new'));
    $('editKind')?.addEventListener('change', () => updateCategoryOptions('edit'));

    $('closeDetailBtn')?.addEventListener('click', () => closeModal($('detailDlg')));

    $('rows')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('button[data-edit]');
        if (editBtn) {
            e.stopPropagation();
            return editMovement(editBtn.dataset.edit);
        }

        const row = e.target.closest('tr.movement-row');
        const id = row?.querySelector('button[data-edit]')?.dataset.edit;
        if (id) showMovementDetail(id);
    });

    $('newForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateRequiredFields(e.target, [$('newDesc'), $('newAmount'), $('newDate')])) return;

        const desc = $('newDesc').value.trim();
        const amount = Number($('newAmount').value);
        const date = $('newDate').value;
        if (!desc || !(amount > 0) || !date) return;

        movements.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            desc,
            kind: $('newKind').value,
            amount: Math.round(amount * 100) / 100,
            date,
            category: $('newCategory').value,
            notes: $('newNotes').value.trim()
        });

        persist();
        closeModal($('newDlg'));
        render();
    });

    $('editForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateRequiredFields(e.target, [$('editDesc'), $('editAmount'), $('editDate')])) return;

        const desc = $('editDesc').value.trim();
        const amount = Number($('editAmount').value);
        const date = $('editDate').value;
        if (!desc || !(amount > 0) || !date || !editingId) return;

        movements = movements.map(item => item.id === editingId ? {
            ...item,
            desc,
            kind: $('editKind').value,
            amount: Math.round(amount * 100) / 100,
            date,
            category: $('editCategory').value,
            notes: $('editNotes').value.trim()
        } : item);

        persist();
        closeModal($('editDlg'));
        render();
    });

    $('addRemittanceBtn')?.addEventListener('click', () => {
        $('remitNewForm')?.reset();
        $('newRemitName').value = `Remesa #${remittancesList.length + 1}`;
        clearValidationErrors($('remitNewForm'));
        openModal($('remitNewDlg'));
    });

    $('cancelNewRemitBtn')?.addEventListener('click', () => {
        clearValidationErrors($('remitNewForm'));
        closeModal($('remitNewDlg'));
    });

    $('remitNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateRequiredFields(e.target, [$('newRemitName')])) return;

        const newRemitId = crypto.randomUUID();
        remittancesList.push({
            id: newRemitId,
            name: $('newRemitName').value.trim(),
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
        scrollCardIntoView($(`remit_box_${newRemitId}`), true);
    });

    ['newInstFinancedAmount', 'newInstInterestAmount', 'newInstTotalCount'].forEach(id => {
        $(id)?.addEventListener('input', () => autoCalculateInstallment('new'));
    });

    ['editInstFinancedAmount', 'editInstInterestAmount', 'editInstTotalCount'].forEach(id => {
        $(id)?.addEventListener('input', () => autoCalculateInstallment('edit'));
    });

    $('addInstallmentPurchaseBtn')?.addEventListener('click', () => {
        $('installmentNewForm')?.reset();
        if ($('newInstCurrency')) $('newInstCurrency').value = appConfig.currency || 'EUR';
        if ($('newInstFirstDate')) $('newInstFirstDate').value = `${currentMonth}-${pad(today.getDate())}`;
        clearValidationErrors($('installmentNewForm'));
        openModal($('installmentNewDlg'));
    });

    $('cancelNewInstallmentBtn')?.addEventListener('click', () => {
        clearValidationErrors($('installmentNewForm'));
        closeModal($('installmentNewDlg'));
    });

    $('installmentNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = readInstallmentForm('new');
        if (!formData) return;

        const newPurchaseId = crypto.randomUUID();
        installmentsPurchases.push({
            id: newPurchaseId,
            ...formData,
            expanded: true,
            installments: buildInstallmentsArray(formData.totalCount, formData.regularAmount, formData.finalAmount, formData.firstDate)
        });

        persistInstallments();
        closeModal($('installmentNewDlg'));
        renderInstallments();
        scrollCardIntoView($(`purchase_box_${newPurchaseId}`), true);
    });

    $('installmentEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingInstallmentId) return;

        const formData = readInstallmentForm('edit');
        if (!formData) return;

        installmentsPurchases = installmentsPurchases.map(p => p.id === editingInstallmentId ? {
            ...p,
            ...formData,
            installments: buildInstallmentsArray(formData.totalCount, formData.regularAmount, formData.finalAmount, formData.firstDate, p.installments)
        } : p);

        persistInstallments();
        closeModal($('installmentEditDlg'));
        renderInstallments();
    });

    $('configBtn')?.addEventListener('click', () => {
        $('userNameInput').value = appConfig.userName;
        $('currencySelect').value = appConfig.currency;
        $('themeSelect').value = appConfig.theme;

        const utils = appConfig.utilities || { financeManager: true, remittances: true, installments: true, dayCounter: true };
        if ($('toggleUtilFinanceManager')) $('toggleUtilFinanceManager').checked = utils.financeManager !== false;
        if ($('toggleUtilRemit')) $('toggleUtilRemit').checked = utils.remittances !== false;
        if ($('toggleUtilInstallments')) $('toggleUtilInstallments').checked = utils.installments !== false;
        if ($('toggleUtilDayCounter')) $('toggleUtilDayCounter').checked = utils.dayCounter !== false;

        openModal($('configDlg'));
    });

    $('cancelConfigBtn')?.addEventListener('click', () => closeModal($('configDlg')));

    $('saveConfigBtn')?.addEventListener('click', () => {
        appConfig.userName = $('userNameInput').value.trim() || 'Invitado';
        appConfig.currency = $('currencySelect').value;
        appConfig.theme = $('themeSelect').value;
        appConfig.utilities = {
            financeManager: $('toggleUtilFinanceManager') ? $('toggleUtilFinanceManager').checked : true,
            remittances: $('toggleUtilRemit') ? $('toggleUtilRemit').checked : true,
            installments: $('toggleUtilInstallments') ? $('toggleUtilInstallments').checked : true,
            dayCounter: $('toggleUtilDayCounter') ? $('toggleUtilDayCounter').checked : true
        };

        persistConfig();
        render();
        closeModal($('configDlg'));
    });

    $('editCategoriesBtn')?.addEventListener('click', () => {
        renderConfigCategories();
        openModal($('categoriesDlg'));
    });

    $('closeCategoriesDlg')?.addEventListener('click', () => closeModal($('categoriesDlg')));

    document.querySelectorAll('dialog').forEach(dlg => {
        dlg.addEventListener('click', (e) => {
            if (e.target === dlg) closeModal(dlg);
        });
        dlg.addEventListener('close', () => {
            if (!document.querySelector('dialog[open]')) {
                document.body.classList.remove('no-scroll');
            }
        });
    });

    document.addEventListener('input', (e) => e.target.classList?.remove('input-error'));
}

/* ==========================================
   11. ARRANQUE DE LA APLICACIÓN
   ========================================== */
function init() {
    if (!appConfig.utilities) {
        appConfig.utilities = { financeManager: true, remittances: true, installments: true, dayCounter: true };
    } else if (typeof appConfig.utilities.financeManager === 'undefined') {
        appConfig.utilities.financeManager = true;
    }

    ['expense', 'income'].forEach(kind => {
        appConfig.categories[kind] = (appConfig.categories[kind] || []).map(c =>
            typeof c === 'string' ? { name: c, color: '#03DAC6', icon: 'Compras' } : c
        );
    });

    updateUserDisplay();
    applyTheme();
    applyUtilitiesVisibility();
    updateCurrencyLabels();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');

    bindEvents();
    setFinanceViewMode('movements');
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();

    document.querySelectorAll('.table-wrapper').forEach(wrapper => {
        let scrollTimeout;
        wrapper.addEventListener('scroll', () => {
            wrapper.classList.add('is-scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => wrapper.classList.remove('is-scrolling'), 800);
        }, { passive: true });
    });
}

init();