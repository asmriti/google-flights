import { useLocation } from "react-router-dom";
import type { Flight } from "../types/Flight";
import { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faMoneyBill,
  faPlaneDeparture,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

interface PassengerInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  gender: { value: string; label: string } | null;
  email: string;
  phone: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
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
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    gender: null,
    email: "",
    phone: "",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  if (!flight) {
    return <p>No flight selected.</p>;
  }

  const steps = [
    {
      id: 0,
      title: "Passenger Info",
      icon: () => <FontAwesomeIcon icon={faUser} />,
    },
    {
      id: 1,
      title: "Seat Selection",
      icon: () => <FontAwesomeIcon icon={faPlaneDeparture} />,
    },
    {
      id: 2,
      title: "Payment",
      icon: () => <FontAwesomeIcon icon={faMoneyBill} />,
    },
    {
      id: 3,
      title: "Confirmation",
      icon: () => <FontAwesomeIcon icon={faCheck} />,
    },
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

  // mock data
  const seatMap = {
    rows: 30,
    seatsPerRow: 6,
    unavailableSeats: ["1A", "1B", "5C", "12F", "15A", "20D"],
    premiumSeats: [
      "1A",
      "1B",
      "1C",
      "1D",
      "1E",
      "1F",
      "2A",
      "2B",
      "2C",
      "2D",
      "2E",
      "2F",
    ],
  };

  const generateSeatMap = () => {
    const seats = [];
    for (let row = 1; row <= seatMap.rows; row++) {
      const rowSeats = [];
      const seatLetters = ["A", "B", "C", "D", "E", "F"];
      for (let i = 0; i < seatLetters.length; i++) {
        const seatId = `${row}${seatLetters[i]}`;
        const isUnavailable = seatMap.unavailableSeats.includes(seatId);
        const isPremium = seatMap.premiumSeats.includes(seatId);
        const isSelected = selectedSeat === seatId;

        rowSeats.push({
          id: seatId,
          available: !isUnavailable,
          premium: isPremium,
          selected: isSelected,
        });
      }
      seats.push({ row, seats: rowSeats });
    }
    return seats;
  };

  return (
    <div className="container mx-auto px-4 my-4">
      <h1 className="text-xl font-heading font-bold text-foreground text-center">
        Complete your Booking
      </h1>

      <p className="text-sm text-muted-foreground text-center mt-2">
        {flight.legs[0]?.origin.name} → {flight.legs[0]?.destination.name} •{" "}
        {formattedDeparture}
      </p>

      {/* progress */}
      <div className="my-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted
                      ? "bg-primary border-primary text-muted"
                      : isActive
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5" />
                  ) : (
                    <Icon />
                  )}
                </div>
                <div className="ml-3">
                  <div
                    className={`text-sm font-medium ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-px mx-4 ${
                      isCompleted ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

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
                  placeholder:text-foreground/90 block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
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

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-bold mb-4">
                  Select Your Seat
                </h2>
                <p className="text-muted-foreground mb-6">
                  Choose your preferred seat for the flight.
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-center mb-4">
                  <div className="text-sm font-medium">
                    Aircraft: Boeing 777-300ER
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Economy Class
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    {generateSeatMap()
                      .slice(0, 10)
                      .map((row) => (
                        <div
                          key={row.row}
                          className="flex items-center justify-center gap-1"
                        >
                          <div className="w-6 text-xs text-center text-muted-foreground">
                            {row.row}
                          </div>
                          {row.seats.map((seat, index) => (
                            <div key={seat.id} className="flex">
                              <button
                                onClick={() =>
                                  seat.available && setSelectedSeat(seat.id)
                                }
                                disabled={!seat.available}
                                className={`w-8 h-8 text-xs rounded border flex justify-center ${
                                  seat.selected
                                    ? "bg-primary text-muted border-primary"
                                    : seat.available
                                    ? seat.premium
                                      ? "bg-pink/20 border-pink hover:bg-secondary/30"
                                      : "bg-background border-border hover:bg-muted"
                                    : "bg-muted border-muted text-muted-foreground cursor-not-allowed"
                                }`}
                              >
                                {seat.id.slice(-1)}
                              </button>
                              {index === 2 && <div className="w-4" />}
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border border-border rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded"></div>
                    <span>Occupied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink/20 border border-pink rounded"></div>
                    <span>Premium (+$25)</span>
                  </div>
                </div>
              </div>

              {selectedSeat && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-5 h-5 text-primary"
                    />
                    <span className="font-medium">
                      Seat {selectedSeat} selected
                    </span>
                    {seatMap.premiumSeats.includes(selectedSeat) && (
                      <span className="px-2 py-1 text-xs bg-accent  text-white rounded-full">
                        Premium $25
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-bold mb-4">
                  Payment Information
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter your payment details to complete the booking.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber">Card Number *</label>
                  <input
                    id="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        cardNumber: e.target.value,
                      })
                    }
                    placeholder="1234 5678 9012 3456"
                    className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="expiryDate">Expiry Date *</label>
                    <input
                      id="expiryDate"
                      value={paymentInfo.expiryDate}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          expiryDate: e.target.value,
                        })
                      }
                      placeholder="MM/YY"
                      className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cvv">CVV *</label>
                    <input
                      id="cvv"
                      value={paymentInfo.cvv}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cvv: e.target.value,
                        })
                      }
                      placeholder="123"
                      className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cardholderName">Cardholder Name *</label>
                    <input
                      id="cardholderName"
                      value={paymentInfo.cardholderName}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardholderName: e.target.value,
                        })
                      }
                      placeholder="Smriti Aryal"
                      className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing Address</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="street">Street Address *</label>
                      <input
                        id="street"
                        value={paymentInfo.billingAddress.street}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            billingAddress: {
                              ...paymentInfo.billingAddress,
                              street: e.target.value,
                            },
                          })
                        }
                        placeholder="123 Main Street"
                        className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city">City *</label>
                        <input
                          id="city"
                          value={paymentInfo.billingAddress.city}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: {
                                ...paymentInfo.billingAddress,
                                city: e.target.value,
                              },
                            })
                          }
                          placeholder="New York"
                          className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state">State *</label>
                        <input
                          id="state"
                          value={paymentInfo.billingAddress.state}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: {
                                ...paymentInfo.billingAddress,
                                state: e.target.value,
                              },
                            })
                          }
                          placeholder="NY"
                          className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="zipCode">ZIP Code *</label>
                        <input
                          id="zipCode"
                          value={paymentInfo.billingAddress.zipCode}
                          onChange={(e) =>
                            setPaymentInfo({
                              ...paymentInfo,
                              billingAddress: {
                                ...paymentInfo.billingAddress,
                                zipCode: e.target.value,
                              },
                            })
                          }
                          placeholder="10001"
                          className="border border-primary/20 text-foreground text-sm mt-1 h-8 w-full
                  placeholder:text-foreground block rounded-md px-3 py-1 shadow-xs transition-shadow outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="w-8 h-8 text-green-600"
                />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-muted-foreground">
                  Your flight has been successfully booked.
                </p>
              </div>
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                  Booking Reference
                </div>
                <div className="text-2xl font-bold font-mono">ABC123XYZ</div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to smritiaryal331@gmail.com
                </p>
                <p className="text-sm text-muted-foreground">
                  Please arrive at the airport at least 2 hours before
                  departure.
                </p>
              </div>
            </div>
          )}

          {/* nav buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <button
              className={`shadow-xs bg-white text-sm border-border border ${
                bookingComplete || currentStep === 0 ? "cursor-not-allowed" : ""
              }`}
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
              className={`bg-primary text-muted text-sm shadow-sm ${
                bookingComplete
                  ? "cursor-not-allowed hover:bg-primary"
                  : "hover:bg-primary/90"
              }`}
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
