import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Search,
  Plus,
  Filter,
  Paperclip,
  Eye,
  Clock,
  Edit,
  Trash2,
  Pin,
  PinOff,
  AlertTriangle,
  Info,
  Bell,
  CheckCircle,
  X,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const noticeFormSchema = z.object({
  title: z.string().min(1, "शीर्षक आवश्यक आहे"),
  content: z.string().min(1, "सामग्री आवश्यक आहे"),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  category: z.string().min(1, "श्रेणी आवश्यक आहे"),
  targetAudience: z.enum(["all", "leadership", "constituency"]),
  constituency: z.string().optional(),
  district: z.string().optional(),
  expiryDate: z.string().optional(),
  isPinned: z.boolean().default(false),
});

type NoticeFormData = z.infer<typeof noticeFormSchema>;

// Maharashtra districts for dropdown
const maharashtraDistricts = [
  "अहमदनगर", "अकोला", "अमरावती", "औरंगाबाद", "बीड", "भंडारा", "बुलढाणा", "चंद्रपूर",
  "धुळे", "गडचिरोली", "गोंदिया", "हिंगोली", "जालना", "जळगाव", "कोल्हापूर", "लातूर",
  "मुंबई शहर", "मुंबई उपनगर", "नागपूर", "नांदेड", "नंदूरबार", "नाशिक", "उस्मानाबाद",
  "पालघर", "परभणी", "पुणे", "रायगड", "रत्नागिरी", "सांगली", "सतारा", "सिंधुदुर्ग",
  "सोलापूर", "ठाणे", "वर्धा", "वाशिम", "यवतमाळ"
];

// Mock notice data
const mockNotices = [
  {
    id: '1',
    title: 'कारगिल विजय दिवस समारंभ',
    content: '२६ जुलै २०२५ रोजी कारगिल विजय दिवसानिमित्त सर्व जिल्हांमध्ये श्रद्धांजली कार्यक्रम आयोजित करा. वीर शहीदांना आदरांजली वाहा आणि त्यांच्या त्यागाला स्मरण करा.',
    priority: 'urgent',
    category: 'राष्ट्रीय कार्यक्रम',
    targetAudience: 'all',
    isPinned: true,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    viewCount: 234,
    attachments: [{ name: 'guidelines.pdf' }],
    image: 'https://cms.patrika.com/wp-content/uploads/2025/07/2_395772.jpg?w=450&q=90'
  },
  {
    id: '2',
    title: 'मासिक सदस्यता अभियान',
    content: 'ऑगस्ट महिन्यात नवीन सदस्यत्व मिळवण्यासाठी विशेष मोहीम राबवा. प्रत्येक मतदारसंघात कमीत कमी १०० नवीन सदस्य भरती करण्याचे लक्ष्य ठेवा.',
    priority: 'medium',
    category: 'सदस्यत्व',
    targetAudience: 'leadership',
    isPinned: false,
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 156,
    attachments: [],
    image: 'https://staticimg.amarujala.com/assets/images/2024/09/03/cg-news_6ab53ff2ce8033ff9dd363b40e6002e2.jpeg?w=674&dpr=1.0&q=80'
  },
  {
    id: '3',
    title: 'डिजिटल अभियान प्रशिक्षण',
    content: 'सोशल मीडिया वापरून पक्षाचे संदेश पोहोचवण्यासाठी विशेष प्रशिक्षण कार्यक्रम. सर्व जिल्हा अध्यक्षांनी सहभाग घ्यावा.',
    priority: 'high',
    category: 'प्रशिक्षण',
    targetAudience: 'leadership',
    isPinned: true,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 89,
    attachments: [{ name: 'training_schedule.pdf' }],
    image: 'https://superca.in/storage/app/public/blogs/pmgdisha.webp'
  }
];

