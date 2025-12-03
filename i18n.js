const I18N_DATA = {
  en: {
    appName: "AI Chat Enhancer",
    appDesc: "Customize backgrounds and reading comfort for AI chat tools.",
    enableEnhancement: "Enable Enhancement",
    openSettings: "Open Full Settings",
    presets: {
      focus: "Focus",
      night: "Night",
      inspiration: "Inspiration"
    },
    sections: {
      language: "Language",
      sites: "Enabled Sites",
      background: "Background & Theme",
      comfort: "Visual Comfort",
      auto: "Auto Day/Night"
    },
    backgroundModes: {
      recommended: "Recommended",
      image: "Image Upload",
      solid: "Solid Color",
      gradient: "Gradient"
    },
    comfortOptions: {
      lineHeight: "Increase Line Height",
      contrast: "Softer Contrast",
      fontSize: "Larger Font"
    },
    status: {
      saved: "Saved",
      reset: "Reset"
    }
  },
  zh: {
    appName: "AI 聊天增强助手",
    appDesc: "自定义 AI 聊天工具的背景与阅读体验。",
    enableEnhancement: "启用增强",
    openSettings: "打开完整设置",
    presets: {
      focus: "专注模式",
      night: "夜间模式",
      inspiration: "灵感模式"
    },
    sections: {
      language: "语言设置",
      sites: "已启用站点",
      background: "背景与主题",
      comfort: "阅读舒适度",
      auto: "自动日夜切换"
    },
    backgroundModes: {
      recommended: "推荐主题",
      image: "图片上传",
      solid: "纯色填充",
      gradient: "渐变填充"
    },
    comfortOptions: {
      lineHeight: "增加行高",
      contrast: "柔和对比度",
      fontSize: "增大字号"
    },
    status: {
      saved: "已保存",
      reset: "重置"
    }
  }
};

// Simple helper to get current language from storage or default
// Note: This is synchronous and assumes 'window.currentLang' is set by the caller
// or we pass the lang explicitly.
function t(keyPath, lang = 'en') {
  const keys = keyPath.split('.');
  let value = I18N_DATA[lang];
  for (const k of keys) {
    if (value && value[k]) {
      value = value[k];
    } else {
      return keyPath; // Fallback to key if not found
    }
  }
  return value;
}
