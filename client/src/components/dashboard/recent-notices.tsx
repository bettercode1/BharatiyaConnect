import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Plus, Paperclip, Eye, Clock } from "lucide-react";

export default function RecentNotices() {
  const { t } = useLanguage();

  const { data: notices, isLoading } = useQuery({
    queryKey: ["/api/dashboard/recent-notices"],
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'तातडीची';
      case 'high':
        return 'उच्च';
      case 'medium':
        return 'मध्यम';
      case 'low':
        return 'कमी';
      default:
        return priority;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const noticeDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "आत्ताच";
    if (diffInHours < 24) return `${diffInHours} तास आधी`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिवस आधी`;
  };

  // Default notices data if no data from API
  const defaultNotices = [
    {
      id: '1',
      title: 'कारगिल विजय दिवस समारंभ',
      content: '२६ जुलै २०२५ रोजी कारगिल विजय दिवसानिमित्त सर्व जिल्हांमध्ये श्रद्धांजली कार्यक्रम आयोजित करा.',
      priority: 'urgent',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      attachments: [{ name: 'guidelines.pdf' }],
      viewCount: 234
    },
    {
      id: '2',
      title: 'मासिक सदस्यता अभियान',
      content: 'ऑगस्ट महिन्यात नवीन सदस्यत्व मिळवण्यासाठी विशेष मोहीम राबवा. लक्ष्य: प्रति मतदारसंघ १०० नवीन सदस्य.',
      priority: 'medium',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      attachments: [],
      viewCount: 156
    },
    {
      id: '3',
      title: 'डिजिटल साक्षरता कार्यशाळा',
      content: 'ग्रामीण भागातील कार्यकर्त्यांसाठी डिजिटल साक्षरता कार्यशाळा - १५ ऑगस्ट ते ३१ ऑगस्ट २०२५.',
      priority: 'high',
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      attachments: [],
      viewCount: 89
    }
  ];

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-amber-900">अलीकडील सूचना</CardTitle>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const noticesData = notices?.length > 0 ? notices : defaultNotices;

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-amber-900 flex items-center">
            <span className="mr-2">📢</span>
            अलीकडील सूचना
          </CardTitle>
          <Button className="bg-orange-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            नवीन सूचना
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {noticesData.map((notice: any, index: number) => (
            <div
              key={notice.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-amber-900 flex-1 pr-4">{notice.title}</h4>
                <Badge className={getPriorityColor(notice.priority)}>
                  {getPriorityLabel(notice.priority)}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {notice.content}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(notice.publishedAt)} प्रकाशित
                </div>
                <div className="flex items-center space-x-4">
                  {notice.attachments?.length > 0 && (
                    <div className="flex items-center">
                      <Paperclip className="w-3 h-3 mr-1" />
                      <span>{notice.attachments.length} संलग्नक</span>
                    </div>
                  )}
                  {notice.viewCount > 0 && (
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{notice.viewCount} वाचले</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
