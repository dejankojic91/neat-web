import { z } from "zod";

export type PopupSettings = {
  timePeriod: "hour" | "24hours" | "7days" | "30days" | "all";
  cache: boolean;
  cookies: boolean;
  downloads: boolean;
  history: boolean;
  storage: boolean;
  passwords: boolean;
  darkMode: boolean;
};

export const popupSettingsSchema = z.object({
  timePeriod: z.enum(["hour", "24hours", "7days", "30days", "all"]),
  cache: z.boolean(),
  cookies: z.boolean(),
  downloads: z.boolean(),
  history: z.boolean(),
  storage: z.boolean(),
  passwords: z.boolean(),
  darkMode: z.boolean(),
});

export type OptionsSettings = {
  autoReload: boolean;
  floatingButton: boolean;
  playAudio: boolean;
  shortcut: boolean;
  dataToRemove: {
    appCache: boolean;
    cache: boolean;
    cookies: boolean;
    downloads: boolean;
    fileSystems: boolean;
    formData: boolean;
    history: boolean;
    indexedDB: boolean;
    localStorage: boolean;
    pluginData: boolean;
    passwords: boolean;
    webSQL: boolean;
  };
  autoRemove: "Off" | "15 minutes" | "30 minutes" | "1 hour" | "2 hours" | "Clear When Chrome Starts";
  timePeriod: "hour" | "24hours" | "7days" | "30days" | "all";
  darkMode: boolean;
};

export const optionsSettingsSchema = z.object({
  autoReload: z.boolean(),
  floatingButton: z.boolean(),
  playAudio: z.boolean(),
  shortcut: z.boolean(),
  dataToRemove: z.object({
    appCache: z.boolean(),
    cache: z.boolean(),
    cookies: z.boolean(),
    downloads: z.boolean(),
    fileSystems: z.boolean(),
    formData: z.boolean(),
    history: z.boolean(),
    indexedDB: z.boolean(),
    localStorage: z.boolean(),
    pluginData: z.boolean(),
    passwords: z.boolean(),
    webSQL: z.boolean(),
  }),
  autoRemove: z.enum(["Off", "15 minutes", "30 minutes", "1 hour", "2 hours", "Clear When Chrome Starts"]),
  timePeriod: z.enum(["hour", "24hours", "7days", "30days", "all"]),
  darkMode: z.boolean(),
});
