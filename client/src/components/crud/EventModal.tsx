import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { Event } from '../../lib/mockData';
import { eventCRUD } from '../../lib/crudOperations';
import { Calendar, MapPin, Users, User, FileText, Save, X, Trash2, Edit } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view';
  event?: Event;
  onSuccess: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  mode,
  event,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'offline' as 'online' | 'offline' | 'hybrid',
    venue: '',
    eventDate: '',
    endDate: '',
    maxAttendees: 100,
    meetingLink: '',
    organizer: '',
    constituency: '',
    district: '',
    category: ''
  });

  useEffect(() => {
    if (event && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        venue: event.venue,
        eventDate: event.eventDate.split('T')[0],
        endDate: event.endDate.split('T')[0],
        maxAttendees: event.maxAttendees,
        meetingLink: event.meetingLink || '',
        organizer: event.organizer,
        constituency: event.constituency,
        district: event.district,
        category: event.category
      });
    } else {
      setFormData({
        title: '',
        description: '',
        eventType: 'offline',
        venue: '',
        eventDate: '',
        endDate: '',
        maxAttendees: 100,
        meetingLink: '',
        organizer: '',
        constituency: '',
        district: '',
        category: ''
      });
    }
  }, [event, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'create') {
             const newEvent = eventCRUD.create({
         title: formData.title,
         description: formData.description,
         eventType: formData.eventType,
         venue: formData.venue,
         eventDate: new Date(formData.eventDate).toISOString(),
         endDate: new Date(formData.endDate).toISOString(),
         maxAttendees: formData.maxAttendees,
         currentAttendees: 0,
         meetingLink: formData.meetingLink || undefined,
         organizer: formData.organizer,
         constituency: formData.constituency,
         district: formData.district,
         category: formData.category,
         status: 'draft',
         attendees: []
       });
    } else if (mode === 'edit' && event) {
      eventCRUD.update(event.id, {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        venue: formData.venue,
        eventDate: new Date(formData.eventDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        maxAttendees: formData.maxAttendees,
        meetingLink: formData.meetingLink || undefined,
        organizer: formData.organizer,
        constituency: formData.constituency,
        district: event.district,
        category: formData.category
      });
    }
    
    onSuccess();
    onClose();
  };

  const handleDelete = () => {
    if (event) {
      eventCRUD.delete(event.id);
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-4 border-orange-400 rounded-3xl bg-orange-50 shadow-2xl z-[9999] relative">
        <DialogHeader className="bg-gradient-to-r from-orange-300 to-amber-300 rounded-t-3xl p-6 border-b-4 border-orange-400 sticky top-0 z-10">
          <DialogTitle className="text-2xl font-bold text-orange-900 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-orange-700" />
            {mode === 'create' && t.events.addNew}
            {mode === 'edit' && t.common.edit}
            {mode === 'view' && t.events.details}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-orange-50 relative z-20">
          {/* Basic Information */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <FileText className="h-5 w-5 text-orange-700" />
              मूलभूत जानकारी
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-orange-900 font-bold text-base">{t.events.title} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={mode === 'view'}
                  placeholder="कार्यक्रमाचे शीर्षक"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="eventType" className="text-orange-900 font-bold text-base">{t.events.type} *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value: 'online' | 'offline' | 'hybrid') => 
                    setFormData({ ...formData, eventType: value })
                  }
                  disabled={mode === 'view'}
                >
                  <SelectTrigger className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-3 border-orange-400 z-[9999]">
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="eventDate" className="text-orange-900 font-bold text-base">{t.events.date} *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  disabled={mode === 'view'}
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endDate" className="text-orange-900 font-bold text-base">समाप्ती तारीख *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={mode === 'view'}
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
            </div>
          </div>

          {/* Location and Organizer */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <MapPin className="h-5 w-5 text-orange-700" />
              स्थान आणि आयोजक
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="venue" className="text-orange-900 font-bold text-base">{t.events.venue} *</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  disabled={mode === 'view'}
                  placeholder="कार्यक्रमाचे स्थान"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="organizer" className="text-orange-900 font-bold text-base">आयोजक *</Label>
                <Input
                  id="organizer"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  disabled={mode === 'view'}
                  placeholder="आयोजकाचे नाव"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="constituency" className="text-orange-900 font-bold text-base">{t.members.constituency} *</Label>
                <Input
                  id="constituency"
                  value={formData.constituency}
                  onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                  disabled={mode === 'view'}
                  placeholder="मतदारसंघ"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="maxAttendees" className="text-orange-900 font-bold text-base">कमाल सहभागी *</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) })}
                  disabled={mode === 'view'}
                  placeholder="100"
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
              <FileText className="h-5 w-5 text-orange-700" />
              वर्णन
            </h3>
            <div>
              <Label htmlFor="description" className="text-orange-900 font-bold text-base">{t.events.description} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={mode === 'view'}
                rows={4}
                placeholder="कार्यक्रमाचे तपशील..."
                className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                required
              />
            </div>
          </div>
          
          {/* Online Meeting Link */}
          {(formData.eventType === 'online' || formData.eventType === 'hybrid') && (
            <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
                <Calendar className="h-5 w-5 text-orange-700" />
                ऑनलाइन मीटिंग
              </h3>
              <div>
                <Label htmlFor="meetingLink" className="text-orange-900 font-bold text-base">{t.events.meetingLink}</Label>
                <Input
                  id="meetingLink"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  disabled={mode === 'view'}
                  placeholder="https://meet.google.com/..."
                  className="border-3 border-orange-400 focus:border-orange-600 focus:ring-orange-400 rounded-xl bg-white text-orange-900 font-medium"
                />
              </div>
            </div>
          )}
          
          {/* Status and Attendees (View Mode) */}
          {mode === 'view' && event && (
            <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-3xl border-4 border-orange-300 p-6 shadow-lg">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-900 text-lg">
                <Users className="h-5 w-5 text-orange-700" />
                स्थिती आणि सहभागी
              </h3>
              <div className="flex items-center gap-4">
                <Badge variant={
                  event.status === 'published' ? 'default' : 
                  event.status === 'draft' ? 'secondary' : 'destructive'
                } className="rounded-xl text-sm font-bold">
                  {event.status === 'published' ? t.events.published : 
                   event.status === 'draft' ? t.events.draft : t.events.cancelled}
                </Badge>
                <span className="text-sm text-orange-800 font-medium">
                  {event.currentAttendees}/{event.maxAttendees} {t.events.attendees}
                </span>
              </div>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-4 border-orange-400 bg-orange-50 sticky bottom-0 z-10">
            {mode === 'view' && event && (
              <>
                <Button type="button" variant="outline" onClick={() => {}} className="border-3 border-orange-500 text-orange-900 hover:bg-orange-200 rounded-xl bg-white font-bold">
                  <Edit className="h-4 w-4 mr-2" />
                  {t.common.edit}
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 rounded-xl font-bold">
                  <Trash2 className="h-4 w-4 mr-2" />
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
                <Button type="submit" className="bg-gradient-to-r from-orange-600 to-amber-700 hover:from-orange-700 hover:to-amber-800 text-white rounded-xl font-bold text-lg px-6 py-3">
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'कार्यक्रम जोड़ें' : 'अपडेट करें'}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 