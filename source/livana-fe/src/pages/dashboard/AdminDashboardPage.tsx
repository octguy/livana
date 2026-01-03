import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  InterestManagement,
  ExperienceCategoryManagement,
  PropertyTypeManagement,
  FacilityManagement,
  AmenityManagement,
  DashboardOverview,
  ListingManagement,
} from "@/components/admin";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  LayoutDashboard,
  Tags,
  Compass,
  Home,
  Wrench,
  Sparkles,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Activity,
  Settings,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SectionId =
  | "overview"
  | "listings"
  | "interests"
  | "experiences"
  | "properties"
  | "facilities"
  | "amenities";

const AdminDashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const menuItems: {
    id: SectionId;
    label: string;
    icon: typeof LayoutDashboard;
    description: string;
  }[] = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: LayoutDashboard,
      description: "Xem tổng quan hệ thống",
    },
    {
      id: "listings",
      label: "Quản lý Listings",
      icon: Building2,
      description: "Quản lý tất cả listings",
    },
    {
      id: "interests",
      label: "Sở thích",
      icon: Tags,
      description: "Quản lý sở thích người dùng",
    },
    {
      id: "experiences",
      label: "Danh mục trải nghiệm",
      icon: Compass,
      description: "Quản lý danh mục trải nghiệm",
    },
    {
      id: "properties",
      label: "Loại bất động sản",
      icon: Home,
      description: "Quản lý loại bất động sản",
    },
    {
      id: "facilities",
      label: "Tiện nghi",
      icon: Wrench,
      description: "Quản lý tiện nghi cơ sở",
    },
    {
      id: "amenities",
      label: "Đồ dùng",
      icon: Sparkles,
      description: "Quản lý đồ dùng phòng",
    },
  ];

  const getSectionTitle = (id: SectionId): string => {
    const item = menuItems.find((m) => m.id === id);
    return item?.label || "Dashboard";
  };

  return (
    <MainLayout>
      <TooltipProvider>
        <div className="flex min-h-[calc(100vh-4rem)] bg-background">
          {/* Left Sidebar */}
          <aside
            className={cn(
              "border-r bg-card transition-all duration-300 flex flex-col",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <div
                className={cn(
                  "flex items-center gap-3",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary-foreground" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="font-semibold">Admin Panel</h2>
                    <p className="text-xs text-muted-foreground">
                      Quản lý hệ thống
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 p-3">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.id} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                              "w-full flex items-center justify-center p-3 rounded-lg transition-all",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 opacity-0 -translate-x-2 transition-all",
                          isActive
                            ? "opacity-100 translate-x-0"
                            : "group-hover:opacity-50 group-hover:translate-x-0"
                        )}
                      />
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Sidebar Footer */}
            <div className="p-3 border-t">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl || ""} />
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Administrator
                    </p>
                  </div>
                </div>
              )}
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size={sidebarCollapsed ? "icon" : "sm"}
                    className={cn(
                      "w-full",
                      !sidebarCollapsed && "justify-start"
                    )}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? (
                      <PanelLeft className="h-5 w-5" />
                    ) : (
                      <>
                        <PanelLeftClose className="h-5 w-5 mr-2" />
                        Thu gọn
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {sidebarCollapsed && (
                  <TooltipContent side="right">Mở rộng sidebar</TooltipContent>
                )}
              </Tooltip>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Top Bar */}
            <header className="h-14 border-b bg-card px-6 flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection("overview");
                      }}
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeSection !== "overview" && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>
                          {getSectionTitle(activeSection)}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Trạng thái hệ thống
                </Button>
              </div>
            </header>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                {activeSection === "overview" && <DashboardOverview />}

                {activeSection === "listings" && <ListingManagement />}
                {activeSection === "interests" && <InterestManagement />}
                {activeSection === "experiences" && (
                  <ExperienceCategoryManagement />
                )}
                {activeSection === "properties" && <PropertyTypeManagement />}
                {activeSection === "facilities" && <FacilityManagement />}
                {activeSection === "amenities" && <AmenityManagement />}
              </div>
            </ScrollArea>
          </main>
        </div>
      </TooltipProvider>
    </MainLayout>
  );
};

export default AdminDashboardPage;
