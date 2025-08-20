export interface Carrier {
  id: number;
  logoUrl: string;
  name: string;
}

export interface Place {
  id: string;
  name: string;
  displayCode: string;
  city?: string;
  isHighlighted?: boolean;
}

export interface Segment {
  id: string;
  origin: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
    parent?: {
      flightPlaceId: string;
      displayCode: string;
      name: string;
      type: string;
    };
  };
  destination: {
    flightPlaceId: string;
    displayCode: string;
    name: string;
    type: string;
    parent?: {
      flightPlaceId: string;
      displayCode: string;
      name: string;
      type: string;
    };
  };
  departure: string;
  arrival: string;
  durationInMinutes: number;
  flightNumber: string;
  marketingCarrier: Carrier;
  operatingCarrier: Carrier;
}

export interface Leg {
  id: string;
  origin: Place;
  destination: Place;
  durationInMinutes: number;
  stopCount: number;
  departure: string;
  arrival: string;
  carriers: {
    marketing: Carrier[];
  };
  segments: Segment[];
}

export interface Flight {
  id: string;
  price: {
    raw: number;
    formatted: string;
  };
  class: string;
  legs: Leg[];
  tags: string[];
}

export interface FlightFilters {
  priceRange: [number, number];
  stops: number[];
  airlines: string[];
  departureTime: string[];
}

export type SortOption = "price" | "duration" | "departure" | "arrival";
export type SortOrder = "asc" | "desc";
