import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Menu, X, ArrowUp } from "lucide-react";
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { useLanguage } from "@/hooks/useLanguage";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

// Enhanced Dynamic Saffron Floating Scroll to Top Button Component
const FloatingScrollToTopButton = () => {
  const [location] = useLocation();
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const getPageTitle = () => {
    switch (location) {
      case '/hero':
        return language === 'mr' ? 'डॅशबोर्ड' : 'Dashboard';
      case '/members':
        return language === 'mr' ? 'सदस्य व्यवस्थापन' : 'Member Management';
      case '/events':
        return language === 'mr' ? 'कार्यक्रम व्यवस्थापन' : 'Event Management';
      case '/notices':
        return language === 'mr' ? 'सूचना व्यवस्थापन' : 'Notice Management';
      case '/leadership':
        return language === 'mr' ? 'नेतृत्व गॅलरी' : 'Leadership Gallery';
      case '/analytics':
        return language === 'mr' ? 'विश्लेषण' : 'Analytics';
      case '/reports':
        return language === 'mr' ? 'अहवाल' : 'Reports';
      case '/photos':
        return language === 'mr' ? 'फोटो गॅलरी' : 'Photo Gallery';
      case '/feedback':
        return language === 'mr' ? 'फीडबॅक' : 'Feedback';
      case '/settings':
        return language === 'mr' ? 'सेटिंग्ज' : 'Settings';
      default:
        return language === 'mr' ? 'वर जा' : 'Go to Top';
    }
  };

  const handleScrollToTop = () => {
    setIsClicked(true);
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      setIsClicked(false);
    }, 150);
  };

  return (
    <div className="dynamic-saffron-home-btn fixed bottom-6 right-6 z-50">
      
      <Button
        onClick={handleScrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          dynamic-saffron-btn w-20 h-20 rounded-full shadow-2xl transition-all duration-500 transform relative z-10
          bg-gradient-to-br from-amber-300 via-orange-400 via-yellow-400 to-amber-500 
          hover:from-orange-400 hover:via-amber-500 hover:via-yellow-500 hover:to-orange-600
          border-4 border-white hover:border-amber-100
          ${isHovered ? 'scale-110 rotate-12 shadow-amber-400/60' : 'scale-100 rotate-0 shadow-amber-300/40'}
          ${isClicked ? 'scale-95 rotate-6' : ''}
          group relative overflow-hidden
          animate-float hover:animate-bounce-gentle
        `}
      >
        {/* Dynamic Shimmer Wave Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 via-amber-200/50 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1200 ease-in-out" />
        
        {/* Rotating Inner Saffron Gradient */}
        <div className={`absolute inset-1 rounded-full transition-all duration-700 transform
                        ${isHovered ? 'rotate-180 opacity-100' : 'rotate-0 opacity-70'}
                        bg-gradient-conic from-amber-200/60 via-orange-300/40 via-yellow-300/60 to-amber-200/60`} />
        
        {/* Dynamic Arrow Up Icon with Saffron Glow */}
        <ArrowUp className={`dynamic-arrow-up-icon w-10 h-10 text-white transition-all duration-500 relative z-10
                         font-bold stroke-[3] filter drop-shadow-lg
                         ${isHovered ? 'scale-125 rotate-12 drop-shadow-2xl text-amber-100' : 'scale-100 rotate-0 text-white'}
                         ${isClicked ? 'scale-90 rotate-6' : ''}`} 
                         strokeWidth={3} />
        
        {/* Multiple Pulsing Rings with Different Saffron Shades */}
        <div className={`absolute inset-0 rounded-full border-2 border-amber-300/70
                        ${isHovered ? 'animate-ping-slow' : 'opacity-0'} 
                        transition-opacity duration-500`} />
        
        <div className={`absolute -inset-2 rounded-full border-2 border-orange-300/50
                        ${isHovered ? 'animate-ping-slower' : 'opacity-0'} 
                        transition-opacity duration-700 delay-100`} />
        
        <div className={`absolute -inset-4 rounded-full border-2 border-yellow-300/30
                        ${isHovered ? 'animate-ping-slowest' : 'opacity-0'} 
                        transition-opacity duration-900 delay-200`} />
        
        {/* Success Ripple with Dynamic Saffron */}
        {isClicked && (
          <div className="click-ripple-saffron absolute inset-0 rounded-full 
                         bg-gradient-radial from-amber-300/60 via-orange-400/40 to-transparent
                         animate-ping-slow pointer-events-none" />
        )}
        
        {/* Enhanced Tooltip with Saffron Theme */}
        <div className={`absolute bottom-full right-0 mb-3 px-4 py-2 rounded-xl transition-all duration-500 transform
                        bg-gradient-to-r from-amber-900/95 to-orange-900/95 backdrop-blur-sm
                        text-white shadow-2xl border border-amber-300/30
                        ${isHovered ? 'opacity-100 translate-y-0 scale-100 rotate-2' : 'opacity-0 translate-y-3 scale-95 rotate-0'}
                        pointer-events-none border-2 border-amber-300/40`}>
          <div className="relative flex items-center gap-3">
            <ArrowUp className={`w-5 h-5 text-amber-300 stroke-[2.5] transition-all duration-300
                            ${isHovered ? 'animate-bounce-gentle' : ''}`} strokeWidth={2.5} />
            <span className="font-bold text-base bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              {getPageTitle()}
            </span>
            {/* Enhanced Tooltip Arrow */}
            <div className="absolute top-full right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 
                           border-transparent border-t-amber-900/95 filter drop-shadow-sm" />
          </div>
          
          {/* Tooltip Inner Glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-orange-400/10 
                         animate-pulse-gentle pointer-events-none" />
        </div>
        
        {/* Dynamic Notification with Saffron Animation */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full transition-all duration-500
                        bg-gradient-to-br from-red-400 via-orange-500 to-amber-500
                        ${isHovered ? 'opacity-100 scale-110 animate-bounce-gentle' : 'opacity-0 scale-90'}
                        flex items-center justify-center border-2 border-white shadow-lg`}>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse-fast" />
        </div>

        {/* Orbital Saffron Particles */}
        <div className={`absolute inset-0 transition-all duration-700 transform
                        ${isHovered ? 'opacity-100 rotate-45' : 'opacity-0 rotate-0'}`}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-amber-300 rounded-full animate-orbit-1 transform -translate-x-1/2" />
          <div className="absolute top-1/2 right-0 w-2 h-2 bg-orange-300 rounded-full animate-orbit-2 transform -translate-y-1/2" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-orbit-3 transform -translate-x-1/2" />
          <div className="absolute top-1/2 left-0 w-2 h-2 bg-amber-400 rounded-full animate-orbit-4 transform -translate-y-1/2" />
        </div>

        {/* Breathing Saffron Aura */}
        <div className={`absolute inset-0 rounded-full transition-all duration-1000 transform
                        ${isHovered ? 'scale-150 opacity-40 animate-breathe' : 'scale-100 opacity-0'}
                        bg-gradient-radial from-amber-300/30 via-orange-400/20 to-transparent pointer-events-none`} />
      </Button>
    </div>
  );
};

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content Area with Proper Structure */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Desktop Sidebar - Fixed */}
        {!isMobile && (
          <div className="fixed left-0 top-16 bottom-0 w-64 xl:w-72 bg-white shadow-lg z-30 overflow-y-auto">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-64 sm:w-72 bg-white shadow-lg z-50 pt-16 overflow-y-auto">
              <Sidebar />
            </div>
          </>
        )}
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed top-20 left-4 z-40 bg-orange-500 hover:bg-orange-600 text-white w-12 h-12 rounded-full shadow-lg"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
        
        {/* Main Content - Properly Structured without Footer Spacing */}
        <main className={`flex-1 ${!isMobile ? 'ml-64 xl:ml-72' : ''} pb-8 overflow-x-hidden`}>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer Removed */}
      
              {/* Enhanced Dynamic Saffron Floating Scroll to Top Button */}
        <FloatingScrollToTopButton />
    </div>
  );
}
