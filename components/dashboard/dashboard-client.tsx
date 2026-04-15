"use client";

import { useMemo, useState } from "react";

import { CustomerHistory } from "@/components/dashboard/customer-history";
import { CustomerSearch } from "@/components/dashboard/customer-search";
import { PrintView } from "@/components/dashboard/print-view";
import { RecentServices } from "@/components/dashboard/recent-services";
import { ServiceForm } from "@/components/dashboard/service-form";
import type { ServiceResult } from "@/components/dashboard/types";
import type { Customer } from "@/lib/oil-data";
import { useOilData } from "@/lib/use-oil-data";

export function DashboardClient() {
  const { customers, services, upsertService } = useOilData();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
  const [latestService, setLatestService] = useState<ServiceResult | undefined>();

  const selectedCustomer: Customer | undefined = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId),
    [customers, selectedCustomerId],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4 md:p-6">
      <header className="rounded-xl border bg-card p-4">
        <h1 className="text-2xl font-bold">Al-Asad Oil Change Dashboard</h1>
        <p className="text-sm text-muted-foreground">Fast workshop workflow for oil and filter services</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ServiceForm
            customers={customers}
            onSave={upsertService}
            onCustomerSelected={(customer) => setSelectedCustomerId(customer.id)}
            onSaved={(result) => {
              setLatestService(result);
              setSelectedCustomerId(result.customer.id);
            }}
            selectedCustomer={selectedCustomer}
          />
          <CustomerHistory customer={selectedCustomer} />
        </div>

        <div className="space-y-4">
          <PrintView latestService={latestService} />
          <CustomerSearch
            customers={customers}
            selectedCustomerId={selectedCustomerId}
            onSelect={(customer) => setSelectedCustomerId(customer.id)}
          />
          <RecentServices services={services} customers={customers} />
        </div>
      </div>
    </div>
  );
}
