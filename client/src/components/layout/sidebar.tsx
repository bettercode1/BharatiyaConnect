import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  Star,
  Megaphone,
  PieChart,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { t } = useLanguage();
  const [location] = useLocation();

  const menuItems = [
    {
      href: "/dashboard",
      label: t("nav.dashboard"),
      icon: BarChart3,
    },
    {
      href: "/members",
      label: t("nav.memberManagement"),
      icon: Users,
    },
    {
      href: "/events",
      label: t("nav.eventManagement"),
      icon: Calendar,
    },
    {
      href: "/leadership",
      label: t("nav.leadershipGallery"),
      icon: Star,
    },
    {
      href: "/notices",
      label: t("nav.noticeManagement"),
      icon: Megaphone,
    },
    {
      href: "/analytics",
      label: t("nav.analytics"),
      icon: PieChart,
    },
  ];

  const isActive = (path: string) => {
    return location === path || (path === "/dashboard" && location === "/");
  };

  return (
    <div className="p-6">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  isActive(item.href)
                    ? "bg-orange-100 text-amber-700 hover:bg-orange-200"
                    : "text-gray-600 hover:text-amber-700 hover:bg-gray-50"
                }`}
                onClick={onNavigate}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
