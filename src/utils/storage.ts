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