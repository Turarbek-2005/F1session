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
};
