import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { useLanguage } from '../../hooks/useLanguage';
import { 
  Upload, 
  X, 
  FileText, 
  Calendar, 
  Users, 
  Building, 
  Tag,
  User,
  Clock,
  BarChart3,
  Plus,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  category: 'monthly' | 'quarterly' | 'annual' | 'event' | 'financial' | 'performance';
  type: 'pdf' | 'excel' | 'word';
  author: string;
  department: string;
  createdAt: string;
  fileSize: string;
  downloadCount: number;
  isPublic: boolean;
  tags: string[];
  fileName: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  report?: Report;
  onSuccess: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  mode,
  report,
  onSuccess
}) => {
  const { language, fontClass, fontDisplayClass } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'monthly',
    type: 'pdf',
    author: '',
    department: '',
    isPublic: true,
    tags: [] as string[],
    file: null as File | null
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (report && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: report.title,
        description: report.description,
        category: report.category,
        type: report.type,
        author: report.author,
        department: report.department,
        isPublic: report.isPublic,
        tags: [...report.tags],
        file: null
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'monthly',
        type: 'pdf',
        author: '',
        department: '',
        isPublic: true,
        tags: [],
        file: null
      });
    }
  }, [report, mode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
      
      // Auto-detect file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'pdf') {
        setFormData(prev => ({ ...prev, type: 'pdf' }));
      } else if (['xlsx', 'xls'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, type: 'excel' }));
      } else if (['doc', 'docx'].includes(extension || '')) {
        setFormData(prev => ({ ...prev, type: 'word' }));
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
      // Mock creating new report
      console.log('Creating new report:', formData);
    } else if (mode === 'edit' && report) {
      // Mock updating report
      console.log('Updating report:', report.id, formData);
    }
    
    onSuccess();
    onClose();
  };

  const handleDelete = () => {
    if (report && window.confirm(language === 'mr' ? 'क्या आप वाकई इस अहवाल को हटाना चाहते हैं?' : 'Are you sure you want to delete this report?')) {
      console.log('Deleting report:', report.id);
      onSuccess();
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel': return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'word': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm border-orange-200">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent ${fontDisplayClass}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            {mode === 'create' && (language === 'mr' ? 'नया अहवाल जोड़ें' : 'Add New Report')}
            {mode === 'edit' && (language === 'mr' ? 'अहवाल संपादित करें' : 'Edit Report')}
            {mode === 'view' && (language === 'mr' ? 'अहवाल विवरण' : 'Report Details')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <h3 className={`font-semibold mb-6 flex items-center gap-3 text-blue-800 ${fontDisplayClass}`}>
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                {language === 'mr' ? 'मूलभूत माहिती' : 'Basic Information'}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className={`text-blue-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'शीर्षक *' : 'Title *'}
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={mode === 'view'}
                    required
                    className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder={language === 'mr' ? 'अहवालाचे शीर्षक दर्ज करा...' : 'Enter report title...'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className={`text-blue-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'वर्णन *' : 'Description *'}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={mode === 'view'}
                    rows={4}
                    required
                    className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                    placeholder={language === 'mr' ? 'अहवालाचे तपशीलवार वर्णन दर्ज करा...' : 'Enter detailed description...'}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className={`text-blue-800 font-medium ${fontClass}`}>
                      {language === 'mr' ? 'श्रेणी *' : 'Category *'}
                    </Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">{language === 'mr' ? 'मासिक अहवाल' : 'Monthly Report'}</SelectItem>
                        <SelectItem value="quarterly">{language === 'mr' ? 'त्रैमासिक अहवाल' : 'Quarterly Report'}</SelectItem>
                        <SelectItem value="annual">{language === 'mr' ? 'वार्षिक अहवाल' : 'Annual Report'}</SelectItem>
                        <SelectItem value="event">{language === 'mr' ? 'कार्यक्रम अहवाल' : 'Event Report'}</SelectItem>
                        <SelectItem value="financial">{language === 'mr' ? 'आर्थिक अहवाल' : 'Financial Report'}</SelectItem>
                        <SelectItem value="performance">{language === 'mr' ? 'कामगिरी अहवाल' : 'Performance Report'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className={`text-blue-800 font-medium ${fontClass}`}>
                      {language === 'mr' ? 'फाइल प्रकार' : 'File Type'}
                    </Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger className="mt-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="word">Word</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author and Department Information */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <h3 className={`font-semibold mb-6 flex items-center gap-3 text-green-800 ${fontDisplayClass}`}>
                <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                {language === 'mr' ? 'लेखक आणि विभाग माहिती' : 'Author & Department Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="author" className={`text-green-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'लेखक *' : 'Author *'}
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    disabled={mode === 'view'}
                    required
                    className="mt-2 border-green-200 focus:border-green-400 focus:ring-green-400"
                    placeholder={language === 'mr' ? 'लेखकाचे नाव दर्ज करा...' : 'Enter author name...'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="department" className={`text-green-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'विभाग *' : 'Department *'}
                  </Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger className="mt-2 border-green-200 focus:border-green-400 focus:ring-green-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="संगठन">{language === 'mr' ? 'संगठन' : 'Organization'}</SelectItem>
                      <SelectItem value="वित्त">{language === 'mr' ? 'वित्त' : 'Finance'}</SelectItem>
                      <SelectItem value="कार्यक्रम">{language === 'mr' ? 'कार्यक्रम' : 'Programs'}</SelectItem>
                      <SelectItem value="प्रशासन">{language === 'mr' ? 'प्रशासन' : 'Administration'}</SelectItem>
                      <SelectItem value="माध्यम">{language === 'mr' ? 'माध्यम' : 'Media'}</SelectItem>
                      <SelectItem value="सदस्यत्व">{language === 'mr' ? 'सदस्यत्व' : 'Membership'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          {mode !== 'view' && (
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="pt-6">
                <h3 className={`font-semibold mb-6 flex items-center gap-3 text-purple-800 ${fontDisplayClass}`}>
                  <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  {language === 'mr' ? 'फाइल अपलोड' : 'File Upload'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file" className={`text-purple-800 font-medium ${fontClass}`}>
                      {language === 'mr' ? 'अहवाल फाइल' : 'Report File'}
                    </Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="mt-2 cursor-pointer border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                    <p className={`text-xs text-purple-600 mt-2 ${fontClass}`}>
                      {language === 'mr' ? 'समर्थित फाइल प्रकार: PDF, DOC, DOCX, XLS, XLSX (अधिकतम 10MB)' : 'Supported file types: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)'}
                    </p>
                  </div>
                  
                  {formData.file && (
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      {getFileIcon(formData.type)}
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-purple-800 ${fontClass}`}>{formData.file.name}</p>
                        <p className={`text-xs text-purple-600 ${fontClass}`}>
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags and Settings */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <h3 className={`font-semibold mb-6 flex items-center gap-3 text-orange-800 ${fontDisplayClass}`}>
                <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Tag className="h-4 w-4 text-white" />
                </div>
                {language === 'mr' ? 'टॅग आणि सेटिंग्ज' : 'Tags & Settings'}
              </h3>
              
              <div className="space-y-6">
                <div>
                  <Label className={`text-orange-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'टॅग' : 'Tags'}
                  </Label>
                  {mode !== 'view' && (
                    <div className="flex gap-3 mt-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder={language === 'mr' ? 'टॅग जोडा...' : 'Add tag...'}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        className="flex-1 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                      <Button type="button" onClick={handleAddTag} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Plus className="h-4 w-4 mr-1" />
                        {language === 'mr' ? 'जोडा' : 'Add'}
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className={`text-xs rounded-lg border-orange-300 text-orange-700 bg-orange-50 ${fontClass}`}>
                        {tag}
                        {mode !== 'view' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-red-500 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    disabled={mode === 'view'}
                    className="w-4 h-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500"
                  />
                  <Label htmlFor="isPublic" className={`text-orange-800 font-medium ${fontClass}`}>
                    {language === 'mr' ? 'सार्वजनिक अहवाल (सर्वांसाठी उपलब्ध)' : 'Public Report (Available to all)'}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Information */}
          {mode === 'view' && report && (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <h3 className={`font-semibold mb-6 flex items-center gap-3 text-gray-800 ${fontDisplayClass}`}>
                  <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  {language === 'mr' ? 'अतिरिक्त माहिती' : 'Additional Information'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className={`text-gray-600 text-sm ${fontClass}`}>{language === 'mr' ? 'तयार केल्याची तारीख:' : 'Created Date:'}</p>
                      <p className={`font-medium text-gray-800 ${fontClass}`}>{new Date(report.createdAt).toLocaleString('hi-IN')}</p>
                    </div>
                    <div>
                      <p className={`text-gray-600 text-sm ${fontClass}`}>{language === 'mr' ? 'फाइल आकार:' : 'File Size:'}</p>
                      <p className={`font-medium text-gray-800 ${fontClass}`}>{report.fileSize}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-gray-600 text-sm ${fontClass}`}>{language === 'mr' ? 'डाउनलोड संख्या:' : 'Download Count:'}</p>
                      <p className={`font-medium text-gray-800 ${fontClass}`}>{report.downloadCount}</p>
                    </div>
                    <div>
                      <p className={`text-gray-600 text-sm ${fontClass}`}>{language === 'mr' ? 'फाइल नाव:' : 'File Name:'}</p>
                      <p className={`font-medium text-gray-800 ${fontClass}`}>{report.fileName}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            {mode === 'view' && (
              <>
                <Button type="button" variant="outline" onClick={() => {}} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  {language === 'mr' ? 'संपादित करें' : 'Edit'}
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  {language === 'mr' ? 'हटाएं' : 'Delete'}
                </Button>
              </>
            )}
            {mode !== 'view' && (
              <>
                <Button type="button" variant="outline" onClick={onClose} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                  {language === 'mr' ? 'रद्द करें' : 'Cancel'}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg">
                  {mode === 'create' ? (language === 'mr' ? 'सबमिट करें' : 'Submit') : (language === 'mr' ? 'अपडेट करें' : 'Update')}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 