/* Finanzas personales — lógica de la aplicación */

const $ = (id) => document.getElementById(id);

/* ==========================================
   0. MAPA MAESTRO DE ICONOS SVG PARA CATEGORÍAS
   ========================================== */
const categoryIconsMap = {
    "Ingresos extras": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M7.5 5h-1.5a1 1 0 0 0 0 2h1a1 1 0 0 1 0 2H5.5"/><path d="M6.5 4v.5M6.5 8.5V9"/><path d="M14 3h3a2 2 0 0 1 2 2v4"/><path d="M16.5 6.5L19 9l2.5-2.5"/><path d="M14 9v3M12.5 10.5h3"/><path d="M2 21v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1H8"/><path d="M14 16l4-3.5a1.5 1.5 0 0 1 2.2 2L16 19.5c-1 .8-2.2 1.5-3.5 1.5H2"/></svg>`,
    "Devoluciones": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M7.5 5h-1.5a1 1 0 0 0 0 2h1a1 1 0 0 1 0 2H5.5"/><path d="M6.5 4v.5M6.5 8.5V9"/><circle cx="18.5" cy="4.5" r="1.8" fill="currentColor"/><path d="M15.5 11v-.5a3 3 0 0 1 6 0v.5"/><path d="M2 21v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1H8"/><path d="M14 16l4-3.5a1.5 1.5 0 0 1 2.2 2L16 19.5c-1 .8-2.2 1.5-3.5 1.5H2"/></svg>`,
    "Salario": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6"/><path d="M3 7a2 2 0 0 0 2 2h8"/><path d="M18 3v6"/><path d="M15.5 6.5L18 9l2.5-2.5"/><circle cx="17.5" cy="14.5" r="1" fill="currentColor"/></svg>`,
    "Suscripciones": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="4" /><path d="M12 17v3" /><path d="M8 20h8" /><circle cx="11" cy="12" r="2" fill="currentColor" /><path d="M13 12V7h2" /></svg>`,
    "Manutencion": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="4" r="1.8" fill="currentColor"/><path d="M7.5 8.5H5a2 2 0 0 0-2 2v5a1.5 1.5 0 0 0 1.5 1.5h3"/><path d="M5.5 17v4"/><circle cx="18.5" cy="4" r="1.8" fill="currentColor"/><path d="M16.5 8.5H19a2 2 0 0 1 2 2v5a1.5 1.5 0 0 1-1.5 1.5h-3"/><path d="M18.5 17v4"/><circle cx="12" cy="8.5" r="1.6" fill="currentColor"/><rect x="9.5" y="12" width="5" height="5" rx="1.5"/><path d="M10.8 17v4M13.2 17v4"/></svg>`,
    "Transporte": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3c4.5-1.3 9.5-1.3 14 0"/><path d="M12 2v4"/><rect x="4" y="6" width="16" height="14" rx="4"/><path d="M4 10h16"/><path d="M4 14h16"/><path d="M12 10v4"/><path d="M8 16v1"/><path d="M16 16v1"/><path d="M8 20l-1.5 2"/><path d="M16 20l1.5 2"/></svg>`,    
    "Alimentacion": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18l-1.5 7.5a2 2 0 0 1-2 1.5h-11a2 2 0 0 1-2-1.5L3 11z"/><path d="M8 14v3M12 14v3M16 14v3"/><path d="M6.5 3h4"/><path d="M7.5 3v3L6 8.5V11M9.5 3v3L11 8.5V11"/><path d="M13 11l3.5-6.5a2.2 2.2 0 0 1 3.7 2.2L17.5 11"/></svg>`,
    "Compras": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h1.5a2 2 0 0 1 1.98 1.7L6.7 14.3A2 2 0 0 0 8.68 16H19"/><path d="M5.6 6h14.1a2 2 0 0 1 1.97 2.35l-.72 4A2 2 0 0 1 19 14H6.65"/><circle cx="8" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor" stroke="none"/></svg>`,
    "Combustible": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16H3z"/><path d="M3 10h11"/><path d="M14 14h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V8l-3-3"/><path d="M18 4l2 2v3h-2V4z" fill="currentColor" stroke="none"/></svg>`,
    "Servicios": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v6" /><path d="M8 4h8" /><path d="M3 10h11a5 5 0 0 1 5 5v2" /><path d="M3 15h10a1 1 0 0 1 1 1v1" /><path d="M13 17h7" /><path d="M16.5 20.5c-.83 0-1.5-.67-1.5-1.5 0-1 1.5-2.5 1.5-2.5s1.5 1.5 1.5 2.5c0 .83-.67 1.5-1.5 1.5z" fill="currentColor" stroke="none" /></svg>`,
    "Coche": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l2.2-5.5A4 4 0 0 1 8.9 3h3.6a4 4 0 0 1 3.3 1.7L20 11" /><path d="M10 3v8" /><path d="M4 11h15a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a3 3 0 0 1 3-3z" /><path d="M4 17v1a2.5 2.5 0 0 0 5 0v-1" /><path d="M15 17v1a2.5 2.5 0 0 0 5 0v-1" /></svg>`,
    "Vivienda": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7.5a2 2 0 0 0-.6-1.4l-7-6.8a2 2 0 0 0-2.8 0l-7 6.8a2 2 0 0 0-.6 1.4z"/><path d="M9 21v-5a3 3 0 0 1 6 0v5"/></svg>`,
    "Monedas": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="8.5" cy="11" rx="6.5" ry="3"/><path d="M2 11v8c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3v-8"/><path d="M2 15c0 1.66 2.91 3 6.5 3s6.5-1.34 6.5-3"/><ellipse cx="15.5" cy="5" rx="6.5" ry="3"/><path d="M9 5v3.1"/><path d="M22 5v12c0 1.66-2.91 3-6.5 3-.6 0-1.18-.04-1.73-.11"/><path d="M22 9c0 1.66-2.91 3-6.5 3-.45 0-.89-.02-1.31-.06"/><path d="M22 13c0 1.66-2.91 3-6.5 3-.17 0-.34 0-.5-.01"/></svg>`,
};

/* ==========================================
   1. ESTADO Y CONFIGURACIÓN GLOBAL
   ========================================== */
const DEFAULT_CONFIG = {
    userName: 'Invitado',
    currency: 'EUR',
    theme: 'light',
    categories: {
        expense: [
            { name: 'Vivienda', color: '#3b82f6', icon: 'Vivienda' },
            { name: 'Coche', color: '#d97706', icon: 'Coche' },
            { name: 'Combustible', color: '#ef4444', icon: 'Combustible' },
            { name: 'Compras', color: '#ec4899', icon: 'Compras' },
            { name: 'Alimentación', color: '#8b5cf6', icon: 'Alimentacion' },
            { name: 'Transporte', color: '#10b981', icon: 'Transporte' },
            { name: 'Manutención', color: '#f59e0b', icon: 'Manutencion' },
            { name: 'Servicios', color: '#6366f1', icon: 'Servicios' },
            { name: 'Suscripciones', color: '#14b8a6', icon: 'Suscripciones' },
        ],
        income: [
            { name: 'Salario', color: '#22c55e', icon: 'Salario' },
            { name: 'Ingresos extra', color: '#84cc16', icon: 'Ingresos extras' },
            { name: 'Devoluciones', color: '#0ea5e9', icon: 'Devoluciones' }
        ]
    }
};

let appConfig = JSON.parse(localStorage.getItem('finanzas_config_v1')) || DEFAULT_CONFIG;
let movements = JSON.parse(localStorage.getItem('finanzas_movimientos_v1') || '[]');
let remittancesList = JSON.parse(localStorage.getItem('finanzas_remesas_cards_v3') || '[]').map(r => ({ ...r, expanded: false }));
let installmentsPurchases = JSON.parse(localStorage.getItem('finanzas_cuotas_v1') || '[]').map(p => ({ ...p, expanded: false }));

let editingId = null;
let editingInstallmentId = null;
let currentCatKind = 'expense';
let selectedDonutCategory = null;

const accordionState = {
    movements: true,
    categories: false,
    remit: false,
    installments: false
};

const today = new Date();
const pad = (number) => String(number).padStart(2, '0');
const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

/* ==========================================
   2. UTILIDADES DE FORMATO Y FECHAS
   ========================================== */
const getCurrencySymbol = (code) => {
    const symbols = { EUR: '€', USD: '$', PEN: 'S/.' };
    return symbols[code] || '€';
};

const formatCurrencyCustom = (amount, code) => {
    const num = Number(amount) || 0;
    const parts = num.toFixed(2).split('.');
    if (code === 'PEN') {
        return `S/. ${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${parts[1]}`;
    }
    if (code === 'USD') {
        return `$ ${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${parts[1]}`;
    }
    return `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${parts[1]} €`;
};

const formatMoney = (amount) => formatCurrencyCustom(amount, appConfig.currency);

const formatNumberDisplay = (val, currCode) => {
    if (isNaN(val) || val <= 0) return '';
    return formatCurrencyCustom(val, currCode);
};

const formatTcDisplay = (val, currCode) => {
    if (isNaN(val) || val <= 0) return '';
    return formatCurrencyCustom(val, currCode);
};

function parseInputNumber(rawValue) {
    if (!rawValue) return 0;
    let s = String(rawValue).replace(/[A-Za-z/.]+\s*/g, '').trim();
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

/* ==========================================
   3. PERSISTENCIA Y CONFIGURACIÓN UI
   ========================================== */
const persist = () => localStorage.setItem('finanzas_movimientos_v1', JSON.stringify(movements));
const persistRemittancesList = () => localStorage.setItem('finanzas_remesas_cards_v3', JSON.stringify(remittancesList));
const persistInstallments = () => localStorage.setItem('finanzas_cuotas_v1', JSON.stringify(installmentsPurchases));

const persistConfig = () => {
    localStorage.setItem('finanzas_config_v1', JSON.stringify(appConfig));
    updateUserDisplay();
    applyTheme();
    updateCurrencyLabels();
};

function applyTheme() {
    document.body.classList.toggle('dark-mode', appConfig.theme === 'dark');
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
    $(`${prefix}Category`).innerHTML = catList
        .map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`)
        .join('');
}

function updateMovementFilterOptions() {
    const filterSelect = $('movementFilter');
    if (!filterSelect) return;

    const currentSelection = filterSelect.value || 'all';
    const expenseCats = appConfig.categories.expense || [];
    const incomeCats = appConfig.categories.income || [];

    filterSelect.innerHTML = `
        <option value="all">Todos</option>
        <optgroup label="Gastos">
            <option value="type:expense">Todos los gastos</option>
            ${expenseCats.map(c => `<option value="cat:expense:${escapeHtml(c.name)}">• ${escapeHtml(c.name)}</option>`).join('')}
        </optgroup>
        <optgroup label="Ingresos">
            <option value="type:income">Todos los ingresos</option>
            ${incomeCats.map(c => `<option value="cat:income:${escapeHtml(c.name)}">• ${escapeHtml(c.name)}</option>`).join('')}
        </optgroup>
    `;

    const exists = Array.from(filterSelect.options).some(opt => opt.value === currentSelection);
    filterSelect.value = exists ? currentSelection : 'all';
}

function setupMainAccordion(btnId, containerId, iconId, cardEl, stateKey) {
    const btn = $(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
        accordionState[stateKey] = !accordionState[stateKey];
        const expanded = accordionState[stateKey];
        const container = $(containerId);
        const icon = $(iconId);

        if (container) container.style.display = expanded ? 'block' : 'none';
        if (cardEl) cardEl.classList.toggle('expanded', expanded);
        if (icon) {
            icon.innerHTML = expanded
                ? '<polyline points="18 15 12 9 6 15"></polyline>'
                : '<polyline points="6 9 12 15 18 9"></polyline>';
        }
    });
}

