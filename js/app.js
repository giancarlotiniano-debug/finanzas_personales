/* Finanzas personales — lógica de la aplicación */

const $ = (id) => document.getElementById(id);

/* Configuración predeterminada de Usuario, Moneda, Tema y Categorías */

let appConfig = JSON.parse(
    localStorage.getItem('finanzas_config_v1') || JSON.stringify({
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
    })
);

let movements = JSON.parse(
    localStorage.getItem('finanzas_movimientos_v1') || '[]'
);

let remittancesHistory = JSON.parse(
    localStorage.getItem('finanzas_remesas_v1') || '{}'
);

let installmentsPurchases = JSON.parse(
    localStorage.getItem('finanzas_cuotas_v1') || '[]'
).map(p => ({ ...p, expanded: false }));

let editingId = null;
let editingInstallmentId = null;
let isMovementsExpanded = true;
let isCategoriesExpanded = false;
let isRemitExpanded = false;
let isInstallmentsExpanded = false;

const today = new Date();
const pad = (number) => String(number).padStart(2, '0');
const currentMonth = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;

const formatMoney = (amount) => {
    if (appConfig.currency === 'PEN') {
        const parts = Number(amount).toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `S/. ${integerPart}.${parts[1]}`;
    } else {
        const parts = Number(amount).toFixed(2).split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${integerPart},${parts[1]} €`;
    }
};

const formatEurFixed = (amount) => {
    const parts = Number(amount).toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${integerPart},${parts[1]} €`;
};

const formatPenFixed = (amount) => {
    const parts = Number(amount).toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `S/. ${integerPart}.${parts[1]}`;
};

function applyTheme() {
    if (appConfig.theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

const persist = () => {
    localStorage.setItem('finanzas_movimientos_v1', JSON.stringify(movements));
};

const persistConfig = () => {
    localStorage.setItem('finanzas_config_v1', JSON.stringify(appConfig));
    updateUserDisplay();
    applyTheme();
    updateCurrencyLabels();
};

const persistRemittances = () => {
    localStorage.setItem('finanzas_remesas_v1', JSON.stringify(remittancesHistory));
};

const persistInstallments = () => {
    localStorage.setItem('finanzas_cuotas_v1', JSON.stringify(installmentsPurchases));
};

function updateUserDisplay() {
    $('welcomeText').textContent = `Bienvenido, ${appConfig.userName}.`;
    $('userInitial').textContent = appConfig.userName.charAt(0) || 'I';
}

function updateCurrencyLabels() {
    const symbol = appConfig.currency === 'PEN' ? 'S/.' : '€';
    if ($('amountLabel')) {
        $('amountLabel').textContent = `Importe (${symbol})`;
    }
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function updateCategoryOptions() {
    const kind = $('kind').value;
    const catList = appConfig.categories[kind] || [];
    $('category').innerHTML = catList
        .map(c => `<option value="${escapeHtml(c.name)}">${escapeHtml(c.name)}</option>`)
        .join('');
}

/* Renderizado Principal de Movimientos */

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
            if (dateComparison !== 0) return dateComparison;
            return (b.timestamp || 0) - (a.timestamp || 0);
        });

    let rowsHtml = '';

    visibleMovements.forEach((item, index) => {
        const dateObj = new Date(item.date + 'T12:00:00');
        const dateFormatted = dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        const prevItem = visibleMovements[index - 1];
        const prevDateFormatted = prevItem ? new Date(prevItem.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : null;

        if (dateFormatted !== prevDateFormatted) {
            rowsHtml += `
                <tr class="date-header-row">
                    <td colspan="4">
                        <span>${dateFormatted}</span>
                    </td>
                </tr>
            `;
        }

        const nextItem = visibleMovements[index + 1];
        const nextDateFormatted = nextItem ? new Date(nextItem.date + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : null;
        
        const isLastOfDay = dateFormatted !== nextDateFormatted;
        const borderClass = isLastOfDay ? 'no-border' : '';

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
                <td style="text-align: right;">
                    <span class="category-text">${escapeHtml(item.category)}</span>
                </td>
                <td class="amount ${item.kind === 'income' ? 'income' : 'expense'}">
                    ${item.kind === 'income' ? '+' : '−'}${formatMoney(item.amount)}
                </td>
                <td>
                    <div class="actions">
                        <button class="soft icon-btn" data-edit="${item.id}" title="Editar" aria-label="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="danger icon-btn" data-delete="${item.id}" title="Borrar" aria-label="Borrar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                            <span>${escapeHtml(name)} <span style="font-size:11px; color:var(--muted);">(${kind === 'income' ? 'Ingreso' : 'Gasto'})</span></span>
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

/* Lógica de cálculo y renderizado dinámico para Calcular remesas */

function capitalizeConcept(str) {
    if (!str) return '';
    const clean = str.trim().toLowerCase();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function getCommissionValue() {
    const raw = $('commissionEur').value || '';
    const cleaned = raw.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}

function formatCommissionDisplay(val) {
    if (!isNaN(val) && val > 0) {
        return val.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
    }
    return '';
}

function parsePenInput(rawValue) {
    if (!rawValue) return 0;
    let s = String(rawValue).replace(/S\/\.\s*/g, '').trim();
    
    if (s.includes(',') && s.includes('.')) {
        if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else {
            s = s.replace(/,/g, '');
        }
    } else if (s.includes(',')) {
        if (/^\d{1,3}(,\d{3})+$/.test(s)) {
            s = s.replace(/,/g, '');
        } else {
            s = s.replace(',', '.');
        }
    }
    
    return parseFloat(s) || 0;
}

function formatPenDisplay(val) {
    if (isNaN(val) || val <= 0) return '';

    const hasDecimals = val % 1 !== 0;
    const parts = Number(val).toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (hasDecimals) {
        return `S/. ${integerPart}.${parts[1]}`;
    } else {
        return `S/. ${integerPart}`;
    }
}

function renderRemitTable(conceptsData = {}) {
    const monthKey = $('remitMonthInput').value;
    const savedData = remittancesHistory[monthKey];
    const penValues = savedData ? savedData.penValues : conceptsData;

    if (!window.currentRemitConcepts) {
        window.currentRemitConcepts = [];
    }

    let html = '';
    window.currentRemitConcepts.forEach(concept => {
        const key = concept.toLowerCase();
        const rawVal = penValues[key];
        const formattedVal = (rawVal !== undefined && rawVal > 0) ? formatPenDisplay(rawVal) : '';

        html += `
            <tr>
                <td style="font-weight: 600;">${escapeHtml(concept)}</td>
                <td style="text-align: right; font-weight: 700;" id="eur_${key}">0,00 €</td>
                <td style="text-align: right;">
                    <input type="text" inputmode="decimal" enterkeyhint="done" class="pen-input remit-input-num" data-concept="${key}" value="${formattedVal}" placeholder="0,00">
                </td>
                <td style="text-align: center;">
                    <button type="button" class="danger icon-btn" onclick="removeRemitConcept('${escapeHtml(concept)}')" title="Eliminar concepto" aria-label="Eliminar concepto" style="width: 30px; height: 30px; border-radius: 6px;">&times;</button>
                </td>
            </tr>
        `;
    });

    $('remitTableBody').innerHTML = html;

    document.querySelectorAll('.pen-input').forEach(input => {
        input.addEventListener('input', calculateRemittances);
        
        input.addEventListener('focus', (e) => {
            const val = parsePenInput(e.target.value);
            e.target.value = val > 0 ? val : '';
        });

        input.addEventListener('blur', (e) => {
            const val = parsePenInput(e.target.value);
            e.target.value = formatPenDisplay(val);
            calculateRemittances();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.target.blur();
            }
        });
    });

    calculateRemittances();
}

window.removeRemitConcept = function(conceptName) {
    window.currentRemitConcepts = window.currentRemitConcepts.filter(c => c !== conceptName);
    const currentValues = {};
    document.querySelectorAll('.pen-input').forEach(input => {
        currentValues[input.dataset.concept] = parsePenInput(input.value);
    });
    renderRemitTable(currentValues);
};

function calculateRemittances() {
    const rawTc = $('exchangeRate').value.replace(',', '.');
    const tc = parseFloat(rawTc) || 1;
    
    const penInputs = document.querySelectorAll('.pen-input');
    
    let totalPen = 0;
    let totalEur = 0;

    penInputs.forEach(input => {
        const conceptKey = input.dataset.concept;
        const penVal = parsePenInput(input.value);
        totalPen += penVal;

        const eurVal = tc > 0 ? penVal / tc : 0;
        totalEur += eurVal;

        const eurCell = $(`eur_${conceptKey}`);
        if (eurCell) {
            eurCell.textContent = formatEurFixed(eurVal);
        }
    });

    const commission = getCommissionValue();
    const grandTotal = totalEur + commission;

    $('totalEur').textContent = formatEurFixed(totalEur);
    $('totalPen').textContent = formatPenFixed(totalPen);
    $('grandTotalEur').textContent = formatEurFixed(grandTotal);
}

function loadRemittanceForSelectedMonth() {
    const monthKey = $('remitMonthInput').value;
    const savedData = remittancesHistory[monthKey];
    const commInput = $('commissionEur');

    if (savedData) {
        $('exchangeRate').value = savedData.tc ?? 3.75;
        commInput.type = 'text';
        commInput.value = formatCommissionDisplay(savedData.commission);
        if (savedData.concepts) {
            window.currentRemitConcepts = savedData.concepts;
        } else {
            window.currentRemitConcepts = [];
        }
        renderRemitTable(savedData.penValues || {});
    } else {
        $('exchangeRate').value = 3.75;
        commInput.type = 'text';
        commInput.value = '';
        window.currentRemitConcepts = [];
        renderRemitTable({});
    }
}

$('addConceptBtn').addEventListener('click', () => {
    const rawName = $('newConceptInput').value;
    const formattedName = capitalizeConcept(rawName);

    if (formattedName && !window.currentRemitConcepts.includes(formattedName)) {
        window.currentRemitConcepts.push(formattedName);
        $('newConceptInput').value = '';
        
        const currentValues = {};
        document.querySelectorAll('.pen-input').forEach(input => {
            currentValues[input.dataset.concept] = parsePenInput(input.value);
        });

        renderRemitTable(currentValues);
    }
});

$('newConceptInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        $('addConceptBtn').click();
    }
});

$('saveRemitBtn').addEventListener('click', () => {
    const monthKey = $('remitMonthInput').value;
    if (!monthKey) return;

    const penValues = {};
    document.querySelectorAll('.pen-input').forEach(input => {
        penValues[input.dataset.concept] = parsePenInput(input.value);
    });

    remittancesHistory[monthKey] = {
        tc: parseFloat($('exchangeRate').value.replace(',', '.')) || 0,
        commission: getCommissionValue(),
        concepts: [...window.currentRemitConcepts],
        penValues
    };

    persistRemittances();
    alert(`¡Registro del ${monthKey} guardado!`);
});

$('exchangeRate').addEventListener('input', calculateRemittances);
$('exchangeRate').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
});

$('commissionEur').addEventListener('input', calculateRemittances);

const commissionInput = $('commissionEur');
if (commissionInput) {
    commissionInput.addEventListener('focus', (e) => {
        const val = getCommissionValue();
        e.target.type = 'number';
        e.target.value = val > 0 ? val : '';
    });

    commissionInput.addEventListener('blur', (e) => {
        const val = parseFloat(e.target.value);
        e.target.type = 'text';
        e.target.value = formatCommissionDisplay(val);
        calculateRemittances();
    });

    commissionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.target.blur();
        }
    });
}

