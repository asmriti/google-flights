import { api } from "./api";

export const searchFlights = async () => {
  try {
    const response = await api.get("/flights/searchFlights");
    return response.data;
  } catch (err) {
    console.error("Error fetching flights:", err);
    throw err;
  }
};
