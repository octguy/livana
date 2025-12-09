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
import { useInterestStore } from "@/stores/useInterestStore";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { InterestResponse } from "@/types/response/interestResponse";

export function InterestManagement() {
  const { interests, loading, getAllInterests } = useInterestStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] =
    useState<InterestResponse | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  useEffect(() => {
    getAllInterests();
  }, [getAllInterests]);

  const handleCreate = async () => {
    try {
      // TODO: Implement create API call
      toast.success("Interest created successfully");
      setIsCreateOpen(false);
      setFormData({ name: "", icon: "" });
      getAllInterests();
    } catch (error) {
      console.error("Failed to create interest:", error);
      toast.error("Failed to create interest");
    }
  };

  const handleEdit = async () => {
    try {
      // TODO: Implement update API call with selectedInterest.id
      console.log("Updating interest:", selectedInterest);
      toast.success("Interest updated successfully");
      setIsEditOpen(false);
      setSelectedInterest(null);
      getAllInterests();
    } catch (error) {
      console.error("Failed to update interest:", error);
      toast.error("Failed to update interest");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this interest?")) return;

    try {
      // TODO: Implement delete API call with id
      console.log("Deleting interest:", id);
      toast.success("Interest deleted successfully");
      getAllInterests();
    } catch (error) {
      console.error("Failed to delete interest:", error);
      toast.error("Failed to delete interest");
    }
  };
  const openEditDialog = (interest: InterestResponse) => {
    setSelectedInterest(interest);
    setFormData({ name: interest.name, icon: interest.icon });
    setIsEditOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Interest Management</CardTitle>
            <CardDescription>
              Create, edit, and delete user interests
            </CardDescription>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Interest
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Interest</DialogTitle>
                <DialogDescription>
                  Add a new interest for users to select
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter interest name"
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
            Loading interests...
          </div>
        ) : (
          <div className="space-y-2">
            {interests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No interests found
              </div>
            ) : (
              interests.map((interest) => (
                <div
                  key={interest.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{interest.icon}</span>
                    <span className="font-medium">{interest.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditDialog(interest)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(interest.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Interest</DialogTitle>
              <DialogDescription>Update interest information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  placeholder="Enter interest name"
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
