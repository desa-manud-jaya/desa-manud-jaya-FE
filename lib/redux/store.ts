import { configureStore } from "@reduxjs/toolkit";
import packageReducer from "@/lib/redux/features/packages/package-slice";

export const store = configureStore({
  reducer: {
    packages: packageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;