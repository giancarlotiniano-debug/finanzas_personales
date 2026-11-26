import {
    $, state, today, pad, currentMonth, SPANISH_MONTH_NAMES,
    persistDayCounter, persistConfigRaw, formatDateEs, toIsoDateLocal,
    parseIsoParts, escapeHtml, clearValidationErrors, validateRequiredFields,
    formatMoney, formatPlainInputValue, parseInputNumber, getCurrencySymbol,
    openModal, closeModal
} from './shared.js';

const WEEKDAY_INITIALS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const CUSTOM_LOCATION_VALUE = '__custom__';

let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0-11
let selectedIsoDate = toIsoDateLocal(today);

let editingDayMonthId = null;
let editingDayIndex = null;

let draftNightSurchargePercent = 0;
let draftIrpfDiscountPercent = 0;
let draftWorkPlaces = [];
let editingWorkPlaceIndex = null;

const sortShiftsChronologically = (a, b) =>
    b.date.localeCompare(a.date) || (a.entryTime || '').localeCompare(b.entryTime || '');

/* =========================================================
   CONFIGURACIÓN DE TURNOS (LUGARES Y RECARGO NOCTURNO %)
   ========================================================= */
function ensureDayCounterSettings() {
    if (!state.appConfig.dayCounterSettings || typeof state.appConfig.dayCounterSettings !== 'object') {
        state.appConfig.dayCounterSettings = {
            nightSurchargePercent: 0,
            irpfDiscountPercent: 0,
            places: []
        };
    }
    const cfg = state.appConfig.dayCounterSettings;
    if (typeof cfg.nightSurchargePercent !== 'number' || isNaN(cfg.nightSurchargePercent)) {
        cfg.nightSurchargePercent = 0;
    }
    if (typeof cfg.irpfDiscountPercent !== 'number' || isNaN(cfg.irpfDiscountPercent)) {
        cfg.irpfDiscountPercent = 0;
    }
    if (!Array.isArray(cfg.places)) {
        cfg.places = [];
    }
    return cfg;
}

function getIrpfDiscountPercent() {
    return ensureDayCounterSettings().irpfDiscountPercent;
}

function getWorkPlaces() {
    return ensureDayCounterSettings().places;
}

function getNightSurchargePercent() {
    return ensureDayCounterSettings().nightSurchargePercent;
}

function findWorkPlaceByName(name) {
    const clean = String(name || '').trim().toLowerCase();
    if (!clean) return null;
    return getWorkPlaces().find(p => p.name.trim().toLowerCase() === clean) || null;
}

/* =========================================================
   NORMALIZACIÓN DE DATOS MENSUALES
   ========================================================= */
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

