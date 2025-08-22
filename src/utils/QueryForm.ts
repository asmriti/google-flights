// utils/queryForm.ts

import type { SearchForm } from "../components/FlightSearchForm";

// Serialize form to query params
export const serializeForm = (form: SearchForm): Record<string, string> => ({
  tripType: form.tripType,
  originAirport: form.originAirport?.value || "",
  originLabel: form.originAirport?.label || "",
  destinationAirport: form.destinationAirport?.value || "",
  destinationLabel: form.destinationAirport?.label || "",
  departureDate: form.departureDate?.toISOString() || "",
  returnDate: form.returnDate?.toISOString() || "",
  adults: form.passengers.adults.toString(),
  children: form.passengers.children.toString(),
  infantsInSeat: form.passengers.infantsInSeat.toString(),
  infantsOnLap: form.passengers.infantsOnLap.toString(),
  selectedClass: form.selectedClass.value,
  selectedClassLabel: form.selectedClass.label,
});

export const deserializeForm = (params: URLSearchParams): SearchForm => {
  const classOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  return {
    tripType: (params.get("tripType") as any) || "roundtrip",
    originAirport: params.get("originAirport")
      ? {
          value: params.get("originAirport")!,
          label: params.get("originLabel")!,
        }
      : null,
    destinationAirport: params.get("destinationAirport")
      ? {
          value: params.get("destinationAirport")!,
          label: params.get("destinationLabel")!,
        }
      : null,
    departureDate: params.get("departureDate")
      ? new Date(params.get("departureDate")!)
      : new Date(), // default to today
    returnDate: params.get("returnDate")
      ? new Date(params.get("returnDate")!)
      : null,
    passengers: {
      adults: Number(params.get("adults") || 1),
      children: Number(params.get("children") || 0),
      infantsInSeat: Number(params.get("infantsInSeat") || 0),
      infantsOnLap: Number(params.get("infantsOnLap") || 0),
    },
    selectedClass: params.get("selectedClass")
      ? {
          value: params.get("selectedClass")!,
          label: params.get("selectedClassLabel")!,
        }
      : classOptions[0], // default to Economy
  };
};
