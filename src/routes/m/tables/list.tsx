import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import TablesPage from "./tables";

export const Route = createFileRoute("/m/tables/list")({
  component: () => (
    <RequireAuth>
      <TablesPage />
    </RequireAuth>
  ),
});

export default undefined;
