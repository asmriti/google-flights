import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import AirportPicker from "./AirportPickerSelect";
import "react-datepicker/dist/react-datepicker.css";

const FlightSearchForm = () => {
  const [tripType, setTripType] = useState("roundtrip");
  const [originAirport, setOriginAirport] = useState<any>(null);
  const [destinationAirport, setDestinationAirport] = useState<any>(null);
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);

  const options = [
    { value: "economy", label: "Economy" },
    { value: "premium economy", label: "Premium Economy" },
    { value: "business", label: "Business" },
    { value: "first", label: "First" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="rounded-lg border text-foreground bg-[#eafdfd] border-border shadow-lg p-6">
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
              <div className="relative">
                <AirportPicker
                  value={destinationAirport}
                  onChange={setDestinationAirport}
                  placeholder="Where to?"
                />
              </div>
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
            {/* <div className="space-y-2">
              <label
                htmlFor="passengers"
                className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground"
              >
                Passengers
              </label>
              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={decrease}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-600 hover:bg-muted"
                >
                  –
                </button>
                <span className="w-8 text-center font-semibold text-foreground">
                  {passengers}
                </span>
                <button
                  onClick={increase}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-lg font-bold text-gray-600 hover:bg-muted"
                >
                  +
                </button>
              </div>
            </div> */}
            <div className="space-y-2">
              <label
                htmlFor="class"
                className="flex items-center gap-2 peer-disabled:cursor-not-allowed text-sm font-medium text-foreground"
              >
                Class
              </label>
              <Select
                options={options}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.5rem",
                    padding: "2px",
                    borderColor: "var(--color-border)",
                    boxShadow: "none",
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
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchForm;