/* ==========================================
   4. MOVIMIENTOS Y CATEGORÍAS (DONA INTERACTIVA Y LISTA CON %)
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
   5. GESTOR DE REMESAS
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
        const formattedTc = tc > 0 ? formatTcDisplay(tc, rem.recvCurr) : '';

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
                        <button type="button" class="danger icon-btn btn-xs" data-action="delete-remit" data-remit-id="${rem.id}" title="Eliminar remesa" aria-label="Eliminar remesa">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
    renderRemittancesList();
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
   6. GESTOR DE CUOTAS
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
    if ($('installmentEditDlg')) $('installmentEditDlg').close();
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
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    if ($('installmentEditDlg')) $('installmentEditDlg').showModal();
}

/* ==========================================
   7. MODALES Y GESTIÓN DE CATEGORÍAS
   ========================================== */
function openNewMovement() {
    editingId = null;
    if ($('newForm')) $('newForm').reset();
    if ($('newKind')) $('newKind').value = 'expense';
    updateCategoryOptions('new');
    if ($('month') && $('newDate')) {
        $('newDate').value = `${$('month').value}-${pad(today.getDate())}`;
    }
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    if ($('newDlg')) $('newDlg').showModal();
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
            $('editDlg')?.close();
            render();
        };
    }

    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    if ($('editDlg')) $('editDlg').showModal();
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
    if ($('detailDlg')) $('detailDlg').showModal();
}

