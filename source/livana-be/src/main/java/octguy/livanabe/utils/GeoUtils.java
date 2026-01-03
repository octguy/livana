package octguy.livanabe.utils;

/**
 * Utility class for geographic calculations
 */
public class GeoUtils {
    
    // Earth's radius in kilometers
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    /**
     * Calculate distance between two geographic points using the Haversine formula.
     * 
     * @param lat1 Latitude of point 1 (in degrees)
     * @param lon1 Longitude of point 1 (in degrees)
     * @param lat2 Latitude of point 2 (in degrees)
     * @param lon2 Longitude of point 2 (in degrees)
     * @return Distance in kilometers
     */
    public static double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
    
    /**
     * Check if a point is within a certain radius of another point.
     * 
     * @param centerLat Center point latitude
     * @param centerLon Center point longitude
     * @param pointLat Point to check latitude
     * @param pointLon Point to check longitude
     * @param radiusKm Radius in kilometers
     * @return true if point is within radius
     */
    public static boolean isWithinRadius(double centerLat, double centerLon, 
                                         double pointLat, double pointLon, 
                                         double radiusKm) {
        return calculateDistance(centerLat, centerLon, pointLat, pointLon) <= radiusKm;
    }
    
    /**
     * Calculate bounding box for a given center point and radius.
     * This is useful for initial database filtering before applying precise distance calculation.
     * 
     * @param lat Center latitude
     * @param lon Center longitude
     * @param radiusKm Radius in kilometers
     * @return Array of [minLat, maxLat, minLon, maxLon]
     */
    public static double[] getBoundingBox(double lat, double lon, double radiusKm) {
        // Approximate degrees per km
        double latDelta = radiusKm / 111.0; // 1 degree latitude ≈ 111 km
        double lonDelta = radiusKm / (111.0 * Math.cos(Math.toRadians(lat)));
        
        return new double[] {
            lat - latDelta,  // minLat
            lat + latDelta,  // maxLat
            lon - lonDelta,  // minLon
            lon + lonDelta   // maxLon
        };
    }
}
