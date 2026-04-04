import { API_BASE_URL } from "@/lib/api-config";

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function normalizeApiErrorMessage(status: number, message: string) {
  const lowerMessage = message.toLowerCase();

  if (status === 409) {
    if (lowerMessage.includes("username")) {
      return "Username sudah terdaftar. Coba gunakan username lain.";
    }

    if (lowerMessage.includes("email")) {
      return "Email sudah terdaftar. Coba gunakan email lain.";
    }

    if (lowerMessage.includes("phone")) {
      return "Nomor telepon sudah terdaftar.";
    }

    if (lowerMessage.includes("ktp")) {
      return "Nomor KTP sudah terdaftar.";
    }

    return "Data yang kamu masukkan sudah terdaftar.";
  }

  return message;
}

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const isFormData = options?.body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options?.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const responseData = isJson
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;

    if (isJson && responseData && typeof responseData === "object") {
      errorMessage =
        (responseData as { message?: string }).message || errorMessage;
    } else if (typeof responseData === "string" && responseData.trim()) {
      errorMessage = responseData;
    }

    errorMessage = normalizeApiErrorMessage(response.status, errorMessage);

    throw new ApiError(errorMessage, response.status, responseData);
  }

  return responseData as T;
}