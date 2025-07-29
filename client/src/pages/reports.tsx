import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useLanguage } from '../hooks/useLanguage';
import { ReportModal } from '../components/crud/ReportModal';
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  User,
  Building,
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

// Mock data for reports
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

const mockReports: Report[] = [
  {
    id: "1",
    title: "महाराष्ट्र BJP मासिक गतिविधी अहवाल - जुलै 2025",
    description: "जुलै महिन्यातील सर्व पक्षीय गतिविधी, सदस्यत्व वाढ, आणि कार्यक्रमांचा तपशीलवार अहवाल",
    category: "monthly",
    type: "pdf",
    author: "संगठन विभाग",
    department: "संगठन",
    createdAt: "2025-07-28T10:00:00Z",
    fileSize: "2.4 MB",
    downloadCount: 156,
    isPublic: true,
    tags: ["गतिविधी", "मासिक", "सदस्यत्व"],
    fileName: "monthly_activity_report_july_2025.pdf"
  },
  {
    id: "2", 
    title: "त्रैमासिक वित्तीय अहवाल Q2 2025",
    description: "दुसऱ्या तिमाहीतील आर्थिक व्यवहार, खर्च विश्लेषण आणि बजेट अंमलबजावणी",
    category: "quarterly",
    type: "excel",
    author: "वित्त विभाग",
    department: "वित्त",
    createdAt: "2025-07-25T15:30:00Z",
    fileSize: "1.8 MB",
    downloadCount: 89,
    isPublic: false,
    tags: ["वित्त", "त्रैमासिक", "बजेट"],
    fileName: "quarterly_financial_report_q2_2025.xlsx"
  },
  {
    id: "3",
    title: "कार्यकर्ता सम्मेलन 2025 - कार्यक्रम अहवाल",
    description: "राज्यव्यापी कार्यकर्ता सम्मेलनाचा संपूर्ण अहवाल, सहभागी संख्या आणि फीडबॅक",
    category: "event",
    type: "pdf",
    author: "कार्यक्रम समिती",
    department: "कार्यक्रम",
    createdAt: "2025-07-20T09:15:00Z",
    fileSize: "3.1 MB",
    downloadCount: 234,
    isPublic: true,
    tags: ["कार्यक्रम", "सम्मेलन", "कार्यकर्ता"],
    fileName: "worker_conference_2025_report.pdf"
  },
  {
    id: "4",
    title: "वार्षिक कामगिरी अहवाल 2024-25",
    description: "गेल्या वर्षभराची संपूर्ण कामगिरी, उपलब्धी आणि भविष्याची योजना",
    category: "annual",
    type: "pdf",
    author: "मुख्य कार्यकारी अधिकारी",
    department: "प्रशासन",
    createdAt: "2025-07-15T14:20:00Z",
    fileSize: "5.2 MB",
    downloadCount: 312,
    isPublic: true,
    tags: ["वार्षिक", "कामगिरी", "उपलब्धी"],
    fileName: "annual_performance_report_2024_25.pdf"
  },
  {
    id: "5",
    title: "डिजिटल अभियान मॅट्रिक्स अहवाल",
    description: "सोशल मीडिया पोहोच, ऑनलाइन सहभाग आणि डिजिटल कॅम्पेनची प्रभावशीलता",
    category: "performance",
    type: "excel",
    author: "डिजिटल टीम",
    department: "माध्यम",
    createdAt: "2025-07-22T11:45:00Z",
    fileSize: "1.2 MB",
    downloadCount: 67,
    isPublic: false,
    tags: ["डिजिटल", "सोशल मीडिया", "मॅट्रिक्स"],
    fileName: "digital_campaign_metrics_july_2025.xlsx"
  },
  {
    id: "6",
    title: "मतदारसंघ-निहाय सदस्यत्व विश्लेषण",
    description: "सर्व 288 मतदारसंघांमधील सदस्यत्वाची संख्या, वाढीचा दर आणि लक्ष्य गाठण्याचे विश्लेषण",
    category: "monthly",
    type: "pdf",
    author: "सदस्यत्व विभाग",
    department: "संगठन",
    createdAt: "2025-07-18T16:10:00Z",
    fileSize: "2.8 MB",
    downloadCount: 145,
    isPublic: true,
    tags: ["सदस्यत्व", "मतदारसंघ", "विश्लेषण"],
    fileName: "constituency_membership_analysis_july_2025.pdf"
  }
];

