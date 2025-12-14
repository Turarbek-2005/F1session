import { configureStore } from "@reduxjs/toolkit";
import driversReducer from "./driversSlice";
import teamsReducer from "./teamsSlice";
import authReducer from "./authSlice";
import resultsReducer from "./resultsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    drivers: driversReducer,
    teams: teamsReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
