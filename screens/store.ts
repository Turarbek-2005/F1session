import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./driversSlice";
import teamsReducer from "./teamsSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driversReducer,
    teams: teamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
