import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { HostingDialog } from "@/components/hosting/hosting-dialog";
import { getHomeListingsByHostId } from "@/services/homeListingService";
import { getExperienceListingsByHostId } from "@/services/experienceListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Plus, Home, Sparkles } from "lucide-react";
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

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    const fetchListings = async () => {
      try {
        const [homeResponse, experienceResponse] = await Promise.all([
          getHomeListingsByHostId(user.id),
          getExperienceListingsByHostId(user.id),
        ]);
        setHomeListings(homeResponse.data || []);
        setExperienceListings(experienceResponse.data || []);
      } catch (error) {
        toast.error("Không thể tải tin đăng của bạn");
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, navigate]);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  const totalListings = homeListings.length + experienceListings.length;

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tin đăng của tôi</h1>
              <p className="text-muted-foreground">
                {totalListings} tổng số tin
                {" • "}
                {homeListings.length} nhà
                {" • "}
                {experienceListings.length} trải nghiệm
              </p>
            </div>
            <Button onClick={() => setShowHostingDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo tin đăng mới
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ListingType)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Nhà ở ({homeListings.length})
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Trải nghiệm ({experienceListings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
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
              ) : homeListings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      Bạn chưa có tin đăng nhà ở nào
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Bắt đầu cho thuê bằng cách tạo tin đăng nhà ở đầu tiên
                    </p>
                    <Button
                      onClick={() => setShowHostingDialog(true)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Tạo tin đăng nhà ở đầu tiên
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {homeListings.map((listing) => (
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
                          <span className="text-lg font-bold whitespace-nowrap ml-2">
                            ₫{formatPrice(listing.price)}
                            <span className="text-sm text-muted-foreground font-normal">
                              /đêm
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">
                              {listing.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Users className="h-4 w-4" />
                          <span>{listing.capacity} khách</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="experience">
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
              ) : experienceListings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      Bạn chưa có tin đăng trải nghiệm nào
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Bắt đầu cho thuê bằng cách tạo tin đăng trải nghiệm đầu
                      tiên
                    </p>
                    <Button
                      onClick={() => setShowHostingDialog(true)}
                      size="lg"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Tạo tin đăng trải nghiệm đầu tiên
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {experienceListings.map((listing) => (
                    <Card
                      key={listing.listingId}
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() =>
                        navigate(`/experience-listings/${listing.listingId}`)
                      }
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
                            <span className="text-muted-foreground">
                              No image
                            </span>
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-xs font-semibold flex items-center gap-1">
                            <span>{listing.experienceCategory.icon}</span>
                            {listing.experienceCategory.name}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1">
                            {listing.title}
                          </h3>
                          <span className="text-lg font-bold whitespace-nowrap ml-2">
                            ₫{formatPrice(listing.price)}
                            <span className="text-sm text-muted-foreground font-normal">
                              /người
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">
                              {listing.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Users className="h-4 w-4" />
                          <span>Tối đa {listing.capacity} khách</span>
                        </div>
                        {listing.sessions && listing.sessions.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {listing.sessions.length} buổi khả dụng
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
    </>
  );
}
