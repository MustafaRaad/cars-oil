export type Service = {
  id: string;
  customerId: string;
  date: string;
  mileage: number;
  oilType: string;
  technician: string;
  notes: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  carType: string;
  history: Service[];
};

export type ServicePayload = {
  name: string;
  phone: string;
  carType: string;
  mileage: number;
  oilType: string;
  technician: string;
  notes: string;
};

export type OilDataStore = {
  customers: Customer[];
  services: Service[];
};

export const OIL_TYPES = [
  "10W-30 Synthetic",
  "5W-30 Full Synthetic",
  "20W-50 Mineral",
  "0W-20 Full Synthetic",
  "15W-40 Diesel",
];

export const OIL_STORAGE_KEY = "al-asad-oil-change-data";
