import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import AllOrdersPage from "./all-orders";

export const Route = createFileRoute("/m/orders/all")({
  component: () => (
    <RequireAuth>
      <AllOrdersPage />
    </RequireAuth>
  ),
});

export default undefined;
