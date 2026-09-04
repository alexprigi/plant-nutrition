// src/lib/bookingService.ts

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
