import {
    $, state, today, pad, currentMonth, SPANISH_MONTH_NAMES,
    persistDayCounter, formatDateEs, toIsoDateLocal, parseIsoParts,
    escapeHtml, clearValidationErrors, validateRequiredFields,
    openModal, closeModal
} from './shared.js';

const WEEKDAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0-11
let selectedIsoDate = toIsoDateLocal(today);

let editingDayMonthId = null;
let editingDayIndex = null;

const sortShiftsChronologically = (a, b) =>
    b.date.localeCompare(a.date) || (a.entryTime || '').localeCompare(b.entryTime || '');

function parseKeyFromMonthName(name) {
    if (!name || typeof name !== 'string') return null;
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) return null;
    const year = parts[parts.length - 1];
    const monthName = parts.slice(0, -1).join(' ').toLowerCase();
    const monthIndex = SPANISH_MONTH_NAMES.findIndex(m => m.toLowerCase() === monthName);
    if (!/^\d{4}$/.test(year) || monthIndex === -1) return null;
    return `${year}-${pad(monthIndex + 1)}`;
}

/* Normaliza y migra datos antiguos (acordeones) al formato indexado por YYYY-MM */
function ensureNormalizedDayCounterData() {
    if (!Array.isArray(state.dayCounterMonths)) {
        state.dayCounterMonths = [];
    }

    const byKey = new Map();
    let changed = false;

    state.dayCounterMonths.forEach((entry) => {
        const keyFromDays = entry.days?.[0]?.date?.slice(0, 7);
        const key = /^\d{4}-\d{2}$/.test(entry.id)
            ? entry.id
            : (keyFromDays || parseKeyFromMonthName(entry.name));

        if (!key) return;
        if (entry.id !== key) changed = true;

        const [y, m] = key.split('-').map(Number);
        const canonicalName = `${SPANISH_MONTH_NAMES[m - 1]} ${y}`;
        const hasRegisterFlag = typeof entry.registerExtras === 'boolean';
        if (!hasRegisterFlag) changed = true;

        if (!byKey.has(key)) {
            byKey.set(key, {
                id: key,
                name: canonicalName,
                registerExtras: hasRegisterFlag ? entry.registerExtras : false,
                targetDays: Number(entry.targetDays) || 0,
                days: Array.isArray(entry.days) ? [...entry.days] : []
            });
        } else {
            const existing = byKey.get(key);
            if (Array.isArray(entry.days)) existing.days.push(...entry.days);
            changed = true;
        }
    });
    
    byKey.forEach((rec) => rec.days.sort(sortShiftsChronologically));
    state.dayCounterMonths = Array.from(byKey.values());

    if (changed) {    
        persistDayCounter();
    }
}

function getMonthKey(year, monthZeroBased) {
    return `${year}-${pad(monthZeroBased + 1)}`;
}

function getOrCreateMonthRecord(year, monthZeroBased, createIfMissing = false) {
    ensureNormalizedDayCounterData();
    const key = getMonthKey(year, monthZeroBased);
    let record = state.dayCounterMonths.find(m => m.id === key);

    if (!record && createIfMissing) {
        record = {
            id: key,
            name: `${SPANISH_MONTH_NAMES[monthZeroBased]} ${year}`,
            registerExtras: false,
            targetDays: 0,
            days: []
        };
        state.dayCounterMonths.push(record);
    }
    return record;
}

