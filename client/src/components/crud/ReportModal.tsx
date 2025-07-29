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
  BarChart3
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
  const { t } = useLanguage();
  
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
    if (report && window.confirm('क्या आप वाकई इस अहवाल को हटाना चाहते हैं?')) {
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mode === 'create' && 'नया अहवाल जोड़ें'}
            {mode === 'edit' && 'अहवाल संपादित करें'}
            {mode === 'view' && 'अहवाल विवरण'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                मूलभूत माहिती
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">शीर्षक *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    disabled={mode === 'view'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">वर्णन *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={mode === 'view'}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">श्रेणी *</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">मासिक अहवाल</SelectItem>
                        <SelectItem value="quarterly">त्रैमासिक अहवाल</SelectItem>
                        <SelectItem value="annual">वार्षिक अहवाल</SelectItem>
                        <SelectItem value="event">कार्यक्रम अहवाल</SelectItem>
                        <SelectItem value="financial">आर्थिक अहवाल</SelectItem>
                        <SelectItem value="performance">कामगिरी अहवाल</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type">फाइल प्रकार</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                      disabled={mode === 'view'}
                    >
                      <SelectTrigger>
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
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                लेखक आणि विभाग माहिती
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">लेखक *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    disabled={mode === 'view'}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="department">विभाग *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={mode === 'view'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="संगठन">संगठन</SelectItem>
                      <SelectItem value="वित्त">वित्त</SelectItem>
                      <SelectItem value="कार्यक्रम">कार्यक्रम</SelectItem>
                      <SelectItem value="प्रशासन">प्रशासन</SelectItem>
                      <SelectItem value="माध्यम">माध्यम</SelectItem>
                      <SelectItem value="सदस्यत्व">सदस्यत्व</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          {mode !== 'view' && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  फाइल अपलोड
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file">अहवाल फाइल</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      समर्थित फाइल प्रकार: PDF, DOC, DOCX, XLS, XLSX (अधिकतम 10MB)
                    </p>
                  </div>
                  
                  {formData.file && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {getFileIcon(formData.type)}
                      <span className="text-sm">{formData.file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags and Settings */}
          <Card>
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                टॅग आणि सेटिंग्ज
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label>टॅग</Label>
                  {mode !== 'view' && (
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="टॅग जोडा..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        जोडा
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                        {mode !== 'view' && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    disabled={mode === 'view'}
                  />
                  <Label htmlFor="isPublic">सार्वजनिक अहवाल (सर्वांसाठी उपलब्ध)</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View Mode Information */}
          {mode === 'view' && report && (
            <Card>
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  अतिरिक्त माहिती
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">तयार केल्याची तारीख:</p>
                    <p className="font-medium">{new Date(report.createdAt).toLocaleString('hi-IN')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">फाइल आकार:</p>
                    <p className="font-medium">{report.fileSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">डाउनलोड संख्या:</p>
                    <p className="font-medium">{report.downloadCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">फाइल नाव:</p>
                    <p className="font-medium">{report.fileName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {mode === 'view' && (
              <>
                <Button type="button" variant="outline" onClick={() => {}}>
                  संपादित करें
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  हटाएं
                </Button>
              </>
            )}
            {mode !== 'view' && (
              <>
                <Button type="button" variant="outline" onClick={onClose}>
                  रद्द करें
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                  {mode === 'create' ? 'सबमिट करें' : 'अपडेट करें'}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 