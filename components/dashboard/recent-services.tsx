"use client";

import type { Customer, Service } from "@/lib/oil-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RecentServicesProps = {
  services: Service[];
  customers: Customer[];
};

export function RecentServices({ services, customers }: RecentServicesProps) {
  const latest = services.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
        <CardDescription>Latest oil change operations</CardDescription>
      </CardHeader>
      <CardContent>
        {latest.length === 0 ? (
          <p className="rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
            No recent operations yet
          </p>
        ) : (
          <div className="space-y-2">
            {latest.map((service) => {
              const customer = customers.find((item) => item.id === service.customerId);
              return (
                <div key={service.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-semibold">{customer?.name ?? "Unknown customer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(service.date).toLocaleString()} - {service.mileage.toLocaleString()} km
                    </p>
                  </div>
                  <Badge variant="secondary">{service.oilType}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
