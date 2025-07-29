import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LanguageToggle } from '../components/ui/language-toggle';
import { useLanguage } from '../hooks/useLanguage';
import { 
  Users, 
  Calendar, 
  Bell, 
  Award, 
  MapPin, 
  TrendingUp, 
  MessageSquare, 
  Camera,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react';
import { 
  mockDashboardStats, 
  mockMembers, 
  mockEvents, 
  mockNotices, 
  mockLeadership,
  mockFeedback,
  mockEventPhotos,
  type Member,
  type Event,
  type Notice,
  type Leadership
} from '../lib/mockData';
import { memberCRUD, eventCRUD, noticeCRUD } from '../lib/crudOperations';
import { MemberModal } from '../components/crud/MemberModal';
import { EventModal } from '../components/crud/EventModal';
import bjpSymbol from '../assets/bjp-symbol.png';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  
  // Modal states
  const [memberModal, setMemberModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    member?: Member;
  }>({ isOpen: false, mode: 'create' });
  
  const [eventModal, setEventModal] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'view';
    event?: Event;
  }>({ isOpen: false, mode: 'create' });
  
  // Search states
  const [memberSearch, setMemberSearch] = useState('');
  const [eventSearch, setEventSearch] = useState('');
  const [noticeSearch, setNoticeSearch] = useState('');
  
  // Filtered data
  const filteredMembers = memberSearch 
    ? memberCRUD.search(memberSearch)
    : members;
  
  const filteredEvents = eventSearch
    ? eventCRUD.search(eventSearch)
    : events;
  
  const filteredNotices = noticeSearch
    ? noticeCRUD.search(noticeSearch)
    : notices;
  
  // Refresh data
  const refreshData = () => {
    setMembers([...memberCRUD.readAll()]);
    setEvents([...eventCRUD.readAll()]);
    setNotices([...noticeCRUD.readAll()]);
  };

  const stats = {
    totalMembers: mockDashboardStats.totalMembers,
    newMembers: 156, // Mock value for new members this month
    activeEvents: mockDashboardStats.activeEvents,
    totalNotices: mockDashboardStats.totalNotices,
    newNotices: 12, // Mock value for new notices
    totalFeedback: mockFeedback.length,
    newFeedback: 5 // Mock value for new feedback
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
                डॅशबोर्ड
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                महाराष्ट्र BJP संघटना - केंद्रीय नियंत्रण कक्ष
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button 
                onClick={refreshData}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                रिफ्रेश करा
              </Button>
              <Button 
                variant="outline"
                className="text-orange-600 border-orange-200 hover:bg-orange-50 text-xs sm:text-sm"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                सेटिंग्ज
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण सदस्य</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +{stats.newMembers} या महिन्यात
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">सक्रिय कार्यक्रम</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.activeEvents}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                या आठवड्यात
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण सूचना</CardTitle>
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.totalNotices}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +{stats.newNotices} नवीन
              </p>
            </CardContent>
          </Card>
          
          <Card className="saffron-hover-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">एकूण फीडबॅक</CardTitle>
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-purple-600">{stats.totalFeedback}</div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                +{stats.newFeedback} नवीन
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="members">{t.navigation.members}</TabsTrigger>
            <TabsTrigger value="events">{t.navigation.events}</TabsTrigger>
            <TabsTrigger value="notices">{t.navigation.notices}</TabsTrigger>
            <TabsTrigger value="leadership">{t.navigation.leadership}</TabsTrigger>
            <TabsTrigger value="feedback">{t.navigation.feedback}</TabsTrigger>
            <TabsTrigger value="photos">{t.navigation.photos}</TabsTrigger>
          </TabsList>

                    {/* Members Tab */}
          <TabsContent value="members" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.members.title}</h2>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setMemberModal({ isOpen: true, mode: 'create' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.members.addNew}
              </Button>
      </div>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={t.members.search}
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t.members.filter}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {member.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{member.fullName}</CardTitle>
                        <CardDescription>{member.designation}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {member.constituency}, {member.district}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {member.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {member.contactInfo.email}
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={member.isVerified ? "default" : "secondary"}>
                          {member.isVerified ? t.members.verified : t.members.unverified}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setMemberModal({ isOpen: true, mode: 'view', member })}
                        >
                          {t.members.viewDetails}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.events.title}</h2>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setEventModal({ isOpen: true, mode: 'create' })}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.events.addNew}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription>{event.description}</CardDescription>
                      </div>
                                             <Badge variant={
                         event.status === 'published' ? 'default' : 
                         event.status === 'draft' ? 'secondary' : 'destructive'
                       }>
                         {event.status === 'published' ? t.events.published : 
                          event.status === 'draft' ? t.events.draft : t.events.cancelled}
                       </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(event.eventDate).toLocaleDateString('hi-IN')}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {event.venue}
                      </div>
                                             <div className="flex items-center text-sm">
                         <Users className="h-4 w-4 mr-2 text-gray-400" />
                         {event.currentAttendees}/{event.maxAttendees} {t.events.attendees}
                       </div>
                      {event.meetingLink && (
                                                 <div className="flex items-center text-sm">
                           <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                           <a href={event.meetingLink} className="text-blue-600 hover:underline">
                             {t.events.meetingLink}
                           </a>
                         </div>
                      )}
                                             <div className="flex gap-2">
                         <Button size="sm" className="flex-1">{t.events.rsvp}</Button>
                         <Button 
                           size="sm" 
                           variant="outline"
                           onClick={() => setEventModal({ isOpen: true, mode: 'view', event })}
                         >
                           {t.events.details}
                         </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Notices Tab */}
          <TabsContent value="notices" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.notices.title}</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.notices.addNew}
              </Button>
            </div>

            <div className="space-y-4">
              {mockNotices.map((notice) => (
                <Card key={notice.id} className={`hover:shadow-lg transition-shadow ${
                  notice.isPinned ? 'border-orange-500 border-2' : ''
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{notice.title}</CardTitle>
                                                     {notice.isPinned && (
                             <Badge variant="destructive">{t.notices.pinned}</Badge>
                           )}
                        </div>
                        <CardDescription>{notice.content}</CardDescription>
                      </div>
                                             <Badge variant={
                         notice.priority === 'urgent' ? 'destructive' :
                         notice.priority === 'high' ? 'default' :
                         notice.priority === 'medium' ? 'secondary' : 'outline'
                       }>
                         {notice.priority === 'urgent' ? t.notices.urgent :
                          notice.priority === 'high' ? t.notices.high :
                          notice.priority === 'medium' ? t.notices.medium : t.notices.low}
                       </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                                         <div className="flex justify-between items-center text-sm text-gray-600">
                       <span>{t.notices.author}: {notice.author}</span>
                       <span>{t.notices.category}: {notice.category}</span>
                       <span>{t.notices.expiry}: {new Date(notice.expiryDate).toLocaleDateString('hi-IN')}</span>
                     </div>
                    {notice.attachments.length > 0 && (
                                             <div className="mt-3">
                         <p className="text-sm font-medium mb-2">{t.notices.attachments}:</p>
                         <div className="flex gap-2">
                           {notice.attachments.map((attachment, index) => (
                             <Button key={index} variant="outline" size="sm">
                               <ExternalLink className="h-3 w-3 mr-1" />
                               {t.notices.file} {index + 1}
                             </Button>
                           ))}
                         </div>
                       </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leadership Tab */}
          <TabsContent value="leadership" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.leadership.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockLeadership.map((leader) => (
                <Card key={leader.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-200">
                        <img 
                          src={leader.profileImage} 
                          alt={leader.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center hidden">
                          <span className="text-orange-600 font-semibold text-lg">
                            {leader.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{leader.name}</CardTitle>
                        <CardDescription className="text-base">{leader.position}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">{leader.bio}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-2">{t.leadership.achievements}:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                          {leader.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">{t.leadership.contact}:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {leader.contactInfo.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {leader.contactInfo.phone}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {leader.socialMediaHandles.whatsapp && (
                          <Button size="sm" variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Phone className="h-4 w-4 mr-1" />
                            {t.leadership.whatsapp}
                          </Button>
                        )}
                        {leader.socialMediaHandles.twitter && (
                          <Button size="sm" variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            {t.leadership.twitter}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.feedback.title}</h2>
            </div>

            <div className="space-y-4">
              {mockFeedback.map((feedback) => (
                <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                        <CardDescription>{t.feedback.by}: {feedback.memberName}</CardDescription>
                      </div>
                                             <Badge variant={
                         feedback.status === 'resolved' ? 'default' :
                         feedback.status === 'in_progress' ? 'secondary' : 'outline'
                       }>
                         {feedback.status === 'resolved' ? t.feedback.resolved :
                          feedback.status === 'in_progress' ? t.feedback.inProgress : t.feedback.pending}
                       </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feedback.message}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{t.feedback.category}: {feedback.category}</span>
                      <span>{new Date(feedback.createdAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                    {feedback.response && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold text-sm mb-1">{t.feedback.response}:</p>
                        <p className="text-sm text-gray-600">{feedback.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{t.photos.title}</h2>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                {t.photos.upload}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEventPhotos.map((photo) => (
                <Card key={photo.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{photo.eventName}</h3>
                    <p className="text-sm text-gray-600 mb-3">{photo.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {photo.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{t.feedback.by}: {photo.uploadedBy}</span>
                      <span>{new Date(photo.uploadedAt).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CRUD Modals */}
      <MemberModal
        isOpen={memberModal.isOpen}
        onClose={() => setMemberModal({ isOpen: false, mode: 'create' })}
        mode={memberModal.mode}
        member={memberModal.member}
        onSuccess={refreshData}
      />
      
      <EventModal
        isOpen={eventModal.isOpen}
        onClose={() => setEventModal({ isOpen: false, mode: 'create' })}
        mode={eventModal.mode}
        event={eventModal.event}
        onSuccess={refreshData}
      />
    </div>
  );
};

export default Dashboard;
