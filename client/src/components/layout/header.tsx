import { Crown, ChevronDown, Menu, User, Settings, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const { t, language, fontClass, fontDisplayClass } = useLanguage();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Redirect to login page instead of API logout
    window.location.href = "/login";
  };

  const isActive = (path: string) => {
    return location === path || (path === "/dashboard" && location === "/");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 header-saffron-bg saffron-pattern-bg border-b border-orange-200/30 backdrop-blur-md transition-all duration-300 ${
      isScrolled 
        ? 'shadow-xl bg-opacity-95' 
        : 'shadow-lg bg-opacity-90'
    }`}>
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left Side - Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* BJP Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-600 rounded-full p-1 sm:p-2 border-2 border-orange-300 hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full relative">
              <img 
                    src="/assets/bjp-symbol.png" 
                alt="BJP Symbol" 
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Main Party Name */}
            <div className="hidden sm:block">
              <h1 className={`text-lg sm:text-2xl font-bold text-white tracking-wide bjp-text-shadow drop-shadow-lg ${fontDisplayClass}`}>
                {language === 'mr' ? 'भारतीय जनता पार्टी - महाराष्ट्र' : 'Bharatiya Janata Party - Maharashtra'}
              </h1>
            </div>
            <div className="sm:hidden">
              <h1 className={`text-sm font-bold text-white drop-shadow-lg ${fontDisplayClass}`}>
                {language === 'mr' ? 'भाजप महाराष्ट्र' : 'BJP Maharashtra'}
              </h1>
            </div>
          </div>

          {/* Center - Navigation removed - all navigation from left sidebar only */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Navigation removed - all functionality moved to left sidebar */}
          </div>

          {/* Right Side - Language Toggle and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={onMenuClick}
              className="lg:hidden p-1 sm:p-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Login Button or User Menu */}
            {!isAuthenticated ? (
              <Link href="/login">
                <Button className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg border border-orange-200/30 text-white hover:bg-white/30">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === 'mr' ? 'लॉगिन' : 'Login'}
                  </span>
                </Button>
              </Link>
            ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50 p-1 sm:p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-orange-200/30">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                      <AvatarFallback className="bg-orange-500 text-white text-xs sm:text-sm font-bold">
                      {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs sm:text-sm font-bold text-orange-800">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        {user?.role || 'User'}
                      </div>
                    </div>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 z-50 bg-white border border-orange-200 shadow-lg rounded-xl p-2">
                  <DropdownMenuItem className="text-orange-700 hover:text-orange-800 hover:bg-orange-50 rounded-lg mx-1 my-1 p-3">
                    <Link href="/profile" className="flex items-center space-x-2 w-full">
                      <User className="h-4 w-4" />
                      <span>{language === 'mr' ? 'प्रोफाइल' : 'Profile'}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg mx-1 my-1 p-3"
                >
                    <div className="flex items-center space-x-2 w-full">
                      <Crown className="h-4 w-4" />
                  <span>{language === 'mr' ? 'लॉगआउट' : 'Logout'}</span>
                    </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
