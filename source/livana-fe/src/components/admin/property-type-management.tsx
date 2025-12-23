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
import { usePropertyTypeStore } from "@/stores/usePropertyTypeStore";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { PropertyTypeResponse } from "@/types/response/propertyTypeResponse";

export function PropertyTypeManagement() {
  const {
    propertyTypes,
    loading,
    currentPage,
    totalPages,
    getAllPropertyTypes,
    createPropertyType,
    updatePropertyType,
    deletePropertyType,
  } = usePropertyTypeStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyTypeResponse | null>(
    null
  );
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllPropertyTypes(0, 15);
  }, [getAllPropertyTypes]);

  const handlePageChange = (newPage: number) => {
    getAllPropertyTypes(newPage, 15);
  };

  const handleCreate = async () => {
    try {
      await createPropertyType(formData.name, formData.icon);
      toast.success("Property type created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllPropertyTypes(currentPage, 15);
    } catch (error) {
      console.error("Failed to create property type:", error);
      toast.error("Failed to create property type");
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedType) return;
      await updatePropertyType(selectedType.id, formData.name, formData.icon);
      toast.success("Property type updated successfully");
      setIsEditOpen(false);
      setSelectedType(null);
      getAllPropertyTypes(currentPage, 15);
    } catch (error) {
      console.error("Failed to update property type:", error);
      toast.error("Failed to update property type");
    }
  };

  const handleDelete = async () => {
    if (!selectedType || isDeleting) return;

    setIsDeleting(true);
    try {
      await deletePropertyType(selectedType.id);
      toast.success("Property type deleted successfully");
      await getAllPropertyTypes(currentPage, 15);
      setIsDeleteOpen(false);
      setSelectedType(null);
    } catch (error) {
      console.error("Failed to delete property type:", error);
      toast.error("Failed to delete property type");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (propertyType: PropertyTypeResponse) => {
    setSelectedType(propertyType);
    setIsDeleteOpen(true);
  };

  const openEditDialog = (type: PropertyTypeResponse) => {
    setSelectedType(type);
    setFormData({ name: type.name, icon: type.icon });
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Property Type Management</CardTitle>
            <CardDescription>
              Create, edit, and delete property types
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Property Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Property Type</DialogTitle>
                <DialogDescription>
                  Add a new type for properties
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter property type name"
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
            Loading property types...
          </div>
        ) : (
          <div className="space-y-2">
            {propertyTypes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No property types found
              </div>
            ) : (
              propertyTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(type)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(type)}
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
              <DialogTitle>Edit Property Type</DialogTitle>
              <DialogDescription>
                Update property type information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter property type name"
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
              <DialogTitle>Delete Property Type</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedType?.name}"? This
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
