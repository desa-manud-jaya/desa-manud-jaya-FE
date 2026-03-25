import { apiFetch } from "@/lib/api";

export type RegisterTravelerPayload = {
  username: string;
  email: string;
  password: string;
};

export type JenisUsahaApi =
  | "AKOMODASI"
  | "TOURIST_ATTRACTION"
  | "CULINARY"
  | "WORKSHOP"
  | "SOUVENIR";


export type RegisterPartnerPayload = {
  username: string;
  email: string;
  password: string;
  jenisUsaha: JenisUsahaApi;
  namaUsaha: string;
  namaOwner: string;
  description: string;
  ktpNumber: string;
  phone: string;
  address: string;
};

export type AuthApiResponse<T = unknown> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export async function registerTraveler(payload: RegisterTravelerPayload) {
  return apiFetch<AuthApiResponse>("/auth/register/user", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerPartner(payload: RegisterPartnerPayload) {
  return apiFetch<AuthApiResponse>("/auth/register/vendor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  return apiFetch<AuthApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}