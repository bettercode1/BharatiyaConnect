import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import {
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  UserX,
  Filter,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  Bug,
  Star,
  User,
  Crown,
  TrendingDown,
  Activity,
  Bell
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { feedbackCRUD } from "@/lib/crudOperations";
import { mockFeedback } from "@/lib/mockData";

// Mock comprehensive member data for analytics
const mockAnalyticsData = [
  {
    id: '1',
    fullName: 'राहुल शर्मा',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    city: 'पुणे',
    district: 'पुणे',
    profession: 'अभियंता',
    membershipDate: '2020-01-15',
    isVerified: true,
    isActive: true,
    age: 39
  },
  {
    id: '2',
    fullName: 'प्रिया पाटील',
    dateOfBirth: '1992-07-22',
    gender: 'Female',
    city: 'मुंबई',
    district: 'मुंबई शहर',
    profession: 'डॉक्टर',
    membershipDate: '2022-03-10',
    isVerified: true,
    isActive: true,
    age: 32
  },
  {
    id: '3',
    fullName: 'अमित देशमुख',
    dateOfBirth: '1978-11-08',
    gender: 'Male',
    city: 'नागपूर',
    district: 'नागपूर',
    profession: 'वकील',
    membershipDate: '2018-05-20',
    isVerified: true,
    isActive: true,
    age: 46
  },
  {
    id: '4',
    fullName: 'सुनिता कुलकर्णी',
    dateOfBirth: '1965-09-12',
    gender: 'Female',
    city: 'नाशिक',
    district: 'नाशिक',
    profession: 'शिक्षक',
    membershipDate: '2015-08-12',
    isVerified: true,
    isActive: true,
    age: 59
  },
  {
    id: '5',
    fullName: 'विकास जाधव',
    dateOfBirth: '1995-01-30',
    gender: 'Male',
    city: 'कोल्हापूर',
    district: 'कोल्हापूर',
    profession: 'शेती',
    membershipDate: '2023-01-25',
    isVerified: false,
    isActive: true,
    age: 29
  },
  {
    id: '6',
    fullName: 'मीरा राठोड',
    dateOfBirth: '1988-06-18',
    gender: 'Female',
    city: 'औरंगाबाद',
    district: 'औरंगाबाद',
    profession: 'व्यापार',
    membershipDate: '2021-11-08',
    isVerified: true,
    isActive: true,
    age: 36
  },
  {
    id: '7',
    fullName: 'संजय गायकवाड',
    dateOfBirth: '1970-04-25',
    gender: 'Male',
    city: 'सोलापूर',
    district: 'सोलापूर',
    profession: 'सरकारी सेवा',
    membershipDate: '2019-07-14',
    isVerified: true,
    isActive: true,
    age: 54
  },
  {
    id: '8',
    fullName: 'अनिता भोसले',
    dateOfBirth: '1982-12-03',
    gender: 'Female',
    city: 'ठाणे',
    district: 'ठाणे',
    profession: 'गृहिणी',
    membershipDate: '2020-09-22',
    isVerified: true,
    isActive: true,
    age: 42
  },
  {
    id: '9',
    fullName: 'रवी खान',
    dateOfBirth: '1990-08-17',
    gender: 'Male',
    city: 'अकोला',
    district: 'अकोला',
    profession: 'खाजगी नोकरी',
    membershipDate: '2022-12-05',
    isVerified: true,
    isActive: true,
    age: 34
  },
  {
    id: '10',
    fullName: 'रेखा देसाई',
    dateOfBirth: '1975-05-28',
    gender: 'Female',
    city: 'अहमदनगर',
    district: 'अहमदनगर',
    profession: 'स्वयंरोजगार',
    membershipDate: '2017-02-18',
    isVerified: true,
    isActive: false,
    age: 49
  },
  {
    id: '11',
    fullName: 'करीम शेख',
    dateOfBirth: '1993-10-12',
    gender: 'Male',
    city: 'जळगाव',
    district: 'जळगाव',
    profession: 'विद्यार्थी',
    membershipDate: '2023-04-10',
    isVerified: false,
    isActive: true,
    age: 31
  },
  {
    id: '12',
    fullName: 'पूजा सिंह',
    dateOfBirth: '1987-01-14',
    gender: 'Female',
    city: 'लातूर',
    district: 'लातूर',
    profession: 'शिक्षक',
    membershipDate: '2021-06-30',
    isVerified: true,
    isActive: true,
    age: 37
  },
  {
    id: '13',
    fullName: 'अरुण कदम',
    dateOfBirth: '1960-03-22',
    gender: 'Male',
    city: 'सांगली',
    district: 'सांगली',
    profession: 'सेवानिवृत्त',
    membershipDate: '2016-11-25',
    isVerified: true,
    isActive: true,
    age: 64
  },
  {
    id: '14',
    fullName: 'स्मिता जोशी',
    dateOfBirth: '1991-09-05',
    gender: 'Female',
    city: 'अमरावती',
    district: 'अमरावती',
    profession: 'डॉक्टर',
    membershipDate: '2022-08-17',
    isVerified: true,
    isActive: true,
    age: 33
  },
  {
    id: '15',
    fullName: 'राज वर्मा',
    dateOfBirth: '1984-07-11',
    gender: 'Others',
    city: 'धुळे',
    district: 'धुळे',
    profession: 'अभियंता',
    membershipDate: '2020-05-08',
    isVerified: true,
    isActive: true,
    age: 40
  },
  // Add more diverse data...
  {
    id: '16',
    fullName: 'माधुरी नायर',
    dateOfBirth: '1972-11-30',
    gender: 'Female',
    city: 'रत्नागिरी',
    district: 'रत्नागिरी',
    profession: 'व्यापार',
    membershipDate: '2018-10-12',
    isVerified: true,
    isActive: true,
    age: 52
  },
  {
    id: '17',
    fullName: 'दीपक मोरे',
    dateOfBirth: '1996-04-20',
    gender: 'Male',
    city: 'यवतमाळ',
    district: 'यवतमाळ',
    profession: 'शेती',
    membershipDate: '2023-02-14',
    isVerified: false,
    isActive: true,
    age: 28
  },
  {
    id: '18',
    fullName: 'गीता राजे',
    dateOfBirth: '1980-12-25',
    gender: 'Female',
    city: 'बीड',
    district: 'बीड',
    profession: 'गृहिणी',
    membershipDate: '2019-12-03',
    isVerified: true,
    isActive: true,
    age: 44
  },
  {
    id: '19',
    fullName: 'सचिन तेंडुलकर',
    dateOfBirth: '1985-06-15',
    gender: 'Others',
    city: 'वर्धा',
    district: 'वर्धा',
    profession: 'खाजगी नोकरी',
    membershipDate: '2021-09-21',
    isVerified: true,
    isActive: true,
    age: 39
  },
  {
    id: '20',
    fullName: 'सुमित्रा भांडारी',
    dateOfBirth: '1968-08-08',
    gender: 'Female',
    city: 'गडचिरोली',
    district: 'गडचिरोली',
    profession: 'सरकारी सेवा',
    membershipDate: '2016-03-17',
    isVerified: true,
    isActive: true,
    age: 56
  }
];

// Color schemes for charts
const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#8884D8', '#82CA9D'];
const GENDER_COLORS = {
  Male: '#0088FE',
  Female: '#FF8042', 
  Others: '#00C49F'
};

const FEEDBACK_COLORS = {
  suggestion: '#00C49F',
  complaint: '#FF8042',
  appreciation: '#FFBB28',
  meeting_request: '#0088FE',
  event_feedback: '#8884D8',
  technical_issue: '#82CA9D'
};

const STATUS_COLORS = {
  pending: '#FF8042',
  in_progress: '#FFBB28',
  resolved: '#00C49F'
};

const PRIORITY_COLORS = {
  low: '#82CA9D',
  medium: '#FFBB28',
  high: '#FF8042',
  urgent: '#DC2626'
};

export default function Analytics() {
  const { language } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('members');
  const [timeRange, setTimeRange] = useState('all');

  // Fetch members data (using mock data for now)
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["/api/members"],
    queryFn: async () => {
      // Return mock data for now
      return mockAnalyticsData;
    }
  });

  // Fetch feedback data
  const { data: feedbacks, isLoading: feedbackLoading } = useQuery({
    queryKey: ["/api/feedback"],
    queryFn: async () => {
      // Return mock feedback data for now
      return mockFeedback;
    }
  });

  // Feedback Analytics calculations
  const feedbackAnalytics = useMemo(() => {
    if (!feedbacks) return null;

    // Category distribution
    const categoryStats: Record<string, number> = {};
    const statusStats: Record<string, number> = {};
    const priorityStats: Record<string, number> = {};
    const userTypeStats: Record<string, number> = {};
    const districtStats: Record<string, number> = {};
    const monthlyTrends: Record<string, { month: string; feedback: number; resolved: number; pending: number }> = {};

    // Response time analysis
    let totalResponseTime = 0;
    let respondedCount = 0;

    feedbacks.forEach((feedback: any) => {
      // Category stats
      categoryStats[feedback.category] = (categoryStats[feedback.category] || 0) + 1;
      
      // Status stats
      statusStats[feedback.status] = (statusStats[feedback.status] || 0) + 1;
      
      // Priority stats
      if (feedback.priority) {
        priorityStats[feedback.priority] = (priorityStats[feedback.priority] || 0) + 1;
      }
      
      // User type stats
      if (feedback.userType) {
        userTypeStats[feedback.userType] = (userTypeStats[feedback.userType] || 0) + 1;
      }
      
      // District stats
      if (feedback.district) {
        districtStats[feedback.district] = (districtStats[feedback.district] || 0) + 1;
      }
      
      // Monthly trends
      const month = new Date(feedback.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyTrends[month]) {
        monthlyTrends[month] = { month, feedback: 0, resolved: 0, pending: 0 };
      }
      monthlyTrends[month].feedback++;
      if (feedback.status === 'resolved') {
        monthlyTrends[month].resolved++;
      } else {
        monthlyTrends[month].pending++;
      }
      
      // Response time calculation
      if (feedback.response && feedback.responseDate) {
        const responseTime = new Date(feedback.responseDate).getTime() - new Date(feedback.createdAt).getTime();
        totalResponseTime += responseTime;
        respondedCount++;
      }
    });

    const averageResponseTime = respondedCount > 0 ? totalResponseTime / respondedCount : 0;
    const averageResponseDays = Math.round(averageResponseTime / (1000 * 60 * 60 * 24));

    // Convert to chart format
    const categoryChartData = Object.entries(categoryStats).map(([category, count]) => ({
      name: category,
      value: count,
      percentage: ((count / feedbacks.length) * 100).toFixed(1)
    }));

    const statusChartData = Object.entries(statusStats).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / feedbacks.length) * 100).toFixed(1)
    }));

    const priorityChartData = Object.entries(priorityStats).map(([priority, count]) => ({
      name: priority,
      value: count,
      percentage: ((count / feedbacks.length) * 100).toFixed(1)
    }));

    const userTypeChartData = Object.entries(userTypeStats).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: ((count / feedbacks.length) * 100).toFixed(1)
    }));

    const topDistricts = Object.entries(districtStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([district, count]) => ({
        name: district,
        value: count,
        percentage: ((count / feedbacks.length) * 100).toFixed(1)
      }));

    const trendData = Object.values(monthlyTrends).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    return {
      totalFeedback: feedbacks.length,
      pendingFeedback: statusStats.pending || 0,
      inProgressFeedback: statusStats.in_progress || 0,
      resolvedFeedback: statusStats.resolved || 0,
      urgentFeedback: priorityStats.urgent || 0,
      averageResponseDays,
      resolutionRate: ((statusStats.resolved || 0) / feedbacks.length * 100).toFixed(1),
      categoryDistribution: categoryChartData,
      statusDistribution: statusChartData,
      priorityDistribution: priorityChartData,
      userTypeDistribution: userTypeChartData,
      districtDistribution: topDistricts,
      monthlyTrends: trendData
    };
  }, [feedbacks]);

  // Member Analytics calculations (existing code)
  const memberAnalytics = useMemo(() => {
    if (!members) return null;

    // Age distribution
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '65+': 0
    };

    // Gender distribution
    const genderStats = {
      Male: 0,
      Female: 0,
      Others: 0
    };

    // City distribution
    const cityStats: Record<string, number> = {};

    // Profession distribution
    const professionStats: Record<string, number> = {};

    // Membership trends (by year)
    const membershipTrends: Record<string, number> = {};

    // Status distribution
    let activeMembers = 0;
    let verifiedMembers = 0;

    members.forEach((member: any) => {
      // Age groups
      const age = member.age;
      if (age >= 18 && age <= 25) ageGroups['18-25']++;
      else if (age >= 26 && age <= 35) ageGroups['26-35']++;
      else if (age >= 36 && age <= 45) ageGroups['36-45']++;
      else if (age >= 46 && age <= 55) ageGroups['46-55']++;
      else if (age >= 56 && age <= 65) ageGroups['56-65']++;
      else if (age > 65) ageGroups['65+']++;

      // Gender
      genderStats[member.gender as keyof typeof genderStats]++;

      // City
      cityStats[member.city] = (cityStats[member.city] || 0) + 1;

      // Profession
      professionStats[member.profession] = (professionStats[member.profession] || 0) + 1;

      // Membership year
      const year = new Date(member.membershipDate).getFullYear().toString();
      membershipTrends[year] = (membershipTrends[year] || 0) + 1;

      // Status
      if (member.isActive) activeMembers++;
      if (member.isVerified) verifiedMembers++;
    });

    // Convert to chart format
    const ageChartData = Object.entries(ageGroups).map(([group, count]) => ({
      name: group,
      value: count,
      percentage: ((count / members.length) * 100).toFixed(1)
    }));

    const genderChartData = Object.entries(genderStats).map(([gender, count]) => ({
      name: gender,
      value: count,
      percentage: ((count / members.length) * 100).toFixed(1)
    }));

    const topCities = Object.entries(cityStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([city, count]) => ({
        name: city,
        value: count,
        percentage: ((count / members.length) * 100).toFixed(1)
      }));

    const topProfessions = Object.entries(professionStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([profession, count]) => ({
        name: profession,
        value: count,
        percentage: ((count / members.length) * 100).toFixed(1)
      }));

    const membershipTrendData = Object.entries(membershipTrends)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([year, count]) => ({
        year,
        members: count,
        cumulative: 0 // Will calculate below
      }));

    // Calculate cumulative members
    let cumulative = 0;
    membershipTrendData.forEach(item => {
      cumulative += item.members;
      item.cumulative = cumulative;
    });

    return {
      totalMembers: members.length,
      activeMembers,
      verifiedMembers,
      inactiveMembers: members.length - activeMembers,
      unverifiedMembers: members.length - verifiedMembers,
      ageDistribution: ageChartData,
      genderDistribution: genderChartData,
      cityDistribution: topCities,
      professionDistribution: topProfessions,
      membershipTrends: membershipTrendData,
      averageAge: Math.round(members.reduce((sum: number, m: any) => sum + m.age, 0) / members.length)
    };
  }, [members]);

  if (membersLoading || feedbackLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto p-4 sm:p-6 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 saffron-3d-card rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                विश्लेषण आणि अहवाल
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                महाराष्ट्र BJP संघटनेचे विश्लेषण आणि अहवाल
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                अहवाल डाउनलोड
              </Button>
              <Button 
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                फिल्टर
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण सदस्य</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">24,567</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +12% या महिन्यात
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">सक्रिय कार्यक्रम</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">15</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                या आठवड्यात
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण सूचना</CardTitle>
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">45</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +8 नवीन
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण फीडबॅक</CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">234</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +15 नवीन
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-amber-900">नवीन सदस्य</CardTitle>
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-orange-600">1,234</div>
              <p className="text-xs sm:text-sm text-amber-700">
                या महिन्यात जोडले
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-green-900">सत्यापित सदस्य</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">22,456</div>
              <p className="text-xs sm:text-sm text-green-700">
                91.4% सत्यापन दर
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-blue-900">सक्रिय जिल्हे</CardTitle>
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">36</div>
              <p className="text-xs sm:text-sm text-blue-700">
                संपूर्ण महाराष्ट्र
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-100 to-violet-100 border-2 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-purple-900">सरासरी वय</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">42</div>
              <p className="text-xs sm:text-sm text-purple-700">
                वर्षे
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border-2 border-orange-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                सदस्य वाढ दर
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">येथील महिना</span>
                  <span className="text-lg font-bold text-orange-600">+12.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">मागील महिना</span>
                  <span className="text-lg font-bold text-green-600">+8.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">येथील वर्ष</span>
                  <span className="text-lg font-bold text-blue-600">+15.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-orange-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                कार्यक्रम सहभाग
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">सरासरी उपस्थिती</span>
                  <span className="text-lg font-bold text-orange-600">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">एकूण कार्यक्रम</span>
                  <span className="text-lg font-bold text-green-600">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">यशस्वी कार्यक्रम</span>
                  <span className="text-lg font-bold text-blue-600">142</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-orange-200 rounded-xl">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Star className="h-5 w-5 text-orange-600" />
                सदस्य संतुष्टता
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">एकूण रेटिंग</span>
                  <span className="text-lg font-bold text-orange-600">4.6/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">सर्वाधिक रेटिंग</span>
                  <span className="text-lg font-bold text-green-600">4.8/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-amber-700">सुधारणा दर</span>
                  <span className="text-lg font-bold text-blue-600">+0.3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different analytics */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {language === 'mr' ? 'सदस्य विश्लेषण' : 'Member Analytics'}
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {language === 'mr' ? 'फीडबैक विश्लेषण' : 'Feedback Analytics'}
            </TabsTrigger>
          </TabsList>

          {/* Member Analytics Tab */}
          <TabsContent value="members" className="space-y-8">
            {/* Member Key Metrics Cards */}
            {memberAnalytics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">
                            {language === 'mr' ? 'एकूण सदस्य' : 'Total Members'}
                          </p>
                          <p className="text-3xl font-bold">{memberAnalytics.totalMembers}</p>
                        </div>
                        <Users className="w-12 h-12 text-blue-200" />
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">
                          {language === 'mr' ? 'सक्रिय वाढ' : 'Active Growth'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">
                            {language === 'mr' ? 'सक्रिय सदस्य' : 'Active Members'}
                          </p>
                          <p className="text-3xl font-bold">{memberAnalytics.activeMembers}</p>
                        </div>
                        <UserCheck className="w-12 h-12 text-green-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {Math.round((memberAnalytics.activeMembers / memberAnalytics.totalMembers) * 100)}% {language === 'mr' ? 'सक्रियता दर' : 'Activity Rate'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">
                            {language === 'mr' ? 'सत्यापित सदस्य' : 'Verified Members'}
                          </p>
                          <p className="text-3xl font-bold">{memberAnalytics.verifiedMembers}</p>
                        </div>
                        <Target className="w-12 h-12 text-purple-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {Math.round((memberAnalytics.verifiedMembers / memberAnalytics.totalMembers) * 100)}% {language === 'mr' ? 'सत्यापन दर' : 'Verification Rate'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">
                            {language === 'mr' ? 'सरासरी वय' : 'Average Age'}
                          </p>
                          <p className="text-3xl font-bold">{memberAnalytics.averageAge}</p>
                        </div>
                        <Calendar className="w-12 h-12 text-orange-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {language === 'mr' ? 'वर्षे' : 'Years'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Member Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Age Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        {language === 'mr' ? 'वयानुसार वितरण' : 'Age Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={memberAnalytics.ageDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value, name) => [value, language === 'mr' ? 'सदस्य' : 'Members']}
                            labelFormatter={(label) => `${language === 'mr' ? 'वयगट' : 'Age Group'}: ${label}`}
                          />
                          <Bar dataKey="value" fill="#FF8042" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gender Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5" />
                        {language === 'mr' ? 'लिंगानुसार वितरण' : 'Gender Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={memberAnalytics.genderDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                          >
                            {memberAnalytics.genderDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GENDER_COLORS[entry.name as keyof typeof GENDER_COLORS]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, language === 'mr' ? 'सदस्य' : 'Members']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Cities */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {language === 'mr' ? 'शहरानुसार वितरण' : 'City-wise Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={memberAnalytics.cityDistribution} layout="horizontal">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={80} />
                          <Tooltip 
                            formatter={(value) => [value, language === 'mr' ? 'सदस्य' : 'Members']}
                          />
                          <Bar dataKey="value" fill="#00C49F" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Profession Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {language === 'mr' ? 'व्यवसायानुसार वितरण' : 'Profession-wise Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={memberAnalytics.professionDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percentage }) => `${percentage}%`}
                          >
                            {memberAnalytics.professionDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [value, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Membership Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {language === 'mr' ? 'सदस्यत्वाची वाढ' : 'Membership Growth Trends'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={memberAnalytics.membershipTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            value, 
                            name === 'members' ? (language === 'mr' ? 'नवीन सदस्य' : 'New Members') : (language === 'mr' ? 'एकूण सदस्य' : 'Total Members')
                          ]}
                        />
                        <Area type="monotone" dataKey="members" stackId="1" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                        <Line type="monotone" dataKey="cumulative" stroke="#0088FE" strokeWidth={3} dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Feedback Analytics Tab */}
          <TabsContent value="feedback" className="space-y-8">
            {feedbackAnalytics && (
              <>
                {/* Feedback Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">
                            {language === 'mr' ? 'एकूण फीडबैक' : 'Total Feedback'}
                          </p>
                          <p className="text-3xl font-bold">{feedbackAnalytics.totalFeedback}</p>
                        </div>
                        <MessageSquare className="w-12 h-12 text-blue-200" />
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">
                          {language === 'mr' ? 'सदस्य प्रतिक्रिया' : 'Member Feedback'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">
                            {language === 'mr' ? 'लंबित फीडबैक' : 'Pending Feedback'}
                          </p>
                          <p className="text-3xl font-bold">{feedbackAnalytics.pendingFeedback}</p>
                        </div>
                        <Clock className="w-12 h-12 text-orange-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {language === 'mr' ? 'तातडीने उत्तर आवश्यक' : 'Needs Attention'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">
                            {language === 'mr' ? 'समाधान दर' : 'Resolution Rate'}
                          </p>
                          <p className="text-3xl font-bold">{feedbackAnalytics.resolutionRate}%</p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {feedbackAnalytics.resolvedFeedback} {language === 'mr' ? 'फीडबैक सोडवले' : 'resolved'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-500 to-red-700 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-red-100 text-sm">
                            {language === 'mr' ? 'सरासरी प्रतिक्रिया काळ' : 'Avg Response Time'}
                          </p>
                          <p className="text-3xl font-bold">{feedbackAnalytics.averageResponseDays}</p>
                        </div>
                        <Clock className="w-12 h-12 text-red-200" />
                      </div>
                      <div className="mt-4">
                        <span className="text-sm">
                          {language === 'mr' ? 'दिवस' : 'days'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5" />
                        {language === 'mr' ? 'श्रेणीनुसार वितरण' : 'Category Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={feedbackAnalytics.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percentage }) => `${percentage}%`}
                          >
                            {feedbackAnalytics.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={FEEDBACK_COLORS[entry.name as keyof typeof FEEDBACK_COLORS] || COLORS[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [value, name]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Status Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        {language === 'mr' ? 'स्थितीनुसार वितरण' : 'Status Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={feedbackAnalytics.statusDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [value, language === 'mr' ? 'फीडबैक' : 'Feedback']}
                          />
                          <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Priority Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {language === 'mr' ? 'प्राथमिकतेनुसार वितरण' : 'Priority Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={feedbackAnalytics.priorityDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage}%`}
                          >
                            {feedbackAnalytics.priorityDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name) => [value, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* User Type Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        {language === 'mr' ? 'उपयोगकर्ता प्रकारानुसार' : 'User Type Distribution'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={feedbackAnalytics.userTypeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value) => [value, language === 'mr' ? 'फीडबैक' : 'Feedback']}
                          />
                          <Bar dataKey="value" fill="#00C49F" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* District-wise Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {language === 'mr' ? 'जिल्ह्यानुसार फीडबैक वितरण' : 'District-wise Feedback Distribution'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={feedbackAnalytics.districtDistribution} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip 
                          formatter={(value) => [value, language === 'mr' ? 'फीडबैक' : 'Feedback']}
                        />
                        <Bar dataKey="value" fill="#FF8042" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      {language === 'mr' ? 'मासिक फीडबैक ट्रेंड' : 'Monthly Feedback Trends'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart data={feedbackAnalytics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="feedback" fill="#0088FE" name={language === 'mr' ? 'एकूण फीडबैक' : 'Total Feedback'} />
                        <Line type="monotone" dataKey="resolved" stroke="#00C49F" strokeWidth={3} name={language === 'mr' ? 'सोडवले' : 'Resolved'} />
                        <Line type="monotone" dataKey="pending" stroke="#FF8042" strokeWidth={3} name={language === 'mr' ? 'लंबित' : 'Pending'} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Combined Quick Stats (shown for both tabs) */}
        {memberAnalytics && feedbackAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'mr' ? 'सर्वाधिक सदस्य असलेले शहर' : 'Top City by Members'}
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {memberAnalytics.cityDistribution[0]?.name}
                  </p>
                  <p className="text-gray-500">
                    {memberAnalytics.cityDistribution[0]?.value} {language === 'mr' ? 'सदस्य' : 'members'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'mr' ? 'सर्वाधिक फीडबैक श्रेणी' : 'Top Feedback Category'}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {feedbackAnalytics.categoryDistribution[0]?.name}
                  </p>
                  <p className="text-gray-500">
                    {feedbackAnalytics.categoryDistribution[0]?.percentage}% {language === 'mr' ? 'फीडबैक' : 'of feedback'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {language === 'mr' ? 'सर्वाधिक वयगट' : 'Dominant Age Group'}
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {memberAnalytics.ageDistribution.reduce((max, current) => current.value > max.value ? current : max).name}
                  </p>
                  <p className="text-gray-500">
                    {memberAnalytics.ageDistribution.reduce((max, current) => current.value > max.value ? current : max).percentage}% {language === 'mr' ? 'सदस्य' : 'of members'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 