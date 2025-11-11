import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./driversSlice";
import teamsReducer from "./teamsSlice";

export const store = configureStore({
  reducer: {
    drivers: driversReducer,
    teams: teamsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
