import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { PageHeader } from '@/components/common/PageHeader';

export const Route = createFileRoute("/m/iam/riders")({ component: () => (
  <RequireAuth>
    <RidersPage />
  </RequireAuth>
) });

function RidersPage(){
  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Riders" description="Rider/Driver management" />
      <div className="surface-card rounded-2xl p-4">This page will include rider profiles, documents, vehicle and performance tabs.</div>
    </div>
  );
}

export default undefined;