$('remitMonthInput').addEventListener('change', () => {
    loadRemittanceForSelectedMonth();
});


/* ==========================================
   GESTOR DE CUOTAS — LÓGICA DE LA APLICACIÓN
   ========================================== */

function formatDateEs(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Funciones de cálculo automático para los formularios de cuotas
function autoCalculateNewInstallment() {
    const financed = parseFloat($('newInstFinancedAmount').value.replace(',', '.')) || 0;
    const interest = parseFloat($('newInstInterestAmount').value.replace(',', '.')) || 0;
    const count = parseInt($('newInstTotalCount').value) || 0;
    const total = financed + interest;

    $('newInstTotalAmount').value = total > 0 ? total.toFixed(2).replace('.', ',') : '';
    if (total > 0 && count > 0) {
        $('newInstRegularAmount').value = (total / count).toFixed(2).replace('.', ',');
    }
}

function autoCalculateEditInstallment() {
    const financed = parseFloat($('editInstFinancedAmount').value.replace(',', '.')) || 0;
    const interest = parseFloat($('editInstInterestAmount').value.replace(',', '.')) || 0;
    const count = parseInt($('editInstTotalCount').value) || 0;
    const total = financed + interest;

    $('editInstTotalAmount').value = total > 0 ? total.toFixed(2).replace('.', ',') : '';
    if (total > 0 && count > 0) {
        $('editInstRegularAmount').value = (total / count).toFixed(2).replace('.', ',');
    }
}

$('newInstFinancedAmount').addEventListener('input', autoCalculateNewInstallment);
$('newInstInterestAmount').addEventListener('input', autoCalculateNewInstallment);
$('newInstTotalCount').addEventListener('input', autoCalculateNewInstallment);

$('editInstFinancedAmount').addEventListener('input', autoCalculateEditInstallment);
$('editInstInterestAmount').addEventListener('input', autoCalculateEditInstallment);
$('editInstTotalCount').addEventListener('input', autoCalculateEditInstallment);

function renderInstallments() {
    const listContainer = $('installmentsList');
    if (!installmentsPurchases.length) {
        listContainer.innerHTML = '<div class="empty" style="padding: 15px; text-align: center; color: var(--muted);">No hay compras en cuotas registradas. Pulsa el botón de abajo para añadir una.</div>';
        return;
    }

    let html = '';
    installmentsPurchases.forEach((purchase) => {
        const totalPaidCount = purchase.installments.filter(i => i.paid).length;
        const progressText = `${totalPaidCount}/${purchase.totalCount} pagadas`;
        const allPaid = purchase.installments.length > 0 && purchase.installments.every(i => i.paid);

        let installmentsHtml = '';
        purchase.installments.forEach((inst) => {
            const formattedDate = formatDateEs(inst.date);
            installmentsHtml += `
                <div class="installment-row ${inst.paid ? 'paid' : ''}" onclick="toggleInstallmentPaid('${purchase.id}', ${inst.number})" style="cursor: pointer;">
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: 600;">Cuota ${inst.number} de ${purchase.totalCount}</span>
                        <span style="font-size: 12px; color: var(--muted);">Fecha: ${formattedDate}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="font-weight: 700;">${formatEurFixed(inst.amount)}</span>
                        <input type="checkbox" class="installment-checkbox" ${inst.paid ? 'checked' : ''} onclick="event.stopPropagation(); toggleInstallmentPaid('${purchase.id}', ${inst.number})" title="Marcar como pagado">
                    </div>
                </div>
            `;
        });

        html += `
            <div class="installment-purchase-card" id="purchase_box_${purchase.id}">
                <div class="installment-purchase-header ${allPaid ? 'all-paid' : ''}" onclick="toggleInstallmentAccordion('${purchase.id}')">
                    <div style="display: flex; flex-direction: column;">
                        <span>${escapeHtml(purchase.name)}</span>
                        <span style="font-size: 12px; font-weight: normal; color: var(--muted);">Total: ${formatEurFixed(purchase.totalAmount)} (${progressText})</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <button type="button" class="soft icon-btn" onclick="event.stopPropagation(); editInstallmentPurchase('${purchase.id}')" title="Editar compra" aria-label="Editar compra" style="width: 30px; height: 30px; border-radius: 6px;">
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
    });

    listContainer.innerHTML = html;
}

window.toggleInstallmentAccordion = function(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (purchase) {
        const willBeExpanded = !purchase.expanded;
        
        // Cierra todas las demás compras (acordeón exclusivo)
        installmentsPurchases.forEach(p => {
            p.expanded = false;
        });

        // Alterna la seleccionada
        purchase.expanded = willBeExpanded;
        
        persistInstallments();
        renderInstallments();
    }
};

window.toggleInstallmentPaid = function(purchaseId, instNumber) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (purchase) {
        const inst = purchase.installments.find(i => i.number === instNumber);
        if (inst) {
            inst.paid = !inst.paid;
            persistInstallments();

            // Guardamos la posición actual del scroll del contenedor de esta compra antes de volver a renderizar
            const listEl = $(`inst_details_${purchaseId}`);
            const currentScrollTop = listEl ? listEl.scrollTop : 0;

            renderInstallments();

            // Restauramos la posición del scroll en el contenedor tras el renderizado
            const updatedListEl = $(`inst_details_${purchaseId}`);
            if (updatedListEl) {
                updatedListEl.scrollTop = currentScrollTop;
            }
        }
    }
};

window.deleteInstallmentPurchase = function(purchaseId) {
    if (!confirm('¿Eliminar esta compra en cuotas y todo su historial?')) return;
    installmentsPurchases = installmentsPurchases.filter(p => p.id !== purchaseId);
    persistInstallments();
    $('installmentEditDlg').close();
    renderInstallments();
};

window.editInstallmentPurchase = function(purchaseId) {
    const purchase = installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    editingInstallmentId = purchaseId;
    $('editInstName').value = purchase.name;
    $('editInstFinancedAmount').value = purchase.financedAmount || purchase.totalAmount;
    $('editInstInterestAmount').value = purchase.interestAmount || '';
    $('editInstTotalAmount').value = purchase.totalAmount;
    $('editInstTotalCount').value = purchase.totalCount;
    $('editInstRegularAmount').value = purchase.regularAmount;
    $('editInstFinalAmount').value = purchase.finalAmount || '';
    $('editInstFirstDate').value = purchase.firstDate;

    $('deleteInstallmentBtn').onclick = () => deleteInstallmentPurchase(editingInstallmentId);
    $('installmentEditDlg').showModal();
};

// Eventos de Acordeón principal del Gestor de Cuotas
$('toggleInstallmentsBtn').addEventListener('click', () => {
    isInstallmentsExpanded = !isInstallmentsExpanded;
    const container = $('installmentsContainer');
    const icon = $('toggleInstallmentsIcon');
    const card = $('installmentsCard');

    if (isInstallmentsExpanded) {
        container.style.display = 'block';
        card.classList.add('expanded');
        icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
        container.style.display = 'none';
        card.classList.remove('expanded');
        icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
});

$('addInstallmentPurchaseBtn').addEventListener('click', () => {
    $('installmentNewForm').reset();
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    $('newInstFirstDate').value = todayStr;
    $('installmentNewDlg').showModal();
});

$('cancelNewInstallmentBtn').addEventListener('click', () => {
    $('installmentNewDlg').close();
});

// Guardar nueva compra en cuotas (por defecto plegada)
$('installmentNewForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = $('newInstName').value.trim();
    const financedAmount = parseFloat($('newInstFinancedAmount').value.replace(',', '.')) || 0;
    const interestAmount = parseFloat($('newInstInterestAmount').value.replace(',', '.')) || 0;
    const totalAmount = financedAmount + interestAmount;
    const totalCount = parseInt($('newInstTotalCount').value) || 1;
    const regularAmount = parseFloat($('newInstRegularAmount').value.replace(',', '.')) || 0;
    const finalAmountInput = $('newInstFinalAmount').value.trim();
    const finalAmount = finalAmountInput ? parseFloat(finalAmountInput.replace(',', '.')) : regularAmount;
    const firstDateStr = $('newInstFirstDate').value;

    let installments = [];
    
    function addMonthsToDate(dateStr, monthsToAdd) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const lastDayOfStartMonth = new Date(y, m, 0).getDate();
        const isEndOfMonth = (d >= lastDayOfStartMonth);

        let targetYear = y;
        let targetMonth = (m - 1) + monthsToAdd;
        
        targetYear += Math.floor(targetMonth / 12);
        targetMonth = targetMonth % 12;
        
        const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        
        let targetDay = d;
        if (isEndOfMonth || targetDay > lastDayOfTargetMonth) {
            targetDay = lastDayOfTargetMonth;
        }
        
        return `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
    }

    for (let i = 1; i <= totalCount; i++) {
        const amt = (i === totalCount) ? finalAmount : regularAmount;
        const instDate = addMonthsToDate(firstDateStr, i - 1);
        installments.push({
            number: i,
            amount: amt,
            date: instDate,
            paid: false
        });
    }

    const newPurchase = {
        id: crypto.randomUUID(),
        name,
        financedAmount,
        interestAmount,
        totalAmount,
        totalCount,
        regularAmount,
        finalAmount,
        firstDate: firstDateStr,
        expanded: false, // Por defecto plegada
        installments
    };
    installmentsPurchases.push(newPurchase);

    persistInstallments();
    $('installmentNewDlg').close();
    renderInstallments();
});

// Guardar edición de compra en cuotas
$('installmentEditForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editingInstallmentId) return;

    const name = $('editInstName').value.trim();
    const financedAmount = parseFloat($('editInstFinancedAmount').value.replace(',', '.')) || 0;
    const interestAmount = parseFloat($('editInstInterestAmount').value.replace(',', '.')) || 0;
    const totalAmount = financedAmount + interestAmount;
    const totalCount = parseInt($('editInstTotalCount').value) || 1;
    const regularAmount = parseFloat($('editInstRegularAmount').value.replace(',', '.')) || 0;
    const finalAmountInput = $('editInstFinalAmount').value.trim();
    const finalAmount = finalAmountInput ? parseFloat(finalAmountInput.replace(',', '.')) : regularAmount;
    const firstDateStr = $('editInstFirstDate').value;

    const existing = installmentsPurchases.find(p => p.id === editingInstallmentId);
    let installments = [];
    
    function addMonthsToDate(dateStr, monthsToAdd) {
        const [y, m, d] = dateStr.split('-').map(Number);
        const lastDayOfStartMonth = new Date(y, m, 0).getDate();
        const isEndOfMonth = (d >= lastDayOfStartMonth);

        let targetYear = y;
        let targetMonth = (m - 1) + monthsToAdd;
        
        targetYear += Math.floor(targetMonth / 12);
        targetMonth = targetMonth % 12;
        
        const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        
        let targetDay = d;
        if (isEndOfMonth || targetDay > lastDayOfTargetMonth) {
            targetDay = lastDayOfTargetMonth;
        }
        
        return `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(targetDay).padStart(2, '0')}`;
    }

    for (let i = 1; i <= totalCount; i++) {
        const amt = (i === totalCount) ? finalAmount : regularAmount;
        const instDate = addMonthsToDate(firstDateStr, i - 1);
        const oldInst = existing?.installments.find(ins => ins.number === i);
        installments.push({
            number: i,
            amount: amt,
            date: instDate,
            paid: oldInst ? oldInst.paid : false
        });
    }

    installmentsPurchases = installmentsPurchases.map(p => {
        if (p.id === editingInstallmentId) {
            return {
                ...p,
                name,
                financedAmount,
                interestAmount,
                totalAmount,
                totalCount,
                regularAmount,
                finalAmount,
                firstDate: firstDateStr,
                installments
            };
        }
        return p;
    });

    persistInstallments();
    $('installmentEditDlg').close();
    renderInstallments();
});


