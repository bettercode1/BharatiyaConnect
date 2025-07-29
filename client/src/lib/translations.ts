export type Language = 'mr' | 'en';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    description: 'Marathi - मराठी'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'English - English'
  }
];

export const getLanguageInfo = (code: Language): LanguageInfo => {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code) || AVAILABLE_LANGUAGES[0];
};

export const getCurrentLanguageInfo = (): LanguageInfo => {
  const savedLanguage = localStorage.getItem('language') as Language;
  const currentLanguage = savedLanguage && (savedLanguage === 'mr' || savedLanguage === 'en') 
    ? savedLanguage 
    : 'mr';
  return getLanguageInfo(currentLanguage);
};

export interface Translations {
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    totalMembers: string;
    verifiedMembers: string;
    activeEvents: string;
    upcomingEvents: string;
    notices: string;
    constituencies: string;
    progress: string;
    communication: string;
    feedback: string;
    photos: string;
    targetAchievement: string;
    todaysMessages: string;
    newSuggestions: string;
    uploadedToday: string;
    urgent: string;
    districts: string;
  };

  // Navigation
      nav: {
      dashboard: string;
      memberManagement: string;
      eventManagement: string;
      leadershipGallery: string;
      noticeManagement: string;
      analytics: string;
      reports: string;
      photoGallery: string;
      settings: string;
      feedback: string;
      // Section headers
      mainMenu: string;
      management: string;
      support: string;
    };

  navigation: {
    members: string;
    events: string;
    notices: string;
    leadership: string;
    feedback: string;
    photos: string;
  };

  // Member Management
  members: {
    title: string;
    addNew: string;
    search: string;
    filter: string;
    verified: string;
    unverified: string;
    viewDetails: string;
    designation: string;
    constituency: string;
    district: string;
    phone: string;
    email: string;
    fullName: string;
    achievements: string;
    address: string;
    membershipDate: string;
  };

  // Events
  events: {
    title: string;
    addNew: string;
    published: string;
    draft: string;
    cancelled: string;
    rsvp: string;
    details: string;
    meetingLink: string;
    attendees: string;
    date: string;
    venue: string;
    type: string;
    description: string;
  };

  // Notices
  notices: {
    title: string;
    addNew: string;
    urgent: string;
    high: string;
    medium: string;
    low: string;
    pinned: string;
    author: string;
    category: string;
    expiry: string;
    attachments: string;
    file: string;
  };

  // Leadership
  leadership: {
    title: string;
    achievements: string;
    contact: string;
    whatsapp: string;
    twitter: string;
  };

  // Feedback
  feedback: {
    title: string;
    by: string;
    resolved: string;
    inProgress: string;
    pending: string;
    category: string;
    response: string;
    // New comprehensive fields
    addNew: string;
    submit: string;
    update: string;
    details: string;
    userInfo: string;
    feedbackDetails: string;
    attachments: string;
    uploadFiles: string;
    supportedTypes: string;
    priority: string;
    status: string;
    responseAdmin: string;
    submittedOn: string;
    respondedOn: string;
    // Categories
    eventFeedback: string;
    technicalIssue: string;
    meetingRequest: string;
    suggestion: string;
    complaint: string;
    appreciation: string;
    // Priority levels
    urgent: string;
    high: string;
    medium: string;
    low: string;
    // User types
    member: string;
    leader: string;
    // Form fields
    userType: string;
    name: string;
    phone: string;
    email: string;
    constituency: string;
    district: string;
    subject: string;
    message: string;
    relatedEvent: string;
    // Status messages
    noFeedbackFound: string;
    deleteConfirm: string;
  };

  // Photos
  photos: {
    title: string;
    upload: string;
    by: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    view: string;
  };
}

