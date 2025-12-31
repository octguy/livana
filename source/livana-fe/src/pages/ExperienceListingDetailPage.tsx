import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header.tsx";
import { Footer } from "@/components/layout/footer";
import { ExperienceBookingDialog } from "@/components/booking/experience-booking-dialog";
import { getExperienceListingById } from "@/services/experienceListingService";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";
import type { SessionResponse } from "@/types/response/sessionResponse";
import { MapPin, X, Users, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAuthStore } from "@/stores/useAuthStore";

export function ExperienceListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [listing, setListing] = useState<ExperienceListingResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<SessionResponse | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const response = await getExperienceListingById(id);
        setListing(response.data);
      } catch (error) {
        toast.error("Failed to load experience details");
        console.error("Error fetching experience listing:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl text-muted-foreground">Đang tải...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-muted-foreground mb-4">
            Không tìm thấy trải nghiệm
          </p>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-6xl mx-auto py-8 px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">
                {listing.experienceCategory.icon}
              </span>
              <div>
                <h1 className="text-4xl font-semibold">{listing.title}</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  {listing.experienceCategory.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{listing.address}</span>
            </div>
          </div>

          <div className="space-y-12">
            {/* Photos Grid */}
            <div>
              {listing.images && listing.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden">
                  <div className="col-span-2 row-span-2 h-[400px]">
                    <img
                      src={listing.images[0].image.url}
                      alt="Main"
                      className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                      onClick={() => setShowAllPhotos(true)}
                    />
                  </div>
                  {listing.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="h-[196px] relative">
                      <img
                        src={image.image.url}
                        alt={`Photo ${index + 2}`}
                        className="w-full h-full object-cover hover:brightness-95 transition-all cursor-pointer"
                        onClick={() => setShowAllPhotos(true)}
                      />
                      {index === 3 && listing.images.length > 5 && (
                        <button
                          onClick={() => setShowAllPhotos(true)}
                          className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-all flex items-center justify-center text-white font-semibold"
                        >
                          +{listing.images.length - 5} more photos
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-[400px] bg-muted rounded-2xl flex items-center justify-center">
                  <span className="text-muted-foreground">
                    Không có hình ảnh
                  </span>
                </div>
              )}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-10">
                {/* Experience Info */}
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Trải nghiệm được tổ chức bởi{" "}
                    {listing.host?.hostDisplayName || "Chủ nhà"}
                  </h2>
                  <div className="flex items-center gap-3 text-lg text-muted-foreground">
                    <Users className="w-5 h-5" />
                    <span>Tối đa {listing.capacity} khách</span>
                  </div>
                </div>

                {/* Description */}
                <div className="pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-semibold mb-4">
                    Về trải nghiệm này
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>

                {/* Available Sessions */}
                {listing.sessions && listing.sessions.length > 0 && (
                  <div className="pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6">
                      Buổi khả dụng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {listing.sessions.map((session, index) => {
                        const start = new Date(session.startTime);
                        const end = new Date(session.endTime);
                        const duration = Math.floor(
                          (end.getTime() - start.getTime()) / (1000 * 60)
                        );
                        const hours = Math.floor(duration / 60);
                        const minutes = duration % 60;
                        const durationText =
                          hours > 0 && minutes > 0
                            ? `${hours}h ${minutes}m`
                            : hours > 0
                            ? `${hours}h`
                            : `${minutes}m`;

                        return (
                          <div
                            key={session.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                  {index + 1}
                                </div>
                                <span className="font-medium text-gray-900">
                                  Buổi {index + 1}
                                </span>
                              </div>
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {durationText}
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>{format(start, "EEE, MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {format(start, "h:mm a")} -{" "}
                                  {format(end, "h:mm a")}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>
                                  {session.availableSlots} / {session.capacity}{" "}
                                  chỗ trống
                                </span>
                              </div>
                            </div>
                            {session.availableSlots > 0 && (
                              <Button
                                className="w-full mt-4"
                                size="sm"
                                onClick={() => {
                                  if (!user) {
                                    toast.error(
                                      "Vui lòng đăng nhập để đặt trải nghiệm"
                                    );
                                    navigate("/login");
                                    return;
                                  }
                                  setSelectedSession(session);
                                  setShowBookingDialog(true);
                                }}
                              >
                                Đặt buổi này
                              </Button>
                            )}
                            {session.availableSlots === 0 && (
                              <div className="text-center text-sm text-muted-foreground mt-4 py-2 bg-gray-50 rounded">
                                Đã đầy
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location */}
                {listing.latitude && listing.longitude && (
                  <div className="pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold mb-6">Địa điểm</h2>
                    <div className="w-full h-[480px] rounded-2xl overflow-hidden mb-6 border">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${listing.latitude},${listing.longitude}&zoom=15`}
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-lg">{listing.address}</p>
                      <p className="text-sm text-muted-foreground">
                        Tọa độ: {listing.latitude.toFixed(6)},{" "}
                        {listing.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Host Profile */}
                {listing.host && (
                  <div className="pb-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      Gặp gỡ chủ nhà
                    </h2>
                    <div className="flex items-center gap-6 mb-6">
                      {listing.host.avatarUrl ? (
                        <img
                          src={listing.host.avatarUrl}
                          alt={listing.host.hostDisplayName}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-medium">
                          {listing.host.hostDisplayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-2xl font-semibold">
                          {listing.host.hostDisplayName}
                        </p>
                        {listing.host.phoneNumber && (
                          <p className="text-sm text-muted-foreground">
                            {listing.host.phoneNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate(`/host/${listing.host.hostId}/listings`)
                      }
                    >
                      Xem tất cả tin đăng từ {listing.host.hostDisplayName}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column - Sticky Price Card */}
              <div className="lg:col-span-1">
                <div className="border border-gray-200 rounded-2xl p-6 shadow-lg sticky top-24 bg-white">
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-semibold">
                        ₫{formatPrice(listing.price)}
                      </span>
                      <span className="text-muted-foreground text-lg">
                        / người
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Giá mỗi người tham gia
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-2xl">
                        {listing.experienceCategory.icon}
                      </span>
                      <span className="font-medium">
                        {listing.experienceCategory.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Users className="w-5 h-5" />
                      <span>Tối đa {listing.capacity} khách</span>
                    </div>
                    {listing.sessions && listing.sessions.length > 0 && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5" />
                        <span>{listing.sessions.length} buổi khả dụng</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Button className="w-full" size="lg">
                      Kiểm tra lịch trống
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                      Chọn buổi để đặt
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
            <Button variant="outline" onClick={() => navigate("/")} size="lg">
              Về danh sách trải nghiệm
            </Button>
            <Button size="lg" className="px-8">
              Liên hệ chủ nhà
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      {listing && selectedSession && (
        <ExperienceBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          sessionId={selectedSession.id}
          experienceTitle={listing.title}
          sessionStartTime={selectedSession.startTime}
          sessionEndTime={selectedSession.endTime}
          pricePerPerson={listing.price}
          availableSlots={selectedSession.availableSlots}
          onBookingSuccess={async () => {
            // Refresh listing to get updated session info
            try {
              const response = await getExperienceListingById(id!);
              setListing(response.data);
            } catch (error) {
              console.error("Error refreshing listing:", error);
            }
          }}
        />
      )}

      {/* All Photos Modal */}
      {showAllPhotos && listing.images && listing.images.length > 0 && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <X className="w-5 h-5" />
              Đóng
            </button>
          </div>
          <div className="container max-w-4xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 gap-4">
              {listing.images.map((image, index) => (
                <img
                  key={index}
                  src={image.image.url}
                  alt={`Photo ${index + 1}`}
                  className="w-full rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
