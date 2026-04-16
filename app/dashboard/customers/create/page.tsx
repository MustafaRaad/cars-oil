"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddVisitForm } from "@/components/customers/add-visit-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/customers">العودة إلى قائمة الزبائن</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>تسجيل عملية خدمة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
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
