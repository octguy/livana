import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { HostingDialog } from "@/components/hosting/hosting-dialog";
import { EditHomeListingDialog } from "@/components/hosting/edit-home-listing-dialog";
import { EditExperienceListingDialog } from "@/components/hosting/edit-experience-listing-dialog";
import { getHomeListingsByHostId } from "@/services/homeListingService";
import { getExperienceListingsByHostId } from "@/services/experienceListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Plus, Home, Sparkles, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";

type ListingType = "home" | "experience";

export function MyListingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [homeListings, setHomeListings] = useState<HomeListingResponse[]>([]);
  const [experienceListings, setExperienceListings] = useState<
    ExperienceListingResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showHostingDialog, setShowHostingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<ListingType>("home");

  // Edit dialog state
  const [editingHomeListing, setEditingHomeListing] =
    useState<HomeListingResponse | null>(null);
  const [editingExperienceListing, setEditingExperienceListing] =
    useState<ExperienceListingResponse | null>(null);

  const fetchListings = async () => {
    if (!user?.id) return;

    try {
      const [homeResponse, experienceResponse] = await Promise.all([
        getHomeListingsByHostId(user.id),
        getExperienceListingsByHostId(user.id),
      ]);
      setHomeListings(homeResponse.data || []);
      setExperienceListings(experienceResponse.data || []);
    } catch (error) {
      toast.error("Failed to load your listings");
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    fetchListings();
  }, [user, navigate]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const totalListings = homeListings.length + experienceListings.length;

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Listings</h1>
              <p className="text-muted-foreground">
                {totalListings} total listings
                {" • "}
                {homeListings.length} homes
                {" • "}
                {experienceListings.length} experiences
              </p>
            </div>
            <Button onClick={() => setShowHostingDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create new listing
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ListingType)}
          >
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
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      You don't have any home listings yet
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Start hosting by creating your first home listing
                    </p>
                    <Button
                      onClick={() => setShowHostingDialog(true)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create your first home listing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {homeListings.map((listing) => (
                    <Card
                      key={listing.listingId}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"
                      onClick={() => navigate(`/listings/${listing.listingId}`)}
                    >
                      {/* Edit Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingHomeListing(listing);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {listing.title}
                          </h3>
                          <span className="text-sm font-bold whitespace-nowrap ml-2">
                            ₫{formatPrice(listing.price)}
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
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Users className="h-4 w-4" />
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
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      You don't have any experience listings yet
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Start hosting by creating your first experience listing
                    </p>
                    <Button
                      onClick={() => setShowHostingDialog(true)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create your first experience listing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {experienceListings.map((listing) => (
                    <Card
                      key={listing.listingId}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"
                      onClick={() =>
                        navigate(`/experience-listings/${listing.listingId}`)
                      }
                    >
                      {/* Edit Button */}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingExperienceListing(listing);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <span className="text-[10px] font-semibold flex items-center gap-1">
                            <span>{listing.experienceCategory.icon}</span>
                            {listing.experienceCategory.name}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-sm line-clamp-1">
                            {listing.title}
                          </h3>
                          <span className="text-sm font-bold whitespace-nowrap ml-2">
                            ₫{formatPrice(listing.price)}
                            <span className="text-xs text-muted-foreground font-normal">
                              /person
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
                          <span>Up to {listing.capacity} guests</span>
                        </div>
                        {listing.sessions && listing.sessions.length > 0 && (
                          <div className="mt-1 text-[10px] text-muted-foreground">
                            {listing.sessions.length} sessions available
                          </div>
                        )}
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
      <HostingDialog
        open={showHostingDialog}
        onOpenChange={setShowHostingDialog}
      />
      {editingHomeListing && (
        <EditHomeListingDialog
          open={!!editingHomeListing}
          onOpenChange={(open) => !open && setEditingHomeListing(null)}
          listing={editingHomeListing}
          onSuccess={fetchListings}
        />
      )}
      {editingExperienceListing && (
        <EditExperienceListingDialog
          open={!!editingExperienceListing}
          onOpenChange={(open) => !open && setEditingExperienceListing(null)}
          listing={editingExperienceListing}
          onSuccess={fetchListings}
        />
      )}
    </>
  );
}
