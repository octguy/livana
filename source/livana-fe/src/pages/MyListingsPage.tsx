import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { HostingDialog } from "@/components/hosting/hosting-dialog";
import { getHomeListingsByHostId } from "@/services/homeListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

export function MyListingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listings, setListings] = useState<HomeListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHostingDialog, setShowHostingDialog] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchListings = async () => {
      try {
        const response = await getHomeListingsByHostId(user.id);
        setListings(response.data || []);
      } catch (error) {
        toast.error("Failed to load your listings");
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, navigate]);

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">
                {listings.length}{" "}
                {listings.length === 1 ? "listing" : "listings"}
              </p>
            </div>
            <Button onClick={() => setShowHostingDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create new listing
            </Button>
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
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">
                  You don't have any listings yet
                </h2>
                <p className="text-muted-foreground mb-6">
                  Start hosting by creating your first listing
                </p>
                <Button onClick={() => setShowHostingDialog(true)} size="lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Create your first listing
                </Button>
              </div>
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
      <HostingDialog
        open={showHostingDialog}
        onOpenChange={setShowHostingDialog}
      />
    </>
  );
}
