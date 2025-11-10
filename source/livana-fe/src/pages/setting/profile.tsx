import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Camera,
  GraduationCap,
  Briefcase,
  MapPin,
  Heart,
  Lightbulb,
  Music,
  Globe,
} from "lucide-react";

export function ProfilePage() {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-semibold mb-2">Hồ sơ của tôi</h1>
        <p className="text-muted-foreground">
          Người dùng và chủ nhà có thể xem hồ sơ của bạn để xây dựng lòng tin
          trong cộng đồng.
        </p>

        {/* Avatar Section */}
        <div className="flex items-start gap-8 mb-12">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback className="text-3xl">T</AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-md"
            >
              <Camera className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Ảnh đại diện</h2>
            <p className="text-sm text-muted-foreground">
              Nhấn vào biểu tượng máy ảnh để thay đổi ảnh đại diện của bạn
            </p>
          </div>
        </div>

        {/* Profile Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Full Name */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Họ và tên</label>
            </div>
            <Input type="text" placeholder="Nguyễn Văn A" className="w-full" />
          </div>

          {/* Phone Number */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Số điện thoại</label>
            </div>
            <Input type="tel" placeholder="0123456789" className="w-full" />
          </div>

          {/* Where I went to school */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Trường học</label>
            </div>
            <Input type="text" placeholder="Đại học..." className="w-full" />
          </div>

          {/* My work */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Công việc</label>
            </div>
            <Input
              type="text"
              placeholder="Software Engineer..."
              className="w-full"
            />
          </div>

          {/* Where I've always wanted to go */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Nơi tôi muốn đến</label>
            </div>
            <Input
              type="text"
              placeholder="Paris, Tokyo..."
              className="w-full"
            />
          </div>

          {/* Favorite song */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Bài hát yêu thích</label>
            </div>
            <Input
              type="text"
              placeholder="Tên bài hát..."
              className="w-full"
            />
          </div>

          {/* My fun fact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Sự thật thú vị</label>
            </div>
            <Input
              type="text"
              placeholder="Điều thú vị về bạn..."
              className="w-full"
            />
          </div>

          {/* Languages I speak */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <label className="text-sm font-medium">Ngôn ngữ</label>
            </div>
            <Input
              type="text"
              placeholder="Tiếng Việt, English..."
              className="w-full"
            />
          </div>
        </div>

        {/* My Interests Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Sở thích của tôi</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tìm điểm chung với người dùng và chủ nhà khác bằng cách thêm sở
            thích vào hồ sơ của bạn.
          </p>

          <div className="flex gap-3 mb-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-dashed"
            >
              <Heart className="h-4 w-4 mr-2" />
              Thêm sở thích
            </Button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button type="button" size="lg">
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
