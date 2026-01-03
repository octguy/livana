import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Home,
  Compass,
  DollarSign,
  CalendarIcon,
  BarChart3,
  LineChart as LineChartIcon,
  RefreshCw,
} from "lucide-react";
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
import { dashboardService } from "@/services/dashboardService";
import type {
  DashboardStatsResponse,
  PeriodStatsResponse,
  ComparisonStatsResponse,
  PeriodType,
} from "@/types/response/dashboardResponse";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [periodStats, setPeriodStats] = useState<PeriodStatsResponse | null>(
    null
  );
  const [comparisonStats, setComparisonStats] =
    useState<ComparisonStatsResponse | null>(null);

  const [period, setPeriod] = useState<PeriodType>("DAY");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getOverallStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodStats = async () => {
    try {
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      const response = await dashboardService.getPeriodStats(
        period,
        startDate,
        endDate
      );
      setPeriodStats(response.data);
    } catch (error) {
      console.error("Failed to fetch period stats:", error);
    }
  };

  const fetchComparisonStats = async () => {
    try {
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      const response = await dashboardService.getComparisonStats(
        period,
        startDate,
        endDate
      );
      setComparisonStats(response.data);
    } catch (error) {
      console.error("Failed to fetch comparison stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchPeriodStats();
      fetchComparisonStats();
    }
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      subValue: `+${stats?.newUsersToday || 0} today`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
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
  ];

  // Prepare chart data for user growth
  const userGrowthData =
    periodStats?.userGrowth.map((item) => ({
      name: item.label,
      users: item.value,
    })) || [];

  // Prepare chart data for booking comparison
  const bookingComparisonData =
    comparisonStats?.bookingComparison.map((item) => ({
      name: item.label,
      Homes: item.homeValue,
      Experiences: item.experienceValue,
    })) || [];

  // Prepare chart data for revenue comparison
  const revenueComparisonData =
    comparisonStats?.revenueComparison.map((item) => ({
      name: item.label,
      Homes: item.homeValue,
      Experiences: item.experienceValue,
    })) || [];

  // Prepare chart data for listing comparison
  const listingComparisonData =
    comparisonStats?.listingComparison.map((item) => ({
      name: item.label,
      Homes: item.homeValue,
      Experiences: item.experienceValue,
    })) || [];

  return (
    <div className="space-y-6">
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

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Statistics Charts</CardTitle>
              <CardDescription>Track growth and compare data</CardDescription>
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
                  <Button variant="outline" className="min-w-[200px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} -{" "}
                        {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      "Select date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <div className="p-3 border-b">
                    <div className="grid grid-cols-2 gap-2">
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
                  </div>
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                    locale={enUS}
                  />
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  fetchStats();
                  fetchPeriodStats();
                  fetchComparisonStats();
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="growth" className="space-y-4">
            <TabsList>
              <TabsTrigger value="growth">
                <LineChartIcon className="h-4 w-4 mr-2" />
                Growth
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <BarChart3 className="h-4 w-4 mr-2" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="revenue">
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="listings">
                <Home className="h-4 w-4 mr-2" />
                Listings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="growth" className="space-y-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="New users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Homes" fill="#10b981" />
                    <Bar dataKey="Experiences" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis
                      fontSize={12}
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) =>
                        value !== undefined ? formatCurrency(Number(value)) : ""
                      }
                    />
                    <Legend />
                    <Bar dataKey="Homes" fill="#f59e0b" />
                    <Bar dataKey="Experiences" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="listings" className="space-y-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={listingComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Homes" fill="#06b6d4" />
                    <Bar dataKey="Experiences" fill="#f97316" />
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
              <span className="text-muted-foreground">Total listings</span>
              <span className="font-semibold">
                {formatNumber(stats?.totalHomeListings || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total bookings</span>
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
              <Compass className="h-5 w-5 text-purple-600" />
              Experience Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total listings</span>
              <span className="font-semibold">
                {formatNumber(stats?.totalExperienceListings || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total bookings</span>
              <span className="font-semibold">
                {formatNumber(stats?.totalExperienceBookings || 0)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total revenue</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(stats?.totalExperienceRevenue || 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
