import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import {
  getHostHomeBookings,
  confirmHomeBooking,
} from "@/services/homeBookingService";
import {
  getHostExperienceBookings,
  confirmExperienceBooking,
} from "@/services/experienceBookingService";
import type {
  HomeBookingResponse,
  ExperienceBookingResponse,
  BookingStatus,
} from "@/types/response/bookingResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Sparkles,
  Calendar,
  Users,
  Eye,
  User,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

type BookingType = "home" | "experience";

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Chờ xác nhận
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Đã xác nhận
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Đã hủy
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "HH:mm dd/MM/yyyy", { locale: vi });
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export function HostBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [homeBookings, setHomeBookings] = useState<HomeBookingResponse[]>([]);
  const [experienceBookings, setExperienceBookings] = useState<
    ExperienceBookingResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingType>("home");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const [homeResponse, experienceResponse] = await Promise.all([
        getHostHomeBookings(),
        getHostExperienceBookings(),
      ]);
      setHomeBookings(homeResponse.data.data || []);
      setExperienceBookings(experienceResponse.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách đặt chỗ");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmHomeBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      await confirmHomeBooking(bookingId);
      toast.success("Đã xác nhận đặt phòng thành công");
      fetchBookings();
    } catch (error) {
      toast.error("Không thể xác nhận đặt phòng");
      console.error("Error confirming booking:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmExperienceBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      await confirmExperienceBooking(bookingId);
      toast.success("Đã xác nhận đặt trải nghiệm thành công");
      fetchBookings();
    } catch (error) {
      toast.error("Không thể xác nhận đặt trải nghiệm");
      console.error("Error confirming booking:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  const totalBookings = homeBookings.length + experienceBookings.length;
  const pendingBookings = [...homeBookings, ...experienceBookings].filter(
    (b) => b.status === "PENDING"
  ).length;
  const totalRevenue = [...homeBookings, ...experienceBookings]
    .filter((b) => b.status !== "CANCELLED")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Đơn đặt chỗ</h1>
            <p className="text-muted-foreground">
              Quản lý các đơn đặt chỗ cho tin đăng của bạn
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-sm text-muted-foreground">Tổng đơn đặt</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingBookings}
                </div>
                <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  ₫{formatPrice(totalRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as BookingType)}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Nhà ở ({homeBookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Trải nghiệm ({experienceBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                        <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : homeBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      Chưa có đơn đặt phòng nào
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Khi khách đặt nhà ở của bạn, đơn đặt sẽ hiển thị ở đây
                    </p>
                    <Button onClick={() => navigate("/my-listings")} size="lg">
                      Xem tin đăng của tôi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {homeBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-1">
                              {booking.homeListingTitle}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Mã đơn: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Customer Info */}
                        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {booking.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Khách hàng
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Nhận phòng
                              </p>
                              <p className="font-medium">
                                {formatDateTime(booking.checkInTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Trả phòng
                              </p>
                              <p className="font-medium">
                                {formatDateTime(booking.checkOutTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Số khách
                              </p>
                              <p className="font-medium">
                                {booking.guests} khách
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Tổng tiền
                            </p>
                            <p className="font-bold text-lg">
                              ₫{formatPrice(booking.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đặt ngày: {formatDate(booking.createdAt)}
                            </p>
                            <Badge
                              variant={booking.isPaid ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {booking.isPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "PENDING" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleConfirmHomeBooking(booking.id)
                                }
                                disabled={confirmingId === booking.id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {confirmingId === booking.id
                                  ? "Đang xác nhận..."
                                  : "Xác nhận"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/listings/${booking.homeListingId}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem tin đăng
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="experience">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-muted rounded w-1/3 mb-4" />
                        <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                        <div className="h-4 bg-muted rounded w-1/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : experienceBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      Chưa có đơn đặt trải nghiệm nào
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Khi khách đặt trải nghiệm của bạn, đơn đặt sẽ hiển thị ở
                      đây
                    </p>
                    <Button onClick={() => navigate("/my-listings")} size="lg">
                      Xem tin đăng của tôi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {experienceBookings.map((booking) => (
                    <Card
                      key={booking.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl mb-1">
                              {booking.experienceListingTitle}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Mã đơn: {booking.id.slice(0, 8)}...
                            </p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Customer Info */}
                        <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              {booking.customerName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Khách hàng
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Bắt đầu
                              </p>
                              <p className="font-medium">
                                {formatDateTime(booking.sessionStartTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Kết thúc
                              </p>
                              <p className="font-medium">
                                {formatDateTime(booking.sessionEndTime)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Số người
                              </p>
                              <p className="font-medium">
                                {booking.quantity} người
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Tổng tiền
                            </p>
                            <p className="font-bold text-lg">
                              ₫{formatPrice(booking.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đặt ngày: {formatDate(booking.createdAt)}
                            </p>
                            <Badge
                              variant={booking.isPaid ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {booking.isPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "PENDING" && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  handleConfirmExperienceBooking(booking.id)
                                }
                                disabled={confirmingId === booking.id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                {confirmingId === booking.id
                                  ? "Đang xác nhận..."
                                  : "Xác nhận"}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/experience-listings/${booking.experienceListingId}`
                                )
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Xem tin đăng
                            </Button>
                          </div>
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
