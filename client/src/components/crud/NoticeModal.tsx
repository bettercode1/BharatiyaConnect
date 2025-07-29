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
import { Switch } from '../ui/switch';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { isUnauthorizedError } from '../../lib/authUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Clock,
  Pin,
  PinOff,
  Upload,
  X,
  FileText,
  Save,
  AlertCircle,
  Send,
  Users,
  Crown,
  MapPin
} from 'lucide-react';

// Form validation schema
const noticeFormSchema = z.object({
  title: z.string().min(5, 'शीर्षक किमान 5 अक्षरांचा असावा'),
  content: z.string().min(10, 'सामग्री किमान 10 अक्षरांची असावी'),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  category: z.string().min(1, 'श्रेणी आवश्यक आहे'),
  targetAudience: z.enum(['all', 'leadership', 'constituency']),
  constituency: z.string().optional(),
  district: z.string().optional(),
  expiryDate: z.string().optional(),
  isPinned: z.boolean().default(false),
});

type NoticeFormData = z.infer<typeof noticeFormSchema>;

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  notice?: any;
  onSuccess: () => void;
}

export const NoticeModal: React.FC<NoticeModalProps> = ({
  isOpen,
  onClose,
  mode,
  notice,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<NoticeFormData>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: '',
      content: '',
      priority: 'medium',
      category: '',
      targetAudience: 'all',
      constituency: '',
      district: '',
      expiryDate: '',
      isPinned: false,
    }
  });

  // Reset form when notice data changes
  useEffect(() => {
    if (notice && (mode === 'edit' || mode === 'view')) {
      form.reset({
        title: notice.title || '',
        content: notice.content || '',
        priority: notice.priority || 'medium',
        category: notice.category || '',
        targetAudience: notice.targetAudience || 'all',
        constituency: notice.constituency || '',
        district: notice.district || '',
        expiryDate: notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : '',
        isPinned: notice.isPinned || false,
      });
    } else {
      form.reset({
        title: '',
        content: '',
        priority: 'medium',
        category: '',
        targetAudience: 'all',
        constituency: '',
        district: '',
        expiryDate: '',
        isPinned: false,
      });
    }
  }, [notice, mode, form]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const createNoticeMutation = useMutation({
    mutationFn: async (data: NoticeFormData) => {
      const noticeData = {
        ...data,
        priority: data.priority as 'urgent' | 'high' | 'medium' | 'low',
        targetAudience: data.targetAudience as 'all' | 'leadership' | 'constituency',
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        attachments: attachments.map(file => `/uploads/${file.name}`) // Mock file paths
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
        description: "सूचना तयार करता आली नाही",
        variant: "destructive",
      });
    },
  });

  const updateNoticeMutation = useMutation({
    mutationFn: async (data: NoticeFormData) => {
      const noticeData = {
        ...data,
        priority: data.priority as 'urgent' | 'high' | 'medium' | 'low',
        targetAudience: data.targetAudience as 'all' | 'leadership' | 'constituency',
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString() : null,
        attachments: attachments.map(file => `/uploads/${file.name}`) // Mock file paths
      };
      await apiRequest("PUT", `/api/notices/${notice?.id}`, noticeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/recent-notices"] });
      toast({
        title: "यशस्वी",
        description: "सूचना यशस्वीरित्या अपडेट केली गेली",
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
        description: "सूचना अपडेट करता आली नाही",
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
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/recent-notices"] });
      toast({
        title: "यशस्वी",
        description: "सूचना हटवली गेली",
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
        description: "सूचना हटवता आली नाही",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NoticeFormData) => {
    if (mode === 'create') {
      createNoticeMutation.mutate(data);
    } else if (mode === 'edit') {
      updateNoticeMutation.mutate(data);
    }
  };

  const handleDelete = () => {
    if (notice && window.confirm('क्या आप वाकई इस सूचना को हटाना चाहते हैं?')) {
      deleteNoticeMutation.mutate(notice.id);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Info className="h-4 w-4 text-blue-500" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Users className="h-4 w-4" />;
      case 'leadership': return <Crown className="h-4 w-4" />;
      case 'constituency': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const isLoading = createNoticeMutation.isPending || updateNoticeMutation.isPending || deleteNoticeMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-orange-200 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-900">
            {getPriorityIcon(form.watch("priority"))}
            {mode === 'create' && 'नई सूचना जोड़ें'}
            {mode === 'edit' && 'सूचना संपादित करें'}
            {mode === 'view' && 'सूचना विवरण'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-2 border-orange-200 bg-white rounded-2xl shadow-lg">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-900">
                <Bell className="h-4 w-4 text-orange-600" />
                मूलभूत जानकारी
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-amber-900 font-medium">शीर्षक *</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    disabled={mode === 'view' || isLoading}
                    placeholder="सूचनेचे शीर्षक"
                    className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                  />
                  {form.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.title.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="content" className="text-amber-900 font-medium">सामग्री *</Label>
                  <Textarea
                    id="content"
                    {...form.register("content")}
                    disabled={mode === 'view' || isLoading}
                    rows={5}
                    placeholder="सूचनेची विस्तृत सामग्री..."
                    className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                  />
                  {form.formState.errors.content && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {form.formState.errors.content.message}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-amber-900 font-medium">श्रेणी *</Label>
                    <Input
                      id="category"
                      {...form.register("category")}
                      disabled={mode === 'view' || isLoading}
                      placeholder="सूचनेची श्रेणी"
                      className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                    />
                    {form.formState.errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="priority" className="text-amber-900 font-medium">प्राथमिकता</Label>
                    <Select 
                      value={form.watch("priority")} 
                      onValueChange={(value) => form.setValue("priority", value as any)}
                      disabled={mode === 'view' || isLoading}
                    >
                      <SelectTrigger className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">सामान्य</SelectItem>
                        <SelectItem value="medium">मध्यम</SelectItem>
                        <SelectItem value="high">उच्च</SelectItem>
                        <SelectItem value="urgent">अत्यावश्यक</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Audience and Location */}
          <Card className="border-2 border-orange-200 bg-white rounded-2xl shadow-lg">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-900">
                <Users className="h-4 w-4 text-orange-600" />
                लक्ष्य दर्शक आणि स्थान
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="targetAudience" className="text-amber-900 font-medium">लक्ष्य दर्शक</Label>
                  <Select 
                    value={form.watch("targetAudience")} 
                    onValueChange={(value) => form.setValue("targetAudience", value as any)}
                    disabled={mode === 'view' || isLoading}
                  >
                    <SelectTrigger className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          सर्व सदस्य
                        </div>
                      </SelectItem>
                      <SelectItem value="leadership">
                        <div className="flex items-center gap-2">
                          <Crown className="h-4 w-4" />
                          नेतृत्व
                        </div>
                      </SelectItem>
                      <SelectItem value="constituency">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          विशिष्ट निर्वाचन क्षेत्र
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {form.watch("targetAudience") === 'constituency' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="constituency" className="text-amber-900 font-medium">निर्वाचन क्षेत्र</Label>
                      <Input
                        id="constituency"
                        {...form.register("constituency")}
                        disabled={mode === 'view' || isLoading}
                        placeholder="निर्वाचन क्षेत्र"
                        className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="district" className="text-amber-900 font-medium">जिला</Label>
                      <Input
                        id="district"
                        {...form.register("district")}
                        disabled={mode === 'view' || isLoading}
                        placeholder="जिला"
                        className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="border-2 border-orange-200 bg-white rounded-2xl shadow-lg">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-900">
                <Clock className="h-4 w-4 text-orange-600" />
                सेटिंग्ज
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expiryDate" className="text-amber-900 font-medium">समाप्ति तिथि</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    {...form.register("expiryDate")}
                    disabled={mode === 'view' || isLoading}
                    className="border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPinned"
                    checked={form.watch("isPinned")}
                    onCheckedChange={(checked) => form.setValue("isPinned", checked)}
                    disabled={mode === 'view' || isLoading}
                    className="data-[state=checked]:bg-orange-600"
                  />
                  <Label htmlFor="isPinned" className="flex items-center gap-2 text-amber-900 font-medium">
                    {form.watch("isPinned") ? <Pin className="h-4 w-4 text-orange-600" /> : <PinOff className="h-4 w-4 text-gray-400" />}
                    सूचना पिन करा
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Attachments */}
          {mode !== 'view' && (
            <Card className="border-2 border-orange-200 bg-white rounded-2xl shadow-lg">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2 text-amber-900">
                  <Upload className="h-4 w-4 text-orange-600" />
                  फाइल अटैचमेंट
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="attachments" className="text-amber-900 font-medium">फाइल अपलोड करें</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      className="cursor-pointer border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-200 rounded-xl"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      समर्थित फाइल प्रकार: PDF, DOC, DOCX, JPG, PNG, TXT (अधिकतम 5MB)
                    </p>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-amber-900">अपलोड की गई फाइलें:</h4>
                      {attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={isLoading}
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-200 rounded-xl"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Mode Information */}
          {mode === 'view' && notice && (
            <Card className="border-2 border-orange-200 bg-white rounded-2xl shadow-lg">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4 text-amber-900">अतिरिक्त जानकारी</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-amber-900">प्राथमिकता:</p>
                    <Badge className={getPriorityColor(notice.priority)}>
                      {notice.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-amber-900">लक्ष्य दर्शक:</p>
                    <div className="flex items-center gap-2">
                      {getTargetAudienceIcon(notice.targetAudience)}
                      <span>{notice.targetAudience}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-amber-900">प्रकाशित तिथि:</p>
                    <p className="font-medium text-amber-800">
                      {notice.publishedAt ? new Date(notice.publishedAt).toLocaleString('hi-IN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-900">समाप्ति तिथि:</p>
                    <p className="font-medium text-amber-800">
                      {notice.expiryDate ? new Date(notice.expiryDate).toLocaleDateString('hi-IN') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-900">दृश्य संख्या:</p>
                    <p className="font-medium text-amber-800">{notice.viewCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-amber-900">स्थिति:</p>
                    <div className="flex items-center gap-2">
                      {notice.isPinned ? <Pin className="h-4 w-4 text-orange-600" /> : <PinOff className="h-4 w-4 text-gray-400" />}
                      <span>{notice.isPinned ? 'पिन केलेली' : 'सामान्य'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {mode === 'view' && (
              <>
                <Button type="button" variant="outline" onClick={() => {}} className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl">
                  संपादित करें
                </Button>
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  हटाएं
                </Button>
              </>
            )}
            {mode !== 'view' && (
              <>
                <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl">
                  रद्द करें
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl">
                  <Send className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'प्रकाशित करें' : 'अपडेट करें'}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 