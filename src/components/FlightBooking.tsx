import { useLocation } from "react-router-dom";
import type { Flight } from "../types/Flight";

const FlightBooking = () => {
  const location = useLocation();
  const flight = (location.state as { flight: Flight })?.flight;

  if (!flight) {
    return <p>No flight selected.</p>;
  }

  return (
    <div>
      <div>Flight booking</div>
    </div>
  );
};

export default FlightBooking;
