const SITES = [
    { id: 'chatgpt', name: 'ChatGPT', host: 'chatgpt.com' },
    { id: 'gemini', name: 'Google Gemini', host: 'gemini.google.com' },
    { id: 'claude', name: 'Claude', host: 'claude.ai' },
    { id: 'deepseek', name: 'DeepSeek', host: 'deepseek.com' },
    { id: 'kimi', name: 'Kimi', host: 'moonshot.cn' },
    { id: 'qwen', name: 'Qwen (通义千问)', host: 'aliyun.com' }, // Broad match, refined in content script
    { id: 'yuanbao', name: '腾讯元宝', host: 'hunyuan.tencent.com' }
];

const THEMES = [
    { id: 'calm', name: 'Calm Focus', style: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 'deep', name: 'Deep Work', style: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', darkText: false },
    { id: 'sunrise', name: 'Sunrise', style: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
    { id: 'paper', name: 'Paper Minimal', style: 'background-color: #fdfbf7;' }
];

document.addEventListener('DOMContentLoaded', async () => {
    // --- State ---
    let settings = await chrome.storage.sync.get(null); // Get all
    let currentLang = settings.language || 'en';

    // Defaults
    if (!settings.sites) settings.sites = {};
    if (!settings.bgMode) settings.bgMode = 'recommended';
    if (!settings.bgConfig) settings.bgConfig = { themeId: 'calm' };

    // --- Init UI ---
    renderLanguage();
    renderSites();
    renderThemes();
    loadValues();
    setupEventListeners();

    // --- Functions ---

    function renderLanguage() {
        document.getElementById('lang-select').value = currentLang;
        applyTranslations();
    }

    function applyTranslations() {
        // Basic text replacement
        document.getElementById('app-title').textContent = t('appName', currentLang);
        document.getElementById('nav-general').textContent = t('sections.language', currentLang); // Simplified mapping
        document.getElementById('nav-background').textContent = t('sections.background', currentLang);
        document.getElementById('nav-comfort').textContent = t('sections.comfort', currentLang);

        document.getElementById('title-language').textContent = t('sections.language', currentLang);
        document.getElementById('title-sites').textContent = t('sections.sites', currentLang);
        document.getElementById('title-background').textContent = t('sections.background', currentLang);
        document.getElementById('title-comfort').textContent = t('sections.comfort', currentLang);
        document.getElementById('title-auto').textContent = t('sections.auto', currentLang);

        document.getElementById('tab-rec').textContent = t('backgroundModes.recommended', currentLang);
        document.getElementById('tab-grad').textContent = t('backgroundModes.gradient', currentLang);
        document.getElementById('tab-solid').textContent = t('backgroundModes.solid', currentLang);
        document.getElementById('tab-img').textContent = t('backgroundModes.image', currentLang);

        document.getElementById('lbl-lineheight').textContent = t('comfortOptions.lineHeight', currentLang);
        document.getElementById('lbl-contrast').textContent = t('comfortOptions.contrast', currentLang);
        document.getElementById('lbl-fontsize').textContent = t('comfortOptions.fontSize', currentLang);
    }

    function renderSites() {
        const container = document.getElementById('sites-list');
        container.innerHTML = '';
        SITES.forEach(site => {
            const isEnabled = settings.sites[site.id] !== false; // Default true
            const card = document.createElement('div');
            card.className = 'site-card';
            card.innerHTML = `
        <span>${site.name}</span>
        <input type="checkbox" data-site="${site.id}" ${isEnabled ? 'checked' : ''}>
      `;
            container.appendChild(card);
        });
    }

    function renderThemes() {
        const container = document.getElementById('rec-themes');
        container.innerHTML = '';
        THEMES.forEach(theme => {
            const item = document.createElement('div');
            item.className = 'theme-item';
            if (settings.bgConfig.themeId === theme.id) item.classList.add('selected');

            item.innerHTML = `
        <div class="theme-preview" style="background: ${theme.style}"></div>
        <div class="theme-name">${theme.name}</div>
      `;
            item.onclick = () => selectTheme(theme.id);
            container.appendChild(item);
        });
    }

    function loadValues() {
        // Background Mode Tabs
        switchTab(settings.bgMode);

        // Gradient inputs
        if (settings.bgConfig.gradient) {
            document.getElementById('grad-color-1').value = settings.bgConfig.gradient.c1 || '#ffffff';
            document.getElementById('grad-color-2').value = settings.bgConfig.gradient.c2 || '#e0e7ff';
            document.getElementById('grad-angle').value = settings.bgConfig.gradient.angle || 135;
            updateGradientPreview();
        }

        // Solid input
        if (settings.bgConfig.solid) {
            document.getElementById('solid-color').value = settings.bgConfig.solid;
        }

        // Image preview
        if (settings.bgConfig.image) {
            document.getElementById('img-preview-box').style.backgroundImage = `url(${settings.bgConfig.image})`;
        }

        // Comfort
        document.getElementById('chk-lineheight').checked = !!settings.comfort?.lineHeight;
        document.getElementById('chk-contrast').checked = !!settings.comfort?.contrast;
        document.getElementById('chk-fontsize').checked = !!settings.comfort?.fontSize;

        // Auto
        document.getElementById('chk-auto').checked = !!settings.autoMode?.enabled;
        if (settings.autoMode?.enabled) document.getElementById('auto-config-area').classList.add('visible');
        document.getElementById('sel-day-preset').value = settings.autoMode?.dayPreset || 'focus';
        document.getElementById('sel-night-preset').value = settings.autoMode?.nightPreset || 'night';
    }

    function setupEventListeners() {
        // Language
        document.getElementById('lang-select').addEventListener('change', (e) => {
            saveSetting('language', e.target.value);
            currentLang = e.target.value;
            applyTranslations();
        });

        // Sites
        document.getElementById('sites-list').addEventListener('change', (e) => {
            if (e.target.tagName === 'INPUT') {
                const siteId = e.target.dataset.site;
                settings.sites[siteId] = e.target.checked;
                saveSetting('sites', settings.sites);
            }
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                switchTab(mode);
                saveSetting('bgMode', mode);
            });
        });

        // Gradient
        ['grad-color-1', 'grad-color-2', 'grad-angle'].forEach(id => {
            document.getElementById(id).addEventListener('input', updateGradientPreview);
            document.getElementById(id).addEventListener('change', saveGradient);
        });

        // Solid
        document.getElementById('solid-color').addEventListener('change', (e) => {
            const val = e.target.value;
            settings.bgConfig.solid = val;
            saveSetting('bgConfig', settings.bgConfig);
        });

        // Image
        document.getElementById('img-upload').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const dataUrl = ev.target.result;
                    settings.bgConfig.image = dataUrl;
                    document.getElementById('img-preview-box').style.backgroundImage = `url(${dataUrl})`;
                    saveSetting('bgConfig', settings.bgConfig);
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('btn-clear-img').addEventListener('click', () => {
            settings.bgConfig.image = null;
            document.getElementById('img-preview-box').style.backgroundImage = '';
            saveSetting('bgConfig', settings.bgConfig);
        });

        // Comfort
        ['lineHeight', 'contrast', 'fontSize'].forEach(key => {
            document.getElementById(`chk-${key.toLowerCase()}`).addEventListener('change', (e) => {
                if (!settings.comfort) settings.comfort = {};
                settings.comfort[key] = e.target.checked;
                saveSetting('comfort', settings.comfort);
            });
        });

        // Auto
        document.getElementById('chk-auto').addEventListener('change', (e) => {
            const enabled = e.target.checked;
            if (!settings.autoMode) settings.autoMode = {};
            settings.autoMode.enabled = enabled;
            document.getElementById('auto-config-area').classList.toggle('visible', enabled);
            saveSetting('autoMode', settings.autoMode);
        });

        ['sel-day-preset', 'sel-night-preset'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                settings.autoMode.dayPreset = document.getElementById('sel-day-preset').value;
                settings.autoMode.nightPreset = document.getElementById('sel-night-preset').value;
                saveSetting('autoMode', settings.autoMode);
            });
        });
    }

    // --- Helpers ---

    function switchTab(mode) {
        document.querySelectorAll('.tab-btn').forEach(b => {
            b.classList.remove('active');
            if (b.dataset.mode === mode) {
                b.classList.add('active');
            }
        });

        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(`panel-${mode}`);
        if (panel) panel.classList.add('active');
    }

    function selectTheme(id) {
        settings.bgConfig.themeId = id;
        renderThemes(); // update selection border
        saveSetting('bgConfig', settings.bgConfig);
    }

    function updateGradientPreview() {
        const c1 = document.getElementById('grad-color-1').value;
        const c2 = document.getElementById('grad-color-2').value;
        const angle = document.getElementById('grad-angle').value;
        document.getElementById('grad-angle-val').textContent = `${angle}deg`;

        const style = `linear-gradient(${angle}deg, ${c1}, ${c2})`;
        document.getElementById('grad-preview').style.background = style;
    }

    function saveGradient() {
        const c1 = document.getElementById('grad-color-1').value;
        const c2 = document.getElementById('grad-color-2').value;
        const angle = document.getElementById('grad-angle').value;
        settings.bgConfig.gradient = { c1, c2, angle };
        saveSetting('bgConfig', settings.bgConfig);
    }

    function saveSetting(key, value) {
        const obj = {};
        obj[key] = value;
        chrome.storage.sync.set(obj, () => {
            const status = document.getElementById('save-status');
            status.textContent = t('status.saved', currentLang);
            setTimeout(() => status.textContent = '', 2000);
        });
    }
});
