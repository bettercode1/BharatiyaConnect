import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuery } from "@tanstack/react-query";

export default function MaharashtraMap() {
  const { t } = useLanguage();

  const { data: memberStats, isLoading } = useQuery({
    queryKey: ["/api/dashboard/member-stats"],
  });

  const divisions = [
    {
      name: "मुंबई विभाग",
      constituencies: 68,
      members: 5243,
      color: "bg-orange-300 hover:bg-orange-400 border-orange-500",
      textColor: "text-orange-700"
    },
    {
      name: "पुणे विभाग",
      constituencies: 54,
      members: 4892,
      color: "bg-yellow-300 hover:bg-yellow-400 border-yellow-500",
      textColor: "text-yellow-700"
    },
    {
      name: "नाशिक विभाग",
      constituencies: 46,
      members: 3781,
      color: "bg-amber-300 hover:bg-amber-400 border-amber-600",
      textColor: "text-amber-800"
    },
    {
      name: "औरंगाबाद विभाग",
      constituencies: 42,
      members: 3924,
      color: "bg-green-300 hover:bg-green-400 border-green-500",
      textColor: "text-green-700"
    },
    {
      name: "अमरावती विभाग",
      constituencies: 38,
      members: 2865,
      color: "bg-blue-300 hover:bg-blue-400 border-blue-500",
      textColor: "text-blue-700"
    },
    {
      name: "नागपूर विभाग",
      constituencies: 40,
      members: 3862,
      color: "bg-purple-300 hover:bg-purple-400 border-purple-500",
      textColor: "text-purple-700"
    },
  ];

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-amber-900 flex items-center">
          <span className="mr-2">🗺️</span>
          महाराष्ट्र नकाशा - मतदारसंघ दृश्य
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-8 min-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {divisions.map((division, index) => (
              <div
                key={index}
                className={`${division.color} rounded-lg p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2`}
              >
                <h4 className={`font-bold text-lg ${division.textColor} mb-2`}>
                  {division.name}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">मतदारसंघ:</span>
                    <Badge variant="secondary" className="bg-white/80">
                      {division.constituencies}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">सदस्य:</span>
                    <div className={`text-xl font-bold ${division.textColor}`}>
                      {division.members.toLocaleString('hi-IN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              📍 क्षेत्रावर क्लिक करा तपशीलासाठी
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                <span>उच्च सदस्यत्व</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                <span>मध्यम सदस्यत्व</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-400 rounded mr-2"></div>
                <span>वाढती सदस्यत्व</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
