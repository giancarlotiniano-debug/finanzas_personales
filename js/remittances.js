import {
    $, state, today, SPANISH_MONTH_NAMES, persistRemittancesList,
    formatCurrencyCustom, formatNumberDisplay, formatTcInputValue,
    formatPlainInputValue, parseInputNumber, escapeHtml,
    clearValidationErrors, validateRequiredFields, scrollCardIntoView,
    openModal, closeModal
} from './shared.js';

let editingRemittanceId = null;

export function openNewRemittanceModal() {
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
    if ($(`total_send_${rem.id}`)) $(`total_send_${rem.id}`).textContent = formatCurrencyCustom(totalSend, rem.sendCurr);
    if ($(`total_recv_${rem.id}`)) $(`total_recv_${rem.id}`).textContent = formatCurrencyCustom(totalRecv, rem.recvCurr);
    if ($(`grand_total_${rem.id}`)) $(`grand_total_${rem.id}`).textContent = formatCurrencyCustom(grandTotal, rem.sendCurr);
    if ($(`remit_header_summary_${rem.id}`)) {
        $(`remit_header_summary_${rem.id}`).textContent = `${rem.sendCurr} → ${rem.recvCurr} • Total: ${formatCurrencyCustom(grandTotal, rem.sendCurr)}`;
    }
}

export function renderRemittancesList() {
    const listContainer = $('remittancesList');
    if (!listContainer) return;

    if (!state.remittancesList?.length) {
        listContainer.innerHTML = '<div class="empty empty-compact">Aún no hay remesas registradas.</div>';
        return;
    }

    listContainer.innerHTML = state.remittancesList.map((rem) => {
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
                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.2a2.5 2.5 0 0 1 3.5 3.5L7.6 20.1 3.2 21l.9-4.4L16.5 4.2zM14.3 6.4l3.5 3.5"/></svg>
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
    const rem = state.remittancesList.find(r => r.id === remId);
    if (!rem) return;

    const willBeExpanded = !rem.expanded;
    state.remittancesList.forEach(r => { r.expanded = r.id === remId ? willBeExpanded : false; });
    persistRemittancesList();
    renderRemittancesList();
    scrollCardIntoView($(`remit_box_${remId}`), willBeExpanded);
}

function deleteRemittance(remId) {
    if (!confirm('¿Eliminar esta remesa y todo su registro?')) return;
    state.remittancesList = state.remittancesList.filter(r => r.id !== remId);
    persistRemittancesList();
    closeModal($('remitEditDlg'));
    renderRemittancesList();
}

function editRemittance(remId) {
    const rem = state.remittancesList.find(r => r.id === remId);
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
    const rem = state.remittancesList.find(r => r.id === remId);
    if (!rem) return;
    rem.items.splice(index, 1);
    persistRemittancesList();
    renderRemittancesList();
}

function addRemitItem(remId) {
    const inputEl = $(`new_concept_input_${remId}`);
    const conceptName = inputEl?.value.trim();
    if (!conceptName) return;

    const rem = state.remittancesList.find(r => r.id === remId);
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

export function initRemittances() {
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
            const rem = state.remittancesList.find(r => r.id === input.dataset.remitId);
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
            const rem = state.remittancesList.find(r => r.id === input.dataset.remitId);
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
        const rem = state.remittancesList.find(r => r.id === input.dataset.remitId);
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
        const rem = state.remittancesList.find(r => r.id === input.dataset.remitId);
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
        const rem = state.remittancesList.find(r => r.id === input.dataset.remitId);
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

    $('cancelNewRemitBtn')?.addEventListener('click', () => closeModal($('remitNewDlg')));
    $('remitNewForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('newRemitName');
        if (!validateRequiredFields($('remitNewForm'), [nameInput])) return;

        const newId = crypto.randomUUID();
        state.remittancesList.forEach(r => { r.expanded = false; });
        state.remittancesList.unshift({
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

        const rem = state.remittancesList.find(r => r.id === editingRemittanceId);
        if (rem) {
            rem.name = nameInput.value.trim();
            rem.sendCurr = $('editRemitSendCurr').value;
            rem.recvCurr = $('editRemitRecvCurr').value;
            persistRemittancesList();
        }

        closeModal($('remitEditDlg'));
        renderRemittancesList();
    });

    renderRemittancesList();
}