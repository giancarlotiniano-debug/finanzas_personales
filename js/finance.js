import {
    $, state, today, pad, currentMonth,
    SPANISH_MONTH_NAMES, WEEKDAY_LABELS_MON,
    persist, persistConfigRaw, getCurrencySymbol, formatMoney,
    parseInputNumber, escapeHtml, formatDateEs,
    toIsoDateLocal, parseIsoParts, toIsoFromParts,
    clearValidationErrors, validateRequiredFields,
    openModal, closeModal
} from './shared.js';

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

const FILTER_STORAGE_KEY = 'finanzas_filtros_v1';
const DEFAULT_MOVEMENT_FILTERS = {
    query: '',
    kind: 'all',
    category: 'all',
    dateMode: 'all',
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null
};

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

let editingId = null;
let editingCategoryData = null;
let activeFinanceViewMode = 'movements';
let currentCatKind = 'expense';
let selectedDonutCategory = null;
let currentUsageText = 'Sin movimientos registrados';
let movementFilters = loadSavedFilters();

let filterDraft = {
    query: '', kind: 'all', category: 'all', dateMode: 'all',
    pickerOpen: false, startDate: '', endDate: '', anchorDate: '',
    minAmount: null, maxAmount: null,
    calYear: today.getFullYear(), calMonth: today.getMonth(),
    pickerYear: today.getFullYear(), pickerMonth: today.getMonth()
};

const persistFilters = () => localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(movementFilters));

export function updateFinanceCurrencyLabels() {
    const symbol = getCurrencySymbol(state.appConfig.currency);
    if ($('newAmountLabel')) $('newAmountLabel').textContent = `Importe (${symbol})`;
    if ($('editAmountLabel')) $('editAmountLabel').textContent = `Importe (${symbol})`;
    if ($('filterCurrMin')) $('filterCurrMin').textContent = symbol;
    if ($('filterCurrMax')) $('filterCurrMax').textContent = symbol;
}

const isDesktopFinanceLayout = () => window.matchMedia && window.matchMedia('(min-width: 761px)').matches;

function setFinanceViewMode(mode) {
    activeFinanceViewMode = mode === 'categories' ? 'categories' : 'movements';
    selectedDonutCategory = null;

    const btnMov = $('switchModeMovements');
    const btnCat = $('switchModeCategories');
    const isCategories = activeFinanceViewMode === 'categories';

    btnMov?.classList.toggle('active', !isCategories);
    btnMov?.setAttribute('aria-selected', String(!isCategories));
    btnCat?.classList.toggle('active', isCategories);
    btnCat?.setAttribute('aria-selected', String(isCategories));

    if ($('activeViewTitle')) $('activeViewTitle').textContent = 'Movimientos';
    updateActiveFilterCaption();

    $('movementsCard')?.classList.toggle('is-hidden', isCategories);
    $('categoriesCard')?.classList.toggle('is-hidden', !isCategories);
    renderFinance();
}

const getSortedCategories = (kind) =>
    [...(state.appConfig.categories[kind] || [])].sort((a, b) =>
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
    renderFinance();
}

/* --- Filtros --- */
function getMonthRangeIso(year, monthZeroBased) {
    const startDate = toIsoFromParts(year, monthZeroBased, 1);
    const lastDay = new Date(year, monthZeroBased + 1, 0).getDate();
    return { startDate, endDate: toIsoFromParts(year, monthZeroBased, lastDay) };
}

function getMondayToSundayWeekRange(isoDateStr) {
    const parts = parseIsoParts(isoDateStr) || { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };
    const jsDay = new Date(parts.y, parts.m - 1, parts.d).getDay();
    const diffFromMonday = (jsDay + 6) % 7;
    const monday = new Date(parts.y, parts.m - 1, parts.d - diffFromMonday);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    return { startDate: toIsoDateLocal(monday), endDate: toIsoDateLocal(sunday) };
}

function getAvailableFilterYears() {
    const years = new Set();
    for (let y = 1990; y <= 2050; y++) years.add(y);
    state.movements.forEach(m => {
        const y = Number(String(m.date || '').slice(0, 4));
        if (y) years.add(y);
    });
    if (Number(filterDraft.pickerYear)) years.add(Number(filterDraft.pickerYear));
    return Array.from(years).sort((a, b) => a - b);
}

