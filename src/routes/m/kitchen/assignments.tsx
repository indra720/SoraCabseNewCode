import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import ChefAssignmentPage from "./chef-assignment";

export const Route = createFileRoute("/m/kitchen/assignments")({
  component: () => (
    <RequireAuth>
      <ChefAssignmentPage />
    </RequireAuth>
  ),
});

export default undefined;
