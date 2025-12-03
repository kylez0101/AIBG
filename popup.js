document.addEventListener('DOMContentLoaded', async () => {
    // --- Elements ---
    const masterSwitch = document.getElementById('master-switch');
    const btnSettings = document.getElementById('btn-settings');
    const presetBtns = document.querySelectorAll('.preset-btn');

    // --- State ---
    let currentLang = 'en';

    // --- Initialization ---
    // Load settings
    const data = await chrome.storage.sync.get(['enabled', 'activePreset', 'language']);

    // Set Language
    if (data.language) {
        currentLang = data.language;
    } else {
        // Auto-detect
        const browserLang = navigator.language;
        if (browserLang.startsWith('zh')) currentLang = 'zh';
    }

    applyTranslations();

    // Set UI State
    masterSwitch.checked = data.enabled !== false; // Default true if undefined
    updatePresetUI(data.activePreset || 'focus');

    // --- Event Listeners ---

    // Master Switch
    masterSwitch.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        chrome.storage.sync.set({ enabled: isEnabled });
        // Visual feedback could be added here (e.g. dimming presets)
    });

    // Presets
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = btn.dataset.preset;
            chrome.storage.sync.set({ activePreset: preset });
            updatePresetUI(preset);
        });
    });

    // Open Settings
    btnSettings.addEventListener('click', () => {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });

    // --- Helpers ---

    function updatePresetUI(activePreset) {
        presetBtns.forEach(btn => {
            if (btn.dataset.preset === activePreset) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function applyTranslations() {
        document.getElementById('lbl-enable').textContent = t('enableEnhancement', currentLang);
        document.getElementById('lbl-focus').textContent = t('presets.focus', currentLang);
        document.getElementById('lbl-night').textContent = t('presets.night', currentLang);
        document.getElementById('lbl-inspiration').textContent = t('presets.inspiration', currentLang);
        document.getElementById('btn-settings').textContent = t('openSettings', currentLang);
    }
});
