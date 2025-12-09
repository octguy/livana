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
import { useExperienceCategoryStore } from "@/stores/useExperienceCategoryStore";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { ExperienceCategoryResponse } from "@/types/response/experienceCategoryResponse";

export function ExperienceCategoryManagement() {
  const {
    experienceCategories,
    loading,
    currentPage,
    totalPages,
    getAllExperienceCategories,
    createExperienceCategory,
    updateExperienceCategory,
    deleteExperienceCategory,
  } = useExperienceCategoryStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ExperienceCategoryResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllExperienceCategories(0, 15);
  }, [getAllExperienceCategories]);

  const handlePageChange = (newPage: number) => {
    getAllExperienceCategories(newPage, 15);
  };

  const handleCreate = async () => {
    try {
      await createExperienceCategory(formData.name, formData.icon);
      toast.success("Experience category created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllExperienceCategories(currentPage, 15);
    } catch (error) {
      console.error("Failed to create experience category:", error);
      toast.error("Failed to create experience category");
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedCategory) return;
      await updateExperienceCategory(
        selectedCategory.id,
        formData.name,
        formData.icon
      );
      toast.success("Experience category updated successfully");
      setIsEditOpen(false);
      setSelectedCategory(null);
      getAllExperienceCategories(currentPage, 15);
    } catch (error) {
      console.error("Failed to update experience category:", error);
      toast.error("Failed to update experience category");
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteExperienceCategory(selectedCategory.id);
      toast.success("Experience category deleted successfully");
      await getAllExperienceCategories(currentPage, 15);
      setIsDeleteOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Failed to delete experience category:", error);
      toast.error("Failed to delete experience category");
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteDialog = (experienceCategory: ExperienceCategoryResponse) => {
    setSelectedCategory(experienceCategory);
    setIsDeleteOpen(true);
  };

  const openEditDialog = (category: ExperienceCategoryResponse) => {
    setSelectedCategory(category);
    setFormData({ name: category.name, icon: category.icon });
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Experience Category Management</CardTitle>
            <CardDescription>
              Create, edit, and delete experience categories
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Experience Category</DialogTitle>
                <DialogDescription>
                  Add a new category for experiences
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
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
            Loading categories...
          </div>
        ) : (
          <div className="space-y-2">
            {experienceCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No categories found
              </div>
            ) : (
              experienceCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(category)}
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
              <DialogTitle>Edit Experience Category</DialogTitle>
              <DialogDescription>Update category information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter category name"
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
              <DialogTitle>Delete Experience Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedCategory?.name}"? This
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
