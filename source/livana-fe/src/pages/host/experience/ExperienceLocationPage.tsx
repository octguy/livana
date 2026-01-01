import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useExperienceListingStore } from "@/stores/useExperienceListingStore";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { LeafletMouseEvent } from "leaflet";

// Fix for default marker icon in React Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface SearchSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function ExperienceLocationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const { setLocation } = useExperienceListingStore();
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [location, setLocationState] = useState<Location>({
    lat: 21.0285,
    lng: 105.8542,
    address: "Loading your location...",
  });
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    21.0285, 105.8542,
  ]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition([lat, lng]);
          updateLocation(lat, lng);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          updateLocation(21.0285, 105.8542);
          setIsLoadingLocation(false);
        }
      );
    } else {
      updateLocation(21.0285, 105.8542);
      setIsLoadingLocation(false);
    }
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`,
        {
          headers: {
            "User-Agent": "Livana Housing App",
          },
        }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "Livana Housing App",
          },
        }
      );
      const data = await response.json();
      const address = data.display_name || "Unknown location";
      setLocationState({ lat, lng, address });
    } catch (error) {
      console.error("Error fetching address:", error);
      setLocationState({ lat, lng, address: "Unknown location" });
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    setMarkerPosition([lat, lng]);
    setLocationState({
      lat,
      lng,
      address: suggestion.display_name,
    });
    setSearchInput(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        updateLocation(lat, lng);
      },
    });

    return <Marker position={markerPosition} />;
  }

  const handleNext = () => {
    setLocation({
      latitude: location.lat,
      longitude: location.lng,
      address: location.address,
    });
    navigate(
      isEditMode ? "/host/experiences/review" : "/host/experiences/capacity"
    );
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-3xl font-semibold mb-4">
          Where will your experience take place?
        </h1>
        <p className="text-muted-foreground mb-8">
          Share your experience's address so guests know where they'll be going.
        </p>

        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search for an address..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full h-12 text-base"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <p className="text-sm">{suggestion.display_name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {!isLoadingLocation && (
          <div className="mb-6">
            <div className="w-full h-[400px] rounded-xl overflow-hidden border-2 border-gray-200">
              <MapContainer
                center={markerPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Click on the map to adjust the pin location
            </p>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg mb-8">
          <p className="text-sm font-medium mb-1">Selected Location:</p>
          <p className="text-sm text-muted-foreground">{location.address}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handleNext} size="lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