function ensureNormalizedDayCounterData() {
    ensureDayCounterSettings();

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

        const hasShowWorked = typeof entry.showWorkedDays === 'boolean';
        const hasRegisterFlag = typeof entry.registerExtras === 'boolean';
        const hasShowHours = typeof entry.showHours === 'boolean';
        if (!hasShowWorked || !hasRegisterFlag || !hasShowHours) changed = true;

        if (!byKey.has(key)) {
            byKey.set(key, {
                id: key,
                name: canonicalName,
                showWorkedDays: hasShowWorked ? entry.showWorkedDays : true,
                registerExtras: hasRegisterFlag ? entry.registerExtras : false,
                showHours: hasShowHours ? entry.showHours : false,
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
            showWorkedDays: true,
            registerExtras: false,
            showHours: false,
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

/* =========================================================
   CÁLCULO DE HORAS NORMALES, NOCTURNAS Y GANANCIAS POR LUGAR
   ========================================================= */
function parseTimeToMinutes(timeStr) {
    if (!timeStr || !timeStr.includes(':')) return null;
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
}

function calculateShiftHoursBreakdown(entryTime, exitTime) {
    const startMin = parseTimeToMinutes(entryTime);
    let endMin = parseTimeToMinutes(exitTime);
    if (startMin === null || endMin === null) {
        return { normalMinutes: 0, nightMinutes: 0, totalMinutes: 0 };
    }

    if (endMin <= startMin) {
        endMin += 1440;
    }

    let nightMinutes = 0;
    for (let m = startMin; m < endMin; m++) {
        const minuteOfDay = m % 1440;
        if (minuteOfDay >= 1320 || minuteOfDay < 360) {
            nightMinutes++;
        }
    }

    const totalMinutes = endMin - startMin;
    const normalMinutes = totalMinutes - nightMinutes;
    return { normalMinutes, nightMinutes, totalMinutes };
}

function calculateMonthHoursSummary(days = []) {
    const surchargePercent = getNightSurchargePercent();
    const nightMultiplier = 1 + (surchargePercent / 100);

    let normalMinutes = 0;
    let nightMinutes = 0;
    let totalMinutes = 0;
    let totalEarnings = 0;
    let hasAnyRatedPlace = false;

    const placesMap = new Map();

    days.forEach((shift) => {
        const breakdown = calculateShiftHoursBreakdown(shift.entryTime, shift.exitTime);
        normalMinutes += breakdown.normalMinutes;
        nightMinutes += breakdown.nightMinutes;
        totalMinutes += breakdown.totalMinutes;

        const displayLoc = (shift.location || 'Sin especificar').trim();
        const groupKey = displayLoc.toLowerCase();
        const configuredPlace = findWorkPlaceByName(displayLoc);
        const hourlyRate = configuredPlace && configuredPlace.hourlyRate > 0 ? configuredPlace.hourlyRate : null;

        if (!placesMap.has(groupKey)) {
            placesMap.set(groupKey, {
                name: configuredPlace ? configuredPlace.name : displayLoc,
                hourlyRate,
                normalMinutes: 0,
                nightMinutes: 0,
                totalMinutes: 0,
                earnings: hourlyRate !== null ? 0 : null
            });
        }

        const entry = placesMap.get(groupKey);
        entry.normalMinutes += breakdown.normalMinutes;
        entry.nightMinutes += breakdown.nightMinutes;
        entry.totalMinutes += breakdown.totalMinutes;

        if (hourlyRate !== null) {
            hasAnyRatedPlace = true;
            const shiftPay = ((breakdown.normalMinutes / 60) * hourlyRate)
                + ((breakdown.nightMinutes / 60) * hourlyRate * nightMultiplier);
            entry.earnings = (entry.earnings || 0) + shiftPay;
            totalEarnings += shiftPay;
        }
    });

    const irpfPercent = getIrpfDiscountPercent();
    const irpfAmount = totalEarnings * (irpfPercent / 100);
    const netEarnings = Math.max(0, totalEarnings - irpfAmount);

    const placesList = Array.from(placesMap.values()).sort((a, b) => b.totalMinutes - a.totalMinutes);

    return {
        normalMinutes,
        nightMinutes,
        totalMinutes,
        totalEarnings,
        irpfPercent,
        irpfAmount,
        netEarnings,
        hasAnyRatedPlace,
        surchargePercent,
        placesList
    };
}

function formatHoursDuration(totalMinutes) {
    const mins = Math.max(0, Math.round(totalMinutes));
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function renderHoursInfoModalContent() {
    const record = getOrCreateMonthRecord(viewYear, viewMonth, false);
    const summary = calculateMonthHoursSummary(record?.days || []);
    const contentEl = $('hoursInfoContent');
    if (!contentEl) return;

    if (!summary.placesList.length) {
        contentEl.innerHTML = `<div class="dc-empty-state">No hay turnos registrados en este mes.</div>`;
        return;
    }

    const monthTitle = `${SPANISH_MONTH_NAMES[viewMonth]} ${viewYear}`;
    const irpfLabel = `IRPF (-${summary.irpfPercent}%)`;
    const irpfValueStr = summary.irpfAmount > 0
        ? `-${formatMoney(summary.irpfAmount)}`
        : formatMoney(0);

    const totalGeneralCardHtml = `
        <div class="dc-breakdown-section-label">Total general:</div>
        <div class="dc-place-summary-card">
            <div class="dc-place-summary-head">
                <span class="dc-place-summary-name">${monthTitle}</span>
            </div>
            <div class="dc-place-summary-grid">
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">Normales</span>
                    <span class="dc-place-metric-val">${formatHoursDuration(summary.normalMinutes)}</span>
                </div>
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">Nocturnas</span>
                    <span class="dc-place-metric-val">${formatHoursDuration(summary.nightMinutes)}</span>
                </div>
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">Total horas</span>
                    <span class="dc-place-metric-val">${formatHoursDuration(summary.totalMinutes)}</span>
                </div>
            </div>
            <div class="dc-place-summary-grid">
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">Total bruto</span>
                    <span class="dc-place-metric-val">${formatMoney(summary.totalEarnings)}</span>
                </div>
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">${irpfLabel}</span>
                    <span class="dc-place-metric-val ${summary.irpfAmount > 0 ? 'is-expense' : ''}">${irpfValueStr}</span>
                </div>
                <div class="dc-place-metric">
                    <span class="dc-place-metric-label">Total estimado</span>
                    <span class="dc-place-metric-val is-money">${formatMoney(summary.netEarnings)}</span>
                </div>
            </div>
        </div>
    `;

    const cardsHtml = summary.placesList.map((place) => {
        const rateLabel = place.hourlyRate !== null
            ? `${formatMoney(place.hourlyRate)}/h`
            : 'Sin tarifa';
        const earningsDisplay = place.earnings !== null
            ? `<span class="dc-place-metric-val is-money">${formatMoney(place.earnings)}</span>`
            : `<span class="dc-place-metric-val">—</span>`;

        return `
            <div class="dc-place-summary-card">
                <div class="dc-place-summary-head">
                    <span class="dc-place-summary-name">${escapeHtml(place.name)}</span>
                    <span class="dc-place-summary-rate">${rateLabel}</span>
                </div>
                <div class="dc-place-summary-grid is-four-items">
                    <div class="dc-place-metric">
                        <span class="dc-place-metric-label">Normales</span>
                        <span class="dc-place-metric-val">${formatHoursDuration(place.normalMinutes)}</span>
                    </div>
                    <div class="dc-place-metric">
                        <span class="dc-place-metric-label">Nocturnas</span>
                        <span class="dc-place-metric-val">${formatHoursDuration(place.nightMinutes)}</span>
                    </div>
                    <div class="dc-place-metric">
                        <span class="dc-place-metric-label">Total</span>
                        <span class="dc-place-metric-val">${formatHoursDuration(place.totalMinutes)}</span>
                    </div>
                    <div class="dc-place-metric">
                        <span class="dc-place-metric-label">Ganado</span>
                        ${earningsDisplay}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    contentEl.innerHTML = `
        <div class="dc-places-breakdown">
            ${totalGeneralCardHtml}
            <div class="dc-breakdown-section-label is-second">Por lugar:</div>
            ${cardsHtml}
        </div>
        <p class="dc-hours-note">Nocturnas: 10:00 PM a 6:00 AM (+${summary.surchargePercent}%).</p>
    `;
}

function openHoursInfoModal() {
    const monthTitle = `${SPANISH_MONTH_NAMES[viewMonth]} ${viewYear}`;
    if ($('hoursInfoMonthTitle')) {
        $('hoursInfoMonthTitle').textContent = `Detalle por horas`;
    }
    renderHoursInfoModalContent();
    openModal($('dayCounterHoursInfoDlg'));
}

/* =========================================================
   MODAL DE CONFIGURACIÓN GENERAL DE TURNOS TRABAJADOS
   ========================================================= */
function renderDraftWorkPlacesList() {
    const listEl = $('dcWorkPlacesList');
    if (!listEl) return;

    if (!draftWorkPlaces.length) {
        listEl.innerHTML = `<div class="dc-places-empty">Aún no has agregado lugares de trabajo.</div>`;
        return;
    }

    listEl.innerHTML = draftWorkPlaces.map((place, idx) => {
        const rateText = place.hourlyRate !== null && place.hourlyRate > 0
            ? `${formatMoney(place.hourlyRate)} / hora`
            : 'Sin pago por hora configurado';

        return `
            <div class="dc-place-row">
                <div class="dc-place-row-info">
                    <span class="dc-place-row-name">${escapeHtml(place.name)}</span>
                    <span class="dc-place-row-rate">${rateText}</span>
                </div>
                <button type="button" class="edit-category-button" data-action="edit-work-place" data-place-index="${idx}" title="Editar lugar" aria-label="Editar lugar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
            </div>
        `;
    }).join('');
}

export function openDayCounterSettingsModal() {
    const cfg = ensureDayCounterSettings();
    draftNightSurchargePercent = cfg.nightSurchargePercent;
    draftIrpfDiscountPercent = cfg.irpfDiscountPercent;
    draftWorkPlaces = cfg.places.map(p => ({ ...p }));

    clearValidationErrors($('dayCounterSettingsForm'));
    if ($('dcNightSurchargeInput')) {
        $('dcNightSurchargeInput').value = draftNightSurchargePercent > 0 ? draftNightSurchargePercent : '';
    }
    if ($('dcIrpfDiscountInput')) {
        $('dcIrpfDiscountInput').value = draftIrpfDiscountPercent > 0 ? draftIrpfDiscountPercent : '';
    }
    renderDraftWorkPlacesList();
    openModal($('dayCounterSettingsDlg'));
}   

function openWorkPlaceFormModal(placeIndex = null) {
    editingWorkPlaceIndex = placeIndex;
    clearValidationErrors($('dcWorkPlaceEditForm'));

    const currSymbol = getCurrencySymbol(state.appConfig.currency);
    if ($('dcWorkPlaceRateLabel')) {
        $('dcWorkPlaceRateLabel').textContent = `Pago por hora en ${currSymbol} (opcional)`;
    }

    const isEditing = placeIndex !== null && draftWorkPlaces[placeIndex];
    if (isEditing) {
        const place = draftWorkPlaces[placeIndex];
        $('dcWorkPlaceDlgTitle').textContent = 'Editar lugar';
        $('dcWorkPlaceNameInput').value = place.name;
        $('dcWorkPlaceRateInput').value = place.hourlyRate !== null && place.hourlyRate > 0
            ? formatPlainInputValue(place.hourlyRate, state.appConfig.currency)
            : '';
        $('dcPlaceModalActionsSplit').style.display = 'flex';
        $('dcPlaceModalActionsNormal').style.display = 'none';
    } else {
        $('dcWorkPlaceDlgTitle').textContent = 'Nuevo lugar';
        $('dcWorkPlaceNameInput').value = '';
        $('dcWorkPlaceRateInput').value = '';
        $('dcPlaceModalActionsSplit').style.display = 'none';
        $('dcPlaceModalActionsNormal').style.display = 'flex';
    }

    openModal($('dcWorkPlaceEditDlg'));
}

/* =========================================================
   SELECTOR DE LUGAR EN EL MODAL DE TURNO
   ========================================================= */
function setupLocationFieldForModal(currentValue = '') {
    const selectEl = $('dayLocationSelect');
    const inputEl = $('dayLocation');
    if (!selectEl || !inputEl) return;

    const places = getWorkPlaces();
    const trimmedVal = String(currentValue || '').trim();

    if (!places.length) {
        selectEl.classList.add('is-hidden');
        inputEl.classList.remove('is-hidden');
        inputEl.value = trimmedVal;
        return;
    }

    const optionsHtml = [
        `<option value="">Selecciona un lugar...</option>`,
        ...places.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`),
        `<option value="${CUSTOM_LOCATION_VALUE}">Otro lugar...</option>`
    ].join('');

    selectEl.innerHTML = optionsHtml;
    selectEl.classList.remove('is-hidden');

    const matchedPlace = places.find(p => p.name.toLowerCase() === trimmedVal.toLowerCase());
    if (matchedPlace) {
        selectEl.value = matchedPlace.name;
        inputEl.value = matchedPlace.name;
        inputEl.classList.add('is-hidden');
    } else if (trimmedVal) {
        selectEl.value = CUSTOM_LOCATION_VALUE;
        inputEl.value = trimmedVal;
        inputEl.classList.remove('is-hidden');
    } else {
        selectEl.value = '';
        inputEl.value = '';
        inputEl.classList.add('is-hidden');
    }
}

/* Llamada por el botón "+ Nuevo" de la cabecera superior */
export function openNewDayCounterMonthModal() {
    const monthKey = getMonthKey(viewYear, viewMonth);
    const defaultDate = selectedIsoDate.startsWith(monthKey)
        ? selectedIsoDate
        : `${monthKey}-01`;
    openDayCounterDayModal(monthKey, null, defaultDate);
}

function setToggleOptionState(optionKey, enabled) {
    const form = $('dayCounterTargetForm');
    form?.querySelectorAll(`[data-dc-opt="${optionKey}"]`).forEach((btn) => {
        const isActive = (btn.dataset.val === 'yes') === enabled;
        btn.classList.toggle('active', isActive);
    });

    if (optionKey === 'registerExtras') {
        const fieldGroup = $('targetDaysFieldGroup');
        const targetInput = $('monthTargetDaysInput');
        if (fieldGroup) fieldGroup.classList.toggle('is-hidden', !enabled);
        if (targetInput) {
            targetInput.disabled = !enabled;
            if (!enabled) targetInput.classList.remove('input-error');
        }
    }
}

function getToggleOptionState(optionKey, fallback = false) {
    const activeBtn = $('dayCounterTargetForm')?.querySelector(`[data-dc-opt="${optionKey}"].active`);
    return activeBtn ? activeBtn.dataset.val === 'yes' : fallback;
}

function openTargetConfigModal() {
    const record = getOrCreateMonthRecord(viewYear, viewMonth, false);
    const monthTitle = `${SPANISH_MONTH_NAMES[viewMonth]} ${viewYear}`;
    const showWorkedDays = record ? record.showWorkedDays !== false : true;
    const registerExtras = record?.registerExtras === true;
    const showHours = record?.showHours === true;

    if ($('targetDlgTitle')) $('targetDlgTitle').textContent = monthTitle;
    if ($('monthTargetDaysInput')) $('monthTargetDaysInput').value = record?.targetDays ?? 0;
    clearValidationErrors($('dayCounterTargetForm'));

    setToggleOptionState('showWorkedDays', showWorkedDays);
    setToggleOptionState('registerExtras', registerExtras);
    setToggleOptionState('showHours', showHours);

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

    const showWorkedDays = record ? record.showWorkedDays !== false : true;
    const registerExtras = record?.registerExtras === true;
    const showHours = record?.showHours === true;

    const targetDays = Number(record?.targetDays) || 0;
    const workedCount = monthDays.length;
    const extraCount = targetDays > 0 ? Math.max(0, workedCount - targetDays) : 0;

    const dayParts = [];
    if (showWorkedDays) dayParts.push(`Turnos: ${workedCount}`);
    if (registerExtras) dayParts.push(`Extras: ${extraCount}`);

    const hoursSummary = showHours ? calculateMonthHoursSummary(monthDays) : null;

    let statsHtml = '';
    if (dayParts.length > 0 || showHours) {
        const rows = [];
        if (dayParts.length > 0) {
            rows.push(`<div class="dc-cal-stats-row"><span class="dc-cal-stats">${dayParts.join(' • ')}</span></div>`);
        }
        if (showHours && hoursSummary) {
            rows.push(`
                <div class="dc-cal-stats-row">
                    <span class="dc-cal-stats">Horas: ${formatHoursDuration(hoursSummary.totalMinutes)}</span>
                    <button type="button" class="dc-info-btn" data-action="open-hours-info" title="Ver desglose de horas" aria-label="Ver desglose de horas">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    </button>
                </div>
            `);
        }
        statsHtml = `<div class="dc-cal-stats-list">${rows.join('')}</div>`;
    }

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

    const shiftsCountByDate = new Map();
    monthDays.forEach(d => {
        shiftsCountByDate.set(d.date, (shiftsCountByDate.get(d.date) || 0) + 1);
    });
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
        const shiftCount = shiftsCountByDate.get(iso) || 0;
        const hasShift = shiftCount > 0;
        const isSelected = iso === selectedIsoDate;
        const isToday = iso === todayIso;

        const classes = [
            'dc-day-cell',
            isSunday ? 'is-sunday' : '',
            hasShift ? 'has-shift' : '',
            isSelected ? 'is-selected' : '',
            isToday ? 'is-today' : ''
        ].filter(Boolean).join(' ');

        const barsHtml = Array.from(
            { length: Math.max(1, shiftCount) },
            () => '<span class="dc-day-bar"></span>'
        ).join('');

        allCells.push(`
            <button type="button" class="${classes}" data-action="select-cal-day" data-iso="${iso}" aria-label="${dayNum} de ${SPANISH_MONTH_NAMES[viewMonth]}">
                <span class="dc-day-num">${dayNum}</span>
                <span class="dc-day-bars">${barsHtml}</span>
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
                        <button type="button" class="dc-gear-btn" data-action="open-target-config" title="Configurar vista del mes" aria-label="Configurar vista del mes">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="7.5" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none"/><circle cx="16.5" cy="12" r="1.25" fill="currentColor" stroke="none"/></svg>
                        </button>
                    </div>
                    ${statsHtml}
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
        setupLocationFieldForModal(day.location);

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
        setupLocationFieldForModal('');

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
    setupLocationFieldForModal(lastDay.location || '');
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
        } else if (action === 'open-hours-info') {
            openHoursInfoModal();
        } else if (action === 'edit-day') {
            openDayCounterDayModal(monthId, Number(dayIndex));
        }
    });

    /* Modal de desglose de horas (pestañas General / Por lugar) */
    $('closeHoursInfoBtn')?.addEventListener('click', () => closeModal($('dayCounterHoursInfoDlg')));

    /* Modal de configuración general de Turnos trabajados */
    $('openNewWorkPlaceBtn')?.addEventListener('click', () => openWorkPlaceFormModal(null));
    $('dcWorkPlacesList')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="edit-work-place"]');
        if (!btn) return;
        openWorkPlaceFormModal(Number(btn.dataset.placeIndex));
    });

    $('cancelDayCounterSettingsBtn')?.addEventListener('click', () => closeModal($('dayCounterSettingsDlg')));
    $('dayCounterSettingsForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const surchargeInput = $('dcNightSurchargeInput');
        const irpfInput = $('dcIrpfDiscountInput');

        const rawSurcharge = surchargeInput?.value.trim() ?? '';
        const surchargeVal = rawSurcharge === '' ? 0 : parseFloat(rawSurcharge);
        if (isNaN(surchargeVal) || surchargeVal < 0) {
            surchargeInput?.classList.add('input-error');
            surchargeInput?.focus();
            return;
        }

        const rawIrpf = irpfInput?.value.trim() ?? '';
        const irpfVal = rawIrpf === '' ? 0 : parseFloat(rawIrpf);
        if (isNaN(irpfVal) || irpfVal < 0 || irpfVal > 100) {
            irpfInput?.classList.add('input-error');
            irpfInput?.focus();
            return;
        }

        const cfg = ensureDayCounterSettings();
        cfg.nightSurchargePercent = Math.round(surchargeVal * 100) / 100;
        cfg.irpfDiscountPercent = Math.round(irpfVal * 100) / 100;
        cfg.places = draftWorkPlaces.map(p => ({ ...p }));

        persistConfigRaw();
        closeModal($('dayCounterSettingsDlg'));
        renderDayCounter();
    });

    /* Modal de crear / editar lugar de trabajo */
    const closeWorkPlaceModal = () => closeModal($('dcWorkPlaceEditDlg'));
    $('cancelWorkPlaceBtn')?.addEventListener('click', closeWorkPlaceModal);
    $('cancelWorkPlaceBtnSplit')?.addEventListener('click', closeWorkPlaceModal);

    $('deleteWorkPlaceBtn')?.addEventListener('click', () => {
        if (editingWorkPlaceIndex === null) return;
        if (!confirm('¿Eliminar este lugar de trabajo?')) return;
        draftWorkPlaces.splice(editingWorkPlaceIndex, 1);
        renderDraftWorkPlacesList();
        closeWorkPlaceModal();
    });

    $('dcWorkPlaceEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = $('dcWorkPlaceNameInput');
        const rateInput = $('dcWorkPlaceRateInput');

        if (!validateRequiredFields($('dcWorkPlaceEditForm'), [nameInput])) return;

        const cleanName = nameInput.value.trim();
        const duplicate = draftWorkPlaces.some((p, idx) =>
            idx !== editingWorkPlaceIndex && p.name.trim().toLowerCase() === cleanName.toLowerCase()
        );
        if (duplicate) {
            alert('Ya existe un lugar de trabajo con ese nombre.');
            nameInput.classList.add('input-error');
            nameInput.focus();
            return;
        }

        const rawRateStr = rateInput.value.trim();
        let hourlyRate = null;
        if (rawRateStr !== '') {
            const parsed = parseInputNumber(rawRateStr);
            if (isNaN(parsed) || parsed <= 0) {
                rateInput.classList.add('input-error');
                rateInput.focus();
                return;
            }
            hourlyRate = Math.round(parsed * 100) / 100;
        }

        const placeObj = {
            id: editingWorkPlaceIndex !== null && draftWorkPlaces[editingWorkPlaceIndex]?.id
                ? draftWorkPlaces[editingWorkPlaceIndex].id
                : crypto.randomUUID(),
            name: cleanName,
            hourlyRate
        };

        if (editingWorkPlaceIndex !== null) {
            draftWorkPlaces[editingWorkPlaceIndex] = placeObj;
        } else {
            draftWorkPlaces.push(placeObj);
        }

        renderDraftWorkPlacesList();
        closeWorkPlaceModal();
    });

    /* Cambio en el desplegable de lugar dentro del modal de turno */
    $('dayLocationSelect')?.addEventListener('change', (e) => {
        const val = e.target.value;
        const inputEl = $('dayLocation');
        e.target.classList.remove('input-error');
        if (val === CUSTOM_LOCATION_VALUE) {
            inputEl.value = '';
            inputEl.classList.remove('is-hidden');
            inputEl.focus();
        } else {
            inputEl.value = val;
            inputEl.classList.add('is-hidden');
        }
    });

    /* Diálogo de configuración del mes */
    $('dayCounterTargetForm')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-dc-opt]');
        if (!btn) return;
        setToggleOptionState(btn.dataset.dcOpt, btn.dataset.val === 'yes');
    });

    $('cancelTargetDlg')?.addEventListener('click', () => closeModal($('dayCounterTargetDlg')));
    $('dayCounterTargetForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const targetInput = $('monthTargetDaysInput');
        const showWorkedDays = getToggleOptionState('showWorkedDays', true);
        const registerExtras = getToggleOptionState('registerExtras', false);
        const showHours = getToggleOptionState('showHours', false);

        const record = getOrCreateMonthRecord(viewYear, viewMonth, true);
        record.showWorkedDays = showWorkedDays;
        record.registerExtras = registerExtras;
        record.showHours = showHours;

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
        const locSelect = $('dayLocationSelect');
        const locInput = $('dayLocation');

        const usingSelect = locSelect && !locSelect.classList.contains('is-hidden');
        if (usingSelect && !locSelect.value) {
            locSelect.classList.add('input-error');
            locSelect.focus();
            return;
        }

        const fieldsToValidate = [dateInput, entryInput, exitInput];
        if (!usingSelect || locSelect.value === CUSTOM_LOCATION_VALUE) {
            fieldsToValidate.push(locInput);
        }
        if (!validateRequiredFields($('dayCounterDayForm'), fieldsToValidate)) return;

        const locationValue = (usingSelect && locSelect.value !== CUSTOM_LOCATION_VALUE)
            ? locSelect.value.trim()
            : locInput.value.trim();

        const dayData = {
            date: dateInput.value,
            dayName: getDayNameFromDate(dateInput.value),
            entryTime: entryInput.value,
            exitTime: exitInput.value,
            location: locationValue
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

        viewYear = targetParts.y;
        viewMonth = targetParts.m - 1;
        selectedIsoDate = dayData.date;

        persistDayCounter();
        closeModal($('dayCounterDayDlg'));
        renderDayCounter();
    });

    renderDayCounter();
}