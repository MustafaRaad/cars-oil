"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CustomersTable } from "@/components/customers/customers-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Customer, getCustomers } from "@/lib/storage";

const PAGE_SIZE = 8;

export default function CustomersPage() {
  const [customers] = useState<Customer[]>(() => getCustomers());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) || customer.phone.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>العملاء</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">إدارة بيانات العملاء وسجل خدماتهم.</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/customers/create">إضافة خدمة</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="ابحث بالاسم أو رقم الهاتف..."
          />

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="font-medium">لا يوجد عملاء مطابقون.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                جرّب بحثاً مختلفاً أو أضف خدمة لعميل جديد.
              </p>
            </div>
          ) : (
            <>
              <CustomersTable customers={paginated} />
              {totalPages > 1 ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    الصفحة {safePage} من {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage === 1}
                      onClick={() => setPage((current) => Math.max(1, current - 1))}
                    >
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safePage === totalPages}
                      onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    >
                      التالي
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
