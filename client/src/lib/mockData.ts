// Mock data for BJP Connect Dashboard
// Based on Maharashtra BJP website and requirements

export interface Member {
  id: string;
  fullName: string;
  phone: string;
  constituency: string;
  district: string;
  division: string;
  designation: string;
  achievements: string;
  socialMediaHandles: {
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  isVerified: boolean;
  membershipDate: string;
  profileImage?: string;
  contactInfo: {
    email: string;
    address: string;
    emergencyContact: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: 'online' | 'offline' | 'hybrid';
  venue: string;
  eventDate: string;
  endDate: string;
  maxAttendees: number;
  currentAttendees: number;
  meetingLink?: string;
  organizer: string;
  constituency: string;
  district: string;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  category: string;
  imageUrl?: string;
  attendees: EventAttendee[];
}

export interface EventAttendee {
  id: string;
  memberId: string;
  memberName: string;
  status: 'invited' | 'confirmed' | 'attended' | 'absent';
  registeredAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  author: string;
  targetAudience: 'all' | 'leadership' | 'constituency';
  constituency: string;
  district: string;
  expiryDate: string;
  attachments: string[];
  isPinned: boolean;
  createdAt: string;
  readBy: string[];
}

export interface Leadership {
  id: string;
  name: string;
  position: string;
  constituency: string;
  district: string;
  bio: string;
  achievements: string[];
  socialMediaHandles: {
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    officeAddress: string;
  };
  profileImage: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalMembers: number;
  verifiedMembers: number;
  activeEvents: number;
  upcomingEvents: number;
  totalNotices: number;
  urgentNotices: number;
  totalConstituencies: number;
  totalDistricts: number;
}

// Mock Data
export const mockMembers: Member[] = [
  {
    id: "1",
    fullName: "राजेश कुमार शर्मा",
    phone: "+91 9876543210",
    constituency: "मुंबई दक्षिण",
    district: "मुंबई",
    division: "मुंबई महानगर",
    designation: "विभाग अध्यक्ष",
    achievements: "15 वर्षों का अनुभव, 1000+ सदस्य जुटाए",
    socialMediaHandles: {
      whatsapp: "+91 9876543210",
      facebook: "rajesh.sharma",
      twitter: "@rajesh_sharma"
    },
    isVerified: true,
    membershipDate: "2010-03-15",
    profileImage: "/images/members/rajesh-sharma.jpg",
    contactInfo: {
      email: "rajesh.sharma@bjp.org",
      address: "मुंबई दक्षिण, महाराष्ट्र",
      emergencyContact: "+91 9876543211"
    }
  },
  {
    id: "2",
    fullName: "प्रिया पाटिल",
    phone: "+91 8765432109",
    constituency: "पुणे शहर",
    district: "पुणे",
    division: "पुणे",
    designation: "महिला मोर्चा अध्यक्ष",
    achievements: "महिला सशक्तिकरण कार्यक्रमों में अग्रणी",
    socialMediaHandles: {
      whatsapp: "+91 8765432109",
      instagram: "priya.patil"
    },
    isVerified: true,
    membershipDate: "2015-07-22",
    profileImage: "/images/members/priya-patil.jpg",
    contactInfo: {
      email: "priya.patil@bjp.org",
      address: "पुणे शहर, महाराष्ट्र",
      emergencyContact: "+91 8765432110"
    }
  },
  // Add more members...
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "महाराष्ट्र BJP कार्यकर्ता सम्मेलन",
    description: "महाराष्ट्र के सभी कार्यकर्ताओं के लिए वार्षिक सम्मेलन",
    eventType: "hybrid",
    venue: "मुंबई, महाराष्ट्र",
    eventDate: "2024-02-15T10:00:00",
    endDate: "2024-02-15T18:00:00",
    maxAttendees: 5000,
    currentAttendees: 3200,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    organizer: "महाराष्ट्र BJP",
    constituency: "सभी",
    district: "सभी",
    status: "published",
    category: "सम्मेलन",
    imageUrl: "/images/events/worker-conference.jpg",
    attendees: [
      {
        id: "1",
        memberId: "1",
        memberName: "राजेश कुमार शर्मा",
        status: "confirmed",
        registeredAt: "2024-01-20T09:00:00"
      }
    ]
  },
  {
    id: "2",
    title: "युवा मोर्चा डिजिटल कैंपेन",
    eventType: "online",
    venue: "ऑनलाइन",
    eventDate: "2024-02-20T14:00:00",
    endDate: "2024-02-20T16:00:00",
    maxAttendees: 1000,
    currentAttendees: 750,
    meetingLink: "https://zoom.us/j/123456789",
    organizer: "युवा मोर्चा",
    constituency: "सभी",
    district: "सभी",
    status: "published",
    category: "डिजिटल कैंपेन",
    description: "सोशल मीडिया पर BJP के संदेश को फैलाने के लिए युवा कार्यकर्ताओं का प्रशिक्षण",
    attendees: []
  }
];

export const mockNotices: Notice[] = [
  {
    id: "1",
    title: "महत्वपूर्ण: लोकसभा चुनाव तैयारी बैठक",
    content: "सभी जिला अध्यक्षों को लोकसभा चुनाव की तैयारी के लिए आवश्यक बैठक में उपस्थित होना अनिवार्य है।",
    priority: "urgent",
    category: "चुनाव",
    author: "महाराष्ट्र BJP अध्यक्ष",
    targetAudience: "leadership",
    constituency: "सभी",
    district: "सभी",
    expiryDate: "2024-02-10T23:59:59",
    attachments: ["/documents/election-preparation.pdf"],
    isPinned: true,
    createdAt: "2024-01-25T10:00:00",
    readBy: ["1", "2"]
  },
  {
    id: "2",
    title: "कार्यकर्ता प्रशिक्षण कार्यक्रम",
    content: "नए कार्यकर्ताओं के लिए प्रशिक्षण कार्यक्रम का आयोजन किया जा रहा है।",
    priority: "high",
    category: "प्रशिक्षण",
    author: "संगठन सचिव",
    targetAudience: "all",
    constituency: "सभी",
    district: "सभी",
    expiryDate: "2024-03-01T23:59:59",
    attachments: [],
    isPinned: false,
    createdAt: "2024-01-26T14:30:00",
    readBy: ["1"]
  }
];

export const mockLeadership: Leadership[] = [
  {
    id: "1",
    name: "नरेंद्र मोदी",
    position: "प्रधानमंत्री, भारत",
    constituency: "वाराणसी",
    district: "वाराणसी",
    bio: "भारत के 14वें प्रधानमंत्री, भारतीय जनता पार्टी के राष्ट्रीय अध्यक्ष",
    achievements: [
      "2014 और 2019 में लोकसभा चुनाव में ऐतिहासिक जीत",
      "मेक इन इंडिया, डिजिटल इंडिया जैसे महत्वपूर्ण अभियान",
      "विश्व स्तर पर भारत की छवि को मजबूत किया"
    ],
    socialMediaHandles: {
      whatsapp: "+91 9876543210",
      facebook: "narendramodi",
      twitter: "@narendramodi",
      instagram: "narendramodi",
      youtube: "narendramodi"
    },
    contactInfo: {
      email: "pm@narendramodi.in",
      phone: "+91 9876543210",
      officeAddress: "7, लोक कल्याण मार्ग, नई दिल्ली"
    },
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png",
    isActive: true
  },
  {
    id: "2",
    name: "देवेंद्र फडणवीस",
    position: "महाराष्ट्र के उपमुख्यमंत्री",
    constituency: "नागपुर दक्षिण-पश्चिम",
    district: "नागपुर",
    bio: "महाराष्ट्र के पूर्व मुख्यमंत्री, वर्तमान में उपमुख्यमंत्री",
    achievements: [
      "महाराष्ट्र के मुख्यमंत्री रहे",
      "नागपुर महानगर के विकास में महत्वपूर्ण योगदान",
      "किसान कल्याण के लिए कई योजनाएं शुरू की"
    ],
    socialMediaHandles: {
      whatsapp: "+91 8765432109",
      facebook: "devendrafadnavis",
      twitter: "@Dev_Fadnavis",
      instagram: "devendrafadnavis"
    },
    contactInfo: {
      email: "devendra.fadnavis@maharashtra.gov.in",
      phone: "+91 8765432109",
      officeAddress: "मंत्रालय, मुंबई, महाराष्ट्र"
    },
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Devendra_Fadnavis_%28cropped%29.jpg/800px-Devendra_Fadnavis_%28cropped%29.jpg",
    isActive: true
  },
  {
    id: "3",
    name: "अमित शाह",
    position: "गृह मंत्री, भारत",
    constituency: "गांधीनगर",
    district: "गांधीनगर",
    bio: "भारत के गृह मंत्री और भारतीय जनता पार्टी के राष्ट्रीय अध्यक्ष",
    achievements: [
      "2014 से 2019 तक भारतीय जनता पार्टी के राष्ट्रीय अध्यक्ष",
      "2019 में ऐतिहासिक लोकसभा चुनाव जीत",
      "गृह मंत्रालय में कई महत्वपूर्ण सुधार"
    ],
    socialMediaHandles: {
      whatsapp: "+91 9876543211",
      facebook: "amitshahofficial",
      twitter: "@AmitShah",
      instagram: "amitshahofficial"
    },
    contactInfo: {
      email: "amit.shah@mha.gov.in",
      phone: "+91 9876543211",
      officeAddress: "गृह मंत्रालय, नई दिल्ली"
    },
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Amit_Shah_%28cropped%29.jpg/800px-Amit_Shah_%28cropped%29.jpg",
    isActive: true
  },
  {
    id: "4",
    name: "राजनाथ सिंह",
    position: "रक्षा मंत्री, भारत",
    constituency: "लखनऊ",
    district: "लखनऊ",
    bio: "भारत के रक्षा मंत्री और भारतीय जनता पार्टी के वरिष्ठ नेता",
    achievements: [
      "उत्तर प्रदेश के मुख्यमंत्री रहे",
      "केंद्रीय गृह मंत्री के रूप में कार्य",
      "रक्षा मंत्रालय में आत्मनिर्भर भारत अभियान"
    ],
    socialMediaHandles: {
      whatsapp: "+91 9876543212",
      facebook: "rajanathsingh",
      twitter: "@rajnathsingh",
      instagram: "rajanathsingh"
    },
    contactInfo: {
      email: "rajanath.singh@mod.gov.in",
      phone: "+91 9876543212",
      officeAddress: "रक्षा मंत्रालय, नई दिल्ली"
    },
    profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Rajnath_Singh_%28cropped%29.jpg/800px-Rajnath_Singh_%28cropped%29.jpg",
    isActive: true
  }
];

export const mockDashboardStats: DashboardStats = {
  totalMembers: 24567,
  verifiedMembers: 22000,
  activeEvents: 15,
  upcomingEvents: 8,
  totalNotices: 45,
  urgentNotices: 3,
  totalConstituencies: 288,
  totalDistricts: 36
};

// WhatsApp communication data
export interface WhatsAppMessage {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'document' | 'voice';
  status: 'sent' | 'delivered' | 'read';
}

export const mockWhatsAppMessages: WhatsAppMessage[] = [
  {
    id: "1",
    sender: "महाराष्ट्र BJP",
    receiver: "सभी कार्यकर्ता",
    message: "आज शाम 6 बजे महत्वपूर्ण बैठक है। कृपया उपस्थित रहें।",
    timestamp: "2024-01-26T16:00:00",
    type: "text",
    status: "read"
  }
];

// Feedback and meeting request data
export interface Feedback {
  id: string;
  memberId: string;
  memberName: string;
  subject: string;
  message: string;
  category: 'suggestion' | 'complaint' | 'appreciation' | 'meeting_request' | 'event_feedback' | 'technical_issue';
  status: 'pending' | 'in_progress' | 'resolved';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  userType?: 'member' | 'leader';
  phone?: string;
  email?: string;
  constituency?: string;
  district?: string;
  eventId?: string;
  attachmentUrls?: string[];
  createdAt: string;
  response?: string;
  responseDate?: string;
}

export const mockFeedback: Feedback[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "राजेश कुमार शर्मा",
    subject: "कार्यकर्ता प्रशिक्षण के लिए सुझाव",
    message: "नए कार्यकर्ताओं के लिए और अधिक प्रशिक्षण कार्यक्रम आयोजित किए जाने चाहिए।",
    category: "suggestion",
    status: "pending",
    priority: "medium",
    userType: "member",
    phone: "+91 9876543210",
    email: "rajesh.sharma@bjp.org",
    constituency: "मुंबई दक्षिण",
    district: "मुंबई",
    createdAt: "2024-01-25T10:30:00"
  },
  {
    id: "2",
    memberId: "2",
    memberName: "प्रिया पाटिल",
    subject: "तकनीकी समस्या - वेबसाइट लॉगिन नहीं हो रहा",
    message: "मैं पिछले दो दिनों से वेबसाइट में लॉगिन नहीं कर पा रही हूं। कृपया इस समस्या का समाधान करें।",
    category: "technical_issue",
    status: "in_progress",
    priority: "high",
    userType: "member",
    phone: "+91 8765432109",
    email: "priya.patil@bjp.org",
    constituency: "पुणे शहर",
    district: "पुणे",
    createdAt: "2024-01-26T14:15:00",
    response: "आपकी समस्या को तकनीकी टीम को भेज दिया गया है। 24 घंटे में समाधान मिल जाएगा।",
    responseDate: "2024-01-26T16:30:00"
  },
  {
    id: "3",
    memberId: "3",
    memberName: "अमित वर्मा",
    subject: "कार्यकर्ता सम्मेलन की फीडबैक",
    message: "हाल ही में आयोजित कार्यकर्ता सम्मेलन बहुत अच्छा था। व्यवस्था उत्कृष्ट थी और सभी कार्यक्रम समय पर हुए।",
    category: "event_feedback",
    status: "resolved",
    priority: "low",
    userType: "member",
    eventId: "1",
    phone: "+91 9123456789",
    constituency: "नागपुर पूर्व",
    district: "नागपुर",
    createdAt: "2024-01-27T09:45:00",
    response: "आपकी सकारात्मक फीडबैक के लिए धन्यवाद। हम भविष्य में भी ऐसे कार्यक्रम आयोजित करते रहेंगे।",
    responseDate: "2024-01-27T11:00:00"
  },
  {
    id: "4",
    memberId: "4",
    memberName: "डॉ. सुनीता देशमुख",
    subject: "जिला अध्यक्ष के साथ बैठक का अनुरोध",
    message: "मैं अपने क्षेत्र में महिला कार्यकर्ताओं की समस्याओं पर चर्चा करने के लिए जिला अध्यक्ष जी से मिलना चाहती हूं।",
    category: "meeting_request",
    status: "pending",
    priority: "medium",
    userType: "leader",
    phone: "+91 9876512345",
    email: "sunita.deshmukh@bjp.org",
    constituency: "औरंगाबाद मध्य",
    district: "औरंगाबाद",
    createdAt: "2024-01-27T16:20:00"
  },
  {
    id: "5",
    memberId: "5",
    memberName: "विकास जोशी",
    subject: "युवा मोर्चा कार्यक्रम में अव्यवस्था",
    message: "कल के युवा मोर्चा कार्यक्रम में बहुत अव्यवस्था थी। समय पर शुरू नहीं हुआ और ध्वनि व्यवस्था भी खराब थी।",
    category: "complaint",
    status: "pending",
    priority: "urgent",
    userType: "member",
    eventId: "2",
    phone: "+91 8765123456",
    constituency: "ठाणे पूर्व",
    district: "ठाणे",
    createdAt: "2024-01-28T08:30:00"
  }
];

