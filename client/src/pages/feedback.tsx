import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { useLanguage } from '../hooks/useLanguage';
import { feedbackCRUD } from '../lib/crudOperations';
import { FeedbackModal } from '../components/crud/FeedbackModal';
import { 
  MessageSquare, 
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bug,
  Calendar,
  Users,
  FileText,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { Feedback } from '../lib/mockData';

export default function FeedbackPage() {
  const { t } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(feedback => feedback.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(feedback => feedback.category === categoryFilter);
    }

    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchTerm, statusFilter, categoryFilter]);

  const refreshData = () => {
    setFeedbacks([...feedbackCRUD.readAll()]);
  };

  const handleCreateNew = () => {
    setSelectedFeedback(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
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

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    inProgress: feedbacks.filter(f => f.status === 'in_progress').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length
  };

  return (
    <div className="saffron-pattern-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto p-4 sm:p-6 relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 saffron-3d-card rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                फीडबॅक आणि सूचना
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                सदस्यांकडून फीडबॅक आणि सूचना प्राप्त करा
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={() => setShowFeedbackModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                नवीन फीडबॅक
              </Button>
              <Button 
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm"
              >
                <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                फिल्टर
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण फीडबॅक</CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{feedbacks.length}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                सर्व फीडबॅक
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">प्रलंबित</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                {feedbacks.filter(f => f.status === 'pending').length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                प्रतिसादाची वाट
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">प्रगतीत</CardTitle>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">
                {feedbacks.filter(f => f.status === 'in_progress').length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                प्रक्रियेत
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">समाधान</CardTitle>
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {feedbacks.filter(f => f.status === 'resolved').length}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                समाधान झाले
              </p>
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
                    placeholder="फीडबैक खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">सभी स्थिति</option>
                <option value="pending">लंबित</option>
                <option value="in_progress">प्रगति में</option>
                <option value="resolved">समाधान</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">सभी श्रेणी</option>
                <option value="event_feedback">कार्यक्रम फीडबैक</option>
                <option value="technical_issue">तकनीकी समस्या</option>
                <option value="meeting_request">बैठक अनुरोध</option>
                <option value="suggestion">सुझाव</option>
                <option value="complaint">शिकायत</option>
                <option value="appreciation">सराहना</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(feedback.category)}
                    <div>
                      <h3 className="font-semibold text-lg">{feedback.subject}</h3>
                      <p className="text-sm text-gray-600">
                        द्वारा: {feedback.memberName} | {feedback.userType || 'सदस्य'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(feedback.status)}>
                      {feedback.status === 'resolved' ? 'समाधान' :
                       feedback.status === 'in_progress' ? 'प्रगति में' : 'लंबित'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString('hi-IN')}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">{feedback.message}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>श्रेणी: {feedback.category}</span>
                    {feedback.priority && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feedback.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        feedback.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {feedback.priority === 'urgent' ? 'अत्यावश्यक' :
                         feedback.priority === 'high' ? 'उच्च' :
                         feedback.priority === 'medium' ? 'मध्यम' : 'सामान्य'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewFeedback(feedback)}
                    >
                      विवरण देखें
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditFeedback(feedback)}
                    >
                      संपादित करें
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredFeedbacks.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">कोई फीडबैक नहीं मिली</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        feedback={selectedFeedback}
        onSuccess={refreshData}
      />
    </div>
  );
} 