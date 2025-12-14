import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { f1ApiService } from "./f1ApiService";
import type { RootState } from "./store";

type ResultsState = {
  racesYear: any | null;
  sessionData: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  sessionStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ResultsState = {
  racesYear: null,
  sessionData: null,
  status: "idle",
  sessionStatus: "idle",
  error: null,
};

export const fetchRacesYear = createAsyncThunk(
  "results/fetchRacesYear",
  async (year: string, { rejectWithValue }) => {
    try {
      const data = await f1ApiService.getRacesYear(year);
      return data;
    } catch (err: any) {
      return rejectWithValue({ message: err.message ?? "Error" });
    }
  }
);

export const fetchYearRoundSession = createAsyncThunk(
  "results/fetchYearRoundSession",
  async (
    args: { year: string; round: string; session: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await f1ApiService.getYearRoundSession(
        args.year,
        args.round,
        args.session
      );
      return data;
    } catch (err: any) {
      return rejectWithValue({ message: err.message ?? "Error" });
    }
  }
);

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    clearSession(state) {
      state.sessionData = null;
      state.sessionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRacesYear.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(fetchRacesYear.fulfilled, (s, a: PayloadAction<any>) => {
        s.status = "succeeded";
        s.racesYear = a.payload;
      })
      .addCase(fetchRacesYear.rejected, (s, a) => {
        s.status = "failed";
        s.error = (a.payload as any)?.message ?? a.error.message ?? "Error";
      })
      .addCase(fetchYearRoundSession.pending, (s) => {
        s.sessionStatus = "loading";
        s.error = null;
      })
      .addCase(fetchYearRoundSession.fulfilled, (s, a: PayloadAction<any>) => {
        s.sessionStatus = "succeeded";
        s.sessionData = a.payload;
      })
      .addCase(fetchYearRoundSession.rejected, (s, a) => {
        s.sessionStatus = "failed";
        s.error = (a.payload as any)?.message ?? a.error.message ?? "Error";
      });
  },
});

export const { clearSession } = resultsSlice.actions;
export default resultsSlice.reducer;

export const selectRacesYear = (state: RootState) => state.results.racesYear;
export const selectSessionData = (state: RootState) => state.results.sessionData;
export const selectResultsStatus = (state: RootState) => state.results.status;
export const selectResultsSessionStatus = (state: RootState) => state.results.sessionStatus;
