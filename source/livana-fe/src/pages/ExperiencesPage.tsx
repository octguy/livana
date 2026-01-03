import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import {
  getAllExperienceListings,
  searchExperienceListingsByLocation,
  type ListingSearchResult,
} from "@/services/experienceListingService";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar, Navigation } from "lucide-react";
import { toast } from "sonner";
import {
  LocationSearchBar,
  type SearchFilters,
} from "@/components/ui/location-search-bar";

export function ExperiencesPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ExperienceListingResponse[]>([]);
  const [searchResults, setSearchResults] = useState<
    ListingSearchResult<ExperienceListingResponse>[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await getAllExperienceListings();
        setListings(response.data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách trải nghiệm");
        console.error("Error fetching experience listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleSearch = async (filters: SearchFilters) => {
    if (!filters.location) return;

    setSearching(true);
    try {
      const response = await searchExperienceListingsByLocation({
        latitude: filters.location.latitude,
        longitude: filters.location.longitude,
        radiusKm: filters.radiusKm,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minCapacity: filters.minCapacity,
      });
      setSearchResults(response.data || []);
      if (response.data?.length === 0) {
        toast.info("Không tìm thấy trải nghiệm nào trong khu vực này");
      } else {
        toast.success(`Tìm thấy ${response.data?.length} trải nghiệm`);
      }
    } catch (error) {
      toast.error("Tìm kiếm thất bại");
      console.error("Error searching listings:", error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
  };

  // Determine which listings to display
  const displayListings = searchResults
    ? searchResults.map((r) => ({ ...r.listing, distanceKm: r.distanceKm }))
    : listings;
  const isSearchMode = searchResults !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Khám phá trải nghiệm độc đáo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Tìm những hoạt động và trải nghiệm khó quên được tổ chức bởi người
              dân địa phương
            </p>
            <LocationSearchBar
              onSearch={handleSearch}
              loading={searching}
              placeholder="Bạn muốn trải nghiệm gì? Tìm theo địa điểm..."
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16 flex-1">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {isSearchMode ? "Kết quả tìm kiếm" : "Trải nghiệm nổi bật"}
            </h2>
            {isSearchMode && (
              <button
                onClick={clearSearch}
                className="text-sm text-primary hover:underline"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {loading || searching ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <CardContent className="p-3">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayListings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                {isSearchMode
                  ? "Không tìm thấy trải nghiệm nào trong khu vực này"
                  : "Chưa có trải nghiệm nào"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {displayListings.map((listing: ExperienceListingResponse & { distanceKm?: number }) => (
                <Card
                  key={listing.listingId}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    navigate(`/experience-listings/${listing.listingId}`)
                  }
                >
                  <div className="aspect-square relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].image.url}
                        alt={listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Không có ảnh
                        </span>
                      </div>
                    )}
                    {listing.distanceKm !== undefined && (
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {listing.distanceKm} km
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="mb-1">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {listing.title}
                      </h3>
                      {listing.experienceCategory && (
                        <p className="text-xs text-primary font-medium">
                          {listing.experienceCategory.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 flex-shrink-0" />
                        <span>Tối đa {listing.capacity} người</span>
                      </div>

                      {listing.sessions && listing.sessions.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span>{listing.sessions.length} buổi khả dụng</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t">
                      <span className="text-sm font-bold">
                        ${listing.price}
                        <span className="text-xs text-muted-foreground font-normal">
                          /người
                        </span>
                      </span>
                    </div>

                    {listing.host && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {listing.host.hostDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Tổ chức bởi {listing.host.hostDisplayName}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
