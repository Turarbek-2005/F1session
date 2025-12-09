export interface UserInfo {
  id: number;
  email: string;
  username: string;
  favoriteDriverId?: string | null;
  favoriteTeamId?: string | null;
  // new array-based favorites (backend returns these)
  favoriteDriversIds?: string[];
  favoriteTeamsIds?: string[];
}

export interface AuthState {
  token: string | null;
  user: UserInfo | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
