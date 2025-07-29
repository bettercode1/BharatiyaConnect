import { mockMembers, mockEvents, mockNotices, mockFeedback, mockEventPhotos, mockReports, type Member, type Event, type Notice, type Feedback, type EventPhoto, type Report } from './mockData';

// CRUD Operations for Members
export const memberCRUD = {
  // Create new member
  create: (memberData: Omit<Member, 'id'>): Member => {
    const newMember: Member = {
      id: `member_${Date.now()}`,
      ...memberData,
      isVerified: false
    };
    mockMembers.push(newMember);
    return newMember;
  },

  // Read all members
  readAll: (): Member[] => {
    return mockMembers;
  },

  // Read member by ID
  readById: (id: string): Member | undefined => {
    return mockMembers.find(member => member.id === id);
  },

  // Update member
  update: (id: string, updates: Partial<Member>): Member | null => {
    const index = mockMembers.findIndex(member => member.id === id);
    if (index !== -1) {
      mockMembers[index] = { ...mockMembers[index], ...updates };
      return mockMembers[index];
    }
    return null;
  },

  // Delete member
  delete: (id: string): boolean => {
    const index = mockMembers.findIndex(member => member.id === id);
    if (index !== -1) {
      mockMembers.splice(index, 1);
      return true;
    }
    return false;
  },

  // Search members
  search: (query: string): Member[] => {
    const lowerQuery = query.toLowerCase();
    return mockMembers.filter(member =>
      member.fullName.toLowerCase().includes(lowerQuery) ||
      member.constituency.toLowerCase().includes(lowerQuery) ||
      member.district.toLowerCase().includes(lowerQuery) ||
      member.designation.toLowerCase().includes(lowerQuery)
    );
  }
};

// CRUD Operations for Events
export const eventCRUD = {
  // Create new event
  create: (eventData: Omit<Event, 'id'>): Event => {
    const newEvent: Event = {
      id: `event_${Date.now()}`,
      ...eventData,
      status: 'draft'
    };
    mockEvents.push(newEvent);
    return newEvent;
  },

  // Read all events
  readAll: (): Event[] => {
    return mockEvents;
  },

  // Read event by ID
  readById: (id: string): Event | undefined => {
    return mockEvents.find(event => event.id === id);
  },

  // Update event
  update: (id: string, updates: Partial<Event>): Event | null => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents[index] = { ...mockEvents[index], ...updates };
      return mockEvents[index];
    }
    return null;
  },

  // Delete event
  delete: (id: string): boolean => {
    const index = mockEvents.findIndex(event => event.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
      return true;
    }
    return false;
  },

  // Search events
  search: (query: string): Event[] => {
    const lowerQuery = query.toLowerCase();
    return mockEvents.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.venue.toLowerCase().includes(lowerQuery)
    );
  }
};

// CRUD Operations for Notices
export const noticeCRUD = {
  // Create new notice
  create: (noticeData: Omit<Notice, 'id'>): Notice => {
    const newNotice: Notice = {
      id: `notice_${Date.now()}`,
      ...noticeData,
      createdAt: new Date().toISOString(),
      isPinned: false
    };
    mockNotices.push(newNotice);
    return newNotice;
  },

  // Read all notices
  readAll: (): Notice[] => {
    return mockNotices;
  },

  // Read notice by ID
  readById: (id: string): Notice | undefined => {
    return mockNotices.find(notice => notice.id === id);
  },

  // Update notice
  update: (id: string, updates: Partial<Notice>): Notice | null => {
    const index = mockNotices.findIndex(notice => notice.id === id);
    if (index !== -1) {
      mockNotices[index] = { ...mockNotices[index], ...updates };
      return mockNotices[index];
    }
    return null;
  },

  // Delete notice
  delete: (id: string): boolean => {
    const index = mockNotices.findIndex(notice => notice.id === id);
    if (index !== -1) {
      mockNotices.splice(index, 1);
      return true;
    }
    return false;
  },

  // Search notices
  search: (query: string): Notice[] => {
    const lowerQuery = query.toLowerCase();
    return mockNotices.filter(notice =>
      notice.title.toLowerCase().includes(lowerQuery) ||
      notice.content.toLowerCase().includes(lowerQuery) ||
      notice.author.toLowerCase().includes(lowerQuery)
    );
  },

  // Toggle pin status
  togglePin: (id: string): boolean => {
    const notice = noticeCRUD.readById(id);
    if (notice) {
      noticeCRUD.update(id, { isPinned: !notice.isPinned });
      return true;
    }
    return false;
  }
};

