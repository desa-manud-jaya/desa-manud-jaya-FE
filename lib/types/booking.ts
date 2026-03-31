export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type TravelerBooking = {
  id: string;
  bookingCode: string;
  userId: string;
  username: string;
  packageId: string;
  packageTitle: string;
  packageImage: string;
  travelDate: string;
  participantCount: number;
  contactName: string;
  contactPhone: string;
  notes: string;
  pricePerPerson: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = {
  userId: string;
  username: string;
  packageId: string;
  packageTitle: string;
  packageImage: string;
  travelDate: string;
  participantCount: number;
  contactName: string;
  contactPhone: string;
  notes?: string;
  pricePerPerson: number;
};
