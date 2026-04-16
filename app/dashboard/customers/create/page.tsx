"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerForm } from "@/components/customers/customer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCustomer } from "@/lib/storage";

export default function CreateCustomerPage() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreate = async (values: { name: string; phone: string; carType: string }) => {
    createCustomer(values);
    setSuccessMessage("Customer created successfully.");

    setTimeout(() => {
      router.push("/dashboard/customers");
    }, 300);
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Create Customer</CardTitle>
          <Button asChild variant="outline">
            <Link href="/dashboard/customers">Back to List</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage ? <p className="text-sm text-green-600">{successMessage}</p> : null}
          <CustomerForm submitLabel="Create Customer" onSubmit={handleCreate} />
        </CardContent>
      </Card>
    </div>
  );
}
