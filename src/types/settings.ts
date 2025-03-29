export type DataTypeKey =
  | "cache"
  | "cookies"
  | "downloads"
  | "fileSystems"
  | "formData"
  | "history"
  | "indexedDB"
  | "localStorage"
  | "pluginData"
  | "passwords"
  | "webSQL";

export type DataSelection = Record<DataTypeKey, boolean>;
export interface CookieFilterSettings {
  mode: "whitelist" | "blacklist";
  domains: string[];
}


export interface PopupSettings {
  dataToRemove: DataSelection;
  period?: string;
  cookieFilter?: CookieFilterSettings;
}


export interface CommonSettings {
  reloadTab: boolean;
  playAudio: boolean;
  enableShortcut: boolean;
}

export type AutoCleanInterval =
  | "off"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "24h"
  | "on_start"
  | "on_tab_close";

export interface AutoCleanSettings {
  enabled: boolean;
  interval: AutoCleanInterval;
}
