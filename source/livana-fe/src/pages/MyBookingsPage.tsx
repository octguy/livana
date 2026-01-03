import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import {
  getMyHomeBookings,
  cancelHomeBooking,
} from "@/services/homeBookingService";
import {
  getMyExperienceBookings,
  cancelExperienceBooking,
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
  X,
  Eye,
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

export function MyBookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [homeBookings, setHomeBookings] = useState<HomeBookingResponse[]>([]);
  const [experienceBookings, setExperienceBookings] = useState<
    ExperienceBookingResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingType>("home");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
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
        getMyHomeBookings(),
        getMyExperienceBookings(),
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

  const handleCancelHomeBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelHomeBooking(bookingId);
      toast.success("Home booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Unable to cancel home booking");
      console.error("Error cancelling booking:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const handleCancelExperienceBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelExperienceBooking(bookingId);
      toast.success("Experience booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Unable to cancel experience booking");
      console.error("Error cancelling booking:", error);
    } finally {
      setCancellingId(null);
    }
  };

  const totalBookings = homeBookings.length + experienceBookings.length;

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              {totalBookings} total bookings
              {" • "}
              {homeBookings.length} homes{" • "}
              {experienceBookings.length} experiences
            </p>
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
                        ? "You don't have any home bookings yet"
                        : `No bookings with this status`}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {statusFilter === "ALL"
                        ? "Explore amazing places and book now"
                        : "Try selecting a different status to view bookings"}
                    </p>
                    {statusFilter === "ALL" && (
                      <Button onClick={() => navigate("/")} size="lg">
                        Explore homes
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
                          <p className="text-sm text-muted-foreground">
                            Booked on: {formatDate(booking.createdAt)}
                          </p>
                          <div className="flex gap-2">
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
                            {booking.status !== "CANCELLED" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={cancellingId === booking.id}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Cancel home booking?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this
                                      booking? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleCancelHomeBooking(booking.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Confirm cancel
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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
                        ? "You don't have any experience bookings yet"
                        : `No bookings with this status`}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {statusFilter === "ALL"
                        ? "Explore unique experiences and book now"
                        : "Try selecting a different status to view bookings"}
                    </p>
                    {statusFilter === "ALL" && (
                      <Button
                        onClick={() => navigate("/experiences")}
                        size="lg"
                      >
                        Explore experiences
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
                          <p className="text-sm text-muted-foreground">
                            Booked on: {formatDate(booking.createdAt)}
                          </p>
                          <div className="flex gap-2">
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
                            {booking.status !== "CANCELLED" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={cancellingId === booking.id}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Cancel experience booking?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to cancel this
                                      experience booking? This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleCancelExperienceBooking(
                                          booking.id
                                        )
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Confirm cancel
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
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