function renderConfigCategories() {
    const list = $('categoryManagerList');
    if (!list) return;

    list.innerHTML = ['expense', 'income'].map((kind, idx) => {
        const title = kind === 'expense' ? 'Gastos' : 'Ingresos';
        const sectionClass = idx > 0 ? 'category-section-title category-section-divider' : 'category-section-title';

        const itemsHtml = appConfig.categories[kind].map((cat, index) => {
            const iconKey = cat.icon || 'Compras';
            const iconSvg = categoryIconsMap[iconKey] || categoryIconsMap['Compras'];

            return `
                <div class="category-item-row">
                    <div class="flex-center-gap">
                        <span class="category-icon-wrapper" style="color: ${cat.color}; width: 28px; height: 28px;">${iconSvg}</span>
                        <span class="category-item-name">${escapeHtml(cat.name)}</span>
                    </div>
                    <div class="category-item-controls">
                        <button type="button" class="danger icon-btn btn-xs" data-action="remove-category" data-kind="${kind}" data-index="${index}" title="Eliminar categoría" aria-label="Eliminar categoría">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `<strong class="${sectionClass}">${title}</strong>${itemsHtml}`;
    }).join('');
}

function removeCategory(kind, index) {
    appConfig.categories[kind].splice(index, 1);
    persistConfig();
    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateMovementFilterOptions();
    render();
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

function selectCategoryIcon(iconKey) {
    const hiddenInput = $('newCatIcon');
    if (hiddenInput) hiddenInput.value = iconKey;

    document.querySelectorAll('.icon-option-item').forEach(el => {
        el.classList.toggle('selected', el.dataset.icon === iconKey);
    });
}

/* ==========================================
   8. REGISTRO DE LISTENERS (DELEGACIÓN) E INICIALIZACIÓN
   ========================================== */
function bindEvents() {
    // Acordeones principales en móvil
    setupMainAccordion('toggleMovementsBtn', 'movementsContainer', 'toggleMovementsIcon', $('movementsCard'), 'movements');
    setupMainAccordion('toggleCategoriesBtn', 'categoriesContainer', 'toggleCategoriesIcon', $('categoriesCard'), 'categories');
    setupMainAccordion('toggleRemitBtn', 'remitContainer', 'toggleRemitIcon', $('remittancesCard'), 'remit');
    setupMainAccordion('toggleInstallmentsBtn', 'installmentsContainer', 'toggleInstallmentsIcon', $('installmentsCard'), 'installments');

    setupCategoryTabs();

    // Delegación: Clic en segmentos de la dona SVG
    if ($('catChartWrapper')) {
        $('catChartWrapper').addEventListener('click', (e) => {
            const segment = e.target.closest('[data-donut-category]');
            if (segment) {
                toggleDonutSegment(segment.dataset.donutCategory);
            }
        });
    }

    // Delegación: clic en categorías de la lista (sincroniza con la dona)
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

    // Limpiar selección al hacer clic fuera del gráfico y de la lista
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

    // Delegación: Selector de iconos en modal de categorías
    if ($('iconSelectorGrid')) {
        $('iconSelectorGrid').addEventListener('click', (e) => {
            const item = e.target.closest('.icon-option-item');
            if (item && item.dataset.icon) {
                selectCategoryIcon(item.dataset.icon);
            }
        });
    }

    // Delegación: Eliminar categorías existentes en modal
    if ($('categoryManagerList')) {
        $('categoryManagerList').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action="remove-category"]');
            if (btn) {
                removeCategory(btn.dataset.kind, Number(btn.dataset.index));
            }
        });
    }

    // Delegación: Eventos de Remesas
    if ($('remittancesList')) {
        const listContainer = $('remittancesList');

        listContainer.addEventListener('click', (e) => {
            const deleteRemitBtn = e.target.closest('[data-action="delete-remit"]');
            if (deleteRemitBtn) {
                e.stopPropagation();
                return deleteRemittance(deleteRemitBtn.dataset.remitId);
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
            if (e.target.classList.contains('remit-concept-field') && e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                addRemitItem(e.target.dataset.remitId);
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

            e.target.value = val > 0 ? String(val).replace('.', ',') : '';
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

    // Delegación: Eventos de Gestor de Cuotas
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

    // Botones y filtros de Movimientos
    if ($('addBtn')) $('addBtn').addEventListener('click', openNewMovement);
    
    if ($('cancelNew')) $('cancelNew').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('newDlg')?.close();
    });
    if ($('cancelEdit')) $('cancelEdit').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('editDlg')?.close();
    });

    if ($('newKind')) $('newKind').addEventListener('change', () => updateCategoryOptions('new'));
    if ($('editKind')) $('editKind').addEventListener('change', () => updateCategoryOptions('edit'));

    if ($('month')) $('month').addEventListener('change', render);
    if ($('search')) $('search').addEventListener('input', render);
    if ($('movementFilter')) $('movementFilter').addEventListener('change', render);
    if ($('closeDetailBtn')) $('closeDetailBtn').addEventListener('click', () => $('detailDlg')?.close());

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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('newDlg')?.close();
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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('editDlg')?.close();
            render();
        });
    }

    // Configuración General
    if ($('configBtn')) {
        $('configBtn').addEventListener('click', () => {
            $('userNameInput').value = appConfig.userName;
            $('currencySelect').value = appConfig.currency || 'EUR';
            $('themeSelect').value = appConfig.theme || 'light';
            $('configDlg')?.showModal();
        });
    }

    if ($('saveConfigBtn')) {
        $('saveConfigBtn').addEventListener('click', () => {
            const newName = $('userNameInput').value.trim();
            if (newName) appConfig.userName = newName;
            appConfig.currency = $('currencySelect').value;
            appConfig.theme = $('themeSelect').value;
            persistConfig();
            updateCategoryOptions('new');
            updateCategoryOptions('edit');
            updateMovementFilterOptions();
            render();
            $('configDlg')?.close();
        });
    }

    if ($('cancelConfigBtn')) $('cancelConfigBtn').addEventListener('click', () => $('configDlg')?.close());

    // Modal de Categorías
    if ($('editCategoriesBtn')) {
        $('editCategoriesBtn').addEventListener('click', () => {
            renderConfigCategories();
            renderIconSelector('Compras');
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('categoriesDlg')?.showModal();
        });
    }

    if ($('closeCategoriesDlg')) $('closeCategoriesDlg').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('categoriesDlg')?.close();
    });

    if ($('addCatBtn')) {
        $('addCatBtn').addEventListener('click', (e) => {
            e.preventDefault();
            
            const kind = $('newCatKind').value;
            const nameInput = $('newCatName');
            const iconSelect = $('newCatIcon');

            if (!nameInput.value.trim()) {
                nameInput.classList.add('input-error');
                nameInput.focus();
                return;
            }
            nameInput.classList.remove('input-error');

            const name = nameInput.value.trim();
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
                nameInput.value = '';
                persistConfig();
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

    // Modal de Nueva Remesa
    if ($('addRemittanceBtn')) {
        $('addRemittanceBtn').addEventListener('click', () => {
            $('remitNewForm')?.reset();
            if ($('newRemitName')) {
                const monthName = today.toLocaleDateString('es-ES', { month: 'long' });
                const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                $('newRemitName').value = `${capitalizedMonth} ${today.getFullYear()}`;
            }
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('remitNewDlg')?.showModal();
        });
    }

    if ($('cancelNewRemitBtn')) $('cancelNewRemitBtn').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('remitNewDlg')?.close();
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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('remitNewDlg')?.close();
            renderRemittancesList();
        });
    }

    // Modales de Cuotas
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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('installmentNewDlg')?.showModal();
        });
    }

    if ($('cancelNewInstallmentBtn')) $('cancelNewInstallmentBtn').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('installmentNewDlg')?.close();
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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('installmentNewDlg')?.close();
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
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('installmentEditDlg')?.close();
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
    updateUserDisplay();
    updateCurrencyLabels();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    updateMovementFilterOptions();
    renderRemittancesList();
    renderInstallments();
    render();
}

init();