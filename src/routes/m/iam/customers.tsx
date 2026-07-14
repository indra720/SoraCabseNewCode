import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { PageHeader } from '@/components/common/PageHeader';

export const Route = createFileRoute("/m/iam/customers")({ component: () => (
  <RequireAuth>
    <CustomersPage />
  </RequireAuth>
) });

function CustomersPage(){
  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Customers" description="Customer management (separate from users)" />
      <div className="surface-card rounded-2xl p-4">This page will contain customer-specific fields, wallet, orders and activity.</div>
    </div>
  );
}

export default undefined;
