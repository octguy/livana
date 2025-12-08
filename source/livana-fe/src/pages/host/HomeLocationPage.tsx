import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

export function HomeLocationPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [location, setLocation] = useState<Location>({
    lat: 21.0285,
    lng: 105.8542,
    address: "Hanoi, Vietnam",
  });
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    21.0285, 105.8542,
  ]);

  // Update location and reverse geocode using Nominatim (OpenStreetMap)
  const updateLocation = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data.display_name) {
        setLocation({ lat, lng, address: data.display_name });
        setSearchInput(data.display_name);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setLocation({
        lat,
        lng,
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      });
    }
  };

  // Handle search using Nominatim
  const handleSearch = async () => {
    if (!searchInput) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMarkerPosition([lat, lng]);
        updateLocation(lat, lng);
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search location. Please try again.");
    }
  };

  const handleNext = () => {
    if (location) {
      console.log("Selected location:", location);
      navigate("/host/homes/details", { state: { location } });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Component to handle map clicks
  function MapClickHandler() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        updateLocation(lat, lng);
      },
    });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-semibold mb-8 text-center">
          Where is your place located?
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          Your address is only shared with guests after they've made a
          reservation.
        </p>

        {/* Search Input */}
        <div className="mb-6 flex gap-2">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>

        {/* Map Container */}
        <div className="mb-8 rounded-xl overflow-hidden border-2 border-border">
          <MapContainer
            center={markerPosition}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
            key={`${markerPosition[0]}-${markerPosition[1]}`}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition} />
            <MapClickHandler />
          </MapContainer>
        </div>

        {/* Selected Location Display */}
        {location && (
          <div className="mb-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">Selected Location:</p>
            <p className="text-sm text-muted-foreground">{location.address}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} size="lg">
            Back
          </Button>
          <Button onClick={handleNext} disabled={!location} size="lg">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
