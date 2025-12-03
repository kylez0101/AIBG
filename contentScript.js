// --- Configuration ---
const SITE_CONFIG = {
    chatgpt: {
        host: ['chatgpt.com', 'chat.openai.com'],
        container: 'main',
        bgTarget: 'body'
    },
    claude: {
        host: ['claude.ai'],
        container: '.flex-1.overflow-auto',
        bgTarget: 'body'
    },
    gemini: {
        host: ['gemini.google.com'],
        container: 'main',
        bgTarget: 'body',
        // Gemini has specific classes that need transparency
        transparentSelectors: ['unknown-component', '.conversation-container', '.scroll-container']
    },
    deepseek: {
        host: ['chat.deepseek.com'],
        container: '#root',
        bgTarget: 'body'
    },
    kimi: {
        host: ['kimi.moonshot.cn'],
        container: '#root',
        bgTarget: 'body'
    },
    yuanbao: {
        host: ['hunyuan.tencent.com'],
        container: '#app',
        bgTarget: 'body'
    },
    qwen: {
        host: ['tongyi.aliyun.com'],
        container: '#app',
        bgTarget: 'body'
    }
};

// --- State ---
let currentSite = null;
let settings = {};
let observer = null;

// --- Initialization ---
(async () => {
    detectSite();
    if (!currentSite) return;

    console.log(`[AI Chat Enhancer] Active on: ${currentSite}`);

    // Load initial settings
    settings = await chrome.storage.sync.get(null);
    applySettings();

    // Listen for changes
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'sync') {
            for (let [key, { newValue }] of Object.entries(changes)) {
                settings[key] = newValue;
            }
            applySettings();
        }
    });

    // Observe DOM changes (SPA navigation / dynamic loading)
    startObserver();
})();

function detectSite() {
    const host = window.location.host;
    for (const [key, config] of Object.entries(SITE_CONFIG)) {
        if (config.host.some(h => host.includes(h))) {
            currentSite = key;
            break;
        }
    }
}

function startObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver((mutations) => {
        // Debounce or check if relevant nodes added?
        // For now, just re-apply if we detect significant changes or if styles are missing
        const styleEl = document.getElementById('ai-chat-enhancer-style');
        if (!styleEl) {
            applySettings();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function applySettings() {
    if (settings.enabled === false) {
        removeStyles();
        return;
    }

    if (settings.sites && settings.sites[currentSite] === false) {
        removeStyles();
        return;
    }

    // Determine Mode
    let activePreset = settings.activePreset || 'focus';
    if (settings.autoMode?.enabled) {
        const hour = new Date().getHours();
        const isDay = hour >= 8 && hour < 18;
        activePreset = isDay ? (settings.autoMode.dayPreset || 'focus') : (settings.autoMode.nightPreset || 'night');
    }

    // Resolve Styles
    let bgStyle = '';
    let comfort = settings.comfort || {};

    // Presets
    if (activePreset === 'focus') {
        bgStyle = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    } else if (activePreset === 'night') {
        bgStyle = '#1a1a1a';
    } else if (activePreset === 'inspiration') {
        bgStyle = 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)';
    }

    // Custom Overrides
    if (settings.bgMode && settings.bgMode !== 'recommended') {
        if (settings.bgMode === 'solid') bgStyle = settings.bgConfig?.solid || '#fff';
        if (settings.bgMode === 'gradient') {
            const g = settings.bgConfig?.gradient;
            if (g) bgStyle = `linear-gradient(${g.angle}deg, ${g.c1}, ${g.c2})`;
        }
        if (settings.bgMode === 'image') {
            const img = settings.bgConfig?.image;
            if (img) bgStyle = `url(${img}) center/cover fixed no-repeat`;
        }
    } else if (settings.bgMode === 'recommended' && settings.bgConfig?.themeId) {
        // Theme mapping could go here
        const themeId = settings.bgConfig.themeId;
        if (themeId === 'deep') bgStyle = 'linear-gradient(to top, #30cfd0 0%, #330867 100%)';
        if (themeId === 'sunrise') bgStyle = 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)';
        if (themeId === 'paper') bgStyle = '#fdfbf7';
        if (themeId === 'calm') bgStyle = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    }

    injectCSS(bgStyle, comfort);
}

function injectCSS(background, comfort) {
    const styleId = 'ai-chat-enhancer-style';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
    }

    // Robust CSS for Gemini and others
    // We target many common containers to force transparency
    let css = `
    /* Base Background Application */
    body, 
    main, 
    #root, 
    #app,
    [data-testid="conversation-turn"],
    .conversation-container,
    infinite-scroller {
      background: ${background} !important;
      background-attachment: fixed !important;
      background-size: cover !important;
    }

    /* Force Transparency on Overlays */
    /* Common utility classes */
    .flex, .w-full, .h-full, .bg-white, .bg-gray-50, .dark\\:bg-gray-800 {
      background-color: transparent !important;
    }
    
    /* Gemini Specifics */
    .chat-history, 
    .input-area,
    .conversation-container > div {
      background-color: transparent !important;
    }
    
    /* Text Readability Adjustments */
    ${comfort.contrast ? `
      p, li, span, div { 
        color: #2d3748 !important; 
        text-shadow: 0 0 1px rgba(255,255,255,0.1);
      }
      .dark p, .dark li, .dark span { color: #e2e8f0 !important; }
    ` : ''}
  `;

    if (comfort.lineHeight) {
        css += `p, li, .prose { line-height: 1.8 !important; }`;
    }
    if (comfort.fontSize) {
        css += `p, li, .prose { font-size: 1.1em !important; }`;
    }

    styleEl.textContent = css;
}

function removeStyles() {
    const styleEl = document.getElementById('ai-chat-enhancer-style');
    if (styleEl) styleEl.remove();
}
