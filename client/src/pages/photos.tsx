import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Camera, 
  Download, 
  Share2, 
  Eye, 
  Calendar,
  MapPin,
  Users,
  Heart,
  MessageCircle,
  Star
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function PhotoGallery() {
  const { language } = useLanguage();

  // Notice-based photo gallery items
  const noticePhotos = [
    {
      id: 'kargil-victory',
      title: 'कारगिल विजय दिवस समारंभ',
      description: '२६ जुलै २०२५ रोजी कारगिल विजय दिवसानिमित्त सर्व जिल्हांमध्ये श्रद्धांजली कार्यक्रम आयोजित करा. वीर शहीदांना आदरांजली वाहा आणि त्यांच्या त्यागाला स्मरण करा.',
      image: 'https://cms.patrika.com/wp-content/uploads/2025/07/2_395772.jpg?w=450&q=90',
      category: 'राष्ट्रीय कार्यक्रम',
      date: '26 जुलै 2025',
      location: 'सर्व जिल्हे',
      likes: 234,
      comments: 45,
      tags: ['कारगिल', 'विजय दिवस', 'राष्ट्रीय', 'श्रद्धांजली'],
      priority: 'urgent'
    },
    {
      id: 'membership-drive',
      title: 'मासिक सदस्यता अभियान',
      description: 'ऑगस्ट महिन्यात नवीन सदस्यत्व मिळवण्यासाठी विशेष मोहीम राबवा. प्रत्येक मतदारसंघात कमीत कमी १०० नवीन सदस्य भरती करण्याचे लक्ष्य ठेवा.',
      image: 'https://staticimg.amarujala.com/assets/images/2024/09/03/cg-news_6ab53ff2ce8033ff9dd363b40e6002e2.jpeg?w=674&dpr=1.0&q=80',
      category: 'सदस्यत्व',
      date: 'ऑगस्ट 2025',
      location: 'सर्व मतदारसंघ',
      likes: 156,
      comments: 28,
      tags: ['सदस्यत्व', 'अभियान', 'भरती', 'लक्ष्य'],
      priority: 'medium'
    },
    {
      id: 'digital-literacy',
      title: 'डिजिटल साक्षरता कार्यशाळा',
      description: 'ग्रामीण भागातील कार्यकर्त्यांसाठी डिजिटल साक्षरता कार्यशाळा आयोजित करा. १५ ऑगस्ट ते ३१ ऑगस्ट २०२५ या कालावधीत सर्व जिल्ह्यांमध्ये कार्यशाळा घ्या.',
      image: 'https://superca.in/storage/app/public/blogs/pmgdisha.webp',
      category: 'प्रशिक्षण',
      date: '15-31 ऑगस्ट 2025',
      location: 'ग्रामीण केंद्रे',
      likes: 89,
      comments: 12,
      tags: ['डिजिटल', 'साक्षरता', 'कार्यशाळा', 'प्रशिक्षण'],
      priority: 'high'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'राष्ट्रीय कार्यक्रम':
        return '🇮🇳';
      case 'सदस्यत्व':
        return '👥';
      case 'प्रशिक्षण':
        return '📚';
      default:
        return '📸';
    }
  };

  return (
    <div className="min-h-screen saffron-pattern-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full blur-2xl"></div>
      </div>

      <div className="responsive-container relative z-10">
        {/* Header */}
        <div className="mb-8 saffron-3d-card responsive-card responsive-p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 saffron-logo-3d rounded-full p-2 flex items-center justify-center flex-shrink-0">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="responsive-text-2xl sm:responsive-text-3xl font-bold bg-gradient-to-r from-yellow-700 via-orange-600 to-yellow-800 bg-clip-text text-transparent mb-2 tracking-wide">
                  {language === 'mr' ? 'फोटो गॅलरी' : 'Photo Gallery'}
                </h1>
                <p className="responsive-text-sm sm:responsive-text-base text-gray-600 font-medium">
                  {language === 'mr' ? 'कार्यक्रम आणि सूचनांची छायाचित्रे' : 'Pictures of Events and Notices'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice-Based Photos Section */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
              {language === 'mr' ? 'सूचना आधारित छायाचित्रे' : 'Notice-Based Photos'}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {language === 'mr' ? 'महत्वपूर्ण सूचना आणि कार्यक्रमांची दृश्य प्रतिमा' : 'Visual representation of important notices and events'}
            </p>
          </div>

          <div className="responsive-grid">
            {noticePhotos.map((photo, index) => (
              <Card key={`${photo.id}-${index}`} className="bjp-card-hover responsive-card overflow-hidden">
                <div className="relative">
                  <img 
                    src={photo.image} 
                    alt={photo.title}
                    className="responsive-image w-full h-40 sm:h-48 md:h-56 object-cover"
                    onError={(e) => {
                      // Fallback for broken images
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={`responsive-badge ${getPriorityColor(photo.priority)}`}>
                      <span className="mr-2">{getCategoryIcon(photo.category)}</span>
                      <span className="hidden sm:inline">{photo.category}</span>
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button variant="ghost" size="sm" className="bg-black/20 text-white hover:bg-black/40 responsive-button">
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="responsive-p-4 sm:responsive-p-6">
                  <div className="space-y-4 sm:space-y-5">
                    <div>
                      <h3 className="responsive-text-base sm:responsive-text-lg font-bold text-gray-800 mb-3 line-clamp-1">
                        {photo.title}
                      </h3>
                      <p className="responsive-text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                        {photo.description}
                      </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                        <span>{photo.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                        <span className="truncate">{photo.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {photo.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="responsive-badge text-sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-gray-100">
                      <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base text-gray-500">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span>{photo.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                          <span>{photo.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button variant="ghost" size="sm" className="responsive-button">
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="responsive-button">
                          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="responsive-button">
                          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-8 sm:p-10 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
            {language === 'mr' ? 'गॅलरी आकडेवारी' : 'Gallery Statistics'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-orange-600">3</div>
              <div className="text-lg sm:text-xl text-gray-600 mt-2">
                {language === 'mr' ? 'एकूण छायाचित्रे' : 'Total Photos'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-yellow-600">479</div>
              <div className="text-lg sm:text-xl text-gray-600 mt-2">
                {language === 'mr' ? 'एकूण आवडी' : 'Total Likes'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-blue-600">85</div>
              <div className="text-lg sm:text-xl text-gray-600 mt-2">
                {language === 'mr' ? 'एकूण टिप्पण्या' : 'Total Comments'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-green-600">12</div>
              <div className="text-lg sm:text-xl text-gray-600 mt-2">
                {language === 'mr' ? 'एकूण शेअर' : 'Total Shares'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 