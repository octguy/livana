import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Home, ListChecks } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HostingDialog } from "@/components/hosting/hosting-dialog";

export function PublicHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hostingDialogOpen, setHostingDialogOpen] = useState(false);
  const { user, logOut } = useAuthStore();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const getFirstLetter = (fullName: string) => {
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b border-border sticky top-0 bg-background z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/src/assets/livana_logo.png"
              alt="Livana Logo"
              className="h-16 w-16"
            />
            <span className="text-xl font-bold text-primary">livana</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary">
              Trang chủ
            </a>
            <a
              href="/experiences"
              className="text-sm font-medium hover:text-primary"
            >
              Trải nghiệm
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Login/Signup or User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHostingDialogOpen(true)}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Trở thành chủ nhà
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.avatarUrl || ""}
                          alt={user.fullName}
                        />
                        <AvatarFallback>
                          {getFirstLetter(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.fullName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <User className="mr-2 h-4 w-4" />
                      Bảng điều khiển
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Hồ sơ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/my-listings")}>
                      <ListChecks className="mr-2 h-4 w-4" />
                      Tin đăng của tôi
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button size="sm" onClick={() => navigate("/signup")}>
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <a
                  href="/"
                  className="text-base font-medium hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trang chủ
                </a>
                <a
                  href="/experiences"
                  className="text-base font-medium hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trải nghiệm
                </a>
                <div className="border-t pt-4 mt-4 flex flex-col gap-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2 py-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.avatarUrl || ""}
                            alt={user.fullName}
                          />
                          <AvatarFallback>
                            {getFirstLetter(user.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/dashboard");
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Bảng điều khiển
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Hồ sơ
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login");
                        }}
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/signup");
                        }}
                      >
                        Đăng ký
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <HostingDialog
        open={hostingDialogOpen}
        onOpenChange={setHostingDialogOpen}
      />
    </header>
  );
}
