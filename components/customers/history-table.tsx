"use client";

import { Service } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type HistoryTableProps = {
  history: Service[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export function HistoryTable({ history }: HistoryTableProps) {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No service history yet.</p>;
  }

  return (
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
        {history.map((service) => (
          <TableRow key={service.id}>
            <TableCell>{formatDate(service.date)}</TableCell>
            <TableCell>{service.mileage}</TableCell>
            <TableCell>{service.oilType}</TableCell>
            <TableCell>{service.technician}</TableCell>
            <TableCell>{service.notes || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
