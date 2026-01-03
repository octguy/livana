import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface SearchLocation {
  latitude: number;
  longitude: number;
  displayName: string;
}

export interface SearchFilters {
  location: SearchLocation | null;
  radiusKm: number;
  minPrice?: number;
  maxPrice?: number;
  minCapacity?: number;
}

interface LocationSearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
}

export function LocationSearchBar({
  onSearch,
  loading = false,
  placeholder = "Search by location...",
  className,
  showFilters = true,
}: LocationSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<SearchLocation | null>(null);
  const [radiusKm, setRadiusKm] = useState(50);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minCapacity, setMinCapacity] = useState<string>("");
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search using Nominatim API
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setSelectedLocation(null);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&limit=5&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "vi,en",
            },
          }
        );
        const data = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching location:", error);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  };

  const handleSelectLocation = (result: NominatimResult) => {
    const location: SearchLocation = {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      displayName: result.display_name,
    };
    setSelectedLocation(location);
    setQuery(result.display_name.split(",")[0]); // Show short name
    setShowResults(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedLocation(null);
    setResults([]);
    setShowResults(false);
  };

  const handleSearch = () => {
    if (!selectedLocation) return;

    const filters: SearchFilters = {
      location: selectedLocation,
      radiusKm,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minCapacity: minCapacity ? parseInt(minCapacity) : undefined,
    };

    onSearch(filters);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get address
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "Accept-Language": "vi,en",
              },
            }
          );
          const data = await response.json();

          const location: SearchLocation = {
            latitude,
            longitude,
            displayName: data.display_name || "Current Location",
          };

          setSelectedLocation(location);
          setQuery(data.display_name?.split(",")[0] || "Current Location");
        } catch {
          const location: SearchLocation = {
            latitude,
            longitude,
            displayName: "Current Location",
          };
          setSelectedLocation(location);
          setQuery("Current Location");
        }
        setSearching(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to get your location");
        setSearching(false);
      }
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="flex gap-2">
        {/* Main Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder={placeholder}
            className="pl-10 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {query && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-muted rounded"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={handleGetCurrentLocation}
              className="p-1 hover:bg-muted rounded"
              title="Use current location"
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.place_id}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-2 text-left hover:bg-muted flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm line-clamp-2">
                    {result.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Popover */}
        {showFilters && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="shrink-0">
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Radius (km)</Label>
                  <Input
                    type="number"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value) || 50)}
                    min={1}
                    max={500}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Min Guests</Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    min={1}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!selectedLocation || loading}
          className="shrink-0"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {/* Selected Location Badge */}
      {selectedLocation && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{selectedLocation.displayName}</span>
        </div>
      )}
    </div>
  );
}
