import { apiFetch } from "@/lib/api";
import { packages as mockPackages } from "@/lib/data";

type MockPackageItem = {
  id: string;
  title: string;
  duration: string;
  price: number;
  eco: boolean;
  itinerary: string[];
  itinerary2?: string[];
  itinerary3?: string[];
  includes: string[];
  image: string;
};

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
  | {
      data?: ApprovedPackageApiItem[];
    };

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
};

const FALLBACK_PACKAGE_IMAGE = "/packages/sunrise-eco.jpg";

function getMockSource(): MockPackageItem[] {
  return mockPackages as MockPackageItem[];
}

export function formatPackageDuration(
  duration: number | string | undefined,
): string {
  if (typeof duration === "number") {
    return `${duration} Hari`;
  }

  if (typeof duration === "string" && duration.trim()) {
    return duration;
  }

  return "-";
}

export function mapMockPackageToListItem(
  pkg: MockPackageItem,
): PackageListItem {
  return {
    id: pkg.id,
    title: pkg.title,
    duration: pkg.duration,
    price: pkg.price,
    eco: pkg.eco,
    image: pkg.image,
    includes: pkg.includes,
  };
}

export function mapApiPackageToListItem(
  pkg: ApprovedPackageApiItem,
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

function buildMockItinerarySections(
  pkg: MockPackageItem,
): PackageDetailSection[] {
  const sections: PackageDetailSection[] = [];

  const hasMultipleDays = Boolean(pkg.itinerary2 || pkg.itinerary3);

  if (pkg.itinerary?.length) {
    sections.push({
      title: hasMultipleDays ? "Hari 1" : undefined,
      items: pkg.itinerary,
    });
  }

  if (pkg.itinerary2?.length) {
    sections.push({
      title: "Hari 2",
      items: pkg.itinerary2,
    });
  }

  if (pkg.itinerary3?.length) {
    sections.push({
      title: "Hari 3",
      items: pkg.itinerary3,
    });
  }

  return sections;
}

export function mapMockPackageToDetailItem(
  pkg: MockPackageItem,
): PackageDetailItem {
  return {
    id: pkg.id,
    title: pkg.title,
    duration: pkg.duration,
    price: pkg.price,
    eco: pkg.eco,
    image: pkg.image,
    includes: pkg.includes,
    itinerarySections: buildMockItinerarySections(pkg),
  };
}

export function mapApiPackageToDetailItem(
  pkg: ApprovedPackageApiItem,
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
  };
}

export function getMockPackageById(id: string): MockPackageItem | null {
  return getMockSource().find((pkg) => pkg.id === id) ?? null;
}

export async function getApprovedPackages(): Promise<ApprovedPackageApiItem[]> {
  const response = await apiFetch<ApprovedPackagesResponse>(
    "/packages/approved",
    {
      cache: "no-store",
    },
  );

  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

export async function getApprovedPackageById(
  packageId: string,
): Promise<ApprovedPackageApiItem | null> {
  try {
    const response = await apiFetch<ApprovedPackageApiItem>(
      `/packages/${packageId}`,
      {
        cache: "no-store",
      },
    );

    return response ?? null;
  } catch {
    return null;
  }
}

export async function getPackageDetailById(
  id: string,
): Promise<PackageDetailItem | null> {
  const mockPkg = getMockPackageById(id);
  if (mockPkg) {
    return mapMockPackageToDetailItem(mockPkg);
  }

  const apiPkg = await getApprovedPackageById(id);
  if (apiPkg) {
    return mapApiPackageToDetailItem(apiPkg);
  }

  return null;
}

function dedupePackages(items: PackageListItem[]): PackageListItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

export async function getMergedPackageList(): Promise<PackageListItem[]> {
  const mockItems = getMockSource().map(mapMockPackageToListItem);

  try {
    const apiPackages = await getApprovedPackages();
    const apiItems = apiPackages.map(mapApiPackageToListItem);

    return dedupePackages([...mockItems, ...apiItems]);
  } catch {
    return mockItems;
  }
}
