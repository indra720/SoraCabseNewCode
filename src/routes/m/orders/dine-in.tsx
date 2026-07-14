import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import DineinPage from "./dinein";

export const Route = createFileRoute("/m/orders/dine-in")({
  component: () => (
    <RequireAuth>
      <DineinPage />
    </RequireAuth>
  ),
});

export default undefined;
