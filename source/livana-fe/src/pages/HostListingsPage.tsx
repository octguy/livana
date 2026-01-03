import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { getHomeListingsByHostId } from "@/services/homeListingService";
import { getExperienceListingsByHostId } from "@/services/experienceListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Users,
  ArrowLeft,
  Home,
  Sparkles,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function HostListingsPage() {
  const { hostId } = useParams<{ hostId: string }>();
  const navigate = useNavigate();
  const [homeListings, setHomeListings] = useState<HomeListingResponse[]>([]);
  const [experienceListings, setExperienceListings] = useState<
    ExperienceListingResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState<string>("");

  useEffect(() => {
    if (!hostId) return;

    const fetchListings = async () => {
      try {
        const [homeResponse, experienceResponse] = await Promise.all([
          getHomeListingsByHostId(hostId),
          getExperienceListingsByHostId(hostId),
        ]);

        setHomeListings(homeResponse.data || []);
        setExperienceListings(experienceResponse.data || []);

        // Set host name from whichever response has data
        if (homeResponse.data && homeResponse.data.length > 0) {
          setHostName(homeResponse.data[0].host.hostDisplayName);
        } else if (
          experienceResponse.data &&
          experienceResponse.data.length > 0
        ) {
          setHostName(experienceResponse.data[0].host.hostDisplayName);
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
            Go back
          </Button>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              {hostName ? `Listings by ${hostName}` : "Host's listings"}
            </h1>
            <p className="text-muted-foreground">
              {homeListings.length + experienceListings.length} listings
            </p>
          </div>

          <Tabs defaultValue="home" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Homes ({homeListings.length})
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Experiences ({experienceListings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              {loading ? (
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
              ) : homeListings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    This host doesn't have any listings yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {homeListings.map((listing) => (
                    <Card
                      key={listing.listingId}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/listings/${listing.listingId}`)}
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
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">
                            {listing.title}
                          </h3>
                          <span className="text-sm font-bold whitespace-nowrap ml-2">
                            ${listing.price}
                            <span className="text-xs text-muted-foreground font-normal">
                              /night
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">
                              {listing.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Users className="h-3 w-3" />
                          <span>{listing.capacity} guests</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="experience">
              {loading ? (
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
              ) : experienceListings.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    This host doesn't have any experiences yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {experienceListings.map((listing) => (
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
                              No image
                            </span>
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
                            <span className="line-clamp-1">
                              {listing.address}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 flex-shrink-0" />
                            <span>Up to {listing.capacity} guests</span>
                          </div>

                          {listing.sessions && listing.sessions.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span>
                                {listing.sessions.length} sessions available
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2 pt-2 border-t">
                          <span className="text-sm font-bold">
                            ${listing.price}
                            <span className="text-xs text-muted-foreground font-normal">
                              /person
                            </span>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
}
