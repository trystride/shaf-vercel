"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareIcon, CalendarIcon, DownloadIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import DOMPurify from "isomorphic-dompurify";

// Safe HTML rendering component
const SafeHTML: React.FC<{ html: string; className?: string }> = ({ html, className }) => {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Content is sanitized by DOMPurify
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }} />;
};

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'class']
  });
};

interface Announcement {
  Id: string;
  AnnId: string;
  ActionType: string;
  ActionTypeID: number;
  ActionTypeEn: string;
  CourtType: string;
  AnnouncementType: string;
  Status: string | null;
  RequestId: string;
  StatusId: number;
  Header: string;
  Comment: string | null;
  Body: string | null;
  PublishDate: string;
  debtorName: string;
  ActionDate: string | null;
  url: string;
  AnnCreatedDate: string | null;
  PageItems: unknown;
  debtorIdentifier: string;
  matchedKeyword: string;
}

export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState<string>("all");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDate = (date: string) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        calendar: 'islamic'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!session) return;
      
      setLoading(true);
      try {
        const [announcementsRes, keywordsRes] = await Promise.all([
          fetch("/api/user/announcements", { 
            cache: 'no-store'
          }),
          fetch("/api/user/keywords", { 
            cache: 'no-store'
          })
        ]);

        if (!announcementsRes.ok || !keywordsRes.ok) {
          const announcementsError = !announcementsRes.ok ? await announcementsRes.json() : null;
          const keywordsError = !keywordsRes.ok ? await keywordsRes.json() : null;
          
          console.error("Error fetching data:", {
            announcements: announcementsError || announcementsRes.statusText,
            keywords: keywordsError || keywordsRes.statusText
          });
          
          toast.error(announcementsError?.error || "Failed to load announcements. Please try again later.");
          return;
        }

        const [announcementsData, keywordsData] = await Promise.all([
          announcementsRes.json(),
          keywordsRes.json()
        ]);

        if (Array.isArray(announcementsData)) {
          setAnnouncements(announcementsData);
        } else {
          console.error("Invalid announcements data format:", announcementsData);
          toast.error("Received invalid data format from server");
        }

        if (Array.isArray(keywordsData)) {
          setKeywords(keywordsData.map(k => k.term));
        } else {
          console.error("Invalid keywords data format:", keywordsData);
          toast.error("Failed to load keywords");
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const filteredAnnouncements = announcements.filter((ann) =>
    selectedKeyword === "all" ? true : ann.matchedKeyword === selectedKeyword
  );

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleShare = async (announcement: Announcement) => {
    try {
      const shareUrl = `https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}`;
      if (navigator.share) {
        await navigator.share({
          title: announcement.Header,
          text: announcement.Comment || "",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        // You might want to add a toast notification here
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const exportToCSV = () => {
    if (announcements.length === 0) return;

    // Define CSV headers and map announcement data
    const headers = [
      'Announcement ID',
      'Title',
      'Action Type',
      'Court',
      'Publish Date',
      'Matched Keyword',
      'Link'
    ];

    const csvData = announcements.map(announcement => [
      announcement.AnnId,
      announcement.Header,
      announcement.ActionType,
      announcement.CourtType,
      new Date(announcement.PublishDate).toLocaleDateString('ar-SA'),
      announcement.matchedKeyword,
      `https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}`
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `announcements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-700">Matched Announcements</h1>
            {announcements.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-[#00A7B1] border-[#00A7B1] hover:bg-[#00A7B1] hover:text-white"
                onClick={exportToCSV}
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
          <div className="w-[200px]">
            <Select
              value={selectedKeyword}
              onValueChange={(value) => {
                setSelectedKeyword(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full border-gray-200 bg-white focus:ring-[#00A7B1] focus:ring-offset-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Filter by:</span>
                  <span className="font-medium text-gray-900">
                    {selectedKeyword === "all" ? "All Keywords" : selectedKeyword}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent 
                align="end" 
                className="w-[200px] bg-white border border-gray-200 shadow-lg"
              >
                <SelectItem 
                  value="all" 
                  className="py-2 px-3 text-gray-900 hover:bg-[#00A7B1]/5 focus:bg-[#00A7B1]/5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">All Keywords</span>
                  </div>
                </SelectItem>
                <div className="max-h-[200px] overflow-auto">
                  {keywords.map((keyword) => (
                    <SelectItem 
                      key={keyword} 
                      value={keyword}
                      className="py-2 px-3 text-gray-900 hover:bg-[#00A7B1]/5 focus:bg-[#00A7B1]/5"
                    >
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className="bg-[#00A7B1]/10 text-[#00A7B1] hover:bg-[#00A7B1]/20"
                        >
                          {keyword}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Card key={i} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-2/3 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {paginatedAnnouncements.map((announcement, index) => (
              <Card 
                key={announcement.Id} 
                className="bg-white hover:shadow-md transition-shadow border border-gray-100 mb-4"
              >
                <CardContent className="p-6">
                  <div className="text-right">
                    <div className="flex justify-end mb-3">
                      <Badge variant="secondary" className="bg-[#00A7B1]/10 text-[#00A7B1] hover:bg-[#00A7B1]/20">
                        {announcement.matchedKeyword}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Button
                          type="button"
                          onClick={() => handleShare(announcement)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <ShareIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-gray-600" dir="rtl">
                          {formatDate(announcement.PublishDate)}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-600 mb-2 text-sm">{announcement.ActionType}</div>
                    <h3 className="text-xl font-semibold text-[#00A7B1] mb-4 hover:text-[#008288] cursor-pointer">
                      {announcement.Header}
                    </h3>
                    {announcement.Comment && (
                      <div className="relative">
                        <SafeHTML
                          className="text-gray-600 text-sm leading-relaxed mb-2"
                          html={`${announcement.Comment} <a href="https://bankruptcy.gov.sa/ar/Announcements/Pages/announcementDetails.aspx?AdID=${announcement.url}" 
                              class="text-[#00A7B1] hover:text-[#008288]">
                            المزيد...
                          </a>`}
                        />
                      </div>
                    )}
                    {announcement.Body && (
                      <SafeHTML
                        className="mt-4 text-gray-700"
                        html={announcement.Body}
                      />
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      {`Matched keyword: ${announcement.matchedKeyword}`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && paginatedAnnouncements.length > 0 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-[#00A7B1] border-[#00A7B1] hover:bg-[#00A7B1] hover:text-white"
            >
              Previous
            </Button>
            <div className="flex items-center mx-4 text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(filteredAnnouncements.length / itemsPerPage)}
            </div>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(
                    Math.ceil(filteredAnnouncements.length / itemsPerPage),
                    p + 1
                  )
                )
              }
              disabled={
                currentPage ===
                Math.ceil(filteredAnnouncements.length / itemsPerPage)
              }
              className="text-[#00A7B1] border-[#00A7B1] hover:bg-[#00A7B1] hover:text-white"
            >
              Next
            </Button>
          </div>
        )}

        {!loading && filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No announcements found</p>
          </div>
        )}
      </div>
    </>
  );
}
