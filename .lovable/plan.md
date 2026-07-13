# RideFlow ERP — Build Plan

This is a very large scope (26 top-level modules, 100+ sub-pages, RBAC, dashboards, workflows). Shipping all of it in one turn would produce shallow, broken screens. I'll build it in phases, starting with a production-quality foundation you can actually navigate, then filling modules in follow-ups.

Note on stack: your project is on **TanStack Start + TanStack Router** (not React Router v7) and **Tailwind v4**. I'll keep every other library you listed (shadcn/ui, Radix, TanStack Table/Query, Framer Motion, Recharts, RHF, Zod, Axios). Routing will use TanStack Router — same DX, type-safe, works with the existing scaffold.

## Phase 1 — Foundation (this turn)

**Design system**
- Premium enterprise theme in `src/styles.css`: refined neutral palette + indigo/blue primary, soft shadows, glass surfaces, rounded-2xl cards, dark mode tokens.
- Typography scale, semantic tokens only (no hardcoded colors in components).

**RBAC core (dummy JSON)**
- `src/constants/roles.ts` — 15 roles from your list.
- `src/constants/permissions.ts` — module + CRUD permission matrix per role.
- `src/contexts/AuthContext.tsx` — dummy JWT login, current user, role, permissions.
- `src/hooks/usePermission.ts`, `<PermissionGuard>`, `<RoleGuard>`.
- Dummy users seeded for each role; role switcher in header for demo.

**Layout & navigation**
- `AppShell` with collapsible sidebar (shadcn sidebar), topbar (search, notifications, user menu, role switcher, theme toggle), breadcrumbs.
- Full sidebar tree for **Super Admin** matching your 26-section sequence exactly, with icons and grouping. Sidebar auto-filters by permissions for other roles.
- Route-level lazy loading, protected routes.

**Auth**
- `/auth` login page (dummy) — pick a role, sign in, redirected to `/dashboard`.

**Dashboard (Super Admin)**
- 6 KPI cards (Revenue, Active Drivers, Customers, Fleet, Orders, Bike Rentals, Trips).
- Recharts: Revenue (area), Rides (bar), Driver Growth (line), Fleet Growth (line), Bike Utilization (radial).
- Recent Activities feed, Latest Payments, Notifications, Quick Actions.
- Skeleton loaders, empty states.

**Settings page**
- Theme (light/dark/system), primary color picker, sidebar style (expanded/compact), animations toggle, language/currency/timezone/date/time format. Persisted to localStorage.

**Shared UI primitives**
- `DataTable` (TanStack Table): search, column filters, pagination, export CSV, import stub, row actions.
- `PageHeader`, `StatCard`, `EmptyState`, `ErrorState`, `LoadingSkeleton`.

**Module route stubs (all 26)**
Every module + every sub-page from your sequence gets a real route and a polished placeholder page using `PageHeader` + `EmptyState` ("Coming soon — module scaffolded"). This means the sidebar is fully navigable end-to-end on day one; we then fill modules with real CRUD in later phases.

## Phase 2+ (follow-up turns, pick priority)

Full CRUD + dummy data + workflows for modules, in order you choose. Suggested priority:
1. Driver Management + KYC + Wallet
2. Vehicle & Fleet Management
3. **Bike Rental** (full 12-step workflow you specified)
4. Ride Operations + GPS Tracking (mocked map)
5. Payments + Finance + Payroll
6. HR, Procurement, CRM, Marketing
7. Reports, AI/BI, Integrations, Subscription, Security, Legal, remaining Settings

Each phase = real tables, forms (RHF + Zod), detail drawers, filters, export.

## Technical notes

- Folder structure: `src/{components,layouts,pages,features,hooks,contexts,services,types,constants,utils,assets}` under existing TanStack `src/routes/` for route files.
- Routes live in `src/routes/` (TanStack file-based). Feature logic in `src/features/<module>/`.
- Services layer with Axios instance + React Query, wired to a `mockApi` adapter returning dummy JSON so swapping to a real backend later is a one-line change.
- Strict TypeScript, Zod schemas shared between forms and mock API.
- Framer Motion for page/sidebar/card transitions.

## Deliverable of Phase 1

A navigable, permission-aware, themed shell with a real dashboard, real settings, real auth (dummy), and every one of the 26 modules + sub-pages reachable from the sidebar as scaffolded pages — ready to flesh out module by module.

Approve to proceed with Phase 1, or tell me to reorder / expand a specific module first.