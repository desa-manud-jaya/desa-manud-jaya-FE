import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { packages as mockPackages } from "@/lib/data";
import {
  getApprovedPackages,
  type ApprovedPackageApiItem,
} from "@/lib/services/package-service";

export type PackageCardItem = {
  id: string;
  title: string;
  duration: string;
  price: number;
  eco: boolean;
  includes: string[];
  image: string;
};

type PackagesState = {
  items: PackageCardItem[];
  loading: boolean;
  error: string | null;
};

function formatPackageDuration(duration: number | string | undefined): string {
  if (typeof duration === "number") {
    return `${duration} Hari`;
  }

  if (typeof duration === "string" && duration.trim()) {
    return duration;
  }

  return "-";
}

function mapMockPackages(): PackageCardItem[] {
  return mockPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    duration: pkg.duration,
    price: pkg.price,
    eco: pkg.eco,
    includes: pkg.includes,
    image: pkg.image,
  }));
}

function mapApiPackageToCard(pkg: ApprovedPackageApiItem): PackageCardItem {
  return {
    id: pkg.id,
    title: pkg.name,
    duration: formatPackageDuration(pkg.duration),
    price: pkg.price,
    eco: pkg.category === "ECO",
    includes: pkg.included ?? [],
    image: pkg.photoUrl || "/packages/sunrise-eco.jpg",
  };
}

function mergePackages(
  mockItems: PackageCardItem[],
  apiItems: PackageCardItem[]
): PackageCardItem[] {
  const merged = [...mockItems, ...apiItems];
  const seen = new Set<string>();

  return merged.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }

    seen.add(item.id);
    return true;
  });
}

const initialMockItems = mapMockPackages();

const initialState: PackagesState = {
  items: initialMockItems,
  loading: false,
  error: null,
};

export const fetchApprovedPackages = createAsyncThunk(
  "packages/fetchApprovedPackages",
  async () => {
    const response = await getApprovedPackages();
    return response;
  }
);

const packageSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovedPackages.fulfilled, (state, action) => {
        state.loading = false;

        const apiItems = action.payload.map(mapApiPackageToCard);

        state.items =
          apiItems.length > 0
            ? mergePackages(initialMockItems, apiItems)
            : initialMockItems;
      })
      .addCase(fetchApprovedPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch packages";
        state.items = initialMockItems;
      });
  },
});

export default packageSlice.reducer;