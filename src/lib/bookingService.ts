// src/lib/bookingService.ts

import { COUNTRIES, COUNTRY_PREFIXES } from "./constants";

// --- 1. CORE TYPES & ENUMS ---

export type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "none";

export type SubscriptionType =
  | "free-consultation"
  | "single-session"
  | "bundle-3-months"
  | "bundle-6-months";

export type AppointmentType = "free-consultation" | "first-visit" | "follow-up";

// NOME CORRETTO: AppointmentStatus
export type AppointmentStatus =
  | "pending" // In attesa di conferma
  | "confirmed" // Confermato a calendario
  | "cancelled" // Cancellato
  | "completed"; // Eseguito

// --- 2. DATABASE ENTITIES ---

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface Client extends BaseEntity {
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  civicNumber: string;
  city: string;
  zipCode: string;
  country: string;
  fiscalCode: string;
  role: "guest" | "registered";
}

export interface Subscription extends BaseEntity {
  clientId: string;
  type: SubscriptionType;
  price: number;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  totalSessions: number;
  usedSessions: number;
  status: "active" | "exhausted" | "cancelled";
}

export interface Appointment extends BaseEntity {
  subscriptionId: string;
  clientId: string;
  type: AppointmentType;
  date: string;
  time: string;
  status: AppointmentStatus; // Usa AppointmentStatus
  notes: string;
}

export interface User extends BaseEntity {
  username: string;
  password: string;
  name: string;
  role: "admin";
}

export interface AdminAppointmentView {
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus; // Usa AppointmentStatus
  notes: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  isPaid: boolean;
  paymentMethod: string;
}

// --- 3. STORAGE KEYS ---
const KEY_CLIENTS = "plant-nutrition-clients";
const KEY_SUBSCRIPTIONS = "plant-nutrition-subs";
const KEY_APPOINTMENTS = "plant-nutrition-appts";
const KEY_USERS = "plant-nutrition-users";

// --- 4. HELPERS ---
const getLs = <T>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : [];
};

const setLs = <T>(key: string, data: T[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

const now = () => new Date().toISOString();

const initializeData = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(KEY_USERS)) {
    const admin: User = {
      id: "admin_1",
      createdAt: now(),
      updatedAt: now(),
      isDeleted: false,
      username: "arianna",
      password: "arianna2025",
      name: "Arianna Ciervo",
      role: "admin",
    };
    setLs(KEY_USERS, [admin]);
  }
};

export const getSubscriptionLabel = (type: SubscriptionType): string => {
  switch (type) {
    case "free-consultation":
      return "Colloquio Gratuito";
    case "single-session":
      return "Visita Singola";
    case "bundle-3-months":
      return "Percorso Nutrizionale 3 Mesi";
    case "bundle-6-months":
      return "Percorso Nutrizionale 6 Mesi VIP";
    default:
      return "Servizio";
  }
};

// --- 5. CREATE FULL BOOKING ---

export interface CreateBookingDTO {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  civicNumber: string;
  city: string;
  zipCode: string;
  country: string;
  fiscalCode: string;
  commercialType:
    | "free-consultation"
    | "follow-up"
    | "first-visit"
    | "plan-3-months"
    | "plan-6-months";
  paymentMethod: PaymentMethod;
  selectedDate: string;
  selectedTime: string;
  notes: string;
  isPaid: boolean;
  status: AppointmentStatus; // Usa AppointmentStatus
}

