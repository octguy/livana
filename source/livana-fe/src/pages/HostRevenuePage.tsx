import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { Footer } from "@/components/layout/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Sparkles,
  DollarSign,
  BarChart3,
  CalendarIcon,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { hostRevenueService } from "@/services/hostRevenueService";
import type {
  HostRevenueStatsResponse,
  HostRevenuePeriodResponse,
  PeriodType,
} from "@/types/response/hostRevenueResponse";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function HostRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<HostRevenueStatsResponse | null>(null);
  const [periodStats, setPeriodStats] =
    useState<HostRevenuePeriodResponse | null>(null);
  const [period, setPeriod] = useState<PeriodType>("DAY");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await hostRevenueService.getOverallStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load revenue statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodStats = async () => {
    try {
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      const response = await hostRevenueService.getPeriodStats(
        period,
        startDate,
        endDate
      );
      setPeriodStats(response.data);
    } catch (error) {
      console.error("Failed to fetch period stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchPeriodStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, dateRange]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const quickDateRanges = [
    {
      label: "Last 7 days",
      getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
    },
    {
      label: "Last 30 days",
      getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
    },
    {
      label: "This month",
      getValue: () => ({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
      }),
    },
    {
      label: "Last 3 months",
      getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
    },
    {
      label: "Last 6 months",
      getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
    },
    {
      label: "Last 12 months",
      getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
    },
  ];

  if (loading) {
    return (
      <>
        <PublicHeader />
        <div className="min-h-screen bg-background">
          <div className="container max-w-7xl mx-auto py-8 px-6">
            <div className="space-y-6">
              <Skeleton className="h-10 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Prepare chart data
  const bookingChartData =
    periodStats?.homeBookingGrowth?.map((item, index) => ({
      name: item.label,
      Homes: item.value,
      Experiences: periodStats?.experienceBookingGrowth?.[index]?.value || 0,
    })) || [];

  const revenueChartData =
    periodStats?.homeRevenueGrowth?.map((item, index) => ({
      name: item.label,
      Homes: item.value,
      Experiences: periodStats?.experienceRevenueGrowth?.[index]?.value || 0,
    })) || [];

  const statsCards = [
    {
      title: "Total Listings",
      value: stats?.totalListings || 0,
      subValue: `${stats?.totalHomeListings || 0} homes • ${
        stats?.totalExperienceListings || 0
      } experiences`,
      icon: Home,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings || 0,
      subValue: `${stats?.totalHomeBookings || 0} homes • ${
        stats?.totalExperienceBookings || 0
      } experiences`,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue || 0),
      subValue: `Homes: ${formatCurrency(stats?.totalHomeRevenue || 0)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      isRevenue: true,
    },
    {
      title: "Experience Revenue",
      value: formatCurrency(stats?.totalExperienceRevenue || 0),
      subValue: "From experience bookings",
      icon: Sparkles,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      isRevenue: true,
    },
  ];

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto py-8 px-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
                <p className="text-muted-foreground">
                  Track your earnings and booking statistics
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                        <Icon className={cn("h-4 w-4", stat.color)} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={cn(
                          "text-2xl font-bold",
                          stat.isRevenue && "text-xl"
                        )}
                      >
                        {stat.isRevenue
                          ? stat.value
                          : formatNumber(stat.value as number)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.subValue}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Revenue Analytics</CardTitle>
                    <CardDescription>
                      Track bookings and revenue over time
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={period}
                      onValueChange={(v) => setPeriod(v as PeriodType)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAY">By day</SelectItem>
                        <SelectItem value="MONTH">By month</SelectItem>
                        <SelectItem value="YEAR">By year</SelectItem>
                      </SelectContent>
                    </Select>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from && dateRange.to ? (
                            <>
                              {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                              {format(dateRange.to, "MMM dd, yyyy")}
                            </>
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="end">
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {quickDateRanges.map((range) => (
                              <Button
                                key={range.label}
                                variant="outline"
                                size="sm"
                                onClick={() => setDateRange(range.getValue())}
                              >
                                {range.label}
                              </Button>
                            ))}
                          </div>
                          <Calendar
                            mode="range"
                            selected={{
                              from: dateRange.from,
                              to: dateRange.to,
                            }}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange({
                                  from: range.from,
                                  to: range.to,
                                });
                              }
                            }}
                            numberOfMonths={2}
                            locale={enUS}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        fetchStats();
                        fetchPeriodStats();
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bookings" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="bookings">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Bookings
                    </TabsTrigger>
                    <TabsTrigger value="revenue">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Revenue
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="bookings" className="space-y-4">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <LineChart data={bookingChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="Homes"
                            stroke="#10b981"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="Experiences"
                            stroke="#ec4899"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="revenue" className="space-y-4">
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <BarChart data={revenueChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis
                            fontSize={12}
                            tickFormatter={(value) =>
                              value >= 1000000
                                ? `${(value / 1000000).toFixed(0)}M`
                                : value >= 1000
                                ? `${(value / 1000).toFixed(0)}K`
                                : value
                            }
                          />
                          <Tooltip
                            formatter={(value) =>
                              value !== undefined
                                ? formatCurrency(Number(value))
                                : ""
                            }
                          />
                          <Legend />
                          <Bar dataKey="Homes" fill="#10b981" />
                          <Bar dataKey="Experiences" fill="#ec4899" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-5 w-5 text-emerald-600" />
                    Home Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total listings
                    </span>
                    <span className="font-semibold">
                      {formatNumber(stats?.totalHomeListings || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total bookings
                    </span>
                    <span className="font-semibold">
                      {formatNumber(stats?.totalHomeBookings || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total revenue</span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(stats?.totalHomeRevenue || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-pink-600" />
                    Experience Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total listings
                    </span>
                    <span className="font-semibold">
                      {formatNumber(stats?.totalExperienceListings || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Total bookings
                    </span>
                    <span className="font-semibold">
                      {formatNumber(stats?.totalExperienceBookings || 0)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total revenue</span>
                    <span className="font-semibold text-pink-600">
                      {formatCurrency(stats?.totalExperienceRevenue || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
