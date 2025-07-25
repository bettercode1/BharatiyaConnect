import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/useLanguage";
import StatsCards from "@/components/dashboard/stats-cards";
import MaharashtraMap from "@/components/dashboard/maharashtra-map";
import RecentMembers from "@/components/dashboard/recent-members";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import LeadershipGallery from "@/components/dashboard/leadership-gallery";
import RecentNotices from "@/components/dashboard/recent-notices";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    };
    return now.toLocaleDateString('hi-IN', options);
  };

  const getSpecialDay = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Check for special days
    if (month === 7 && day === 26) {
      return {
        name: "कारगिल विजय दिवस",
        description: "वीर शहीदांना श्रद्धांजली"
      };
    }
    if (month === 8 && day === 15) {
      return {
        name: "स्वातंत्र्य दिवस",
        description: "राष्ट्रीय उत्सव"
      };
    }
    if (month === 1 && day === 26) {
      return {
        name: "प्रजासत्ताक दिवस",
        description: "संविधान दिवस"
      };
    }
    return {
      name: "राष्ट्रीय सेवा दिवस",
      description: "देशसेवेचा दिवस"
    };
  };

  const specialDay = getSpecialDay();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            पुनः स्वागत आहे, {user?.firstName || 'प्रिय सदस्य'}!
          </h1>
          <p className="text-lg opacity-90 mb-4">
            आज दिनांक: {getCurrentDate()}
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block backdrop-blur-sm">
            <h3 className="font-semibold mb-1">आजचा विशेष दिवस</h3>
            <p className="text-sm opacity-90">{specialDay.name} - {specialDay.description}</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} isLoading={statsLoading} />

      {/* Maharashtra Map */}
      <MaharashtraMap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Members */}
        <RecentMembers />

        {/* Upcoming Events */}
        <UpcomingEvents />
      </div>

      {/* Leadership Gallery */}
      <LeadershipGallery />

      {/* Recent Notices */}
      <RecentNotices />
    </div>
  );
}
