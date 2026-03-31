import type { CreateBookingInput, TravelerBooking } from "@/lib/types/booking";

export const BOOKING_STORAGE_KEY = "manud-jaya-bookings";
export const TRAVELER_STORAGE_KEY = "manud-jaya-traveler-session";

export type LoggedInUser = {
  id: string;
  token: string;
  username: string;
  backendRole: string;
  name: string;
  email: string;
  role: "traveler" | "partner" | "admin";
  roleLabel: string;
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
