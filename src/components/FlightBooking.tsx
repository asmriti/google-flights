import { useLocation } from "react-router-dom";
import type { Flight } from "../types/Flight";
import { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";

interface PassengerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: { value: string; label: string } | null;
  email: string;
  phone: string;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const FlightBooking = () => {
  const location = useLocation();
  const flight = (location.state as { flight: Flight })?.flight;

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: null,
    email: "",
    phone: "",
  });

  if (!flight) {
    return <p>No flight selected.</p>;
  }

  const steps = [
    { id: 0, title: "Passenger Info" },
    { id: 1, title: "Seat Selection" },
    { id: 2, title: "Payment" },
    { id: 3, title: "Confirmation" },
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteBooking = () => {
    setBookingComplete(true);
    setCurrentStep(3);
  };

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  const formattedDeparture = formatDate(flight.legs[0].departure);

  return (
    <div className="container mx-auto px-4 mt-4">
      <h1 className="text-xl font-heading font-bold text-foreground text-center">
        Complete your Booking
      </h1>

      <p className="text-sm text-muted-foreground text-center">
        {flight.legs[0]?.origin.name} → {flight.legs[0]?.destination.name} •{" "}
        {formattedDeparture}
      </p>

      <div className="rounded-lg border border-border bg-card text-foreground shadow-sm mt-4 max-w-4xl mx-auto">
        <div className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-bold mb-4">
                  Passenger Information
                </h2>
                <p className="text-muted-foreground mb-6">
                  Please provide the passenger details as they appear on your
                  ID.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm">
                    First Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={passengerInfo.firstName}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        firstName: e.target.value,
                      })
                    }
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={passengerInfo.lastName}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        lastName: e.target.value,
                      })
                    }
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="dob" className="text-sm">
                    Date of Birth *
                  </label>
                  <DatePicker
                    selected={passengerInfo.dateOfBirth}
                    onChange={(date) =>
                      setPassengerInfo({ ...passengerInfo, dateOfBirth: date })
                    }
                    dateFormat="dd MMM yyyy"
                    placeholderText="Select date of birth"
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm">
                    Gender
                  </label>
                  <Select
                    options={genderOptions}
                    value={passengerInfo.gender}
                    onChange={(option) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        gender: option,
                      })
                    }
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    placeholder="Select gender"
                    className="mt-1"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        textAlign: "left",
                        padding: "2px",
                        borderColor:
                          "color-mix(in oklab, var(--color-primary) 20%, transparent)",
                        boxShadow: "none",
                        width: "50%",
                        backgroundColor: "var(--color-card)",
                        minHeight: "32px",
                        height: "32px",
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
                      placeholder: (base) => ({
                        ...base,
                        color: "var(--color-foreground)",
                        fontSize: "0.875rem",
                      }),
                      menu: (base) => ({
                        ...base,
                        width: "50%",
                        textAlign: "left",
                      }),
                      //   indicatorsContainer: (base) => ({
                      //     ...base,
                      //     padding: "0",
                      //   }),
                    }}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={passengerInfo.email}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={passengerInfo.phone}
                    onChange={(e) =>
                      setPassengerInfo({
                        ...passengerInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* nav buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              className="shadow-xs bg-white text-sm border-border border"
              onClick={handlePreviousStep}
              disabled={currentStep === 0 || bookingComplete}
            >
              Previous
            </button>
            <button
              onClick={
                currentStep === 2 ? handleCompleteBooking : handleNextStep
              }
              disabled={bookingComplete}
              className="bg-primary text-muted hover:bg-primary/90 text-sm shadow-sm"
            >
              {currentStep === 2 ? "Complete Booking" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;
