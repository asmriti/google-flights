import FlightSearchForm from "./FlightSearchForm";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Discover Your Next Adventure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search millions of flights and compare prices from hundreds of
            airlines and travel sites
          </p>
        </div>

        {/* Flight Search Form */}
        <div className="max-w-4xl mx-auto">
          <FlightSearchForm />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
