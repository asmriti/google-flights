import Select from "react-select";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import AirportPicker from "./AirportPickerSelect";
import "react-datepicker/dist/react-datepicker.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { searchFlights } from "../services/searchFlightService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FlightDetailsCard from "./FlightDetailsCard";

const FlightSearchForm = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [originAirport, setOriginAirport] = useState<any>(null);
  const [destinationAirport, setDestinationAirport] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infantsInSeat: 0,
    infantsOnLap: 0,
  });

  const totalPassengers =
    passengers.adults +
    passengers.children +
    passengers.infantsInSeat +
    passengers.infantsOnLap;

  const increase = (field: keyof typeof passengers, max = 9) =>
    setPassengers((prev) => ({
      ...prev,
      [field]: Math.min(prev[field] + 1, max),
    }));

  const decrease = (field: keyof typeof passengers, min = 0) =>
    setPassengers((prev) => ({
      ...prev,
      [field]:
        field === "adults"
          ? Math.max(prev[field] - 1, 1)
          : Math.max(prev[field] - 1, min),
    }));

  const classOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  const [selectedClass, setSelectedClass] = useState<{
    value: string;
    label: string;
  }>(classOptions[0]);

  const handleSearchFlights = () => {
    if (!originAirport || !destinationAirport) {
      alert("Please select both origin and destination airports");
      return;
    }

    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    setLoading(true);
    searchFlights()
      .then((res) => {
        setFlights(res.data.itineraries);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className={`rounded-lg border text-foreground bg-[#eafdfd] border-border shadow-lg p-6 ${
          showResults ? "mb-12" : ""
        }`}
      >
        {/* trip type selection */}
        <div>
          <div className="flex gap-4 mb-6">
            {["roundtrip", "oneway", "multicity"].map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none ${
                  tripType === type
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {type === "roundtrip"
                  ? "Round trip"
                  : type === "oneway"
                  ? "One way"
                  : "Multi-city"}
              </button>
            ))}
          </div>
        </div>

        {/* main form */}
        <div className="grid gap-4">
          {/* airport selection */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground">
                From
              </label>
              <AirportPicker
                value={originAirport}
                onChange={setOriginAirport}
                placeholder="Where from?"
              />
            </div>
            <div className="space-y-2">
              <label
                //   className="text-sm font-medium text-foreground"
                className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground"
              >
                To
              </label>
              <AirportPicker
                value={destinationAirport}
                onChange={setDestinationAirport}
                placeholder="Where to?"
              />
            </div>
          </div>

          {/* departure and return dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground">
                Departure
              </label>

              <div>
                <DatePicker
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date as Date)}
                  selectsStart
                  startDate={departureDate}
                  endDate={returnDate}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select departure date"
                  className="w-full px-3 py-2 border rounded-md border-border bg-white hover:border-primary focus-visible:outline-none"
                />
              </div>
            </div>
            {tripType === "roundtrip" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground">
                  Return
                </label>
                <div>
                  <DatePicker
                    selected={returnDate}
                    onChange={(date) => setReturnDate(date as Date)}
                    selectsEnd
                    startDate={departureDate}
                    endDate={returnDate}
                    minDate={departureDate || new Date()}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select return date"
                    className="w-full px-3 py-2 border rounded-md border-border bg-white hover:border-primary focus-visible:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* passengers and class */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* passenger */}
            <div className="space-y-2">
              <label
                htmlFor="passengers"
                className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground"
              >
                Passengers
              </label>

              <div className="relative w-1/2">
                {/* Input-like trigger */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-left hover:border-primary focus:border-primary focus:outline-none"
                >
                  <span className="text-foreground text-sm font-medium">
                    {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}
                  </span>
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className="css-tj5bde-Svg"
                  >
                    <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                  </svg>
                  {/* <span className="text-gray-500">▼</span> */}
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-4 space-y-3">
                    {[
                      { key: "adults", label: "Adults" },
                      { key: "children", label: "Children" },
                      { key: "infantsInSeat", label: "Infants (in seat)" },
                      { key: "infantsOnLap", label: "Infants (on lap)" },
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-foreground text-left">
                          {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              decrease(key as keyof typeof passengers)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-muted"
                          >
                            –
                          </button>
                          <span className="w-6 text-center font-semibold">
                            {passengers[key as keyof typeof passengers]}
                          </span>
                          <button
                            onClick={() =>
                              increase(key as keyof typeof passengers)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-muted"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Done button */}
                    <div className="pt-2 text-right">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1 text-sm rounded-md bg-primary text-white hover:opacity-90"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* class */}
            <div className="space-y-2">
              <label
                htmlFor="class"
                className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground"
              >
                Class
              </label>
              <Select
                value={selectedClass}
                options={classOptions}
                onChange={(option) =>
                  setSelectedClass(option || classOptions[0])
                }
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    textAlign: "left",
                    padding: "2px",
                    borderColor: "var(--color-border)",
                    boxShadow: "none",
                    width: "50%",
                    "&:hover": { borderColor: "var(--color-primary)" },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                      ? "var(--color-primary)"
                      : state.isFocused
                      ? "#eafdfd"
                      : "white",
                    color: state.isSelected
                      ? "white"
                      : "var(--color-foreground)",
                  }),
                  menu: (base) => ({
                    ...base,
                    width: "50%",
                    textAlign: "left",
                  }),
                }}
              />
            </div>
          </div>

          <button
            className="h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg mt-4 rounded-md"
            onClick={handleSearchFlights}
          >
            <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-2" />
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </div>
      </div>
      {/* {showResults &&  */}
      <FlightDetailsCard flights={flights} />
      {/* // } */}
    </div>
  );
};

export default FlightSearchForm;
