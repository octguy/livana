import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InterestManagement,
  ExperienceCategoryManagement,
  PropertyTypeManagement,
  FacilityManagement,
  AmenityManagement,
} from "@/components/admin";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  LayoutDashboard,
  Tags,
  Compass,
  Home,
  Wrench,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminDashboardPage = () => {
  const user = useAuthStore((s) => s.user);
  const [activeSection, setActiveSection] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "interests", label: "Interests", icon: Tags },
    { id: "experiences", label: "Experience Categories", icon: Compass },
    { id: "properties", label: "Property Types", icon: Home },
    { id: "facilities", label: "Facilities", icon: Wrench },
    { id: "amenities", label: "Amenities", icon: Sparkles },
  ];

  return (
    <MainLayout>
      <div className="flex min-h-screen bg-background">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-muted/40 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {user?.username}
            </p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeSection === "overview" && (
              <div>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">
                    Dashboard Overview
                  </h1>
                  <p className="text-muted-foreground">
                    Manage system entities and configurations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("interests")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tags className="w-5 h-5" />
                        Interests
                      </CardTitle>
                      <CardDescription>
                        Manage user interests and preferences
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("experiences")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="w-5 h-5" />
                        Experience Categories
                      </CardTitle>
                      <CardDescription>
                        Manage experience categories
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("properties")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        Property Types
                      </CardTitle>
                      <CardDescription>Manage property types</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("facilities")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Facilities
                      </CardTitle>
                      <CardDescription>
                        Manage property facilities
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setActiveSection("amenities")}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Amenities
                      </CardTitle>
                      <CardDescription>
                        Manage property amenities
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "interests" && <InterestManagement />}
            {activeSection === "experiences" && (
              <ExperienceCategoryManagement />
            )}
            {activeSection === "properties" && <PropertyTypeManagement />}
            {activeSection === "facilities" && <FacilityManagement />}
            {activeSection === "amenities" && <AmenityManagement />}
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;
