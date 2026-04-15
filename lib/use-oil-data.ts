"use client";

import { useMemo, useState } from "react";

import {
  type Customer,
  OIL_STORAGE_KEY,
  type OilDataStore,
  type Service,
  type ServicePayload,
} from "@/lib/oil-data";

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hydrateCustomerHistory(customers: Customer[], services: Service[]) {
  const grouped = new Map<string, Service[]>();
  for (const service of services) {
    const list = grouped.get(service.customerId) ?? [];
    list.push(service);
    grouped.set(service.customerId, list);
  }
  return customers.map((customer) => ({
    ...customer,
    history: (grouped.get(customer.id) ?? []).sort((a, b) => b.date.localeCompare(a.date)),
  }));
}

function parseStorage(raw: string | null): OilDataStore {
  if (!raw) return { customers: [], services: [] };
  try {
    const parsed = JSON.parse(raw) as Partial<OilDataStore>;
    if (!Array.isArray(parsed.customers) || !Array.isArray(parsed.services)) {
      return { customers: [], services: [] };
    }
    return {
      customers: parsed.customers as Customer[],
      services: parsed.services as Service[],
    };
  } catch {
    return { customers: [], services: [] };
  }
}

export function useOilData() {
  const [store, setStore] = useState<OilDataStore>(() => {
    if (typeof window === "undefined") return { customers: [], services: [] };
    return parseStorage(window.localStorage.getItem(OIL_STORAGE_KEY));
  });

  const customers = useMemo(
    () => hydrateCustomerHistory(store.customers, store.services),
    [store.customers, store.services],
  );

  const saveStore = (next: OilDataStore) => {
    setStore(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(OIL_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const upsertService = (payload: ServicePayload) => {
    const normalizedPhone = payload.phone.replace(/\s+/g, "").trim();
    const normalizedName = payload.name.trim().toLowerCase();

    const existingCustomer = store.customers.find(
      (customer) =>
        customer.phone.replace(/\s+/g, "").trim() === normalizedPhone ||
        customer.name.trim().toLowerCase() === normalizedName,
    );

    const customerId = existingCustomer?.id ?? uid();
    const customerRecord: Customer = {
      id: customerId,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      carType: payload.carType.trim(),
      history: [],
    };

    const newService: Service = {
      id: uid(),
      customerId,
      date: new Date().toISOString(),
      mileage: payload.mileage,
      oilType: payload.oilType,
      technician: payload.technician.trim(),
      notes: payload.notes.trim(),
    };

    const nextCustomers = existingCustomer
      ? store.customers.map((customer) => (customer.id === customerId ? customerRecord : customer))
      : [customerRecord, ...store.customers];

    const nextStore = {
      customers: nextCustomers,
      services: [newService, ...store.services],
    };

    saveStore(nextStore);
    return { customer: customerRecord, service: newService };
  };

  const searchCustomers = (query: string) => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return customers.slice(0, 8);
    return customers
      .filter(
        (customer) =>
          customer.name.toLowerCase().includes(normalized) || customer.phone.toLowerCase().includes(normalized),
      )
      .slice(0, 10);
  };

  return {
    customers,
    services: [...store.services].sort((a, b) => b.date.localeCompare(a.date)),
    upsertService,
    searchCustomers,
  };
}
