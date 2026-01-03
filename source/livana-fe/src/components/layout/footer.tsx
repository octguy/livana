import { Facebook, Instagram, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Support Section */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/help" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/safety" className="hover:underline">
                  Safety support
                </a>
              </li>
              <li>
                <a href="/aircover" className="hover:underline">
                  AirCover
                </a>
              </li>
              <li>
                <a href="/anti-discrimination" className="hover:underline">
                  Anti-discrimination
                </a>
              </li>
              <li>
                <a href="/disability" className="hover:underline">
                  Disability support
                </a>
              </li>
              <li>
                <a href="/cancellation" className="hover:underline">
                  Cancellation options
                </a>
              </li>
              <li>
                <a href="/report" className="hover:underline">
                  Report a concern
                </a>
              </li>
            </ul>
          </div>

          {/* Hosting Section */}
          <div>
            <h3 className="font-semibold mb-4">Hosting</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="/host" className="hover:underline">
                  Host your home
                </a>
              </li>
              <li>
                <a href="/experience" className="hover:underline">
                  Livana Experiences
                </a>
              </li>
              <li>
                <a href="/service" className="hover:underline">
                  Livana Services
                </a>
              </li>
              <li>
                <a href="/aircover-hosts" className="hover:underline">
                  AirCover for hosts
                </a>
              </li>
              <li>
                <a href="/resources" className="hover:underline">
                  Hosting resources
                </a>
              </li>
              <li>
                <a href="/forum" className="hover:underline">
                  Community forum
                </a>
              </li>
              <li>
                <a href="/responsible" className="hover:underline">
                  Responsible hosting
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
                  Newsroom
                </a>
              </li>
              <li>
                <a href="/careers" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="/investors" className="hover:underline">
                  Investors
                </a>
              </li>
              <li>
                <a href="/gift-cards" className="hover:underline">
                  Gift cards
                </a>
              </li>
              <li>
                <a href="/emergency" className="hover:underline">
                  Livana.org emergency
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
              Terms
            </a>
            <a href="/privacy" className="hover:underline">
              Privacy
            </a>
            <a href="/sitemap" className="hover:underline">
              Sitemap
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium hover:underline">
              <Globe className="h-4 w-4" />
              English (US)
            </button>
            <button className="text-sm font-medium hover:underline">USD</button>
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
