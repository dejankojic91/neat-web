import { DataSelection, PopupSettings } from "@/types/settings";
import { getSettings } from "./storage";

export const timeMap: Record<string, number> = {
  "1h": 1 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
  forever: 0,
};

export const clearData = async (period: string, selection: DataSelection) => {
  const now = Date.now();
  const since = period === "forever" ? 0 : now - (timeMap[period] ?? 0);

  const removalOptions: chrome.browsingData.RemovalOptions = {
    since,
  };

  const dataToRemove: chrome.browsingData.DataTypeSet = {};

  const supported: Partial<Record<keyof DataSelection, keyof chrome.browsingData.DataTypeSet>> = {
    cache: "cache",
    cookies: "cookies",
    downloads: "downloads",
    fileSystems: "fileSystems",
    formData: "formData",
    history: "history",
    indexedDB: "indexedDB",
    localStorage: "localStorage",
    pluginData: "pluginData",
    passwords: "passwords",
    webSQL: "webSQL",
  };

  for (const [key, apiKey] of Object.entries(supported)) {
    if (selection[key as keyof DataSelection]) {
      dataToRemove[apiKey!] = true;
    }
  }

  await chrome.browsingData.remove(removalOptions, dataToRemove);

  if (selection.localStorage || selection.indexedDB) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab?.id) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          if (window.location.protocol.startsWith("http")) {
            if (localStorage) localStorage.clear();
            if (indexedDB) {
              indexedDB.databases?.().then((dbs) => {
                dbs.forEach((db) => {
                  if (db.name) indexedDB.deleteDatabase(db.name);
                });
              });
            }
            console.log("Cleared localStorage & IndexedDB on active tab.");
          }
        },
      });
    }
  }
    
      if (selection.cookies) {
    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const filter = popupSettings.cookieFilter;

    if (filter && filter.domains.length > 0) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab?.url) return;

      const currentDomain = new URL(tab.url).hostname;

      const shouldClear = filter.mode === "whitelist"
        ? filter.domains.includes(currentDomain)
        : !filter.domains.includes(currentDomain);

      if (shouldClear) {
        chrome.runtime.sendMessage(
          { action: "clearCookies", domain: currentDomain },
          (res) => {
            if (res?.success) {
              console.log("Cookies cleared for domain:", currentDomain);
            } else {
              console.warn("Cookies not cleared:", res?.message);
            }
          }
        );
      } else {
        console.log(`Skipping cookie removal for domain: ${currentDomain}`);
      }
    }
  }
};
