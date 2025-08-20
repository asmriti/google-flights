import type {
  Flight,
  FlightFilters,
  SortOption,
  SortOrder,
} from "../types/Flight";

export function filterFlights(
  flights: Flight[],
  filters: FlightFilters
): Flight[] {
  return flights.filter((flight) => {
    const outboundLeg = flight.legs[0];
    const departureHour = new Date(outboundLeg.departure).getHours();

    // Price filter
    if (
      flight.price.raw < filters.priceRange[0] ||
      flight.price.raw > filters.priceRange[1]
    ) {
      return false;
    }

    // Stops filter
    if (
      filters.stops.length > 0 &&
      !filters.stops.includes(outboundLeg.stopCount)
    ) {
      return false;
    }

    // Airlines filter
    const airlineName = outboundLeg.carriers.marketing[0]?.name;
    if (
      filters.airlines.length > 0 &&
      !filters.airlines.includes(airlineName)
    ) {
      return false;
    }

    //Departure time filter
    if (filters.departureTime.length > 0) {
      let matchesTimeSlot = false;

      for (const slot of filters.departureTime) {
        switch (slot) {
          case "morning": // 6 AM - 12 PM
            if (departureHour >= 6 && departureHour < 12)
              matchesTimeSlot = true;
            break;
          case "afternoon": // 12 PM - 6 PM
            if (departureHour >= 12 && departureHour < 18)
              matchesTimeSlot = true;
            break;
          case "evening": // 6 PM - 12 AM
            if (departureHour >= 18 && departureHour < 24)
              matchesTimeSlot = true;
            break;
          case "night": // 12 AM - 6 AM
            if (departureHour >= 0 && departureHour < 6) matchesTimeSlot = true;
            break;
        }
      }

      if (!matchesTimeSlot) return false;
    }

    return true;
  });
}

export function sortFlights(
  flights: Flight[],
  sortBy: SortOption,
  order: SortOrder = "asc"
): Flight[] {
  return [...flights].sort((a, b) => {
    let valueA: number | string = 0;
    let valueB: number | string = 0;

    switch (sortBy) {
      case "price":
        valueA = a.price.raw;
        valueB = b.price.raw;
        break;

      case "duration":
        valueA = a.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
        valueB = b.legs.reduce((sum, leg) => sum + leg.durationInMinutes, 0);
        break;

      case "departure":
        valueA = new Date(a.legs[0].departure).getTime();
        valueB = new Date(b.legs[0].departure).getTime();
        break;

      case "arrival":
        const lastLegA = a.legs[a.legs.length - 1];
        const lastLegB = b.legs[b.legs.length - 1];
        valueA = new Date(lastLegA.arrival).getTime();
        valueB = new Date(lastLegB.arrival).getTime();
        break;
    }

    if (order === "asc") {
      return (valueA as number) - (valueB as number);
    } else {
      return (valueB as number) - (valueA as number);
    }
  });
}
