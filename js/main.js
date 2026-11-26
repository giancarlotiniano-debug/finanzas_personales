import {
    $, state, persistConfigRaw, lockBodyScroll, openModal, setBeforeOpenModalHook
} from './shared.js';
import { initFinance, renderFinance, updateFinanceCurrencyLabels } from './finance.js';
import { initRemittances, renderRemittancesList, openNewRemittanceModal } from './remittances.js';
import { initInstallments, renderInstallments, openNewInstallmentPurchaseModal } from './installments.js';
import {
    initDayCounter, renderDayCounter,
    openNewDayCounterMonthModal, openDayCounterSettingsModal
} from './dayCounter.js';
import { initBackup } from './backup.js';

const SECTION_LABELS = {
    financeManager: 'Gestor financiero',
    remittances: 'Calcular remesas',
    installments: 'Compras en cuotas',
    dayCounter: 'Turnos trabajados'
};

let openTouchStartX = 0;
let openTouchStartY = 0;
let isSwipingToOpenDrawer = false;
let currentOpenDrawerOffset = 0;

function resetOpenDrawerGesture() {
    const navDrawer = $('navDrawer');
    const navBackdrop = $('navDrawerBackdrop');
    openTouchStartX = 0;
    openTouchStartY = 0;
    isSwipingToOpenDrawer = false;
    currentOpenDrawerOffset = 0;

    if (navDrawer && !navDrawer.classList.contains('is-open')) {
        navDrawer.classList.remove('is-dragging');
        navDrawer.style.transform = '';
    }
    if (navBackdrop && !navDrawer?.classList.contains('is-open')) {
        navBackdrop.classList.add('is-hidden');
        navBackdrop.setAttribute('aria-hidden', 'true');
        navBackdrop.style.opacity = '';
    }
}

setBeforeOpenModalHook(resetOpenDrawerGesture);

const normalizeActiveSection = (section) =>
    Object.prototype.hasOwnProperty.call(SECTION_LABELS, section) ? section : 'financeManager';

function getInitialSectionFromConfig() {
    const utils = state.appConfig.utilities || {};
    if (utils.financeManager !== false) return 'financeManager';
    if (utils.remittances) return 'remittances';
    if (utils.installments) return 'installments';
    if (utils.dayCounter) return 'dayCounter';
    return 'financeManager';
}

function syncSectionUtilitiesFlag(section) {
    state.appConfig.utilities = {
        financeManager: section === 'financeManager',
        remittances: section === 'remittances',
        installments: section === 'installments',
        dayCounter: section === 'dayCounter'
    };
    persistConfigRaw();
}

function applyTheme() {
    const isDark = state.appConfig.theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#121212' : '#FFFFFF');
}

function syncDrawerControlsState() {
    document.querySelectorAll('[data-nav-section]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.navSection === state.activeAppSection);
    });
    if ($('currencySelect')) $('currencySelect').value = state.appConfig.currency || 'EUR';
    const isDark = state.appConfig.theme === 'dark';
    $('themeLightBtn')?.classList.toggle('active', !isDark);
    $('themeDarkBtn')?.classList.toggle('active', isDark);
}

function updateUserDisplay() {
    if ($('sectionHeaderTitle')) {
        $('sectionHeaderTitle').textContent = SECTION_LABELS[normalizeActiveSection(state.activeAppSection)] || 'Gestor financiero';
    }
    syncDrawerControlsState();

    const btn = $('headerSectionNewBtn');
    if (btn) {
        const showForSection = ['remittances', 'installments', 'dayCounter'].includes(state.activeAppSection);
        btn.classList.toggle('is-hidden', !showForSection);
        const ariaMap = {
            remittances: 'Nueva remesa',
            installments: 'Nueva compra en cuotas',
            dayCounter: 'Nuevo turno'
        };
        btn.setAttribute('aria-label', ariaMap[state.activeAppSection] || 'Nuevo');
    }
}

