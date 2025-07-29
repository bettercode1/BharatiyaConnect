import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Bell, 
  Eye, 
  AlertTriangle, 
  Info, 
  CheckCircle 
} from 'lucide-react';

// Mock notice data
const mockNotices = [
  {
    id: '1',
    title: 'महत्वाची सूचना - वार्षिक महासभा',
    content: 'सर्व पदाधिकारी आणि कार्यकर्त्यांची वार्षिक महासभा दि. 15 ऑगस्ट 2025 रोजी सकाळी 10 वाजता आयोजित करण्यात येत आहे.',
    priority: 'urgent',
    category: 'meeting',
    publishedAt: '2025-07-26T10:00:00Z',
    isPinned: true,
    isActive: true
  },
  {
    id: '2',
    title: 'सदस्यत्व नूतनीकरण अंतिम तारीख',
    content: 'सर्व सदस्यांना कळविण्यात येत आहे की सदस्यत्व नूतनीकरणाची अंतिम तारीख 31 ऑगस्ट 2025 आहे. कृपया वेळेत नूतनीकरण करा.',
    priority: 'high',
    category: 'renewal',
    publishedAt: '2025-07-25T14:30:00Z',
    isPinned: false,
    isActive: true
  },
  {
    id: '3',
    title: 'यशगाथा समारंभ आमंत्रण',
    content: 'पक्षाच्या वर्धापन दिनानिमित्त यशगाथा समारंभाचे आयोजन करण्यात आले आहे. सर्व नेतृत्व सादर उपस्थित राहावे.',
    priority: 'medium',
    category: 'event',
    publishedAt: '2025-07-24T09:15:00Z',
    isPinned: false,
    isActive: true
  }
];

// Notice Box Component
export default function NoticeBox() {
  const { language } = useLanguage();
  
  // Get top 2 active notices, prioritizing pinned and urgent ones
  const topNotices = mockNotices
    .filter(notice => notice.isActive)
    .sort((a, b) => {
      // Sort by pinned first, then by priority, then by date
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 2);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <Bell className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const formatNoticeDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewAllClick = () => {
    window.location.href = '/notices';
  };

  if (topNotices.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 w-80 max-w-sm">
      <Card className="bg-white/95 backdrop-blur-sm border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-in slide-in-from-left-5 fade-in duration-500">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-orange-800">
              {language === 'mr' ? 'महत्वाच्या सूचना' : 'Important Notices'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {topNotices.map((notice, index) => (
            <div 
              key={notice.id}
              className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer transform hover:scale-[1.02] ${getPriorityColor(notice.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(notice.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                      {notice.title}
                    </h4>
                    {notice.isPinned && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs opacity-90 line-clamp-2 leading-relaxed mb-2">
                    {notice.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-75 font-medium">
                      {formatNoticeDate(notice.publishedAt)}
                    </span>
                    <Badge variant="outline" className="text-xs px-2 py-0.5 font-medium">
                      {notice.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* View All Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 font-medium"
            onClick={handleViewAllClick}
          >
            <Eye className="w-4 h-4 mr-2" />
            {language === 'mr' ? 'सर्व सूचना पहा' : 'View All Notices'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 