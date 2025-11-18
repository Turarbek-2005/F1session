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
};
