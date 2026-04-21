import { apiFetch } from "@/lib/api";

export type RegisterTravelerPayload = {
  username: string;
  email: string;
  password: string;
};

export type LoginApiResponse = {
  id: string;
  token: string;
  username: string;
  role: string;
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

export type RegisterGuidePayload = {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  licenseNumber: string;
  cv: File;
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

export async function registerGuide(payload: RegisterGuidePayload) {
  const formData = new FormData();
  const data = {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    fullName: payload.fullName,
    phone: payload.phone,
    licenseNumber: payload.licenseNumber,
  };

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" }),
  );
  formData.append("cv", payload.cv);

  return apiFetch<AuthApiResponse>("/auth/register/guide", {
    method: "POST",
    body: formData,
  });
}

export async function login(payload: {
  username: string;
  password: string;
}) {
  return apiFetch<LoginApiResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
