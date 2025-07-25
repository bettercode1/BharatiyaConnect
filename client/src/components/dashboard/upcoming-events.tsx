import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar, Clock, MapPin, Eye } from "lucide-react";

export default function UpcomingEvents() {
  const { t } = useLanguage();

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/dashboard/upcoming-events"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'online':
        return 'ऑनलाइन';
      case 'offline':
        return 'ऑफलाइन';
      case 'hybrid':
        return 'हायब्रिड';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-amber-900">आगामी कार्यक्रम</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 py-3">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
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
            <span className="mr-2">📅</span>
            आगामी कार्यक्रम
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-orange-600 hover:text-amber-700">
            <Eye className="w-4 h-4 mr-1" />
            सर्व पहा
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events?.slice(0, 3).map((event: any, index: number) => {
            const borderColors = ['border-orange-400', 'border-yellow-500', 'border-amber-600'];
            return (
              <div
                key={event.id}
                className={`border-l-4 ${borderColors[index % 3]} pl-4 py-3 hover:bg-gray-50 rounded-r-lg transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-amber-900">{event.title}</h4>
                  <Badge className={getEventTypeColor(event.eventType)}>
                    {getEventTypeLabel(event.eventType)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    {formatDate(event.eventDate)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2" />
                    {formatTime(event.eventDate)}
                  </div>
                  {event.venue && (
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-2" />
                      {event.venue}
                    </div>
                  )}
                </div>
              </div>
            );
          }) || (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>कोणतेही आगामी कार्यक्रम नाहीत</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
