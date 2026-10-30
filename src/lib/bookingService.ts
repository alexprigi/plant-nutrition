// src/lib/bookingService.ts

import { getT } from "@/lib/email-templates/email-i18n";

// --- 1. CORE TYPES & ENUMS ---

export type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "none";

export type SubscriptionType =
  | "free-consultation"
  | "single-session"
  | "bundle-3-months"
  | "bundle-6-months";

export type AppointmentType = "free-consultation" | "first-visit" | "follow-up";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

// --- 2. ENTITIES ---

export interface AdminAppointmentView {
  // Appointment
  id: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  managementToken: string;
  rescheduleCount: number;
  createdAt: string;
  updatedAt: string;
  // Client
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  clientFiscalCode: string;
  clientCreatedAt: string;
  // Client
  clientId: string;
  // Subscription
  subscriptionId: string;
  serviceName: string;
  subscriptionType: string;
  subscriptionStatus: string;
  price: number;
  isPaid: boolean;
  paymentMethod: string;
  totalSessions: number;
  usedSessions: number;
  followUpToken: string | null;
  expiresAt: string | null;
  subscriptionCreatedAt: string;
}

// --- 3. DTO ---

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
  status: AppointmentStatus;
  durationMinutes?: number;
  existingSubscriptionId?: string;
  locale?: string;
}

// --- 4. HELPERS ---

export const getSubscriptionLabel = (type: SubscriptionType, locale?: string | null): string => {
  const t = getT(locale);
  switch (type) {
    case "free-consultation":
      return t.svcFree;
    case "single-session":
      return t.svcSingle;
    case "bundle-3-months":
      return t.svcBundle3;
    case "bundle-6-months":
      return t.svcBundle6;
    default:
      return t.svcDefault;
  }
};

export type AppointmentTypeName = "FREE_CONSULTATION" | "FIRST_VISIT" | "FOLLOW_UP";

// Nome del servizio di un singolo appuntamento. Il tipo di abbonamento da solo non basta:
// una prima visita e una visita singola sono entrambe SINGLE_SESSION.
export const getAppointmentLabel = (
  appointmentType: AppointmentTypeName,
  subscriptionType: SubscriptionType,
  locale?: string | null,
): string => {
  const t = getT(locale);
  if (appointmentType === "FREE_CONSULTATION") return t.svcFree;
  if (appointmentType === "FOLLOW_UP") return t.svcFollowUp;
  return subscriptionType === "single-session" ? t.svcFirstVisit : getSubscriptionLabel(subscriptionType, locale);
};

// --- 5. API FUNCTIONS ---

export const checkEligibility = async (
  email: string,
  signal?: AbortSignal,
): Promise<{ eligible: boolean; reason?: string }> => {
  const response = await fetch("/api/clients/check-eligibility", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    signal,
  });
  return response.json();
};

export const createFullBooking = async (dto: CreateBookingDTO) => {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    throw new Error("Failed to create booking");
  }
  return response.json();
};

export const getAdminAppointments = async (): Promise<AdminAppointmentView[]> => {
  const response = await fetch("/api/admin/appointments");
  if (!response.ok) throw new Error("Failed to fetch appointments");
  return response.json();
};

export const updateAppointmentStatus = async (
  apptId: string,
  status: AppointmentStatus,
): Promise<boolean> => {
  const response = await fetch(`/api/admin/appointments/${apptId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.ok;
};

export const markSubscriptionAsPaid = async (apptId: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/appointments/${apptId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPaid: true }),
  });
  return response.ok;
};

export const rescheduleAppointment = async (apptId: string, date: string, time: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/appointments/${apptId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reschedule: true, date, time }),
  });
  return response.ok;
};

export const resendFollowUpLink = async (apptId: string): Promise<boolean> => {
  const response = await fetch(`/api/admin/appointments/${apptId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resendFollowUp: true }),
  });
  return response.ok;
};
