import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import QrOrderingPage from "./qr-ordering";

export const Route = createFileRoute("/m/tables/qr")({
  component: () => (
    <RequireAuth>
      <QrOrderingPage />
    </RequireAuth>
  ),
});

export default undefined;
