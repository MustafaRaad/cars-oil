"use client";

import { useMemo, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_OIL_TYPES = [
  "5W-30 تخليقي",
  "5W-40 تخليقي",
  "10W-40 شبه تخليقي",
  "10W-30 معدني",
  "0W-20 تخليقي بالكامل",
  "0W-30 تخليقي بالكامل",
  "15W-40 ديزل",
  "ATF ديكسترون III",
];

export type AddVisitFormValues = {
  name: string;
  phone: string;
  carType: string;
  mileage: string;
  oilType: string;
  technician: string;
  notes: string;
};

type AddVisitFormProps = {
  onSubmit: (values: AddVisitFormValues) => Promise<void> | void;
  submitLabel: string;
  existingCustomers: Array<{
    name: string;
    phone: string;
    carType?: string;
  }>;
};

export function AddVisitForm({ onSubmit, submitLabel, existingCustomers }: AddVisitFormProps) {
  const [values, setValues] = useState<AddVisitFormValues>({
    name: "",
    phone: "",
    carType: "",
    mileage: "",
    oilType: "",
    technician: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const updateField = (key: keyof AddVisitFormValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (
      !values.name.trim() ||
      !values.phone.trim() ||
      !values.carType.trim() ||
      !values.mileage.trim() ||
      !values.oilType.trim() ||
      !values.technician.trim()
    ) {
      setError("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    if (Number.isNaN(Number(values.mileage)) || Number(values.mileage) < 0) {
      setError("عداد الكيلومتر يجب أن يكون رقماً صحيحاً.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "حدث خطأ أثناء الحفظ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestions = useMemo(() => {
    const query = values.name.trim().toLowerCase();
    if (!query) return [];

    const seen = new Set<string>();
    return existingCustomers
      .filter((customer) => customer.name.toLowerCase().includes(query))
      .filter((customer) => {
        const key = customer.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [existingCustomers, values.name]);

  const selectSuggestion = (suggestion: { name: string; phone: string; carType?: string }) => {
    setValues((current) => ({
      ...current,
      name: suggestion.name,
      phone: suggestion.phone,
      carType: suggestion.carType || current.carType,
    }));
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground/90">
            اسم الزبون
          </label>
          <div className="relative">
            <Input
              id="name"
              placeholder="مثال: محمد أحمد"
              className="bg-background/75 shadow-sm"
              value={values.name}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 100);
              }}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {showSuggestions && suggestions.length > 0 ? (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-border/70 bg-card p-1.5 shadow-lg">
                {suggestions.map((suggestion) => (
                  <button
                    key={`${suggestion.name}-${suggestion.phone}`}
                    type="button"
                    className="w-full rounded-md px-2 py-1.5 text-right text-sm hover:bg-muted"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectSuggestion(suggestion);
                    }}
                  >
                    <span className="font-medium">{suggestion.name}</span>
                    <span className="me-2 text-muted-foreground">{suggestion.phone}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground/90">
            رقم الهاتف
          </label>
          <Input
            id="phone"
            placeholder="07XXXXXXXX"
            className="bg-background/75 shadow-sm"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="carType" className="text-sm font-medium text-foreground/90">
            نوع السيارة
          </label>
          <Input
            id="carType"
            placeholder="مثال: Toyota Corolla 2020"
            className="bg-background/75 shadow-sm"
            value={values.carType}
            onChange={(event) => updateField("carType", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mileage" className="text-sm font-medium text-foreground/90">
            عداد الكيلومتر
          </label>
          <Input
            id="mileage"
            type="number"
            min={0}
            placeholder="مثال: 125000"
            className="bg-background/75 shadow-sm"
            value={values.mileage}
            onChange={(event) => updateField("mileage", event.target.value)}
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="oilType" className="text-sm font-medium text-foreground/90">
            نوع الزيت المستخدم
          </label>
          <Input
            id="oilType"
            list="oil-types"
            placeholder="اختر أو اكتب نوع الزيت"
            className="bg-background/75 shadow-sm"
            value={values.oilType}
            onChange={(event) => updateField("oilType", event.target.value)}
          />
          <datalist id="oil-types">
            {MOCK_OIL_TYPES.map((oilType) => (
              <option key={oilType} value={oilType} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <label htmlFor="technician" className="text-sm font-medium text-foreground/90">
            اسم الفني
          </label>
          <Input
            id="technician"
            placeholder="اسم الفني المسؤول"
            className="bg-background/75 shadow-sm"
            value={values.technician}
            onChange={(event) => updateField("technician", event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-foreground/90">
          الملاحظات
        </label>
        <textarea
          id="notes"
          value={values.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          rows={3}
          placeholder="أي ملاحظات إضافية عن الخدمة"
          className="min-h-24 w-full rounded-lg border border-input bg-background/75 px-3 py-2 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="w-full gap-2 sm:w-auto shadow-sm">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
        {isSubmitting ? "جارٍ الحفظ..." : submitLabel}
      </Button>
    </form>
  );
}
