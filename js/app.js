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

/* ==========================================
   1. ESTADO Y CONFIGURACIÓN GLOBAL
   ========================================== */
const DEFAULT_CONFIG = {
    userName: 'Invitado',
    currency: 'EUR',
    theme: 'light',
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
            { name: 'Combustible', color: '#ef4444', icon: 'Combustible' },
            { name: 'Compras', color: '#ec4899', icon: 'Compras' },
            { name: 'Alimentación', color: '#8b5cf6', icon: 'Alimentacion' },
            { name: 'Transporte', color: '#10b981', icon: 'Transporte' },
            { name: 'Manutención', color: '#f59e0b', icon: 'Familia' },
            { name: 'Servicios', color: '#6366f1', icon: 'Grifo' },
            { name: 'Suscripciones', color: '#14b8a6', icon: 'Pantalla' },
        ],
        income: [
            { name: 'Salario', color: '#22c55e', icon: 'Billetera' },
            { name: 'Ingresos extra', color: '#84cc16', icon: 'Ingresos' },
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
let currentCatKind = 'expense';
let selectedDonutCategory = null;

const accordionConfig = [
    { btnId: 'toggleMovementsBtn', containerId: 'movementsContainer', iconId: 'toggleMovementsIcon', cardEl: 'movementsCard' },
    { btnId: 'toggleCategoriesBtn', containerId: 'categoriesContainer', iconId: 'toggleCategoriesIcon', cardEl: 'categoriesCard' },
    { btnId: 'toggleRemitBtn', containerId: 'remitContainer', iconId: 'toggleRemitIcon', cardEl: 'remittancesCard' },
    { btnId: 'toggleInstallmentsBtn', containerId: 'installmentsContainer', iconId: 'toggleInstallmentsIcon', cardEl: 'installmentsCard' },
    { btnId: 'toggleDayCounterBtn', containerId: 'dayCounterContainer', iconId: 'toggleDayCounterIcon', cardEl: 'dayCounterCard' }
];

const today = new Date();
const pad = (number) => String(number).padStart(2, '0');
const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

/* ==========================================
   2. UTILIDADES DE FORMATO, FECHAS Y MODALES
   ========================================== */
const getCurrencySymbol = (code) => {
    const symbols = { EUR: '€', USD: '$', PEN: 'S/.' };
    return symbols[code] || '€';
};

const formatCurrencyCustom = (amount, code) => {
    const num = Number(amount) || 0;
    const parts = num.toFixed(2).split('.');
    if (code === 'PEN') {
        return `S/ ${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${parts[1]}`;
    }
    if (code === 'USD') {
        return `$${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${parts[1]}`;
    }
    return `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${parts[1]} €`;
};

const formatMoney = (amount) => formatCurrencyCustom(amount, appConfig.currency);

const formatNumberDisplay = (val, currCode) => {
    if (isNaN(val) || val <= 0) return '';
    return formatCurrencyCustom(val, currCode);
};

const formatTcInputValue = (val, recvCurrCode) => {
    if (isNaN(val) || val <= 0) return '';
    const num = Number(val);
    const parts = num.toFixed(4).split('.');
    let cleanDecimal = parts[1].replace(/0+$/, '');
    let str = cleanDecimal ? `${parts[0]}.${cleanDecimal}` : parts[0];
    
    if (recvCurrCode === 'EUR') {
        return str.replace('.', ',');
    }
    return str;
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

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function formatDateEs(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

function addMonthsToDate(dateStr, monthsToAdd) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const lastDayOfStartMonth = new Date(y, m, 0).getDate();
    const isEndOfMonth = d >= lastDayOfStartMonth;

    let targetYear = y;
    let targetMonth = (m - 1) + monthsToAdd;
    targetYear += Math.floor(targetMonth / 12);
    targetMonth = targetMonth % 12;

    const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
    const targetDay = (isEndOfMonth || d > lastDayOfTargetMonth) ? lastDayOfTargetMonth : d;

    return `${targetYear}-${pad(targetMonth + 1)}-${pad(targetDay)}`;
}

function calculateExitTime(entryTimeStr) {
    if (!entryTimeStr) return '06:00';
    const [hours, minutes] = entryTimeStr.split(':').map(Number);
    let newHours = (hours + 12) % 24;
    return `${pad(newHours)}:${pad(minutes)}`;
}

function getDayNameFromDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T12:00:00');
    const options = { weekday: 'long' };
    const name = date.toLocaleDateString('es-ES', options);
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function clearValidationErrors(formEl) {
    if (!formEl) return;
    formEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

/* Funciones auxiliares para control de modales y bloqueo de scroll de fondo */
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

function applyTheme() {
    document.body.classList.toggle('dark-mode', appConfig.theme === 'dark');
}

function applyUtilitiesVisibility() {
    const utils = appConfig.utilities || { financeManager: true, remittances: true, installments: true, dayCounter: true };

    const showFinance = utils.financeManager !== false;
    const metricsSection = $('metricsCardsSection');
    if (metricsSection) {
        metricsSection.style.display = showFinance ? '' : 'none';
        metricsSection.style.marginBottom = showFinance ? '20px' : '0px';
    }

    if ($('movementsCard')) $('movementsCard').style.display = showFinance ? '' : 'none';
    if ($('categoriesCard')) $('categoriesCard').style.display = showFinance ? '' : 'none';

    const financeLayout = $('financeManagerLayout');
    if (financeLayout) {
        financeLayout.style.display = showFinance ? '' : 'none';
        financeLayout.style.marginBottom = showFinance ? '25px' : '0px';
    }

    if ($('remittancesCard')) $('remittancesCard').style.display = utils.remittances !== false ? '' : 'none';
    if ($('installmentsCard')) $('installmentsCard').style.display = utils.installments !== false ? '' : 'none';
    if ($('dayCounterCard')) $('dayCounterCard').style.display = utils.dayCounter !== false ? '' : 'none';

    const anyVisible = (utils.remittances !== false) || (utils.installments !== false) || (utils.dayCounter !== false);
    if ($('utilitiesSection')) {
        $('utilitiesSection').style.display = anyVisible ? '' : 'none';
    }
}

function updateUserDisplay() {
    $('welcomeText').textContent = `Bienvenido, ${appConfig.userName}.`;
    $('userInitial').textContent = appConfig.userName.charAt(0) || 'I';
}

function updateCurrencyLabels() {
    const symbol = getCurrencySymbol(appConfig.currency);
    if ($('newAmountLabel')) $('newAmountLabel').textContent = `Importe (${symbol})`;
    if ($('editAmountLabel')) $('editAmountLabel').textContent = `Importe (${symbol})`;
}

function updateCategoryOptions(prefix) {
    const kind = $(`${prefix}Kind`).value;
    const catList = appConfig.categories[kind] || [];
    const sortedCats = [...catList].sort((a, b) => 
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );
    $(`${prefix}Category`).innerHTML = sortedCats
        .map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`)
        .join('');
}

function updateMovementFilterOptions() {
    const filterSelect = $('movementFilter');
    if (!filterSelect) return;

    const currentSelection = filterSelect.value || 'all';
    const expenseCats = [...(appConfig.categories.expense || [])].sort((a, b) => 
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );
    const incomeCats = [...(appConfig.categories.income || [])].sort((a, b) => 
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    );

    filterSelect.innerHTML = `
        <option value="all">Todos</option>
        <optgroup label="Gastos">
            <option value="type:expense">Todos los gastos</option>
            ${expenseCats.map(c => `<option value="cat:expense:${escapeHtml(c.name)}">- ${escapeHtml(c.name)}</option>`).join('')}
        </optgroup>
        <optgroup label="Ingresos">
            <option value="type:income">Todos los ingresos</option>
            ${incomeCats.map(c => `<option value="cat:income:${escapeHtml(c.name)}">- ${escapeHtml(c.name)}</option>`).join('')}
        </optgroup>
    `;

    const exists = Array.from(filterSelect.options).some(opt => opt.value === currentSelection);
    filterSelect.value = exists ? currentSelection : 'all';
}

function setupMainAccordion(btnId, containerId, iconId, cardId) {
    const btn = $(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
        const container = $(containerId);
        const icon = $(iconId);
        const card = $(cardId);
        if (!container) return;

        const isCurrentlyExpanded = container.style.display === 'block';
        const willBeExpanded = !isCurrentlyExpanded;

        accordionConfig.forEach(item => {
            const c = $(item.containerId);
            const ic = $(item.iconId);
            const cr = $(item.cardEl);
            if (c && c !== container) {
                c.style.display = 'none';
                if (cr) cr.classList.remove('expanded');
                if (ic) ic.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
            }
        });

        container.style.display = willBeExpanded ? 'block' : 'none';
        if (card) card.classList.toggle('expanded', willBeExpanded);
        if (icon) {
            icon.innerHTML = willBeExpanded
                ? '<polyline points="18 15 12 9 6 15"></polyline>'
                : '<polyline points="6 9 12 15 18 9"></polyline>';
        }
    });
}

/* ==========================================
   4. EXPORTAR E IMPORTAR CSV MULTI-SECCIÓN
   ========================================== */
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
            let formattedDate = m.date;
            if (m.date && m.date.includes('-')) {
                const [year, month, day] = m.date.split('-');
                formattedDate = `${day}/${month}/${year}`;
            }
            const desc = `"${(m.desc || '').replace(/"/g, '""')}"`;
            const tipoStr = m.kind === 'income' ? 'Ingreso' : 'Gasto';
            const cat = `"${(m.category || '').replace(/"/g, '""')}"`;
            const notes = `"${(m.notes || '').replace(/"/g, '""')}"`;
            csvRows.push([formattedDate, desc, tipoStr, cat, m.amount, notes].join(','));
        });
        csvRows.push('');
    }

    if (includeRemit) {
        csvRows.push('--- SECCION: REMESAS ---');
        csvRows.push('NOMBRE_REMESA,MONEDA_ENVIO,MONEDA_RECEPCION,TIPO_CAMBIO,COMISION,CONCEPTO_ITEM,IMPORTE_RECEPCION_ITEM');
        remittancesList.forEach(r => {
            if (!r.items || r.items.length === 0) {
                csvRows.push(`"${r.name}","${r.sendCurr}","${r.recvCurr}",${r.tc},${r.commission},"" ,0`);
            } else {
                r.items.forEach(item => {
                    const concept = `"${(item.concept || '').replace(/"/g, '""')}"`;
                    csvRows.push(`"${r.name}","${r.sendCurr}","${r.recvCurr}",${r.tc},${r.commission},${concept},${item.recvAmount}`);
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
                let formattedDate = inst.date;
                if (inst.date && inst.date.includes('-')) {
                    const [year, month, day] = inst.date.split('-');
                    formattedDate = `${day}/${month}/${year}`;
                }
                const name = `"${(p.name || '').replace(/"/g, '""')}"`;
                csvRows.push(`${name},"${p.currency || 'EUR'}",${p.financedAmount || 0},${p.interestAmount || 0},${p.totalCount},${inst.number},${formattedDate},${inst.amount},${p.finalAmount || inst.amount},${inst.paid ? 'SI' : 'NO'}`);
            });
        });
        csvRows.push('');
    }

    if (includeDays) {
        csvRows.push('--- SECCION: CONTADOR DE DIAS TRABAJADOS ---');
        csvRows.push('MES,DIAS_OBJETIVO,FECHA_DIA,DIA_SEMANA,ENTRADA,SALIDA,LUGAR');
        dayCounterMonths.forEach(m => {
            if (!m.days || m.days.length === 0) {
                csvRows.push(`"${m.name}",${m.targetDays},"" ,"" ,"" ,"" ,""`);
            } else {
                m.days.forEach(d => {
                    let formattedDate = d.date;
                    if (d.date && d.date.includes('-')) {
                        const [year, month, day] = d.date.split('-');
                        formattedDate = `${day}/${month}/${year}`;
                    }
                    const monthName = `"${(m.name || '').replace(/"/g, '""')}"`;
                    const location = `"${(d.location || '').replace(/"/g, '""')}"`;
                    csvRows.push(`${monthName},${m.targetDays},${formattedDate},"${d.dayName}","${d.entryTime}","${d.exitTime}",${location}`);
                });
            }
        });
    }

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `copia_seguridad_finanzas_${today.toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeModal($('exportDlg'));
}

function parseCsvLine(line) {
    const row = [];
    let inQuotes = false;
    let currentVal = '';
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
            if (inQuotes && line[charIdx + 1] === '"') {
                currentVal += '"';
                charIdx++;
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
    let clean = dateStr.replace(/^"|"$/g, '').trim();
    if (clean.includes('/')) {
        const parts = clean.split('/');
        if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            let year = parts[2];
            if (year.length === 2) year = '20' + year;
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
            const text = e.target.result;
            const lines = text.split(/\r\n|\n/);
            if (lines.length < 2) {
                alert('El archivo CSV está vacío o no tiene el formato correcto.');
                return;
            }

            let currentSection = 'MOVIMIENTOS';
            let rawRemitMap = {};
            let rawInstMap = {};
            let rawDaysMap = {};
            let tempMovements = [];
            let detectedSections = new Set();

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

                if (line.startsWith('FECHA,') || line.startsWith('NOMBRE_REMESA,') || line.startsWith('COMPRA,') || line.startsWith('MES,')) {
                    continue; 
                }

                const row = parseCsvLine(line);

                if (currentSection === 'MOVIMIENTOS' && row.length >= 5) {
                    let [date, desc, tipo, category, amountStr, notes = ''] = row;
                    date = normalizeDateToIso(date);
                    const cleanDesc = desc.replace(/^"|"$/g, '').replace(/""/g, '"');
                    const cleanCat = category.replace(/^"|"$/g, '').replace(/""/g, '"');
                    const cleanNotes = notes.replace(/^"|"$/g, '').replace(/""/g, '"');
                    const amount = parseFloat(amountStr.replace(',', '.')) || 0;
                    const kindNormalized = (tipo.toLowerCase().includes('ingreso') || tipo.toLowerCase() === 'income') ? 'income' : 'expense';

                    if (date && cleanDesc && amount > 0) {
                        tempMovements.push({
                            id: crypto.randomUUID(),
                            timestamp: Date.now() + i,
                            desc: cleanDesc,
                            kind: kindNormalized,
                            amount: Math.round(amount * 100) / 100,
                            date: date,
                            category: cleanCat || (kindNormalized === 'income' ? 'Salario' : 'Compras'),
                            notes: cleanNotes
                        });
                    }
                } 
                else if (currentSection === 'REMESAS' && row.length >= 7) {
                    let [remName, sendCurr, recvCurr, tcStr, commStr, concept, recvAmtStr] = row;
                    remName = remName.replace(/^"|"$/g, '').replace(/""/g, '"');
                    if (!remName) continue;

                    if (!rawRemitMap[remName]) {
                        rawRemitMap[remName] = {
                            id: crypto.randomUUID(),
                            name: remName,
                            sendCurr: sendCurr.replace(/^"|"$/g, '') || 'EUR',
                            recvCurr: recvCurr.replace(/^"|"$/g, '') || 'PEN',
                            tc: parseFloat(tcStr.replace(',', '.')) || 3.75,
                            commission: parseFloat(commStr.replace(',', '.')) || 0,
                            expanded: false,
                            items: []
                        };
                    }
                    const cleanConcept = concept.replace(/^"|"$/g, '').replace(/""/g, '"');
                    const recvAmt = parseFloat(recvAmtStr.replace(',', '.')) || 0;
                    if (cleanConcept) {
                        rawRemitMap[remName].items.push({ concept: cleanConcept, recvAmount: recvAmt });
                    }
                }
                else if (currentSection === 'CUOTAS' && row.length >= 7) {
                    let pName, curr, financedAmt, interestAmt, totalCountStr, instNumStr, instDate, instAmtStr, finalAmt, paidStr;
                    
                    if (row.length >= 10) {
                        [pName, curr, financedAmt, interestAmt, totalCountStr, instNumStr, instDate, instAmtStr, finalAmt, paidStr] = row;
                    } else {
                        [pName, curr, totalCountStr, instNumStr, instDate, instAmtStr, paidStr] = row;
                        financedAmt = 0;
                        interestAmt = 0;
                        finalAmt = 0;
                    }

                    pName = pName.replace(/^"|"$/g, '').replace(/""/g, '"');
                    if (!pName) continue;

                    if (!rawInstMap[pName]) {
                        rawInstMap[pName] = {
                            id: crypto.randomUUID(),
                            name: pName,
                            currency: curr.replace(/^"|"$/g, '') || 'EUR',
                            rawFinanced: parseFloat(financedAmt) || 0,
                            rawInterest: parseFloat(interestAmt) || 0,
                            rawFinal: parseFloat(finalAmt) || 0,
                            totalCount: parseInt(totalCountStr) || 1,
                            expanded: false,
                            installments: []
                        };
                    }
                    const formattedDate = normalizeDateToIso(instDate);
                    const amount = Math.round((parseFloat(instAmtStr.replace(',', '.')) || 0) * 100) / 100;
                    const paid = paidStr.toUpperCase().includes('SI');
                    const number = parseInt(instNumStr) || 1;

                    rawInstMap[pName].installments.push({ number, amount, date: formattedDate, paid });
                }
                else if (currentSection === 'DIAS' && row.length >= 7) {
                    let [mName, targetStr, dDate, dName, entryT, exitT, loc] = row;
                    mName = mName.replace(/^"|"$/g, '').replace(/""/g, '"');
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
                    const cleanLoc = loc.replace(/^"|"$/g, '').replace(/""/g, '"');
                    if (formattedDate) {
                        rawDaysMap[mName].days.push({
                            date: formattedDate,
                            dayName: dName.replace(/^"|"$/g, ''),
                            entryTime: entryT.replace(/^"|"$/g, ''),
                            exitTime: exitT.replace(/^"|"$/g, ''),
                            location: cleanLoc
                        });
                    }
                }
            }

            let parsedRemit = Object.values(rawRemitMap);
            let parsedInst = Object.values(rawInstMap).map(p => {
                const totalSum = p.installments.reduce((acc, curr) => acc + curr.amount, 0);
                const roundedSum = Math.round(totalSum * 100) / 100;

                const financed = p.rawFinanced > 0 ? p.rawFinanced : roundedSum;
                const interest = p.rawInterest >= 0 ? p.rawInterest : 0;
                const totalAmount = Math.round((financed + interest) * 100) / 100;

                return {
                    ...p,
                    financedAmount: financed,
                    interestAmount: interest,
                    totalAmount: totalAmount,
                    regularAmount: p.installments.length > 1 ? p.installments[0].amount : roundedSum,
                    finalAmount: p.rawFinal > 0 ? p.rawFinal : (p.installments.length ? p.installments[p.installments.length - 1].amount : 0),
                    firstDate: p.installments.length ? p.installments[0].date : ''
                };
            });
            let parsedDays = Object.values(rawDaysMap).map(m => {
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

    let summaryMsg = '¡Restauración exitosa!\n';

    if (selection.movements && pendingParsedSections.movements.length > 0) {
        movements = pendingParsedSections.movements;
        persist();
        summaryMsg += `• Movimientos: ${movements.length}\n`;
    }
    if (selection.remittances && pendingParsedSections.remittances.length > 0) {
        remittancesList = pendingParsedSections.remittances;
        persistRemittancesList();
        summaryMsg += `• Calculos de remesas: ${remittancesList.length}\n`;
    }
    if (selection.installments && pendingParsedSections.installments.length > 0) {
        installmentsPurchases = pendingParsedSections.installments;
        persistInstallments();
        summaryMsg += `• Gestores de cuotas: ${installmentsPurchases.length}\n`;
    }
    if (selection.dayCounter && pendingParsedSections.dayCounter.length > 0) {
        dayCounterMonths = pendingParsedSections.dayCounter;
        persistDayCounter();
        summaryMsg += `• Contadores de días: ${dayCounterMonths.length}\n`;
    }

    render();
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();

    alert(summaryMsg);
    pendingParsedSections = null;
    if ($('importSelectDlg')) closeModal($('importSelectDlg'));
}

/* ==========================================
   5. MOVIMIENTOS Y CATEGORÍAS
   ========================================== */
function setupCategoryTabs() {
    const btnExpense = $('catTabExpense');
    const btnIncome = $('catTabIncome');

    if (btnExpense && btnIncome) {
        btnExpense.addEventListener('click', () => {
            currentCatKind = 'expense';
            selectedDonutCategory = null;
            btnExpense.classList.add('active');
            btnIncome.classList.remove('active');
            renderCategoriesRedesign();
        });

        btnIncome.addEventListener('click', () => {
            currentCatKind = 'income';
            selectedDonutCategory = null;
            btnIncome.classList.add('active');
            btnExpense.classList.remove('active');
            renderCategoriesRedesign();
        });
    }
}

function toggleDonutSegment(categoryName) {
    selectedDonutCategory = (selectedDonutCategory === categoryName) ? null : categoryName;
    renderCategoriesRedesign();
}

function renderCategoriesRedesign() {
    const month = $('month').value;
    const monthMovements = movements.filter(item => item.date.startsWith(month));
    const activeMonthMovements = monthMovements.filter(item => item.kind === currentCatKind);

    const categoryTotals = {};
    activeMonthMovements.forEach(item => {
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
                    <circle cx="50" cy="50" r="38" fill="none" stroke="var(--bar-bg)" stroke-width="16"></circle>
                </svg>
                <div class="cat-center-info">
                    <span class="cat-center-label">Total</span>
                    <span class="cat-center-value">${formatMoney(0)}</span>
                </div>
            `;
        }
        if (listContainer) {
            listContainer.innerHTML = '<div class="empty">Añade movimientos para ver el desglose.</div>';
        }
        return;
    }

    let cumulativePercent = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    let svgSegments = '';
    let floatingBadgeHtml = '';

    sortedCategories.forEach(([name, amount]) => {
        const catList = appConfig.categories[currentCatKind] || [];
        const catObj = catList.find(c => c.name === name);
        const color = catObj ? catObj.color : 'var(--blue)';
        const iconKey = catObj && catObj.icon ? catObj.icon : 'Compras';
        const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];

        const percentage = totalSum > 0 ? (amount / totalSum) * 100 : 0;
        const strokeDasharray = `${(percentage * circumference) / 100} ${circumference}`;
        const strokeDashoffset = -((cumulativePercent * circumference) / 100);

        const midPercent = cumulativePercent + percentage / 2;
        cumulativePercent += percentage;

        const isSelected = (selectedDonutCategory === name);

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
                <div class="cat-floating-badge" style="top: ${y}%; left: ${x}%; color: ${color}; border-color: ${color};">
                    <span class="cat-badge-icon" style="color: ${color};">${iconSvg}</span>
                    <span class="cat-badge-text">${percentage.toFixed(1)}%</span>
                </div>
            `;
        }
    });

    if (chartWrapper) {
        chartWrapper.innerHTML = `
            <svg viewBox="0 0 100 100" class="cat-donut-svg">
                <circle cx="50" cy="50" r="${radius}" fill="none" stroke="var(--bar-bg)" stroke-width="16"></circle>
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
            const catList = appConfig.categories[currentCatKind] || [];
            const catObj = catList.find(c => c.name === name);
            const color = catObj ? catObj.color : 'var(--blue)';
            const iconKey = catObj && catObj.icon ? catObj.icon : 'Compras';
            const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];
            const usagePercentage = totalSum > 0 ? ((amount / totalSum) * 100).toFixed(1) : 0;

            return `
                <div class="cat-breakdown-item ${isSelected ? 'selected' : ''}"
                     data-list-category="${escapeHtml(name)}" role="button" tabindex="0"
                     aria-pressed="${isSelected}">
                    <div class="cat-breakdown-left">
                        <span class="category-icon-wrapper" style="color: ${color};">${iconSvg}</span>
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
    const month = $('month').value;
    const monthMovements = movements.filter(item => item.date.startsWith(month));

    const totalIncome = monthMovements
        .filter(item => item.kind === 'income')
        .reduce((sum, item) => sum + item.amount, 0);

    const totalExpenses = monthMovements
        .filter(item => item.kind === 'expense')
        .reduce((sum, item) => sum + item.amount, 0);

    $('income').textContent = formatMoney(totalIncome);
    $('expense').textContent = formatMoney(totalExpenses);
    $('balance').textContent = formatMoney(totalIncome - totalExpenses);

    const query = $('search').value.toLowerCase();
    const filterVal = $('movementFilter')?.value || 'all';

    const visibleMovements = monthMovements
        .filter(item => {
            const matchesSearch = !query || `${item.desc} ${item.category} ${item.notes || ''}`.toLowerCase().includes(query);
            if (!matchesSearch) return false;

            if (filterVal === 'all') return true;
            if (filterVal === 'type:expense') return item.kind === 'expense';
            if (filterVal === 'type:income') return item.kind === 'income';
            if (filterVal.startsWith('cat:')) {
                const [, kind, ...catParts] = filterVal.split(':');
                const catName = catParts.join(':');
                return item.kind === kind && item.category === catName;
            }
            return true;
        })
        .sort((a, b) => {
            const dateComparison = b.date.localeCompare(a.date);
            return dateComparison !== 0 ? dateComparison : (b.timestamp || 0) - (a.timestamp || 0);
        });

    let rowsHtml = '';
    visibleMovements.forEach((item, index) => {
        const formatDay = (dateStr) => new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
        const dateFormatted = formatDay(item.date);
        const prevDate = visibleMovements[index - 1] ? formatDay(visibleMovements[index - 1].date) : null;
        const nextDate = visibleMovements[index + 1] ? formatDay(visibleMovements[index + 1].date) : null;

        if (dateFormatted !== prevDate) {
            rowsHtml += `
                <tr class="date-header-row">
                    <td colspan="4"><span>${dateFormatted}</span></td>
                </tr>
            `;
        }

        const borderClass = dateFormatted !== nextDate ? 'no-border' : '';
        const catList = appConfig.categories[item.kind] || [];
        const catObj = catList.find(c => c.name === item.category);
        const catColor = catObj ? catObj.color : 'var(--blue)';
        const iconKey = catObj && catObj.icon ? catObj.icon : 'Compras';
        const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];

        rowsHtml += `
            <tr class="movement-row ${borderClass}">
                <td>
                    <div class="movement-name-wrapper">
                        <span class="category-icon-wrapper" style="color: ${catColor}; width: 28px; height: 28px;">${iconSvg}</span>
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
                        <button class="soft icon-btn" data-edit="${item.id}" title="Editar" aria-label="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    $('rows').innerHTML = rowsHtml;
    $('empty').style.display = visibleMovements.length ? 'none' : 'block';

    renderCategoriesRedesign();
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

    if (!remittancesList || !remittancesList.length) {
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
        const formattedComm = comm > 0 ? formatNumberDisplay(comm, rem.sendCurr) : '';
        const formattedTc = tc > 0 ? formatTcInputValue(tc, rem.recvCurr) : '';

        const itemsHtml = (rem.items || []).map((item, idx) => {
            const recvVal = item.recvAmount || 0;
            const sendVal = tc > 0 ? recvVal / tc : 0;
            const formattedVal = recvVal > 0 ? formatNumberDisplay(recvVal, rem.recvCurr) : '';
            const isLastClass = idx === rem.items.length - 1 ? 'is-last' : '';

            return `
                <div class="remit-item-row ${isLastClass}">
                    <div class="flex-col-grow">
                        <span class="remit-item-concept">${escapeHtml(item.concept)}</span>
                        <span class="remit-item-send-val" id="remit_send_${rem.id}_${idx}">${formatCurrencyCustom(sendVal, rem.sendCurr)}</span>
                    </div>
                    <div class="flex-center-gap">
                        <input type="text" inputmode="decimal" enterkeyhint="done" class="remit-recv-input remit-input-num" data-remit-id="${rem.id}" data-index="${idx}" value="${formattedVal}" placeholder="0,00">
                        <button type="button" class="danger icon-btn btn-xs" data-action="remove-remit-item" data-remit-id="${rem.id}" data-index="${idx}" title="Eliminar concepto" aria-label="Eliminar concepto">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="installment-purchase-card" id="remit_box_${rem.id}">
                <div class="installment-purchase-header" data-action="toggle-remit" data-remit-id="${rem.id}">
                    <div class="flex-col">
                        <span>${escapeHtml(rem.name)}</span>
                        <span class="installment-card-subtitle" id="remit_header_summary_${rem.id}">
                            ${rem.sendCurr} → ${rem.recvCurr} • Total: ${formatCurrencyCustom(grandTotal, rem.sendCurr)} 
                        </span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="soft icon-btn btn-xs" data-action="edit-remit" data-remit-id="${rem.id}" title="Detalles de la remesa" aria-label="Detalles de la remesa">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
    if (rem) {
        const willBeExpanded = !rem.expanded;
        remittancesList.forEach(r => r.expanded = false);
        rem.expanded = willBeExpanded;
        persistRemittancesList();
        renderRemittancesList();
    }
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
    if (rem) {
        rem.items.splice(index, 1);
        persistRemittancesList();
        renderRemittancesList();
    }
}

function addRemitItem(remId) {
    const inputEl = $(`new_concept_input_${remId}`);
    if (!inputEl) return;
    const conceptName = inputEl.value.trim();
    if (!conceptName) return;

    const rem = remittancesList.find(r => r.id === remId);
    if (rem) {
        rem.items.push({ concept: conceptName, recvAmount: 0 });
        persistRemittancesList();
        renderRemittancesList();

        const nextInput = $(`new_concept_input_${remId}`);
        if (nextInput) {
            nextInput.value = '';
            nextInput.focus();
            if (typeof nextInput.setSelectionRange === 'function') {
                nextInput.setSelectionRange(0, 0);
            }
        }
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

function buildInstallmentsArray(totalCount, regularAmount, finalAmount, firstDateStr, existingInstallments = []) {
    const installments = [];
    for (let i = 1; i <= totalCount; i++) {
        const amt = (i === totalCount) ? finalAmount : regularAmount;
        const instDate = addMonthsToDate(firstDateStr, i - 1);
        const oldInst = existingInstallments.find(ins => ins.number === i);
        installments.push({
            number: i,
            amount: amt,
            date: instDate,
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
        const progressText = `${totalPaidCount}/${purchase.totalCount} pagadas`;
        const allPaid = purchase.installments.length > 0 && purchase.installments.every(i => i.paid);

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
            <div class="installment-purchase-card" id="purchase_box_${purchase.id}">
                <div class="installment-purchase-header ${allPaid ? 'all-paid' : ''}" data-action="toggle-inst-accordion" data-purchase-id="${purchase.id}">
                    <div class="flex-col">
                        <span>${escapeHtml(purchase.name)}</span>
                        <span class="installment-card-subtitle">Total: ${formatCurrencyCustom(purchase.totalAmount, curr)} (${progressText})</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="soft icon-btn btn-xs" data-action="edit-inst-purchase" data-purchase-id="${purchase.id}" title="Editar compra" aria-label="Editar compra">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
    if (purchase) {
        const willBeExpanded = !purchase.expanded;
        installmentsPurchases.forEach(p => p.expanded = false);
        purchase.expanded = willBeExpanded;
        persistInstallments();
        renderInstallments();
    }
}

function toggleInstallmentPaid(purchaseId, instNumber) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;
    const inst = purchase.installments.find(i => i.number === instNumber);
    if (!inst) return;

    inst.paid = !inst.paid;
    persistInstallments();
    const listEl = $(`inst_details_${purchaseId}`);
    const currentScrollTop = listEl ? listEl.scrollTop : 0;
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
    if (addMonthBtn && addMonthBtn.parentElement) {
        const hasExpandedMonth = dayCounterMonths.some(m => m.expanded);
        addMonthBtn.parentElement.style.display = hasExpandedMonth ? 'none' : 'flex';
    }

    if (!dayCounterMonths.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay meses registrados.</div>';
        return;
    }

    listContainer.innerHTML = dayCounterMonths.map((month) => {
        const totalWorked = (month.days || []).length;
        const target = month.targetDays || 0;
        const extras = Math.max(0, totalWorked - target);

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
                    <button type="button" class="soft icon-btn btn-xs" data-action="edit-dc-day" data-month-id="${month.id}" data-index="${idx}" title="Editar día" aria-label="Editar día">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card" id="dc_month_box_${month.id}">
                <div class="installment-purchase-header" data-action="toggle-dc-month" data-month-id="${month.id}">
                    <div class="flex-col">
                        <span>${escapeHtml(month.name)}</span>
                        <span class="installment-card-subtitle">Días trabajados: ${totalWorked} • Días extras: ${extras}</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="soft icon-btn btn-xs" data-action="edit-dc-month" data-month-id="${month.id}" title="Editar mes" aria-label="Editar mes">
                            <svg width="14" height="14" viewBox="0 0 512 512" fill="none" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round"><circle cx="96" cy="112" r="64"></circle><circle cx="96" cy="256" r="64"></circle><circle cx="96" cy="400" r="64"></circle><line x1="256" y1="112" x2="448" y2="112"></line><line x1="256" y1="256" x2="448" y2="256"></line><line x1="256" y1="400" x2="448" y2="400"></line></svg>
                        </button>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <div id="dc_month_details_${month.id}" class="installment-installments-list" style="display: ${month.expanded ? 'flex' : 'none'};">
                    <div class="dc-days-wrapper">
                        ${daysHtml || '<div class="empty empty-mini">Sin días registrados en este mes.</div>'}
                    </div>
                    <div class="utility-footer-action" style="margin-top: 0;">
                        <button type="button" class="soft utility-new-btn" data-action="open-add-dc-day" data-month-id="${month.id}">
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
    if (month) {
        const willBeExpanded = !month.expanded;
        dayCounterMonths.forEach(m => m.expanded = false);
        month.expanded = willBeExpanded;
        persistDayCounter();
        renderDayCounter();

        if (willBeExpanded) {
            const daysWrapper = document.querySelector(`#dc_month_details_${monthId} .dc-days-wrapper`);
            if (daysWrapper) {
                daysWrapper.scrollTop = daysWrapper.scrollHeight;
            }
        }
    }
}

