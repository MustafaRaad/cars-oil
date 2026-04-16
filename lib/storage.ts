"use client";

export type Service = {
  id: string;
  date: string;
  mileage: number;
  oilType: string;
  technician: string;
  notes?: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  carType?: string;
  history: Service[];
};

export type AddVisitInput = {
  name: string;
  phone: string;
  carType?: string;
  mileage: number;
  oilType: string;
  technician: string;
  notes?: string;
};

const STORAGE_KEY = "customers";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getCustomers(): Customer[] {
  if (!canUseStorage()) return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Customer[]) : [];
  } catch {
    return [];
  }
}

function persistCustomers(customers: Customer[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((customer) => customer.id === id);
}

export function createCustomer(input: Omit<Customer, "id" | "history">): Customer {
  const customers = getCustomers();

  const normalizedPhone = input.phone.trim();
  const duplicate = customers.some((customer) => customer.phone.trim() === normalizedPhone);
  if (duplicate) {
    throw new Error("Phone number already exists.");
  }

  const newCustomer: Customer = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    phone: normalizedPhone,
    carType: input.carType?.trim() || "",
    history: [],
  };

  persistCustomers([newCustomer, ...customers]);
  return newCustomer;
}

export function updateCustomer(
  id: string,
  updates: Pick<Customer, "name" | "phone" | "carType">
): Customer {
  const customers = getCustomers();
  const index = customers.findIndex((customer) => customer.id === id);

  if (index < 0) {
    throw new Error("Customer not found.");
  }

  const normalizedPhone = updates.phone.trim();
  const duplicate = customers.some(
    (customer) => customer.id !== id && customer.phone.trim() === normalizedPhone
  );

  if (duplicate) {
    throw new Error("Phone number already exists.");
  }

  const current = customers[index];
  const updated: Customer = {
    ...current,
    name: updates.name.trim(),
    phone: normalizedPhone,
    carType: updates.carType?.trim() || "",
  };

  customers[index] = updated;
  persistCustomers(customers);
  return updated;
}

export function addVisit(input: AddVisitInput): Customer {
  const customers = getCustomers();

  const normalizedPhone = input.phone.trim();
  const normalizedName = input.name.trim();
  const normalizedCarType = input.carType?.trim() || "";

  const service: Service = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mileage: input.mileage,
    oilType: input.oilType.trim(),
    technician: input.technician.trim(),
    notes: input.notes?.trim() || "",
  };

  const existingIndex = customers.findIndex((customer) => customer.phone.trim() === normalizedPhone);

  if (existingIndex >= 0) {
    const existing = customers[existingIndex];
    const updated: Customer = {
      ...existing,
      name: normalizedName || existing.name,
      carType: normalizedCarType || existing.carType || "",
      history: [...existing.history, service],
    };
    customers[existingIndex] = updated;
    persistCustomers(customers);
    return updated;
  }

  const newCustomer: Customer = {
    id: crypto.randomUUID(),
    name: normalizedName,
    phone: normalizedPhone,
    carType: normalizedCarType,
    history: [service],
  };

  persistCustomers([newCustomer, ...customers]);
  return newCustomer;
}
