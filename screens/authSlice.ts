import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, UserInfo } from "../types/auth.types";
import { axiosClient } from "./axios";

const LOCAL_TOKEN_KEY = "f1kz_token";

async function saveToken(token: string | null) {
  try {
    if (token) {
      await AsyncStorage.setItem(LOCAL_TOKEN_KEY, token);
    } else {
      await AsyncStorage.removeItem(LOCAL_TOKEN_KEY);
    }
  } catch (e) {
    console.error("Failed to save token to storage", e);
  }
}

async function loadToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LOCAL_TOKEN_KEY);
  } catch (e) {
    console.error("Failed to load token from storage", e);
    return null;
  }
}

function extractAxiosErrorMessage(error: any) {
  if (!error) return "Unknown error";
  if (error.response?.data) {
    const d = error.response.data;
    if (typeof d === "string") return d;
    return d.message || d.error || JSON.stringify(d);
  }
  return error.message || String(error);
}

export const loadTokenFromStorage = createAsyncThunk(
  "auth/loadTokenFromStorage",
  async (_, { dispatch }) => {
    const token = await loadToken();
    if (token) {
      dispatch(fetchMe());
    }
    return token;
  }
);

export const registerUser = createAsyncThunk<
  { user: UserInfo },
  { username: string; email: string; password: string, favoriteDriverId?: string; favoriteTeamId?: string },
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/auth/register", payload);
    const data = res.data;
    return { user: data as UserInfo };
  } catch (err: any) {
    const msg = extractAxiosErrorMessage(err);
    return rejectWithValue(msg);
  }
});

export const loginUser = createAsyncThunk<
  { token: string; user: UserInfo },
  { usernameOrEmail: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/auth/login", payload);
    const data = res.data;

    const token = data?.token as string | undefined;
    const user = data?.user as UserInfo | undefined;

    if (!token || !user) {
      return rejectWithValue("Invalid server response: missing token or user");
    }

    await saveToken(token);
    return { token, user };
  } catch (err: any) {
    const msg = extractAxiosErrorMessage(err);
    return rejectWithValue(msg);
  }
});

export const fetchMe = createAsyncThunk<
  { user: UserInfo },
  void,
  { state: { auth: AuthState }; rejectValue: string }
>("auth/fetchMe", async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token ?? await loadToken();
    if (!token) return rejectWithValue("No token");

    const res = await axiosClient.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data;
    return { user: data as UserInfo };
  } catch (err: any) {
    const msg = extractAxiosErrorMessage(err);
    if (err?.response?.status === 401) await saveToken(null);
    return rejectWithValue(msg);
  }
});

const initialState: AuthState = {
  token: null,
  user: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ token: string | null; user: UserInfo | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      saveToken(action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      saveToken(null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTokenFromStorage.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    
    builder.addCase(registerUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? action.error.message ?? "Register failed";
    });

    builder.addCase(loginUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? action.error.message ?? "Login failed";
    });

    builder.addCase(fetchMe.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(fetchMe.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload ?? action.error.message ?? "Fetch user failed";
      if (action.payload && action.payload.toLowerCase().includes("unauthorized")) {
        state.token = null;
        state.user = null;
        saveToken(null);
      }
    });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
