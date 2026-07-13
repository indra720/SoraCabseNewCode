export const ROLES = [
  "super_admin",
  "organization_owner",
  "fleet_owner",
  "operations_manager",
  "branch_manager",
  "dispatch_manager",
  "finance_manager",
  "hr_manager",
  "support_executive",
  "bike_rental_staff",
  "maintenance_staff",
  "driver",
  "customer",
  "employee",
  "vendor",
] as const;

export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  organization_owner: "Organization Owner",
  fleet_owner: "Fleet Owner",
  operations_manager: "Operations Manager",
  branch_manager: "Branch Manager",
  dispatch_manager: "Dispatch Manager",
  finance_manager: "Finance Manager",
  hr_manager: "HR Manager",
  support_executive: "Support Executive",
  bike_rental_staff: "Bike Rental Staff",
  maintenance_staff: "Maintenance Staff",
  driver: "Driver",
  customer: "Customer",
  employee: "Employee",
  vendor: "Vendor",
};
