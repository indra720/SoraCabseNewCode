import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Moon, Search, Settings as SettingsIcon, Sun, Monitor, UserCog } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { ROLES, ROLE_LABELS } from "@/constants/roles";

export function Topbar() {
  const { user, logout, switchRole } = useAuth();
  const { settings, update } = useSettings();
  const navigate = useNavigate();

  const initials = user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() ?? "U";
  const ThemeIcon = settings.theme === "dark" ? Moon : settings.theme === "light" ? Sun : Monitor;

  return (
    <header className="glass sticky top-0 z-30 flex items-center gap-2 border-b border-border px-2 py-1 md:px-3 md:py-1">
      <SidebarTrigger />
      <div className="ml-1 hidden max-w-md flex-1 md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="h-8 rounded-md border-border bg-background pl-9 text-sm"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        {/* Role switcher (demo) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
              <UserCog className="h-4 w-4" />
              <span className="text-xs">{user ? ROLE_LABELS[user.role] : "Role"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-96 w-56 overflow-auto">
            <DropdownMenuLabel>Switch role (demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ROLES.map((r) => (
              <DropdownMenuItem key={r} onClick={() => switchRole(r)}>
                {ROLE_LABELS[r]}
                {user?.role === r && <Badge variant="secondary" className="ml-auto text-[10px]">Active</Badge>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Theme">
              <ThemeIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => update({ theme: "light" })}><Sun className="mr-2 h-4 w-4" /> Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => update({ theme: "dark" })}><Moon className="mr-2 h-4 w-4" /> Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => update({ theme: "system" })}><Monitor className="mr-2 h-4 w-4" /> System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        User menu
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-medium leading-tight text-foreground">{user?.name}</p>
                <p className="text-[10px] leading-tight text-muted-foreground">{user?.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings"><SettingsIcon className="mr-2 h-4 w-4" /> Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/auth" }); }}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
