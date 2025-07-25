import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Twitter, Instagram, ExternalLink } from "lucide-react";

export default function LeadershipGallery() {
  const { t } = useLanguage();

  const { data: leadership, isLoading } = useQuery({
    queryKey: ["/api/leadership"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-900">नेतृत्व प्रदर्शनी</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-3 w-16 mx-auto mb-3" />
                <div className="flex justify-center space-x-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default leadership data if no data from API
  const defaultLeadership = [
    {
      id: '1',
      name: 'नरेंद्र मोदी',
      designation: 'पंतप्रधान',
      profileImage: '',
      socialMedia: {
        twitter: 'narendramodi',
        instagram: 'narendramodi'
      }
    },
    {
      id: '2',
      name: 'देवेंद्र फडणवीस',
      designation: 'उपमुख्यमंत्री',
      profileImage: '',
      socialMedia: {
        twitter: 'devendra_fadnavis',
        instagram: 'devendra_fadnavis'
      }
    },
    {
      id: '3',
      name: 'नितिन गडकरी',
      designation: 'केंद्रीय मंत्री',
      profileImage: '',
      socialMedia: {
        twitter: 'nitin_gadkari',
        instagram: 'nitin_gadkari'
      }
    },
    {
      id: '4',
      name: 'पंकजा मुंडे',
      designation: 'आमदार',
      profileImage: '',
      socialMedia: {
        twitter: 'pankajamunde',
        instagram: 'pankajamunde'
      }
    }
  ];

  const leadershipData = leadership?.length > 0 ? leadership : defaultLeadership;

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
          <span className="mr-2">⭐</span>
          नेतृत्व प्रदर्शनी
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadershipData.map((leader: any, index: number) => (
            <div
              key={leader.id}
              className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center border border-orange-100"
            >
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={leader.profileImage} />
                <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                  {leader.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-amber-900 mb-1">{leader.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{leader.designation}</p>
              <div className="flex justify-center space-x-2">
                {leader.socialMedia?.twitter && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-blue-100 hover:bg-blue-200 rounded-full"
                  >
                    <Twitter className="w-4 h-4 text-blue-600" />
                  </Button>
                )}
                {leader.socialMedia?.instagram && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-8 h-8 p-0 bg-pink-100 hover:bg-pink-200 rounded-full"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