function applyUtilitiesVisibility() {
    const section = normalizeActiveSection(state.activeAppSection);
    state.activeAppSection = section;

    const showFinance = section === 'financeManager';
    const showRemit = section === 'remittances';
    const showInst = section === 'installments';
    const showDays = section === 'dayCounter';

    if ($('financeManagerLayout')) $('financeManagerLayout').style.display = showFinance ? '' : 'none';
    if ($('remittancesCard')) $('remittancesCard').style.display = showRemit ? '' : 'none';
    if ($('installmentsCard')) $('installmentsCard').style.display = showInst ? '' : 'none';
    if ($('dayCounterCard')) $('dayCounterCard').style.display = showDays ? '' : 'none';

    const utilSection = $('utilitiesSection');
    if (utilSection) {
        utilSection.style.display = (showRemit || showInst || showDays) ? '' : 'none';
        utilSection.classList.toggle('single-utility-view', showRemit || showInst || showDays);
    }
    updateUserDisplay();
}

function persistConfig() {
    persistConfigRaw();
    updateUserDisplay();
    applyTheme();
    applyUtilitiesVisibility();
    updateFinanceCurrencyLabels();
}

function openNavDrawer() {
    const drawer = $('navDrawer'), backdrop = $('navDrawerBackdrop');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) { backdrop.classList.remove('is-hidden'); backdrop.setAttribute('aria-hidden', 'false'); }
    syncDrawerControlsState();
    lockBodyScroll();
}

function closeNavDrawer() {
    const drawer = $('navDrawer'), backdrop = $('navDrawerBackdrop'), moreBtn = $('navMoreBackupBtn');
    toggleBackupPopover(false);
    if (drawer) { drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); }
    if (backdrop) { backdrop.classList.add('is-hidden'); backdrop.setAttribute('aria-hidden', 'true'); }
    if (moreBtn) { moreBtn.classList.remove('is-active'); moreBtn.setAttribute('aria-expanded', 'false'); }
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('no-scroll');
}

function toggleBackupPopover(forceState) {
    const popover = $('navBackupPopover'), backdrop = $('navBackupBackdrop'), moreBtn = $('navMoreBackupBtn');
    const dcConfigSection = $('navDayCounterConfigSection');
    if (!popover) return;
    const shouldOpen = typeof forceState === 'boolean' ? forceState : popover.classList.contains('is-hidden');

    if (dcConfigSection) {
        dcConfigSection.classList.toggle('is-hidden', state.activeAppSection !== 'dayCounter');
    }

    popover.classList.toggle('is-hidden', !shouldOpen);
    popover.setAttribute('aria-hidden', String(!shouldOpen));
    if (backdrop) { backdrop.classList.toggle('is-hidden', !shouldOpen); backdrop.setAttribute('aria-hidden', String(!shouldOpen)); }
    if (moreBtn) { moreBtn.classList.toggle('is-active', shouldOpen); moreBtn.setAttribute('aria-expanded', String(shouldOpen)); }
}

function selectAppSection(section, options = {}) {
    const normalized = normalizeActiveSection(section);
    state.activeAppSection = normalized;
    syncSectionUtilitiesFlag(normalized);
    applyUtilitiesVisibility();
    syncDrawerControlsState();

    if (options.expandActiveUtility) {
        if (normalized === 'remittances') {
            state.remittancesList = state.remittancesList.map(r => ({ ...r, expanded: false }));
            renderRemittancesList();
        } else if (normalized === 'installments') {
            state.installmentsPurchases = state.installmentsPurchases.map(p => ({ ...p, expanded: false }));
            renderInstallments();
        } 
    }
    if (options.closeDrawer) closeNavDrawer();
}

