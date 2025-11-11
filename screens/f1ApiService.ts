import { axiosClient } from "./axios";

export const f1ApiService = {
  // Drivers
  getDrivers: async () => {
    const { data } = await axiosClient.get("/f1api/drivers");
    return data;
  },

  // Teams
  getTeams: async () => {
    const { data } = await axiosClient.get("/f1api/teams");
    return data;
  },
};
