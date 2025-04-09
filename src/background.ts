import { getSettings } from "./utils/storage";
import { AutoCleanSettings, PopupSettings } from "./types/settings";
import { clearData } from "./utils/clearData";

const AUTO_CLEAN_ALARM = "auto-clean";
const DEFAULT_PERIOD = "1h";

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

    return true; // needed for async sendResponse
  }

  if (message.action === "reinitAutoClean") {
    initAutoClean();
  }
});

// Called when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("[Extension] Installed. Initializing auto-clean...");
  initAutoClean();
});

// Called when Chrome starts
chrome.runtime.onStartup.addListener(() => {
  console.log("[Extension] Chrome started. Initializing auto-clean...");
  initAutoClean();
});

// Triggered by the auto-clean alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === AUTO_CLEAN_ALARM) {
    console.log("[AutoClean] Alarm triggered");

    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const autoSettings = (await getSettings<AutoCleanSettings>(
      "autoClean"
    )) ?? { interval: "off" };

    const timePeriod = popupSettings?.period || DEFAULT_PERIOD;
    const selection = popupSettings?.dataToRemove;

    if (autoSettings.interval !== "off" && selection) {
      console.log("[AutoClean] Running auto-clean...");
      await clearData(timePeriod, selection);
    } else {
      console.log(
        "[AutoClean] No action taken. Interval is 'off' or missing settings."
      );
    }
  }
});

// Triggered when a tab is closed
chrome.tabs.onRemoved.addListener(async () => {
  const autoSettings = (await getSettings<AutoCleanSettings>("autoClean")) ?? {
    interval: "off",
  };

  if (autoSettings.interval === "on_tab_close") {
    console.log("[AutoClean] Tab closed. Auto-clean triggered.");

    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const timePeriod = popupSettings?.period || DEFAULT_PERIOD;
    const selection = popupSettings?.dataToRemove;

    if (selection) {
      await clearData(timePeriod, selection);
    }
  }
});

// Initialization of the auto-clean logic
async function initAutoClean() {
  chrome.alarms.clear(AUTO_CLEAN_ALARM);

  const autoSettings = (await getSettings<AutoCleanSettings>("autoClean")) ?? {
    interval: "off",
  };

  if (!autoSettings || autoSettings.interval === "off") {
    console.log("[AutoClean] Interval is off. No alarm set.");
    return;
  }

  // Run immediately if configured for startup
  if (autoSettings.interval === "on_start") {
    const popupSettings = await getSettings<PopupSettings>("popupSettings");
    const timePeriod = popupSettings?.period || DEFAULT_PERIOD;
    const selection = popupSettings?.dataToRemove;

    if (selection) {
      console.log("[AutoClean] Triggered on startup");
      await clearData(timePeriod, selection);
    }
    return;
  }

  // Time-based alarms
  const timeBasedMap = {
    "15m": 15,
    "30m": 30,
    "1h": 60,
    "2h": 120,
    "24h": 1440,
  } as const;

  if (
    Object.prototype.hasOwnProperty.call(timeBasedMap, autoSettings.interval)
  ) {
    const periodInMinutes =
      timeBasedMap[autoSettings.interval as keyof typeof timeBasedMap];

    chrome.alarms.create(AUTO_CLEAN_ALARM, {
      periodInMinutes,
      delayInMinutes: 1,
    });

    console.log(`[AutoClean] Alarm set for every ${periodInMinutes} minutes`);
  } else {
    console.log("[AutoClean] Unknown interval:", autoSettings.interval);
  }
}
