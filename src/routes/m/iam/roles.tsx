import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { PageHeader } from '@/components/common/PageHeader';

export const Route = createFileRoute("/m/iam/roles")({ component: () => (
  <RequireAuth>
    <RolesPage />
  </RequireAuth>
) });

function RolesPage(){
  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Roles" description="Manage roles and permissions" />
      <div className="surface-card rounded-2xl p-4">This page will contain role creation, permission matrix and history.</div>
    </div>
  );
}

export default undefined;
