"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CustomerFormValues = {
  name: string;
  phone: string;
  carType: string;
};

type CustomerFormProps = {
  defaultValues?: CustomerFormValues;
  submitLabel: string;
  onSubmit: (values: CustomerFormValues) => Promise<void> | void;
};

export function CustomerForm({
  defaultValues = { name: "", phone: "", carType: "" },
  submitLabel,
  onSubmit,
}: CustomerFormProps) {
  const [name, setName] = useState(defaultValues.name);
  const [phone, setPhone] = useState(defaultValues.phone);
  const [carType, setCarType] = useState(defaultValues.carType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("الاسم ورقم الهاتف مطلوبان.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ name, phone, carType });
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "تعذر حفظ بيانات العميل.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          اسم العميل
        </label>
        <Input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="مثال: محمد أحمد"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          رقم الهاتف
        </label>
        <Input
          id="phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="مثال: 01012345678"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="carType" className="text-sm font-medium">
          نوع السيارة
        </label>
        <Input
          id="carType"
          value={carType}
          onChange={(event) => setCarType(event.target.value)}
          placeholder="مثال: تويوتا كورولا"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "جارٍ الحفظ..." : submitLabel}
      </Button>
    </form>
  );
}