function bindShellEvents() {
    $('openNavDrawerBtn')?.addEventListener('click', openNavDrawer);
    $('closeNavDrawerBtn')?.addEventListener('click', closeNavDrawer);
    $('navDrawerBackdrop')?.addEventListener('click', closeNavDrawer);

    document.querySelectorAll('[data-nav-section]').forEach(btn => {
        btn.addEventListener('click', () => selectAppSection(btn.dataset.navSection, { closeDrawer: true, expandActiveUtility: true }));
    });

    /* Gestos táctiles del menú lateral */
    document.addEventListener('touchstart', (e) => {
        const navDrawer = $('navDrawer');
        if (!navDrawer || navDrawer.classList.contains('is-open') || document.querySelector('dialog[open]') || e.target.closest('dialog')) {
            resetOpenDrawerGesture();
            return;
        }
        const touch = e.touches[0];
        openTouchStartX = touch.clientX;
        openTouchStartY = touch.clientY;
        isSwipingToOpenDrawer = false;
        currentOpenDrawerOffset = 0;

        if (openTouchStartX <= 28) {
            const navBackdrop = $('navDrawerBackdrop');
            const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);
            navDrawer.classList.add('is-dragging');
            navDrawer.style.transform = `translateX(${-drawerWidth}px)`;
            if (navBackdrop) { navBackdrop.classList.remove('is-hidden'); navBackdrop.style.opacity = '0'; }
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (document.querySelector('dialog[open]')) { resetOpenDrawerGesture(); return; }
        const navDrawer = $('navDrawer'), navBackdrop = $('navDrawerBackdrop');
        if (!navDrawer || navDrawer.classList.contains('is-open') || openTouchStartX > 36) return;

        const touch = e.touches[0];
        const dx = touch.clientX - openTouchStartX, dy = touch.clientY - openTouchStartY;

        if (!isSwipingToOpenDrawer) {
            if (Math.abs(dy) > 15 && Math.abs(dy) > Math.abs(dx)) { resetOpenDrawerGesture(); return; }
            if (dx > 8 && Math.abs(dx) > Math.abs(dy)) { isSwipingToOpenDrawer = true; lockBodyScroll(); }
        }

        if (isSwipingToOpenDrawer) {
            const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);
            const clampedDx = Math.max(0, Math.min(drawerWidth, dx));
            currentOpenDrawerOffset = clampedDx - drawerWidth;
            navDrawer.style.transform = `translateX(${currentOpenDrawerOffset}px)`;
            if (navBackdrop) navBackdrop.style.opacity = String(clampedDx / drawerWidth);
        }
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (document.querySelector('dialog[open]')) { resetOpenDrawerGesture(); document.body.classList.remove('no-scroll'); return; }
        const navDrawer = $('navDrawer'), navBackdrop = $('navDrawerBackdrop');
        if (!navDrawer || navDrawer.classList.contains('is-open')) return;

        const wasSwiping = isSwipingToOpenDrawer, finalOffset = currentOpenDrawerOffset;
        const drawerWidth = navDrawer.getBoundingClientRect().width || Math.min(340, window.innerWidth * 0.85);
        resetOpenDrawerGesture();

        if (!wasSwiping) {
            if (navBackdrop) navBackdrop.classList.add('is-hidden');
            if (!document.querySelector('dialog[open]')) document.body.classList.remove('no-scroll');
            return;
        }

        const draggedDistance = drawerWidth + finalOffset;
        if (draggedDistance > drawerWidth * 0.35 || draggedDistance > 75) openNavDrawer();
        else {
            if (navBackdrop) { navBackdrop.classList.add('is-hidden'); navBackdrop.setAttribute('aria-hidden', 'true'); }
            if (!document.querySelector('dialog[open]')) document.body.classList.remove('no-scroll');
        }
    }, { passive: true });

    const drawer = $('navDrawer');
    let touchStartX = 0, touchStartY = 0, isSwipingDrawer = false, currentDrawerOffset = 0;
    drawer?.addEventListener('touchstart', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwipingDrawer = false;
        currentDrawerOffset = 0;
        drawer.classList.add('is-dragging');
    }, { passive: true });

    drawer?.addEventListener('touchmove', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        const dx = e.touches[0].clientX - touchStartX, dy = e.touches[0].clientY - touchStartY;
        if (!isSwipingDrawer && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) isSwipingDrawer = true;
        if (isSwipingDrawer) {
            currentDrawerOffset = Math.min(0, dx);
            drawer.style.transform = `translateX(${currentDrawerOffset}px)`;
        }
    }, { passive: true });

    drawer?.addEventListener('touchend', () => {
        if (!drawer.classList.contains('is-open')) return;
        drawer.classList.remove('is-dragging');
        drawer.style.transform = '';
        if (isSwipingDrawer && currentDrawerOffset < -75) closeNavDrawer();
        isSwipingDrawer = false;
        currentDrawerOffset = 0;
    });

    /* Backup popover, moneda y tema */
    $('navMoreBackupBtn')?.addEventListener('click', (e) => { e.stopPropagation(); toggleBackupPopover(); });
    $('navBackupBackdrop')?.addEventListener('click', () => toggleBackupPopover(false));
    $('importCsvBtn')?.addEventListener('click', () => { toggleBackupPopover(false); $('csvFileInput')?.click(); });
    $('openExportDlgBtn')?.addEventListener('click', () => {
        toggleBackupPopover(false);
        ['expMovements', 'expRemittances', 'expInstallments', 'expDayCounter'].forEach(id => { if ($(id)) $(id).checked = true; });
        openModal($('exportDlg'));
    });

    $('openDayCounterSettingsBtn')?.addEventListener('click', () => {
        toggleBackupPopover(false);
        closeNavDrawer();
        openDayCounterSettingsModal();
    });

    $('currencySelect')?.addEventListener('change', (e) => {
        state.appConfig.currency = e.target.value;
        persistConfig();
        renderFinance();
        renderRemittancesList();
        renderInstallments();
        renderDayCounter();
    });

    document.querySelectorAll('[data-theme-value]').forEach(btn => {
        btn.addEventListener('click', () => {
            state.appConfig.theme = btn.dataset.themeValue === 'dark' ? 'dark' : 'light';
            persistConfig();
        });
    });

    $('headerSectionNewBtn')?.addEventListener('click', () => {
        if (state.activeAppSection === 'remittances') openNewRemittanceModal();
        else if (state.activeAppSection === 'installments') openNewInstallmentPurchaseModal();
        else if (state.activeAppSection === 'dayCounter') openNewDayCounterMonthModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!$('navBackupPopover')?.classList.contains('is-hidden')) toggleBackupPopover(false);
            else if ($('navDrawer')?.classList.contains('is-open')) closeNavDrawer();
        }
    });

    document.querySelectorAll('dialog').forEach(dlg => {
        dlg.addEventListener('close', () => {
            if (!document.querySelector('dialog[open]') && !$('navDrawer')?.classList.contains('is-open')) {
                document.body.classList.remove('no-scroll');
            }
        });
    });

    window.addEventListener('resize', () => {
        if (state.activeAppSection === 'financeManager') renderFinance();
    });

    /* Auto-ocultado de scrollbars */
    const scrollTimeouts = new WeakMap();
    document.addEventListener('scroll', (e) => {
        const target = e.target?.closest?.('.table-wrapper, .cat-breakdown-list, .category-manager-list, .installment-installments-list-compras, .dc-days-wrapper');
        if (!target) return;
        target.classList.add('is-scrolling');
        if (scrollTimeouts.has(target)) clearTimeout(scrollTimeouts.get(target));
        scrollTimeouts.set(target, setTimeout(() => { target.classList.remove('is-scrolling'); scrollTimeouts.delete(target); }, 800));
    }, true);
}

/* Arranque */
state.activeAppSection = getInitialSectionFromConfig();
syncSectionUtilitiesFlag(state.activeAppSection);
applyTheme();
applyUtilitiesVisibility();
updateFinanceCurrencyLabels();

bindShellEvents();
initFinance();
initRemittances();
initInstallments();
initDayCounter();
initBackup();