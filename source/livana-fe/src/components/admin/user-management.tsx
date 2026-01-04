import { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { adminUserService } from "@/services/adminUserService";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Shield,
  UserCog,
  Trash2,
  Power,
  RefreshCw,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type {
  AdminUserResponse,
  UserStatus,
  UserRole,
} from "@/types/response/adminUserResponse";
import { cn } from "@/lib/utils";

const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: "ROLE_USER", label: "User" },
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_MODERATOR", label: "Moderator" },
];

const USER_STATUSES: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "BANNED", label: "Banned" },
  { value: "PENDING_VERIFICATION", label: "Pending" },
];

export function UserManagement() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(
    null
  );
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>("ACTIVE");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminUserService.getAllUsers({
        page: currentPage,
        size: 10,
        keyword: searchKeyword || undefined,
        status: statusFilter || undefined,
      });
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchKeyword, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchUsers();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const openRoleDialog = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles as UserRole[]);
    setIsRoleDialogOpen(true);
  };

  const openStatusDialog = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setSelectedStatus(user.status);
    setIsStatusDialogOpen(true);
  };

  const openDeleteDialog = (user: AdminUserResponse) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      toast.error("Please select at least one role");
      return;
    }

    setIsProcessing(true);
    try {
      await adminUserService.updateUserRoles(selectedUser.id, selectedRoles);
      toast.success("User roles updated successfully");
      setIsRoleDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update roles:", error);
      toast.error("Failed to update user roles");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await adminUserService.updateUserStatus(selectedUser.id, selectedStatus);
      toast.success("User status updated successfully");
      setIsStatusDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update user status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleEnabled = async (user: AdminUserResponse) => {
    try {
      await adminUserService.toggleUserEnabled(user.id);
      toast.success(
        `User ${user.enabled ? "disabled" : "enabled"} successfully`
      );
      fetchUsers();
    } catch (error) {
      console.error("Failed to toggle enabled:", error);
      toast.error("Failed to toggle user status");
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await adminUserService.deleteUser(selectedUser.id);
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsProcessing(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "ROLE_MODERATOR":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "BANNED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PENDING_VERIFICATION":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRoleName = (role: string) => {
    return role.replace("ROLE_", "");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions ({totalElements} total
                users)
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchUsers()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? "" : (value as UserStatus));
              setCurrentPage(0);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {USER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatarUrl || ""} />
                            <AvatarFallback>
                              {user.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant="secondary"
                              className={cn("text-xs", getRoleBadgeColor(role))}
                            >
                              {formatRoleName(role)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusBadgeColor(user.status)}
                        >
                          {user.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.enabled ? "default" : "outline"}
                          className={cn(
                            user.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {user.enabled ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLoginAt
                          ? format(new Date(user.lastLoginAt), "MMM d, yyyy")
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openRoleDialog(user)}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Manage Roles
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openStatusDialog(user)}
                            >
                              <UserCog className="h-4 w-4 mr-2" />
                              Change Status
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleEnabled(user)}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {user.enabled ? "Disable" : "Enable"} User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Role Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage User Roles</DialogTitle>
              <DialogDescription>
                Update roles for {selectedUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {USER_ROLES.map((role) => (
                <div key={role.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={role.value}
                    checked={selectedRoles.includes(role.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRoles([...selectedRoles, role.value]);
                      } else {
                        setSelectedRoles(
                          selectedRoles.filter((r) => r !== role.value)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={role.value} className="font-normal">
                    {role.label}
                  </Label>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateRoles} disabled={isProcessing}>
                {isProcessing ? "Updating..." : "Update Roles"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Status</DialogTitle>
              <DialogDescription>
                Update status for {selectedUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) =>
                  setSelectedStatus(value as UserStatus)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isProcessing}>
                {isProcessing ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete user "{selectedUser?.username}"?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={isProcessing}
              >
                {isProcessing ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
