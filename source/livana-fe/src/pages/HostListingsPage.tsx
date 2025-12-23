import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { getHomeListingsByHostId } from "@/services/homeListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function HostListingsPage() {
  const { hostId } = useParams<{ hostId: string }>();
  const navigate = useNavigate();
  const [listings, setListings] = useState<HomeListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState<string>("");

  useEffect(() => {
    if (!hostId) return;

    const fetchListings = async () => {
      try {
        const response = await getHomeListingsByHostId(hostId);
        setListings(response.data || []);
        if (response.data && response.data.length > 0) {
          setHostName(response.data[0].host.hostDisplayName);
        }
      } catch (error) {
        toast.error("Failed to load host's listings");
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [hostId]);

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {hostName ? `Listings by ${hostName}` : "Host's Listings"}
            </h1>
            <p className="text-muted-foreground">
              {listings.length} {listings.length === 1 ? "listing" : "listings"}{" "}
              available
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-muted" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                This host has no listings available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Card
                  key={listing.listingId}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/listings/${listing.listingId}`)}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0].image.url}
                        alt={listing.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {listing.title}
                      </h3>
                      <span className="text-lg font-bold whitespace-nowrap ml-2">
                        ${listing.price}
                        <span className="text-sm text-muted-foreground font-normal">
                          /night
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Users className="h-4 w-4" />
                      <span>{listing.capacity} guests</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
