export interface DashboardStatsResponse {
  totalUsers: number;
  newUsersToday: number;
  activeUsers: number;
  totalHomeListings: number;
  totalExperienceListings: number;
  totalListings: number;
  totalHomeBookings: number;
  totalExperienceBookings: number;
  totalBookings: number;
  totalHomeRevenue: number;
  totalExperienceRevenue: number;
  totalRevenue: number;
}

export interface DataPoint {
  label: string;
  value: number;
}

export interface RevenueDataPoint {
  label: string;
  value: number;
}

export interface PeriodStatsResponse {
  period: string;
  startDate: string;
  endDate: string;
  userGrowth: DataPoint[];
  homeListingGrowth: DataPoint[];
  experienceListingGrowth: DataPoint[];
  homeBookingGrowth: DataPoint[];
  experienceBookingGrowth: DataPoint[];
  homeRevenueGrowth: RevenueDataPoint[];
  experienceRevenueGrowth: RevenueDataPoint[];
}

export interface ComparisonDataPoint {
  label: string;
  homeValue: number;
  experienceValue: number;
}

export interface RevenueComparisonDataPoint {
  label: string;
  homeValue: number;
  experienceValue: number;
}

export interface ComparisonStatsResponse {
  period: string;
  startDate: string;
  endDate: string;
  listingComparison: ComparisonDataPoint[];
  bookingComparison: ComparisonDataPoint[];
  revenueComparison: RevenueComparisonDataPoint[];
}

export type PeriodType = "DAY" | "MONTH" | "YEAR";