export const createFullBooking = (dto: CreateBookingDTO) => {
  initializeData();
  const clients = getLs<Client>(KEY_CLIENTS);
  const subs = getLs<Subscription>(KEY_SUBSCRIPTIONS);
  const appts = getLs<Appointment>(KEY_APPOINTMENTS);

  // A. CLIENT
  let client = clients.find(
    (c) => c.email.toLowerCase() === dto.email.toLowerCase() && !c.isDeleted,
  );
  if (client) {
    client.name = dto.name;
    client.surname = dto.surname;
    client.phone = dto.phone;
    client.address = dto.address;
    client.civicNumber = dto.civicNumber;
    client.city = dto.city;
    client.zipCode = dto.zipCode;
    client.country = dto.country;
    client.fiscalCode = dto.fiscalCode;
    client.updatedAt = now();
  } else {
    client = {
      id: `cli_${Date.now()}`,
      createdAt: now(),
      updatedAt: now(),
      isDeleted: false,
      email: dto.email,
      role: "guest",
      name: dto.name,
      surname: dto.surname,
      phone: dto.phone,
      address: dto.address,
      civicNumber: dto.civicNumber,
      city: dto.city,
      zipCode: dto.zipCode,
      country: dto.country,
      fiscalCode: dto.fiscalCode,
    };
    clients.push(client);
  }

  // B. SUBSCRIPTION
  let subType: SubscriptionType = "single-session";
  let apptType: AppointmentType = "first-visit";
  let totalSessions = 1;
  let price = 0;

  switch (dto.commercialType) {
    case "free-consultation":
      subType = "free-consultation";
      apptType = "free-consultation";
      price = 0;
      break;
    case "follow-up":
      subType = "single-session";
      apptType = "follow-up";
      price = 50;
      break;
    case "first-visit":
      subType = "single-session";
      apptType = "first-visit";
      price = 85;
      break;
    case "plan-3-months":
      subType = "bundle-3-months";
      apptType = "first-visit";
      price = 237;
      totalSessions = 3;
      break;
    case "plan-6-months":
      subType = "bundle-6-months";
      apptType = "first-visit";
      price = 450;
      totalSessions = 6;
      break;
  }

  const newSub: Subscription = {
    id: `sub_${Date.now()}`,
    createdAt: now(),
    updatedAt: now(),
    isDeleted: false,
    clientId: client.id,
    type: subType,
    price: price,
    isPaid: dto.isPaid,
    paymentMethod: dto.paymentMethod,
    totalSessions: totalSessions,
    usedSessions: 1,
    status: "active",
  };
  subs.push(newSub);

  // C. APPOINTMENT
  const newAppt: Appointment = {
    id: `appt_${Date.now()}`,
    createdAt: now(),
    updatedAt: now(),
    isDeleted: false,
    subscriptionId: newSub.id,
    clientId: client.id,
    type: apptType,
    date: dto.selectedDate,
    time: dto.selectedTime,
    status: dto.status,
    notes: dto.notes,
  };
  appts.push(newAppt);

  setLs(KEY_CLIENTS, clients);
  setLs(KEY_SUBSCRIPTIONS, subs);
  setLs(KEY_APPOINTMENTS, appts);

  return { client, newSub, newAppt };
};

// --- 6. READ OPERATIONS ---

export const checkEligibility = (
  email: string,
): { eligible: boolean; reason?: string } => {
  const clients = getLs<Client>(KEY_CLIENTS);
  const exists = clients.some(
    (c) => c.email.toLowerCase() === email.toLowerCase() && !c.isDeleted,
  );
  if (exists) return { eligible: false, reason: "already_customer" };
  return { eligible: true };
};

export const authenticateUser = (u: string, p: string): User | null => {
  initializeData();
  const users = getLs<User>(KEY_USERS);
  return (
    users.find(
      (user) => user.username === u && user.password === p && !user.isDeleted,
    ) || null
  );
};

export const getAdminAppointments = (): AdminAppointmentView[] => {
  initializeData();
  const appts = getLs<Appointment>(KEY_APPOINTMENTS);
  const subs = getLs<Subscription>(KEY_SUBSCRIPTIONS);
  const clients = getLs<Client>(KEY_CLIENTS);

  return appts
    .filter((a) => !a.isDeleted)
    .map((appt) => {
      const sub = subs.find((s) => s.id === appt.subscriptionId);
      const client = clients.find((c) => c.id === appt.clientId);
      return {
        id: appt.id,
        date: appt.date,
        time: appt.time,
        status: appt.status,
        notes: appt.notes,
        clientName: client ? `${client.name} ${client.surname}` : "?",
        clientEmail: client?.email || "-",
        clientPhone: client?.phone || "-",
        serviceName: sub ? getSubscriptionLabel(sub.type) : "?",
        price: sub?.price || 0,
        isPaid: sub?.isPaid || false,
        paymentMethod: sub?.paymentMethod || "none",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const updateAppointmentStatus = (
  apptId: string,
  status: AppointmentStatus,
): boolean => {
  const appts = getLs<Appointment>(KEY_APPOINTMENTS);
  const idx = appts.findIndex((a) => a.id === apptId);
  if (idx === -1) return false;
  appts[idx].status = status;
  appts[idx].updatedAt = now();
  setLs(KEY_APPOINTMENTS, appts);
  return true;
};

export const markSubscriptionAsPaid = (apptId: string): boolean => {
  const appts = getLs<Appointment>(KEY_APPOINTMENTS);
  const appt = appts.find((a) => a.id === apptId);
  if (!appt) return false;
  const subs = getLs<Subscription>(KEY_SUBSCRIPTIONS);
  const subIdx = subs.findIndex((s) => s.id === appt.subscriptionId);
  if (subIdx === -1) return false;
  subs[subIdx].isPaid = true;
  subs[subIdx].updatedAt = now();
  if (appts.find((a) => a.id === apptId)?.status === "pending") {
    updateAppointmentStatus(apptId, "confirmed");
  }
  setLs(KEY_SUBSCRIPTIONS, subs);
  return true;
};
