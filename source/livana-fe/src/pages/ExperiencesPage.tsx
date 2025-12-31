import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { getAllExperienceListings } from "@/services/experienceListingService";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

export function ExperiencesPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<ExperienceListingResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
            <div className="flex gap-4 justify-center">
              <input
                type="text"
                placeholder="Bạn muốn trải nghiệm gì?"
                className="px-6 py-3 rounded-lg border border-input bg-background w-full max-w-md"
              />
              <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="py-16 flex-1">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Trải nghiệm nổi bật</h2>

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
                Chưa có trải nghiệm nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
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
                          Không có ảnh
                        </span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">
                        {listing.title}
                      </h3>
                      {listing.experienceCategory && (
                        <p className="text-sm text-primary font-medium">
                          {listing.experienceCategory.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{listing.address}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span>Tối đa {listing.capacity} người</span>
                      </div>

                      {listing.sessions && listing.sessions.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 flex-shrink-0" />
                          <span>{listing.sessions.length} buổi khả dụng</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <span className="text-lg font-bold">
                        ${listing.price}
                        <span className="text-sm text-muted-foreground font-normal">
                          /người
                        </span>
                      </span>
                    </div>

                    {listing.host && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {listing.host.hostDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm text-muted-foreground">
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
