import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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

const initialState: PackagesState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchApprovedPackages = createAsyncThunk(
  "packages/fetchApprovedPackages",
  async () => {
    return await getApprovedPackages();
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
        state.items = action.payload.map(mapApiPackageToCard);
      })
      .addCase(fetchApprovedPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch packages";
        state.items = [];
      });
  },
});

export default packageSlice.reducer;