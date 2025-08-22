import Select from "react-select";
import { useEffect, useState } from "react";
import { searchAirports } from "../services/flightService";

interface Option {
  value: string;
  label: string;
}

interface AirportPickerProps {
  value: Option | null;
  onChange: (option: Option | null) => void;
  placeholder?: string;
  isDisabled: boolean;
}

const AirportPicker = ({
  value,
  onChange,
  placeholder,
  isDisabled = false,
}: AirportPickerProps) => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    setLoading(true);
    searchAirports()
      .then((res) => {
        const mapped: Option[] = res.data.map((item: any) => ({
          value: item.navigation.relevantFlightParams.skyId,
          label: `${item.presentation.suggestionTitle}, ${item.presentation.subtitle}`,
        }));
        setOptions(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={loading ? "Loading ..." : placeholder}
      isDisabled={isDisabled || loading}
      isClearable
      className="w-full"
      classNamePrefix="airport-select"
      components={{
        IndicatorSeparator: () => null,
      }}
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: "0.5rem",
          padding: "2px",
          borderColor: "var(--color-border)",
          boxShadow: "none",
          textAlign: "left",
          "&:hover": {
            borderColor: !isDisabled
              ? "var(--color-primary)"
              : base.borderColor,
          },
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected
            ? "var(--color-primary)"
            : state.isFocused
            ? "#eafdfd"
            : "white",
          color: state.isSelected ? "white" : "var(--color-foreground)",
        }),
        menu: (base) => ({
          ...base,
          textAlign: "left",
        }),
      }}
    />
  );
};

export default AirportPicker;
