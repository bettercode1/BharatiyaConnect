import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Users, Calendar, Bell, MapPin, Star } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Landing() {
  const { t } = useLanguage();

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                <Crown className="w-8 h-8 text-amber-700" />
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">पारिवार कनेक्ट</h1>
                <p className="text-lg opacity-90">Maharashtra BJP Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-amber-900 mb-6">
            महाराष्ट्र भाजपमध्ये आपले स्वागत आहे
          </h2>
          <p className="text-xl text-amber-700 mb-8 max-w-3xl mx-auto">
            छत्रपती शिवाजी महाराजांच्या आदर्शांनी प्रेरित, एक सुव्यवस्थित डिजिटल व्यासपीठ
            जे प्रशासक, नेतृत्व आणि सदस्यांना जोडते
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            सिस्टममध्ये प्रवेश करा
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">सदस्य व्यवस्थापन</h3>
              <p className="text-amber-700">
                २४,५६७+ सत्यापित सदस्यांचे व्यापक डेटाबेस २८८ मतदारसंघांमध्ये
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">कार्यक्रम व्यवस्थापन</h3>
              <p className="text-amber-700">
                ऑनलाइन आणि ऑफलाइन कार्यक्रम तयार करा, आमंत्रित करा आणि हजेरीचा मागोवा घ्या
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">सूचना प्रणाली</h3>
              <p className="text-amber-700">
                प्राधान्य टॅगसह वर्गीकृत सूचना प्रणाली आणि संलग्नक समर्थन
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">नेतृत्व प्रदर्शनी</h3>
              <p className="text-amber-700">
                प्रमुख नेत्यांची प्रोफाइल आणि त्यांच्या योगदानाची माहिती
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">इंटरॅक्टिव्ह नकाशा</h3>
              <p className="text-amber-700">
                महाराष्ट्राचा इंटरॅक्टिव्ह नकाशा अॅनिमेटेड संख्यांसह
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">भूमिका-आधारित प्रवेश</h3>
              <p className="text-amber-700">
                प्रशासक, नेतृत्व आणि सदस्य भूमिकांसाठी सुरक्षित प्रवेश नियंत्रण
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-amber-900 text-center mb-8">
            आमची उपलब्धी
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">२४,५६७+</div>
              <div className="text-amber-700">सत्यापित सदस्य</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">२८८</div>
              <div className="text-amber-700">मतदारसंघ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">३६</div>
              <div className="text-amber-700">जिल्हे</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">६</div>
              <div className="text-amber-700">विभाग</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Crown className="w-6 h-6" />
            <span className="text-lg font-semibold">पारिवार कनेक्ट</span>
          </div>
          <p className="text-amber-200">
            छत्रपती शिवाजी महाराजांच्या आदर्शांनी प्रेरित | Maharashtra BJP
          </p>
        </div>
      </footer>
    </div>
  );
}