export default function Reports() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(report => report.department === departmentFilter);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, categoryFilter, departmentFilter]);

  const handleCreateNew = () => {
    setSelectedReport(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDownload = (report: Report) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = `/api/reports/download/${report.id}`;
    link.download = report.fileName;
    document.body.appendChild(link);
    link.click();
    
    // Safely remove the link element
    try {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    } catch (error) {
      console.warn('Failed to remove download link:', error);
    }
    
    // Update download count
    setReports(prev => prev.map(r => 
      r.id === report.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
    ));
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'monthly': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quarterly': return 'bg-green-100 text-green-800 border-green-200';
      case 'annual': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'event': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'financial': return 'bg-red-100 text-red-800 border-red-200';
      case 'performance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'excel': return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'word': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const stats = {
    total: reports.length,
    monthly: reports.filter(r => r.category === 'monthly').length,
    quarterly: reports.filter(r => r.category === 'quarterly').length,
    annual: reports.filter(r => r.category === 'annual').length,
    totalDownloads: reports.reduce((sum, r) => sum + r.downloadCount, 0)
  };

  return (
    <div className="container mx-auto p-6 relative z-10">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full blur-2xl"></div>
      </div>
      
      {/* Header */}
      <div className="mb-8 saffron-3d-card rounded-xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              अहवाल प्रबंधन
            </h1>
            <p className="text-gray-600">
              सर्व अधिकृत अहवाल आणि दस्तऐवज व्यवस्थापन
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            नवा अहवाल जोडा
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="saffron-hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">एकूण अहवाल</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card className="saffron-hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">मासिक अहवाल</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.monthly}</div>
          </CardContent>
        </Card>
        
        <Card className="saffron-hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">त्रैमासिक अहवाल</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.quarterly}</div>
          </CardContent>
        </Card>
        
        <Card className="saffron-hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">वार्षिक अहवाल</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.annual}</div>
          </CardContent>
        </Card>
        
        <Card className="saffron-hover-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">एकूण डाउनलोड</CardTitle>
            <Download className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalDownloads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="अहवाल शोधा..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">सर्व श्रेणी</option>
              <option value="monthly">मासिक</option>
              <option value="quarterly">त्रैमासिक</option>
              <option value="annual">वार्षिक</option>
              <option value="event">कार्यक्रम</option>
              <option value="financial">आर्थिक</option>
              <option value="performance">कामगिरी</option>
            </select>
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">सर्व विभाग</option>
              <option value="संगठन">संगठन</option>
              <option value="वित्त">वित्त</option>
              <option value="कार्यक्रम">कार्यक्रम</option>
              <option value="प्रशासन">प्रशासन</option>
              <option value="माध्यम">माध्यम</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(report.type)}
                  <Badge className={`text-xs ${getCategoryBadgeColor(report.category)}`}>
                    {report.category === 'monthly' ? 'मासिक' :
                     report.category === 'quarterly' ? 'त्रैमासिक' :
                     report.category === 'annual' ? 'वार्षिक' :
                     report.category === 'event' ? 'कार्यक्रम' :
                     report.category === 'financial' ? 'आर्थिक' :
                     'कामगिरी'}
                  </Badge>
                </div>
                {!report.isPublic && (
                  <Badge variant="secondary" className="text-xs">
                    खाजगी
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{report.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>{report.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-3 w-3" />
                  <span>{report.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(report.createdAt).toLocaleDateString('hi-IN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-3 w-3" />
                  <span>{report.downloadCount} डाउनलोड</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {report.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {report.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{report.tags.length - 3}
                  </Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewReport(report)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  पहा
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(report)}
                  className="flex-1"
                >
                  <Download className="h-3 w-3 mr-1" />
                  डाउनलोड
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditReport(report)}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="mt-2 text-xs text-gray-400 text-center">
                {report.fileSize} • {report.fileName}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">कोणतेही अहवाल सापडले नाहीत</p>
          </CardContent>
        </Card>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        report={selectedReport}
        onSuccess={() => {
          // Refresh reports list
          setReports([...mockReports]);
        }}
      />
    </div>
  );
} 