import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Zap } from "lucide-react";
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
import { getNavForRole, type NavSection } from "@/constants/navigation";
import { ROLE_LABELS } from "@/constants/roles";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

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

      <SidebarContent className="px-1 py-2 bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {" "}
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
                          <Icon className="h-5 w-5 shrink-0" />

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
              })}{" "}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER ================= */}

      <SidebarFooter className="border-t border-gray-200 bg-white p-1">
        {!collapsed ? (
          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-orange-500
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  "
              >
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>

              <div className="min-w-0 flex-1">
                <h4
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-gray-800
                    "
                >
                  {user?.name}
                </h4>

                <p
                  className="
                    truncate
                    text-xs
                    text-gray-600
                    "
                >
                  {user?.email}
                </p>
              </div>
            </div>

            {/* <div className="mt-4 border-t border-zinc-800 pt-3">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs text-zinc-500">
                      Organization
                    </p>

                    <p className="text-sm font-medium text-white">
                      {user?.organization}
                    </p>

                  </div>

                  <div
                    className="
                    rounded-full
                    bg-green-500/20
                    px-3
                    py-1
                    text-[11px]
                    font-semibold
                    text-green-400
                    "
                  >
                    Online
                  </div>

                </div>

              </div>

              <div className="mt-5 border-t border-zinc-800 pt-3">

                <p
                  className="
                  text-center
                  text-[11px]
                  tracking-wide
                  text-zinc-500
                  "
                >
                  Sora Cabs
                </p>

                <p
                  className="
                  mt-1
                  text-center
                  text-[10px]
                  text-zinc-600
                  "
                >
                  Enterprise Dashboard v2.0
                </p>

              </div> */}
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                bg-orange-500
                font-bold
                text-white
                shadow-sm
                "
            >
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
