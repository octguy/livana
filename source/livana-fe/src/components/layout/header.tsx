import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { SettingDropdown } from "../setting/setting-dropdown";
import { useNavigate } from "react-router";

export function Header() {
  const navigate = useNavigate();
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
            <a
              href="/search"
              className="text-sm font-medium hover:text-primary"
            >
              Tìm kiếm
            </a>
            <a
              href="/bookings"
              className="text-sm font-medium hover:text-primary"
            >
              Đặt phòng
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Chuyển sang hosting
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Avatar
            className="h-10 w-10 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src="" alt="User" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <SettingDropdown />
        </div>
      </div>
    </header>
  );
}
