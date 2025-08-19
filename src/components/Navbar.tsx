import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  return (
    <header className="bg-[#eafdfd]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <FontAwesomeIcon icon={faPlane} className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Google Flights</h1>
            <p className="text-sm">Find your perfect flight</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
