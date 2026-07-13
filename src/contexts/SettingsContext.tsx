import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type PaletteName = "default" | "ocean" | "sunset" | "mint";

export interface AppSettings {
  theme: ThemeMode;
  palette: PaletteName;
  compactSidebar: boolean;
  animations: boolean;
  language: string;
  currency: string;
  timezone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

const DEFAULTS: AppSettings = {
  theme: "system",
  palette: "default",
  compactSidebar: false,
  animations: true,
  language: "en",
  currency: "USD",
  timezone: "UTC",
  dateFormat: "MMM d, yyyy",
  timeFormat: "12h",
};

const STORAGE_KEY = "rideflow.settings";

interface Ctx {
  settings: AppSettings;
  update: (patch: Partial<AppSettings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<Ctx | null>(null);

function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const isDark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

function applyPalette(palette: PaletteName) {
  if (typeof window === "undefined") return;

  const PALETTES: Record<PaletteName, { light: Record<string, string>; dark: Record<string, string> }> = {
    default: {
      light: {
        '--primary': '#ff6a00',
        '--primary-foreground': '#ffffff',
        '--accent': '#ff8a3d',
        '--accent-foreground': '#ffffff'
      },
      dark: {
        '--primary': '#ff8a3d',
        '--primary-foreground': '#ffffff',
        '--accent': '#ff6a00',
        '--accent-foreground': '#ffffff'
      }
    },
    ocean: {
      light: {
        '--primary': 'oklch(0.55 0.18 210)',
        '--primary-foreground': 'oklch(0.99 0.005 260)',
        '--accent': 'oklch(0.52 0.12 200)',
        '--accent-foreground': 'oklch(0.99 0.005 260)'
      },
      dark: {
        '--primary': 'oklch(0.6 0.2 210)',
        '--primary-foreground': 'oklch(0.14 0.02 265)',
        '--accent': 'oklch(0.44 0.12 200)',
        '--accent-foreground': 'oklch(0.96 0.005 260)'
      }
    },
    sunset: {
      light: {
        '--primary': 'oklch(0.62 0.22 30)',
        '--primary-foreground': 'oklch(0.99 0.005 260)',
        '--accent': 'oklch(0.7 0.18 330)',
        '--accent-foreground': 'oklch(0.99 0.005 260)'
      },
      dark: {
        '--primary': 'oklch(0.7 0.22 30)',
        '--primary-foreground': 'oklch(0.14 0.02 265)',
        '--accent': 'oklch(0.62 0.18 330)',
        '--accent-foreground': 'oklch(0.96 0.005 260)'
      }
    },
    mint: {
      light: {
        '--primary': 'oklch(0.6 0.18 150)',
        '--primary-foreground': 'oklch(0.99 0.005 260)',
        '--accent': 'oklch(0.5 0.12 150)',
        '--accent-foreground': 'oklch(0.99 0.005 260)'
      },
      dark: {
        '--primary': 'oklch(0.66 0.18 150)',
        '--primary-foreground': 'oklch(0.14 0.02 265)',
        '--accent': 'oklch(0.46 0.12 150)',
        '--accent-foreground': 'oklch(0.96 0.005 260)'
      }
    }
  };

  const root = document.documentElement;
  // inject a small style block that defines palette vars for :root and .dark
  let el = document.getElementById('theme-palette') as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = 'theme-palette';
    document.head.appendChild(el);
  }

  const p = PALETTES[palette];
  const lightCss = Object.entries(p.light).map(([k, v]) => `${k}: ${v};`).join('\n    ');
  const darkCss = Object.entries(p.dark).map(([k, v]) => `${k}: ${v};`).join('\n    ');
  el.textContent = `:root {\n    ${lightCss}\n  }\n  .dark {\n    ${darkCss}\n  }`;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);
    if (settings.theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.theme]);

  useEffect(() => {
    applyPalette(settings.palette);
  }, [settings.palette]);

  const update = (patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, update, reset: () => update(DEFAULTS) }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
