import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
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
  CheckCircle,
  MessageSquare,
  Award,
  Camera
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
  const { language, fontClass, fontDisplayClass } = useLanguage();
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
        return 'bg-red-500 text-white border-red-600 shadow-red-200';
      case 'high':
        return 'bg-orange-500 text-white border-orange-600 shadow-orange-200';
      case 'medium':
        return 'bg-yellow-500 text-gray-800 border-yellow-600 shadow-yellow-200';
      case 'low':
        return 'bg-green-500 text-white border-green-600 shadow-green-200';
      default:
        return 'bg-gray-500 text-white border-gray-600 shadow-gray-200';
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
    <div className={`bg-white overflow-x-hidden ${fontClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 rounded-2xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 relative overflow-hidden min-h-[200px] lg:min-h-[250px] xl:min-h-[300px] mx-0 shadow-lg border-2 border-orange-200">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={raigadFort} 
            alt="Raigad Fort" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          {/* Stronger Saffron Overlay for Better Orientation */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/70 via-amber-600/60 to-yellow-600/70"></div>
          {/* BJP Symbol - Positioned in top-right corner */}
          <img 
            src={bjpSymbol} 
            alt="BJP Symbol" 
            className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 opacity-60"
          />
        </div>
        
        {/* Stronger overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/30 to-white/40"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full">
          <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-900 mb-1 sm:mb-2 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm ${fontDisplayClass}`}>
            {language === 'mr' ? 'स्वागत आहे' : 'Welcome Back'}
            </h1>
          <p className={`text-sm sm:text-base md:text-lg lg:text-xl text-amber-800 font-bold drop-shadow-sm mb-2 ${fontClass}`}>
            Pravin Patil
          </p>
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-amber-700 font-extrabold drop-shadow-sm ${fontClass}`}>
            {new Date().toLocaleDateString(language === 'mr' ? 'hi-IN' : 'en-IN', {
              day: 'numeric',
              month: language === 'mr' ? 'long' : 'long',
              year: 'numeric'
            })} {language === 'mr' ? 'ला' : 'at'} {new Date().toLocaleTimeString(language === 'mr' ? 'hi-IN' : 'en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }).replace('am', 'AM').replace('pm', 'PM')}
          </p>
      </div>

        {/* Special Day Cards */}
        <div className="absolute top-4 right-4 space-y-3 z-20">
        {/* Today's Special Day */}
          <Card className="w-64 bg-white rounded-2xl border-2 border-orange-200 shadow-lg">
            <CardContent className="p-4">
              <h3 className={`font-bold text-amber-900 mb-2 text-sm ${fontDisplayClass}`}>
                {language === 'mr' ? 'आजचा विशेष दिवस' : 'Today\'s Special Day'}
        </h3>
              <div className="space-y-1">
                <p className={`font-bold text-amber-800 text-sm ${fontClass}`}>
              {language === 'mr' ? 'कारगिल विजय दिवस' : 'Kargil Vijay Diwas'}
            </p>
                <p className={`text-amber-700 text-xs ${fontClass}`}>
                  {language === 'mr' ? 'वीर शहीदांना श्रद्धांजली' : 'Homage to brave martyrs'}
            </p>
          </div>
            </CardContent>
          </Card>
        
        {/* Upcoming Special Days */}
          <Card className="w-64 bg-white rounded-2xl border-2 border-orange-200 shadow-lg">
            <CardContent className="p-4">
              <h3 className={`font-bold text-amber-900 mb-3 text-sm ${fontDisplayClass}`}>
            {language === 'mr' ? 'आगामी विशेष दिवस' : 'Upcoming Special Days'}
        </h3>
              <div className="space-y-3">
              <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-amber-800 text-sm ${fontClass}`}>
                  {language === 'mr' ? 'स्वातंत्र्य दिन' : 'Independence Day'}
                </p>
                    <p className="text-amber-700 text-xs">15 August 2025</p>
                  </div>
                  <Badge className="bg-red-500 text-white text-xs rounded-xl px-2 py-1">
              NATIONAL
            </Badge>
              </div>
              <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold text-amber-800 text-sm ${fontClass}`}>
                  {language === 'mr' ? 'महाराष्ट्र दिन' : 'Maharashtra Day'}
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

      {/* Notices Section */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-orange-200 mb-3 sm:mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-amber-900 ${fontDisplayClass}`}>
              {language === 'mr' ? 'सूचना आणि घोषणा' : 'Notices & Announcements'}
          </h2>
        </div>
          <Link href="/notices">
            <Button variant="outline" size="sm" className="text-sm rounded-xl border-2 border-orange-400 text-orange-700 hover:bg-orange-100 hover:text-orange-800 transition-all duration-200">
              {language === 'mr' ? 'सर्व पहा' : 'View All'}
            </Button>
          </Link>
      </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {mockNotices.map((notice, index) => (
            <div key={index} className="bg-white rounded-2xl p-3 sm:p-4 border-2 border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-orange-300">
              <div className="flex items-start justify-between mb-2">
                  <Badge className={`text-sm rounded-xl ${getPriorityColor(notice.priority)}`}>
                    {getPriorityLabel(notice.priority)}
                  </Badge>
                <span className={`text-xs text-amber-700 ${fontClass}`}>{formatNoticeDate(notice.publishedAt)}</span>
        </div>

              <h3 className={`font-semibold text-sm sm:text-base text-amber-900 mb-1 line-clamp-2 ${fontClass}`}>
                {notice.title}
            </h3>
              
              <p className={`text-xs sm:text-sm text-amber-800 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2 ${fontClass}`}>
                {notice.content}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-orange-200">
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  <span className={fontClass}>{formatTime(new Date(notice.publishedAt))}</span>
            </div>
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
                  <span className={fontClass}>{notice.readBy.length}</span>
          </div>
            </div>
          </div>
          ))}
            </div>
          </div>
        </div>

      {/* Dashboard Stats Cards */}
      <div className="mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3 sm:mb-4">
            {/* Total Members Card */}
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-3 border-2 border-orange-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Total Members</h3>
                <Users2 className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">24,567</div>
              <div className="text-xs text-orange-100">22000 Verified</div>
            </div>

            {/* Active Events Card */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-3 border-2 border-blue-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Active Events</h3>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">15</div>
              <div className="text-xs text-blue-100">8 Upcoming</div>
            </div>

            {/* Notices Card */}
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl p-3 border-2 border-pink-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Notices</h3>
                <Bell className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">45</div>
              <div className="text-xs text-pink-100">3 Urgent</div>
            </div>

            {/* Constituencies Card */}
            <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-3 border-2 border-green-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Constituencies</h3>
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">288</div>
              <div className="text-xs text-green-100">36 Districts</div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-3 border-2 border-purple-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Progress</h3>
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">89.5%</div>
              <div className="text-xs text-purple-100">Target Achievement</div>
            </div>

            {/* Communication Card */}
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl p-3 border-2 border-indigo-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Communication</h3>
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">1,234</div>
              <div className="text-xs text-indigo-100">Today's Messages</div>
            </div>

            {/* Feedback Card */}
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl p-3 border-2 border-teal-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Feedback</h3>
                <Award className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">1</div>
              <div className="text-xs text-teal-100">New Suggestions</div>
            </div>

            {/* Photos Card */}
            <div className="bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl p-3 border-2 border-rose-300 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">Photos</h3>
                <Camera className="h-4 w-4 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">1</div>
              <div className="text-xs text-rose-100">Uploaded Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Maharashtra Map - Constituency View */}
      <div className="mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-lg border-2 border-orange-200 mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1 bg-orange-200 rounded-xl">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-700" />
              </div>
              <h2 className={`text-lg sm:text-xl md:text-2xl font-bold text-amber-900 ${fontDisplayClass}`}>
                {language === 'mr' ? 'महाराष्ट्र नकाशा - प्रदेश दृश्य' : 'Maharashtra – Region View'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Konkan Region */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-3 border-2 border-orange-300 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Konkan Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">38</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">5,243</span>
                  </p>
                </div>
              </div>

              {/* Pune Region */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-3 border-2 border-yellow-300 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Pune Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">46</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">4,892</span>
                  </p>
                </div>
              </div>

              {/* Nagpur Region */}
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-3 border-2 border-purple-300 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Nagpur Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">42</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">3,862</span>
                  </p>
                </div>
              </div>

              {/* Nashik Region */}
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-3 border-2 border-gray-500 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Nashik Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">30</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">3,781</span>
                  </p>
                </div>
              </div>

              {/* Nashik-Aurangabad Region */}
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-3 border-2 border-green-300 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Nashik-Aurangabad Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">43</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">3,924</span>
                  </p>
                </div>
              </div>

              {/* Amravati Region */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-3 border-2 border-blue-300 shadow-lg">
                <h3 className={`text-sm font-bold text-white mb-2 ${fontClass}`}>Amravati Region</h3>
                <div className="space-y-1">
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'एकूण मतदारसंघ:' : 'Total Constituencies:'} <span className="font-bold">28</span>
                  </p>
                  <p className={`text-xs text-white ${fontClass}`}>
                    {language === 'mr' ? 'सदस्य:' : 'Members:'} <span className="font-bold">2,865</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Membership Legends */}
            <div className="mt-4 pt-4 border-t border-orange-200">
              <h4 className={`text-sm font-semibold text-amber-900 mb-3 ${fontDisplayClass}`}>
                {language === 'mr' ? 'सदस्यत्व श्रेणी' : 'Membership Categories'}
              </h4>
              <div className="flex flex-wrap gap-4">
                {/* High Membership */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl"></div>
                  <span className={`text-sm text-amber-800 ${fontClass}`}>
                    {language === 'mr' ? 'उच्च सदस्यत्व' : 'High membership'}
                  </span>
                </div>

                {/* Medium Membership */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl"></div>
                  <span className={`text-sm text-amber-800 ${fontClass}`}>
                    {language === 'mr' ? 'मध्यम सदस्यत्व' : 'Medium membership'}
                  </span>
                </div>

                {/* Growing Membership */}
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-xl"></div>
                  <span className={`text-sm text-amber-800 ${fontClass}`}>
                    {language === 'mr' ? 'वाढत सदस्यत्व' : 'Growing membership'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leader Details Section - At Bottom of Hero */}
      <div className="mt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3">
            <h2 className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-amber-900 mb-1 ${fontDisplayClass}`}>
              {language === 'mr' ? 'महाराष्ट्र भाजप नेतृत्व' : 'Maharashtra BJP Leadership'}
            </h2>
          </div>

          {/* Political Leaders Image */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-4xl">
              <img 
                src={politicalImages} 
                alt="Maharashtra BJP Leadership"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'चंद्रकांत दादा पाटील' : 'Chandrakant Dada Patil'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'प्रवीण दरेकर' : 'Pravin Darekar'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'आशिष शेलार' : 'Ashish Shelar'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'मंगल प्रभात लोढा' : 'Mangal Prabhat Lodha'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'श्रीकांत भारतीय' : 'Shrikant Bharatiya'}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-orange-200 text-center">
              <p className={`text-amber-900 font-semibold ${fontClass}`}>
                {language === 'mr' ? 'केशव उपाध्ये' : 'Keshav Upadhye'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Political Leadership Data */}
          <div className="mt-8 space-y-6">
            {/* Pradesh Padadhikari */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-blue-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'प्रदेश पदाधिकारी' : 'Pradesh Padadhikari'}
                </h3>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'नितीन गडकरी - नागपूर' : 'Nitin Gadkari - Nagpur'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'रव्साहेब पाटील दानवे - जालना' : 'Ravsaheb Patil Danve - Jalna'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'विनोद तावडे - मुंबई' : 'Vinod Tawde - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'अजयकुमार शिंदे' : 'Ajaykumar Shinde'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'कापिल पाटील - मुंबई' : 'Kapil Patil - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'पूनम महाजन - मुंबई' : 'Punam Mahajan - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सो. प्रीतम गोपीनाथ मुंडे - बीड' : 'So. Pritam Gopinath Munde - Beed'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className={`text-blue-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'राजनितीसीन्ह हिद्राव नाईक निवाळकर - माढा' : 'Rajnitisinh Hidrav Naik Nivalkar - Madha'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rashtriya Padadhikari */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-green-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'राष्ट्रीय पदाधिकारी' : 'Rashtriya Padadhikari'}
                </h3>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'श्रीपाद रामराव भुमरे - धुळे' : 'Shripad Ramrav Bhumre - Dhule'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'संजय धोत्रे - अकोला' : 'Sanjay Dhotre - Akola'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सुनील मेंढे' : 'Sunil Mendhe'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'नरेंद्र गोविया' : 'Narendra Goviya'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'रव्साहेब पाटील दानवे - जालना' : 'Ravsaheb Patil Danve - Jalna'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'गोपाळ शेट्टी - मुंबई' : 'Gopal Shetty - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'विजयाताई रहाटकर - औरंगाबाद' : 'Vijayatai Rahatkar - Aurangabad'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सुभकर शिंगारे - लातूर' : 'Subkar Shingare - Latur'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className={`text-green-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'संजय काका पाटील - सांगली' : 'Sanjay Kaka Patil - Sangli'}
                  </p>
                </div>
              </div>
            </div>

            {/* Legislature Members */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-purple-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'विधानसभेचे सदस्य' : 'Legislature Members'}
                </h3>
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'देवेंद्र फडणवीस - नागपूर' : 'Devendra Fadanvis - Nagpur'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'चंद्रकांत पाटील - पुणे' : 'Chandrakant Patil - Pune'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'विनोद तावडे - मुंबई' : 'Vinod Tawde - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सुभाष देशमुख - सोलापूर' : 'Subhash Deshmukh - Solapur'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'राम सातपुते - सोलापूर' : 'Ram Satpute - Solapur'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सुरेशा वाडे - सांगली' : 'Suresha Wade - Sangli'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'नितेश नारायण राणो - सिंधुदुर्ग' : 'Nitesh Narayan Rano - Sindhudurg'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'प्रवीण दरेरकर - मुंबई' : 'Pravin Darekar - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <p className={`text-purple-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'राजेंद्र शिंग - मुंबई' : 'Rajendra Shing - Mumbai'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lok Sabha Members */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-2 border-red-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-red-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'लोकसभेचे सदस्य' : 'Lok Sabha Members'}
                </h3>
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'उमेश भय्यासाहेब पाटील - जळगाव' : 'Umesh Bhayyasaheb Patil - Jalgaon'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'ह. मुर्ली धरण' : 'He. Murli Dharan'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'उदयनराजे भोसले' : 'Udaynaraje Bhosle'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'डी. भारती पवार - दिंडोरी' : 'Dr. Bharti Pawar - Dindori'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'मनज कोटक - मुंबई' : 'Manaj Kotak - Mumbai'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'सुजय विखे पाटील - अहमदनगर' : 'Sujay Vikhe Patil - Ahmednagar'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className={`text-red-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'डी. जयसिंगभर स्वामी - सोलापूर' : 'D. Jaysingbhar Swami - Solapur'}
                  </p>
                </div>
              </div>
            </div>

            {/* Rajya Sabha Members */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold text-indigo-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'राज्यसभेचे सदस्य' : 'Rajya Sabha Members'}
                </h3>
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'प्रकाश जावडेकर - पुणे' : 'Prakash Javadekar - Pune'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'एस.टी.टी. राणे - नाशिक' : 'S.T.T. Rane - Nashik'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'पंकजा गोपीनाथ मुंडे - बीड' : 'Pankaja Gopinath Munde - Beed'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'जमणान सिंह पाय्या - नाशिक' : 'Jamanan Sinh Payya - Nashik'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'रा. धीना नाथ माने - नांदेड' : 'Ra. Dhinanath Mane - Nanded'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'राजीव सातव - औरंगाबाद' : 'Rajiv Satav - Aurangabad'}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-indigo-200">
                  <p className={`text-indigo-700 text-sm ${fontClass}`}>
                    {language === 'mr' ? 'डी. वंदना चव्हाण - मुंबई' : 'Dr. Vandana Chavan - Mumbai'}
                  </p>
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