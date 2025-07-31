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
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Globe,
  Edit,
  Trash2,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const eventFormSchema = z.object({
  title: z.string().min(1, "शीर्षक आवश्यक आहे"),
  description: z.string().optional(),
  eventType: z.enum(["offline", "online", "hybrid"]),
  venue: z.string().optional(),
  eventDate: z.string().min(1, "कार्यक्रमाची तारीख आवश्यक आहे"),
  endDate: z.string().optional(),
  maxAttendees: z.string().optional(),
  meetingLink: z.string().optional(),
  constituency: z.string().optional(),
  district: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

// Maharashtra districts for dropdown
const maharashtraDistricts = [
  "अहमदनगर", "अकोला", "अमरावती", "औरंगाबाद", "बीड", "भंडारा", "बुलढाणा", "चंद्रपूर",
  "धुळे", "गडचिरोली", "गोंदिया", "हिंगोली", "जालना", "जळगाव", "कोल्हापूर", "लातूर",
  "मुंबई शहर", "मुंबई उपनगर", "नागपूर", "नांदेड", "नंदूरबार", "नाशिक", "उस्मानाबाद",
  "पालघर", "परभणी", "पुणे", "रायगड", "रत्नागिरी", "सांगली", "सतारा", "सिंधुदुर्ग",
  "सोलापूर", "ठाणे", "वर्धा", "वाशिम", "यवतमाळ"
];

// Mock event data
const mockEvents = [
  {
    id: '1',
    title: 'कारगिल विजय दिवस समारंभ',
    description: '२६ जुलै २०२५ रोजी कारगिल विजय दिवसानिमित्त सर्व जिल्हांमध्ये श्रद्धांजली कार्यक्रम आयोजित करा. वीर शहीदांना आदरांजली वाहा आणि त्यांच्या त्यागाला स्मरण करा.',
    eventType: 'offline',
    venue: 'सर्व जिल्हे',
    eventDate: '2025-07-26T10:00:00Z',
    endDate: '2025-07-26T12:00:00Z',
    maxAttendees: 1000,
    status: 'published',
    image: 'https://cms.patrika.com/wp-content/uploads/2025/07/2_395772.jpg?w=450&q=90',
    badge: { text: 'राष्ट्रीय कार्यक्रम', color: 'bg-red-100 text-red-800 border-red-200', icon: '🇮🇳' }
  },
  {
    id: '2',
    title: 'मासिक सदस्यता अभियान',
    description: 'ऑगस्ट महिन्यात नवीन सदस्यत्व मिळवण्यासाठी विशेष मोहीम राबवा. प्रत्येक मतदारसंघात कमीत कमी १०० नवीन सदस्य भरती करण्याचे लक्ष्य ठेवा.',
    eventType: 'offline',
    venue: 'सर्व मतदारसंघ',
    eventDate: '2025-08-01T09:00:00Z',
    endDate: '2025-08-31T18:00:00Z',
    maxAttendees: 5000,
    status: 'published',
    image: 'https://staticimg.amarujala.com/assets/images/2024/09/03/cg-news_6ab53ff2ce8033ff9dd363b40e6002e2.jpeg?w=674&dpr=1.0&q=80',
    badge: { text: 'सदस्यत्व', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '👥' }
  },
  {
    id: '3',
    title: 'डिजिटल साक्षरता कार्यशाळा',
    description: 'ग्रामीण भागातील कार्यकर्त्यांसाठी डिजिटल साक्षरता कार्यशाळा आयोजित करा. १५ ऑगस्ट ते ३१ ऑगस्ट २०२५ या कालावधीत सर्व जिल्ह्यांमध्ये कार्यशाळा घ्या.',
    eventType: 'hybrid',
    venue: 'ग्रामीण केंद्रे',
    eventDate: '2025-08-15T09:00:00Z',
    endDate: '2025-08-31T17:00:00Z',
    maxAttendees: 200,
    status: 'published',
    image: 'https://superca.in/storage/app/public/blogs/pmgdisha.webp',
    badge: { text: 'प्रशिक्षण', color: 'bg-green-100 text-green-800 border-green-200', icon: '📚' }
  }
];

export default function Events() {
  const { language, fontClass, fontDisplayClass } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Cleanup effect to prevent memory leaks and DOM conflicts
  useEffect(() => {
    return () => {
      setIsCreateOpen(false);
    };
  }, []);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["/api/events", { search, status, page }],
  }) as { data: { total?: number; events?: any[] } | undefined; isLoading: boolean };

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const eventData = {
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : undefined,
        status: "published",
      };
      await apiRequest("POST", "/api/events", eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/upcoming-events"] });
      
      toast({
        title: language === 'mr' ? "यशस्वी" : "Success",
        description: language === 'mr' ? "कार्यक्रम यशस्वीरित्या तयार केला गेला" : "Event created successfully",
      });
      
      // Reset form and close dialog with delay to prevent DOM conflicts
      form.reset();
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
        description: language === 'mr' ? "कार्यक्रम तयार करता आला नाही" : "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "offline",
      venue: "",
      eventDate: "",
      endDate: "",
      maxAttendees: "",
      meetingLink: "",
      constituency: "",
      district: "",
    },
  });

  const onSubmit = (data: EventFormData) => {
    try {
    createEventMutation.mutate(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: language === 'mr' ? "त्रुटी" : "Error",
        description: language === 'mr' ? "फॉर्म सबमिट करताना समस्या आली" : "Error submitting form",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'mr' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(language === 'mr' ? 'hi-IN' : 'en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    }).replace('am', 'AM').replace('pm', 'PM');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'online':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'offline':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'online':
        return language === 'mr' ? 'ऑनलाइन' : 'Online';
      case 'offline':
        return language === 'mr' ? 'ऑफलाइन' : 'Offline';
      case 'hybrid':
        return language === 'mr' ? 'हायब्रिड' : 'Hybrid';
      default:
        return type;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'online':
        return <Video className="w-4 h-4" />;
      case 'offline':
        return <MapPin className="w-4 h-4" />;
      case 'hybrid':
        return <Globe className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return language === 'mr' ? 'प्रकाशित' : 'Published';
      case 'draft':
        return language === 'mr' ? 'मसुदा' : 'Draft';
      case 'cancelled':
        return language === 'mr' ? 'रद्द' : 'Cancelled';
      case 'completed':
        return language === 'mr' ? 'पूर्ण' : 'Completed';
      default:
        return status;
    }
  };

  // Filter events based on search and status
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                         event.description.toLowerCase().includes(search.toLowerCase()) ||
                         event.venue.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || event.status === status;
    return matchesSearch && matchesStatus;
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
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white shadow-lg rounded-xl border border-orange-200">
                <CardContent className="p-4">
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
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-900 mb-4 ${fontDisplayClass}`}>
              {language === 'mr' ? 'कार्यक्रम व्यवस्थापन' : 'Event Management'}
            </h1>
            <p className={`text-lg text-amber-700 ${fontClass}`}>
              
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white shadow-lg rounded-xl border border-orange-200">
            <CardContent className="p-6">
              {/* Add New Event Button - Above Search Bar */}
              <div className="flex justify-end mb-4">
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                      <Plus className="w-5 h-5 mr-2" />
                      {language === 'mr' ? 'नवीन कार्यक्रम' : 'New Event'}
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500 w-5 h-5" />
                  <Input
                    placeholder={language === 'mr' ? 'कार्यक्रम, स्थळ किंवा आयोजक शोधा...' : 'Search events, venue or organizer...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 py-3 rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40 rounded-xl border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder={language === 'mr' ? 'स्थिती' : 'Status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === 'mr' ? 'सर्व' : 'All'}</SelectItem>
                    <SelectItem value="published">{language === 'mr' ? 'प्रकाशित' : 'Published'}</SelectItem>
                    <SelectItem value="draft">{language === 'mr' ? 'मसुदा' : 'Draft'}</SelectItem>
                    <SelectItem value="cancelled">{language === 'mr' ? 'रद्द' : 'Cancelled'}</SelectItem>
                    <SelectItem value="completed">{language === 'mr' ? 'पूर्ण' : 'Completed'}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50">
                  <Filter className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'फिल्टर' : 'Filter'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-orange-200">
            <DialogHeader className="pb-6">
              <DialogTitle className={`text-2xl font-bold text-amber-900 ${fontDisplayClass}`}>
                {language === 'mr' ? 'नवीन कार्यक्रम तयार करा' : 'Create New Event'}
              </DialogTitle>
              <p className={`text-gray-600 ${fontClass}`}>
                  {language === 'mr' ? 'कार्यक्रमाची सर्व माहिती भरा आणि तयार करा' : 'Fill all event details and create'}
              </p>
            </DialogHeader>
              
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                  <h3 className={`text-lg font-bold text-amber-900 mb-4 flex items-center ${fontDisplayClass}`}>
                    <Calendar className="w-5 h-5 mr-2" />
                    {language === 'mr' ? 'कार्यक्रम माहिती' : 'Event Information'}
                  </h3>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'कार्यक्रमाचे शीर्षक *' : 'Event Title *'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'mr' ? 'कार्यक्रमाचे नाव टाका' : 'Enter event name'} 
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
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'कार्यक्रमाचा प्रकार *' : 'Event Type *'}
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500">
                                <SelectValue placeholder={language === 'mr' ? 'प्रकार निवडा' : 'Select type'} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="offline">{language === 'mr' ? 'ऑफलाइन' : 'Offline'}</SelectItem>
                              <SelectItem value="online">{language === 'mr' ? 'ऑनलाइन' : 'Online'}</SelectItem>
                              <SelectItem value="hybrid">{language === 'mr' ? 'हायब्रिड' : 'Hybrid'}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className={`text-amber-800 font-semibold ${fontClass}`}>
                          {language === 'mr' ? 'वर्णन' : 'Description'}
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder={language === 'mr' ? 'कार्यक्रमाचा तपशील' : 'Event details'} 
                            {...field} 
                            className="rounded-lg border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                              rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                  {/* Location and Time Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <h3 className={`text-lg font-bold text-blue-900 mb-4 flex items-center ${fontDisplayClass}`}>
                    <MapPin className="w-5 h-5 mr-2" />
                      {language === 'mr' ? 'स्थान आणि वेळ' : 'Location & Time'}
                  </h3>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'स्थळ' : 'Venue'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={language === 'mr' ? 'कार्यक्रमाचे स्थळ' : 'Event venue'} 
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
                        name="district"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'जिल्हा' : 'District'}
                          </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                                <SelectTrigger className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500">
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
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'सुरुवातीची तारीख आणि वेळ *' : 'Start Date & Time *'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-blue-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'समाप्तीची तारीख आणि वेळ' : 'End Date & Time'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="datetime-local" 
                              {...field} 
                              className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Additional Details Section */}
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <h3 className={`text-lg font-bold text-green-900 mb-4 flex items-center ${fontDisplayClass}`}>
                    <Users className="w-5 h-5 mr-2" />
                    {language === 'mr' ? 'अतिरिक्त माहिती' : 'Additional Details'}
                  </h3>
                    
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="maxAttendees"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-green-800 font-semibold ${fontClass}`}>
                            {language === 'mr' ? 'कमाल उपस्थित' : 'Max Attendees'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder={language === 'mr' ? 'जास्तीत जास्त लोक' : 'Maximum people'} 
                              {...field} 
                              className="rounded-lg border-green-200 focus:border-green-500 focus:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                        name="meetingLink"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel className={`text-green-800 font-semibold ${fontClass}`}>
                              {language === 'mr' ? 'मीटिंग लिंक' : 'Meeting Link'}
                          </FormLabel>
                          <FormControl>
                            <Input 
                                placeholder={language === 'mr' ? 'ऑनलाइन मीटिंगची लिंक' : 'Online meeting link'} 
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
                    disabled={createEventMutation.isPending}
                      className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {createEventMutation.isPending 
                      ? (language === 'mr' ? "तयार करत आहे..." : "Creating...") 
                      : (language === 'mr' ? "कार्यक्रम तयार करा" : "Create Event")}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>

        <>
          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-white shadow-lg rounded-xl border border-orange-200 overflow-hidden hover:shadow-xl transition-all duration-200 h-auto">
              <div className="relative">
                <img 
                    src={event.image}
                    alt={event.title}
                    className="w-full h-32 object-cover"
                  />
                                    <div className="absolute top-2 right-2">
                <Badge className={`${event.badge.color} rounded-xl px-3 py-1`}>
                  <span className="mr-2">{event.badge.icon}</span>
                  <span className="hidden sm:inline">{event.badge.text}</span>
              </Badge>
            </div>
          </div>
            <CardContent className="p-4">
              <div className="space-y-3">
              <div className="flex items-start justify-between">
                  <h3 className={`font-semibold text-amber-900 line-clamp-2 flex-1 pr-2 text-sm ${fontDisplayClass}`}>
                    {event.title}
                </h3>
              </div>

                <p className={`text-gray-600 line-clamp-2 text-xs ${fontClass}`}>
                  {event.description}
              </p>

                <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2 text-orange-500" />
                    <span className={fontClass}>{formatDate(event.eventDate)}</span>
                </div>
                <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-2 text-orange-500" />
                    <span className={fontClass}>{formatTime(event.eventDate)}</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-2 text-orange-500" />
                    <span className={`truncate ${fontClass}`}>{event.venue}</span>
                </div>
                  {event.maxAttendees && (
                <div className="flex items-center">
                      <Users className="w-3 h-3 mr-2 text-orange-500" />
                      <span className={fontClass}>
                        {language === 'mr' ? 'कमाल: ' : 'Max: '}{event.maxAttendees} {language === 'mr' ? 'लोक' : 'people'}
                      </span>
                </div>
                  )}
              </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={`${getEventTypeColor(event.eventType)} rounded-md text-xs`}>
                      {getEventTypeIcon(event.eventType)}
                      <span className="ml-1">{getEventTypeLabel(event.eventType)}</span>
              </Badge>
            </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-md">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-md">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-md">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
              <Calendar className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className={`text-2xl font-bold text-gray-900 mb-3 ${fontDisplayClass}`}>
              {language === 'mr' ? 'कोणतेही कार्यक्रम आढळले नाहीत' : 'No events found'}
            </h3>
            <p className={`text-gray-500 text-lg ${fontClass}`}>
              {language === 'mr' ? 'फिल्टर साफ करा किंवा नवीन शोध टर्म वापरा' : 'Clear filters or try a new search term'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(filteredEvents.length > 20) && (
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
            disabled={page * 20 >= filteredEvents.length}
              className="rounded-xl border-orange-200 hover:border-orange-300 hover:bg-orange-50"
            >
              {language === 'mr' ? 'पुढील' : 'Next'}
            </Button>
        </div>
      )}
        </>
    </div>
  </>
  );
}