/* Modales y Eventos Generales */

function openNewMovement() {
    editingId = null;
    $('form').reset();
    $('modalTitle').textContent = 'Nuevo movimiento';
    $('kind').value = 'expense';
    updateCategoryOptions();
    $('date').value = `${$('month').value}-${pad(today.getDate())}`;
    $('dlg').showModal();
    
    setTimeout(() => {
        $('form').focus();
    }, 10);
}

function editMovement(id) {
    const item = movements.find(m => m.id === id);
    if (!item) return;

    editingId = id;
    $('modalTitle').textContent = 'Editar movimiento';
    $('desc').value = item.desc;
    $('kind').value = item.kind;
    updateCategoryOptions();
    $('amount').value = item.amount;
    $('date').value = item.date;
    $('category').value = item.category;
    $('notes').value = item.notes || '';
    $('dlg').showModal();

    setTimeout(() => {
        $('form').focus();
    }, 10);
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

    const [year, month, day] = item.date.split('-');
    const dateFormatted = `${day}/${month}/${year}`;
    const amountFormatted = formatMoney(item.amount);

    $('detailConcept').textContent = item.desc || 'Sin concepto';
    
    $('detailContent').innerHTML = `
        <table class="detail-table">
            <tr>
                <th>Categoría</th>
                <td>${escapeHtml(item.category)}</td>
            </tr>
            <tr>
                <th>Importe</th>
                <td>${amountFormatted}</td>
            </tr>
            <tr>
                <th>Fecha</th>
                <td>${dateFormatted}</td>
            </tr>
            <tr>
                <th>Notas</th>
                <td>${escapeHtml(item.notes || '')}</td>
            </tr>
        </table>
    `;

    $('detailDlg').showModal();
}

