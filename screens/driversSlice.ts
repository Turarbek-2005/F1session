import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosClient } from "./axios";
import { Driver, DriversState } from "./types";
import type { RootState } from "./store";

const initialState: DriversState = {
  items: [],
  byId: {},
  status: "idle",
  error: null,
};

export const fetchDrivers = createAsyncThunk(
  "drivers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Trying URL:", axiosClient.defaults.baseURL + "/f1/drivers");
      const res = await axiosClient.get("/f1/drivers");
      return res.data;
    } catch (err: any) {
      console.error("FetchDrivers Error:", err);
      return rejectWithValue({ message: err.message || "Unknown error" });
    }
  }
);


const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setDrivers(state, action: PayloadAction<Driver[]>) {
      state.items = action.payload;
      state.byId = action.payload.reduce((acc, d) => {
        acc[d.id] = d;
        return acc;
      }, {} as Record<number, Driver>);
      state.status = "succeeded";
      state.error = null;
    },
    clearDrivers(state) {
      state.items = [];
      state.byId = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
        s.byId = a.payload.reduce((acc, d) => {
          acc[d.id] = d;
          return acc;
        }, {} as Record<number, Driver>);
      })
      .addCase(fetchDrivers.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as any)?.message ?? a.error.message ?? "Error";
      });
  },
});

export const { setDrivers, clearDrivers } = driversSlice.actions;
export default driversSlice.reducer;

export const selectAllDrivers = (state: RootState) => state.drivers.items;
export const selectDriverById = (state: RootState, id: number) =>
  state.drivers.byId[id];
export const selectDriversStatus = (state: RootState) => state.drivers.status;