function computeRangeForMode(mode, seedDateStr, yearVal, monthZeroBased) {
    if (mode === 'all') return { startDate: '', endDate: '', anchorDate: seedDateStr || toIsoDateLocal(today) };

    const safeSeed = seedDateStr || toIsoDateLocal(today);
    const seedParts = parseIsoParts(safeSeed) || { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };

    if (mode === 'day') return { startDate: safeSeed, endDate: safeSeed, anchorDate: safeSeed };
    if (mode === 'week') {
        const wk = getMondayToSundayWeekRange(safeSeed);
        return { startDate: wk.startDate, endDate: wk.endDate, anchorDate: safeSeed };
    }
    if (mode === 'year') return { startDate: `${yearVal}-01-01`, endDate: `${yearVal}-12-31`, anchorDate: safeSeed };
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
    return { startDate: mr.startDate, endDate: mr.endDate, anchorDate: toIsoFromParts(yearVal, monthZeroBased, clampedDay) };
}

function scrollActiveWheelOptionsIntoView() {
    requestAnimationFrame(() => {
        $('filterDatePickerPanel')?.querySelectorAll('.filter-wheel-col').forEach(col => {
            col.querySelector('.filter-wheel-option.active')?.scrollIntoView({ block: 'center', behavior: 'instant' });
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
        const startOffset = (new Date(calYear, calMonth, 1).getDay() + 6) % 7;
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
            const nextM = calMonth === 11 ? 0 : calMonth + 1;
            const nextY = calMonth === 11 ? calYear + 1 : calYear;
            for (let dNum = 1; dNum <= 7 - remainder; dNum++) {
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
                'filter-cal-day', c.outside ? 'is-outside' : '', isToday ? 'is-today' : '',
                isInWeek ? 'is-in-week' : '', isWeekStart ? 'is-week-start' : '',
                isWeekEnd ? 'is-week-end' : '', isSelected ? 'is-selected' : ''
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
        panel.innerHTML = `
            <div class="filter-picker-cols">
                <div class="filter-wheel-col" id="filterMonthCol">${SPANISH_MONTH_NAMES.map((name, idx) => `<button type="button" class="filter-wheel-option ${idx === filterDraft.pickerMonth ? 'active' : ''}" data-pick-month="${idx}">${name}</button>`).join('')}</div>
                <div class="filter-wheel-col" id="filterYearCol">${years.map(y => `<button type="button" class="filter-wheel-option ${y === filterDraft.pickerYear ? 'active' : ''}" data-pick-year="${y}">${y}</button>`).join('')}</div>
            </div>
        `;
        scrollActiveWheelOptionsIntoView();
    } else if (filterDraft.dateMode === 'year') {
        const years = getAvailableFilterYears();
        panel.innerHTML = `
            <div class="filter-picker-cols single-col">
                <div class="filter-wheel-col" id="filterYearCol">${years.map(y => `<button type="button" class="filter-wheel-option ${y === filterDraft.pickerYear ? 'active' : ''}" data-pick-year="${y}">${y}</button>`).join('')}</div>
            </div>
        `;
        scrollActiveWheelOptionsIntoView();
    } else if (filterDraft.dateMode === 'custom') {
        panel.innerHTML = `
            <div class="filter-two-cols">
                <div class="field"><label for="filterStartDate">Desde</label><input type="date" id="filterStartDate" value="${escapeHtml(filterDraft.startDate || '')}"></div>
                <div class="field"><label for="filterEndDate">Hasta</label><input type="date" id="filterEndDate" value="${escapeHtml(filterDraft.endDate || '')}"></div>
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
    ) || { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };

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
    if (mode === 'day' && filters.startDate) parts.push(`Día: ${formatDateEs(filters.startDate)}`);
    else if (mode === 'week' && filters.startDate && filters.endDate) parts.push(`Semana: ${formatDateEs(filters.startDate)} al ${formatDateEs(filters.endDate)}`);
    else if (mode === 'month' && filters.startDate) {
        const p = parseIsoParts(filters.startDate);
        if (p) parts.push(`Mes: ${SPANISH_MONTH_NAMES[p.m - 1] || ''} ${p.y}`);
    } else if (mode === 'year' && filters.startDate) {
        const yearStr = String(filters.startDate).slice(0, 4);
        if (yearStr) parts.push(`Año: ${yearStr}`);
    } else if (mode === 'custom' && (filters.startDate || filters.endDate)) {
        parts.push(`Rango: ${filters.startDate ? formatDateEs(filters.startDate) : '...'} al ${filters.endDate ? formatDateEs(filters.endDate) : '...'}`);
    }

    if (filters.kind === 'expense') parts.push(filters.category && filters.category !== 'all' ? `Gastos: ${filters.category}` : 'Gastos');
    else if (filters.kind === 'income') parts.push(filters.category && filters.category !== 'all' ? `Ingresos: ${filters.category}` : 'Ingresos');

    if (filters.minAmount !== null && filters.maxAmount !== null) parts.push(`Importe: ${formatMoney(filters.minAmount)} a ${formatMoney(filters.maxAmount)}`);
    else if (filters.minAmount !== null) parts.push(`Importe desde ${formatMoney(filters.minAmount)}`);
    else if (filters.maxAmount !== null) parts.push(`Importe hasta ${formatMoney(filters.maxAmount)}`);

    return parts.length ? parts.join(' · ') : 'Sin filtros';
}

function updateActiveFilterCaption() {
    const labelText = formatActiveFilterLabel(movementFilters);
    if ($('activeFilterCaption')) $('activeFilterCaption').textContent = labelText;
    if ($('activeCategoryFilterCaption')) $('activeCategoryFilterCaption').textContent = labelText;
}

function updateFilterButtonIndicator() {
    $('openFilterBtn')?.classList.toggle('has-active-filters', hasActiveFilters(movementFilters));
}

function openFilterDialog() {
    updateFinanceCurrencyLabels();
    const activeStart = movementFilters.startDate || toIsoDateLocal(today);
    const refParts = parseIsoParts(activeStart) || { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() };

    filterDraft = {
        query: movementFilters.query || '',
        kind: movementFilters.kind || 'all',
        category: movementFilters.category || 'all',
        dateMode: movementFilters.dateMode || 'all',
        pickerOpen: false,
        startDate: movementFilters.startDate || '',
        endDate: movementFilters.endDate || '',
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

    if ($('filterMinAmount')) $('filterMinAmount').value = filterDraft.minAmount !== null ? String(filterDraft.minAmount).replace('.', ',') : '';
    if ($('filterMaxAmount')) $('filterMaxAmount').value = filterDraft.maxAmount !== null ? String(filterDraft.maxAmount).replace('.', ',') : '';
    openModal($('filterDlg'));
}

function clearFilterDialogDraft() {
    filterDraft = {
        query: '', kind: 'all', category: 'all', dateMode: 'all', pickerOpen: false,
        startDate: '', endDate: '', anchorDate: toIsoDateLocal(today),
        minAmount: null, maxAmount: null,
        calYear: today.getFullYear(), calMonth: today.getMonth(),
        pickerYear: today.getFullYear(), pickerMonth: today.getMonth()
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

    return state.movements
        .filter(item => {
            if (startRange && item.date < startRange) return false;
            if (endRange && item.date > endRange) return false;
            if (movementFilters.kind !== 'all' && item.kind !== movementFilters.kind) return false;
            if (movementFilters.kind !== 'all' && movementFilters.category !== 'all' && item.category !== movementFilters.category) return false;
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
    if (!incomeFillEl || !expenseFillEl || !tooltipEl) return;

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
        incomeFillEl.style.width = '100%';
        expenseFillEl.style.width = `${Math.min(50, Math.max(0, usageRatio * 50))}%`;
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

    const nextState = typeof forceState === 'boolean' ? forceState : !barEl.classList.contains('show-percentage');
    barEl.classList.toggle('show-percentage', nextState);
    barEl.setAttribute('aria-expanded', String(nextState));
    tooltipEl.textContent = currentUsageText;
}

/* --- Renderizado principal --- */
export function renderFinance() {
    const visibleMovements = getFilteredMovements();

    let totalIncome = 0;
    let totalExpenses = 0;
    visibleMovements.forEach(item => {
        if (item.kind === 'income') totalIncome += item.amount;
        else totalExpenses += item.amount;
    });

    if ($('income')) $('income').textContent = formatMoney(totalIncome);
    if ($('expense')) $('expense').textContent = formatMoney(totalExpenses);
    if ($('balance')) $('balance').textContent = formatMoney(totalIncome - totalExpenses);
    updateCashflowUsageBar(totalIncome, totalExpenses);
    updateFilterButtonIndicator();
    updateActiveFilterCaption();

    const chronologicalMovements = [...state.movements].sort((a, b) => {
        const dateCmp = String(a.date || '').localeCompare(String(b.date || ''));
        return dateCmp !== 0 ? dateCmp : (a.timestamp || 0) - (b.timestamp || 0);
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
            rowsHtml += `<tr class="date-header-row"><td colspan="4"><span>${dateFormatted}</span></td></tr>`;
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
                <td class="text-right"><span class="category-text">${escapeHtml(item.category)}</span></td>
                <td class="amount ${item.kind === 'income' ? 'income' : 'expense'}">
                    <div class="movement-amount-stack">
                        <span>${item.kind === 'income' ? '+' : '−'}${formatMoney(item.amount)}</span>
                        <span class="movement-balance-sub">${formatMoney(remainingAfterMove)}</span>
                    </div>
                </td>
            </tr>
        `;
    });

    if ($('rows')) $('rows').innerHTML = rowsHtml;
    if ($('empty')) $('empty').style.display = visibleMovements.length ? 'none' : 'block';

    if (activeFinanceViewMode === 'categories' || isDesktopFinanceLayout()) {
        renderCategoriesRedesign(visibleMovements);
    }
}

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
    const item = state.movements.find(m => m.id === id);
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
            state.movements = state.movements.filter(m => m.id !== editingId);
            persist();
            closeModal($('editDlg'));
            renderFinance();
        };
    }

    clearValidationErrors($('editForm'));
    openModal($('editDlg'));
}