function renderConfigCategories() {
    const list = $('categoryManagerList');
    let html = '';

    ['expense', 'income'].forEach(kind => {
        const title = kind === 'expense' ? 'Gastos' : 'Ingresos';
        html += `<strong class="category-section-title">${title}</strong>`;
        appConfig.categories[kind].forEach((cat, index) => {
            html += `
                <div class="category-item-row">
                    <span style="font-size:14px; font-weight: 500;">${escapeHtml(cat.name)}</span>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div class="color-picker-container" title="Cambiar color">
                            <div class="color-picker-preview" style="background-color: ${cat.color};"></div>
                            <input type="color" value="${cat.color}" class="category-color-input" onchange="updateCatColor('${kind}', ${index}, this.value)">
                        </div>
                        <button type="button" class="danger icon-btn" onclick="removeCategory('${kind}', ${index})" style="width:28px; height:28px;">&times;</button>
                    </div>
                </div>
            `;
        });
    });

    list.innerHTML = html;
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
    updateCategoryOptions();
    render();
};

$('addCatBtn').addEventListener('click', () => {
    const kind = $('newCatKind').value;
    const name = $('newCatName').value.trim();
    const color = $('newCatColor').value;

    if (name && !appConfig.categories[kind].some(c => c.name === name)) {
        appConfig.categories[kind].push({ name, color });
        $('newCatName').value = '';
        persistConfig();
        renderConfigCategories();
        updateCategoryOptions();
        render();
    }
});

