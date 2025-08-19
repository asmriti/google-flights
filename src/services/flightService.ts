import { api } from "./api";

export const searchAirports = async () => {
  try {
    const response = await api.get("/flights/searchAirport");
    return response.data;
  } catch (err) {
    console.error("Error fetching airports:", err);
    throw err;
  }
};