function getDayNameFromDate(dateStr) {
    if (!dateStr) return '';
    const name = new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long' });
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatTime12h(time24) {
    if (!time24 || !time24.includes(':')) return time24 || '';
    const [hStr, mStr] = time24.split(':');
    const h = Number(hStr);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${mStr} ${period}`;
}

/* Llamada por el botón "+ Nuevo" de la cabecera superior */
export function openNewDayCounterMonthModal() {
    const monthKey = getMonthKey(viewYear, viewMonth);
    const defaultDate = selectedIsoDate.startsWith(monthKey)
        ? selectedIsoDate
        : `${monthKey}-01`;
    openDayCounterDayModal(monthKey, null, defaultDate);
}

function setRegisterExtrasState(enabled) {
    const form = $('dayCounterTargetForm');
    const fieldGroup = $('targetDaysFieldGroup');
    const targetInput = $('monthTargetDaysInput');

    form?.querySelectorAll('[data-register-extras]').forEach((btn) => {
        const isActive = (btn.dataset.registerExtras === 'yes') === enabled;
        btn.classList.toggle('active', isActive);
    });

    if (fieldGroup) fieldGroup.classList.toggle('is-disabled', !enabled);
    if (targetInput) {
        targetInput.disabled = !enabled;
        if (!enabled) targetInput.classList.remove('input-error');
    }
}

function openTargetConfigModal() {
    const record = getOrCreateMonthRecord(viewYear, viewMonth, false);
    const monthTitle = `${SPANISH_MONTH_NAMES[viewMonth]} ${viewYear}`;
    const registerExtras = record?.registerExtras === true;

    if ($('targetDlgTitle')) $('targetDlgTitle').textContent = `${monthTitle}`;
    if ($('monthTargetDaysInput')) $('monthTargetDaysInput').value = record?.targetDays ?? 0;
    clearValidationErrors($('dayCounterTargetForm'));
    setRegisterExtrasState(registerExtras);
    openModal($('dayCounterTargetDlg'));
}

export function renderDayCounter() {
    const calContainer = $('dayCounterCalendarContainer');
    const detailsContainer = $('dayCounterSelectedDetails');
    if (!calContainer || !detailsContainer) return;

    ensureNormalizedDayCounterData();

    const monthKey = getMonthKey(viewYear, viewMonth);
    const record = getOrCreateMonthRecord(viewYear, viewMonth, false);
    const monthDays = record?.days || [];
    const registerExtras = record?.registerExtras === true;
    const targetDays = Number(record?.targetDays) || 0;
    const workedCount = monthDays.length;
    const extraCount = targetDays > 0 ? Math.max(0, workedCount - targetDays) : 0;
    const statsText = registerExtras
        ? `Trabajados: ${workedCount} • Extras: ${extraCount}`
        : `Trabajados: ${workedCount}`;

    if (!selectedIsoDate.startsWith(monthKey)) {
        const todayIso = toIsoDateLocal(today);
        if (todayIso.startsWith(monthKey)) {
            selectedIsoDate = todayIso;
        } else if (monthDays.length > 0) {
            const sortedAsc = [...monthDays].sort((a, b) => a.date.localeCompare(b.date));
            selectedIsoDate = sortedAsc[0].date;
        } else {
            selectedIsoDate = `${monthKey}-01`;
        }
    }

    const workedDatesSet = new Set(monthDays.map(d => d.date));
    const todayIso = toIsoDateLocal(today);

    const firstWeekdayOffset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const allCells = [];
    for (let i = 0; i < firstWeekdayOffset; i++) {
        allCells.push('<div class="dc-day-cell is-empty"></div>');
    }

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
        const iso = `${monthKey}-${pad(dayNum)}`;
        const colIndex = (firstWeekdayOffset + dayNum - 1) % 7;
        const isSunday = colIndex === 6;
        const hasShift = workedDatesSet.has(iso);
        const isSelected = iso === selectedIsoDate;
        const isToday = iso === todayIso;

        const classes = [
            'dc-day-cell',
            isSunday ? 'is-sunday' : '',
            hasShift ? 'has-shift' : '',
            isSelected ? 'is-selected' : '',
            isToday ? 'is-today' : ''
        ].filter(Boolean).join(' ');

        allCells.push(`
            <button type="button" class="${classes}" data-action="select-cal-day" data-iso="${iso}" aria-label="${dayNum} de ${SPANISH_MONTH_NAMES[viewMonth]}">
                <span class="dc-day-num">${dayNum}</span>
                <span class="dc-day-bar"></span>
            </button>
        `);
    }

    while (allCells.length % 7 !== 0) {
        allCells.push('<div class="dc-day-cell is-empty"></div>');
    }

    const weekRowsHtml = [];
    for (let i = 0; i < allCells.length; i += 7) {
        const weekSlice = allCells.slice(i, i + 7).join('');
        const isFirstIncompleteWeek = i === 0 && firstWeekdayOffset > 0;
        weekRowsHtml.push(`
            <div class="dc-week-row ${isFirstIncompleteWeek ? 'is-first-week' : ''}">
                ${weekSlice}
            </div>
        `);
    }

    const weekdaysHeaderHtml = WEEKDAY_INITIALS.map((letter, idx) =>
        `<span class="dc-weekday-cell ${idx === 6 ? 'is-sunday' : ''}">${letter}</span>`
    ).join('');

    calContainer.innerHTML = `
        <div class="dc-cal-card">
            <div class="dc-cal-header">
                <div class="dc-cal-title-group">
                    <div class="dc-cal-title-row">
                        <h2 class="dc-cal-month-title">${SPANISH_MONTH_NAMES[viewMonth]} ${viewYear}</h2>
                        <button type="button" class="dc-gear-btn" data-action="open-target-config" title="Configurar días objetivo" aria-label="Configurar días objetivo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="16.5" cy="12" r="1.25" fill="currentColor" stroke="none"/></svg>
                        </button>
                    </div>
                    <span class="dc-cal-stats">${statsText}</span>
                </div>
                <div class="dc-cal-nav">
                    <button type="button" class="dc-nav-circle-btn" data-action="prev-month" aria-label="Mes anterior">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3L8.2 10.8a1.7 1.7 0 0 0 0 2.4L16 21"/></svg>
                    </button>
                    <button type="button" class="dc-nav-circle-btn" data-action="next-month" aria-label="Mes siguiente">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l7.8 7.8a1.7 1.7 0 0 1 0 2.4L8 21"/></svg>
                    </button>
                </div>
            </div>
            <div class="dc-weekdays-row">${weekdaysHeaderHtml}</div>
            <div class="dc-weeks-wrapper">${weekRowsHtml.join('')}</div>
        </div>
    `;

    const matchingEntries = monthDays
        .map((day, idx) => ({ day, idx }))
        .filter(({ day }) => day.date === selectedIsoDate);

    if (!matchingEntries.length) {
        detailsContainer.innerHTML = `
            <div class="dc-detail-card">
                <div class="dc-empty-state">No hay turnos registrados.</div>
            </div>
        `;
        return;
    }

    const shiftsHtml = matchingEntries.map(({ day, idx }) => `
        <div class="dc-shift-detail-row">
            <div class="dc-shift-left">
                <span class="dc-shift-accent-bar"></span>
                <div class="dc-shift-info">
                    <span class="dc-shift-location">${escapeHtml(day.location)}</span>
                    <span class="dc-shift-date-sub">${escapeHtml(day.dayName)} ${formatDateEs(day.date)}</span>
                </div>
            </div>
            <div class="dc-shift-right">
                <div class="dc-shift-times">
                    <span class="dc-time-entry">${escapeHtml(formatTime12h(day.entryTime))}</span>
                    <span class="dc-time-exit">${escapeHtml(formatTime12h(day.exitTime))}</span>
                </div>
                <button type="button" class="dc-shift-edit-btn" data-action="edit-day" data-month-id="${monthKey}" data-day-index="${idx}" title="Editar turno" aria-label="Editar turno">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.2a2.5 2.5 0 0 1 3.5 3.5L7.6 20.1 3.2 21l.9-4.4L16.5 4.2zM14.3 6.4l3.5 3.5"/></svg>
                </button>
            </div>
        </div>
    `).join('');

    detailsContainer.innerHTML = `<div class="dc-detail-card">${shiftsHtml}</div>`;
}

function openDayCounterDayModal(monthId, dayIndex = null, prefillDate = null) {
    const [y, m] = monthId.split('-').map(Number);
    const month = getOrCreateMonthRecord(y, m - 1, false);

    editingDayMonthId = monthId;
    editingDayIndex = dayIndex;
    clearValidationErrors($('dayCounterDayForm'));

    const isEditing = dayIndex !== null && month?.days[dayIndex];
    const copyWrapper = $('copyPreviousDayWrapper');

    if (isEditing) {
        const day = month.days[dayIndex];
        $('dayDlgTitle').textContent = 'Editar turno';
        $('dayDate').value = day.date;
        $('dayNameDisplay').value = day.dayName;
        $('dayEntryTime').value = day.entryTime;
        $('dayExitTime').value = day.exitTime;
        $('dayLocation').value = day.location;

        if (copyWrapper) copyWrapper.style.display = 'none';
        $('dayModalActionsSplit').style.display = 'flex';
        $('dayModalActionsNormal').style.display = 'none';
    } else {
        $('dayDlgTitle').textContent = 'Registrar turno';
        const defaultDate = prefillDate || selectedIsoDate || `${currentMonth}-${pad(today.getDate())}`;
        $('dayDate').value = defaultDate;
        $('dayNameDisplay').value = getDayNameFromDate(defaultDate);
        $('dayEntryTime').value = '18:00';
        $('dayExitTime').value = '06:00';
        $('dayLocation').value = '';

        const hasAnyPreviousShift = state.dayCounterMonths.some(rec => rec.days?.length > 0);
        if (copyWrapper) copyWrapper.style.display = hasAnyPreviousShift ? 'block' : 'none';
        $('dayModalActionsSplit').style.display = 'none';
        $('dayModalActionsNormal').style.display = 'flex';
    }

    openModal($('dayCounterDayDlg'));
}

function copyLastDayData() {
    const allDays = state.dayCounterMonths
        .flatMap(m => m.days || [])
        .sort((a, b) => b.date.localeCompare(a.date) || (b.entryTime || '').localeCompare(a.entryTime || ''));

    if (!allDays.length) return;
    const lastDay = allDays[0];

    $('dayEntryTime').value = lastDay.entryTime || '';
    $('dayExitTime').value = lastDay.exitTime || '';
    $('dayLocation').value = lastDay.location || '';
    clearValidationErrors($('dayCounterDayForm'));
}

export function initDayCounter() {
    ensureNormalizedDayCounterData();

    $('dayCounterCard')?.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const { action, iso, monthId, dayIndex } = target.dataset;

        if (action === 'prev-month') {
            const d = new Date(viewYear, viewMonth - 1, 1);
            viewYear = d.getFullYear();
            viewMonth = d.getMonth();
            renderDayCounter();
        } else if (action === 'next-month') {
            const d = new Date(viewYear, viewMonth + 1, 1);
            viewYear = d.getFullYear();
            viewMonth = d.getMonth();
            renderDayCounter();
        } else if (action === 'select-cal-day') {
            selectedIsoDate = iso;
            renderDayCounter();
        } else if (action === 'open-target-config') {
            openTargetConfigModal();
        } else if (action === 'edit-day') {
            openDayCounterDayModal(monthId, Number(dayIndex));
        }
    });

    /* Diálogo de días objetivo */
    $('dayCounterTargetForm')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-register-extras]');
        if (!btn) return;
        setRegisterExtrasState(btn.dataset.registerExtras === 'yes');
    });

    $('cancelTargetDlg')?.addEventListener('click', () => closeModal($('dayCounterTargetDlg')));
    $('dayCounterTargetForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetInput = $('monthTargetDaysInput');
        const activeBtn = $('dayCounterTargetForm')?.querySelector('[data-register-extras].active');
        const registerExtras = activeBtn ? activeBtn.dataset.registerExtras === 'yes' : false;

        const record = getOrCreateMonthRecord(viewYear, viewMonth, true);
        record.registerExtras = registerExtras;

        if (registerExtras) {
            if (!validateRequiredFields($('dayCounterTargetForm'), [targetInput])) return;

            const targetVal = parseInt(targetInput.value, 10);
            if (isNaN(targetVal) || targetVal < 0 || targetVal > 31) {
                targetInput.classList.add('input-error');
                targetInput.focus();
                return;
            }
            record.targetDays = targetVal;
        }

        persistDayCounter();
        closeModal($('dayCounterTargetDlg'));
        renderDayCounter();
    });

    /* Diálogo de registro / edición de turno */
    $('copyPreviousDayBtn')?.addEventListener('click', copyLastDayData);
    $('dayDate')?.addEventListener('change', (e) => {
        $('dayNameDisplay').value = getDayNameFromDate(e.target.value);
    });

    const closeDayModal = () => closeModal($('dayCounterDayDlg'));
    $('cancelDayCounterDay')?.addEventListener('click', closeDayModal);
    $('cancelDayCounterDayNormal')?.addEventListener('click', closeDayModal);

    $('deleteDayModalBtn')?.addEventListener('click', () => {
        if (!confirm('¿Eliminar este turno registrado?')) return;
        const month = state.dayCounterMonths.find(m => m.id === editingDayMonthId);
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

        const dayData = {
            date: dateInput.value,
            dayName: getDayNameFromDate(dateInput.value),
            entryTime: entryInput.value,
            exitTime: exitInput.value,
            location: locInput.value.trim()
        };

        const targetParts = parseIsoParts(dayData.date);
        if (!targetParts) return;

        const targetMonthKey = getMonthKey(targetParts.y, targetParts.m - 1);
        const targetRecord = getOrCreateMonthRecord(targetParts.y, targetParts.m - 1, true);

        if (editingDayIndex !== null && editingDayMonthId) {
            const originRecord = state.dayCounterMonths.find(m => m.id === editingDayMonthId);
            const duplicateOnEdit = targetRecord.days.some((d, idx) =>
                !(editingDayMonthId === targetMonthKey && idx === editingDayIndex) && d.date === dayData.date
            );
            if (duplicateOnEdit) {
                const ok = confirm(`El día ${formatDateEs(dayData.date)} ya tiene un turno registrado. ¿Deseas registrarlo nuevamente?`);
                if (!ok) return;
            }

            if (editingDayMonthId === targetMonthKey && originRecord?.days[editingDayIndex]) {
                originRecord.days[editingDayIndex] = dayData;
            } else {
                originRecord?.days.splice(editingDayIndex, 1);
                targetRecord.days.push(dayData);
            }
        } else {
            const alreadyRegistered = targetRecord.days.some(d => d.date === dayData.date);
            if (alreadyRegistered) {
                const ok = confirm(`El día ${formatDateEs(dayData.date)} ya tiene un turno registrado. ¿Deseas registrarlo nuevamente?`);
                if (!ok) return;
            }
            targetRecord.days.push(dayData);
        }

        targetRecord.days.sort(sortShiftsChronologically);

        // Navega automáticamente al mes y día recién guardado
        viewYear = targetParts.y;
        viewMonth = targetParts.m - 1;
        selectedIsoDate = dayData.date;

        persistDayCounter();
        closeModal($('dayCounterDayDlg'));
        renderDayCounter();
    });

    renderDayCounter();
}