/* ==========================================
   9. MODALES Y CATEGORÍAS
   ========================================== */
function openNewMovement() {
    editingId = null;
    if ($('newForm')) $('newForm').reset();
    if ($('newKind')) $('newKind').value = 'expense';
    updateCategoryOptions('new');
    if ($('month') && $('newDate')) {
        $('newDate').value = `${$('month').value}-${pad(today.getDate())}`;
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

        const sortedCats = [...appConfig.categories[kind]].sort((a, b) => 
            a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        );

        const itemsHtml = sortedCats.map((cat) => {
            const originalIndex = appConfig.categories[kind].findIndex(c => c.name === cat.name);
            const iconKey = cat.icon || 'Compras';
            const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];

            return `
                <div class="category-item-row">
                    <div class="flex-center-gap">
                        <span class="category-icon-wrapper" style="color: ${cat.color}; width: 28px; height: 28px;">${iconSvg}</span>
                        <span class="category-item-name">${escapeHtml(cat.name)}</span>
                    </div>
                    <div class="category-item-controls">
                        <button type="button" class="soft icon-btn btn-xs" data-action="open-edit-category" data-kind="${kind}" data-index="${originalIndex}" title="Editar categoría" aria-label="Editar categoría">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `<strong class="${sectionClass}">${title}</strong>${itemsHtml}`;
    }).join('');
}

function removeCategory(kind, index) {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    appConfig.categories[kind].splice(index, 1);
    persistConfig();
    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateMovementFilterOptions();
    render();
}

function openEditCategoryModal(kind, index) {
    const cat = appConfig.categories[kind][index];
    if (!cat) return;

    editingCategoryData = { kind, index };
    
    if ($('editCatName')) $('editCatName').value = cat.name;
    if ($('editCatKind')) $('editCatKind').value = kind;

    const gridContainer = $('editIconSelectorGrid');
    const hiddenInput = $('editCatIcon');
    if (gridContainer && hiddenInput) {
        hiddenInput.value = cat.icon || 'Compras';
        gridContainer.innerHTML = Object.keys(categoryIconsMap).map(iconKey => {
            const svgCode = categoryIconsMap[iconKey];
            const isSelected = iconKey === hiddenInput.value ? 'selected' : '';
            return `
                <div class="icon-option-item ${isSelected}" data-icon="${iconKey}" title="${iconKey}">
                    ${svgCode}
                </div>
            `;
        }).join('');
    }

    clearValidationErrors($('categoryEditForm'));
    openModal($('categoryEditDlg'));
}

function renderIconSelector(selectedIcon = 'Compras') {
    const gridContainer = $('iconSelectorGrid');
    const hiddenInput = $('newCatIcon');
    if (!gridContainer || !hiddenInput) return;

    hiddenInput.value = selectedIcon;

    gridContainer.innerHTML = Object.keys(categoryIconsMap).map(iconKey => {
        const svgCode = categoryIconsMap[iconKey];
        const isSelected = iconKey === selectedIcon ? 'selected' : '';
        return `
            <div class="icon-option-item ${isSelected}" data-icon="${iconKey}" title="${iconKey}">
                ${svgCode}
            </div>
        `;
    }).join('');
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
    accordionConfig.forEach(item => {
        setupMainAccordion(item.btnId, item.containerId, item.iconId, item.cardEl);
    });

    setupCategoryTabs();

    if ($('openExportDlgBtn')) {
        $('openExportDlgBtn').addEventListener('click', () => {
            ['expMovements', 'expRemittances', 'expInstallments', 'expDayCounter'].forEach(id => {
                const cb = $(id);
                if (cb) cb.checked = false;
            });
            openModal($('exportDlg'));
        });
    }

    if ($('cancelExportBtn')) {
        $('cancelExportBtn').addEventListener('click', () => {
            closeModal($('exportDlg'));
        });
    }

    if ($('exportForm')) {
        $('exportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            executeCustomExport();
        });
    }

    if ($('importCsvBtn')) {
        $('importCsvBtn').addEventListener('click', () => {
            $('csvFileInput')?.click();
        });
    }

    if ($('csvFileInput')) {
        $('csvFileInput').addEventListener('change', importMovementsCsv);
    }

    if ($('importSelectForm')) {
        $('importSelectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const selection = {
                movements: $('impSelectMovs')?.checked || false,
                remittances: $('impSelectRemit')?.checked || false,
                installments: $('impSelectInst')?.checked || false,
                dayCounter: $('impSelectDays')?.checked || false
            };
            applyImportSelection(selection);
        });
    }

    if ($('cancelImportSelect')) {
        $('cancelImportSelect').addEventListener('click', () => {
            pendingParsedSections = null;
            closeModal($('importSelectDlg'));
        });
    }

    if ($('catChartWrapper')) {
        $('catChartWrapper').addEventListener('click', (e) => {
            const segment = e.target.closest('[data-donut-category]');
            if (segment) {
                toggleDonutSegment(segment.dataset.donutCategory);
            }
        });
    }

    if ($('categories')) {
        $('categories').addEventListener('click', (e) => {
            const item = e.target.closest('[data-list-category]');
            if (item) toggleDonutSegment(item.dataset.listCategory);
        });

        $('categories').addEventListener('keydown', (e) => {
            const item = e.target.closest('[data-list-category]');
            if (item && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleDonutSegment(item.dataset.listCategory);
            }
        });
    }

    document.addEventListener('click', (e) => {
        const chart = $('catChartWrapper');
        const list = $('categories');
        const eventPath = e.composedPath();
        if (
            selectedDonutCategory &&
            chart && list &&
            !eventPath.includes(chart) &&
            !eventPath.includes(list)
        ) {
            selectedDonutCategory = null;
            renderCategoriesRedesign();
        }
    });

    if ($('iconSelectorGrid')) {
        $('iconSelectorGrid').addEventListener('click', (e) => {
            const item = e.target.closest('.icon-option-item');
            if (item && item.dataset.icon) {
                selectCategoryIcon(item.dataset.icon, 'newCatIcon', '#iconSelectorGrid');
            }
        });
    }

    if ($('editIconSelectorGrid')) {
        $('editIconSelectorGrid').addEventListener('click', (e) => {
            const item = e.target.closest('.icon-option-item');
            if (item && item.dataset.icon) {
                selectCategoryIcon(item.dataset.icon, 'editCatIcon', '#editIconSelectorGrid');
            }
        });
    }

    if ($('categoryManagerList')) {
        $('categoryManagerList').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="open-edit-category"]');
            if (btn) {
                openEditCategoryModal(btn.dataset.kind, Number(btn.dataset.index));
            }
        });
    }

    if ($('openCreateCategoryBtn')) {
        $('openCreateCategoryBtn').addEventListener('click', () => {
            if ($('newCatName')) $('newCatName').value = '';
            if ($('newCatKind')) $('newCatKind').value = 'expense';
            renderIconSelector('Compras');
            clearValidationErrors($('categoryCreateForm'));
            openModal($('categoryCreateDlg'));
        });
    }

    if ($('cancelCreateCategoryBtn')) {
        $('cancelCreateCategoryBtn').addEventListener('click', () => {
            clearValidationErrors($('categoryCreateForm'));
            closeModal($('categoryCreateDlg'));
        });
    }

    if ($('categoryCreateForm')) {
        $('categoryCreateForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = $('newCatName');
            const kindSelect = $('newCatKind');
            const iconSelect = $('newCatIcon');

            if (!nameInput || !nameInput.value.trim()) {
                if (nameInput) {
                    nameInput.classList.add('input-error');
                    nameInput.focus();
                }
                return;
            }
            nameInput.classList.remove('input-error');

            const name = nameInput.value.trim();
            const kind = kindSelect ? kindSelect.value : 'expense';
            const icon = iconSelect ? iconSelect.value : 'Compras';

            const autoColors = [
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', 
                '#6366f1', '#d97706', '#14b8a6', '#64748b'
            ];
            
            const totalCategories = appConfig.categories.expense.length + appConfig.categories.income.length;
            const color = autoColors[totalCategories % autoColors.length];

            if (!appConfig.categories[kind].some(c => c.name.toLowerCase() === name.toLowerCase())) {
                appConfig.categories[kind].push({ name, color, icon });
                
                appConfig.categories[kind].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                );

                persistConfig();
                closeModal($('categoryCreateDlg'));
                renderConfigCategories();
                updateCategoryOptions('new');
                updateCategoryOptions('edit');
                updateMovementFilterOptions();
                render();
            } else {
                alert('Esta categoría ya existe.');
                nameInput.focus();
            }
        });
    }

    if ($('cancelEditCategoryBtn')) {
        $('cancelEditCategoryBtn').addEventListener('click', () => {
            closeModal($('categoryEditDlg'));
        });
    }

    if ($('deleteCategoryBtn')) {
        $('deleteCategoryBtn').addEventListener('click', () => {
            if (!editingCategoryData) return;
            const { kind, index } = editingCategoryData;
            closeModal($('categoryEditDlg'));
            removeCategory(kind, index);
        });
    }

    if ($('categoryEditForm')) {
        $('categoryEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!editingCategoryData) return;

            const nameInput = $('editCatName');
            if (!nameInput.value.trim()) {
                nameInput.classList.add('input-error');
                nameInput.focus();
                return;
            }
            nameInput.classList.remove('input-error');

            const newName = nameInput.value.trim();
            const newKind = $('editCatKind').value;
            const newIcon = $('editCatIcon').value;

            const { kind: oldKind, index: oldIndex } = editingCategoryData;
            const targetCat = appConfig.categories[oldKind][oldIndex];

            const exists = appConfig.categories[newKind].some((c, idx) => c.name.toLowerCase() === newName.toLowerCase() && !(oldKind === newKind && idx === oldIndex));
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
                appConfig.categories[k].sort((a, b) => 
                    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
                );
            });

            persistConfig();
            closeModal($('categoryEditDlg'));
            renderConfigCategories();
            updateCategoryOptions('new');
            updateCategoryOptions('edit');
            updateMovementFilterOptions();
            render();
        });
    }

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
                toggleRemitAccordion(header.dataset.remitId);
            }
        });

        listContainer.addEventListener('keydown', (e) => {
            const remId = e.target.dataset.remitId;
            if (!remId) return;

            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();

                if (e.target.classList.contains('remit-concept-field')) {
                    addRemitItem(remId);
                }
            }
        });

        listContainer.addEventListener('input', (e) => {
            const remId = e.target.dataset.remitId;
            if (!remId) return;
            const rem = remittancesList.find(r => r.id === remId);
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
            if (!remId) return;
            const rem = remittancesList.find(r => r.id === remId);
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

            if (rem.sendCurr === 'EUR') {
                e.target.value = val > 0 ? String(val).replace('.', ',') : '';
            } else {
                e.target.value = val > 0 ? String(val) : '';
            }
        });

        listContainer.addEventListener('focusout', (e) => {
            const remId = e.target.dataset.remitId;
            if (!remId) return;
            const rem = remittancesList.find(r => r.id === remId);
            if (!rem) return;

            if (e.target.classList.contains('remit-recv-input')) {
                rem.items[Number(e.target.dataset.index)].recvAmount = parseInputNumber(e.target.value);
                persistRemittancesList();
                renderRemittancesList();
            } else if (e.target.classList.contains('remit-tc-input')) {
                const val = parseInputNumber(e.target.value);
                rem.tc = val > 0 ? val : 1;
                persistRemittancesList();
                renderRemittancesList();
            } else if (e.target.classList.contains('remit-comm-input')) {
                rem.commission = parseInputNumber(e.target.value);
                persistRemittancesList();
                renderRemittancesList();
            }
        });
    }

    if ($('remitEditForm')) {
        $('remitEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!editingRemittanceId) return;

            const nameInput = $('editRemitName');
            if (!nameInput.value.trim()) {
                nameInput.classList.add('input-error');
                nameInput.focus();
                return;
            }
            nameInput.classList.remove('input-error');

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
    }

    if ($('cancelEditRemitBtn')) {
        $('cancelEditRemitBtn').addEventListener('click', () => {
            closeModal($('remitEditDlg'));
        });
    }

    if ($('installmentsList')) {
        $('installmentsList').addEventListener('click', (e) => {
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
                toggleInstallmentAccordion(header.dataset.purchaseId);
            }
        });
    }

    if ($('addDayCounterMonthBtn')) {
        $('addDayCounterMonthBtn').addEventListener('click', () => {
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const defaultName = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
            $('newMonthName').value = defaultName;
            $('newMonthTarget').value = '15';
            clearValidationErrors($('dayCounterMonthNewForm'));
            openModal($('dayCounterMonthNewDlg'));
        });
    }

    if ($('cancelNewDayCounterMonth')) {
        $('cancelNewDayCounterMonth').addEventListener('click', () => closeModal($('dayCounterMonthNewDlg')));
    }

    if ($('dayCounterMonthNewForm')) {
        $('dayCounterMonthNewForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = $('newMonthName');
            const targetInput = $('newMonthTarget');
            if (!nameInput.value.trim() || !targetInput.value) return;

            dayCounterMonths.push({
                id: crypto.randomUUID(),
                name: nameInput.value.trim(),
                targetDays: parseInt(targetInput.value) || 15,
                expanded: true,
                days: []
            });
            persistDayCounter();
            closeModal($('dayCounterMonthNewDlg'));
            renderDayCounter();
        });
    }

    if ($('cancelEditDayCounterMonth')) {
        $('cancelEditDayCounterMonth').addEventListener('click', () => closeModal($('dayCounterMonthEditDlg')));
    }

    if ($('deleteMonthModalBtn')) {
        $('deleteMonthModalBtn').addEventListener('click', () => {
            if (!editingMonthId) return;
            if (confirm('¿Eliminar este mes y todos sus días registrados?')) {
                dayCounterMonths = dayCounterMonths.filter(x => x.id !== editingMonthId);
                persistDayCounter();
                closeModal($('dayCounterMonthEditDlg'));
                renderDayCounter();
            }
        });
    }

    if ($('dayCounterMonthEditForm')) {
        $('dayCounterMonthEditForm').addEventListener('submit', (e) => {
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
    }

    if ($('dayCounterMonthsList')) {
        const listEl = $('dayCounterMonthsList');

        listEl.addEventListener('click', (e) => {
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
                const copyWrapper = $('copyPreviousDayWrapper');
                if (month && month.days && month.days.length > 0) {
                    copyWrapper.style.display = 'block';
                } else {
                    copyWrapper.style.display = 'none';
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
                const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
                const day = month?.days[editingDayIndex];
                if (day) {
                    $('dayDlgTitle').textContent = 'Editar día de trabajo';
                    $('dayDate').value = day.date;
                    $('dayNameDisplay').value = day.dayName;
                    $('dayEntryTime').value = day.entryTime;
                    $('dayExitTime').value = day.exitTime;
                    $('dayLocation').value = day.location;
                    $('copyPreviousDayWrapper').style.display = 'none';

                    if ($('dayModalActionsSplit')) $('dayModalActionsSplit').style.display = 'flex';
                    if ($('dayModalActionsNormal')) $('dayModalActionsNormal').style.display = 'none';

                    clearValidationErrors($('dayCounterDayForm'));
                    openModal($('dayCounterDayDlg'));
                }
                return;
            }
        });
    }

    if ($('deleteDayModalBtn')) {
        $('deleteDayModalBtn').onclick = () => {
            if (editingDayMonthId !== null && editingDayIndex !== null) {
                if (confirm('¿Eliminar este día registrado?')) {
                    const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
                    if (month && month.days) {
                        const daysWrapper = document.querySelector(`#dc_month_details_${editingDayMonthId} .dc-days-wrapper`);
                        const savedScrollTop = daysWrapper ? daysWrapper.scrollTop : 0;

                        month.days.splice(editingDayIndex, 1);
                        persistDayCounter();
                        closeModal($('dayCounterDayDlg'));
                        renderDayCounter();

                        const updatedWrapper = document.querySelector(`#dc_month_details_${editingDayMonthId} .dc-days-wrapper`);
                        if (updatedWrapper) {
                            updatedWrapper.scrollTop = savedScrollTop;
                        }
                    }
                }
            }
        };
    }

    if ($('dayDate')) {
        $('dayDate').addEventListener('change', () => {
            const dateStr = $('dayDate').value;
            $('dayNameDisplay').value = getDayNameFromDate(dateStr);
        });
    }

    if ($('dayEntryTime')) {
        $('dayEntryTime').addEventListener('change', () => {
            $('dayExitTime').value = calculateExitTime($('dayEntryTime').value);
        });
    }

    if ($('copyPreviousDayBtn')) {
        $('copyPreviousDayBtn').addEventListener('click', () => {
            const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
            if (month && month.days && month.days.length > 0) {
                const lastDay = month.days[month.days.length - 1];
                $('dayEntryTime').value = lastDay.entryTime;
                $('dayExitTime').value = lastDay.exitTime;
                $('dayLocation').value = lastDay.location;
            }
        });
    }

    if ($('cancelDayCounterDay')) {
        $('cancelDayCounterDay').addEventListener('click', () => closeModal($('dayCounterDayDlg')));
    }
    if ($('cancelDayCounterDayNormal')) {
        $('cancelDayCounterDayNormal').addEventListener('click', () => closeModal($('dayCounterDayDlg')));
    }

    if ($('dayCounterDayForm')) {
        $('dayCounterDayForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const month = dayCounterMonths.find(x => x.id === editingDayMonthId);
            if (!month) return;

            const dateStr = $('dayDate').value;
            const entryStr = $('dayEntryTime').value;
            const exitStr = $('dayExitTime').value;
            const locationStr = $('dayLocation').value.trim();

            if (!dateStr) return;

            if (!month.days) month.days = [];
            const duplicateIndex = month.days.findIndex((d, idx) => d.date === dateStr && (editingDayIndex === null || idx !== editingDayIndex));
            
            if (duplicateIndex !== -1) {
                alert('Este día ya ha sido registrado en este mes.');
                $('dayDate').focus();
                return;
            }

            const daysWrapperBefore = document.querySelector(`#dc_month_details_${month.id} .dc-days-wrapper`);
            const savedScrollTop = daysWrapperBefore ? daysWrapperBefore.scrollTop : 0;

            const dayObj = {
                date: dateStr,
                dayName: getDayNameFromDate(dateStr),
                entryTime: entryStr,
                exitTime: exitStr,
                location: locationStr || ''
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
                if (editingDayIndex === null) {
                    daysWrapperAfter.scrollTop = daysWrapperAfter.scrollHeight;
                } else {
                    daysWrapperAfter.scrollTop = savedScrollTop;
                }
            }
        });
    }

    if ($('addBtn')) $('addBtn').addEventListener('click', openNewMovement);
    
    if ($('cancelNew')) $('cancelNew').addEventListener('click', () => {
        clearValidationErrors($('newForm'));
        closeModal($('newDlg'));
    });
    if ($('cancelEdit')) $('cancelEdit').addEventListener('click', () => {
        clearValidationErrors($('editForm'));
        closeModal($('editDlg'));
    });

    if ($('newKind')) $('newKind').addEventListener('change', () => updateCategoryOptions('new'));
    if ($('editKind')) $('editKind').addEventListener('change', () => updateCategoryOptions('edit'));

    if ($('month')) $('month').addEventListener('change', render);
    if ($('search')) $('search').addEventListener('input', render);
    if ($('movementFilter')) $('movementFilter').addEventListener('change', render);
    if ($('closeDetailBtn')) $('closeDetailBtn').addEventListener('click', () => closeModal($('detailDlg')));

    if ($('rows')) {
        $('rows').addEventListener('click', event => {
            const editBtn = event.target.closest('[data-edit]');
            const row = event.target.closest('.movement-row');

            if (editBtn) return editMovement(editBtn.dataset.edit);
            if (row) {
                const itemBtn = row.querySelector('[data-edit]');
                if (itemBtn) showMovementDetail(itemBtn.dataset.edit);
            }
        });
    }

    if ($('newForm')) {
        $('newForm').addEventListener('submit', event => {
            event.preventDefault();
            
            const descInput = $('newDesc');
            const amountInput = $('newAmount');
            const dateInput = $('newDate');

            let isValid = true;
            [descInput, amountInput, dateInput].forEach(el => {
                if (!el.value.trim()) {
                    el.classList.add('input-error');
                    isValid = false;
                } else {
                    el.classList.remove('input-error');
                }
            });

            if (!isValid) {
                const firstInvalid = event.target.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const item = {
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                desc: descInput.value.trim(),
                kind: $('newKind').value,
                amount: Math.round(Number(amountInput.value) * 100) / 100,
                date: dateInput.value,
                category: $('newCategory').value,
                notes: $('newNotes').value.trim()
            };

            movements.push(item);
            persist();
            clearValidationErrors($('newForm'));
            closeModal($('newDlg'));
            if ($('month')) $('month').value = item.date.slice(0, 7);
            render();
        });
    }

    if ($('editForm')) {
        $('editForm').addEventListener('submit', event => {
            event.preventDefault();
            if (!editingId) return;

            const descInput = $('editDesc');
            const amountInput = $('editAmount');
            const dateInput = $('editDate');

            let isValid = true;
            [descInput, amountInput, dateInput].forEach(el => {
                if (!el.value.trim()) {
                    el.classList.add('input-error');
                    isValid = false;
                } else {
                    el.classList.remove('input-error');
                }
            });

            if (!isValid) {
                const firstInvalid = event.target.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const existingItem = movements.find(m => m.id === editingId);
            const item = {
                id: editingId,
                timestamp: existingItem?.timestamp || Date.now(),
                desc: descInput.value.trim(),
                kind: $('editKind').value,
                amount: Math.round(Number(amountInput.value) * 100) / 100,
                date: dateInput.value,
                category: $('editCategory').value,
                notes: $('editNotes').value.trim()
            };

            movements = movements.map(existing => existing.id === editingId ? item : existing);
            persist();
            clearValidationErrors($('editForm'));
            closeModal($('editDlg'));
            render();
        });
    }

    if ($('configBtn')) {
        $('configBtn').addEventListener('click', () => {
            $('userNameInput').value = appConfig.userName;
            $('currencySelect').value = appConfig.currency || 'EUR';
            $('themeSelect').value = appConfig.theme || 'light';

            const utils = appConfig.utilities || { financeManager: true, remittances: true, installments: true, dayCounter: true };
            if ($('toggleUtilFinanceManager')) $('toggleUtilFinanceManager').checked = utils.financeManager !== false;
            if ($('toggleUtilRemit')) $('toggleUtilRemit').checked = utils.remittances !== false;
            if ($('toggleUtilInstallments')) $('toggleUtilInstallments').checked = utils.installments !== false;
            if ($('toggleUtilDayCounter')) $('toggleUtilDayCounter').checked = utils.dayCounter !== false;

            openModal($('configDlg'));
        });
    }

    if ($('saveConfigBtn')) {
        $('saveConfigBtn').addEventListener('click', () => {
            const newName = $('userNameInput').value.trim();
            if (newName) appConfig.userName = newName;
            appConfig.currency = $('currencySelect').value;
            appConfig.theme = $('themeSelect').value;

            appConfig.utilities = {
                financeManager: $('toggleUtilFinanceManager') ? $('toggleUtilFinanceManager').checked : true,
                remittances: $('toggleUtilRemit') ? $('toggleUtilRemit').checked : true,
                installments: $('toggleUtilInstallments') ? $('toggleUtilInstallments').checked : true,
                dayCounter: $('toggleUtilDayCounter') ? $('toggleUtilDayCounter').checked : true
            };

            persistConfig();
            updateCategoryOptions('new');
            updateCategoryOptions('edit');
            updateMovementFilterOptions();
            render();
            closeModal($('configDlg'));
        });
    }

    if ($('cancelConfigBtn')) $('cancelConfigBtn').addEventListener('click', () => closeModal($('configDlg')));

    if ($('editCategoriesBtn')) {
        $('editCategoriesBtn').addEventListener('click', () => {
            renderConfigCategories();
            clearValidationErrors($('categoriesDlg'));
            openModal($('categoriesDlg'));
        });
    }

    if ($('closeCategoriesDlg')) $('closeCategoriesDlg').addEventListener('click', () => {
        clearValidationErrors($('categoriesDlg'));
        closeModal($('categoriesDlg'));
    });

    if ($('addRemittanceBtn')) {
        $('addRemittanceBtn').addEventListener('click', () => {
            $('remitNewForm')?.reset();
            if ($('newRemitName')) {
                const monthName = today.toLocaleDateString('es-ES', { month: 'long' });
                const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                $('newRemitName').value = `${capitalizedMonth} ${today.getFullYear()}`;
            }
            clearValidationErrors($('remitNewForm'));
            openModal($('remitNewDlg'));
        });
    }

    if ($('cancelNewRemitBtn')) $('cancelNewRemitBtn').addEventListener('click', () => {
        clearValidationErrors($('remitNewForm'));
        closeModal($('remitNewDlg'));
    });

    if ($('remitNewForm')) {
        $('remitNewForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const remitNameInput = $('newRemitName');
            if (!remitNameInput.value.trim()) {
                remitNameInput.classList.add('input-error');
                remitNameInput.focus();
                return;
            }
            remitNameInput.classList.remove('input-error');

            remittancesList.push({
                id: crypto.randomUUID(),
                name: remitNameInput.value.trim(),
                sendCurr: $('newRemitSendCurr').value,
                recvCurr: $('newRemitRecvCurr').value,
                tc: 3.75,
                commission: 0,
                expanded: true,
                items: []
            });
            persistRemittancesList();
            clearValidationErrors($('remitNewForm'));
            closeModal($('remitNewDlg'));
            renderRemittancesList();
        });
    }

    ['new', 'edit'].forEach(prefix => {
        ['FinancedAmount', 'InterestAmount', 'TotalCount'].forEach(field => {
            const el = $(`${prefix}Inst${field}`);
            if (el) el.addEventListener('input', () => autoCalculateInstallment(prefix));
        });
    });

    if ($('addInstallmentPurchaseBtn')) {
        $('addInstallmentPurchaseBtn').addEventListener('click', () => {
            $('installmentNewForm')?.reset();
            if ($('newInstFirstDate')) {
                $('newInstFirstDate').value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
            }
            clearValidationErrors($('installmentNewForm'));
            openModal($('installmentNewDlg'));
        });
    }

    if ($('cancelNewInstallmentBtn')) $('cancelNewInstallmentBtn').addEventListener('click', () => {
        clearValidationErrors($('installmentNewForm'));
        closeModal($('installmentNewDlg'));
    });

    if ($('installmentNewForm')) {
        $('installmentNewForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = $('newInstName');
            const financedInput = $('newInstFinancedAmount');
            const countInput = $('newInstTotalCount');
            const regularInput = $('newInstRegularAmount');
            const dateInput = $('newInstFirstDate');

            let isValid = true;
            [nameInput, financedInput, countInput, regularInput, dateInput].forEach(el => {
                if (!el.value.trim()) {
                    el.classList.add('input-error');
                    isValid = false;
                } else {
                    el.classList.remove('input-error');
                }
            });

            if (!isValid) {
                const firstInvalid = e.target.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const financedAmount = parseFloat(financedInput.value.replace(',', '.')) || 0;
            const interestAmount = parseFloat($('newInstInterestAmount').value.replace(',', '.')) || 0;
            const totalAmount = financedAmount + interestAmount;
            const totalCount = parseInt(countInput.value) || 1;
            const regularAmount = parseFloat(regularInput.value.replace(',', '.')) || 0;
            const finalAmountInput = $('newInstFinalAmount').value.trim();
            const finalAmount = finalAmountInput ? parseFloat(finalAmountInput.replace(',', '.')) : regularAmount;
            const firstDateStr = dateInput.value;

            installmentsPurchases.push({
                id: crypto.randomUUID(),
                name: nameInput.value.trim(),
                currency: $('newInstCurrency').value,
                financedAmount,
                interestAmount,
                totalAmount,
                totalCount,
                regularAmount,
                finalAmount,
                firstDate: firstDateStr,
                expanded: false,
                installments: buildInstallmentsArray(totalCount, regularAmount, finalAmount, firstDateStr)
            });

            persistInstallments();
            clearValidationErrors($('installmentNewForm'));
            closeModal($('installmentNewDlg'));
            renderInstallments();
        });
    }

    if ($('installmentEditForm')) {
        $('installmentEditForm').addEventListener('submit', (e) => {
            e.preventDefault();
            if (!editingInstallmentId) return;

            const nameInput = $('editInstName');
            const financedInput = $('editInstFinancedAmount');
            const countInput = $('editInstTotalCount');
            const regularInput = $('editInstRegularAmount');
            const dateInput = $('editInstFirstDate');

            let isValid = true;
            [nameInput, financedInput, countInput, regularInput, dateInput].forEach(el => {
                if (!el.value.trim()) {
                    el.classList.add('input-error');
                    isValid = false;
                } else {
                    el.classList.remove('input-error');
                }
            });

            if (!isValid) {
                const firstInvalid = e.target.querySelector('.input-error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const financedAmount = parseFloat(financedInput.value.replace(',', '.')) || 0;
            const interestAmount = parseFloat($('editInstInterestAmount').value.replace(',', '.')) || 0;
            const totalAmount = financedAmount + interestAmount;
            const totalCount = parseInt(countInput.value) || 1;
            const regularAmount = parseFloat(regularInput.value.replace(',', '.')) || 0;
            const finalAmountInput = $('editInstFinalAmount').value.trim();
            const finalAmount = finalAmountInput ? parseFloat(finalAmountInput.replace(',', '.')) : regularAmount;
            const firstDateStr = dateInput.value;

            const existing = installmentsPurchases.find(p => p.id === editingInstallmentId);
            const updatedInstallments = buildInstallmentsArray(totalCount, regularAmount, finalAmount, firstDateStr, existing?.installments);

            installmentsPurchases = installmentsPurchases.map(p => p.id === editingInstallmentId ? {
                ...p,
                name: nameInput.value.trim(),
                currency: $('editInstCurrency').value,
                financedAmount,
                interestAmount,
                totalAmount,
                totalCount,
                regularAmount,
                finalAmount,
                firstDate: firstDateStr,
                installments: updatedInstallments
            } : p);

            persistInstallments();
            clearValidationErrors($('installmentEditForm'));
            closeModal($('installmentEditDlg'));
            renderInstallments();
        });
    }
}

function init() {
    if ($('month')) $('month').value = currentMonth;
    if ($('newDate')) $('newDate').value = `${currentMonth}-${pad(today.getDate())}`;

    if ($('movementsCard')) $('movementsCard').classList.add('expanded');
    if ($('movementsContainer')) $('movementsContainer').style.display = 'block';
    if ($('toggleMovementsIcon')) $('toggleMovementsIcon').innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';

    bindEvents();
    applyTheme();
    applyUtilitiesVisibility();
    updateUserDisplay();
    updateCurrencyLabels();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateMovementFilterOptions();
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();
    render();
}

init();