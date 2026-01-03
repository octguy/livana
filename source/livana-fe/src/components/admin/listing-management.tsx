import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Home,
  Compass,
  Eye,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllHomeListingsPaginated,
  deleteHomeListing,
  type PaginatedResponse,
} from "@/services/homeListingService";
import {
  getAllExperienceListingsPaginated,
  deleteExperienceListing,
} from "@/services/experienceListingService";
import type { HomeListingResponse } from "@/types/response/homeListingResponse";
import type { ExperienceListingResponse } from "@/types/response/experienceListingResponse";

export function ListingManagement() {
  const [activeTab, setActiveTab] = useState<"homes" | "experiences">("homes");

  // Home listings state
  const [homeListings, setHomeListings] = useState<HomeListingResponse[]>([]);
  const [homeLoading, setHomeLoading] = useState(false);
  const [homeCurrentPage, setHomeCurrentPage] = useState(0);
  const [homeTotalPages, setHomeTotalPages] = useState(0);
  const [homeTotalElements, setHomeTotalElements] = useState(0);

  // Experience listings state
  const [experienceListings, setExperienceListings] = useState<
    ExperienceListingResponse[]
  >([]);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceCurrentPage, setExperienceCurrentPage] = useState(0);
  const [experienceTotalPages, setExperienceTotalPages] = useState(0);
  const [experienceTotalElements, setExperienceTotalElements] = useState(0);

  // Delete dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{
    id: string;
    title: string;
    type: "home" | "experience";
  } | null>(null);

  // View detail dialog state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailListing, setDetailListing] = useState<
    HomeListingResponse | ExperienceListingResponse | null
  >(null);
  const [detailType, setDetailType] = useState<"home" | "experience">("home");

  // Page size
  const [pageSize, setPageSize] = useState(10);

  const fetchHomeListings = useCallback(
    async (page: number) => {
      setHomeLoading(true);
      try {
        const response = await getAllHomeListingsPaginated(page, pageSize);
        const data = response.data as PaginatedResponse<HomeListingResponse>;
        setHomeListings(data.content);
        setHomeTotalPages(data.totalPages);
        setHomeTotalElements(data.totalElements);
        setHomeCurrentPage(data.number);
      } catch (error) {
        console.error("Failed to fetch home listings:", error);
        toast.error("Failed to fetch home listings");
      } finally {
        setHomeLoading(false);
      }
    },
    [pageSize]
  );

  const fetchExperienceListings = useCallback(
    async (page: number) => {
      setExperienceLoading(true);
      try {
        const response = await getAllExperienceListingsPaginated(
          page,
          pageSize
        );
        const data =
          response.data as PaginatedResponse<ExperienceListingResponse>;
        setExperienceListings(data.content);
        setExperienceTotalPages(data.totalPages);
        setExperienceTotalElements(data.totalElements);
        setExperienceCurrentPage(data.number);
      } catch (error) {
        console.error("Failed to fetch experience listings:", error);
        toast.error("Failed to fetch experience listings");
      } finally {
        setExperienceLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    if (activeTab === "homes") {
      fetchHomeListings(homeCurrentPage);
    } else {
      fetchExperienceListings(experienceCurrentPage);
    }
  }, [
    activeTab,
    fetchHomeListings,
    fetchExperienceListings,
    homeCurrentPage,
    experienceCurrentPage,
  ]);

  const handleDelete = async () => {
    if (!selectedListing || isDeleting) return;

    setIsDeleting(true);
    try {
      if (selectedListing.type === "home") {
        await deleteHomeListing(selectedListing.id);
        await fetchHomeListings(homeCurrentPage);
      } else {
        await deleteExperienceListing(selectedListing.id);
        await fetchExperienceListings(experienceCurrentPage);
      }
      toast.success("Listing deleted successfully");
      setIsDeleteOpen(false);
      setSelectedListing(null);
    } catch (error) {
      console.error("Failed to delete listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (
    id: string,
    title: string,
    type: "home" | "experience"
  ) => {
    setSelectedListing({ id, title, type });
    setIsDeleteOpen(true);
  };

  const openDetailDialog = (
    listing: HomeListingResponse | ExperienceListingResponse,
    type: "home" | "experience"
  ) => {
    setDetailListing(listing);
    setDetailType(type);
    setIsDetailOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Listing Management</CardTitle>
            <CardDescription>
              Manage all home and experience listings
            </CardDescription>
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "homes" | "experiences")}
        >
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="homes" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Homes ({homeTotalElements})
            </TabsTrigger>
            <TabsTrigger
              value="experiences"
              className="flex items-center gap-2"
            >
              <Compass className="h-4 w-4" />
              Experiences ({experienceTotalElements})
            </TabsTrigger>
          </TabsList>

          {/* Home Listings Tab */}
          <TabsContent value="homes">
            {homeLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading home listings...
              </div>
            ) : homeListings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No home listings found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {homeListings.map((listing) => (
                      <TableRow key={listing.listingId}>
                        <TableCell>
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0].image.url}
                              alt={listing.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                              <Home className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {truncateText(listing.title, 30)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {listing.host.avatarUrl ? (
                              <img
                                src={listing.host.avatarUrl}
                                alt={listing.host.hostDisplayName}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : null}
                            <span className="text-sm">
                              {listing.host.hostDisplayName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {formatPrice(listing.price)}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.capacity} guests</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-[200px]">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{listing.address}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetailDialog(listing, "home")}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                openDeleteDialog(
                                  listing.listingId,
                                  listing.title,
                                  "home"
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {homeListings.length} of {homeTotalElements}{" "}
                    listings
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setHomeCurrentPage(homeCurrentPage - 1)}
                      disabled={homeCurrentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {homeCurrentPage + 1} of {homeTotalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setHomeCurrentPage(homeCurrentPage + 1)}
                      disabled={homeCurrentPage >= homeTotalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Experience Listings Tab */}
          <TabsContent value="experiences">
            {experienceLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading experience listings...
              </div>
            ) : experienceListings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No experience listings found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experienceListings.map((listing) => (
                      <TableRow key={listing.listingId}>
                        <TableCell>
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0].image.url}
                              alt={listing.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                              <Compass className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {truncateText(listing.title, 30)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {listing.host.avatarUrl ? (
                              <img
                                src={listing.host.avatarUrl}
                                alt={listing.host.hostDisplayName}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : null}
                            <span className="text-sm">
                              {listing.host.hostDisplayName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {listing.experienceCategory.icon}{" "}
                            {listing.experienceCategory.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {formatPrice(listing.price)}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.capacity} guests</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                openDetailDialog(listing, "experience")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                openDeleteDialog(
                                  listing.listingId,
                                  listing.title,
                                  "experience"
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {experienceListings.length} of{" "}
                    {experienceTotalElements} listings
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setExperienceCurrentPage(experienceCurrentPage - 1)
                      }
                      disabled={experienceCurrentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {experienceCurrentPage + 1} of{" "}
                      {experienceTotalPages || 1}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setExperienceCurrentPage(experienceCurrentPage + 1)
                      }
                      disabled={
                        experienceCurrentPage >= experienceTotalPages - 1
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Listing</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedListing?.title}"? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail View Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Listing Details</DialogTitle>
            </DialogHeader>
            {detailListing && (
              <div className="space-y-4">
                {/* Images */}
                {detailListing.images && detailListing.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {detailListing.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image.url}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {detailListing.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {detailListing.description}
                  </p>
                </div>

                {/* Host Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  {detailListing.host.avatarUrl && (
                    <img
                      src={detailListing.host.avatarUrl}
                      alt={detailListing.host.hostDisplayName}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">
                      {detailListing.host.hostDisplayName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detailListing.host.phoneNumber}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">
                      {formatPrice(detailListing.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">
                      {detailListing.capacity} guests
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{detailListing.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Latitude</p>
                    <p className="font-medium">{detailListing.latitude}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Longitude</p>
                    <p className="font-medium">{detailListing.longitude}</p>
                  </div>

                  {/* Type-specific info */}
                  {detailType === "home" &&
                    "propertyTypeId" in detailListing && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Property Type ID
                          </p>
                          <p className="font-medium text-xs">
                            {detailListing.propertyTypeId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Facilities
                          </p>
                          <p className="font-medium">
                            {detailListing.facilities?.length || 0} items
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Amenities
                          </p>
                          <p className="font-medium">
                            {detailListing.amenityIds?.length || 0} items
                          </p>
                        </div>
                      </>
                    )}

                  {detailType === "experience" &&
                    "experienceCategory" in detailListing && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Category
                          </p>
                          <Badge variant="outline">
                            {detailListing.experienceCategory.icon}{" "}
                            {detailListing.experienceCategory.name}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Sessions
                          </p>
                          <p className="font-medium">
                            {detailListing.sessions?.length || 0} sessions
                          </p>
                        </div>
                      </>
                    )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
