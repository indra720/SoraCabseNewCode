import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Moon, Sun, Palette, Sparkles, RotateCcw } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, type ThemeMode, type PaletteName } from "@/contexts/SettingsContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  component: () => (
    <RequireAuth>
      <SettingsPage />
    </RequireAuth>
  ),
});

const themeOptions: { value: ThemeMode; label: string; Icon: typeof Monitor }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const paletteOptions: { value: PaletteName; label: string; color: string }[] = [
  { value: "default", label: "Default", color: "linear-gradient(135deg, oklch(0.55 0.22 265), oklch(0.62 0.2 285))" },
  { value: "ocean", label: "Ocean", color: "linear-gradient(135deg, oklch(0.55 0.18 210), oklch(0.65 0.18 195))" },
  { value: "sunset", label: "Sunset", color: "linear-gradient(135deg, oklch(0.62 0.22 30), oklch(0.7 0.18 330))" },
  { value: "mint", label: "Mint", color: "linear-gradient(135deg, oklch(0.6 0.18 150), oklch(0.5 0.12 150))" },
];

const currencies = ["USD", "EUR", "GBP", "INR", "AED", "SGD", "JPY"];
const languages = [
  { c: "en", l: "English" }, { c: "es", l: "Español" }, { c: "fr", l: "Français" },
  { c: "de", l: "Deutsch" }, { c: "hi", l: "हिन्दी" }, { c: "ar", l: "العربية" },
];
const timezones = ["UTC", "America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Australia/Sydney"];

function SettingsPage() {
  const { settings, update, reset } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Personalize your workspace, appearance, and regional preferences."
        actions={
          <Button variant="outline" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        }
      />

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <section className="card-premium p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">Theme</h3>
              <p className="text-xs text-muted-foreground">Choose how Sora Cabs looks to you.</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {themeOptions.map(({ value, label, Icon }) => {
                const active = settings.theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => update({ theme: value })}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                      active ? "border-primary bg-primary-soft" : "border-border hover:bg-accent",
                    )}
                  >
                    <div className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {value === "system" ? "Match OS" : `Always ${label.toLowerCase()}`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card-premium p-6">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground">Color palette</h3>
              <p className="text-xs text-muted-foreground">Pick an accent palette for the app.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {paletteOptions.map(({ value, label, color }) => {
                const active = settings.palette === value;
                return (
                  <button
                    key={value}
                    onClick={() => update({ palette: value })}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                      active ? "border-primary" : "border-border hover:bg-accent"
                    )}
                  >
                    <div className={cn("h-9 w-9 rounded-lg shadow-sm", active ? "ring-2 ring-primary" : "")}
                      style={{ background: color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground">{label} accents</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card-premium p-6">
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Layout & motion</h3>
            </div>
            <div className="space-y-4">
              <SettingRow
                label="Compact sidebar"
                description="Reduce the sidebar to icons by default."
                control={
                  <Switch
                    checked={settings.compactSidebar}
                    onCheckedChange={(v) => update({ compactSidebar: v })}
                  />
                }
              />
              <SettingRow
                label="Enable animations"
                description="Turn off for reduced motion."
                control={
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(v) => update({ animations: v })}
                  />
                }
              />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="regional" className="space-y-4">
          <section className="card-premium p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Regional preferences</h3>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Language">
                <Select value={settings.language} onValueChange={(v) => update({ language: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => <SelectItem key={l.c} value={l.c}>{l.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Currency">
                <Select value={settings.currency} onValueChange={(v) => update({ currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Timezone">
                <Select value={settings.timezone} onValueChange={(v) => update({ timezone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {timezones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date format">
                <Select value={settings.dateFormat} onValueChange={(v) => update({ dateFormat: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MMM d, yyyy">Sep 14, 2026</SelectItem>
                    <SelectItem value="dd/MM/yyyy">14/09/2026</SelectItem>
                    <SelectItem value="MM/dd/yyyy">09/14/2026</SelectItem>
                    <SelectItem value="yyyy-MM-dd">2026-09-14</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Time format">
                <Select value={settings.timeFormat} onValueChange={(v) => update({ timeFormat: v as "12h" | "24h" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                    <SelectItem value="24h">24-hour (14:30)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="general" className="space-y-4">
          <section className="card-premium p-6">
            <h3 className="text-sm font-semibold text-foreground">Workspace</h3>
            <p className="mt-1 text-xs text-muted-foreground">General organization settings. Full configuration UI coming in the next release.</p>
          </section>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <section className="card-premium p-6">
            <h3 className="text-sm font-semibold text-foreground">Advanced</h3>
            <p className="mt-1 text-xs text-muted-foreground">API keys, webhooks, and cache controls will appear here.</p>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SettingRow({
  label, description, control,
}: { label: string; description: string; control: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {control}
    </div>
  );
}
