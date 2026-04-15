"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import type { Customer } from "@/lib/oil-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CustomerSearchProps = {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  selectedCustomerId?: string;
};

export function CustomerSearch({ customers, onSelect, selectedCustomerId }: CustomerSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return customers.slice(0, 10);
    return customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(normalized) || customer.phone.toLowerCase().includes(normalized),
      )
      .slice(0, 10);
  }, [customers, query]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Customer Search</CardTitle>
        <CardDescription>Search instantly by name or phone</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type name or phone..."
            className="pr-9"
          />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No matching customers
            </p>
          ) : (
            filtered.map((customer) => (
              <Button
                key={customer.id}
                variant={selectedCustomerId === customer.id ? "default" : "outline"}
                className="h-auto w-full justify-between gap-3 p-3 text-right"
                onClick={() => onSelect(customer)}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{customer.name}</p>
                  <p className="text-xs opacity-90">{customer.phone}</p>
                </div>
                <Badge variant="secondary">{customer.history.length} services</Badge>
              </Button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
