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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { AmenityResponse } from "@/types/response/amenityResponse";

export function AmenityManagement() {
  const { amenities, loading, getAllAmenities } = useAmenityStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAmenity, setSelectedAmenity] =
    useState<AmenityResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllAmenities();
  }, [getAllAmenities]);

  const handleCreate = async () => {
    try {
      // TODO: Implement create API call
      toast.success("Amenity created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllAmenities();
    } catch (error) {
      console.error("Failed to create amenity:", error);
      toast.error("Failed to create amenity");
    }
  };

  const handleEdit = async () => {
    try {
      // TODO: Implement update API call with selectedAmenity.id
      console.log("Updating amenity:", selectedAmenity);
      toast.success("Amenity updated successfully");
      setIsEditOpen(false);
      setSelectedAmenity(null);
      getAllAmenities();
    } catch (error) {
      console.error("Failed to update amenity:", error);
      toast.error("Failed to update amenity");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    try {
      // TODO: Implement delete API call with id
      console.log("Deleting amenity:", id);
      toast.success("Amenity deleted successfully");
      getAllAmenities();
    } catch (error) {
      console.error("Failed to delete amenity:", error);
      toast.error("Failed to delete amenity");
    }
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
                      onClick={() => handleDelete(amenity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
      </CardContent>
    </Card>
  );
}
