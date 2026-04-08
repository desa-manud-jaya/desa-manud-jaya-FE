import { apiFetch } from "@/lib/api";

export type ApprovedPackageApiItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number | string;
  availability?: number;
  itinerary?: string[];
  included?: string[];
  termsAndConditions?: string;
  pricingPolicy?: string;
  cancellationPolicy?: string;
  requirementDocumentUrl?: string;
  photoUrl?: string;
  approvalStatus?: string;
  vendorId?: string;
  businessId?: string;
  rejectionReason?: string | null;
  moderationNote?: string | null;
  deletionRequestStatus?: string | null;
  deletionRequestReason?: string | null;
  deletionReviewNote?: string | null;
  deletionReviewerId?: string | null;
  deletionRequestedAt?: string | null;
  deletionReviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ApprovedPackagesResponse =
  | ApprovedPackageApiItem[]
  | { data?: ApprovedPackageApiItem[] };

export type PackageListItem = {
  id: string;
  title: string;
  duration: string;
  price: number;
  eco: boolean;
  image: string;
  includes: string[];
};

export type PackageDetailSection = {
  title?: string;
  items: string[];
};

export type PackageDetailItem = {
  id: string;
  title: string;
  duration: string;
  price: number;
  eco: boolean;
  image: string;
  includes: string[];
  itinerarySections: PackageDetailSection[];
  businessId: string | null;
};

const FALLBACK_PACKAGE_IMAGE = "/packages/sunrise-eco.jpg";

export function formatPackageDuration(
  duration: number | string | undefined
): string {
  if (typeof duration === "number") return `${duration} Hari`;
  if (typeof duration === "string" && duration.trim()) return duration;
  return "-";
}

export function mapApiPackageToListItem(
  pkg: ApprovedPackageApiItem
): PackageListItem {
  return {
    id: pkg.id,
    title: pkg.name,
    duration: formatPackageDuration(pkg.duration),
    price: pkg.price,
    eco: pkg.category === "ECO",
    image: pkg.photoUrl || FALLBACK_PACKAGE_IMAGE,
    includes: pkg.included ?? [],
  };
}

export function mapApiPackageToDetailItem(
  pkg: ApprovedPackageApiItem
): PackageDetailItem {
  return {
    id: pkg.id,
    title: pkg.name,
    duration: formatPackageDuration(pkg.duration),
    price: pkg.price,
    eco: pkg.category === "ECO",
    image: pkg.photoUrl || FALLBACK_PACKAGE_IMAGE,
    includes: pkg.included ?? [],
    itinerarySections: [
      {
        items: pkg.itinerary ?? [],
      },
    ],
    businessId: pkg.businessId ?? null,
  };
}
function filterVisibleApprovedPackages(items: ApprovedPackageApiItem[]) {
  return items.filter(
    (item) => item.deletionRequestStatus !== "APPROVED"
  );
}
export async function getApprovedPackages(): Promise<ApprovedPackageApiItem[]> {
  const response = await apiFetch<ApprovedPackagesResponse>(
    "/packages/approved",
    {
      cache: "no-store",
    },
  );

  let items: ApprovedPackageApiItem[] = [];

  if (Array.isArray(response)) {
    items = response;
  } else if (response && Array.isArray(response.data)) {
    items = response.data;
  }

  const filteredItems = filterVisibleApprovedPackages(items);

  console.log("PACKAGES APPROVED RAW RESPONSE:", items);
  console.log("PACKAGES APPROVED FILTERED RESPONSE:", filteredItems);

  return filteredItems;
}

export async function getApprovedPackageById(
  packageId: string
): Promise<ApprovedPackageApiItem | null> {
  try {
    const response = await apiFetch<ApprovedPackageApiItem>(`/packages/${packageId}`, {
      cache: "no-store",
    });
    return response ?? null;
  } catch {
    return null;
  }
}

export async function getPackageDetailById(
  id: string
): Promise<PackageDetailItem | null> {
  const apiPkg = await getApprovedPackageById(id);
  if (!apiPkg) return null;

  return mapApiPackageToDetailItem(apiPkg);
}

export async function getApprovedPackageList(): Promise<PackageListItem[]> {
  try {
    const apiPackages = await getApprovedPackages();
    return apiPackages.map(mapApiPackageToListItem);
  } catch {
    return [];
  }
}