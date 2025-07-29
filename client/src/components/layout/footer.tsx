import { useLanguage } from "@/hooks/useLanguage";

export default function Footer() {
  const { language } = useLanguage();
  
  return (
    <footer className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white relative z-20 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Organization Info */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold">
              {language === 'mr' ? 'भारतीय जनता पार्टी' : 'Bharatiya Janata Party'}
            </h3>
            <p className="text-sm sm:text-base text-orange-100">
              {language === 'mr' 
                ? 'महाराष्ट्र राज्य संघटना - सर्वोच्च नेतृत्व' 
                : 'Maharashtra State Organization - Supreme Leadership'
              }
            </p>
            <div className="flex space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-bold">BJP</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">
              {language === 'mr' ? 'त्वरित लिंक्स' : 'Quick Links'}
            </h4>
            <ul className="space-y-2 text-sm sm:text-base">
              <li>
                <a href="#" className="text-orange-100 hover:text-white transition-colors">
                  {language === 'mr' ? 'सदस्यता' : 'Membership'}
                </a>
              </li>
              <li>
                <a href="#" className="text-orange-100 hover:text-white transition-colors">
                  {language === 'mr' ? 'कार्यक्रम' : 'Events'}
                </a>
              </li>
              <li>
                <a href="#" className="text-orange-100 hover:text-white transition-colors">
                  {language === 'mr' ? 'सूचना' : 'Notices'}
                </a>
              </li>
              <li>
                <a href="#" className="text-orange-100 hover:text-white transition-colors">
                  {language === 'mr' ? 'संपर्क' : 'Contact'}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">
              {language === 'mr' ? 'संपर्क माहिती' : 'Contact Information'}
            </h4>
            <div className="space-y-2 text-sm sm:text-base text-orange-100">
              <p>Mumbai, Maharashtra</p>
              <p>Phone: +91 22 1234 5678</p>
              <p>Email: info@bjpmaharashtra.org</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold">
              {language === 'mr' ? 'सामाजिक माध्यम' : 'Social Media'}
            </h4>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-colors">
                <span className="text-xs sm:text-sm">FB</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-colors">
                <span className="text-xs sm:text-sm">TW</span>
              </a>
              <a href="#" className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-400 transition-colors">
                <span className="text-xs sm:text-sm">IG</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-orange-500 text-center">
          <p className="text-xs sm:text-sm text-orange-100">
            © 2024 {language === 'mr' ? 'भारतीय जनता पार्टी महाराष्ट्र' : 'Bharatiya Janata Party Maharashtra'}. 
            {language === 'mr' ? 'सर्व हक्क राखीव.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
} 