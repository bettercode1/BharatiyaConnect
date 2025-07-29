import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { isUnauthorizedError } from '../../lib/authUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Crown, 
  Award, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

// Form validation schema
const memberFormSchema = z.object({
  fullName: z.string().min(2, 'नाव किमान 2 अक्षरांचे असावे'),
  phone: z.string().min(10, 'फोन नंबर किमान 10 अंकांचा असावे'),
  email: z.string().email('वैध ईमेल पता द्या'),
  constituency: z.string().min(1, 'निर्वाचन क्षेत्र आवश्यक आहे'),
  district: z.string().min(1, 'जिला आवश्यक आहे'),
  division: z.string().min(1, 'विभाग आवश्यक आहे'),
  designation: z.string().optional(),
  achievements: z.string().optional(),
  address: z.string().min(1, 'पत्ता आवश्यक आहे'),
  emergencyContact: z.string().min(10, 'आणीबाणी संपर्क किमान 10 अंकांचा असावे'),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberFormSchema>;

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  member?: any;
  onSuccess: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  mode,
  member,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
    fullName: '',
    phone: '',
      email: '',
    constituency: '',
    district: '',
    division: '',
    designation: '',
    achievements: '',
    address: '',
    emergencyContact: '',
    whatsapp: '',
    facebook: '',
    twitter: '',
      instagram: '',
    }
  });

  // Reset form when member data changes
  useEffect(() => {
    if (member && (mode === 'edit' || mode === 'view')) {
      form.reset({
        fullName: member.fullName || '',
        phone: member.phone || '',
        email: member.contactInfo?.email || '',
        constituency: member.constituency || '',
        district: member.district || '',
        division: member.division || '',
        designation: member.designation || '',
        achievements: member.achievements || '',
        address: member.contactInfo?.address || '',
        emergencyContact: member.contactInfo?.emergencyContact || '',
        whatsapp: member.socialMediaHandles?.whatsapp || '',
        facebook: member.socialMediaHandles?.facebook || '',
        twitter: member.socialMediaHandles?.twitter || '',
        instagram: member.socialMediaHandles?.instagram || '',
      });
    } else {
      form.reset({
        fullName: '',
        phone: '',
        email: '',
        constituency: '',
        district: '',
        division: '',
        designation: '',
        achievements: '',
        address: '',
        emergencyContact: '',
        whatsapp: '',
        facebook: '',
        twitter: '',
        instagram: '',
      });
    }
  }, [member, mode, form]);

  const createMemberMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      const memberData = {
        fullName: data.fullName,
        phone: data.phone,
        constituency: data.constituency,
        district: data.district,
        division: data.division,
        designation: data.designation,
        achievements: data.achievements,
         socialMediaHandles: {
          whatsapp: data.whatsapp || undefined,
          facebook: data.facebook || undefined,
          twitter: data.twitter || undefined,
          instagram: data.instagram || undefined
         },
         contactInfo: {
          email: data.email,
          address: data.address,
          emergencyContact: data.emergencyContact
        }
      };
      await apiRequest("POST", "/api/members", memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "यशस्वी",
        description: "सदस्य यशस्वीरित्या जोडला गेला",
      });
      onSuccess();
      onClose();
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

  const updateMemberMutation = useMutation({
    mutationFn: async (data: MemberFormData) => {
      const memberData = {
        fullName: data.fullName,
        phone: data.phone,
        constituency: data.constituency,
        district: data.district,
        division: data.division,
        designation: data.designation,
        achievements: data.achievements,
        socialMediaHandles: {
          whatsapp: data.whatsapp || undefined,
          facebook: data.facebook || undefined,
          twitter: data.twitter || undefined,
          instagram: data.instagram || undefined
        },
        contactInfo: {
          email: data.email,
          address: data.address,
          emergencyContact: data.emergencyContact
        }
      };
      await apiRequest("PUT", `/api/members/${member?.id}`, memberData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "यशस्वी",
        description: "सदस्य यशस्वीरित्या अपडेट केला गेला",
      });
      onSuccess();
      onClose();
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
        description: "सदस्य अपडेट करता आला नाही",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "यशस्वी",
        description: "सदस्य हटवला गेला",
      });
    onSuccess();
    onClose();
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
        description: "सदस्य हटवता आला नाही",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MemberFormData) => {
    if (mode === 'create') {
      createMemberMutation.mutate(data);
    } else if (mode === 'edit') {
      updateMemberMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (member && window.confirm('क्या आप वाकई इस सदस्य को हटाना चाहते हैं?')) {
      deleteMemberMutation.mutate(member.id);
    }
  };

  const isLoading = createMemberMutation.isPending || updateMemberMutation.isPending || deleteMemberMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-orange-400 rounded-3xl bg-orange-50 shadow-2xl z-[9999] relative">
        <DialogHeader className="bg-gradient-to-r from-orange-300 to-amber-300 rounded-t-3xl p-6 border-b-4 border-orange-400 sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold text-orange-900 flex items-center gap-3">
            <User className="h-6 w-6 text-orange-700" />
            {mode === 'create' && 'नया सदस्य जोड़ें'}
            {mode === 'edit' && 'सदस्य संपादित करें'}
            {mode === 'view' && 'सदस्य विवरण'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-orange-50 relative z-20">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <User className="h-5 w-5 text-orange-700" />
              मूलभूत जानकारी
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-orange-900 font-bold text-base">पूर्ण नाम *</Label>
                <Input
                  id="fullName"
                  {...form.register("fullName")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="सदस्य का पूर्ण नाम"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.fullName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-orange-900 font-bold text-base">फोन नंबर *</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="+91 9876543210"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-orange-900 font-bold text-base">ईमेल *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="member@bjp.org"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="designation" className="text-orange-900 font-bold text-base">पद</Label>
                <Input
                  id="designation"
                  {...form.register("designation")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="कार्यकर्ता, अध्यक्ष, आदि"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <MapPin className="h-5 w-5 text-orange-700" />
              स्थान जानकारी
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="constituency" className="text-orange-900 font-bold text-base">निर्वाचन क्षेत्र *</Label>
                <Input
                  id="constituency"
                  {...form.register("constituency")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="निर्वाचन क्षेत्र"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.constituency && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.constituency.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="district" className="text-orange-900 font-bold text-base">जिला *</Label>
                <Input
                  id="district"
                  {...form.register("district")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="जिला"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.district && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.district.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="division" className="text-orange-900 font-bold text-base">विभाग *</Label>
                <Input
                  id="division"
                  {...form.register("division")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="विभाग"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.division && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.division.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <MapPin className="h-5 w-5 text-orange-700" />
              पता जानकारी
            </h3>
            
            <div>
              <Label htmlFor="address" className="text-orange-900 font-bold text-base">पूर्ण पता *</Label>
              <Textarea
                id="address"
                {...form.register("address")}
                disabled={mode === 'view' || isLoading}
                placeholder="पूर्ण पता लिखें"
                rows={3}
                className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <Phone className="h-5 w-5 text-orange-700" />
              संपर्क जानकारी
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact" className="text-orange-900 font-bold text-base">आणीबाणी संपर्क *</Label>
                <Input
                  id="emergencyContact"
                  {...form.register("emergencyContact")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="आणीबाणी संपर्क नंबर"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.emergencyContact && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.emergencyContact.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="whatsapp" className="text-orange-900 font-bold text-base">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  {...form.register("whatsapp")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="WhatsApp नंबर"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <MessageCircle className="h-5 w-5 text-orange-700" />
              सोशल मीडिया
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook" className="text-orange-900 font-bold text-base">Facebook</Label>
                <Input
                  id="facebook"
                  {...form.register("facebook")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="Facebook प्रोफाइल"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter" className="text-orange-900 font-bold text-base">Twitter</Label>
                <Input
                  id="twitter"
                  {...form.register("twitter")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="Twitter प्रोफाइल"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram" className="text-orange-900 font-bold text-base">Instagram</Label>
                <Input
                  id="instagram"
                  {...form.register("instagram")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="Instagram प्रोफाइल"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <Award className="h-5 w-5 text-orange-700" />
              उपलब्धियां
            </h3>
            
            <div>
              <Label htmlFor="achievements" className="text-orange-900 font-bold text-base">उपलब्धियां</Label>
              <Textarea
                id="achievements"
                {...form.register("achievements")}
                disabled={mode === 'view' || isLoading}
                placeholder="सदस्य की उपलब्धियां लिखें"
                rows={3}
                className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
              />
            </div>
          </div>

          {/* View Mode Information */}
          {mode === 'view' && member && (
            <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
                <Crown className="h-5 w-5 text-orange-700" />
                सदस्य जानकारी
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-xl border-2 border-orange-300">
                  <p className="text-orange-900 font-bold">सदस्य ID</p>
                  <p className="text-orange-700">{member.id}</p>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border-2 border-orange-300">
                  <p className="text-orange-900 font-bold">स्थिति</p>
                  <Badge variant="default" className="rounded-xl">
                    {member.status || 'सक्रिय'}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border-2 border-orange-300">
                  <p className="text-orange-900 font-bold">पंजीकरण तिथि</p>
                  <p className="text-orange-700">{member.registrationDate || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-4 border-orange-400 bg-orange-50 sticky bottom-0 z-10">
            {mode === 'view' && member && (
              <>
                <Button type="button" variant="outline" onClick={() => {}} className="border-3 border-orange-500 text-orange-900 hover:bg-orange-200 rounded-xl bg-white font-bold">
                  <User className="h-4 w-4 mr-2" />
                  {t.common.edit}
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">
                  <X className="h-4 w-4 mr-2" />
                  {t.common.delete}
                </Button>
              </>
            )}
            {mode !== 'view' && (
              <>
                <Button type="button" variant="outline" onClick={onClose} className="border-3 border-orange-500 text-orange-900 hover:bg-orange-200 rounded-xl bg-white font-bold">
                  <X className="h-4 w-4 mr-2" />
                  {t.common.cancel}
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white rounded-xl font-bold text-lg px-6 py-3">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'सदस्य जोड़ें' : 'अपडेट करें'}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 