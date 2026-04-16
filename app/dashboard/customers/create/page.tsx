"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AddVisitForm } from "@/components/customers/add-visit-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addVisit, getCustomers } from "@/lib/storage";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");
  const [existingCustomers] = useState(() => getCustomers());

  const handleCreate = async (values: {
    name: string;
    phone: string;
    carType: string;
    mileage: string;
    oilType: string;
    technician: string;
    notes: string;
  }) => {
    addVisit({
      name: values.name,
      phone: values.phone,
      carType: values.carType,
      mileage: Number(values.mileage),
      oilType: values.oilType,
      technician: values.technician,
      notes: values.notes,
    });
    setSuccessMessage("تم تسجيل عملية الخدمة بنجاح.");

    setTimeout(() => {
      router.push("/dashboard/customers");
    }, 300);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 lg:py-8">
      <div className="mb-5">
        <Button asChild variant="outline" className="gap-2 shadow-sm">
          <Link href="/dashboard/customers">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            العودة إلى قائمة الزبائن
          </Link>
        </Button>
      </div>
      <Card className="border border-border/70 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur-sm">
        <CardHeader className="border-b border-border/60">
          <CardTitle className="text-lg">تسجيل عملية خدمة</CardTitle>
          <CardDescription>أدخل بيانات الزبون والسيارة لتوثيق الزيارة بشكل واضح ومنظّم.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          {successMessage ? (
            <p className="rounded-lg border border-emerald-300/70 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300">
              {successMessage}
            </p>
          ) : null}
          <AddVisitForm
            submitLabel="حفظ عملية الخدمة"
            onSubmit={handleCreate}
            existingCustomers={existingCustomers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