function showMovementDetail(id) {
    const item = state.movements.find(m => m.id === id);
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

/* --- Categorías y Donut --- */
function toggleDonutSegment(categoryName, options = {}) {
    selectedDonutCategory = (selectedDonutCategory === categoryName) ? null : categoryName;
    renderCategoriesRedesign(getFilteredMovements(), {
        scrollToSelected: Boolean(options.scrollToSelected && selectedDonutCategory)
    });
}

function getCategoryMeta(kind, name) {
    const catObj = (state.appConfig.categories[kind] || []).find(c => c.name === name);
    if (!catObj) return { color: 'var(--fondo)', accentColor: 'var(--red)', iconSvg: warningIconSvg };
    const color = catObj.color || 'var(--secundario)';
    const iconSvg = categoryIconsMap[catObj.icon || 'Compras'] || categoryIconsMap['Compras'];
    return { color, accentColor: color, iconSvg };
}

function renderCategoriesRedesign(sourceMovements = getFilteredMovements(), options = {}) {
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
                <svg viewBox="0 0 100 100" class="cat-donut-svg"><circle cx="50" cy="50" r="38" fill="none" stroke="var(--fondo)" stroke-width="16"></circle></svg>
                <div class="cat-center-info"><span class="cat-center-label">Total</span><span class="cat-center-value">${formatMoney(0)}</span></div>
            `;
        }
        if (listContainer) listContainer.innerHTML = `<div class="empty">No hay ${currentCatKind === 'expense' ? 'gastos' : 'ingresos'} en la selección actual.</div>`;
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
                class="cat-donut-segment ${isSelected ? 'selected' : ''}" data-donut-category="${escapeHtml(name)}">
                <title>${escapeHtml(name)}: ${formatMoney(amount)} (${percentage.toFixed(1)}%)</title>
            </circle>
        `;

        if (isSelected) {
            const angle = (midPercent / 100) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + 57 * Math.cos(angle);
            const y = 50 + 57 * Math.sin(angle);
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
                <div class="cat-breakdown-item ${isSelected ? 'selected' : ''}" style="--cat-color: ${accentColor};"
                     data-list-category="${escapeHtml(name)}" role="button" tabindex="0" aria-pressed="${isSelected}">
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
            requestAnimationFrame(() => requestAnimationFrame(() => {
                const targetItem = Array.from(listContainer.querySelectorAll('[data-list-category]')).find(el => el.dataset.listCategory === selectedDonutCategory);
                if (!targetItem) return;
                const containerRect = listContainer.getBoundingClientRect();
                const itemRect = targetItem.getBoundingClientRect();
                if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
                    const centeredOffset = (itemRect.top - containerRect.top + listContainer.scrollTop) - (listContainer.clientHeight - targetItem.clientHeight) / 2;
                    listContainer.scrollTo({ top: Math.max(0, centeredOffset), behavior: 'smooth' });
                }
            }));
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
            const originalIndex = state.appConfig.categories[kind].findIndex(c => c.name === cat.name);
            const iconSvg = categoryIconsMap[cat.icon || 'Compras'] || categoryIconsMap['Compras'];
            return `
                <div class="category-item-row">
                    <div class="flex-center-gap">
                        <span class="editcategory-icon-wrapper" style="color: ${cat.color}; width: 28px; height: 28px;">${iconSvg}</span>
                        <span class="category-item-name">${escapeHtml(cat.name)}</span>
                    </div>
                    <div class="category-item-controls">
                        <button type="button" class="edit-category-button" data-action="open-edit-category" data-kind="${kind}" data-index="${originalIndex}" title="Editar categoría" aria-label="Editar categoría">
                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.2a2.5 2.5 0 0 1 3.5 3.5L7.6 20.1 3.2 21l.9-4.4L16.5 4.2zM14.3 6.4l3.5 3.5"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        return `<strong class="${sectionClass}">${title}</strong>${itemsHtml}`;
    }).join('');
}

function removeCategory(kind, index) {
    const cat = state.appConfig.categories[kind]?.[index];
    if (!cat) return;

    const usageCount = state.movements.filter(m => m.kind === kind && m.category === cat.name).length;
    const message = usageCount > 0
        ? `Hay ${usageCount} movimiento${usageCount === 1 ? '' : 's'} que usa${usageCount === 1 ? '' : 'n'} la categoría "${cat.name}". ¿Eliminarla de todos modos?`
        : `¿Estás seguro de eliminar la categoría "${cat.name}"?`;

    if (!confirm(message)) return;
    state.appConfig.categories[kind].splice(index, 1);
    persistConfigRaw();
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
    const cat = state.appConfig.categories[kind][index];
    if (!cat) return;
    editingCategoryData = { kind, index };
    if ($('editCatName')) $('editCatName').value = cat.name;
    if ($('editCatKind')) $('editCatKind').value = kind;
    renderIconGrid('editIconSelectorGrid', 'editCatIcon', cat.icon || 'Compras');
    clearValidationErrors($('categoryEditForm'));
    openModal($('categoryEditDlg'));
}

function selectCategoryIcon(iconKey, targetInputId, containerSelector) {
    if ($(targetInputId)) $(targetInputId).value = iconKey;
    document.querySelectorAll(`${containerSelector} .icon-option-item`).forEach(el => {
        el.classList.toggle('selected', el.dataset.icon === iconKey);
    });
}

export function initFinance() {
    /* Tabs Gastos / Ingresos de categorías */
    const switchTab = (kind) => {
        currentCatKind = kind;
        selectedDonutCategory = null;
        $('catTabExpense')?.classList.toggle('active', kind === 'expense');
        $('catTabExpense')?.setAttribute('aria-pressed', String(kind === 'expense'));
        $('catTabIncome')?.classList.toggle('active', kind === 'income');
        $('catTabIncome')?.setAttribute('aria-pressed', String(kind === 'income'));
        renderCategoriesRedesign();
    };
    $('catTabExpense')?.addEventListener('click', () => switchTab('expense'));
    $('catTabIncome')?.addEventListener('click', () => switchTab('income'));

    /* Clics en tabla, donut y listas */
    $('rows')?.addEventListener('click', (e) => {
        const row = e.target.closest('tr.movement-row');
        if (row) showMovementDetail(row.dataset.movementId);
    });
    $('catChartWrapper')?.addEventListener('click', (e) => {
        const seg = e.target.closest('[data-donut-category]');
        if (seg) { e.stopPropagation(); toggleDonutSegment(seg.dataset.donutCategory, { scrollToSelected: true }); }
    });
    $('categories')?.addEventListener('click', (e) => {
        const item = e.target.closest('[data-list-category]');
        if (item) { e.stopPropagation(); toggleDonutSegment(item.dataset.listCategory); }
    });
    $('categories')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const item = e.target.closest('[data-list-category]');
            if (item) { e.preventDefault(); toggleDonutSegment(item.dataset.listCategory); }
        }
    });
    document.addEventListener('click', (e) => {
        if (!selectedDonutCategory) return;
        if (!e.target.closest('#catChartWrapper') && !e.target.closest('[data-list-category]')) {
            selectedDonutCategory = null;
            renderCategoriesRedesign();
        }
    });

    /* Gestión de categorías */
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

    /* Eventos de filtros */
    $('openFilterBtn')?.addEventListener('click', openFilterDialog);
    $('cancelFilterBtn')?.addEventListener('click', () => closeModal($('filterDlg')));
    $('resetFiltersBtn')?.addEventListener('click', clearFilterDialogDraft);

    document.querySelectorAll('#filterDlg .filter-seg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterDraft.kind = btn.dataset.filterKind;
            filterDraft.category = 'all';
            syncFilterUIState(filterDraft.kind);
            populateFilterCategorySelect(filterDraft.kind, 'all');
        });
    });
    $('filterCategorySelect')?.addEventListener('change', (e) => { filterDraft.category = e.target.value; });
    document.querySelectorAll('#filterDlg .filter-date-tab').forEach(tab => {
        tab.addEventListener('click', () => handleFilterDateTabClick(tab.dataset.dateMode));
    });

    $('filterDatePickerPanel')?.addEventListener('click', (e) => {
        const navBtn = e.target.closest('[data-cal-nav]');
        if (navBtn) {
            const nextDate = new Date(filterDraft.calYear, filterDraft.calMonth + (navBtn.dataset.calNav === 'next' ? 1 : -1), 1);
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
            if (parts) { filterDraft.calYear = parts.y; filterDraft.calMonth = parts.m - 1; }
            if (filterDraft.dateMode === 'day') { filterDraft.startDate = iso; filterDraft.endDate = iso; }
            else if (filterDraft.dateMode === 'week') {
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
            Object.assign(filterDraft, computeRangeForMode('month', filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth));
            renderFilterDatePanel();
            return;
        }
        const yearBtn = e.target.closest('[data-pick-year]');
        if (yearBtn) {
            filterDraft.pickerYear = Number(yearBtn.dataset.pickYear);
            const modeToCompute = filterDraft.dateMode === 'year' ? 'year' : 'month';
            Object.assign(filterDraft, computeRangeForMode(modeToCompute, filterDraft.anchorDate, filterDraft.pickerYear, filterDraft.pickerMonth));
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

        let startVal = '', endVal = '';
        if (dateModeVal !== 'all') {
            if (dateModeVal === 'custom') {
                startVal = ($('filterStartDate')?.value || filterDraft.startDate || '').trim();
                endVal = ($('filterEndDate')?.value || filterDraft.endDate || '').trim();
                if (startVal && endVal && startVal > endVal) [startVal, endVal] = [endVal, startVal];
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
        if (minVal !== null && maxVal !== null && minVal > maxVal) [minVal, maxVal] = [maxVal, minVal];

        movementFilters = { query: queryVal, kind: kindVal, category: catVal, dateMode: dateModeVal, startDate: startVal, endDate: endVal, minAmount: minVal, maxAmount: maxVal };
        persistFilters();
        closeModal($('filterDlg'));
        renderFinance();
    });

    /* Barra de uso y vista móvil */
    const usageBar = $('cashflowUsageBar');
    usageBar?.addEventListener('click', (e) => { e.stopPropagation(); toggleCashflowUsageTooltip(); });
    usageBar?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggleCashflowUsageTooltip(); }
    });
    document.addEventListener('click', (e) => { if (!e.target.closest('#cashflowUsageBar')) toggleCashflowUsageTooltip(false); });
    document.querySelectorAll('.view-mode-option[data-view-mode]').forEach(btn => {
        btn.addEventListener('click', () => setFinanceViewMode(btn.dataset.viewMode));
    });

    /* Modales CRUD Movimientos y Categorías */
    $('addBtn')?.addEventListener('click', openNewMovement);
    $('cancelNew')?.addEventListener('click', () => closeModal($('newDlg')));
    $('newKind')?.addEventListener('change', () => updateCategoryOptions('new'));

    $('newForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const descInput = $('newDesc'), amountInput = $('newAmount'), dateInput = $('newDate');
        if (!validateRequiredFields($('newForm'), [descInput, amountInput, dateInput])) return;
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) { amountInput.classList.add('input-error'); amountInput.focus(); return; }

        state.movements.unshift({
            id: crypto.randomUUID(), timestamp: Date.now(), desc: descInput.value.trim(),
            kind: $('newKind').value, amount: Math.round(amount * 100) / 100,
            date: dateInput.value, category: $('newCategory').value, notes: $('newNotes').value.trim()
        });
        persist();
        closeModal($('newDlg'));
        renderFinance();
    });

    $('cancelEdit')?.addEventListener('click', () => closeModal($('editDlg')));
    $('editKind')?.addEventListener('change', () => updateCategoryOptions('edit'));

    $('editForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const descInput = $('editDesc'), amountInput = $('editAmount'), dateInput = $('editDate');
        if (!validateRequiredFields($('editForm'), [descInput, amountInput, dateInput])) return;
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) { amountInput.classList.add('input-error'); amountInput.focus(); return; }

        const item = state.movements.find(m => m.id === editingId);
        if (item) {
            Object.assign(item, {
                desc: descInput.value.trim(), kind: $('editKind').value,
                amount: Math.round(amount * 100) / 100, date: dateInput.value,
                category: $('editCategory').value, notes: $('editNotes').value.trim()
            });
            persist();
        }
        closeModal($('editDlg'));
        renderFinance();
    });

    $('closeDetailBtn')?.addEventListener('click', () => closeModal($('detailDlg')));
    $('detailEditBtn')?.addEventListener('click', () => {
        const movId = $('detailEditBtn')?.dataset.movementId;
        closeModal($('detailDlg'));
        if (movId) editMovement(movId);
    });

    $('editCategoriesBtn')?.addEventListener('click', () => { renderConfigCategories(); openModal($('categoriesDlg')); });
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
        const name = nameInput.value.trim(), kind = $('newCatKind').value, icon = $('newCatIcon').value || 'Compras';
        if (state.appConfig.categories[kind].some(c => c.name.toLowerCase() === name.toLowerCase())) {
            alert('Ya existe una categoría con ese nombre en este apartado.');
            return;
        }
        state.appConfig.colorCounter = (state.appConfig.colorCounter || 0) + 1;
        const color = `hsl(${(state.appConfig.colorCounter * 137.508) % 360}, 70%, 50%)`;
        state.appConfig.categories[kind].push({ name, color, icon });
        persistConfigRaw();
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

        const newName = nameInput.value.trim(), newKind = $('editCatKind').value, newIcon = $('editCatIcon').value || 'Compras';
        const { kind: oldKind, index: oldIndex } = editingCategoryData;
        const oldCat = state.appConfig.categories[oldKind][oldIndex];

        if (state.appConfig.categories[newKind].some((c, i) => !(newKind === oldKind && i === oldIndex) && c.name.toLowerCase() === newName.toLowerCase())) {
            alert('Ya existe una categoría con ese nombre en este apartado.');
            return;
        }

        if (oldKind === newKind) {
            oldCat.name = newName;
            oldCat.icon = newIcon;
        } else {
            state.appConfig.categories[oldKind].splice(oldIndex, 1);
            state.appConfig.categories[newKind].push({ name: newName, color: oldCat.color || 'var(--secundario)', icon: newIcon });
        }

        if (oldCat.name !== newName || oldKind !== newKind) {
            state.movements.forEach(m => {
                if (m.kind === oldKind && m.category === oldCat.name) { m.category = newName; m.kind = newKind; }
            });
            persist();
        }
        persistConfigRaw();
        refreshCategoryUI();
        closeModal($('categoryEditDlg'));
    });

    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateFilterButtonIndicator();
    updateActiveFilterCaption();
    renderFinance();
}