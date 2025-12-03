// background.js
// Currently minimal, but useful for installation events or context menus.

chrome.runtime.onInstalled.addListener(() => {
    // Set defaults on install
    chrome.storage.sync.get(['enabled', 'language'], (result) => {
        if (result.enabled === undefined) {
            chrome.storage.sync.set({ enabled: true });
        }
        if (!result.language) {
            // Default to English, popup will auto-detect if not set
            chrome.storage.sync.set({ language: 'en' });
        }
    });
});
