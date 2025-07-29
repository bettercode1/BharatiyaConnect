import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Twitter,
  Instagram,
  ExternalLink,
  Edit,
  Trash2,
  Mail,
  Search,
  Crown,
  Award,
  MapPin,
  Users,
  Star,
  Filter,
  User,
  UserPlus,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import bjpSymbol from "@/assets/bjp-symbol.png";

const leadershipFormSchema = z.object({
  name: z.string().min(1, "नाव आवश्यक आहे"),
  designation: z.string().min(1, "पदनाम आवश्यक आहे"),
  category: z.string().min(1, "वर्ग आवश्यक आहे"),
  region: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  contactEmail: z.string().email("वैध ईमेल पत्ता टाका").optional().or(z.literal("")),
  socialMedia: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),
  displayOrder: z.string().optional(),
});

type LeadershipFormData = z.infer<typeof leadershipFormSchema>;

// Political Leadership Data
const politicalLeadershipData = [
  // प्रदेश पदाधिकारी
  {
    id: 'pradesh-1',
    name: 'रविंद्र चव्हाण',
    designation: 'प्रदेशाध्यक्ष',
    category: 'pradesh',
    region: 'कल्याण-डोंबिवली',
    bio: 'कल्याण-डोंबिवली प्रदेशाध्यक्ष',
    profileImage: '',
    type: 'प्रदेशाध्यक्ष'
  },
  // उपाध्यक्ष
  { id: 'pradesh-2', name: 'राम शिंदे', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'अहमदनगर', type: 'उपाध्यक्ष' },
  { id: 'pradesh-3', name: 'आशीष शेलार', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'मुंबई', type: 'उपाध्यक्ष' },
  { id: 'pradesh-4', name: 'प्रशांत बामब', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'मुंबई', type: 'उपाध्यक्ष' },
  { id: 'pradesh-5', name: 'नितीन धावळे', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नाशिक', type: 'उपाध्यक्ष' },
  { id: 'pradesh-6', name: 'चंद्रशेखर बावन काव', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'सोलापूर', type: 'उपाध्यक्ष' },
  { id: 'pradesh-7', name: 'सुधीर मुनगंटीवार', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नागपूर', type: 'उपाध्यक्ष' },
  { id: 'pradesh-8', name: 'कुणाल पाटील', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'सातारा', type: 'उपाध्यक्ष' },
  { id: 'pradesh-9', name: 'सुशील कुमार मोदी', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नांदेड', type: 'उपाध्यक्ष' },
  { id: 'pradesh-10', name: 'पांडुरंग फडकुले', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'कोल्हापूर', type: 'उपाध्यक्ष' },
  // महामंत्री
  { id: 'pradesh-20', name: 'कृपाशंकर सिंह', designation: 'महामंत्री', category: 'pradesh', region: 'मुंबई', type: 'महामंत्री' },
  { id: 'pradesh-21', name: 'अमित गोसावी', designation: 'महामंत्री', category: 'pradesh', region: 'पुणे', type: 'महामंत्री' },
  { id: 'pradesh-22', name: 'कमल पाटील', designation: 'महामंत्री', category: 'pradesh', region: 'नागपूर', type: 'महामंत्री' },
  { id: 'pradesh-23', name: 'पंकज मुंडे', designation: 'महामंत्री', category: 'pradesh', region: 'बीड', type: 'महामंत्री' },
  // कोषाध्यक्ष
  { id: 'pradesh-30', name: 'हर्षवर्धन पाटील', designation: 'कोषाध्यक्ष', category: 'pradesh', region: 'अहमदनगर', type: 'कोषाध्यक्ष' },

  // राष्ट्रीय पदाधिकारी
  { id: 'rashtriya-1', name: 'नरेंद्र मोदी', designation: 'पंतप्रधान', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व' },
  { id: 'rashtriya-2', name: 'अमित शाह', designation: 'गृहमंत्री', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व' },
  { id: 'rashtriya-3', name: 'जेपी नड्डा', designation: 'राष्ट्रीय अध्यक्ष', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व' },
  { id: 'rashtriya-4', name: 'राजनाथ सिंह', designation: 'संरक्षणमंत्री', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व' },
  { id: 'rashtriya-5', name: 'नितीन गडकरी', designation: 'केंद्रीय मंत्री', category: 'rashtriya', region: 'नागपूर', type: 'राष्ट्रीय नेतृत्व' },

  // लोकसभा सदस्य
  { id: 'loksabha-1', name: 'देवेंद्र फडणवीस', designation: 'खासदार', category: 'loksabha', region: 'नागपूर', type: 'लोकसभा सदस्य' },
  { id: 'loksabha-2', name: 'पीयूष गोयल', designation: 'खासदार', category: 'loksabha', region: 'मुंबई उत्तर', type: 'लोकसभा सदस्य' },
  { id: 'loksabha-3', name: 'गुल पनाग', designation: 'खासदार', category: 'loksabha', region: 'चंदीगड', type: 'लोकसभा सदस्य' },
  { id: 'loksabha-4', name: 'प्रकाश जावडेकर', designation: 'खासदार', category: 'loksabha', region: 'राज्यसभा', type: 'लोकसभा सदस्य' },

  // राज्यसभा सदस्य
  { id: 'rajyasabha-1', name: 'अनिल बोंडे', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य' },
  { id: 'rajyasabha-2', name: 'उद्यनराजे भोसले', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य' },
  { id: 'rajyasabha-3', name: 'विकास महात्मे', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य' },

  // विधानमंडळ सदस्य
  { id: 'legislature-1', name: 'एकनाथ शिंदे', designation: 'मुख्यमंत्री', category: 'legislature', region: 'ठाणे', type: 'विधानमंडळ सदस्य' },
  { id: 'legislature-2', name: 'अजित पवार', designation: 'उपमुख्यमंत्री', category: 'legislature', region: 'बारामती', type: 'विधानमंडळ सदस्य' },
  { id: 'legislature-3', name: 'चंद्रकांत पाटील', designation: 'गृहमंत्री', category: 'legislature', region: 'कोल्हापूर', type: 'विधानमंडळ सदस्य' },
];

export default function Leadership() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<any>(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Navigation functions for category cards
  const navigateToSection = (section: string) => {
    console.log('Leadership card clicked, navigating to section:', section);
    setLocation(`/?section=${section}`);
  };

  const { data: leadership, isLoading } = useQuery({
    queryKey: ["/api/leadership"],
  });

  // Combine API data with political leadership data
  const allLeadership = [
    ...(leadership && Array.isArray(leadership) ? leadership : []),
    ...politicalLeadershipData
  ];

  const createLeadershipMutation = useMutation({
    mutationFn: async (data: LeadershipFormData) => {
      const leaderData = {
        ...data,
        displayOrder: data.displayOrder ? parseInt(data.displayOrder) : 0,
        socialMedia: data.socialMedia || {},
      };
      await apiRequest("POST", "/api/leadership", leaderData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership"] });
      toast({
        title: "यशस्वी",
        description: "नेतृत्व सदस्य यशस्वीरित्या जोडला गेला",
      });
      setIsCreateOpen(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "अनधिकृत",
          description: "तुम्ही लॉग आउट झाला आहात. पुन्हा लॉगिन करत आहे...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "त्रुटी",
        description: "नेतृत्व सदस्य जोडता आला नाही",
        variant: "destructive",
      });
    },
  });

  const deleteLeadershipMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/leadership/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leadership"] });
      toast({
        title: "यशस्वी",
        description: "नेतृत्व सदस्य हटवला गेला",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "अनधिकृत",
          description: "तुम्ही लॉग आउट झाला आहात. पुन्हा लॉगिन करत आहे...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "त्रुटी",
        description: "नेतृत्व सदस्य हटवता आला नाही",
        variant: "destructive",
      });
    },
  });

  const form = useForm<LeadershipFormData>({
    resolver: zodResolver(leadershipFormSchema),
    defaultValues: {
      name: "",
      designation: "",
      category: "",
      region: "",
      bio: "",
      profileImage: "",
      contactEmail: "",
      socialMedia: {
        twitter: "",
        instagram: "",
        facebook: "",
      },
      displayOrder: "0",
    },
  });

  const onSubmit = (data: LeadershipFormData) => {
    createLeadershipMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("तुम्हाला खात्री आहे की तुम्ही या नेतृत्व सदस्याला हटवू इच्छिता?")) {
      deleteLeadershipMutation.mutate(id);
    }
  };

  const handleEdit = (leader: any) => {
    setEditingLeader(leader);
    form.reset({
      name: leader.name,
      designation: leader.designation,
      category: leader.category || '',
      region: leader.region || '',
      bio: leader.bio || '',
      profileImage: leader.profileImage || '',
      contactEmail: leader.contactEmail || '',
      socialMedia: leader.socialMedia || { twitter: '', instagram: '', facebook: '' },
      displayOrder: leader.displayOrder?.toString() || '0',
    });
    setIsCreateOpen(true);
  };

  // Enhanced filtering logic
  const filteredLeadership = allLeadership.filter((leader: any) => {
    const matchesSearch = 
    leader.name.toLowerCase().includes(search.toLowerCase()) ||
      leader.designation.toLowerCase().includes(search.toLowerCase()) ||
      (leader.region && leader.region.toLowerCase().includes(search.toLowerCase())) ||
      (leader.type && leader.type.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filterCategory === "all" || leader.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="space-y-8 p-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-64">
              <CardContent className="p-6">
                <Skeleton className="w-full h-32 mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
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
                नेतृत्व आणि पदाधिकारी
            </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                महाराष्ट्र BJP संघटनेचे नेतृत्व आणि पदाधिकारी
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={() => setShowMemberModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                नवीन सदस्य
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण सदस्य</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{allLeadership.length}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                सर्व सदस्य
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">पदाधिकारी</CardTitle>
              <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {allLeadership.filter(m => m.designation.includes('पदाधिकारी')).length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                सक्रिय पदाधिकारी
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">कार्यकर्ता</CardTitle>
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {allLeadership.filter(m => m.designation.includes('कार्यकर्ता')).length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                सक्रिय कार्यकर्ता
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">नवीन सदस्य</CardTitle>
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">156</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                या महिन्यात
              </p>
            </CardContent>
          </Card>
            </div>

        {/* Navigation Cards - Click to go to Political Leadership sections */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'mr' ? 'राजकीय नेतृत्व विभाग' : 'Political Leadership Sections'}
            </h2>
            <p className="text-gray-600">
              {language === 'mr' ? 'खालील कार्डांवर क्लिक करून संबंधित विभाग पहा' : 'Click on the cards below to view respective sections'}
            </p>
          </div>

          {/* Category Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div 
              className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl p-6 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigateToSection('pradesh')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {language === 'mr' ? 'प्रादेशिक अधिकारी' : 'Regional Officers'}
                </h4>
                <div className="bg-purple-400 text-purple-900 px-3 py-1 rounded-lg text-sm font-semibold">
                  {language === 'mr' ? 'महाराष्ट्र' : 'Maharashtra'}
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl p-6 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigateToSection('rashtriya')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {language === 'mr' ? 'राष्ट्रीय अधिकारी' : 'National Officers'}
                </h4>
                <div className="bg-indigo-400 text-indigo-900 px-3 py-1 rounded-lg text-sm font-semibold">
                  {language === 'mr' ? 'भारत' : 'India'}
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-6 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigateToSection('loksabha')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {language === 'mr' ? 'खासदार सदस्य' : 'MP Members'}
                </h4>
                <div className="bg-teal-400 text-teal-900 px-3 py-1 rounded-lg text-sm font-semibold">
                  {language === 'mr' ? 'लोकसभा' : 'Lok Sabha'}
                </div>
              </div>
            </div>

            <div 
              className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl p-6 text-white shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => navigateToSection('legislature')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-rose-600" />
                </div>
                <h4 className="text-lg font-bold mb-2">
                  {language === 'mr' ? 'विधानसभा सदस्य' : 'Assembly Members'}
                </h4>
                <div className="bg-rose-400 text-rose-900 px-3 py-1 rounded-lg text-sm font-semibold">
                  {language === 'mr' ? 'एमएलए' : 'MLA'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Honor Badge */}
          <div className="flex justify-center">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-12 py-4 rounded-full text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => navigateToSection('rajyasabha')}
            >
              {language === 'mr' ? 'राज्यसभा सदस्य' : 'Member of Rajya Sabha'}
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={language === 'mr' ? "नेत्याचे नाव, पदनाम किंवा क्षेत्र शोधा..." : "Search leader name, designation or region..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded-md bg-white"
            >
              <option value="all">{language === 'mr' ? 'सर्व वर्ग' : 'All Categories'}</option>
              <option value="pradesh">{language === 'mr' ? 'प्रदेश पदाधिकारी' : 'State Officers'}</option>
              <option value="rashtriya">{language === 'mr' ? 'राष्ट्रीय पदाधिकारी' : 'National Officers'}</option>
              <option value="loksabha">{language === 'mr' ? 'लोकसभा सदस्य' : 'Lok Sabha Members'}</option>
              <option value="rajyasabha">{language === 'mr' ? 'राज्यसभा सदस्य' : 'Rajya Sabha Members'}</option>
              <option value="legislature">{language === 'mr' ? 'विधानमंडळ सदस्य' : 'Legislature Members'}</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'mr' ? 
              `${filteredLeadership.length} नेते आढळले` : 
              `Found ${filteredLeadership.length} leaders`
            }
            {search && (
              <span className="ml-2 text-orange-600 font-medium">
                "{search}" {language === 'mr' ? 'साठी' : 'for'}
              </span>
            )}
            {filterCategory !== 'all' && (
              <span className="ml-2 text-blue-600 font-medium">
                {language === 'mr' ? 'मध्ये' : 'in'} {
                  filterCategory === 'pradesh' ? (language === 'mr' ? 'प्रदेश पदाधिकारी' : 'State Officers') :
                  filterCategory === 'rashtriya' ? (language === 'mr' ? 'राष्ट्रीय पदाधिकारी' : 'National Officers') :
                  filterCategory === 'loksabha' ? (language === 'mr' ? 'लोकसभा सदस्य' : 'Lok Sabha Members') :
                  filterCategory === 'rajyasabha' ? (language === 'mr' ? 'राज्यसभा सदस्य' : 'Rajya Sabha Members') :
                  filterCategory === 'legislature' ? (language === 'mr' ? 'विधानमंडळ सदस्य' : 'Legislature Members') : ''
                }
              </span>
            )}
          </p>
          </div>

          {/* Leaders Grid */}
        {filteredLeadership.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLeadership.map((leader: any, index: number) => (
              <Card
                key={leader.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group border-l-4 border-orange-500"
              >
                <CardContent className="p-6 text-center">
                  {/* Edit/Delete buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={() => handleEdit(leader)}
                        title={language === 'mr' ? 'संपादित करा' : 'Edit'}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(leader.id)}
                        disabled={deleteLeadershipMutation.isPending}
                        title={language === 'mr' ? 'हटवा' : 'Delete'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-orange-200">
                    <AvatarImage src={leader.profileImage} />
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                      {leader.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{leader.name}</h3>
                  
                  <Badge className="bg-orange-100 text-orange-800 mb-2">
                    {leader.designation}
                  </Badge>

                  {leader.region && (
                    <div className="flex items-center justify-center text-gray-500 mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="text-xs">{leader.region}</span>
                    </div>
                  )}

                  {leader.type && (
                    <Badge variant="outline" className="mb-3 text-xs">
                      {leader.type}
                    </Badge>
                  )}

                  {leader.bio && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                      {leader.bio}
                    </p>
                  )}

                  <div className="flex justify-center space-x-2">
                    {leader.socialMedia?.twitter && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 bg-blue-100 hover:bg-blue-200 rounded-full"
                        onClick={() => window.open(`https://twitter.com/${leader.socialMedia.twitter}`, '_blank')}
                      >
                        <Twitter className="w-4 h-4 text-blue-600" />
                      </Button>
                    )}
                    {leader.socialMedia?.instagram && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 bg-pink-100 hover:bg-pink-200 rounded-full"
                        onClick={() => window.open(`https://instagram.com/${leader.socialMedia.instagram}`, '_blank')}
                      >
                        <Instagram className="w-4 h-4 text-pink-600" />
                      </Button>
                    )}
                    {leader.contactEmail && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-8 h-8 p-0 bg-green-100 hover:bg-green-200 rounded-full"
                        onClick={() => window.open(`mailto:${leader.contactEmail}`, '_blank')}
                      >
                        <Mail className="w-4 h-4 text-green-600" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'mr' ? 'कोणतेही नेते आढळले नाहीत' : 'No leaders found'}
                </h3>
            <p className="text-gray-500 mb-4">
                  {language === 'mr' ? 'नवीन शोध टर्म वापरून पहा किंवा नवीन नेते जोडा' : 'Try a new search term or add new leaders'}
                </p>
            <Button
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
              }}
              variant="outline"
            >
              {language === 'mr' ? 'फिल्टर साफ करा' : 'Clear Filters'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
