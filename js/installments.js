import {
    $, state, today, pad, currentMonth, persistInstallments,
    formatCurrencyCustom, formatDateEs, escapeHtml,
    clearValidationErrors, validateRequiredFields, scrollCardIntoView,
    openModal, closeModal
} from './shared.js';

let editingInstallmentId = null;

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

export function openNewInstallmentPurchaseModal() {
    $('installmentNewForm')?.reset();
    if ($('newInstCurrency')) $('newInstCurrency').value = state.appConfig.currency || 'EUR';
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

export function renderInstallments() {
    const listContainer = $('installmentsList');
    if (!listContainer) return;

    if (!state.installmentsPurchases.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay compras registradas.</div>';
        return;
    }

    listContainer.innerHTML = state.installmentsPurchases.map((purchase) => {
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
                    <input type="checkbox" class="installment-checkbox" ${inst.paid ? 'checked' : ''}>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.2a2.5 2.5 0 0 1 3.5 3.5L7.6 20.1 3.2 21l.9-4.4L16.5 4.2zM14.3 6.4l3.5 3.5"/></svg>
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
    const purchase = state.installmentsPurchases.find(p => p.id === purchaseId);
    if (!purchase) return;

    const willBeExpanded = !purchase.expanded;
    state.installmentsPurchases.forEach(p => { p.expanded = p.id === purchaseId ? willBeExpanded : false; });
    persistInstallments();
    renderInstallments();
    scrollCardIntoView($(`purchase_box_${purchaseId}`), willBeExpanded);
}

function toggleInstallmentPaid(purchaseId, instNumber) {
    const purchase = state.installmentsPurchases.find(p => p.id === purchaseId);
    const inst = purchase?.installments.find(i => i.number === instNumber);
    if (!inst) return;

    const detailsEl = $(`purchase_details_${purchaseId}`);
    const savedScrollTop = detailsEl ? detailsEl.scrollTop : 0;
    const savedWindowScrollY = window.scrollY;

    inst.paid = !inst.paid;
    persistInstallments();
    renderInstallments();

    requestAnimationFrame(() => {
        const updatedDetailsEl = $(`purchase_details_${purchaseId}`);
        if (updatedDetailsEl) {
            updatedDetailsEl.scrollTop = savedScrollTop;
        }
        window.scrollTo({ top: savedWindowScrollY, behavior: 'instant' });
    });
}

function editPurchase(purchaseId) {
    const purchase = state.installmentsPurchases.find(p => p.id === purchaseId);
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

export function initInstallments() {
    $('installmentsList')?.addEventListener('click', (e) => {
        const editBtn = e.target.closest('[data-action="edit-purchase"]');
        if (editBtn) { e.stopPropagation(); editPurchase(editBtn.dataset.purchaseId); return; }

        const row = e.target.closest('[data-action="toggle-inst-paid"]');
        if (row) { toggleInstallmentPaid(row.dataset.purchaseId, Number(row.dataset.instNumber)); return; }

        const header = e.target.closest('[data-action="toggle-purchase"]');
        if (header) togglePurchaseAccordion(header.dataset.purchaseId);
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
        state.installmentsPurchases.forEach(p => { p.expanded = false; });
        state.installmentsPurchases.unshift({
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
        const purchase = state.installmentsPurchases.find(p => p.id === editingInstallmentId);
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
        state.installmentsPurchases = state.installmentsPurchases.filter(p => p.id !== editingInstallmentId);
        persistInstallments();
        closeModal($('installmentEditDlg'));
        renderInstallments();
    });

    renderInstallments();
}