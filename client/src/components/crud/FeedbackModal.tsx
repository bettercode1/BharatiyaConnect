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
  Upload, 
  X, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Bug,
  User,
  Crown,
  Save,
  AlertCircle,
  Send
} from 'lucide-react';

// Form validation schema
const feedbackFormSchema = z.object({
  memberName: z.string().min(2, 'नाम किमान 2 अक्षरांचे असावे'),
  subject: z.string().min(5, 'विषय किमान 5 अक्षरांचा असावा'),
  message: z.string().min(10, 'संदेश किमान 10 अक्षरांचा असावा'),
  category: z.enum(['suggestion', 'complaint', 'appreciation', 'meeting_request', 'event_feedback', 'technical_issue']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  userType: z.enum(['member', 'leader']),
  phone: z.string().optional(),
  email: z.string().email('वैध ईमेल पता द्या').optional().or(z.literal('')),
  constituency: z.string().optional(),
  district: z.string().optional(),
  eventId: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackFormSchema>;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  feedback?: any;
  onSuccess: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  mode,
  feedback,
  onSuccess
}) => {
  console.log('FeedbackModal rendered with isOpen:', isOpen, 'mode:', mode);
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [responseData, setResponseData] = useState({
    response: '',
    status: 'pending' as 'pending' | 'in_progress' | 'resolved'
  });

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      memberName: '',
    subject: '',
    message: '',
    category: 'suggestion',
    priority: 'medium',
      userType: 'member',
    phone: '',
    email: '',
    constituency: '',
    district: '',
      eventId: '',
    }
  });

  // Reset form when feedback data changes
  useEffect(() => {
    if (feedback && (mode === 'edit' || mode === 'view')) {
      form.reset({
        memberName: feedback.memberName || '',
        subject: feedback.subject || '',
        message: feedback.message || '',
        category: feedback.category || 'suggestion',
        priority: feedback.priority || 'medium',
        userType: feedback.userType || 'member',
        phone: feedback.phone || '',
        email: feedback.email || '',
        constituency: feedback.constituency || '',
        district: feedback.district || '',
        eventId: feedback.eventId || '',
      });
      
      setResponseData({
        response: feedback.response || '',
        status: feedback.status || 'pending'
      });
    } else {
      form.reset({
        memberName: '',
        subject: '',
        message: '',
        category: 'suggestion',
        priority: 'medium',
        userType: 'member',
        phone: '',
        email: '',
        constituency: '',
        district: '',
        eventId: '',
      });
      
      setResponseData({
        response: '',
        status: 'pending'
      });
    }
  }, [feedback, mode, form]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const createFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
      const feedbackData = {
        ...data,
        category: data.category as 'suggestion' | 'complaint' | 'appreciation' | 'meeting_request' | 'event_feedback' | 'technical_issue',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        userType: data.userType as 'member' | 'leader',
        attachmentUrls: attachments.map(file => `/uploads/${file.name}`) // Mock file paths
      };
      await apiRequest("POST", "/api/feedback", feedbackData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "यशस्वी",
        description: "फीडबैक यशस्वीरित्या सबमिट केला गेला",
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
        description: "फीडबैक सबमिट करता आला नाही",
        variant: "destructive",
      });
    },
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackFormData) => {
    const feedbackData = {
        ...data,
        category: data.category as 'suggestion' | 'complaint' | 'appreciation' | 'meeting_request' | 'event_feedback' | 'technical_issue',
        priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
        userType: data.userType as 'member' | 'leader',
        response: responseData.response,
      status: responseData.status,
      responseDate: responseData.response ? new Date().toISOString() : undefined,
        attachmentUrls: attachments.map(file => `/uploads/${file.name}`) // Mock file paths
      };
      await apiRequest("PUT", `/api/feedback/${feedback?.id}`, feedbackData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "यशस्वी",
        description: "फीडबैक यशस्वीरित्या अपडेट केला गेला",
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
        description: "फीडबैक अपडेट करता आला नाही",
        variant: "destructive",
      });
    },
  });

  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/feedback/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "यशस्वी",
        description: "फीडबैक हटवला गेला",
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
        description: "फीडबैक हटवता आला नाही",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    if (mode === 'create') {
      createFeedbackMutation.mutate(data);
    } else if (mode === 'edit') {
      updateFeedbackMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (feedback && window.confirm('क्या आप वाकई इस फीडबैक को हटाना चाहते हैं?')) {
      deleteFeedbackMutation.mutate(feedback.id);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'event_feedback': return <Calendar className="h-4 w-4" />;
      case 'technical_issue': return <Bug className="h-4 w-4" />;
      case 'meeting_request': return <Users className="h-4 w-4" />;
      case 'suggestion': return <MessageSquare className="h-4 w-4" />;
      case 'complaint': return <AlertTriangle className="h-4 w-4" />;
      case 'appreciation': return <CheckCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLoading = createFeedbackMutation.isPending || updateFeedbackMutation.isPending || deleteFeedbackMutation.isPending;

  console.log('Rendering FeedbackModal with isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('Modal is not open, returning null');
    return null;
  }

  console.log('Modal is open, rendering Dialog');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-orange-400 rounded-3xl bg-orange-50 shadow-2xl" style={{ zIndex: 9999 }}>
        <DialogHeader className="bg-gradient-to-r from-orange-300 to-amber-300 rounded-t-3xl p-6 border-b-4 border-orange-400 sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold text-orange-900 flex items-center gap-3">
            {getCategoryIcon(form.watch("category"))}
            {mode === 'create' && 'नई फीडबैक जोड़ें'}
            {mode === 'edit' && 'फीडबैक संपादित करें'}
            {mode === 'view' && 'फीडबैक विवरण'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 bg-orange-50 relative z-20">
          {/* User Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <User className="h-5 w-5 text-orange-700" />
              उपयोगकर्ता जानकारी
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userType" className="text-orange-900 font-bold text-base">उपयोगकर्ता प्रकार</Label>
                <Select 
                  value={form.watch("userType")} 
                  onValueChange={(value) => form.setValue("userType", value as any)}
                  disabled={mode === 'view' || isLoading}
                >
                  <SelectTrigger className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-3 border-orange-400">
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        सदस्य
                      </div>
                    </SelectItem>
                    <SelectItem value="leader">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        नेता
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="memberName" className="text-orange-900 font-bold text-base">नाम *</Label>
                <Input
                  id="memberName"
                  {...form.register("memberName")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="उपयोगकर्ता का नाम"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.memberName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.memberName.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-orange-900 font-bold text-base">फोन नंबर</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="+91 9876543210"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-orange-900 font-bold text-base">ईमेल</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="user@bjp.org"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback Details */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <MessageSquare className="h-5 w-5 text-orange-700" />
              फीडबैक विवरण
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subject" className="text-orange-900 font-bold text-base">विषय *</Label>
                <Input
                  id="subject"
                  {...form.register("subject")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="फीडबैक का विषय"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
                {form.formState.errors.subject && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="category" className="text-orange-900 font-bold text-base">श्रेणी *</Label>
                <Select 
                  value={form.watch("category")} 
                  onValueChange={(value) => form.setValue("category", value as any)}
                  disabled={mode === 'view' || isLoading}
                >
                  <SelectTrigger className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-3 border-orange-400">
                    <SelectItem value="suggestion">सुझाव</SelectItem>
                    <SelectItem value="complaint">शिकायत</SelectItem>
                    <SelectItem value="appreciation">प्रशंसा</SelectItem>
                    <SelectItem value="meeting_request">मीटिंग अनुरोध</SelectItem>
                    <SelectItem value="event_feedback">कार्यक्रम फीडबैक</SelectItem>
                    <SelectItem value="technical_issue">तकनीकी समस्या</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority" className="text-orange-900 font-bold text-base">प्राथमिकता *</Label>
                <Select 
                  value={form.watch("priority")} 
                  onValueChange={(value) => form.setValue("priority", value as any)}
                  disabled={mode === 'view' || isLoading}
                >
                  <SelectTrigger className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-3 border-orange-400">
                    <SelectItem value="low">कम</SelectItem>
                    <SelectItem value="medium">मध्यम</SelectItem>
                    <SelectItem value="high">उच्च</SelectItem>
                    <SelectItem value="urgent">तत्काल</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="eventId" className="text-orange-900 font-bold text-base">कार्यक्रम ID</Label>
                <Input
                  id="eventId"
                  {...form.register("eventId")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="कार्यक्रम ID (वैकल्पिक)"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Label htmlFor="message" className="text-orange-900 font-bold text-base">संदेश *</Label>
              <Textarea
                id="message"
                {...form.register("message")}
                disabled={mode === 'view' || isLoading}
                rows={4}
                placeholder="आपका फीडबैक यहाँ लिखें..."
                className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
              />
              {form.formState.errors.message && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {form.formState.errors.message.message}
                </p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <Calendar className="h-5 w-5 text-orange-700" />
              स्थान जानकारी
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="constituency" className="text-orange-900 font-bold text-base">निर्वाचन क्षेत्र</Label>
                <Input
                  id="constituency"
                  {...form.register("constituency")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="निर्वाचन क्षेत्र"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
              
              <div>
                <Label htmlFor="district" className="text-orange-900 font-bold text-base">जिला</Label>
                <Input
                  id="district"
                  {...form.register("district")}
                  disabled={mode === 'view' || isLoading}
                  placeholder="जिला"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <Upload className="h-5 w-5 text-orange-700" />
              फाइल संलग्नक
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="attachments" className="text-orange-900 font-bold text-base">फाइलें जोड़ें</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  disabled={mode === 'view' || isLoading}
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-orange-900 font-medium">संलग्न फाइलें:</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border-2 border-orange-300">
                      <span className="text-orange-900 text-sm">{file.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="border-2 border-red-300 text-red-700 hover:bg-red-100 rounded-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Response Section (View Mode) */}
          {mode === 'view' && feedback && (
            <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
                <Send className="h-5 w-5 text-orange-700" />
                प्रतिक्रिया
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="response" className="text-orange-900 font-bold text-base">प्रतिक्रिया</Label>
                  <Textarea
                    id="response"
                    value={responseData.response}
                    onChange={(e) => setResponseData({ ...responseData, response: e.target.value })}
                    rows={3}
                    placeholder="प्रतिक्रिया लिखें..."
                    className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div>
                    <Label htmlFor="status" className="text-orange-900 font-bold text-base">स्थिति</Label>
                    <Select 
                      value={responseData.status} 
                      onValueChange={(value) => setResponseData({ ...responseData, status: value as any })}
                    >
                      <SelectTrigger className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-3 border-orange-400">
                        <SelectItem value="pending">लंबित</SelectItem>
                        <SelectItem value="in_progress">प्रगति में</SelectItem>
                        <SelectItem value="resolved">समाधान</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Badge className={`rounded-xl ${getStatusColor(responseData.status)}`}>
                    {responseData.status === 'pending' ? 'लंबित' : 
                     responseData.status === 'in_progress' ? 'प्रगति में' : 'समाधान'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-4 border-orange-400 bg-orange-50 sticky bottom-0 z-10">
            {mode === 'view' && feedback && (
              <>
                <Button type="button" variant="outline" onClick={() => {}} className="border-3 border-orange-500 text-orange-900 hover:bg-orange-200 rounded-xl bg-white font-bold">
                  <MessageSquare className="h-4 w-4 mr-2" />
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
                  {mode === 'create' ? 'फीडबैक जोड़ें' : 'अपडेट करें'}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 