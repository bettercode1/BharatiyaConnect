import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Plus, Filter, MapPin, Phone, Calendar, Upload, User, Mail, Briefcase, Home, X, ChevronDown, Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const memberFormSchema = z.object({
  fullName: z.string().min(2, "नाव किमान 2 अक्षरांचे असावे"),
  dateOfBirth: z.string().min(1, "जन्मदिनांक आवश्यक आहे"),
  phone: z.string().min(10, "फोन नंबर किमान 10 अंकांचा असावे"),
  email: z.string().email("वैध ईमेल पत्ता टाका").optional().or(z.literal("")),
  profilePhoto: z.string().optional(),
  state: z.string().min(1, "राज्य निवडा"),
  district: z.string().min(1, "जिल्हा निवडा"),
  city: z.string().min(1, "शहर/गाव भरा"),
  pinCode: z.string().min(6, "पिन कोड 6 अंकांचा असावे").max(6, "पिन कोड 6 अंकांचा असावे"),
  profession: z.string().min(1, "व्यवसाय भरा"),
  address: z.string().optional(),
  constituency: z.string().optional(),
  membershipDate: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

// Filter types
interface FilterState {
  ageGroup: string;
  city: string;
  joiningDateRange: string;
}

// Maharashtra districts for dropdown
const maharashtraDistricts = [
  "अहमदनगर", "अकोला", "अमरावती", "औरंगाबाद", "बीड", "भंडारा", "बुलढाणा", "चंद्रपूर",
  "धुळे", "गडचिरोली", "गोंदिया", "हिंगोली", "जालना", "जळगाव", "कोल्हापूर", "लातूर",
  "मुंबई शहर", "मुंबई उपनगर", "नागपूर", "नांदेड", "नंदूरबार", "नाशिक", "उस्मानाबाद",
  "पालघर", "परभणी", "पुणे", "रायगड", "रत्नागिरी", "सांगली", "सतारा", "सिंधुदुर्ग",
  "सोलापूर", "ठाणे", "वर्धा", "वाशिम", "यवतमाळ"
];

const professionOptions = [
  "शेती", "व्यापार", "नोकरी", "वकील", "डॉक्टर", "शिक्षक", "अभियंता", "सरकारी सेवा",
  "खाजगी नोकरी", "स्वयंरोजगार", "सेवानिवृत्त", "गृहिणी", "विद्यार्थी", "इतर"
];

// Mock member data with diverse information
const mockMembers = [
  {
    id: '1',
    fullName: 'राहुल शर्मा',
    dateOfBirth: '1985-03-15',
    phone: '9876543210',
    email: 'rahul.sharma@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    state: 'महाराष्ट्र',
    district: 'पुणे',
    city: 'पुणे',
    pinCode: '411001',
    profession: 'अभियंता',
    constituency: 'पुणे कंटोन्मेंट',
    membershipDate: '2020-01-15',
    isVerified: true,
    isActive: true,
    age: 39
  },
  {
    id: '2',
    fullName: 'प्रिया पाटील',
    dateOfBirth: '1992-07-22',
    phone: '9876543211',
    email: 'priya.patil@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b589?w=150',
    state: 'महाराष्ट्र',
    district: 'मुंबई शहर',
    city: 'मुंबई',
    pinCode: '400001',
    profession: 'डॉक्टर',
    constituency: 'मुंबई दक्षिण',
    membershipDate: '2022-03-10',
    isVerified: true,
    isActive: true,
    age: 32
  },
  {
    id: '3',
    fullName: 'अमित देशमुख',
    dateOfBirth: '1978-11-08',
    phone: '9876543212',
    email: 'amit.deshmukh@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    state: 'महाराष्ट्र',
    district: 'नागपूर',
    city: 'नागपूर',
    pinCode: '440001',
    profession: 'वकील',
    constituency: 'नागपूर दक्षिण',
    membershipDate: '2018-05-20',
    isVerified: true,
    isActive: true,
    age: 46
  },
  {
    id: '4',
    fullName: 'सुनिता कुलकर्णी',
    dateOfBirth: '1965-09-12',
    phone: '9876543213',
    email: 'sunita.kulkarni@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    state: 'महाराष्ट्र',
    district: 'नाशिक',
    city: 'नाशिक',
    pinCode: '422001',
    profession: 'शिक्षक',
    constituency: 'नाशिक पूर्व',
    membershipDate: '2015-08-12',
    isVerified: true,
    isActive: true,
    age: 59
  },
  {
    id: '5',
    fullName: 'विकास जाधव',
    dateOfBirth: '1995-01-30',
    phone: '9876543214',
    email: 'vikas.jadhav@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    state: 'महाराष्ट्र',
    district: 'कोल्हापूर',
    city: 'कोल्हापूर',
    pinCode: '416001',
    profession: 'शेती',
    constituency: 'कोल्हापूर दक्षिण',
    membershipDate: '2023-01-25',
    isVerified: false,
    isActive: true,
    age: 29
  },
  {
    id: '6',
    fullName: 'मीरा राठोड',
    dateOfBirth: '1988-06-18',
    phone: '9876543215',
    email: 'meera.rathod@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    state: 'महाराष्ट्र',
    district: 'औरंगाबाद',
    city: 'औरंगाबाद',
    pinCode: '431001',
    profession: 'व्यापार',
    constituency: 'औरंगाबाद मध्य',
    membershipDate: '2021-11-08',
    isVerified: true,
    isActive: true,
    age: 36
  },
  {
    id: '7',
    fullName: 'संजय गायकवाड',
    dateOfBirth: '1970-04-25',
    phone: '9876543216',
    email: 'sanjay.gaikwad@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    state: 'महाराष्ट्र',
    district: 'सोलापूर',
    city: 'सोलापूर',
    pinCode: '413001',
    profession: 'सरकारी सेवा',
    constituency: 'सोलापूर शहर',
    membershipDate: '2016-02-14',
    isVerified: true,
    isActive: true,
    age: 54
  },
  {
    id: '8',
    fullName: 'अनिता भोसले',
    dateOfBirth: '1983-12-03',
    phone: '9876543217',
    email: 'anita.bhosle@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150',
    state: 'महाराष्ट्र',
    district: 'ठाणे',
    city: 'ठाणे',
    pinCode: '400601',
    profession: 'खाजगी नोकरी',
    constituency: 'कल्याण पूर्व',
    membershipDate: '2019-09-30',
    isVerified: true,
    isActive: true,
    age: 41
  },
  {
    id: '9',
    fullName: 'रवी वर्मा',
    dateOfBirth: '1998-08-14',
    phone: '9876543218',
    email: 'ravi.varma@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150',
    state: 'महाराष्ट्र',
    district: 'सांगली',
    city: 'सांगली',
    pinCode: '416416',
    profession: 'विद्यार्थी',
    constituency: 'सांगली',
    membershipDate: '2024-01-10',
    isVerified: false,
    isActive: true,
    age: 26
  },
  {
    id: '10',
    fullName: 'माधुरी नाईक',
    dateOfBirth: '1975-10-20',
    phone: '9876543219',
    email: 'madhuri.naik@email.com',
    profilePhoto: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=150',
    state: 'महाराष्ट्र',
    district: 'रत्नागिरी',
    city: 'रत्नागिरी',
    pinCode: '415612',
    profession: 'गृहिणी',
    constituency: 'रत्नागिरी-सिंधुदुर्ग',
    membershipDate: '2017-07-22',
    isVerified: true,
    isActive: true,
    age: 49
  }
];

// Age groups for filtering
const ageGroups = [
  { label: 'युवा (18-30)', value: '18-30' },
  { label: 'प्रौढ (31-45)', value: '31-45' },
  { label: 'मध्यम वयीन (46-60)', value: '46-60' },
  { label: 'वरिष्ठ (60+)', value: '60+' },
];

// Joining date ranges
const joiningDateRanges = [
  { label: 'गेल्या वर्षी (2023-2024)', value: '2023-2024' },
  { label: '2020-2022', value: '2020-2022' },
  { label: '2017-2019', value: '2017-2019' },
  { label: '2015 पूर्वी', value: 'before-2015' },
];

export default function Members() {
  const { t, language, fontClass, fontDisplayClass } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ageGroup: '',
    city: '',
    joiningDateRange: '',
  });

  // Scroll to top when component mounts
  const topRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Use a safer approach with requestAnimationFrame
    const scrollToTop = () => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'instant' });
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(scrollToTop);
  }, []);

  // Memoize unique cities to prevent unnecessary recalculations
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(mockMembers.map(member => member.city)));
  }, []);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["/api/members", { search, page }],
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      const memberData = {
        ...data,
        membershipDate: data.membershipDate || new Date().toISOString(),
        isVerified: false,
        isActive: true,
      };
      await apiRequest("POST", "/api/members", memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      toast({
        title: "यशस्वी",
        description: "नवीन सदस्य यशस्वीरित्या जोडला गेला",
      });
      setIsCreateOpen(false);
      form.reset();
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
        description: "सदस्य जोडता आला नाही",
        variant: "destructive",
      });
    },
  });

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      profilePhoto: "",
      state: "महाराष्ट्र",
      district: "",
      city: "",
      pinCode: "",
      profession: "",
      address: "",
      constituency: "",
      membershipDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: MemberFormData) => {
    createMemberMutation.mutate(data);
  };

  // Memoized filter functions for better performance
  const filteredMembers = useMemo(() => {
    let filtered = [...mockMembers]; // Create a copy to avoid mutation

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter(member =>
        member.fullName.toLowerCase().includes(searchLower) ||
        member.city.toLowerCase().includes(searchLower) ||
        member.constituency?.toLowerCase().includes(searchLower) ||
        member.profession.toLowerCase().includes(searchLower)
      );
    }

    // Age group filter
    if (filters.ageGroup) {
      if (filters.ageGroup === '60+') {
        filtered = filtered.filter(member => member.age >= 60);
      } else {
        const [minAge, maxAge] = filters.ageGroup.split('-').map(Number);
        filtered = filtered.filter(member => member.age >= minAge && member.age <= maxAge);
      }
    }

    // City filter
    if (filters.city) {
      filtered = filtered.filter(member => member.city === filters.city);
    }

    // Joining date range filter
    if (filters.joiningDateRange) {
      filtered = filtered.filter(member => {
        const joinYear = new Date(member.membershipDate).getFullYear();
        switch (filters.joiningDateRange) {
          case '2023-2024':
            return joinYear >= 2023;
          case '2020-2022':
            return joinYear >= 2020 && joinYear <= 2022;
          case '2017-2019':
            return joinYear >= 2017 && joinYear <= 2019;
          case 'before-2015':
            return joinYear < 2015;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [search, filters]);

  // Stable callback functions to prevent unnecessary re-renders
  const clearFilters = useCallback(() => {
    setFilters({
      ageGroup: '',
      city: '',
      joiningDateRange: '',
    });
  }, []);

  const getActiveFilterCount = useCallback(() => {
    return Object.values(filters).filter(value => value !== '').length;
  }, [filters]);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN');
  }, []);

  const handleFilterChange = useCallback((filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  }, []);

  const removeFilter = useCallback((filterType: keyof FilterState) => {
    setFilters(prev => ({ ...prev, [filterType]: '' }));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={`skeleton-${i}`} className="bg-white shadow-lg rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top ref for scroll to top */}
        <div ref={topRef} />
        
        {/* Header */}
        <div className="text-center">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-2 ${fontDisplayClass}`}>
            {language === 'mr' ? 'सदस्य व्यवस्थापन' : 'Member Management'}
          </h1>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-lg rounded-xl border border-orange-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={language === 'mr' ? "सदस्याचे नाव, शहर, मतदारसंघ किंवा व्यवसाय शोधा..." : "Search member name, city, constituency or profession..."}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-2 rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="relative px-3 py-2 rounded-xl border-2 border-orange-200 hover:border-orange-300">
                    <Filter className="w-5 h-5 mr-2" />
                    {language === 'mr' ? 'फिल्टर' : 'Filter'}
                    {getActiveFilterCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-orange-500 text-white text-xs font-bold">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white rounded-xl border-2 border-orange-200 shadow-xl" align="end">
                  <div className="space-y-6 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-lg font-semibold text-orange-800 ${fontDisplayClass}`}>
                        {language === 'mr' ? 'फिल्टर' : 'Filters'}
                      </h4>
                      {getActiveFilterCount() > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-auto p-2 text-sm text-orange-600 hover:text-orange-700 rounded-lg"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {language === 'mr' ? 'साफ करा' : 'Clear'}
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {/* Age Group Filter */}
                      <div>
                        <label className={`text-sm font-semibold mb-3 block text-gray-700 ${fontClass}`}>
                          {language === 'mr' ? 'वयोगट' : 'Age Group'}
                        </label>
                        <Select
                          value={filters.ageGroup}
                          onValueChange={(value) => handleFilterChange('ageGroup', value)}
                        >
                          <SelectTrigger className="w-full rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder={language === 'mr' ? 'वयोगट निवडा' : 'Select age group'} />
                          </SelectTrigger>
                          <SelectContent>
                            {ageGroups.map((group) => (
                              <SelectItem key={group.value} value={group.value}>
                                {group.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* City Filter */}
                      <div>
                        <label className={`text-sm font-semibold mb-3 block text-gray-700 ${fontClass}`}>
                          {language === 'mr' ? 'शहर' : 'City'}
                        </label>
                        <Select
                          value={filters.city}
                          onValueChange={(value) => handleFilterChange('city', value)}
                        >
                          <SelectTrigger className="w-full rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder={language === 'mr' ? 'शहर निवडा' : 'Select city'} />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Joining Date Range Filter */}
                      <div>
                        <label className={`text-sm font-semibold mb-3 block text-gray-700 ${fontClass}`}>
                          {language === 'mr' ? 'सामील होण्याची तारीख' : 'Joining Date Range'}
                        </label>
                        <Select
                          value={filters.joiningDateRange}
                          onValueChange={(value) => handleFilterChange('joiningDateRange', value)}
                        >
                          <SelectTrigger className="w-full rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                            <SelectValue placeholder={language === 'mr' ? 'तारीख निवडा' : 'Select date range'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === 'mr' ? 'सर्व' : 'All'}</SelectItem>
                            <SelectItem value="last30days">{language === 'mr' ? 'गेल्या 30 दिवसांत' : 'Last 30 days'}</SelectItem>
                            <SelectItem value="last3months">{language === 'mr' ? 'गेल्या 3 महिन्यांत' : 'Last 3 months'}</SelectItem>
                            <SelectItem value="last6months">{language === 'mr' ? 'गेल्या 6 महिन्यांत' : 'Last 6 months'}</SelectItem>
                            <SelectItem value="last1year">{language === 'mr' ? 'गेल्या 1 वर्षात' : 'Last 1 year'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    {language === 'mr' ? 'नवीन सदस्य जोडा' : 'Add new member'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-2 border-orange-200 shadow-2xl">
                  <DialogHeader className="pb-6">
                    <DialogTitle className={`text-3xl font-bold text-orange-600 ${fontDisplayClass}`}>
                      {language === 'mr' ? 'नवीन सदस्य नोंदणी' : 'New Member Registration'}
                    </DialogTitle>
                    <p className={`text-gray-600 ${fontClass}`}>
                      {language === 'mr' ? 'सर्व आवश्यक फील्ड भरा' : 'Please fill all required fields'}
                    </p>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      {/* Personal Information Section */}
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                        <h3 className={`text-xl font-semibold text-orange-800 mb-6 flex items-center ${fontDisplayClass}`}>
                          <User className="w-6 h-6 mr-3" />
                          {language === 'mr' ? 'व्यक्तिगत माहिती' : 'Personal Information'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'mr' ? "पूर्ण नाव लिहा" : "Enter full name"} 
                                    className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'जन्मदिनांक *' : 'Date of Birth *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'फोन नंबर *' : 'Phone Number *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="9876543210" 
                                    className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'ईमेल (ऐच्छिक)' : 'Email (Optional)'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="example@email.com" 
                                    className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'व्यवसाय *' : 'Profession *'}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                                      <SelectValue placeholder={language === 'mr' ? "व्यवसाय निवडा" : "Select profession"} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {professionOptions.map((profession) => (
                                      <SelectItem key={profession} value={profession}>
                                        {profession}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="profilePhoto"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'फोटो URL (ऐच्छिक)' : 'Photo URL (Optional)'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="https://example.com/photo.jpg" 
                                    className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Location Information Section */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                        <h3 className={`text-xl font-semibold text-blue-800 mb-6 flex items-center ${fontDisplayClass}`}>
                          <Home className="w-6 h-6 mr-3" />
                          {language === 'mr' ? 'पत्ता माहिती' : 'Address Information'}
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'राज्य *' : 'State *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    disabled 
                                    className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'जिल्हा *' : 'District *'}
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                      <SelectValue placeholder={language === 'mr' ? "जिल्हा निवडा" : "Select district"} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {maharashtraDistricts.map((district) => (
                                      <SelectItem key={district} value={district}>
                                        {district}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'शहर/गाव *' : 'City/Village *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'mr' ? "शहर किंवा गावाचे नाव" : "Enter city or village name"} 
                                    className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'पिन कोड *' : 'Pin Code *'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="123456" 
                                    maxLength={6} 
                                    className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="constituency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'मतदारसंघ (ऐच्छिक)' : 'Constituency (Optional)'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder={language === 'mr' ? "मतदारसंघाचे नाव" : "Enter constituency name"} 
                                    className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="membershipDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                  {language === 'mr' ? 'सदस्यत्व दिनांक' : 'Membership Date'}
                                </FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="mt-6">
                              <FormLabel className={`text-sm font-semibold ${fontClass}`}>
                                {language === 'mr' ? 'संपूर्ण पत्ता (ऐच्छिक)' : 'Full Address (Optional)'}
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder={language === 'mr' ? "संपूर्ण पत्ता लिहा..." : "Enter complete address..."}
                                  className="min-h-[100px] rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Buttons */}
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateOpen(false)}
                          className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400"
                        >
                          {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                        </Button>
                        <Button
                          type="submit"
                          disabled={createMemberMutation.isPending}
                          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {createMemberMutation.isPending 
                            ? (language === 'mr' ? 'सेव्ह करत आहे...' : 'Saving...')
                            : (language === 'mr' ? 'सदस्य जोडा' : 'Add Member')
                          }
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>



        {/* Members Table */}
        <Card className="bg-white shadow-lg rounded-xl border border-orange-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100 hover:bg-orange-100">
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'सदस्य' : 'Member'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'संपर्क' : 'Contact'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'स्थान' : 'Location'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'व्यवसाय' : 'Profession'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'वय' : 'Age'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'सदस्यत्व' : 'Membership'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4">
                      {language === 'mr' ? 'स्थिती' : 'Status'}
                    </TableHead>
                    <TableHead className="text-orange-800 font-bold px-6 py-4 text-center">
                      {language === 'mr' ? 'कृती' : 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={`member-${member.id}`} className="hover:bg-orange-50 transition-colors duration-200 border-b border-orange-100">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-orange-200 shadow-md">
                            <AvatarImage src={member.profilePhoto} alt={member.fullName} />
                            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 font-bold text-sm">
                              {member.fullName.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className={`font-semibold text-gray-900 ${fontDisplayClass}`}>
                              {member.fullName}
                            </div>
                            {member.email && (
                              <div className="text-xs text-gray-500 font-english">
                                {member.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-orange-500" />
                          <span className={`text-sm ${fontClass}`}>{member.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <div>
                            <div className={`text-sm font-medium ${fontClass}`}>{member.city}</div>
                            <div className="text-xs text-gray-500 font-english">{member.district}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className={`text-sm ${fontClass}`}>
                          {member.profession}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className={`text-sm ${fontClass}`}>
                          {member.age} {language === 'mr' ? 'वर्षे' : 'years'}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className={`text-sm ${fontClass}`}>
                          {formatDate(member.membershipDate)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {member.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-lg border border-green-200">
                              {language === 'mr' ? 'सत्यापित' : 'Verified'}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600 px-2 py-1 rounded-lg">
                              {language === 'mr' ? 'प्रलंबित' : 'Pending'}
                            </Badge>
                          )}
                          {member.constituency && (
                            <Badge variant="outline" className="text-xs px-2 py-1 rounded-lg border-orange-200 text-orange-700">
                              {member.constituency}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-16 h-16 text-orange-500" />
                </div>
                <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'कोणतेही सदस्य आढळले नाहीत' : 'No members found.'}
                </h3>
                <p className={`text-gray-500 text-lg ${fontClass}`}>
                  {language === 'mr' ? 'फिल्टर साफ करा किंवा नवीन शोध टर्म वापरा' : 'Clear filters or try a new search term'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination for large datasets */}
        {filteredMembers.length > 12 && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-6 py-3 rounded-xl border-2 border-orange-200 hover:border-orange-300"
            >
              {language === 'mr' ? 'मागील' : 'Previous'}
            </Button>
            <span className={`flex items-center px-6 text-lg text-gray-600 ${fontClass}`}>
              {language === 'mr' ? `पान ${page}` : `Page ${page}`}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page * 12 >= filteredMembers.length}
              className="px-6 py-3 rounded-xl border-2 border-orange-200 hover:border-orange-300"
            >
              {language === 'mr' ? 'पुढील' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
