import Select from "react-select";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import AirportPicker from "./AirportPickerSelect";
import "react-datepicker/dist/react-datepicker.css";
import FlightDetailsCard from "./FlightDetailsCard";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { searchFlights } from "../services/searchFlightService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { loadFromStorage, saveToStorage } from "../utils/LocalStorage";

type SearchForm = {
  tripType: "roundtrip" | "oneway" | "multicity";
  originAirport: any;
  destinationAirport: any;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: {
    adults: number;
    children: number;
    infantsInSeat: number;
    infantsOnLap: number;
  };
  selectedClass: { value: string; label: string };
};

const FlightSearchForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const classOptions = [
    { value: "economy", label: "Economy" },
    { value: "premium economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  const [form, setForm] = useState<SearchForm>(() => {
    const loaded = loadFromStorage<SearchForm>("searchForm", {
      tripType: "roundtrip",
      originAirport: null,
      destinationAirport: null,
      departureDate: new Date(),
      returnDate: null,
      passengers: { adults: 1, children: 0, infantsInSeat: 0, infantsOnLap: 0 },
      selectedClass: classOptions[0],
    });

    return loaded;
  });

  const totalPassengers =
    (form.passengers.adults ?? 0) +
    (form.passengers.children ?? 0) +
    (form.passengers.infantsInSeat ?? 0) +
    (form.passengers.infantsOnLap ?? 0);

  const increase = (field: keyof typeof form.passengers, max = 9) =>
    setForm((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [field]: Math.min(prev.passengers[field] + 1, max),
      },
    }));

  const decrease = (field: keyof typeof form.passengers, min = 0) =>
    setForm((prev) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [field]:
          field === "adults"
            ? Math.max(prev.passengers[field] - 1, 1)
            : Math.max(prev.passengers[field] - 1, min),
      },
    }));

  const handleSearchFlights = async () => {
    if (!form.originAirport || !form.destinationAirport) {
      alert("Please select both origin and destination airports");
      return;
    }

    setLoading(true);
    try {
      const res = await searchFlights();
      setFlights(res.data.itineraries);
      setShowResults(true);
      setIsEditable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    searchFlights()
      .then((res) => {
        setFlights(res.data.itineraries);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    saveToStorage("searchForm", form);
  }, [form]);

  console.log(flights, "fli");
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
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    tripType: type as "roundtrip" | "oneway" | "multicity",
                  }))
                }
                disabled={!isEditable}
                className={`px-4 py-2 rounded-lg font-medium transition-colors focus-visible:outline-none ${
                  !isEditable ? "cursor-not-allowed" : "cursor-pointer"
                } ${
                  form.tripType === type
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
                value={form.originAirport}
                onChange={(airport) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    originAirport: airport,
                  }))
                }
                placeholder="Where from?"
                isDisabled={!isEditable}
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
                value={form.destinationAirport}
                onChange={(airport) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    destinationAirport: airport,
                  }))
                }
                placeholder="Where to?"
                isDisabled={!isEditable}
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
                  selected={form.departureDate}
                  onChange={(date) =>
                    setForm((prevForm) => ({
                      ...prevForm,
                      departureDate: date as Date,
                    }))
                  }
                  selectsStart
                  startDate={form.departureDate}
                  endDate={form.returnDate}
                  minDate={new Date()}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select departure date"
                  disabled={!isEditable}
                  className={`w-full px-3 py-2 border rounded-md border-border bg-white focus-visible:outline-none ${
                    !isEditable
                      ? "cursor-not-allowed hover:border-border"
                      : "hover:border-primary"
                  }`}
                />
              </div>
            </div>
            {form.tripType === "roundtrip" && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground">
                  Return
                </label>
                <div>
                  <DatePicker
                    selected={form.returnDate}
                    onChange={(date) =>
                      setForm((prevForm) => ({
                        ...prevForm,
                        returnDate: date as Date,
                      }))
                    }
                    selectsEnd
                    startDate={form.departureDate}
                    endDate={form.returnDate}
                    minDate={form.departureDate || new Date()}
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select return date"
                    disabled={!isEditable}
                    className={`w-full px-3 py-2 border rounded-md border-border bg-white focus-visible:outline-none ${
                      !isEditable
                        ? "cursor-not-allowed hover:border-border"
                        : "hover:border-primary"
                    }`}
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
                  disabled={!isEditable || loading}
                  className={`flex w-full items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-left  focus:border-primary focus:outline-none ${
                    !isEditable
                      ? "cursor-not-allowed hover:border-border"
                      : "hover:border-primary"
                  }`}
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
                              decrease(key as keyof typeof form.passengers)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-muted"
                          >
                            –
                          </button>
                          <span className="w-6 text-center font-semibold">
                            {
                              form.passengers[
                                key as keyof typeof form.passengers
                              ]
                            }
                          </span>
                          <button
                            onClick={() =>
                              increase(key as keyof typeof form.passengers)
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
                value={form.selectedClass}
                options={classOptions}
                onChange={(option) => {
                  const newClass = option || classOptions[0];
                  setForm((prev) => ({ ...prev, selectedClass: newClass }));
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
                isDisabled={!isEditable}
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

          <div className="flex justify-between items-center gap-4">
            <button
              className={`px-4 py-2 rounded-md text-white w-full ${
                loading || !isEditable
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary cursor-pointer"
              }`}
              onClick={handleSearchFlights}
              disabled={!isEditable || loading}
            >
              <FontAwesomeIcon icon={faSearch} className="w-5 h-5 mr-2" />
              {loading ? "Searching..." : "Search Flights"}
            </button>

            {!isEditable && (
              <button
                onClick={() => setIsEditable(true)}
                className="px-4 py-2 bg-primary hover:bg-primary/90 border-border border shadow-xs text-muted rounded-md w-full cursor-pointer"
              >
                Modify Search
              </button>
            )}
          </div>
        </div>
      </div>
      {showResults && <FlightDetailsCard flights={flights} />}
    </div>
  );
};

export default FlightSearchForm;
