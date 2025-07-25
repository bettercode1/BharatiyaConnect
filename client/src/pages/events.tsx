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
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Globe,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const eventFormSchema = z.object({
  title: z.string().min(1, "शीर्षक आवश्यक आहे"),
  description: z.string().optional(),
  eventType: z.enum(["online", "offline", "hybrid"]),
  venue: z.string().optional(),
  eventDate: z.string().min(1, "कार्यक्रमाची तारीख आवश्यक आहे"),
  endDate: z.string().optional(),
  maxAttendees: z.string().optional(),
  meetingLink: z.string().optional(),
  constituency: z.string().optional(),
  district: z.string().optional(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

export default function Events() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: eventsData, isLoading } = useQuery({
    queryKey: ["/api/events", { search, status, page }],
  });

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
        title: "यशस्वी",
        description: "कार्यक्रम यशस्वीरित्या तयार केला गेला",
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
        description: "कार्यक्रम तयार करता आला नाही",
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
    createEventMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        return 'ऑनलाइन';
      case 'offline':
        return 'ऑफलाइन';
      case 'hybrid':
        return 'हायब्रिड';
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
        return 'प्रकाशित';
      case 'draft':
        return 'मसुदा';
      case 'cancelled':
        return 'रद्द';
      case 'completed':
        return 'पूर्ण';
      default:
        return status;
    }
  };

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
          <h1 className="text-3xl font-bold text-amber-900">कार्यक्रम व्यवस्थापन</h1>
          <p className="text-gray-600 mt-2">
            एकूण {eventsData?.total || 0} कार्यक्रम आहेत
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              नवीन कार्यक्रम जोडा
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>नवीन कार्यक्रम तयार करा</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>कार्यक्रमाचे शीर्षक *</FormLabel>
                      <FormControl>
                        <Input placeholder="कार्यक्रमाचे नाव टाका" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>वर्णन</FormLabel>
                      <FormControl>
                        <Textarea placeholder="कार्यक्रमाचा तपशील" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>कार्यक्रमाचा प्रकार *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="प्रकार निवडा" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="offline">ऑफलाइन</SelectItem>
                            <SelectItem value="online">ऑनलाइन</SelectItem>
                            <SelectItem value="hybrid">हायब्रिड</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>स्थळ</FormLabel>
                        <FormControl>
                          <Input placeholder="कार्यक्रमाचे स्थळ" {...field} />
                        </FormControl>
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
                        <FormLabel>सुरुवातीची तारीख आणि वेळ *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
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
                        <FormLabel>समाप्तीची तारीख आणि वेळ</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>कमाल उपस्थित</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="जास्तीत जास्त लोक" {...field} />
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
                        <FormLabel>मीटिंग लिंक</FormLabel>
                        <FormControl>
                          <Input placeholder="ऑनलाइन मीटिंगची लिंक" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="constituency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>मतदारसंघ</FormLabel>
                        <FormControl>
                          <Input placeholder="मतदारसंघाचे नाव" {...field} />
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
                          <Input placeholder="जिल्ह्याचे नाव" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    disabled={createEventMutation.isPending}
                    className="bg-orange-500 hover:bg-amber-600 text-white"
                  >
                    {createEventMutation.isPending ? "तयार करत आहे..." : "कार्यक्रम तयार करा"}
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
                placeholder="कार्यक्रम, स्थळ किंवा आयोजक शोधा..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="स्थिती" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">सर्व</SelectItem>
                <SelectItem value="published">प्रकाशित</SelectItem>
                <SelectItem value="draft">मसुदा</SelectItem>
                <SelectItem value="cancelled">रद्द</SelectItem>
                <SelectItem value="completed">पूर्ण</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              फिल्टर
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsData?.events?.map((event: any) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-amber-900 line-clamp-2 flex-1 pr-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Badge className={getEventTypeColor(event.eventType)}>
                      <span className="mr-1">{getEventTypeIcon(event.eventType)}</span>
                      {getEventTypeLabel(event.eventType)}
                    </Badge>
                  </div>
                </div>

                {event.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-3 h-3 mr-2" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-3 h-3 mr-2" />
                    <span>{formatTime(event.eventDate)}</span>
                  </div>
                  {event.venue && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-2" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  )}
                  {event.maxAttendees && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-3 h-3 mr-2" />
                      <span>कमाल: {event.maxAttendees} लोक</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusLabel(event.status)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोणतेही कार्यक्रम आढळले नाहीत</h3>
            <p className="text-gray-500">नवीन शोध टर्म वापरून पहा किंवा नवीन कार्यक्रम तयार करा</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {eventsData?.total > 20 && (
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
            disabled={page * 20 >= (eventsData?.total || 0)}
          >
            पुढील
          </Button>
        </div>
      )}
    </div>
  );
}
