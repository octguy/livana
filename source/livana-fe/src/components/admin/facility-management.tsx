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
import { useFacilityStore } from "@/stores/useFacilityStore";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { FacilityResponse } from "@/types/response/facilityResponse";

export function FacilityManagement() {
  const { facilities, loading, getAllFacilities } = useFacilityStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] =
    useState<FacilityResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllFacilities();
  }, [getAllFacilities]);

  const handleCreate = async () => {
    try {
      console.log("Create facility:", {
        name: formData.name,
        icon: formData.icon,
      });
      toast.success("Facility created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllFacilities();
    } catch (error) {
      console.error("Failed to create facility:", error);
      toast.error("Failed to create facility");
    }
  };

  const handleEdit = async () => {
    try {
      console.log("Update facility:", {
        id: selectedFacility?.id,
        name: formData.name,
        icon: formData.icon,
      });
      toast.success("Facility updated successfully");
      setIsEditOpen(false);
      setSelectedFacility(null);
      getAllFacilities();
    } catch (error) {
      console.error("Failed to update facility:", error);
      toast.error("Failed to update facility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this facility?")) return;

    try {
      // TODO: Implement delete API call with id
      console.log("Deleting facility:", id);
      toast.success("Facility deleted successfully");
      getAllFacilities();
    } catch (error) {
      console.error("Failed to delete facility:", error);
      toast.error("Failed to delete facility");
    }
  };
  const openEditDialog = (facility: FacilityResponse) => {
    setSelectedFacility(facility);
    setFormData({ name: facility.name, icon: facility.icon });
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Facility Management</CardTitle>
            <CardDescription>
              Create, edit, and delete property facilities
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Facility</DialogTitle>
                <DialogDescription>
                  Add a new facility for properties
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter facility name"
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
            Loading facilities...
          </div>
        ) : (
          <div className="space-y-2">
            {facilities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No facilities found
              </div>
            ) : (
              facilities.map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{facility.icon}</span>
                    <span className="font-medium">{facility.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(facility)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(facility.id)}
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
              <DialogTitle>Edit Facility</DialogTitle>
              <DialogDescription>Update facility information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter facility name"
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
