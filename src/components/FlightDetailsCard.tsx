import { useMemo, useState } from "react";
import type { Flight, FlightFilters, SortOption } from "../types/Flight";
import { filterFlights, sortFlights } from "../utils/FilterFlight";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faMapPin,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type Props = {
  flights: Flight[];
};

const FlightDetailsCard = (props: Props) => {
  const { flights } = props;
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);

  const [sortAscending, setSortAscending] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("price");

  const [filters, setFilters] = useState<FlightFilters>({
    priceRange: [150, 650],
    stops: [0, 1, 2],
    airlines: ["Norse Atlantic Airways (UK)", "Aer Lingus"],
    departureTime: ["morning", "afternoon", "evening", "night"],
  });

  const filteredAndSortedFlights = useMemo(() => {
    const filtered = filterFlights(flights, filters);
    return sortFlights(filtered, sortBy, sortAscending ? "asc" : "desc");
  }, [filters, sortBy, sortAscending]);

  const getLayovers = (leg: Flight["legs"][0]) => {
    if (!leg || leg.stopCount === 0) return [];
    return leg.segments.slice(0, -1).map((segment, index) => {
      const arrival = new Date(segment.arrival);
      const nextDeparture = new Date(leg.segments[index + 1].departure);
      const layoverMinutes = Math.floor(
        (nextDeparture.getTime() - arrival.getTime()) / 60000
      );
      const hours = Math.floor(layoverMinutes / 60);
      const minutes = layoverMinutes % 60;

      return {
        city: segment.destination.name,
        airport: segment.destination.displayCode,
        duration: `${hours > 0 ? hours + "h " : ""}${minutes}m`,
      };
    });
  };

  return (
    <div className="mt-4">
      <div className={showFilters ? "lg:col-span-3" : "lg:col-span-1"}>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedFlights.length} of {flights.length}{" "}
            flights • Prices include taxes and fees
          </p>
          <button
            onClick={() => setSortAscending(!sortAscending)}
            className="border border-border bg-transparent rounded-md cursor-pointer hover:bg-neutral-50"
          >
            {sortAscending ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : (
              <FontAwesomeIcon icon={faArrowDown} />
            )}
            {sortAscending ? "Low to High" : "High to Low"}
          </button>
        </div>

        <div className="space-y-4">
          {filteredAndSortedFlights.map((flight) => {
            const layovers = getLayovers(flight.legs[0]);
            return (
              <div
                key={flight.id}
                className="rounded-lg border text-foreground shadow-sm bg-card border-border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={flight.legs[0]?.carriers.marketing[0]?.logoUrl}
                        alt="Airline Logo"
                        className="w-6 h-6"
                      />
                      <div>
                        <div className="font-medium text-foreground">
                          {flight.legs[0]?.carriers.marketing[0]?.name}
                        </div>
                      </div>
                    </div>

                    {/* price */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {flight.price.formatted}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        per person
                      </div>
                    </div>
                  </div>

                  {/*flight route details */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1 text-left">
                      <div className="text-lg font-bold text-foreground">
                        {flight.legs[0]?.arrival?.substring(11, 16)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flight.legs[0]?.origin.displayCode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flight.legs[0]?.origin.name}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        {Math.floor(flight.legs[0]?.durationInMinutes / 60)}h{" "}
                        {flight.legs[0]?.durationInMinutes % 60}m
                      </div>
                      <div className="flex items-center w-full">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1 h-px bg-border relative">
                          <FontAwesomeIcon
                            icon={faPlaneDeparture}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-primary"
                          />
                        </div>
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {flight.legs[0]?.stopCount === 0
                          ? "Nonstop"
                          : `${flight.legs[0]?.stopCount} stop${
                              flight.legs[0]?.stopCount > 1 ? "s" : ""
                            }`}
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <div className="text-lg font-bold text-foreground">
                        {flight.legs[0]?.departure?.substring(11, 16)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {flight.legs[0]?.destination.displayCode}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {flight.legs[0]?.destination.name}
                      </div>
                    </div>
                  </div>

                  {/* layovers */}
                  {layovers.length > 0 && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium text-foreground mb-2 text-left">
                        Layovers:
                      </div>
                      <div className="space-y-1">
                        {layovers.map((layover, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <FontAwesomeIcon icon={faMapPin} />
                            <span>
                              {layover.city} ({layover.airport}) •{" "}
                              {layover.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {flight.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-accent  text-white rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 bg-transparent border-border border shadow-xs hover:bg-primary hover:text-white">
                      View Details
                    </button>
                    <button
                      className="flex-1 bg-primary hover:bg-primary/90 text-white shadow-xs"
                      onClick={() =>
                        navigate("/booking", { state: { flight } })
                      }
                    >
                      Select Flight
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FlightDetailsCard;
