"use client";

import type { Customer } from "@/lib/oil-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type CustomerHistoryProps = {
  customer?: Customer;
};

export function CustomerHistory({ customer }: CustomerHistoryProps) {
  if (!customer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer History</CardTitle>
          <CardDescription>Select a customer to view full service log</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No customer selected
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{customer.name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2">
          <span>{customer.phone}</span>
          <Badge variant="outline">{customer.carType}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead>Oil Type</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customer.history.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={5}>
                  No previous service records
                </TableCell>
              </TableRow>
            ) : (
              customer.history.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{new Date(service.date).toLocaleDateString()}</TableCell>
                  <TableCell>{service.mileage.toLocaleString()} km</TableCell>
                  <TableCell>{service.oilType}</TableCell>
                  <TableCell>{service.technician || "-"}</TableCell>
                  <TableCell className="max-w-52 truncate">{service.notes || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
