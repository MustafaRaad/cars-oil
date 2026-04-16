"use client";

import Link from "next/link";
import { use, useState } from "react";
import { CustomerForm } from "@/components/customers/customer-form";
import { HistoryTable } from "@/components/customers/history-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Customer, getCustomerById, updateCustomer } from "@/lib/storage";

type CustomerDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default function CustomerDetailsPage({ params }: CustomerDetailsPageProps) {
  const { id } = use(params);
  const [customer, setCustomer] = useState<Customer | null>(() => getCustomerById(id) ?? null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async (values: { name: string; phone: string; carType: string }) => {
    const updated = updateCustomer(id, values);
    setCustomer(updated);
    setIsEditing(false);
    setMessage("تم تحديث بيانات العميل بنجاح.");
  };

  if (!customer) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>العميل غير موجود</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/customers">العودة إلى العملاء</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>تفاصيل العميل</CardTitle>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/customers">رجوع</Link>
            </Button>
            <Button variant={isEditing ? "secondary" : "default"} onClick={() => setIsEditing((v) => !v)}>
              {isEditing ? "إلغاء التعديل" : "تعديل العميل"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? <p className="text-sm text-green-600">{message}</p> : null}

          {isEditing ? (
            <CustomerForm
              defaultValues={{
                name: customer.name,
                phone: customer.phone,
                carType: customer.carType || "",
              }}
              submitLabel="حفظ التغييرات"
              onSubmit={handleSave}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">الاسم</p>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الهاتف</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع السيارة</p>
                <p className="font-medium">{customer.carType || "-"}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>سجل الخدمات</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoryTable history={customer.history} />
        </CardContent>
      </Card>
    </div>
  );
}
