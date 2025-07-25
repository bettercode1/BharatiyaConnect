import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Eye, Clock } from "lucide-react";

export default function RecentMembers() {
  const { t } = useLanguage();

  const { data: memberStats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/member-stats"],
  });

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const memberDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - memberDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "आत्ताच";
    if (diffInHours < 24) return `${diffInHours} तास आधी`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिवस आधी`;
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-900">नवीन सदस्य</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-amber-900 flex items-center">
            <span className="mr-2">👥</span>
            नवीन सदस्य
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-amber-700">
            <Eye className="w-4 h-4 mr-1" />
            सर्व पहा
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {memberStats?.recentMembers?.slice(0, 3).map((member: any, index: number) => (
            <div
              key={member.id}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                  {member.fullName.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900">{member.fullName}</h4>
                <p className="text-sm text-gray-600">
                  {member.constituency} - {member.district}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(member.createdAt)}
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>अजून कोणतेही नवीन सदस्य नाहीत</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
