import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, MapPin, Bell, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StatsCardsProps {
  stats?: {
    totalMembers: number;
    activeEvents: number;
    totalConstituencies: number;
    newNotices: number;
    memberGrowth: number;
  };
  isLoading: boolean;
}

export default function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const { t } = useLanguage();

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString('hi-IN');
  };

  const cards = [
    {
      title: t("dashboard.totalMembers"),
      value: stats?.totalMembers || 0,
      growth: `+${stats?.memberGrowth || 0}% या महिन्यात`,
      icon: Users,
      color: "orange",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: t("dashboard.activeEvents"),
      value: stats?.activeEvents || 0,
      growth: "या आठवड्यात",
      icon: Calendar,
      color: "blue",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: t("dashboard.constituencies"),
      value: stats?.totalConstituencies || 0,
      growth: "संपूर्ण महाराष्ट्र",
      icon: MapPin,
      color: "purple",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: t("dashboard.newNotices"),
      value: stats?.newNotices || 0,
      growth: "गेल्या ७ दिवसात",
      icon: Bell,
      color: "amber",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-orange-400"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-amber-700 mt-1">
                    {formatNumber(card.value)}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                    {card.growth === `+${stats?.memberGrowth || 0}% या महिन्यात` && (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {card.growth}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
