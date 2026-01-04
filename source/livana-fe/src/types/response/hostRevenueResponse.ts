export interface HostRevenueStatsResponse {
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

export interface HostRevenuePeriodResponse {
  period: string;
  startDate: string;
  endDate: string;
  homeBookingGrowth: DataPoint[];
  experienceBookingGrowth: DataPoint[];
  homeRevenueGrowth: RevenueDataPoint[];
  experienceRevenueGrowth: RevenueDataPoint[];
}

export type PeriodType = "DAY" | "MONTH" | "YEAR";
