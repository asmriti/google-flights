import { Route, Routes } from "react-router-dom";
import "./App.css";
import FlightBooking from "./components/FlightBooking";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/booking" element={<FlightBooking />} />
      </Routes>
    </>
  );
}

export default App;
