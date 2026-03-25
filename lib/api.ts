import { API_BASE_URL } from "@/lib/api-config";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
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

    throw new Error(errorMessage);
  }

  return responseData as T;
}