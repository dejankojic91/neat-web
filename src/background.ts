import { getSettings } from "./utils/storage";
import { AutoCleanSettings, PopupSettings } from "./types/settings";
import { clearData } from "./utils/clearData"; 

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.action === "clearCookies") {
    const domain = message.domain;
    console.log(`Attempting to clear cookies for: ${domain}`);

    chrome.cookies.getAll({ domain }, (cookies) => {
      if (!cookies || cookies.length === 0) {
        console.log(`No cookies found for ${domain}`);
        sendResponse({ success: false, message: "No cookies found." });
        return;
      }

      let cookiesCleared = 0;
      cookies.forEach((cookie) => {
        chrome.cookies.remove({
          url: `https://${cookie.domain}${cookie.path}`,
          name: cookie.name,
        });
        cookiesCleared++;
      });

      console.log(`Cleared ${cookiesCleared} cookies for ${domain}`);
      sendResponse({
        success: cookiesCleared > 0,
        message: cookiesCleared > 0 ? "Cookies cleared!" : "No cookies found.",
      });
    });

    return true;
  }

  if (message.action === "reinitAutoClean") {
    initAutoClean();
  }
});

chrome.runtime.onInstalled.addListener(() => initAutoClean());
chrome.runtime.onStartup.addListener(() => initAutoClean());

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "auto-clean") {
    console.log("Auto-clean alarm triggered");
    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const autoSettings = await getSettings<AutoCleanSettings>("autoClean") ?? { interval: "off" };

    const timePeriod = popupSettings.period || "1h";

    if (autoSettings.interval !== "off") {
      await clearData(timePeriod, popupSettings.dataToRemove);
    }
  }
});

chrome.tabs.onRemoved.addListener(async () => {
  const autoSettings = await getSettings<AutoCleanSettings>("autoClean") ?? { interval: "off" };
  if (autoSettings?.interval === "on_tab_close") {
    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const timePeriod = popupSettings.period || "1h";
    await clearData(timePeriod, popupSettings.dataToRemove);
  }
});

async function initAutoClean() {
  chrome.alarms.clear("auto-clean");

  const settings = await getSettings<AutoCleanSettings>("autoClean") ?? { interval: "off" };
  if (!settings || settings.interval === "off") return;

  if (settings.interval === "on_start") {
    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    await clearData(popupSettings.period || "1h", popupSettings.dataToRemove);
    return;
  }

  const timeBasedMap = {
    "15m": 15,
    "30m": 30,
    "1h": 60,
    "2h": 120,
    "24h": 1440,
  } as const;
    
if (Object.prototype.hasOwnProperty.call(timeBasedMap, settings.interval)) {
  const periodInMinutes = timeBasedMap[settings.interval as keyof typeof timeBasedMap];

  if (periodInMinutes) {
    chrome.alarms.create("auto-clean", {
      periodInMinutes,
      delayInMinutes: 1,
    });

    console.log(`Auto-clean set every ${periodInMinutes} minutes`);
  }
}
}

