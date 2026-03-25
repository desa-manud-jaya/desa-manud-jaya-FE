import type { JenisUsahaApi } from "@/lib/services/auth-service";

export function mapBusinessTypeToApi(value: string): JenisUsahaApi {
  switch (value) {
    case "Accommodation (Homestay / Lodge)":
      return "AKOMODASI";
    case "Tourist Attraction":
      return "TOURIST_ATTRACTION";
    case "Food & Beverage / Culinary":
      return "CULINARY";
    case "Local Experience / Workshop":
      return "WORKSHOP";
    case "Local Product / Souvenir - UMKM":
      return "SOUVENIR";
    default:
      return "AKOMODASI";
  }
}

