export type BookingStatus =
  | "pending"
  | "waiting_for_payment"
  | "paid_pending_review"
  | "confirmed"
  | "completed"
  | "cancelled";


  export type UserBookingHistoryApiItem = {
  id: string;
  userId: string;
  businessId: string;
  packageId: string;
  quantity: number;
  amount: number;
  status: BookingStatus;
  paymentProofUrl: string | null;
  paymentUploadedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string | null;
  business?: {
    id: string;
    name: string;
    address: string;
    approvalStatus?: string;
  } | null;
  user?: {
    id: string;
    username: string;
    email: string;
    role?: string;
    status?: string;
  } | null;
};

export type UserBookingHistoryApiResponse = {
  items: UserBookingHistoryApiItem[];
  page: number;
  size: number;
  total: number;
};

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
