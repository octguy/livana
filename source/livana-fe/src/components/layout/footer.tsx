import { Facebook, Instagram, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/help" className="hover:underline">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="/safety" className="hover:underline">
                  Hỗ trợ an toàn
                </a>
              </li>
              <li>
                <a href="/aircover" className="hover:underline">
                  AirCover
                </a>
              </li>
              <li>
                <a href="/anti-discrimination" className="hover:underline">
                  Chống phân biệt đối xử
                </a>
              </li>
              <li>
                <a href="/disability" className="hover:underline">
                  Hỗ trợ người khuyết tật
                </a>
              </li>
              <li>
                <a href="/cancellation" className="hover:underline">
                  Tùy chọn hủy
                </a>
              </li>
              <li>
                <a href="/report" className="hover:underline">
                  Báo cáo vấn đề
                </a>
              </li>
            </ul>
          </div>

          {/* Hosting Section */}
          <div>
            <h3 className="font-semibold mb-4">Cho thuê</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/host" className="hover:underline">
                  Cho thuê nhà
                </a>
              </li>
              <li>
                <a href="/experience" className="hover:underline">
                  Trải nghiệm Livana
                </a>
              </li>
              <li>
                <a href="/service" className="hover:underline">
                  Dịch vụ Livana
                </a>
              </li>
              <li>
                <a href="/aircover-hosts" className="hover:underline">
                  AirCover cho chủ nhà
                </a>
              </li>
              <li>
                <a href="/resources" className="hover:underline">
                  Tài nguyên cho thuê
                </a>
              </li>
              <li>
                <a href="/forum" className="hover:underline">
                  Diễn đàn cộng đồng
                </a>
              </li>
              <li>
                <a href="/responsible" className="hover:underline">
                  Cho thuê có trách nhiệm
                </a>
              </li>
            </ul>
          </div>

          {/* Livana Section */}
          <div>
            <h3 className="font-semibold mb-4">Livana</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/newsroom" className="hover:underline">
                  Phòng tin tức
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:underline">
                  Nghề nghiệp
                </a>
              </li>
              <li>
                <a href="/investors" className="hover:underline">
                  Nhà đầu tư
                </a>
              </li>
              <li>
                <a href="/gift-cards" className="hover:underline">
                  Thẻ quà tặng
                </a>
              </li>
              <li>
                <a href="/emergency" className="hover:underline">
                  Livana.org khẩn cấp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 Livana, Inc.</span>
            <a href="/terms" className="hover:underline">
              Điều khoản
            </a>
            <a href="/privacy" className="hover:underline">
              Quyền riêng tư
            </a>
            <a href="/sitemap" className="hover:underline">
              Sơ đồ trang web
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium hover:underline">
              <Globe className="h-4 w-4" />
              Tiếng Việt (VN)
            </button>
            <button className="text-sm font-medium hover:underline">VND</button>
            <div className="flex gap-3">
              <a href="#" className="hover:opacity-70">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-70">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:opacity-70">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