// CRUD Operations for Feedback
export const feedbackCRUD = {
  // Create new feedback
  create: (feedbackData: Omit<Feedback, 'id'>): Feedback => {
    const newFeedback: Feedback = {
      id: `feedback_${Date.now()}`,
      ...feedbackData,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    mockFeedback.push(newFeedback);
    return newFeedback;
  },

  // Read all feedback
  readAll: (): Feedback[] => {
    return mockFeedback;
  },

  // Read feedback by ID
  readById: (id: string): Feedback | undefined => {
    return mockFeedback.find(feedback => feedback.id === id);
  },

  // Update feedback
  update: (id: string, updates: Partial<Feedback>): Feedback | null => {
    const index = mockFeedback.findIndex(feedback => feedback.id === id);
    if (index !== -1) {
      mockFeedback[index] = { ...mockFeedback[index], ...updates };
      return mockFeedback[index];
    }
    return null;
  },

  // Delete feedback
  delete: (id: string): boolean => {
    const index = mockFeedback.findIndex(feedback => feedback.id === id);
    if (index !== -1) {
      mockFeedback.splice(index, 1);
      return true;
    }
    return false;
  },

  // Update feedback status
  updateStatus: (id: string, status: 'pending' | 'in_progress' | 'resolved'): boolean => {
    const feedback = feedbackCRUD.readById(id);
    if (feedback) {
      feedbackCRUD.update(id, { status });
      return true;
    }
    return false;
  }
};

// CRUD Operations for Event Photos
export const photoCRUD = {
  // Create new photo
  create: (photoData: Omit<EventPhoto, 'id'>): EventPhoto => {
    const newPhoto: EventPhoto = {
      id: `photo_${Date.now()}`,
      ...photoData,
      uploadedAt: new Date().toISOString()
    };
    mockEventPhotos.push(newPhoto);
    return newPhoto;
  },

  // Read all photos
  readAll: (): EventPhoto[] => {
    return mockEventPhotos;
  },

  // Read photo by ID
  readById: (id: string): EventPhoto | undefined => {
    return mockEventPhotos.find(photo => photo.id === id);
  },

  // Update photo
  update: (id: string, updates: Partial<EventPhoto>): EventPhoto | null => {
    const index = mockEventPhotos.findIndex(photo => photo.id === id);
    if (index !== -1) {
      mockEventPhotos[index] = { ...mockEventPhotos[index], ...updates };
      return mockEventPhotos[index];
    }
    return null;
  },

  // Delete photo
  delete: (id: string): boolean => {
    const index = mockEventPhotos.findIndex(photo => photo.id === id);
    if (index !== -1) {
      mockEventPhotos.splice(index, 1);
      return true;
    }
    return false;
  }
};

// CRUD Operations for Reports
export const reportCRUD = {
  // Create new report
  create: (reportData: Omit<Report, 'id'>): Report => {
    const newReport: Report = {
      id: `report_${Date.now()}`,
      ...reportData,
      createdAt: new Date().toISOString(),
      downloadCount: 0
    };
    mockReports.push(newReport);
    return newReport;
  },

  // Read all reports
  readAll: (): Report[] => {
    return mockReports;
  },

  // Read report by ID
  readById: (id: string): Report | undefined => {
    return mockReports.find(report => report.id === id);
  },

  // Update report
  update: (id: string, updates: Partial<Report>): Report | null => {
    const index = mockReports.findIndex(report => report.id === id);
    if (index !== -1) {
      mockReports[index] = { ...mockReports[index], ...updates };
      return mockReports[index];
    }
    return null;
  },

  // Delete report
  delete: (id: string): boolean => {
    const index = mockReports.findIndex(report => report.id === id);
    if (index !== -1) {
      mockReports.splice(index, 1);
      return true;
    }
    return false;
  },

  // Search reports
  search: (query: string): Report[] => {
    const lowerQuery = query.toLowerCase();
    return mockReports.filter(report =>
      report.title.toLowerCase().includes(lowerQuery) ||
      report.description.toLowerCase().includes(lowerQuery) ||
      report.author.toLowerCase().includes(lowerQuery) ||
      report.department.toLowerCase().includes(lowerQuery) ||
      report.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  // Filter by category
  filterByCategory: (category: string): Report[] => {
    return mockReports.filter(report => report.category === category);
  },

  // Filter by department
  filterByDepartment: (department: string): Report[] => {
    return mockReports.filter(report => report.department === department);
  },

  // Get public reports only
  getPublicReports: (): Report[] => {
    return mockReports.filter(report => report.isPublic);
  },

  // Increment download count
  incrementDownloadCount: (id: string): boolean => {
    const report = reportCRUD.readById(id);
    if (report) {
      reportCRUD.update(id, { downloadCount: report.downloadCount + 1 });
      return true;
    }
    return false;
  }
};

// Export all CRUD operations
export const crudOperations = {
  members: memberCRUD,
  events: eventCRUD,
  notices: noticeCRUD,
  feedback: feedbackCRUD,
  photos: photoCRUD,
  reports: reportCRUD
}; 