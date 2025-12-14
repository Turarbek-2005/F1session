import { axiosClient } from "./axios";

export const f1ApiService = {
  // Drivers
  getDrivers: async () => {
    const { data } = await axiosClient.get("/f1api/drivers");
    return data;
  },

  getDriverDetails: async (driverId: string) => {
    const { data } = await axiosClient.get(`/f1api/drivers/${driverId}`);
    return data;
  },

  // Teams
  getTeams: async () => {
    const { data } = await axiosClient.get("/f1api/teams");
    return data;
  },

  getTeamDetails: async (teamId: string) => {
    const { data } = await axiosClient.get(`/f1api/teams/${teamId}`);
    return data;
  },

  getStandingsDrivers: async () => {
    const { data } = await axiosClient.get(`/f1api/standings/drivers`);
    return data;
  },

  getStandingsTeams: async () => {
    const { data } = await axiosClient.get(`/f1api/standings/teams`);
    return data;
  },

  getRacesYear: async (year: string | number) => {
    const { data } = await axiosClient.get(`/f1api/races/${year}`);
    return data;
  },

  getRaces: async () => {
    const { data } = await axiosClient.get(`/f1api/races`);
    return data;
  },

  getRacesLast: async () => {
    const { data } = await axiosClient.get(`/f1api/races/last`);
    return data;
  },

  getRacesNext: async () => {
    try {
      const { data } = await axiosClient.get(`/f1api/races/next`);
      return data;
    } catch (err: any) {
      // Season finished or server has no info about next races; return null instead of throwing
      return null;
    }
  },

  // Generic session results for a year/round/session (session examples: fp1, fp2, fp3, qualy, race, sprint/qualy, sprint/race)
  getYearRoundSession: async (year: string | number, round: string | number, session: string) => {
    // map some frontend session names to API paths
    const mapSession = (s: string) => {
      if (s === "sprintQualyfying" || s === "sprintQualifying" || s === "sprintQualy") return "sprint/qualy";
      if (s === "sprintRace") return "sprint/race";
      if (s === "qualyfying" || s === "qualifying") return "qualy";
      return s;
    };
    const path = mapSession(session);
    const { data } = await axiosClient.get(`/f1api/${year}/${round}/${path}`);
    return data;
  },
};
