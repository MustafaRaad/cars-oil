"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import type { Customer, ServicePayload } from "@/lib/oil-data";
import { OIL_TYPES } from "@/lib/oil-data";
import type { ServiceResult } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type ServiceFormProps = {
  customers: Customer[];
  onSave: (payload: ServicePayload) => ServiceResult;
  onCustomerSelected: (customer: Customer) => void;
  onSaved: (result: ServiceResult) => void;
  selectedCustomer?: Customer;
};

const initialForm: ServicePayload = {
  name: "",
  phone: "",
  carType: "",
  mileage: 0,
  oilType: OIL_TYPES[0],
  technician: "",
  notes: "",
};

export function ServiceForm({
  customers,
  onSave,
  onCustomerSelected,
  onSaved,
  selectedCustomer,
}: ServiceFormProps) {
  const [form, setForm] = useState<ServicePayload>(initialForm);
  const [message, setMessage] = useState("");

  const quickMatches = useMemo(() => {
    const source = `${form.phone} ${form.name}`.trim().toLowerCase();
    if (!source) return [];
    return customers
      .filter((customer) => {
        return customer.phone.toLowerCase().includes(source) || customer.name.toLowerCase().includes(source);
      })
      .slice(0, 6);
  }, [customers, form.name, form.phone]);

  const applyCustomer = (customer: Customer) => {
    setForm((current) => ({
      ...current,
      name: customer.name,
      phone: customer.phone,
      carType: customer.carType,
    }));
    onCustomerSelected(customer);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.phone || !form.carType || !form.mileage || !form.oilType || !form.technician) {
      setMessage("Please fill all required fields.");
      return;
    }
    const result = onSave(form);
    onSaved(result);
    setMessage("Service entry saved successfully.");
    setForm({
      ...initialForm,
      name: result.customer.name,
      phone: result.customer.phone,
      carType: result.customer.carType,
      technician: form.technician,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fast Service Entry</CardTitle>
        <CardDescription>Enter customer and service details in seconds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium">Customer Name *</label>
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="Enter customer name"
              list="customer-names"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Phone Number *</label>
            <Input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Enter phone number"
              list="customer-phones"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Car Type *</label>
            <Input
              value={form.carType}
              onChange={(event) => setForm((current) => ({ ...current, carType: event.target.value }))}
              placeholder="Corolla / Accent / Elantra..."
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Mileage (KM) *</label>
            <Input
              type="number"
              value={form.mileage || ""}
              onChange={(event) => setForm((current) => ({ ...current, mileage: Number(event.target.value) }))}
              placeholder="e.g. 125000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Oil Type *</label>
            <select
              value={form.oilType}
              onChange={(event) => setForm((current) => ({ ...current, oilType: event.target.value }))}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {OIL_TYPES.map((oil) => (
                <option key={oil} value={oil}>
                  {oil}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Technician Name *</label>
            <Input
              value={form.technician}
              onChange={(event) => setForm((current) => ({ ...current, technician: event.target.value }))}
              placeholder="Technician"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Notes</label>
            <Input
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Optional notes"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-3 pt-1">
            <div className="flex min-h-6 items-center text-sm text-emerald-700">
              {message && (
                <>
                  <CheckCircle2 className="ml-1 size-4" />
                  <span>{message}</span>
                </>
              )}
            </div>
            <Button size="lg" type="submit">
              Save Service
            </Button>
          </div>
        </form>

        <datalist id="customer-names">
          {customers.map((customer) => (
            <option key={customer.id} value={customer.name} />
          ))}
        </datalist>
        <datalist id="customer-phones">
          {customers.map((customer) => (
            <option key={customer.id} value={customer.phone} />
          ))}
        </datalist>

        {(quickMatches.length > 0 || selectedCustomer) && (
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-sm font-medium">Quick customer suggestions</p>
            <div className="flex flex-wrap gap-2">
              {quickMatches.map((customer) => (
                <Button
                  key={customer.id}
                  variant="outline"
                  onClick={() => applyCustomer(customer)}
                  className="h-auto px-3 py-2"
                >
                  {customer.name} - {customer.phone}
                </Button>
              ))}
              {selectedCustomer && <Badge>Selected: {selectedCustomer.name}</Badge>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
