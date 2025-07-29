import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../hooks/useLanguage';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Bell, 
  Crown,
  Home,
  User,
  CalendarDays,
  Users2,
  Bell as BellIcon,
  BarChart3,
  Eye,
  Plus,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import raigadFort from '../assets/raigad-fort.jpg';
import bjpSymbol from '../assets/bjp-symbol.png';
import politicalImages from '../assets/political_images.webp';

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
    isActive: true,
    readBy: []
  },
  {
    id: '2',
    title: 'सदस्यत्व नूतनीकरण अंतिम तारीख',
    content: 'सर्व सदस्यांना कळविण्यात येत आहे की सदस्यत्व नूतनीकरणाची अंतिम तारीख 31 ऑगस्ट 2025 आहे. कृपया वेळेत नूतनीकरण करा.',
    priority: 'high',
    category: 'renewal',
    publishedAt: '2025-07-25T14:30:00Z',
    isPinned: false,
    isActive: true,
    readBy: []
  },
  {
    id: '3',
    title: 'यशगाथा समारंभ आमंत्रण',
    content: 'पक्षाच्या वर्धापन दिनानिमित्त यशगाथा समारंभाचे आयोजन करण्यात आले आहे. सर्व नेतृत्व सादर उपस्थित राहावे.',
    priority: 'medium',
    category: 'event',
    publishedAt: '2025-07-24T09:15:00Z',
    isPinned: false,
    isActive: true,
    readBy: []
  }
];

const partyData = [
  { name: 'BJP', value: 132, color: '#ff9800' },
  { name: 'SS', value: 56, color: '#f59e42' },
  { name: 'NCP', value: 41, color: '#1976d2' },
  { name: 'SS(UBT)', value: 21, color: '#43a047' },
  { name: 'CONG', value: 16, color: '#e53935' },
  { name: 'NCP(SP)', value: 10, color: '#8e24aa' },
  { name: 'OTH', value: 12, color: '#757575' },
];

const regionData = [
  { name: 'Konkan', constituencies: 38, color: '#ff9800' },
  { name: 'Pune', constituencies: 46, color: '#f59e42' },
  { name: 'Nagpur', constituencies: 42, color: '#1976d2' },
  { name: 'Nashik', constituencies: 30, color: '#43a047' },
  { name: 'Nashik-Aurangabad', constituencies: 43, color: '#e53935' },
  { name: 'Amravati', constituencies: 28, color: '#8e24aa' },
];

function PartyPieChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={partyData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          innerRadius={60}
          paddingAngle={2}
          label={({ name }) => name}
          isAnimationActive={true}
        >
          {partyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value}`, `${name}`]}
          contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', fontWeight: 600 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RegionColumnChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip
          formatter={(value, name) => [`${value} Constituencies`, `${name}`]}
          contentStyle={{ background: '#fff', borderRadius: 8, border: '1px solid #eee', fontWeight: 600 }}
        />
        <Bar dataKey="constituencies" fill="#ff9800" radius={[4, 4, 0, 0]}>
          {regionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
  }
  
const Hero: React.FC = () => {
  const { language } = useLanguage();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState('pradesh');

  // Handle URL parameters for section navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const section = urlParams.get('section');
    console.log('Navigation detected:', { location, section }); // Debug log
    
    if (section && ['pradesh', 'rashtriya', 'legislature', 'loksabha', 'rajyasabha'].includes(section)) {
      console.log('Setting activeTab to:', section); // Debug log
      setActiveTab(section);
      
      // Scroll to Political Leadership section
      setTimeout(() => {
        const politicalLeadershipSection = document.getElementById('political-leadership');
        console.log('Scrolling to section:', politicalLeadershipSection); // Debug log
        if (politicalLeadershipSection) {
          politicalLeadershipSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300); // Increased timeout for better reliability
    }
  }, [location]);

  const [currentTime] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'तातडीचे';
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

  const formatNoticeDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 relative overflow-hidden min-h-[200px] lg:min-h-[250px] xl:min-h-[300px] mx-0 shadow-lg border-2 border-orange-200">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={raigadFort} 
            alt="Raigad Fort" 
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          {/* BJP Symbol - Positioned in top-right corner */}
          <img 
            src={bjpSymbol} 
            alt="BJP Symbol" 
            className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-40"
          />
        </div>
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/30 to-white/40"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-900 mb-1 sm:mb-2 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm">
            {language === 'mr' ? 'स्वागत आहे' : 'Welcome Back'}
            </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-800 font-bold drop-shadow-sm mb-2">
            Pravin Patil
          </p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-amber-700 font-extrabold drop-shadow-sm">
            {new Date().toLocaleDateString(language === 'mr' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: language === 'mr' ? 'long' : 'long',
              year: 'numeric'
            })} {language === 'mr' ? 'ला' : 'at'} {new Date().toLocaleTimeString(language === 'mr' ? 'hi-IN' : 'en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </p>
      </div>

        {/* Special Day Cards */}
        <div className="absolute top-4 right-4 space-y-3 z-20">
        {/* Today's Special Day */}
          <Card className="w-64 bg-white rounded-2xl border-2 border-orange-200 shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-bold text-amber-900 mb-2 text-sm">
                {language === 'mr' ? 'आजचा विशेष दिवस' : 'Today\'s Special Day'}
        </h3>
              <div className="space-y-1">
                <p className="font-bold text-amber-800 text-sm">
              {language === 'mr' ? 'कारगिल विजय दिवस' : 'Kargil Vijay Diwas'}
            </p>
                <p className="text-amber-700 text-xs">
                  {language === 'mr' ? '- वीर शहीदांना श्रद्धांजली' : '- Homage to brave martyrs'}
            </p>
          </div>
            </CardContent>
          </Card>
        
        {/* Upcoming Special Days */}
          <Card className="w-64 bg-white rounded-2xl border-2 border-orange-200 shadow-lg">
            <CardContent className="p-4">
              <h3 className="font-bold text-amber-900 mb-3 text-sm">
            {language === 'mr' ? 'आगामी विशेष दिवस' : 'Upcoming Special Days'}
        </h3>
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-800 text-sm">
                  {language === 'mr' ? 'स्वातंत्र्य दिन -' : 'Independence Day -'}
                </p>
                    <p className="text-amber-700 text-xs">15 August 2025</p>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs rounded-xl px-2 py-1">
              NATIONAL
            </Badge>
              </div>
              <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-amber-800 text-sm">
                  {language === 'mr' ? 'महाराष्ट्र दिन -' : 'Maharashtra Day -'}
                </p>
                    <p className="text-amber-700 text-xs">1 May 2025</p>
                  </div>
                  <Badge className="bg-blue-500 text-white text-xs rounded-xl px-2 py-1">
              POLITICAL
            </Badge>
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
        {/* Total Members Card */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-2 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xs font-bold text-white mb-1">
            {language === 'mr' ? 'एकूण सदस्य' : 'Total Members'}
              </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              24,567
            </p>
            <Badge className="bg-white text-orange-600 text-xs px-1 py-0.5 rounded-xl font-semibold">
              +100% {language === 'mr' ? 'या महिन्यात' : 'this month'}
            </Badge>
                </div>
          <p className="text-xs text-orange-100">
            {language === 'mr' ? 'सक्रिय सदस्य' : 'Active members'}
                </p>
              </div>

        {/* Active Programs Card */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-2 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xs font-bold text-white mb-1">
                  {language === 'mr' ? 'सक्रिय कार्यक्रम' : 'Active Programs'}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              15
            </p>
            <Badge className="bg-white text-orange-600 text-xs px-1 py-0.5 rounded-xl font-semibold">
              {language === 'mr' ? 'या आठवड्यात' : 'this week'}
            </Badge>
              </div>
          <p className="text-xs text-orange-100">
            {language === 'mr' ? 'चालू कार्यक्रम' : 'Ongoing programs'}
                </p>
              </div>

        {/* Constituencies Card */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-2 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xs font-bold text-white mb-1">
                  {language === 'mr' ? 'मतदारसंघ' : 'Constituencies'}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              288
                </p>
            <Badge className="bg-white text-orange-600 text-xs px-1 py-0.5 rounded-xl font-semibold">
                  {language === 'mr' ? 'संपूर्ण महाराष्ट्र' : 'All Maharashtra'}
            </Badge>
        </div>
          <p className="text-xs text-orange-100">
            {language === 'mr' ? 'एकूण मतदारसंघ' : 'Total constituencies'}
                </p>
              </div>

        {/* New Notifications Card */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-2 border-2 border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="text-xs font-bold text-white mb-1">
            {language === 'mr' ? 'नवीन सूचना' : 'New Notifications'}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">
              45
            </p>
            <Badge className="bg-white text-orange-600 text-xs px-1 py-0.5 rounded-xl font-semibold">
                  {language === 'mr' ? 'गेल्या 7 दिवसात' : 'Last 7 days'}
            </Badge>
        </div>
          <p className="text-xs text-orange-100">
            {language === 'mr' ? 'नवीन सूचना' : 'New notifications'}
                </p>
              </div>
      </div>

      {/* Notices Section */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-orange-200 mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-orange-200 rounded-xl">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
        </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-amber-900">
              {language === 'mr' ? 'सूचना आणि घोषणा' : 'Notices & Announcements'}
          </h2>
        </div>
          <Button variant="outline" size="sm" className="text-sm rounded-xl border-2 border-orange-400 text-orange-700 hover:bg-orange-100">
            {language === 'mr' ? 'सर्व पहा' : 'View All'}
          </Button>
      </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {mockNotices.map((notice, index) => (
            <div key={index} className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-2">
                  <Badge className={`text-sm rounded-xl ${getPriorityColor(notice.priority)}`}>
                    {getPriorityLabel(notice.priority)}
                  </Badge>
                <span className="text-xs text-amber-700">{formatNoticeDate(notice.publishedAt)}</span>
        </div>

              <h3 className="font-semibold text-sm sm:text-base text-amber-900 mb-1 line-clamp-2">
                {notice.title}
            </h3>
              
              <p className="text-xs sm:text-sm text-amber-800 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2">
                {notice.content}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  <span>{formatTime(new Date(notice.publishedAt))}</span>
            </div>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  <span>{notice.readBy.length}</span>
          </div>
            </div>
          </div>
          ))}
            </div>
          </div>
        </div>

      {/* Leader Details Section - At Bottom of Hero */}
      <div className="mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <h2 className="text-lg md:text-xl font-bold text-amber-900 mb-1">
              {language === 'mr' ? 'महाराष्ट्र भाजप नेतृत्व' : 'Maharashtra BJP Leadership'}
            </h2>
            <p className="text-amber-700 text-xs">
              {language === 'mr' ? 'सर्वोच्च नेतृत्व, सर्वोच्च सेवा' : 'Supreme Leadership, Supreme Service'}
            </p>
        </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* State President */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                      alt="Chandrakant Dada Patil"
                      className="w-full h-full object-cover"
          />
        </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'चंद्रकांत दादा पाटील' : 'Chandrakant Dada Patil'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'राज्य अध्यक्ष' : 'State President'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भारतीय जनता पक्ष' : 'Maharashtra BJP'}
                  </p>
        </div>
              </CardContent>
            </Card>

            {/* General Secretary */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
                      alt="Pravin Darekar"
                      className="w-full h-full object-cover"
                    />
              </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'प्रवीण दरेकर' : 'Pravin Darekar'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'महासचिव' : 'General Secretary'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भाजप' : 'Maharashtra BJP'}
                  </p>
                  </div>
              </CardContent>
            </Card>

            {/* Vice President */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" 
                      alt="Ashish Shelar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'आशिष शेलार' : 'Ashish Shelar'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'उपाध्यक्ष' : 'Vice President'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भाजप' : 'Maharashtra BJP'}
                  </p>
                  </div>
              </CardContent>
            </Card>

            {/* Treasurer */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face" 
                      alt="Mangal Prabhat Lodha"
                      className="w-full h-full object-cover"
                    />
                </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'मंगल प्रभात लोढा' : 'Mangal Prabhat Lodha'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'कोषाध्यक्ष' : 'Treasurer'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भाजप' : 'Maharashtra BJP'}
                  </p>
              </div>
              </CardContent>
            </Card>

            {/* Secretary */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" 
                      alt="Shrikant Bharatiya"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'श्रीकांत भारतीय' : 'Shrikant Bharatiya'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'सचिव' : 'Secretary'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भाजप' : 'Maharashtra BJP'}
                  </p>
                  </div>
              </CardContent>
            </Card>

            {/* Spokesperson */}
            <Card className="bg-white rounded-xl border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-orange-200">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                      alt="Keshav Upadhye"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    {language === 'mr' ? 'केशव उपाध्ये' : 'Keshav Upadhye'}
                  </h3>
                  <p className="text-amber-700 font-medium mb-1 text-sm">
                    {language === 'mr' ? 'प्रवक्ता' : 'Spokesperson'}
                  </p>
                  <p className="text-xs text-amber-600">
                    {language === 'mr' ? 'महाराष्ट्र भाजप' : 'Maharashtra BJP'}
                  </p>
                  </div>
              </CardContent>
            </Card>
              </div>

          {/* Additional Leadership Info */}
          <div className="mt-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200 p-3">
            <h3 className="text-base font-bold text-amber-900 mb-2 text-center">
              {language === 'mr' ? 'नेतृत्व विशेषताएं' : 'Leadership Highlights'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600 mb-1">36</div>
                <div className="text-xs text-amber-700">
                  {language === 'mr' ? 'जिल्हे' : 'Districts'}
                  </div>
                  </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600 mb-1">288</div>
                <div className="text-xs text-amber-700">
                  {language === 'mr' ? 'विधानसभा क्षेत्रे' : 'Assembly Seats'}
                  </div>
                  </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600 mb-1">48</div>
                <div className="text-xs text-amber-700">
                  {language === 'mr' ? 'लोकसभा क्षेत्रे' : 'Lok Sabha Seats'}
                  </div>
                  </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600 mb-1">11.5M+</div>
                <div className="text-xs text-amber-700">
                  {language === 'mr' ? 'सदस्य' : 'Members'}
                </div>
              </div>
            </div>
                  </div>
                </div>
              </div>

    {/* Floating Action Button */}
    <div className="fixed bottom-6 right-6 z-50">
          <button
        className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Go to top"
      >
        <Home className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          </button>
    </div>
    </div>
  );
};

export default Hero;