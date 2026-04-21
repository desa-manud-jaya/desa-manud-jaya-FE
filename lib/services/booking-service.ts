import { apiFetch } from "@/lib/api";
import type {
  CreateBookingInput,
  TravelerBooking,
  UserBookingHistoryApiResponse,
} from "@/lib/types/booking";

export const BOOKING_STORAGE_KEY = "manud-jaya-bookings";
export const TRAVELER_STORAGE_KEY = "manud-jaya-traveler-session";

export type LoggedInUser = {
  id: string;
  token: string;
  username: string;
  backendRole: string;
  name: string;
  email: string;
  role: "traveler" | "partner" | "guide" | "admin";
  roleLabel: string;
};

export type CreateBookingApiPayload = {
  businessId: string;
  packageId: string;
  tripDate: string;
  quantity: number;
};

export type CreateBookingApiResponse = {
  id?: string;
  bookingCode?: string;
  status?: string;
  message?: string;
};

export type UploadPaymentProofPayload = {
  file: File;
};

export type UploadPaymentProofResponse = {
  id?: string;
  status?: string;
  paymentProofUrl?: string | null;
  paymentUploadedAt?: string | null;
  message?: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function generateBookingId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function generateBookingCode() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);

  return `BK-${yyyy}${mm}${dd}-${random}`;
}

export function getCurrentUser(): LoggedInUser | null {
  if (!canUseStorage()) return null;

  const parsed = safeJsonParse<LoggedInUser>(
    window.localStorage.getItem(TRAVELER_STORAGE_KEY),
  );

  return parsed ?? null;
}
export async function getUserBookingHistoryApi(
  userId: string,
  token: string,
  page = 0,
  size = 10
) {
  return apiFetch<UserBookingHistoryApiResponse>(
    `/user/bookings/${userId}?page=${page}&size=${size}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
}

export function getAllBookings(): TravelerBooking[] {
  if (!canUseStorage()) return [];

  const parsed = safeJsonParse<TravelerBooking[]>(
    window.localStorage.getItem(BOOKING_STORAGE_KEY),
  );

  if (!Array.isArray(parsed)) return [];

  return parsed
    .filter((item) => item && typeof item === "object" && typeof item.id === "string")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}
export async function createBookingApi(
  payload: CreateBookingApiPayload,
  token: string
) {
  return apiFetch<CreateBookingApiResponse>("/user/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function uploadPaymentProofApi(
  bookingId: string,
  payload: UploadPaymentProofPayload,
  token: string
) {
  const formData = new FormData();
  formData.append("file", payload.file);

  return apiFetch<UploadPaymentProofResponse>(
    `/user/bookings/${bookingId}/payment-proof`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );
}

export function getBookingsByUserId(userId: string) {
  return getAllBookings().filter((booking) => booking.userId === userId);
}

export function createBooking(input: CreateBookingInput): TravelerBooking {
  if (!canUseStorage()) {
    throw new Error("Penyimpanan browser tidak tersedia.");
  }

  const booking: TravelerBooking = {
    id: generateBookingId(),
    bookingCode: generateBookingCode(),
    userId: input.userId,
    username: input.username,
    packageId: input.packageId,
    packageTitle: input.packageTitle,
    packageImage: input.packageImage,
    travelDate: input.travelDate,
    participantCount: input.participantCount,
    contactName: input.contactName,
    contactPhone: input.contactPhone,
    notes: input.notes?.trim() ?? "",
    pricePerPerson: input.pricePerPerson,
    totalPrice: input.pricePerPerson * input.participantCount,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const bookings = getAllBookings();
  const nextBookings = [booking, ...bookings];

  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(nextBookings));

  return booking;
}
