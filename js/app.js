/* Finanzas personales — lógica de la aplicación */

const $ = (id) => document.getElementById(id);

/* ==========================================
   1. ESTADO Y CONFIGURACIÓN GLOBAL
   ========================================== */

const DEFAULT_CONFIG = {
    userName: 'Invitado',
    currency: 'EUR',
    theme: 'light',
    categories: {
        expense: [
            { name: 'Vivienda', color: '#3b82f6' },
            { name: 'Coche', color: '#d97706' },
            { name: 'Combustible', color: '#ef4444' },
            { name: 'Compras', color: '#ec4899' },
            { name: 'Alimentación', color: '#8b5cf6' },
            { name: 'Transporte', color: '#10b981' },
            { name: 'Manutención', color: '#f59e0b' },
            { name: 'Servicios', color: '#6366f1' },
            { name: 'Suscripciones', color: '#14b8a6' },
            { name: 'Otros', color: '#64748b' }
        ],
        income: [
            { name: 'Salario', color: '#22c55e' },
            { name: 'Ingresos extra', color: '#84cc16' },
            { name: 'Devoluciones', color: '#0ea5e9' }
        ]
    }
};

let appConfig = JSON.parse(localStorage.getItem('finanzas_config_v1')) || DEFAULT_CONFIG;
let movements = JSON.parse(localStorage.getItem('finanzas_movimientos_v1') || '[]');
let remittancesList = JSON.parse(localStorage.getItem('finanzas_remesas_cards_v3') || '[]').map(r => ({ ...r, expanded: false }));
let installmentsPurchases = JSON.parse(localStorage.getItem('finanzas_cuotas_v1') || '[]').map(p => ({ ...p, expanded: false }));

let editingId = null;
let editingInstallmentId = null;

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
const formatEurFixed = (amount) => formatCurrencyCustom(amount, 'EUR');

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
   4. MOVIMIENTOS Y CATEGORÍAS
   ========================================== */

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
    const type = $('typeFilter').value;

    const visibleMovements = monthMovements
        .filter(item =>
            (!query || `${item.desc} ${item.category} ${item.notes || ''}`.toLowerCase().includes(query)) &&
            (!type || item.kind === type)
        )
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

        rowsHtml += `
            <tr class="movement-row ${borderClass}">
                <td>
                    <div class="movement-name-wrapper">
                        <span class="category-dot" style="background-color: ${catColor};" title="${escapeHtml(item.category)}"></span>
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

    const categoryTotals = {};
    monthMovements.forEach(item => {
        const key = `${item.kind}:${item.category}`;
        categoryTotals[key] = (categoryTotals[key] || 0) + item.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const maximum = sortedCategories[0]?.[1] || 1;

    $('categories').innerHTML = sortedCategories.length
        ? sortedCategories.map(([key, amount]) => {
            const [kind, name] = key.split(':');
            const catList = appConfig.categories[kind] || [];
            const catObj = catList.find(c => c.name === name);
            const color = catObj ? catObj.color : 'var(--blue)';
            const percentage = (amount / maximum) * 100;
            const sign = kind === 'income' ? '+' : '';
            return `
                <div class="catrow">
                    <div class="catname">
                        <div class="catname-header">
                            <span>${escapeHtml(name)} <span class="cat-kind-badge">(${kind === 'income' ? 'Ingreso' : 'Gasto'})</span></span>
                            <span class="catvalue">${sign}${formatMoney(amount)}</span>
                        </div>
                        <div class="bar">
                            <div class="fill" style="width:${percentage}%; background:${color};"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="empty">Añade movimientos para ver el desglose.</div>';
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
                        <button type="button" class="danger icon-btn btn-xs" onclick="removeRemitItem('${rem.id}', ${idx})" title="Eliminar concepto" aria-label="Eliminar concepto">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="installment-purchase-card" id="remit_box_${rem.id}">
                <div class="installment-purchase-header" onclick="toggleRemitAccordion('${rem.id}')">
                    <div class="flex-col">
                        <span>${escapeHtml(rem.name)}</span>
                        <span class="installment-card-subtitle" id="remit_header_summary_${rem.id}">
                            ${rem.sendCurr} → ${rem.recvCurr} • Total: ${formatCurrencyCustom(grandTotal, rem.sendCurr)} 
                        </span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="danger icon-btn btn-xs" onclick="event.stopPropagation(); deleteRemittance('${rem.id}')" title="Eliminar remesa" aria-label="Eliminar remesa">
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
                        <button type="button" class="remit-add-btn" onclick="addRemitItem('${rem.id}')">Añadir</button>
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

