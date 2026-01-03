import { useEffect, useState, useMemo } from "react";
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
} from "@/types/response/bookingResponse";
import { BookingStatus } from "@/types/response/bookingResponse";
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
  Clock,
  CheckCircle,
  Ban,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/useAuthStore";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type BookingType = "home" | "experience";
type StatusFilter = "ALL" | BookingStatus;

const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Pending
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Confirmed
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const formatDateTime = (dateString: string) => {
  return format(new Date(dateString), "HH:mm MM/dd/yyyy", { locale: enUS });
};

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MM/dd/yyyy", { locale: enUS });
};

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Filtered bookings based on status
  const filteredHomeBookings = useMemo(() => {
    if (statusFilter === "ALL") return homeBookings;
    return homeBookings.filter((b) => b.status === statusFilter);
  }, [homeBookings, statusFilter]);

  const filteredExperienceBookings = useMemo(() => {
    if (statusFilter === "ALL") return experienceBookings;
    return experienceBookings.filter((b) => b.status === statusFilter);
  }, [experienceBookings, statusFilter]);

  // Count by status for badges
  const homeStatusCounts = useMemo(
    () => ({
      PENDING: homeBookings.filter((b) => b.status === "PENDING").length,
      CONFIRMED: homeBookings.filter((b) => b.status === "CONFIRMED").length,
      CANCELLED: homeBookings.filter((b) => b.status === "CANCELLED").length,
    }),
    [homeBookings]
  );

  const experienceStatusCounts = useMemo(
    () => ({
      PENDING: experienceBookings.filter((b) => b.status === "PENDING").length,
      CONFIRMED: experienceBookings.filter((b) => b.status === "CONFIRMED")
        .length,
      CANCELLED: experienceBookings.filter((b) => b.status === "CANCELLED")
        .length,
    }),
    [experienceBookings]
  );

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
      toast.error("Unable to load bookings");
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmHomeBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      await confirmHomeBooking(bookingId);
      toast.success("Home booking confirmed successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Unable to confirm home booking");
      console.error("Error confirming booking:", error);
    } finally {
      setConfirmingId(null);
    }
  };

  const handleConfirmExperienceBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      await confirmExperienceBooking(bookingId);
      toast.success("Experience booking confirmed successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Unable to confirm experience booking");
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
            <h1 className="text-4xl font-bold mb-2">Bookings</h1>
            <p className="text-muted-foreground">
              Manage bookings for your listings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{totalBookings}</div>
                <p className="text-sm text-muted-foreground">Total bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {pendingBookings}
                </div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">
                  ${formatPrice(totalRevenue)}
                </div>
                <p className="text-sm text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v as BookingType);
              setStatusFilter("ALL");
            }}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Homes ({homeBookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Experiences ({experienceBookings.length})
              </TabsTrigger>
            </TabsList>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={statusFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("ALL")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                All (
                {activeTab === "home"
                  ? homeBookings.length
                  : experienceBookings.length}
                )
              </Button>
              <Button
                variant={
                  statusFilter === BookingStatus.PENDING ? "default" : "outline"
                }
                size="sm"
                onClick={() => setStatusFilter(BookingStatus.PENDING)}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Pending (
                {activeTab === "home"
                  ? homeStatusCounts.PENDING
                  : experienceStatusCounts.PENDING}
                )
              </Button>
              <Button
                variant={
                  statusFilter === BookingStatus.CONFIRMED
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setStatusFilter(BookingStatus.CONFIRMED)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirmed (
                {activeTab === "home"
                  ? homeStatusCounts.CONFIRMED
                  : experienceStatusCounts.CONFIRMED}
                )
              </Button>
              <Button
                variant={
                  statusFilter === BookingStatus.CANCELLED
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => setStatusFilter(BookingStatus.CANCELLED)}
                className="flex items-center gap-2"
              >
                <Ban className="h-4 w-4" />
                Cancelled (
                {activeTab === "home"
                  ? homeStatusCounts.CANCELLED
                  : experienceStatusCounts.CANCELLED}
                )
              </Button>
            </div>

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
              ) : filteredHomeBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      {statusFilter === "ALL"
                        ? "No home bookings yet"
                        : "No bookings with this status"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {statusFilter === "ALL"
                        ? "When guests book your home, bookings will appear here"
                        : "Try selecting a different status to view bookings"}
                    </p>
                    {statusFilter === "ALL" && (
                      <Button
                        onClick={() => navigate("/my-listings")}
                        size="lg"
                      >
                        View my listings
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredHomeBookings.map((booking) => (
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
                              Booking ID: {booking.id.slice(0, 8)}...
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
                              Customer
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Check-in
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
                                Check-out
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
                                Guests
                              </p>
                              <p className="font-medium">
                                {booking.guests}{" "}
                                {booking.guests === 1 ? "guest" : "guests"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>
                            <p className="font-bold text-lg">
                              ${formatPrice(booking.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Booked on: {formatDate(booking.createdAt)}
                            </p>
                            <Badge
                              variant={booking.isPaid ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {booking.isPaid ? "Paid" : "Unpaid"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "PENDING" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    disabled={confirmingId === booking.id}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    {confirmingId === booking.id
                                      ? "Confirming..."
                                      : "Confirm"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm home booking?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to confirm this
                                      booking? The customer will receive a
                                      confirmation notification.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleConfirmHomeBooking(booking.id)
                                      }
                                    >
                                      Confirm booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/listings/${booking.homeListingId}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View listing
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
              ) : filteredExperienceBookings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">
                      {statusFilter === "ALL"
                        ? "No experience bookings yet"
                        : "No bookings with this status"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {statusFilter === "ALL"
                        ? "When guests book your experience, bookings will appear here"
                        : "Try selecting a different status to view bookings"}
                    </p>
                    {statusFilter === "ALL" && (
                      <Button
                        onClick={() => navigate("/my-listings")}
                        size="lg"
                      >
                        View my listings
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExperienceBookings.map((booking) => (
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
                              Booking ID: {booking.id.slice(0, 8)}...
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
                              Customer
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Start
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
                                End
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
                                Participants
                              </p>
                              <p className="font-medium">
                                {booking.quantity}{" "}
                                {booking.quantity === 1 ? "person" : "people"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Total
                            </p>
                            <p className="font-bold text-lg">
                              ${formatPrice(booking.totalPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t pt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Booked on: {formatDate(booking.createdAt)}
                            </p>
                            <Badge
                              variant={booking.isPaid ? "default" : "secondary"}
                              className="mt-1"
                            >
                              {booking.isPaid ? "Paid" : "Unpaid"}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {booking.status === "PENDING" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    disabled={confirmingId === booking.id}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    {confirmingId === booking.id
                                      ? "Confirming..."
                                      : "Confirm"}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Confirm experience booking?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to confirm this
                                      experience booking? The customer will
                                      receive a confirmation notification.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleConfirmExperienceBooking(
                                          booking.id
                                        )
                                      }
                                    >
                                      Confirm booking
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
                              View listing
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
