export const $ = (id) => document.getElementById(id);

export const today = new Date();
export const pad = (number) => String(number).padStart(2, '0');
export const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

export const SPANISH_MONTH_NAMES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
export const WEEKDAY_LABELS_MON = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

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

/* Estado centralizado para que cualquier módulo pueda leerlo o actualizarlo */
export const state = {
    appConfig: JSON.parse(localStorage.getItem('finanzas_config_v1')) || DEFAULT_CONFIG,
    movements: JSON.parse(localStorage.getItem('finanzas_movimientos_v1') || '[]'),
    remittancesList: JSON.parse(localStorage.getItem('finanzas_remesas_cards_v3') || '[]').map(r => ({ ...r, expanded: false })),
    installmentsPurchases: JSON.parse(localStorage.getItem('finanzas_cuotas_v1') || '[]').map(p => ({ ...p, expanded: false })),
    dayCounterMonths: JSON.parse(localStorage.getItem('finanzas_day_counter_v1') || '[]'),
    activeAppSection: 'financeManager'
};

export const persist = () => localStorage.setItem('finanzas_movimientos_v1', JSON.stringify(state.movements));
export const persistRemittancesList = () => localStorage.setItem('finanzas_remesas_cards_v3', JSON.stringify(state.remittancesList));
export const persistInstallments = () => localStorage.setItem('finanzas_cuotas_v1', JSON.stringify(state.installmentsPurchases));
export const persistDayCounter = () => localStorage.setItem('finanzas_day_counter_v1', JSON.stringify(state.dayCounterMonths));
export const persistConfigRaw = () => localStorage.setItem('finanzas_config_v1', JSON.stringify(state.appConfig));

/* Formateo y utilidades */
const CURRENCY_SYMBOLS = { EUR: '€', USD: '$', PEN: 'S/' };
export const getCurrencySymbol = (code) => CURRENCY_SYMBOLS[code] || '€';

export const formatCurrencyCustom = (amount, code) => {
    const num = Number(amount) || 0;
    const [intPart, decPart] = num.toFixed(2).split('.');
    if (code === 'PEN') return `S/ ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decPart}`;
    if (code === 'USD') return `$${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decPart}`;
    return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decPart} €`;
};

export const formatMoney = (amount) => formatCurrencyCustom(amount, state.appConfig.currency);

export const formatPlainInputValue = (val, currCode) => {
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

export const formatNumberDisplay = (val, currCode) => (isNaN(val) || val <= 0) ? '' : formatCurrencyCustom(val, currCode);

export const formatTcInputValue = (val, recvCurrCode) => {
    if (isNaN(val) || val <= 0) return '';
    const [intPart, decPart] = Number(val).toFixed(4).split('.');
    const cleanDecimal = decPart.replace(/0+$/, '');
    const str = cleanDecimal ? `${intPart}.${cleanDecimal}` : intPart;
    return recvCurrCode === 'EUR' ? str.replace('.', ',') : str;
};

export function parseInputNumber(rawValue) {
    if (!rawValue) return 0;
    let s = String(rawValue).replace(/S\/.?|[€$A-Za-z\s]/g, '').trim();

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
export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => HTML_ESCAPE_MAP[char]);

export function formatDateEs(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

export function toIsoDateLocal(dateObj) {
    return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
}

export function parseIsoParts(isoStr) {
    const [y, m, d] = String(isoStr || '').split('-').map(Number);
    if (!y || !m || !d) return null;
    return { y, m, d };
}

export function toIsoFromParts(y, mZeroBased, d) {
    return `${y}-${pad(mZeroBased + 1)}-${pad(d)}`;
}

export function clearValidationErrors(formEl) {
    formEl?.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

export function validateRequiredFields(formEl, fields) {
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

export function scrollCardIntoView(cardEl, shouldScroll = true) {
    if (!shouldScroll || !cardEl) return;
    requestAnimationFrame(() => {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

export function lockBodyScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('no-scroll');
}

/* Hook para que main.js limpie el gesto táctil al abrir cualquier modal */
let onBeforeOpenModalHook = null;
export function setBeforeOpenModalHook(fn) {
    onBeforeOpenModalHook = fn;
}

export function openModal(dialog) {
  if (!dialog) return;
  if (!dialog.open) dialog.showModal();
  if (document.activeElement instanceof HTMLElement && dialog.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  document.body.classList.add('no-scroll');
}

export function closeModal(dialogEl) {
    if (!dialogEl) return;
    dialogEl.close();
    if (!$('navDrawer')?.classList.contains('is-open')) {
        document.body.classList.remove('no-scroll');
    }
}