/* Modales y Eventos */

$('configBtn').addEventListener('click', () => {
    $('userNameInput').value = appConfig.userName;
    $('currencySelect').value = appConfig.currency || 'EUR';
    $('themeSelect').value = appConfig.theme || 'light';
    $('configDlg').showModal();
});

$('saveConfigBtn').addEventListener('click', () => {
    const newName = $('userNameInput').value.trim();
    if (newName) appConfig.userName = newName;
    appConfig.currency = $('currencySelect').value;
    appConfig.theme = $('themeSelect').value;

    persistConfig();
    updateCategoryOptions();
    render();
    $('configDlg').close();
});

$('cancelConfigBtn').addEventListener('click', () => {
    $('configDlg').close();
});

$('editCategoriesBtn').addEventListener('click', () => {
    renderConfigCategories();
    $('categoriesDlg').showModal();
});

$('closeCategoriesDlg').addEventListener('click', () => {
    $('categoriesDlg').close();
});

$('closeDetailBtn').addEventListener('click', () => {
    $('detailDlg').close();
});

/* Acordeón Registro de Movimientos */
$('toggleMovementsBtn').addEventListener('click', () => {
    isMovementsExpanded = !isMovementsExpanded;
    const container = $('movementsContainer');
    const icon = $('toggleMovementsIcon');
    const movementsCard = $('movementsCard');

    if (isMovementsExpanded) {
        container.style.display = 'block';
        movementsCard.classList.add('expanded');
        icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
        container.style.display = 'none';
        movementsCard.classList.remove('expanded');
        icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
});

/* Acordeón Resumen por Categorías */
$('toggleCategoriesBtn').addEventListener('click', () => {
    isCategoriesExpanded = !isCategoriesExpanded;
    const container = $('categoriesContainer');
    const icon = $('toggleCategoriesIcon');
    const summaryCard = document.querySelector('.summary-card:not(.remittance-card):not(#movementsCard):not(#installmentsCard)');

    if (isCategoriesExpanded) {
        container.style.display = 'block';
        summaryCard.classList.add('expanded');
        icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
        container.style.display = 'none';
        summaryCard.classList.remove('expanded');
        icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
});

/* Acordeón Calcular remesas */
$('toggleRemitBtn').addEventListener('click', () => {
    isRemitExpanded = !isRemitExpanded;
    const container = $('remitContainer');
    const icon = $('toggleRemitIcon');
    const remitCard = $('remittancesCard');

    if (isRemitExpanded) {
        container.style.display = 'block';
        remitCard.classList.add('expanded');
        icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
        container.style.display = 'none';
        remitCard.classList.remove('expanded');
        icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
});

/* Eventos generales */

$('addBtn').addEventListener('click', openNewMovement);
$('cancel').addEventListener('click', () => $('dlg').close());
$('kind').addEventListener('change', updateCategoryOptions);

$('month').addEventListener('change', () => {
    render();
});

$('search').addEventListener('input', render);
$('typeFilter').addEventListener('change', render);

$('rows').addEventListener('click', event => {
    const editBtn = event.target.closest('[data-edit]');
    const deleteBtn = event.target.closest('[data-delete]');
    const row = event.target.closest('.movement-row');

    if (editBtn) {
        editMovement(editBtn.dataset.edit);
        return;
    }

    if (deleteBtn) {
        deleteMovement(deleteBtn.dataset.delete);
        return;
    }

    if (row) {
        const itemBtn = row.querySelector('[data-edit]');
        if (itemBtn) {
            showMovementDetail(itemBtn.dataset.edit);
        }
    }
});

$('form').addEventListener('submit', event => {
    event.preventDefault();
    const existingItem = editingId ? movements.find(m => m.id === editingId) : null;
    
    const item = {
        id: editingId || crypto.randomUUID(),
        timestamp: existingItem?.timestamp || Date.now(),
        desc: $('desc').value.trim(),
        kind: $('kind').value,
        amount: Math.round(Number($('amount').value) * 100) / 100,
        date: $('date').value,
        category: $('category').value,
        notes: $('notes').value.trim()
    };

    if (editingId) {
        movements = movements.map(existing => existing.id === editingId ? item : existing);
    } else {
        movements.push(item);
    }

    persist();
    $('dlg').close();
    $('month').value = item.date.slice(0, 7);
    render();
});

/* Inicialización */

$('month').value = currentMonth;
$('date').value = `${currentMonth}-${pad(today.getDate())}`;
$('remitMonthInput').value = currentMonth;

// Configuración inicial de despliegue para movimientos
$('movementsCard').classList.add('expanded');
$('movementsContainer').style.display = 'block';
$('toggleMovementsIcon').innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';

applyTheme();
updateUserDisplay();
updateCurrencyLabels();
updateCategoryOptions();
loadRemittanceForSelectedMonth();
renderInstallments();
render();