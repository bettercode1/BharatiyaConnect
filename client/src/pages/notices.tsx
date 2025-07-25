import { useState } from "react";
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
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: noticesData, isLoading } = useQuery({
    queryKey: ["/api/notices", { search, priority, category, page }],
  });

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
    createNoticeMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    if (confirm("तुम्हाला खात्री आहे की तुम्ही ही सूचना हटवू इच्छिता?")) {
      deleteNoticeMutation.mutate(id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'तातडीची';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-3 h-3" />;
      case 'high':
        return <Bell className="w-3 h-3" />;
      case 'medium':
        return <Info className="w-3 h-3" />;
      case 'low':
        return <CheckCircle className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const noticeDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - noticeDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "आत्ताच";
    if (diffInHours < 24) return `${diffInHours} तास आधी`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} दिवस आधी`;
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
      title: 'डिजिटल साक्षरता कार्यशाळा',
      content: 'ग्रामीण भागातील कार्यकर्त्यांसाठी डिजिटल साक्षरता कार्यशाळा आयोजित करा. १५ ऑगस्ट ते ३१ ऑगस्ट २०२५ या कालावधीत सर्व जिल्ह्यांमध्ये कार्यशाळा घ्या.',
      priority: 'high',
      category: 'प्रशिक्षण',
      targetAudience: 'all',
      isPinned: false,
      publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      viewCount: 89,
      attachments: []
    }
  ];

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
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const noticesDisplayData = noticesData?.notices?.length > 0 ? noticesData.notices : defaultNotices;

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
                      <FormLabel>शीर्षक *</FormLabel>
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
                      <FormLabel>सामग्री *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="सूचनेची संपूर्ण माहिती" 
                          className="min-h-[100px]"
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
                        <FormLabel>प्राधान्यता *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="प्राधान्यता निवडा" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urgent">तातडीची</SelectItem>
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
                        <FormLabel>श्रेणी *</FormLabel>
                        <FormControl>
                          <Input placeholder="उदा. राष्ट्रीय कार्यक्रम, सदस्यत्व" {...field} />
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
                      <FormLabel>लक्ष्य प्रेक्षक *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="प्रेक्षक निवडा" />
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="constituency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>मतदारसंघ</FormLabel>
                        <FormControl>
                          <Input placeholder="विशिष्ट मतदारसंघ" {...field} />
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
                        <FormLabel>जिल्हा</FormLabel>
                        <FormControl>
                          <Input placeholder="विशिष्ट जिल्हा" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>समाप्ती तारीख</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
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
                    {createNoticeMutation.isPending ? "तयार करत आहे..." : "सूचना प्रकाशित करा"}
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
                placeholder="सूचना शीर्षक किंवा सामग्री शोधा..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="प्राधान्यता" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सर्व</SelectItem>
                <SelectItem value="urgent">तातडीची</SelectItem>
                <SelectItem value="high">उच्च</SelectItem>
                <SelectItem value="medium">मध्यम</SelectItem>
                <SelectItem value="low">कमी</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="श्रेणी" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सर्व श्रेणी</SelectItem>
                <SelectItem value="राष्ट्रीय कार्यक्रम">राष्ट्रीय कार्यक्रम</SelectItem>
                <SelectItem value="सदस्यत्व">सदस्यत्व</SelectItem>
                <SelectItem value="प्रशिक्षण">प्रशिक्षण</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              फिल्टर
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notices List */}
      <div className="space-y-4">
        {noticesDisplayData?.map((notice: any, index: number) => (
          <Card key={notice.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {notice.isPinned && (
                      <Pin className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-amber-900 text-lg line-clamp-2 pr-4">
                        {notice.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getPriorityColor(notice.priority)}>
                          <span className="mr-1">{getPriorityIcon(notice.priority)}</span>
                          {getPriorityLabel(notice.priority)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {notice.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getTargetAudienceLabel(notice.targetAudience)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    {/* Only show delete for non-default notices */}
                    {noticesData?.notices?.find((n: any) => n.id === notice.id) && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(notice.id)}
                        disabled={deleteNoticeMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {notice.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{getTimeAgo(notice.publishedAt)} प्रकाशित</span>
                    </div>
                    {notice.attachments?.length > 0 && (
                      <div className="flex items-center">
                        <Paperclip className="w-3 h-3 mr-1" />
                        <span>{notice.attachments.length} संलग्नक</span>
                      </div>
                    )}
                  </div>
                  {notice.viewCount > 0 && (
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{notice.viewCount} वाचले</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोणत्याही सूचना आढळल्या नाहीत</h3>
            <p className="text-gray-500">नवीन शोध टर्म वापरून पहा किंवा नवीन सूचना तयार करा</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {noticesData?.total > 20 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            मागील
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            पान {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page * 20 >= (noticesData?.total || 0)}
          >
            पुढील
          </Button>
        </div>
      )}
    </div>
  );
}