function initRemittancesDelegation() {
    const listContainer = $('remittancesList');
    if (!listContainer) return;

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
            const idx = Number(e.target.dataset.index);
            rem.items[idx].recvAmount = parseInputNumber(e.target.value);
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
            const idx = Number(e.target.dataset.index);
            const val = parseInputNumber(e.target.value);
            rem.items[idx].recvAmount = val;
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

window.toggleRemitAccordion = function(remId) {
    const rem = remittancesList.find(r => r.id === remId);
    if (rem) {
        const willBeExpanded = !rem.expanded;
        remittancesList.forEach(r => r.expanded = false);
        rem.expanded = willBeExpanded;
        
        persistRemittancesList();
        renderRemittancesList();
    }
};

window.deleteRemittance = function(remId) {
    if (!confirm('¿Eliminar esta remesa y todo su registro?')) return;
    remittancesList = remittancesList.filter(r => r.id !== remId);
    persistRemittancesList();
    renderRemittancesList();
};

window.removeRemitItem = function(remId, index) {
    const rem = remittancesList.find(r => r.id === remId);
    if (rem) {
        rem.items.splice(index, 1);
        persistRemittancesList();
        renderRemittancesList();
    }
};

window.addRemitItem = function(remId) {
    const inputEl = $(`new_concept_input_${remId}`);
    if (!inputEl) return;
    const conceptName = inputEl.value.trim();
    if (!conceptName) return;

    const rem = remittancesList.find(r => r.id === remId);
    if (rem) {
        rem.items.push({ concept: conceptName, recvAmount: 0 });
        persistRemittancesList();
        renderRemittancesList();

        // Enfoque inmediato y truco para forzar el teclado en iOS
        const nextInput = $(`new_concept_input_${remId}`);
        if (nextInput) {
            nextInput.value = '';
            nextInput.focus();
            if (typeof nextInput.setSelectionRange === 'function') {
                nextInput.setSelectionRange(0, 0);
            }
        }
    }
};

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
            <div class="installment-row ${inst.paid ? 'paid' : ''}" onclick="toggleInstallmentPaid('${purchase.id}', ${inst.number})">
                <div class="flex-col">
                    <span class="installment-row-title">Cuota ${inst.number} de ${purchase.totalCount}</span>
                    <span class="installment-row-date">Fecha: ${formatDateEs(inst.date)}</span>
                </div>
                <div class="installment-row-right">
                    <span class="installment-row-amount">${formatCurrencyCustom(inst.amount, curr)}</span>
                    <input type="checkbox" class="installment-checkbox" ${inst.paid ? 'checked' : ''} onclick="event.stopPropagation(); toggleInstallmentPaid('${purchase.id}', ${inst.number})" title="Marcar como pagado">
                </div>
            </div>
        `).join('');

        return `
            <div class="installment-purchase-card" id="purchase_box_${purchase.id}">
                <div class="installment-purchase-header ${allPaid ? 'all-paid' : ''}" onclick="toggleInstallmentAccordion('${purchase.id}')">
                    <div class="flex-col">
                        <span>${escapeHtml(purchase.name)}</span>
                        <span class="installment-card-subtitle">Total: ${formatCurrencyCustom(purchase.totalAmount, curr)} (${progressText})</span>
                    </div>
                    <div class="flex-center-gap">
                        <button type="button" class="soft icon-btn btn-xs" onclick="event.stopPropagation(); editInstallmentPurchase('${purchase.id}')" title="Editar compra" aria-label="Editar compra">
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

window.toggleInstallmentAccordion = function(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (purchase) {
        const willBeExpanded = !purchase.expanded;
        installmentsPurchases.forEach(p => p.expanded = false);
        purchase.expanded = willBeExpanded;
        persistInstallments();
        renderInstallments();
    }
};

window.toggleInstallmentPaid = function(purchaseId, instNumber) {
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
};

window.deleteInstallmentPurchase = function(purchaseId) {
    if (!confirm('¿Eliminar esta compra en cuotas y todo su historial?')) return;
    installmentsPurchases = installmentsPurchases.filter(p => p.id !== purchaseId);
    persistInstallments();
    if ($('installmentEditDlg')) $('installmentEditDlg').close();
    renderInstallments();
};

window.editInstallmentPurchase = function(purchaseId) {
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
};

/* ==========================================
   7. MODALES Y EVENTOS DE INTERFAZ
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

function deleteMovement(id) {
    if (!confirm('¿Eliminar este movimiento?')) return;
    movements = movements.filter(m => m.id !== id);
    persist();
    render();
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

    list.innerHTML = ['expense', 'income'].map(kind => {
        const title = kind === 'expense' ? 'Gastos' : 'Ingresos';
        const itemsHtml = appConfig.categories[kind].map((cat, index) => `
            <div class="category-item-row">
                <span class="category-item-name">${escapeHtml(cat.name)}</span>
                <div class="category-item-controls">
                    <div class="color-picker-container" title="Cambiar color">
                        <div class="color-picker-preview" style="background-color: ${cat.color};"></div>
                        <input type="color" value="${cat.color}" class="category-color-input" onchange="updateCatColor('${kind}', ${index}, this.value)">
                    </div>
                    <button type="button" class="danger icon-btn btn-xs" onclick="removeCategory('${kind}', ${index})" title="Eliminar categoría" aria-label="Eliminar categoría">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `).join('');
        return `<strong class="category-section-title">${title}</strong>${itemsHtml}`;
    }).join('');
}

window.updateCatColor = function(kind, index, color) {
    appConfig.categories[kind][index].color = color;
    persistConfig();
    render();
};

window.removeCategory = function(kind, index) {
    appConfig.categories[kind].splice(index, 1);
    persistConfig();
    renderConfigCategories();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    render();
};

/* ==========================================
   8. REGISTRO DE LISTENERS E INICIALIZACIÓN
   ========================================== */

function bindEvents() {
    setupMainAccordion('toggleMovementsBtn', 'movementsContainer', 'toggleMovementsIcon', $('movementsCard'), 'movements');
    setupMainAccordion('toggleCategoriesBtn', 'categoriesContainer', 'toggleCategoriesIcon', $('categoriesCard'), 'categories');
    setupMainAccordion('toggleRemitBtn', 'remitContainer', 'toggleRemitIcon', $('remittancesCard'), 'remit');
    setupMainAccordion('toggleInstallmentsBtn', 'installmentsContainer', 'toggleInstallmentsIcon', $('installmentsCard'), 'installments');

    if ($('addBtn')) $('addBtn').addEventListener('click', openNewMovement);
    
    // Cancelar/Cerrar Modales de Movimiento
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
    if ($('typeFilter')) $('typeFilter').addEventListener('change', render);
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

    // Submit del formulario de Nuevo Movimiento
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

    // Submit del formulario de Editar Movimiento
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
            render();
            $('configDlg')?.close();
        });
    }

    if ($('cancelConfigBtn')) $('cancelConfigBtn').addEventListener('click', () => $('configDlg')?.close());

    if ($('editCategoriesBtn')) {
        $('editCategoriesBtn').addEventListener('click', () => {
            renderConfigCategories();
            document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
            $('categoriesDlg')?.showModal();
        });
    }

    if ($('closeCategoriesDlg')) $('closeCategoriesDlg').addEventListener('click', () => {
        document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
        $('categoriesDlg')?.close();
    });

    if ($('newCatColor')) {
        $('newCatColor').addEventListener('input', (e) => {
            if ($('newCatColorPreview')) $('newCatColorPreview').style.backgroundColor = e.target.value;
        });
    }

    if ($('addCatBtn')) {
        $('addCatBtn').addEventListener('click', () => {
            const kind = $('newCatKind').value;
            const nameInput = $('newCatName');
            const color = $('newCatColor').value;

            if (!nameInput.value.trim()) {
                nameInput.classList.add('input-error');
                nameInput.focus();
                return;
            }
            nameInput.classList.remove('input-error');

            const name = nameInput.value.trim();

            if (!appConfig.categories[kind].some(c => c.name === name)) {
                appConfig.categories[kind].push({ name, color });
                nameInput.value = '';
                persistConfig();
                renderConfigCategories();
                updateCategoryOptions('new');
                updateCategoryOptions('edit');
                render();
            }
        });
    }

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
    initRemittancesDelegation();
    applyTheme();
    updateUserDisplay();
    updateCurrencyLabels();
    updateCategoryOptions('new');
    updateCategoryOptions('edit');
    renderRemittancesList();
    renderInstallments();
    render();
}

init();