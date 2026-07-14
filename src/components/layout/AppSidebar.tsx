import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Zap, Settings as SettingsIcon, LogOut } from "lucide-react";
import soraLogo from "@/Assets/Sora.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getNavForRole, type NavSection } from "@/constants/navigation";
import { ROLE_LABELS } from "@/constants/roles";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  const initials =
    user?.name?.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() ?? "U";

  const pathname = useRouterState({
    select: (r) => r.location.pathname,
  });

  const sections: NavSection[] = user ? getNavForRole(user.role) : [];

  const isActive = (path?: string) =>
    !!path && (pathname === path || pathname.startsWith(path + "/"));

  const sectionActive = (section: NavSection) =>
    isActive(section.path) ||
    (section.children?.some((c) => isActive(c.path.split("?")[0])) ?? false);

  return (
    <Sidebar collapsible="icon" className="border-r bg-white text-gray-800 shadow-sm">
      {/* ================= HEADER ================= */}

      <SidebarHeader className="border-b px-1 py-2 bg-white">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center gap-0")}>
          <div className="flex items-center">
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-zinc-50 border border-gray-100 shadow-sm">
              <img src={soraLogo} alt="Sora Cabs" className="h-full w-full object-cover" />
            </div>
          </div>

          {!collapsed && (
            <div className="ml-2 min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold tracking-wide text-gray-900">Sora Cabs</h2>
              <p className="mt-0.5 truncate text-xs font-medium text-gray-600">
                {user ? ROLE_LABELS[user.role] : "Enterprise Platform"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* ================= MENU ================= */}

      <SidebarContent className="px-0.5 py-2 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => {
                const Icon = section.icon;

                // ---------------- SIMPLE MENU ----------------

                if (!section.children) {
                  return (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(section.path)}
                        tooltip={section.label}
                        className={cn(
                          "mb-1 h-9 rounded-xl transition-all duration-300",
                          "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
                          "data-[active=true]:bg-[var(--sidebar-primary)]",
                          "data-[active=true]:text-[var(--sidebar-primary-foreground)]",
                          "data-[active=true]:shadow-md",
                          "font-medium",
                          collapsed && "justify-center"
                        )}
                      >
                        <Link to={section.path!} className="flex items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />

                          {!collapsed && <span className="truncate text-sm">{section.label}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // ---------------- COLLAPSIBLE MENU ----------------

                const active = sectionActive(section);

                return (
                  <Collapsible key={section.id} defaultOpen={active} className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={active}
                          tooltip={section.label}
                          className={cn(
                            "mb-1 h-9 rounded-xl transition-all duration-300",
                            "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
                            "data-[active=true]:bg-[var(--sidebar-primary)]",
                            "data-[active=true]:text-[var(--sidebar-primary-foreground)]",
                            "data-[active=true]:shadow-md",
                            "font-medium",
                            collapsed && "justify-center"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />

                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate text-left text-sm">{section.label}</span>
                              <ChevronRight className="h-4 w-4 transition-transform duration-300 opacity-70 group-data-[state=open]/collapsible:rotate-90" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>


                      <CollapsibleContent
                        className="
                          overflow-hidden
                          data-[state=open]:animate-accordion-down
                          data-[state=closed]:animate-accordion-up
                          "
                      >
                        <SidebarMenuSub className="ml-3 mt-1 border-l border-gray-200 pl-3">
                          {section.children.map((child) => {
                            const childPath = child.path.split("?")[0];

                            const childActive = isActive(childPath);

                            return (
                              <SidebarMenuSubItem key={child.path}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={childActive}
                                  className={cn(
                                    "my-1 h-8 rounded-md transition-all duration-300",
                                    "text-gray-800 hover:bg-gray-50 hover:text-gray-900",
                                    childActive &&
                                      "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] font-semibold shadow-sm",
                                  )}
                                >
                                  <Link to={child.path} className="truncate text-sm">
                                    {child.label}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER ================= */}

      <SidebarFooter className="border-t border-gray-200 bg-white p-1">
        {!collapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-orange-500 text-sm font-bold text-white">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-gray-800">{user?.name}</h4>

                    <p className="truncate text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">
                  <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/auth" }); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-bold text-white shadow-sm">{initials}</div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/auth" }); }}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
