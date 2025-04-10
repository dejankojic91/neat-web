export const getSettings = async <T>(key: string): Promise<T> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (data) => {
      resolve(data[key] as T);
    });
  });
};

export const saveSettings = async <T>(key: string, value: T) => {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => resolve());
  });
};

const isValidTab = (value: "clear" | "advanced") => {
  return value === "clear" || value === "advanced";
};

export const saveLastTab = async (tab: "clear" | "advanced") => {
  await chrome.storage.local.set({ lastActiveTab: tab });
};

export const getLastTab = async (): Promise<"clear" | "advanced"> => {
  const { lastActiveTab } = await chrome.storage.local.get("lastActiveTab");

  return isValidTab(lastActiveTab) ? lastActiveTab : "clear";
};

export const clearLastTab = async () => {
  await chrome.storage.local.remove("lastActiveTab");
};