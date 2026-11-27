import {
    $, state, today, SPANISH_MONTH_NAMES, persist, persistRemittancesList,
    persistInstallments, persistDayCounter, persistConfigRaw,
    formatDateEs, openModal, closeModal
} from './shared.js';
import { renderFinance } from './finance.js';
import { renderRemittancesList } from './remittances.js';
import { renderInstallments } from './installments.js';
import { renderDayCounter } from './dayCounter.js';

let pendingParsedSections = null;

const csvQuote = (str) => `"${String(str || '').replace(/"/g, '""')}"`;
const unquoteCsv = (val) => String(val || '').replace(/^"|"$/g, '').replace(/""/g, '"');

function parseCsvLine(line) {
    const row = [];
    let inQuotes = false, currentVal = '';
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') { currentVal += '"'; i++; }
            else inQuotes = !inQuotes;
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
    const clean = dateStr.replace(/^"|"$/g, '').trim();
    if (clean.includes('/')) {
        const parts = clean.split('/');
        if (parts.length === 3) {
            return `${parts[2].length === 2 ? '20' + parts[2] : parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    return clean;
}

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
        csvRows.push('--- SECCION: MOVIMIENTOS ---', 'FECHA,MOVIMIENTO,TIPO,CATEGORIA,IMPORTE,NOTAS');
        state.movements.forEach(m => {
            const formattedDate = m.date?.includes('-') ? formatDateEs(m.date) : m.date;
            csvRows.push([formattedDate, csvQuote(m.desc), m.kind === 'income' ? 'Ingreso' : 'Gasto', csvQuote(m.category), m.amount, csvQuote(m.notes)].join(','));
        });
        csvRows.push('');
    }

    if (includeRemit) {
        csvRows.push('--- SECCION: REMESAS ---', 'NOMBRE_REMESA,MONEDA_ENVIO,MONEDA_RECEPCION,TIPO_CAMBIO,COMISION,CONCEPTO_ITEM,IMPORTE_RECEPCION_ITEM');
        state.remittancesList.forEach(r => {
            if (!r.items?.length) csvRows.push(`${csvQuote(r.name)},${csvQuote(r.sendCurr)},${csvQuote(r.recvCurr)},${r.tc},${r.commission},"" ,0`);
            else r.items.forEach(item => csvRows.push(`${csvQuote(r.name)},${csvQuote(r.sendCurr)},${csvQuote(r.recvCurr)},${r.tc},${r.commission},${csvQuote(item.concept)},${item.recvAmount}`));
        });
        csvRows.push('');
    }

    if (includeInst) {
        csvRows.push('--- SECCION: COMPRAS EN CUOTAS ---', 'COMPRA,MONEDA,FINANCED_AMOUNT,INTEREST_AMOUNT,TOTAL_CUOTAS,NUMERO_CUOTA,FECHA_CUOTA,IMPORTE_CUOTA,FINAL_AMOUNT,PAGADO');
        state.installmentsPurchases.forEach(p => {
            p.installments.forEach(inst => {
                const formattedDate = inst.date?.includes('-') ? formatDateEs(inst.date) : inst.date;
                csvRows.push(`${csvQuote(p.name)},${csvQuote(p.currency || 'EUR')},${p.financedAmount || 0},${p.interestAmount || 0},${p.totalCount},${inst.number},${formattedDate},${inst.amount},${p.finalAmount || inst.amount},${inst.paid ? 'SI' : 'NO'}`);
            });
        });
        csvRows.push('');
    }

    if (includeDays) {
        const dcCfg = state.appConfig.dayCounterSettings || { nightSurchargePercent: 0, irpfDiscountPercent: 0, places: [] };
        const surcharge = Number(dcCfg.nightSurchargePercent) || 0;
        const irpf = Number(dcCfg.irpfDiscountPercent) || 0;
        const places = Array.isArray(dcCfg.places) ? dcCfg.places : [];

        csvRows.push('--- SECCION: CONTADOR DE DIAS TRABAJADOS ---', 'MES,MOSTRAR_DIAS,REGISTRAR_EXTRAS,DIAS_OBJETIVO,MOSTRAR_HORAS,FECHA_DIA,DIA_SEMANA,ENTRADA,SALIDA,LUGAR');
        state.dayCounterMonths.forEach(m => {
            const showWorked = m.showWorkedDays !== false ? 'SI' : 'NO';
            const regExtras = m.registerExtras === true ? 'SI' : 'NO';
            const showHours = m.showHours === true ? 'SI' : 'NO';
            if (!m.days?.length) {
                csvRows.push(`${csvQuote(m.name)},${showWorked},${regExtras},${m.targetDays || 0},${showHours},"" ,"" ,"" ,"" ,""`);
            } else {
                m.days.forEach(d => {
                    const formattedDate = d.date?.includes('-') ? formatDateEs(d.date) : d.date;
                    csvRows.push(`${csvQuote(m.name)},${showWorked},${regExtras},${m.targetDays || 0},${showHours},${formattedDate},${csvQuote(d.dayName)},${csvQuote(d.entryTime)},${csvQuote(d.exitTime)},${csvQuote(d.location)}`);
                });
            }
        });

        csvRows.push('--- CONFIG_TURNOS ---', 'RECARGO_NOCTURNO_PCT,IRPF_PCT,LUGAR_TRABAJO,TARIFA_HORA,APLICA_NOCTURNIDAD');
        if (!places.length) {
            csvRows.push(`${surcharge},${irpf},"","",""`);
        } else {
            places.forEach(p => {
                const rateVal = (p.hourlyRate !== null && p.hourlyRate > 0) ? p.hourlyRate : '';
                const nightVal = p.applyNightSurcharge !== false ? 'SI' : 'NO';
                csvRows.push(`${surcharge},${irpf},${csvQuote(p.name)},${rateVal},${nightVal}`);
            });
        }
    }

    const url = URL.createObjectURL(new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `copia_seguridad_finanzas_${today.toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    closeModal($('exportDlg'));
}

function importMovementsCsv(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const lines = e.target.result.split(/\r?\n/);
            if (lines.length < 2) { alert('El archivo CSV está vacío o no tiene el formato correcto.'); return; }

            let currentSection = 'MOVIMIENTOS';
            const rawRemitMap = {}, rawInstMap = {}, rawDaysMap = {}, tempMovements = [], detectedSections = new Set();
            let parsedDayCounterSettings = null;

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
                if (line.startsWith('--- CONFIG_TURNOS ---')) {
                    currentSection = 'CONFIG_TURNOS';
                    detectedSections.add('DIAS');
                    continue;
                }
                if (/^(FECHA|NOMBRE_REMESA|COMPRA|MES|RECARGO_NOCTURNO_PCT),/.test(line)) continue;

                const row = parseCsvLine(line);
                if (currentSection === 'MOVIMIENTOS' && row.length >= 5) {
                    const [rawDate, desc, tipo, category, amountStr, notes = ''] = row;
                    const date = normalizeDateToIso(rawDate), cleanDesc = unquoteCsv(desc);
                    const amount = parseFloat(amountStr.replace(',', '.')) || 0;
                    const kindNormalized = (tipo.toLowerCase().includes('ingreso') || tipo.toLowerCase() === 'income') ? 'income' : 'expense';
                    if (date && cleanDesc && amount > 0) {
                        tempMovements.push({
                            id: crypto.randomUUID(), timestamp: Date.now() + i, desc: cleanDesc,
                            kind: kindNormalized, amount: Math.round(amount * 100) / 100, date,
                            category: unquoteCsv(category) || (kindNormalized === 'income' ? 'Salario' : 'Compras'),
                            notes: unquoteCsv(notes)
                        });
                    }
                } else if (currentSection === 'REMESAS' && row.length >= 7) {
                    const [rawRemName, sendCurr, recvCurr, tcStr, commStr, concept, recvAmtStr] = row;
                    const remName = unquoteCsv(rawRemName);
                    if (!remName) continue;
                    if (!rawRemitMap[remName]) {
                        rawRemitMap[remName] = {
                            id: crypto.randomUUID(), name: remName,
                            sendCurr: unquoteCsv(sendCurr) || 'EUR', recvCurr: unquoteCsv(recvCurr) || 'PEN',
                            tc: parseFloat(tcStr.replace(',', '.')) || 3.75, commission: parseFloat(commStr.replace(',', '.')) || 0,
                            expanded: false, items: []
                        };
                    }
                    if (unquoteCsv(concept)) rawRemitMap[remName].items.push({ concept: unquoteCsv(concept), recvAmount: parseFloat(recvAmtStr.replace(',', '.')) || 0 });
                } else if (currentSection === 'CUOTAS' && row.length >= 7) {
                    const [rawPName, curr, financedAmt, interestAmt, totalCountStr, instNumStr, instDate, instAmtStr, finalAmt, paidStr] =
                        row.length >= 10 ? row : [row[0], row[1], 0, 0, row[2], row[3], row[4], row[5], 0, row[6]];
                    const pName = unquoteCsv(rawPName);
                    if (!pName) continue;
                    if (!rawInstMap[pName]) {
                        rawInstMap[pName] = {
                            id: crypto.randomUUID(), name: pName, currency: unquoteCsv(curr) || 'EUR',
                            rawFinanced: parseFloat(financedAmt) || 0, rawInterest: parseFloat(interestAmt) || 0,
                            rawFinal: parseFloat(finalAmt) || 0, totalCount: parseInt(totalCountStr) || 1,
                            expanded: false, installments: []
                        };
                    }
                    rawInstMap[pName].installments.push({
                        number: parseInt(instNumStr) || 1, amount: Math.round((parseFloat(instAmtStr.replace(',', '.')) || 0) * 100) / 100,
                        date: normalizeDateToIso(instDate), paid: paidStr.toUpperCase().includes('SI')
                    });
                } else if (currentSection === 'DIAS' && row.length >= 7) {
                    let rawMName, showWorkedStr, regExtrasStr, targetStr, showHoursStr, dDate, dName, entryT, exitT, loc;
                    if (row.length >= 10) {
                        [rawMName, showWorkedStr, regExtrasStr, targetStr, showHoursStr, dDate, dName, entryT, exitT, loc] = row;
                    } else if (row.length >= 8) {
                        [rawMName, regExtrasStr, targetStr, dDate, dName, entryT, exitT, loc] = row;
                        showWorkedStr = 'SI';
                        showHoursStr = 'NO';
                    } else {
                        [rawMName, targetStr, dDate, dName, entryT, exitT, loc] = row;
                        showWorkedStr = 'SI';
                        regExtrasStr = 'NO';
                        showHoursStr = 'NO';
                    }

                    const mName = unquoteCsv(rawMName);
                    const formattedDate = normalizeDateToIso(dDate);
                    let monthKey = formattedDate && /^\d{4}-\d{2}/.test(formattedDate) ? formattedDate.slice(0, 7) : null;
                    if (!monthKey && mName) {
                        const parts = mName.trim().split(/\s+/);
                        const yr = parts[parts.length - 1];
                        const mIdx = SPANISH_MONTH_NAMES.findIndex(m => m.toLowerCase() === parts.slice(0, -1).join(' ').toLowerCase());
                        if (/^\d{4}$/.test(yr) && mIdx !== -1) monthKey = `${yr}-${String(mIdx + 1).padStart(2, '0')}`;
                    }
                    const mapKey = monthKey || mName;
                    if (!mapKey) continue;

                    const canonicalName = monthKey
                        ? `${SPANISH_MONTH_NAMES[Number(monthKey.split('-')[1]) - 1]} ${monthKey.split('-')[0]}`
                        : mName;

                    if (!rawDaysMap[mapKey]) {
                        rawDaysMap[mapKey] = {
                            id: monthKey || crypto.randomUUID(),
                            name: canonicalName,
                            showWorkedDays: !showWorkedStr.toUpperCase().includes('NO'),
                            registerExtras: regExtrasStr.toUpperCase().includes('SI'),
                            showHours: showHoursStr.toUpperCase().includes('SI'),
                            targetDays: parseInt(targetStr, 10) || 0,
                            days: []
                        };
                    }
                    if (formattedDate) {
                        rawDaysMap[mapKey].days.push({
                            date: formattedDate,
                            dayName: unquoteCsv(dName),
                            entryTime: unquoteCsv(entryT),
                            exitTime: unquoteCsv(exitT),
                            location: unquoteCsv(loc)
                        });
                    }
                } else if (currentSection === 'CONFIG_TURNOS' && row.length >= 2) {
                    const [surchargeStr, irpfStr, rawPlaceName = '', rawRateStr = '', rawNightStr = ''] = row;
                    if (!parsedDayCounterSettings) {
                        parsedDayCounterSettings = {
                            nightSurchargePercent: Math.max(0, parseFloat(surchargeStr.replace(',', '.')) || 0),
                            irpfDiscountPercent: Math.max(0, parseFloat(irpfStr.replace(',', '.')) || 0),
                            places: []
                        };
                    }
                    const cleanPlace = unquoteCsv(rawPlaceName).trim();
                    if (cleanPlace) {
                        const parsedRate = parseFloat(unquoteCsv(rawRateStr).replace(',', '.'));
                        const cleanNight = unquoteCsv(rawNightStr).trim().toUpperCase();
                        parsedDayCounterSettings.places.push({
                            id: crypto.randomUUID(),
                            name: cleanPlace,
                            hourlyRate: (!isNaN(parsedRate) && parsedRate > 0) ? Math.round(parsedRate * 100) / 100 : null,
                            applyNightSurcharge: cleanNight !== 'NO'
                        });
                    }
                }
            }

            const parsedRemit = Object.values(rawRemitMap);
            const parsedInst = Object.values(rawInstMap).map(p => {
                const roundedSum = Math.round(p.installments.reduce((acc, c) => acc + c.amount, 0) * 100) / 100;
                const financed = p.rawFinanced > 0 ? p.rawFinanced : roundedSum;
                const interest = p.rawInterest >= 0 ? p.rawInterest : 0;
                return {
                    ...p, financedAmount: financed, interestAmount: interest,
                    totalAmount: Math.round((financed + interest) * 100) / 100,
                    regularAmount: p.installments.length > 1 ? p.installments[0].amount : roundedSum,
                    finalAmount: p.rawFinal > 0 ? p.rawFinal : (p.installments.at(-1)?.amount || 0),
                    firstDate: p.installments[0]?.date || ''
                };
            });
            const parsedDays = Object.values(rawDaysMap).map(m => {
                m.days.sort((a, b) => b.date.localeCompare(a.date) || (a.entryTime || '').localeCompare(b.entryTime || ''));
                return m;
            });

            pendingParsedSections = {
                detectedSections,
                movements: tempMovements,
                remittances: parsedRemit,
                installments: parsedInst,
                dayCounter: parsedDays,
                dayCounterSettings: parsedDayCounterSettings
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
    const importedSummary = [];

    const secs = pendingParsedSections.detectedSections || new Set();

    if (selection.movements && (pendingParsedSections.movements.length > 0 || secs.has('MOVIMIENTOS'))) {
        state.movements = pendingParsedSections.movements;
        persist();
        importedSummary.push(`• Movimientos: ${state.movements.length}`);
    }
    if (selection.remittances && (pendingParsedSections.remittances.length > 0 || secs.has('REMESAS'))) {
        state.remittancesList = pendingParsedSections.remittances;
        persistRemittancesList();
        importedSummary.push(`• Cálculos de remesas: ${state.remittancesList.length}`);
    }
    if (selection.installments && (pendingParsedSections.installments.length > 0 || secs.has('CUOTAS'))) {
        state.installmentsPurchases = pendingParsedSections.installments;
        persistInstallments();
        importedSummary.push(`• Gestores de cuotas: ${state.installmentsPurchases.length}`);
    }
    if (selection.dayCounter && (pendingParsedSections.dayCounter.length > 0 || pendingParsedSections.dayCounterSettings || secs.has('DIAS'))) {
        if (pendingParsedSections.dayCounter.length > 0 || secs.has('DIAS')) {
            state.dayCounterMonths = pendingParsedSections.dayCounter;
            persistDayCounter();
        }
        if (pendingParsedSections.dayCounterSettings) {
            state.appConfig.dayCounterSettings = pendingParsedSections.dayCounterSettings;
            persistConfigRaw();
        }
        importedSummary.push(`• Turnos trabajados: ${state.dayCounterMonths.length}`);
    }

    renderFinance();
    renderRemittancesList();
    renderInstallments();
    renderDayCounter();

    alert(importedSummary.length ? `¡Restauración exitosa!\n${importedSummary.join('\n')}` : 'No se encontraron registros válidos para importar en el archivo seleccionado.');
    pendingParsedSections = null;
    if ($('importSelectDlg')) closeModal($('importSelectDlg'));
}

export function initBackup() {
    $('cancelExportBtn')?.addEventListener('click', () => closeModal($('exportDlg')));
    $('exportForm')?.addEventListener('submit', (e) => { e.preventDefault(); executeCustomExport(); });
    $('csvFileInput')?.addEventListener('change', importMovementsCsv);
    $('cancelImportSelect')?.addEventListener('click', () => { pendingParsedSections = null; closeModal($('importSelectDlg')); });
    $('importSelectForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        applyImportSelection({
            movements: $('impSelectMovs')?.checked,
            remittances: $('impSelectRemit')?.checked,
            installments: $('impSelectInst')?.checked,
            dayCounter: $('impSelectDays')?.checked
        });
    });
}