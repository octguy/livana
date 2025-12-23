import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAmenityStore } from "@/stores/useAmenityStore";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { AmenityResponse } from "@/types/response/amenityResponse";

export function AmenityManagement() {
  const {
    amenities,
    loading,
    currentPage,
    totalPages,
    getAllAmenities,
    createAmenity,
    updateAmenity,
    deleteAmenity,
  } = useAmenityStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAmenity, setSelectedAmenity] =
    useState<AmenityResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllAmenities(0, 15);
  }, [getAllAmenities]);

  const handlePageChange = (newPage: number) => {
    getAllAmenities(newPage, 15);
  };

  const handleCreate = async () => {
    try {
      await createAmenity(formData.name, formData.icon);
      toast.success("Amenity created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllAmenities(currentPage, 15);
    } catch (error) {
      console.error("Failed to create amenity:", error);
      toast.error("Failed to create amenity");
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedAmenity) return;
      await updateAmenity(selectedAmenity.id, formData.name, formData.icon);
      toast.success("Amenity updated successfully");
      setIsEditOpen(false);
      setSelectedAmenity(null);
      getAllAmenities(currentPage, 15);
    } catch (error) {
      console.error("Failed to update amenity:", error);
      toast.error("Failed to update amenity");
    }
  };

  const handleDelete = async () => {
    if (!selectedAmenity || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteAmenity(selectedAmenity.id);
      toast.success("Amenity deleted successfully");
      await getAllAmenities(currentPage, 15);
      setIsDeleteOpen(false);
      setSelectedAmenity(null);
    } catch (error) {
      console.error("Failed to delete amenity:", error);
      toast.error("Failed to delete amenity");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (amenity: AmenityResponse) => {
    setSelectedAmenity(amenity);
    setIsDeleteOpen(true);
  };
  const openEditDialog = (amenity: AmenityResponse) => {
    setSelectedAmenity(amenity);
    setFormData({ name: amenity.name, icon: amenity.icon });
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Amenity Management</CardTitle>
            <CardDescription>
              Create, edit, and delete property amenities
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Amenity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Amenity</DialogTitle>
                <DialogDescription>
                  Add a new amenity for properties
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter amenity name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (emoji)</Label>
                  <Input
                    id="icon"
                    placeholder="Enter emoji icon"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading amenities...
          </div>
        ) : (
          <div className="space-y-2">
            {amenities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No amenities found
              </div>
            ) : (
              amenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{amenity.icon}</span>
                    <span className="font-medium">{amenity.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(amenity)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(amenity)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Amenity</DialogTitle>
              <DialogDescription>Update amenity information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter amenity name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon (emoji)</Label>
                <Input
                  id="edit-icon"
                  placeholder="Enter emoji icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Amenity</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedAmenity?.name}"? This
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
                onClick={handleDelete}
                disabled={isDeleting}
                variant="destructive"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