export const translations: Record<Language, Translations> = {
  mr: {
    dashboard: {
      title: "भारतीय जनता पार्टी - महाराष्ट्र",
      subtitle: "कार्यकर्ता व्यवस्थापन आणि संघटना डॅशबोर्ड",
      totalMembers: "एकूण सदस्य",
      verifiedMembers: "सत्यापित",
      activeEvents: "सक्रिय कार्यक्रम",
      upcomingEvents: "आगामी",
      notices: "सूचना",
      constituencies: "मतदारसंघ",
      progress: "प्रगती",
      communication: "संवाद",
      feedback: "अभिप्राय",
      photos: "फोटो",
      targetAchievement: "लक्ष्य प्राप्ती",
      todaysMessages: "आजचे संदेश",
      newSuggestions: "नवीन सूचना",
      uploadedToday: "आज अपलोड",
      urgent: "तातडीचे",
      districts: "जिल्हे"
    },
    nav: {
      dashboard: "डॅशबोर्ड",
      memberManagement: "सदस्य व्यवस्थापन",
      eventManagement: "कार्यक्रम व्यवस्थापन",
      leadershipGallery: "नेतृत्व गॅलरी",
      noticeManagement: "सूचना व्यवस्थापन",
      analytics: "विश्लेषण",
      reports: "अहवाल",
      photoGallery: "फोटो गॅलरी",
      settings: "सेटिंग्ज",
      feedback: "अभिप्राय",
      mainMenu: "मुख्य मेनू",
      management: "व्यवस्थापन",
      support: "सहाय्य"
    },

    navigation: {
      members: "सदस्य व्यवस्थापन",
      events: "कार्यक्रम",
      notices: "सूचना",
      leadership: "नेतृत्व",
      feedback: "अभिप्राय",
      photos: "फोटो गॅलरी"
    },
    members: {
      title: "सदस्य व्यवस्थापन",
      addNew: "नवीन सदस्य जोडा",
      search: "सदस्य शोधा...",
      filter: "फिल्टर",
      verified: "सत्यापित",
      unverified: "असत्यापित",
      viewDetails: "तपशील पहा",
      designation: "पद",
      constituency: "मतदारसंघ",
      district: "जिल्हा",
      phone: "फोन",
      email: "ईमेल",
      fullName: "पूर्ण नाव",
      achievements: "कामगिरी",
      address: "पत्ता",
      membershipDate: "सदस्यता तारीख"
    },
    events: {
      title: "कार्यक्रम व्यवस्थापन",
      addNew: "नवीन कार्यक्रम",
      published: "प्रकाशित",
      draft: "मसुदा",
      cancelled: "रद्द",
      rsvp: "RSVP",
      details: "तपशील",
      meetingLink: "मीटिंग लिंक",
      attendees: "उपस्थित",
      date: "तारीख",
      venue: "स्थळ",
      type: "प्रकार",
      description: "वर्णन"
    },
    notices: {
      title: "सूचना व्यवस्थापन",
      addNew: "नवीन सूचना",
      urgent: "तातडीचे",
      high: "उच्च",
      medium: "मध्यम",
      low: "कमी",
      pinned: "पिन केले",
      author: "लेखक",
      category: "श्रेणी",
      expiry: "कालबाह्य",
      attachments: "संलग्नक",
      file: "फाईल"
    },
    leadership: {
      title: "नेतृत्व गॅलरी",
      achievements: "कामगिरी",
      contact: "संपर्क",
      whatsapp: "WhatsApp",
      twitter: "Twitter"
    },
    feedback: {
      title: "सदस्य अभिप्राय",
      by: "द्वारा",
      resolved: "सोडवले",
      inProgress: "प्रगतीत",
      pending: "प्रलंबित",
      category: "श्रेणी",
      response: "प्रतिसाद",
      // New comprehensive fields
      addNew: "नवीन अभिप्राय जोडा",
      submit: "सबमिट करा",
      update: "अपडेट करा",
      details: "तपशील पहा",
      userInfo: "वापरकर्ता माहिती",
      feedbackDetails: "अभिप्राय तपशील",
      attachments: "फाईल संलग्नक",
      uploadFiles: "फाईल अपलोड करा",
      supportedTypes: "समर्थित फाईल प्रकार: PDF, DOC, DOCX, JPG, PNG, TXT (कमाल 5MB)",
      priority: "प्राधान्य",
      status: "स्थिती",
      responseAdmin: "प्रशासन प्रतिसाद",
      submittedOn: "सबमिट केले",
      respondedOn: "प्रतिसाद दिले",
      // Categories
      eventFeedback: "कार्यक्रम अभिप्राय",
      technicalIssue: "तांत्रिक समस्या",
      meetingRequest: "बैठक विनंती",
      suggestion: "सूचना",
      complaint: "तक्रार",
      appreciation: "प्रशंसा",
      // Priority levels
      urgent: "तातडीचे",
      high: "उच्च",
      medium: "मध्यम",
      low: "सामान्य",
      // User types
      member: "सदस्य",
      leader: "नेता",
      // Form fields
      userType: "वापरकर्ता प्रकार",
      name: "नाव",
      phone: "फोन क्रमांक",
      email: "ईमेल",
      constituency: "मतदारसंघ",
      district: "जिल्हा",
      subject: "विषय",
      message: "संदेश",
      relatedEvent: "संबंधित कार्यक्रम",
      // Status messages
      noFeedbackFound: "कोणताही अभिप्राय सापडला नाही",
      deleteConfirm: "तुम्हाला खात्री आहे की हा अभिप्राय हटवायचा आहे?"
    },
    photos: {
      title: "कार्यक्रम फोटो गॅलरी",
      upload: "फोटो अपलोड करा",
      by: "द्वारा"
    },
    common: {
      loading: "लोड होत आहे...",
      error: "त्रुटी",
      save: "जतन करा",
      cancel: "रद्द करा",
      edit: "संपादित करा",
      delete: "हटवा",
      view: "पहा"
    }
  },
      en: {
      dashboard: {
        title: "Bharatiya Janata Party - Maharashtra",
        subtitle: "Worker Management & Organization Dashboard",
        totalMembers: "Total Members",
        verifiedMembers: "Verified",
        activeEvents: "Active Events",
        upcomingEvents: "Upcoming",
        notices: "Notices",
        constituencies: "Constituencies",
        progress: "Progress",
        communication: "Communication",
        feedback: "Feedback",
        photos: "Photos",
        targetAchievement: "Target Achievement",
        todaysMessages: "Today's Messages",
        newSuggestions: "New Suggestions",
        uploadedToday: "Uploaded Today",
        urgent: "Urgent",
        districts: "Districts"
      },
    nav: {
      dashboard: "Dashboard",
      memberManagement: "Member Management",
      eventManagement: "Event Management",
      leadershipGallery: "Leadership Gallery",
      noticeManagement: "Notice Management",
      analytics: "Analytics",
      reports: "Reports",
      photoGallery: "Photo Gallery",
      settings: "Settings",
      feedback: "Feedback",
      mainMenu: "MAIN MENU",
      management: "MANAGEMENT",
      support: "SUPPORT"
    },

    navigation: {
      members: "Member Management",
      events: "Events",
      notices: "Notices",
      leadership: "Leadership",
      feedback: "Feedback",
      photos: "Photo Gallery"
    },
    members: {
      title: "Member Management",
      addNew: "Add New Member",
      search: "Search members...",
      filter: "Filter",
      verified: "Verified",
      unverified: "Unverified",
      viewDetails: "View Details",
      designation: "Designation",
      constituency: "Constituency",
      district: "District",
      phone: "Phone",
      email: "Email",
      fullName: "Full Name",
      achievements: "Achievements",
      address: "Address",
      membershipDate: "Membership Date"
    },
    events: {
      title: "Event Management",
      addNew: "New Event",
      published: "Published",
      draft: "Draft",
      cancelled: "Cancelled",
      rsvp: "RSVP",
      details: "Details",
      meetingLink: "Meeting Link",
      attendees: "Attendees",
      date: "Date",
      venue: "Venue",
      type: "Type",
      description: "Description"
    },
    notices: {
      title: "Notice Management",
      addNew: "New Notice",
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
      pinned: "Pinned",
      author: "Author",
      category: "Category",
      expiry: "Expiry",
      attachments: "Attachments",
      file: "File"
    },
    leadership: {
      title: "Leadership Gallery",
      achievements: "Achievements",
      contact: "Contact",
      whatsapp: "WhatsApp",
      twitter: "Twitter"
    },
    feedback: {
      title: "Member Feedback",
      by: "by",
      resolved: "Resolved",
      inProgress: "In Progress",
      pending: "Pending",
      category: "Category",
      response: "Response",
      // New comprehensive fields
      addNew: "Add New Feedback",
      submit: "Submit",
      update: "Update",
      details: "View Details",
      userInfo: "User Information",
      feedbackDetails: "Feedback Details",
      attachments: "File Attachments",
      uploadFiles: "Upload Files",
      supportedTypes: "Supported file types: PDF, DOC, DOCX, JPG, PNG, TXT (Max 5MB)",
      priority: "Priority",
      status: "Status",
      responseAdmin: "Admin Response",
      submittedOn: "Submitted on",
      respondedOn: "Responded on",
      // Categories
      eventFeedback: "Event Feedback",
      technicalIssue: "Technical Issue",
      meetingRequest: "Meeting Request",
      suggestion: "Suggestion",
      complaint: "Complaint",
      appreciation: "Appreciation",
      // Priority levels
      urgent: "Urgent",
      high: "High",
      medium: "Medium",
      low: "Low",
      // User types
      member: "Member",
      leader: "Leader",
      // Form fields
      userType: "User Type",
      name: "Name",
      phone: "Phone Number",
      email: "Email",
      constituency: "Constituency",
      district: "District",
      subject: "Subject",
      message: "Message",
      relatedEvent: "Related Event",
      // Status messages
      noFeedbackFound: "No feedback found",
      deleteConfirm: "Are you sure you want to delete this feedback?"
    },
    photos: {
      title: "Event Photo Gallery",
      upload: "Upload Photo",
      by: "by"
    },
    common: {
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      view: "View"
    }
  }
};
