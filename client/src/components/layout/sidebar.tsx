import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Calendar,
  Star,
  Megaphone,
  PieChart,
  Settings,
  MessageCircle,
  FileText,
  Camera,
  User,
  Home,
  BellIcon,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { language, t } = useLanguage();
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location === path;
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Scrollable Content Area with Enhanced Scrollbar */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* MAIN MENU Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t.nav.mainMenu}
            </h3>
            <div className="space-y-1">
              {/* Dashboard */}
              <Link href="/">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Dashboard');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <Home className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.dashboard}</span>
                  </div>
                </div>
              </Link>
              
              {/* Member Management */}
              <Link href="/members">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/members') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Members');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.memberManagement}</span>
                  </div>
                </div>
              </Link>
              
              {/* Events */}
              <Link href="/events">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/events') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Events');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.eventManagement}</span>
                  </div>
                </div>
              </Link>
              
              {/* Notices */}
              <Link href="/notices">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/notices') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Notices');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <BellIcon className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.noticeManagement}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* MANAGEMENT Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t.nav.management}
            </h3>
            <div className="space-y-1">
              {/* Leadership */}
              <Link href="/leadership">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/leadership') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Leadership');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.leadershipGallery}</span>
                  </div>
                </div>
              </Link>
              
              {/* Analytics */}
              <Link href="/analytics">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/analytics') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Analytics');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.analytics}</span>
                  </div>
                </div>
              </Link>
              
              {/* Reports */}
              <Link href="/reports">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/reports') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Reports');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.reports}</span>
                  </div>
                </div>
              </Link>
              
              {/* Photo Gallery */}
              <Link href="/photos">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/photos') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Photo Gallery');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.photoGallery}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* SUPPORT Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {t.nav.support}
            </h3>
            <div className="space-y-1">
              {/* Feedback */}
              <Link href="/feedback">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/feedback') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Feedback');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.feedback}</span>
                  </div>
                </div>
              </Link>
              
              {/* Settings */}
              <Link href="/settings">
                <div className={`flex items-center justify-between w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all cursor-pointer ${
                  isActive('/settings') 
                    ? "bg-orange-500 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-50"
                }`} onClick={() => {
                  console.log('Navigating to Settings');
                  onNavigate && onNavigate();
                }}>
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2 sm:mr-3" />
                    <span className="text-xs sm:text-sm font-medium">{t.nav.settings}</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Additional padding at bottom for better scrolling */}
          <div className="h-8"></div>
        </div>
      </div>
      
      {/* Fixed Admin User Section at Bottom */}
      <div className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center px-2 sm:px-3 py-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 rounded-xl flex items-center justify-center mr-2 sm:mr-3">
            <span className="text-white text-xs sm:text-sm font-bold">A</span>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-800">
              {language === 'mr' ? 'प्रशासक वापरकर्ता' : 'Administrator User'}
            </div>
            <div className="text-xs text-gray-500">admin@bjp.org</div>
          </div>
        </div>
      </div>
    </div>
  );
}
