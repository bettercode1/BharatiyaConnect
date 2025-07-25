import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const leadershipFormSchema = z.object({
  name: z.string().min(1, "नाव आवश्यक आहे"),
  designation: z.string().min(1, "पदनाम आवश्यक आहे"),
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

export default function Leadership() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<any>(null);

  const { data: leadership, isLoading } = useQuery({
    queryKey: ["/api/leadership"],
  });

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

  const filteredLeadership = leadership?.filter((leader: any) =>
    leader.name.toLowerCase().includes(search.toLowerCase()) ||
    leader.designation.toLowerCase().includes(search.toLowerCase())
  );

  // Default leadership data if no data from API
  const defaultLeadership = [
    {
      id: '1',
      name: 'नरेंद्र मोदी',
      designation: 'पंतप्रधान',
      bio: 'भारताचे सध्याचे पंतप्रधान आणि भारतीय जनता पक्षाचे प्रमुख नेते.',
      profileImage: '',
      contactEmail: '',
      socialMedia: {
        twitter: 'narendramodi',
        instagram: 'narendramodi'
      },
      displayOrder: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'देवेंद्र फडणवीस',
      designation: 'उपमुख्यमंत्री',
      bio: 'महाराष्ट्राचे उपमुख्यमंत्री आणि भाजपचे वरिष्ठ नेते.',
      profileImage: '',
      contactEmail: '',
      socialMedia: {
        twitter: 'devendra_fadnavis',
        instagram: 'devendra_fadnavis'
      },
      displayOrder: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'नितिन गडकरी',
      designation: 'केंद्रीय मंत्री',
      bio: 'केंद्रीय रस्ते, वाहतूक आणि महामार्ग मंत्री.',
      profileImage: '',
      contactEmail: '',
      socialMedia: {
        twitter: 'nitin_gadkari',
        instagram: 'nitin_gadkari'
      },
      displayOrder: 3,
      isActive: true
    },
    {
      id: '4',
      name: 'पंकजा मुंडे',
      designation: 'आमदार',
      bio: 'महाराष्ट्र विधानसभेचे सदस्य आणि भाजपच्या महिला विभागाच्या प्रमुख.',
      profileImage: '',
      contactEmail: '',
      socialMedia: {
        twitter: 'pankajamunde',
        instagram: 'pankajamunde'
      },
      displayOrder: 4,
      isActive: true
    }
  ];

  const leadershipData = (filteredLeadership && filteredLeadership.length > 0) ? filteredLeadership : defaultLeadership;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-4" />
                <div className="flex justify-center space-x-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
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
          <h1 className="text-3xl font-bold text-amber-900">नेतृत्व प्रदर्शनी</h1>
          <p className="text-gray-600 mt-2">
            एकूण {leadershipData?.length || 0} नेते प्रदर्शित आहेत
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              नवीन नेते जोडा
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>नवीन नेतृत्व सदस्य जोडा</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>नाव *</FormLabel>
                        <FormControl>
                          <Input placeholder="नेत्याचे पूर्ण नाव" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>पदनाम *</FormLabel>
                        <FormControl>
                          <Input placeholder="पदनाम किंवा जबाबदारी" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>चरित्र</FormLabel>
                      <FormControl>
                        <Textarea placeholder="नेत्याचे संक्षिप्त चरित्र" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>प्रोफाइल इमेज URL</FormLabel>
                        <FormControl>
                          <Input placeholder="प्रोफाइल फोटोची लिंक" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ईमेल</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="संपर्क ईमेल" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">सामाजिक माध्यम</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="socialMedia.twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="@username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMedia.instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="@username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="socialMedia.facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="profile name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="displayOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>प्रदर्शन क्रम</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
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
                    disabled={createLeadershipMutation.isPending}
                    className="bg-orange-500 hover:bg-amber-600 text-white"
                  >
                    {createLeadershipMutation.isPending ? "जोडत आहे..." : "नेते जोडा"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="नेत्याचे नाव किंवा पदनाम शोधा..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Leadership Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {leadershipData?.map((leader: any, index: number) => (
          <Card
            key={leader.id}
            className="card-leadership hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
          >
            <CardContent className="p-6 text-center">
              {/* Edit/Delete buttons - only show for non-default leaders */}
              {leadership && leadership.find((l: any) => l.id === leader.id) && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                      onClick={() => setEditingLeader(leader)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(leader.id)}
                      disabled={deleteLeadershipMutation.isPending}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-orange-200">
                <AvatarImage src={leader.profileImage} />
                <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                  {leader.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-bold text-amber-900 mb-1 text-lg">{leader.name}</h3>
              <p className="text-sm text-gray-600 mb-3 font-medium">{leader.designation}</p>

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
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-8 h-8 p-0 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोणतेही नेते आढळले नाहीत</h3>
            <p className="text-gray-500">नवीन शोध टर्म वापरून पहा किंवा नवीन नेते जोडा</p>
          </div>
        )}
      </div>
    </div>
  );
}
