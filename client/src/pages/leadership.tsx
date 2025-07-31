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
    profileImage: '/assets/Politician Image/रविंद्र चव्हाण.webp',
    type: 'प्रदेशाध्यक्ष',
    priority: 1
  },
  // उपाध्यक्ष
  { id: 'pradesh-2', name: 'राम शिंदे', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'अहमदनगर', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/राम शिंदे.webp', priority: 2 },
  { id: 'pradesh-3', name: 'आशीष शेलार', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'मुंबई', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/आशीष शेलार.webp', priority: 2 },
  { id: 'pradesh-4', name: 'प्रशांत बामब', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'मुंबई', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/प्रशांत बामब.jpg', priority: 2 },
  { id: 'pradesh-5', name: 'नितीन धावळे', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नाशिक', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/नितीन धावळे.jpg', priority: 2 },
  { id: 'pradesh-6', name: 'चंद्रशेखर बावन काव', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'सोलापूर', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/चंद्रशेखर बावन काव.jpg', priority: 2 },
  { id: 'pradesh-7', name: 'सुधीर मुनगंटीवार', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नागपूर', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/सुधीर मुनगंटीवार.jpg', priority: 2 },
  { id: 'pradesh-8', name: 'कुणाल पाटील', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'सातारा', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/कुणाल पाटील.jpg', priority: 2 },
  { id: 'pradesh-9', name: 'सुशील कुमार मोदी', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'नांदेड', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/सुशील कुमार मोदी.jpg', priority: 2 },
  { id: 'pradesh-10', name: 'पांडुरंग फडकुले', designation: 'उपाध्यक्ष', category: 'pradesh', region: 'कोल्हापूर', type: 'उपाध्यक्ष', profileImage: '/assets/Politician Image/पांडुरंग फडकुले.jpg', priority: 2 },
  // महामंत्री
  { id: 'pradesh-20', name: 'कृपाशंकर सिंह', designation: 'महामंत्री', category: 'pradesh', region: 'मुंबई', type: 'महामंत्री', profileImage: '/assets/Politician Image/कृपाशंकर सिंह.jpg', priority: 3 },
  { id: 'pradesh-21', name: 'अमित गोसावी', designation: 'महामंत्री', category: 'pradesh', region: 'पुणे', type: 'महामंत्री', profileImage: '/assets/Politician Image/अमित गोसावी.jpg', priority: 3 },
  { id: 'pradesh-22', name: 'कमल पाटील', designation: 'महामंत्री', category: 'pradesh', region: 'नागपूर', type: 'महामंत्री', profileImage: '/assets/Politician Image/कमल पाटील.jpg', priority: 3 },
  { id: 'pradesh-23', name: 'पंकज मुंडे', designation: 'महामंत्री', category: 'pradesh', region: 'बीड', type: 'महामंत्री', profileImage: '/assets/Politician Image/पंकज मुंडे.jpg', priority: 3 },
  // कोषाध्यक्ष
  { id: 'pradesh-30', name: 'हर्षवर्धन पाटील', designation: 'कोषाध्यक्ष', category: 'pradesh', region: 'अहमदनगर', type: 'कोषाध्यक्ष', profileImage: '/assets/Politician Image/हर्षवर्धन पाटील.jpg', priority: 4 },

  // राष्ट्रीय पदाधिकारी
  { id: 'rashtriya-1', name: 'नरेंद्र मोदी', designation: 'पंतप्रधान', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व', profileImage: '/assets/Politician Image/नरेंद्र मोदी.jpg', priority: 0 },
  { id: 'rashtriya-2', name: 'अमित शाह', designation: 'गृहमंत्री', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व', profileImage: '/assets/Politician Image/अमित शाह.jpg', priority: 0 },
  { id: 'rashtriya-3', name: 'जेपी नड्डा', designation: 'राष्ट्रीय अध्यक्ष', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व', profileImage: '/assets/Politician Image/जेपी नड्डा.jpg', priority: 0 },
  { id: 'rashtriya-4', name: 'राजनाथ सिंह', designation: 'संरक्षणमंत्री', category: 'rashtriya', region: 'नई दिल्ली', type: 'राष्ट्रीय नेतृत्व', profileImage: '/assets/Politician Image/राजनाथ सिंह.jpg', priority: 0 },
  { id: 'rashtriya-5', name: 'नितीन गडकरी', designation: 'केंद्रीय मंत्री', category: 'rashtriya', region: 'नागपूर', type: 'राष्ट्रीय नेतृत्व', profileImage: '/assets/Politician Image/नितीन गडकरी.jpg', priority: 0 },

  // लोकसभा सदस्य
  { id: 'loksabha-1', name: 'देवेंद्र फडणवीस', designation: 'मुख्यमंत्री', category: 'loksabha', region: 'नागपूर', type: 'लोकसभा सदस्य', profileImage: '/assets/Politician Image/देवेंद्र फडणवीस.jpg', priority: 5 },
  { id: 'loksabha-2', name: 'पीयूष गोयल', designation: 'खासदार', category: 'loksabha', region: 'मुंबई उत्तर', type: 'लोकसभा सदस्य', profileImage: '/assets/Politician Image/पीयूष गोयल.jpg', priority: 5 },
  { id: 'loksabha-4', name: 'प्रकाश जावडेकर', designation: 'खासदार', category: 'loksabha', region: 'राज्यसभा', type: 'लोकसभा सदस्य', profileImage: '/assets/Politician Image/प्रकाश जावडेकर.jpg', priority: 5 },

  // राज्यसभा सदस्य
  { id: 'rajyasabha-1', name: 'अनिल बोंडे', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य', profileImage: '/assets/Politician Image/अनिल बोंडे.jpg', priority: 6 },
  { id: 'rajyasabha-2', name: 'उद्यनराजे भोसले', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य', profileImage: '/assets/Politician Image/उद्यनराजे भोसले.jpg', priority: 6 },
  { id: 'rajyasabha-3', name: 'विकास महात्मे', designation: 'राज्यसभा सदस्य', category: 'rajyasabha', region: 'महाराष्ट्र', type: 'राज्यसभा सदस्य', profileImage: '', priority: 6 },

  // विधानमंडळ सदस्य
  { id: 'legislature-3', name: 'चंद्रकांत पाटील', designation: 'राज्य गृहमंत्री', category: 'legislature', region: 'कोल्हापूर', type: 'विधानमंडळ सदस्य', profileImage: '/assets/Politician Image/चंद्रकांत पाटील.jpg', priority: 9 },
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

  // Enhanced filtering and sorting logic
  const filteredLeadership = allLeadership
    .filter((leader: any) => {
    const matchesSearch = 
    leader.name.toLowerCase().includes(search.toLowerCase()) ||
      leader.designation.toLowerCase().includes(search.toLowerCase()) ||
      (leader.region && leader.region.toLowerCase().includes(search.toLowerCase())) ||
      (leader.type && leader.type.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = filterCategory === "all" || leader.category === filterCategory;

    return matchesSearch && matchesCategory;
    })
    .sort((a: any, b: any) => {
      // Sort by priority (political hierarchy) first
      const priorityA = a.priority || 999;
      const priorityB = b.priority || 999;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by designation within the same category
      const designationOrder: { [key: string]: number } = {
        // National Level (Priority 0)
        'पंतप्रधान': 0,
        'राष्ट्रीय अध्यक्ष': 1,
        'गृहमंत्री': 2,
        'संरक्षणमंत्री': 3,
        'केंद्रीय मंत्री': 4,
        
        // State Level (Priority 1-4)
        'प्रदेशाध्यक्ष': 0,
        'उपाध्यक्ष': 1,
        'महामंत्री': 2,
        'कोषाध्यक्ष': 3,
        
        // Legislative Level (Priority 7-9)
        'मुख्यमंत्री': 0,
        'उपमुख्यमंत्री': 1,
        'राज्य गृहमंत्री': 2,
        
        // Parliamentary Level (Priority 5-6)
        'खासदार': 1,
        'राज्यसभा सदस्य': 2
      };
      
      const orderA = designationOrder[a.designation as string] || 999;
      const orderB = designationOrder[b.designation as string] || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // If same designation, sort by region importance
      const regionOrder: { [key: string]: number } = {
        'नई दिल्ली': 0,
        'मुंबई': 1,
        'नागपूर': 2,
        'पुणे': 3,
        'ठाणे': 4,
        'बारामती': 5,
        'कोल्हापूर': 6,
        'अहमदनगर': 7,
        'नाशिक': 8,
        'सोलापूर': 9,
        'सातारा': 10,
        'नांदेड': 11,
        'बीड': 12,
        'महाराष्ट्र': 13,
        'मुंबई उत्तर': 14,
        'राज्यसभा': 15,
        'कल्याण-डोंबिवली': 16
      };
      
      const regionA = regionOrder[a.region as string] || 999;
      const regionB = regionOrder[b.region as string] || 999;
      
      if (regionA !== regionB) {
        return regionA - regionB;
      }
      
      // Finally sort by name
      return a.name.localeCompare(b.name, 'hi-IN');
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
                महाराष्ट्र BJP नेतृत्व
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

        {/* Leadership Images Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 sm:space-x-8 mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
              <img 
                src="/assets/Politician Image/नरेंद्र मोदी.jpg" 
                alt="Narendra Modi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
              <img 
                src="/assets/Politician Image/जेपी नड्डा.jpg" 
                alt="JP Nadda"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg bg-white flex items-center justify-center">
              <img 
                src="/assets/bjp-symbol.png" 
                alt="BJP Symbol"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
              <img 
                src="/assets/Politician Image/देवेंद्र फडणवीस.jpg" 
                alt="Devendra Fadnavis"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-orange-200 shadow-lg">
              <img 
                src="/assets/Politician Image/एकनाथ शिंदे.jpg" 
                alt="Eknath Shinde"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
            <Button
              variant={filterCategory === 'pradesh' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'pradesh' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('pradesh')}
            >
              <Star className="w-4 h-4 mr-2" />
              प्रदेश पदाधिकारी
            </Button>
            
            <Button
              variant={filterCategory === 'rashtriya' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'rashtriya' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('rashtriya')}
            >
              <Crown className="w-4 h-4 mr-2" />
              राष्ट्रीय पदाधिकारी
            </Button>
            
            <Button
              variant={filterCategory === 'legislature' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'legislature' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('legislature')}
            >
              <Award className="w-4 h-4 mr-2" />
              विधानमंडळ सदस्य
            </Button>
            
            <Button
              variant={filterCategory === 'loksabha' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'loksabha' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('loksabha')}
            >
              <Users className="w-4 h-4 mr-2" />
              लोकसभा सदस्य
            </Button>
            
            <Button
              variant={filterCategory === 'rajyasabha' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'rajyasabha' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('rajyasabha')}
            >
              <Users className="w-4 h-4 mr-2" />
              राज्यसभा सदस्य
            </Button>
            
            <Button
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              className={`${
                filterCategory === 'all' 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'border-orange-200 text-orange-600 hover:bg-orange-50'
              } transition-all duration-200`}
              onClick={() => setFilterCategory('all')}
            >
              <Filter className="w-4 h-4 mr-2" />
              सर्व पहा
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



        {/* Search Control */}
        <div className="flex justify-center mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={language === 'mr' ? "नेत्याचे नाव, पदनाम किंवा क्षेत्र शोधा..." : "Search leader name, designation or region..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
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
          <div className="space-y-8">
            {/* National Level */}
            {filteredLeadership.filter((leader: any) => leader.priority === 0).length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-600" />
                    राष्ट्रीय नेतृत्व
                  </h2>
                  <p className="text-gray-600">भारत सरकार आणि राष्ट्रीय पदाधिकारी</p>
                </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLeadership.filter((leader: any) => leader.priority === 0).map((leader: any, index: number) => (
              <Card
                key={leader.id}
                      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                      style={{
                        borderLeft: `4px solid #FF6B35`
                      }}
              >
                      <CardContent className="p-4 text-center">
                  {/* Edit/Delete buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                        onClick={() => handleEdit(leader)}
                        title={language === 'mr' ? 'संपादित करा' : 'Edit'}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md"
                        onClick={() => handleDelete(leader.id)}
                        disabled={deleteLeadershipMutation.isPending}
                        title={language === 'mr' ? 'हटवा' : 'Delete'}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                        {/* Priority Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-orange-500 text-white text-xs font-bold">
                            राष्ट्रीय
                          </Badge>
                        </div>

                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200 shadow-lg">
                          <AvatarImage src={leader.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
                      {leader.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{leader.name}</h3>
                  
                        <Badge className="bg-orange-100 text-orange-800 mb-3 text-sm font-semibold">
                    {leader.designation}
                  </Badge>

                  {leader.region && (
                          <div className="flex items-center justify-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">{leader.region}</span>
                    </div>
                  )}

                        {leader.bio && (
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                            {leader.bio}
                          </p>
                        )}

                        <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
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
              </div>
            )}

            {/* State BJP Leadership */}
            {filteredLeadership.filter((leader: any) => leader.priority >= 1 && leader.priority <= 4).length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Star className="w-6 h-6 mr-2 text-orange-600" />
                    प्रदेश BJP नेतृत्व
                  </h2>
                  <p className="text-gray-600">महाराष्ट्र BJP संघटनेचे पदाधिकारी</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLeadership.filter((leader: any) => leader.priority >= 1 && leader.priority <= 4).map((leader: any, index: number) => (
                    <Card
                      key={leader.id}
                      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                      style={{
                        borderLeft: `4px solid ${
                          leader.priority === 1 ? '#FF8C00' : // Pradesh Adhyaksh
                          leader.priority === 2 ? '#FFA500' : // Upadhyaksh
                          leader.priority === 3 ? '#FFB347' : // Mahamantri
                          '#FFC107' // Koshadhyaksh
                        }`
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        {/* Edit/Delete buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                              onClick={() => handleEdit(leader)}
                              title={language === 'mr' ? 'संपादित करा' : 'Edit'}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md"
                              onClick={() => handleDelete(leader.id)}
                              disabled={deleteLeadershipMutation.isPending}
                              title={language === 'mr' ? 'हटवा' : 'Delete'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge 
                            className={`text-xs font-bold ${
                              leader.priority === 1 ? 'bg-orange-600 text-white' :
                              leader.priority === 2 ? 'bg-orange-500 text-white' :
                              leader.priority === 3 ? 'bg-orange-400 text-white' :
                              'bg-amber-500 text-white'
                            }`}
                          >
                            {leader.priority === 1 ? 'प्रदेश' :
                             leader.priority === 2 ? 'उपाध्यक्ष' :
                             leader.priority === 3 ? 'महामंत्री' :
                             'कोषाध्यक्ष'}
                    </Badge>
                        </div>

                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200 shadow-lg">
                          <AvatarImage src={leader.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
                            {leader.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{leader.name}</h3>
                        
                        <Badge className="bg-orange-100 text-orange-800 mb-3 text-sm font-semibold">
                          {leader.designation}
                        </Badge>

                        {leader.region && (
                          <div className="flex items-center justify-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">{leader.region}</span>
                          </div>
                  )}

                  {leader.bio && (
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {leader.bio}
                    </p>
                  )}

                        <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
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
              </div>
            )}

            {/* Parliamentary Members */}
            {filteredLeadership.filter((leader: any) => leader.priority >= 5 && leader.priority <= 6).length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-blue-600" />
                    संसद सदस्य
                  </h2>
                  <p className="text-gray-600">लोकसभा आणि राज्यसभा सदस्य</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLeadership.filter((leader: any) => leader.priority >= 5 && leader.priority <= 6).map((leader: any, index: number) => (
                    <Card
                      key={leader.id}
                      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                      style={{
                        borderLeft: `4px solid ${
                          leader.priority === 5 ? '#4CAF50' : // Lok Sabha
                          '#2196F3' // Rajya Sabha
                        }`
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        {/* Edit/Delete buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                              onClick={() => handleEdit(leader)}
                              title={language === 'mr' ? 'संपादित करा' : 'Edit'}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md"
                              onClick={() => handleDelete(leader.id)}
                              disabled={deleteLeadershipMutation.isPending}
                              title={language === 'mr' ? 'हटवा' : 'Delete'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge 
                            className={`text-xs font-bold ${
                              leader.priority === 5 ? 'bg-green-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}
                          >
                            {leader.priority === 5 ? 'लोकसभा' : 'राज्यसभा'}
                          </Badge>
                        </div>

                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200 shadow-lg">
                          <AvatarImage src={leader.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
                            {leader.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{leader.name}</h3>
                        
                        <Badge className="bg-orange-100 text-orange-800 mb-3 text-sm font-semibold">
                          {leader.designation}
                        </Badge>

                        {leader.region && (
                          <div className="flex items-center justify-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">{leader.region}</span>
                          </div>
                        )}

                        {leader.bio && (
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                            {leader.bio}
                          </p>
                        )}

                        <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
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
              </div>
            )}

            {/* State Government */}
            {filteredLeadership.filter((leader: any) => leader.priority >= 7 && leader.priority <= 9).length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-purple-600" />
                    राज्य सरकार
                  </h2>
                  <p className="text-gray-600">महाराष्ट्र सरकारचे मंत्री आणि पदाधिकारी</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLeadership.filter((leader: any) => leader.priority >= 7 && leader.priority <= 9).map((leader: any, index: number) => (
                    <Card
                      key={leader.id}
                      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group overflow-hidden"
                      style={{
                        borderLeft: `4px solid ${
                          leader.priority === 7 ? '#9C27B0' : // CM
                          leader.priority === 8 ? '#E91E63' : // Deputy CM
                          '#607D8B' // Home Minister
                        }`
                      }}
                    >
                      <CardContent className="p-4 text-center">
                        {/* Edit/Delete buttons */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                              onClick={() => handleEdit(leader)}
                              title={language === 'mr' ? 'संपादित करा' : 'Edit'}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600 hover:text-red-700 shadow-md"
                              onClick={() => handleDelete(leader.id)}
                              disabled={deleteLeadershipMutation.isPending}
                              title={language === 'mr' ? 'हटवा' : 'Delete'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Priority Badge */}
                        <div className="absolute top-2 left-2">
                          <Badge 
                            className={`text-xs font-bold ${
                              leader.priority === 7 ? 'bg-purple-500 text-white' :
                              leader.priority === 8 ? 'bg-pink-500 text-white' :
                              'bg-blue-grey-500 text-white'
                            }`}
                          >
                            {leader.priority === 7 ? 'मुख्यमंत्री' :
                             leader.priority === 8 ? 'उपमुख्यमंत्री' :
                             'राज्य गृहमंत्री'}
                          </Badge>
                        </div>

                        <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-200 shadow-lg">
                          <AvatarImage src={leader.profileImage} className="object-cover" />
                          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xl">
                            {leader.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>

                        <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight">{leader.name}</h3>
                        
                        <Badge className="bg-orange-100 text-orange-800 mb-3 text-sm font-semibold">
                          {leader.designation}
                        </Badge>

                        {leader.region && (
                          <div className="flex items-center justify-center text-gray-600 mb-3">
                            <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                            <span className="text-sm font-medium">{leader.region}</span>
                          </div>
                        )}

                        {leader.bio && (
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                            {leader.bio}
                          </p>
                        )}

                        <div className="flex justify-center space-x-3 pt-2 border-t border-gray-100">
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
              </div>
            )}
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
