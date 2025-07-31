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
  const { language, fontClass, fontDisplayClass } = useLanguage();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log('showFeedbackModal state changed to:', showFeedbackModal);
  }, [showFeedbackModal]);

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
    <div className={`bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 min-h-screen ${fontClass}`}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl p-6 sm:p-8 mb-8 border-4 border-orange-200 shadow-2xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-900 mb-3 ${fontDisplayClass}`}>
                {language === 'mr' ? 'फीडबॅक आणि सूचना' : 'Feedback & Suggestions'}
              </h1>
              <p className={`text-lg sm:text-xl text-orange-800 ${fontClass}`}>
                {language === 'mr' ? 'सदस्यांकडून फीडबॅक आणि सूचना प्राप्त करा' : 'Receive feedback and suggestions from members'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => {
                  console.log('Button clicked, setting showFeedbackModal to true');
                  setShowFeedbackModal(true);
                  console.log('showFeedbackModal is now:', true);
                }}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="h-6 w-6 mr-3" />
                {language === 'mr' ? 'नवीन फीडबॅक' : 'New Feedback'}
              </Button>
              <Button 
                variant="outline"
                className="border-3 border-orange-400 text-orange-700 hover:bg-orange-100 text-lg font-bold px-6 py-4 rounded-2xl transition-all duration-300"
              >
                <Filter className="h-5 w-5 mr-2" />
                {language === 'mr' ? 'फिल्टर' : 'Filter'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl border-4 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-base font-bold text-orange-900 ${fontClass}`}>
                {language === 'mr' ? 'एकूण फीडबॅक' : 'Total Feedback'}
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold text-orange-800 ${fontDisplayClass}`}>{feedbacks.length}</div>
              <p className={`text-sm text-orange-700 ${fontClass}`}>
                {language === 'mr' ? 'सर्व फीडबॅक' : 'All Feedback'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl border-4 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-base font-bold text-yellow-900 ${fontClass}`}>
                {language === 'mr' ? 'प्रलंबित' : 'Pending'}
              </CardTitle>
              <Clock className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold text-yellow-800 ${fontDisplayClass}`}>
                {feedbacks.filter(f => f.status === 'pending').length}
              </div>
              <p className={`text-sm text-yellow-700 ${fontClass}`}>
                {language === 'mr' ? 'प्रतिसादाची वाट' : 'Awaiting Response'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border-4 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-base font-bold text-blue-900 ${fontClass}`}>
                {language === 'mr' ? 'प्रगतीत' : 'In Progress'}
              </CardTitle>
              <Loader2 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold text-blue-800 ${fontDisplayClass}`}>
                {feedbacks.filter(f => f.status === 'in_progress').length}
              </div>
              <p className={`text-sm text-blue-700 ${fontClass}`}>
                {language === 'mr' ? 'प्रक्रियेत' : 'In Process'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-4 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className={`text-base font-bold text-green-900 ${fontClass}`}>
                {language === 'mr' ? 'समाधान' : 'Resolved'}
              </CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold text-green-800 ${fontDisplayClass}`}>
                {feedbacks.filter(f => f.status === 'resolved').length}
              </div>
              <p className={`text-sm text-green-700 ${fontClass}`}>
                {language === 'mr' ? 'समाधान झाले' : 'Completed'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-4 border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-600" />
                  <Input
                    placeholder={language === 'mr' ? "फीडबैक खोजें..." : "Search feedback..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 py-4 text-lg border-3 border-orange-300 focus:border-orange-500 focus:ring-orange-400 rounded-xl bg-white"
                  />
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-4 border-3 border-orange-300 rounded-xl bg-white text-orange-900 font-medium text-lg focus:border-orange-500 focus:ring-orange-400"
              >
                <option value="all">{language === 'mr' ? 'सभी स्थिति' : 'All Status'}</option>
                <option value="pending">{language === 'mr' ? 'लंबित' : 'Pending'}</option>
                <option value="in_progress">{language === 'mr' ? 'प्रगति में' : 'In Progress'}</option>
                <option value="resolved">{language === 'mr' ? 'समाधान' : 'Resolved'}</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-4 border-3 border-orange-300 rounded-xl bg-white text-orange-900 font-medium text-lg focus:border-orange-500 focus:ring-orange-400"
              >
                <option value="all">{language === 'mr' ? 'सभी श्रेणी' : 'All Categories'}</option>
                <option value="event_feedback">{language === 'mr' ? 'कार्यक्रम फीडबैक' : 'Event Feedback'}</option>
                <option value="technical_issue">{language === 'mr' ? 'तकनीकी समस्या' : 'Technical Issue'}</option>
                <option value="meeting_request">{language === 'mr' ? 'बैठक अनुरोध' : 'Meeting Request'}</option>
                <option value="suggestion">{language === 'mr' ? 'सुझाव' : 'Suggestion'}</option>
                <option value="complaint">{language === 'mr' ? 'शिकायत' : 'Complaint'}</option>
                <option value="appreciation">{language === 'mr' ? 'सराहना' : 'Appreciation'}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <Card key={feedback.id} className="bg-gradient-to-r from-white to-orange-50 rounded-2xl border-4 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl border-2 border-orange-300">
                      {getCategoryIcon(feedback.category)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-xl text-orange-900 mb-2 ${fontDisplayClass}`}>{feedback.subject}</h3>
                      <p className={`text-base text-orange-700 ${fontClass}`}>
                        {language === 'mr' ? 'द्वारा:' : 'By:'} {feedback.memberName} | {feedback.userType || (language === 'mr' ? 'सदस्य' : 'Member')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(feedback.status)} className="text-sm font-bold px-4 py-2 rounded-xl">
                      {feedback.status === 'resolved' ? (language === 'mr' ? 'समाधान' : 'Resolved') :
                       feedback.status === 'in_progress' ? (language === 'mr' ? 'प्रगति में' : 'In Progress') : 
                       (language === 'mr' ? 'लंबित' : 'Pending')}
                    </Badge>
                    <span className={`text-sm text-orange-600 font-medium ${fontClass}`}>
                      {new Date(feedback.createdAt).toLocaleDateString(language === 'mr' ? 'hi-IN' : 'en-IN')}
                    </span>
                  </div>
                </div>
                
                <p className={`text-orange-800 mb-6 line-clamp-3 text-lg leading-relaxed ${fontClass}`}>{feedback.message}</p>
                
                <div className="flex justify-between items-center pt-4 border-t-2 border-orange-200">
                  <div className="flex items-center gap-4">
                    <span className={`text-orange-700 font-medium ${fontClass}`}>
                      {language === 'mr' ? 'श्रेणी:' : 'Category:'} {feedback.category}
                    </span>
                    {feedback.priority && (
                      <span className={`px-3 py-2 rounded-xl text-sm font-bold ${
                        feedback.priority === 'urgent' ? 'bg-red-100 text-red-800 border-2 border-red-300' :
                        feedback.priority === 'high' ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' :
                        feedback.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                        'bg-green-100 text-green-800 border-2 border-green-300'
                      }`}>
                        {feedback.priority === 'urgent' ? (language === 'mr' ? 'अत्यावश्यक' : 'Urgent') :
                         feedback.priority === 'high' ? (language === 'mr' ? 'उच्च' : 'High') :
                         feedback.priority === 'medium' ? (language === 'mr' ? 'मध्यम' : 'Medium') : 
                         (language === 'mr' ? 'सामान्य' : 'Normal')}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleViewFeedback(feedback)}
                      className="border-3 border-orange-400 text-orange-700 hover:bg-orange-100 font-bold rounded-xl px-6 py-3"
                    >
                      {language === 'mr' ? 'विवरण देखें' : 'View Details'}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleEditFeedback(feedback)}
                      className="border-3 border-blue-400 text-blue-700 hover:bg-blue-100 font-bold rounded-xl px-6 py-3"
                    >
                      {language === 'mr' ? 'संपादित करें' : 'Edit'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredFeedbacks.length === 0 && (
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-4 border-orange-200 shadow-lg">
              <CardContent className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-orange-400 mx-auto mb-6" />
                <p className={`text-orange-700 text-xl font-bold ${fontClass}`}>
                  {language === 'mr' ? 'कोई फीडबैक नहीं मिली' : 'No feedback found'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => {
          console.log('Modal closing, setting showFeedbackModal to false');
          setShowFeedbackModal(false);
        }}
        mode="create"
        feedback={undefined}
        onSuccess={refreshData}
      />
      

    </div>
  );
} 