// Photo upload data
export interface EventPhoto {
  id: string;
  eventId: string;
  eventName: string;
  photoUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  description: string;
  tags: string[];
}

export const mockEventPhotos: EventPhoto[] = [
  {
    id: "1",
    eventId: "1",
    eventName: "महाराष्ट्र BJP कार्यकर्ता सम्मेलन",
    photoUrl: "/images/events/worker-conference-1.jpg",
    uploadedBy: "राजेश कुमार शर्मा",
    uploadedAt: "2024-01-26T18:30:00",
    description: "कार्यकर्ता सम्मेलन का मुख्य सत्र",
    tags: ["सम्मेलन", "कार्यकर्ता", "मुंबई"]
  }
];

// Reports data
export interface Report {
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

export const mockReports: Report[] = [
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
  },
  {
    id: "7",
    title: "युवा मोर्चा गतिविधी अहवाल",
    description: "युवा मोर्चाच्या सर्व कार्यक्रम, नवीन सदस्यत्व आणि युवा सहभागाचा अहवाल",
    category: "monthly",
    type: "word",
    author: "युवा मोर्चा",
    department: "संगठन",
    createdAt: "2025-07-12T13:25:00Z",
    fileSize: "950 KB",
    downloadCount: 78,
    isPublic: true,
    tags: ["युवा", "मोर्चा", "गतिविधी"],
    fileName: "youth_wing_activity_report_july_2025.docx"
  },
  {
    id: "8",
    title: "प्रशिक्षण कार्यक्रम मूल्यांकन 2025",
    description: "वर्षभरातील सर्व प्रशिक्षण कार्यक्रमांचे मूल्यांकन, परिणामकारकता आणि सुधारणा सूचना",
    category: "annual",
    type: "pdf",
    author: "प्रशिक्षण विभाग",
    department: "कार्यक्रम",
    createdAt: "2025-07-08T10:30:00Z",
    fileSize: "4.1 MB",
    downloadCount: 198,
    isPublic: false,
    tags: ["प्रशिक्षण", "मूल्यांकन", "कार्यक्रम"],
    fileName: "training_program_evaluation_2025.pdf"
  },
  {
    id: "9",
    title: "महिला मोर्चा सशक्तिकरण अभियान अहवाल",
    description: "महिला सशक्तिकरण अभियानाचे परिणाम, लाभार्थी आणि सामाजिक प्रभाव विश्लेषण",
    category: "event",
    type: "pdf",
    author: "महिला मोर्चा",
    department: "सामाजिक",
    createdAt: "2025-07-05T14:45:00Z",
    fileSize: "2.6 MB",
    downloadCount: 167,
    isPublic: true,
    tags: ["महिला", "सशक्तिकरण", "अभियान"],
    fileName: "women_empowerment_campaign_report_2025.pdf"
  },
  {
    id: "10",
    title: "खर्च नियंत्रण आणि ऑडिट अहवाल",
    description: "वित्तीय खर्चाचे नियंत्रण, आंतरिक ऑडिट निष्कर्ष आणि सुधारणा शिफारशी",
    category: "financial",
    type: "excel",
    author: "ऑडिट टीम",
    department: "वित्त",
    createdAt: "2025-07-02T09:20:00Z",
    fileSize: "1.5 MB",
    downloadCount: 45,
    isPublic: false,
    tags: ["ऑडिट", "खर्च", "नियंत्रण"],
    fileName: "expense_control_audit_report_2025.xlsx"
  }
]; 