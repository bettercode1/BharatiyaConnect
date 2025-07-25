import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, MapPin, Phone, Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Members() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: membersData, isLoading } = useQuery({
    queryKey: ["/api/members", { search, page }],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">सदस्य व्यवस्थापन</h1>
          <p className="text-gray-600 mt-2">
            एकूण {membersData?.total || 0} सदस्य आहेत
          </p>
        </div>
        <Button className="bg-orange-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          नवीन सदस्य जोडा
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="सदस्याचे नाव, मतदारसंघ किंवा जिल्हा शोधा..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              फिल्टर
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {membersData?.members?.map((member: any) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-lg">
                    {member.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-amber-900 truncate">
                    {member.fullName}
                  </h3>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{member.constituency}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="truncate">{member.district}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>सदस्य: {formatDate(member.membershipDate)}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {member.isVerified && (
                      <Badge className="bg-green-100 text-green-800">
                        सत्यापित
                      </Badge>
                    )}
                    {member.designation && (
                      <Badge variant="outline" className="text-xs">
                        {member.designation}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) || (
          <div className="col-span-full text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">कोणतेही सदस्य आढळले नाहीत</h3>
            <p className="text-gray-500">नवीन शोध टर्म वापरून पहा किंवा नवीन सदस्य जोडा</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {membersData?.total > 20 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            मागील
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            पान {page}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page * 20 >= (membersData?.total || 0)}
          >
            पुढील
          </Button>
        </div>
      )}
    </div>
  );
}
