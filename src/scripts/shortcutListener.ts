import { getSettings } from "@/utils/storage";
import { clearData } from "@/utils/clearData";
import type { CommonSettings, PopupSettings, DataSelection } from "@/types/settings";

const defaultPeriod = "1h";
const defaultSelection: DataSelection = {
  cache: true,
  cookies: true,
  downloads: false,
  fileSystems: false,
  formData: false,
  history: true,
  indexedDB: false,
  localStorage: true,
  pluginData: false,
  passwords: false,
  webSQL: false,
};

const onKeyDown = async (e: KeyboardEvent) => {
  const isTrigger = e.altKey && e.code === "KeyC";

  if (!isTrigger) return;

  const settings = await getSettings<CommonSettings>("commonSettings");
  if (settings?.enableShortcut) {
    e.preventDefault();

    const popupSettings = await getSettings<PopupSettings>("popupSettings");

    const selection = popupSettings?.dataToRemove ?? defaultSelection;
    const period = popupSettings?.period ?? defaultPeriod;

    clearData(period, selection);
  }
};

export const registerGlobalShortcut = () => {
  document.addEventListener("keydown", onKeyDown);
};

export const unregisterGlobalShortcut = () => {
  document.removeEventListener("keydown", onKeyDown);
};
