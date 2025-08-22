import { api } from "./api";

export const searchFlights = async (params: Record<string, string>) => {
  try {
    const response = await api.get("/flights/searchFlights", { params });
    return response.data;
  } catch (err) {
    console.error("Error fetching flights:", err);
    throw err;
  }
};
