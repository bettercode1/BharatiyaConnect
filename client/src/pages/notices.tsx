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

export default function Notices() {
  const { t } = useLanguage();
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
        title: "यशस्वी",
        description: "सूचना यशस्वीरित्या तयार केली गेली",
      });
      // Use setTimeout to prevent DOM conflicts
      setTimeout(() => {
        setIsCreateOpen(false);
      }, 100);
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
        description: "सूचना तयार करता आली नाही",
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
        title: "यशस्वी",
        description: "सूचना हटवली गेली",
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
        description: "सूचना हटवता आली नाही",
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
        title: "त्रुटी",
        description: "फॉर्म सबमिट करताना समस्या आली",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("तुम्हाला खात्री आहे की तुम्ही ही सूचना हटवू इच्छिता?")) {
      deleteNoticeMutation.mutate(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
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

  const getTargetAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'सर्व';
      case 'leadership':
        return 'नेतृत्व';
      case 'constituency':
        return 'मतदारसंघ';
      default:
        return audience;
    }
  };

  // Default notices data if no data from API
  const defaultNotices = [
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
      attachments: [{ name: 'guidelines.pdf' }]
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
      attachments: []
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
      attachments: [{ name: 'training_schedule.pdf' }]
    }
  ];

  // Use default data if API data is not available
  const noticesDisplayData = noticesData?.notices || defaultNotices;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">सूचना व्यवस्थापन</h1>
          <p className="text-gray-600 mt-2">
            एकूण {noticesDisplayData?.length || 0} सूचना आहेत
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              नवीन सूचना जोडा
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>नवीन सूचना तयार करा</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>शीर्षक</FormLabel>
                      <FormControl>
                        <Input placeholder="सूचनेचे शीर्षक" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>सामग्री</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="सूचनेची तपशीलवार माहिती" 
                          rows={4}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>प्राधान्य</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="प्राधान्य निवडा" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urgent">तातडीचे</SelectItem>
                            <SelectItem value="high">उच्च</SelectItem>
                            <SelectItem value="medium">मध्यम</SelectItem>
                            <SelectItem value="low">कमी</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>श्रेणी</FormLabel>
                        <FormControl>
                          <Input placeholder="श्रेणी" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>लक्ष्य दर्शक</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="लक्ष्य दर्शक निवडा" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">सर्व</SelectItem>
                          <SelectItem value="leadership">नेतृत्व</SelectItem>
                          <SelectItem value="constituency">मतदारसंघ</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    रद्द करा
                  </Button>
                  <Button
                    type="submit"
                    disabled={createNoticeMutation.isPending}
                    className="bg-orange-500 hover:bg-amber-600 text-white"
                  >
                    {createNoticeMutation.isPending ? "तयार करत आहे..." : "सूचना तयार करा"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="सूचना शोधा..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="प्राधान्य" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सर्व</SelectItem>
                <SelectItem value="urgent">तातडीचे</SelectItem>
                <SelectItem value="high">उच्च</SelectItem>
                <SelectItem value="medium">मध्यम</SelectItem>
                <SelectItem value="low">कमी</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              फिल्टर
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notices Grid */}
      <div className="responsive-grid">
        {noticesDisplayData && noticesDisplayData.length > 0 ? (
          noticesDisplayData.map((notice: any, index: number) => {
            // Map notice titles to images
            const getNoticeImage = (title: string) => {
              if (title.includes('कारगिल विजय दिवस')) {
                return 'https://cms.patrika.com/wp-content/uploads/2025/07/2_395772.jpg?w=450&q=90';
              } else if (title.includes('मासिक सदस्यता')) {
                return 'https://staticimg.amarujala.com/assets/images/2024/09/03/cg-news_6ab53ff2ce8033ff9dd363b40e6002e2.jpeg?w=674&dpr=1.0&q=80';
              } else if (title.includes('डिजिटल')) {
                return 'https://superca.in/storage/app/public/blogs/pmgdisha.webp';
              }
              return '/api/placeholder/400/300';
            };

            return (
              <Card key={notice.id} className="hover:shadow-lg transition-shadow responsive-card overflow-hidden">
                <div className="relative">
                  <img 
                    src={getNoticeImage(notice.title)}
                    alt={notice.title}
                    className="responsive-image w-full h-40 sm:h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {getPriorityIcon(notice.priority)}
                      <Badge className={`responsive-badge ${getPriorityColor(notice.priority)}`}>
                        <span className="hidden sm:inline">{getPriorityLabel(notice.priority)}</span>
                      </Badge>
                    </div>
                  </div>
                  {notice.isPinned && (
                    <div className="absolute top-3 right-3">
                      <Pin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 bg-white/80 rounded-full p-1" />
                    </div>
                  )}
                </div>
                <CardContent className="responsive-p-4 sm:responsive-p-6">
                  <div className="mb-4 sm:mb-5">
                    <h3 className="responsive-text-base sm:responsive-text-lg font-semibold mb-3 line-clamp-2">{notice.title}</h3>
                    <p className="responsive-text-sm text-gray-600 mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3">{notice.content}</p>
                    
                    <div className="space-y-3 text-sm sm:text-base text-gray-500 mb-4 sm:mb-5">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{formatDate(notice.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{notice.viewCount} पहाणे</span>
                      </div>
                      {notice.attachments?.length > 0 && (
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>{notice.attachments.length} संलग्नक</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <Badge variant="outline" className="responsive-badge">
                        {getTargetAudienceLabel(notice.targetAudience)}
                      </Badge>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button size="sm" variant="ghost" className="responsive-button">
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="responsive-button">
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="responsive-button text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोणतीही सूचना आढळली नाही</h3>
            <p className="text-gray-500">नवीन शोध टर्म वापरून पहा किंवा नवीन सूचना तयार करा</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(noticesData?.total || 0) > 20 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              मागे
            </Button>
            <span className="text-sm text-gray-600">पृष्ठ {page} / {Math.ceil((noticesData?.total || 0) / 20)}</span>
            <Button variant="outline" size="sm">
              पुढे
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