export default function Notices() {
  const { language, fontClass, fontDisplayClass } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Cleanup effect to prevent memory leaks and DOM conflicts
  useEffect(() => {
    return () => {
      setIsCreateOpen(false);
    };
  }, []);

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ["/api/notices", { search, priority, category, page }],
  }) as { data: { notices?: any[]; total?: number } | undefined; isLoading: boolean };

  const createNoticeMutation = useMutation({
    mutationFn: async (data: NoticeFormData) => {
      const noticeData = {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
      };
      await apiRequest("POST", "/api/notices", noticeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/recent-notices"] });
      toast({
        title: language === 'mr' ? "यशस्वी" : "Success",
        description: language === 'mr' ? "सूचना यशस्वीरित्या तयार केली गेली" : "Notice created successfully",
      });
      // Use setTimeout to prevent DOM conflicts
      setTimeout(() => {
        setIsCreateOpen(false);
      }, 100);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: language === 'mr' ? "अनधिकृत" : "Unauthorized",
          description: language === 'mr' ? "तुम्ही लॉग आउट झाला आहात. पुन्हा लॉगिन करत आहे..." : "You have been logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "सूचना तयार करता आली नाही" : "Failed to create notice",
        variant: "destructive",
      });
    },
  });

  const deleteNoticeMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/notices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      toast({
        title: language === 'mr' ? "यशस्वी" : "Success",
        description: language === 'mr' ? "सूचना हटवली गेली" : "Notice deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: language === 'mr' ? "अनधिकृत" : "Unauthorized",
          description: language === 'mr' ? "तुम्ही लॉग आउट झाला आहात. पुन्हा लॉगिन करत आहे..." : "You have been logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "सूचना हटवता आली नाही" : "Failed to delete notice",
        variant: "destructive",
      });
    },
  });

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: "",
      content: "",
      priority: "medium",
      category: "",
      targetAudience: "all",
      constituency: "",
      district: "",
      expiryDate: "",
      isPinned: false,
    },
  });

  const onSubmit = (data: NoticeFormData) => {
    try {
      createNoticeMutation.mutate(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "फॉर्म सबमिट करताना समस्या आली" : "Error submitting form",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'mr' ? "तुम्हाला खात्री आहे की तुम्ही ही सूचना हटवू इच्छिता?" : "Are you sure you want to delete this notice?")) {
      deleteNoticeMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'mr' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
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
        return <AlertTriangle className="w-4 h-4" />;
      case 'high':
        return <Bell className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return language === 'mr' ? 'तातडीचे' : 'Urgent';
      case 'high':
        return language === 'mr' ? 'उच्च' : 'High';
      case 'medium':
        return language === 'mr' ? 'मध्यम' : 'Medium';
      case 'low':
        return language === 'mr' ? 'कमी' : 'Low';
      default:
        return priority;
    }
  };

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all':
        return language === 'mr' ? 'सर्व' : 'All';
      case 'leadership':
        return language === 'mr' ? 'नेतृत्व' : 'Leadership';
      case 'constituency':
        return language === 'mr' ? 'मतदारसंघ' : 'Constituency';
      default:
        return audience;
    }
  };

  // Filter notices based on search and filters
  const filteredNotices = mockNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(search.toLowerCase()) ||
                         notice.content.toLowerCase().includes(search.toLowerCase()) ||
                         notice.category.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priority === 'all' || notice.priority === priority;
    const matchesCategory = category === 'all' || notice.category === category;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card className="bg-white shadow-lg rounded-xl border border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white shadow-lg rounded-xl border border-orange-200">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
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
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-4 ${fontDisplayClass}`}>
            {language === 'mr' ? 'सूचना व्यवस्थापन' : 'Notice Management'}
          </h1>
          <p className={`text-lg text-amber-700 ${fontClass}`}>
            {language === 'mr' ? 'एकूण' : 'Total'} {filteredNotices.length} {language === 'mr' ? 'सूचना आहेत' : 'notices'}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white shadow-lg rounded-xl border border-orange-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                <Input
                  placeholder={language === 'mr' ? 'सूचना शोधा...' : 'Search notices...'}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 py-3 rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="w-40 rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder={language === 'mr' ? 'प्राधान्य' : 'Priority'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'mr' ? 'सर्व' : 'All'}</SelectItem>
                  <SelectItem value="urgent">{language === 'mr' ? 'तातडीचे' : 'Urgent'}</SelectItem>
                  <SelectItem value="high">{language === 'mr' ? 'उच्च' : 'High'}</SelectItem>
                  <SelectItem value="medium">{language === 'mr' ? 'मध्यम' : 'Medium'}</SelectItem>
                  <SelectItem value="low">{language === 'mr' ? 'कमी' : 'Low'}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50">
                <Filter className="w-4 h-4 mr-2" />
                {language === 'mr' ? 'फिल्टर' : 'Filter'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add New Notice Button */}
        <div className="flex justify-end">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-5 h-5 mr-2" />
                {language === 'mr' ? 'नवीन सूचना' : 'New Notice'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-orange-200">
              <DialogHeader className="pb-6">
                <DialogTitle className={`text-2xl font-bold text-amber-900 ${fontDisplayClass}`}>
                  {language === 'mr' ? 'नवीन सूचना तयार करा' : 'Create New Notice'}
                </DialogTitle>
                <p className={`text-gray-600 ${fontClass}`}>
                  {language === 'mr' ? 'सूचनेची सर्व माहिती भरा आणि तयार करा' : 'Fill all notice details and create'}
                </p>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Notice Information Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                    <h3 className={`text-lg font-bold text-amber-900 mb-4 flex items-center ${fontDisplayClass}`}>
                      <Bell className="w-5 h-5 mr-2" />
                      {language === 'mr' ? 'सूचना माहिती' : 'Notice Information'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'सूचनेचे शीर्षक *' : 'Notice Title *'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={language === 'mr' ? 'सूचनेचे शीर्षक टाका' : 'Enter notice title'} 
                                {...field} 
                                className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'प्राधान्य *' : 'Priority *'}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                                  <SelectValue placeholder={language === 'mr' ? 'प्राधान्य निवडा' : 'Select priority'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="urgent">{language === 'mr' ? 'तातडीचे' : 'Urgent'}</SelectItem>
                                <SelectItem value="high">{language === 'mr' ? 'उच्च' : 'High'}</SelectItem>
                                <SelectItem value="medium">{language === 'mr' ? 'मध्यम' : 'Medium'}</SelectItem>
                                <SelectItem value="low">{language === 'mr' ? 'कमी' : 'Low'}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'सामग्री *' : 'Content *'}
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder={language === 'mr' ? 'सूचनेची तपशीलवार माहिती' : 'Notice details'} 
                              {...field} 
                              className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Category and Audience Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className={`text-lg font-bold text-blue-900 mb-4 flex items-center ${fontDisplayClass}`}>
                      <Info className="w-5 h-5 mr-2" />
                      {language === 'mr' ? 'श्रेणी आणि दर्शक' : 'Category & Audience'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'श्रेणी *' : 'Category *'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={language === 'mr' ? 'श्रेणी टाका' : 'Enter category'} 
                                {...field} 
                                className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'लक्ष्य दर्शक *' : 'Target Audience *'}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                                  <SelectValue placeholder={language === 'mr' ? 'दर्शक निवडा' : 'Select audience'} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="all">{language === 'mr' ? 'सर्व' : 'All'}</SelectItem>
                                <SelectItem value="leadership">{language === 'mr' ? 'नेतृत्व' : 'Leadership'}</SelectItem>
                                <SelectItem value="constituency">{language === 'mr' ? 'मतदारसंघ' : 'Constituency'}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Location and Settings Section */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className={`text-lg font-bold text-green-900 mb-4 flex items-center ${fontDisplayClass}`}>
                      <Pin className="w-5 h-5 mr-2" />
                      {language === 'mr' ? 'स्थान आणि सेटिंग्ज' : 'Location & Settings'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-green-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'जिल्हा' : 'District'}
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500">
                                  <SelectValue placeholder={language === 'mr' ? 'जिल्हा निवडा' : 'Select district'} />
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
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={`text-green-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'समाप्ती तारीख' : 'Expiry Date'}
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="constituency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={`text-green-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'मतदारसंघ' : 'Constituency'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'mr' ? 'मतदारसंघाचे नाव' : 'Constituency name'} 
                              {...field} 
                              className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50"
                    >
                      {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                    </Button>
                    <Button
                      type="submit"
                      disabled={createNoticeMutation.isPending}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {createNoticeMutation.isPending 
                        ? (language === 'mr' ? "तयार करत आहे..." : "Creating...") 
                        : (language === 'mr' ? "सूचना तयार करा" : "Create Notice")}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map((notice) => (
            <Card key={notice.id} className="bg-white shadow-lg rounded-xl border border-orange-200 overflow-hidden hover:shadow-xl transition-all duration-200">
              <div className="relative">
                <img 
                  src={notice.image}
                  alt={notice.title}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(notice.priority)}
                    <Badge className={`${getPriorityColor(notice.priority)} rounded-md text-xs`}>
                      {getPriorityLabel(notice.priority)}
                    </Badge>
                  </div>
                </div>
                {notice.isPinned && (
                  <div className="absolute top-2 right-2">
                    <Pin className="w-4 h-4 text-orange-500 bg-white/80 rounded-full p-0.5" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className={`font-semibold text-amber-900 line-clamp-2 flex-1 pr-2 text-sm ${fontDisplayClass}`}>
                      {notice.title}
                    </h3>
                  </div>

                  <p className={`text-gray-600 line-clamp-2 text-xs ${fontClass}`}>
                    {notice.content}
                  </p>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-2 text-orange-500" />
                      <span className={fontClass}>{formatDate(notice.publishedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-2 text-orange-500" />
                      <span className={fontClass}>{notice.viewCount} {language === 'mr' ? 'पहाणे' : 'views'}</span>
                    </div>
                    {notice.attachments?.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="w-3 h-3 mr-2 text-orange-500" />
                        <span className={fontClass}>{notice.attachments.length} {language === 'mr' ? 'संलग्नक' : 'attachments'}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="rounded-md text-xs">
                        {getTargetAudienceLabel(notice.targetAudience)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-md">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md"
                        onClick={() => handleDelete(notice.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredNotices.length === 0 && (
            <div className="col-span-full text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
                <Bell className="w-16 h-16 text-orange-500" />
              </div>
              <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${fontDisplayClass}`}>
                {language === 'mr' ? 'कोणतीही सूचना आढळली नाही' : 'No notices found'}
              </h3>
              <p className={`text-gray-500 text-lg ${fontClass}`}>
                {language === 'mr' ? 'फिल्टर साफ करा किंवा नवीन शोध टर्म वापरा' : 'Clear filters or try a new search term'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {(filteredNotices.length > 20) && (
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50"
            >
              {language === 'mr' ? 'मागील' : 'Previous'}
            </Button>
            <span className={`flex items-center px-4 text-sm text-gray-600 ${fontClass}`}>
              {language === 'mr' ? 'पान' : 'Page'} {page}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page * 20 >= filteredNotices.length}
              className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50"
            >
              {language === 'mr' ? 'पुढील' : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
