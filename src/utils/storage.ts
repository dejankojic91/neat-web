import { OptionsSettings, PopupSettings } from "@/types/settings";

export const getSettings = async <T extends Partial<OptionsSettings | PopupSettings> | string | boolean>(
  key: string
): Promise<T> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => {
      if (data[key] !== undefined) {
        resolve(data[key] as T); 
      } else {
        resolve("" as T);
      }
    });
  });
};

export const saveSettings = async <T extends Partial<OptionsSettings | PopupSettings> | string | boolean>(
  key: string,
  settings: T
) => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: settings }, () => {
      resolve();
    });
  });
};

export const getTheme = async (): Promise<string> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get("theme", (data) => {
      resolve(data.theme || "light");
    });
  });
};

export const saveTheme = async (theme: string) => {
  chrome.storage.sync.set({ theme });
};
