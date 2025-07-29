import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Camera, 
  Globe, 
  Palette, 
  Bell,
  Shield,
  Save,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Settings as SettingsIcon
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  
  // User profile state
  const [profile, setProfile] = useState({
    name: 'Pravin Patil',
    whatsapp: '+91 98765 43210',
    email: 'pravin.patil@bjp.org',
    address: '123, BJP Office, Shivaji Nagar, Mumbai - 400001, Maharashtra',
    gender: 'male',
    photo: '/api/placeholder/150/150',
    theme: 'saffron',
    defaultLanguage: 'mr',
    notifications: {
      email: true,
      whatsapp: true,
      sms: false,
      push: true
    },
    privacy: {
      profileVisible: true,
      contactVisible: true,
      activityVisible: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileUpdate = () => {
    toast({
      title: language === 'mr' ? 'यशस्वी' : 'Success',
      description: language === 'mr' ? 'प्रोफाइल यशस्वीरित्या अपडेट केले गेले' : 'Profile updated successfully',
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'mr' ? 'नवीन पासवर्ड जुळत नाही' : 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: language === 'mr' ? 'यशस्वी' : 'Success',
      description: language === 'mr' ? 'पासवर्ड यशस्वीरित्या बदलले गेले' : 'Password changed successfully',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          photo: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen saffron-pattern-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="mb-8 saffron-3d-card rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 saffron-logo-3d rounded-full p-2 flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-700 via-orange-600 to-yellow-800 bg-clip-text text-transparent mb-2 tracking-wide">
                {language === 'mr' ? 'सेटिंग्ज' : 'Settings'}
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                {language === 'mr' ? 'तुमचे खाते आणि प्रोफाइल व्यवस्थापित करा' : 'Manage your account and profile'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {language === 'mr' ? 'प्रोफाइल माहिती' : 'Profile Information'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-orange-200">
                      <AvatarImage src={profile.photo} alt={profile.name} />
                      <AvatarFallback className="text-2xl font-bold bg-orange-100 text-orange-700">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.name}</h3>
                    <p className="text-gray-600 mb-4">{profile.email}</p>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {language === 'mr' ? 'सक्रिय सदस्य' : 'Active Member'}
                    </Badge>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{language === 'mr' ? 'पूर्ण नाव' : 'Full Name'}</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={language === 'mr' ? 'तुमचे पूर्ण नाव टाका' : 'Enter your full name'}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">{language === 'mr' ? 'WhatsApp क्रमांक' : 'WhatsApp Number'}</Label>
                    <Input
                      id="whatsapp"
                      value={profile.whatsapp}
                      onChange={(e) => setProfile(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{language === 'mr' ? 'ईमेल पत्ता' : 'Email Address'}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="example@bjp.org"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">{language === 'mr' ? 'लिंग' : 'Gender'}</Label>
                    <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{language === 'mr' ? 'पुरुष' : 'Male'}</SelectItem>
                        <SelectItem value="female">{language === 'mr' ? 'स्त्री' : 'Female'}</SelectItem>
                        <SelectItem value="other">{language === 'mr' ? 'इतर' : 'Other'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">{language === 'mr' ? 'पत्ता' : 'Address'}</Label>
                    <Textarea
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                      placeholder={language === 'mr' ? 'तुमचा पूर्ण पत्ता टाका' : 'Enter your complete address'}
                      rows={3}
                    />
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'प्रोफाइल अपडेट करा' : 'Update Profile'}
                </Button>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {language === 'mr' ? 'पासवर्ड बदला' : 'Change Password'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{language === 'mr' ? 'सध्याचा पासवर्ड' : 'Current Password'}</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{language === 'mr' ? 'नवीन पासवर्ड' : 'New Password'}</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{language === 'mr' ? 'पासवर्ड पुष्टी करा' : 'Confirm Password'}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button onClick={handlePasswordChange} className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'पासवर्ड बदला' : 'Change Password'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            {/* Theme Settings */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  {language === 'mr' ? 'थीम' : 'Theme'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'mr' ? 'थीम निवडा' : 'Choose Theme'}</Label>
                  <Select value={profile.theme} onValueChange={(value) => setProfile(prev => ({ ...prev, theme: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saffron">{language === 'mr' ? 'केसरी (BJP)' : 'Saffron (BJP)'}</SelectItem>
                      <SelectItem value="blue">{language === 'mr' ? 'निळा' : 'Blue'}</SelectItem>
                      <SelectItem value="green">{language === 'mr' ? 'हिरवा' : 'Green'}</SelectItem>
                      <SelectItem value="dark">{language === 'mr' ? 'गडद' : 'Dark'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{language === 'mr' ? 'डिफॉल्ट भाषा' : 'Default Language'}</Label>
                  <Select value={profile.defaultLanguage} onValueChange={(value) => {
                    setProfile(prev => ({ ...prev, defaultLanguage: value }));
                    setLanguage(value as 'mr' | 'en');
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">मराठी</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {language === 'mr' ? 'सूचना सेटिंग्ज' : 'Notification Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">{language === 'mr' ? 'ईमेल सूचना' : 'Email Notifications'}</Label>
                  <Switch
                    id="email-notifications"
                    checked={profile.notifications.email}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp-notifications">{language === 'mr' ? 'WhatsApp सूचना' : 'WhatsApp Notifications'}</Label>
                  <Switch
                    id="whatsapp-notifications"
                    checked={profile.notifications.whatsapp}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, whatsapp: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">{language === 'mr' ? 'SMS सूचना' : 'SMS Notifications'}</Label>
                  <Switch
                    id="sms-notifications"
                    checked={profile.notifications.sms}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">{language === 'mr' ? 'पुश सूचना' : 'Push Notifications'}</Label>
                  <Switch
                    id="push-notifications"
                    checked={profile.notifications.push}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, push: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {language === 'mr' ? 'गोपनीयता' : 'Privacy'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profile-visible">{language === 'mr' ? 'प्रोफाइल दृश्यमान' : 'Profile Visible'}</Label>
                  <Switch
                    id="profile-visible"
                    checked={profile.privacy.profileVisible}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, profileVisible: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="contact-visible">{language === 'mr' ? 'संपर्क दृश्यमान' : 'Contact Visible'}</Label>
                  <Switch
                    id="contact-visible"
                    checked={profile.privacy.contactVisible}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, contactVisible: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="activity-visible">{language === 'mr' ? 'क्रियाकलाप दृश्यमान' : 'Activity Visible'}</Label>
                  <Switch
                    id="activity-visible"
                    checked={profile.privacy.activityVisible}
                    onCheckedChange={(checked) => setProfile(prev => ({
                      ...prev,
                      privacy: { ...prev.privacy, activityVisible: checked }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bjp-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  {language === 'mr' ? 'खाते क्रिया' : 'Account Actions'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'डेटा एक्सपोर्ट करा' : 'Export Data'}
                </Button>
                <Button variant="outline" className="w-full justify-start text-yellow-600 hover:text-yellow-700">
                  <Edit className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'खाते संपादित करा' : 'Edit Account'}
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'mr' ? 'खाते हटवा' : 'Delete Account'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 