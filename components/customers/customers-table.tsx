"use client";

import Link from "next/link";
import { Customer } from "@/lib/storage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CustomersTableProps = {
  customers: Customer[];
};

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ar-EG");
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الاسم</TableHead>
          <TableHead>الهاتف</TableHead>
          <TableHead>نوع السيارة</TableHead>
          <TableHead>عدد الزيارات</TableHead>
          <TableHead>آخر زيارة</TableHead>
          <TableHead className="text-left">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => {
          const lastVisit = customer.history[customer.history.length - 1];

          return (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.carType || "-"}</TableCell>
              <TableCell>
                <Badge variant="secondary">{customer.history.length}</Badge>
              </TableCell>
              <TableCell>{formatDate(lastVisit?.date)}</TableCell>
              <TableCell className="text-left">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/customers/${customer.id}`}>عرض / تعديل</Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
