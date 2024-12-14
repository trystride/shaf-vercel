"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Announcement {
  id: string;
  annId: string;
  header: string;
  body: string | null;
  publishDate: string;
  url: string;
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsRes, keywordsRes] = await Promise.all([
          fetch("/api/user/announcements"),
          fetch("/api/user/keywords")
        ]);

        if (announcementsRes.ok && keywordsRes.ok) {
          const [announcementsData, keywordsData] = await Promise.all([
            announcementsRes.json(),
            keywordsRes.json()
          ]);

          setAnnouncements(announcementsData);
          setKeywords(keywordsData.map((k: any) => k.term));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAnnouncements = selectedKeyword === "all"
    ? announcements
    : announcements.filter(ann => ann.matchedKeyword === selectedKeyword);

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">الإعلانات المطابقة</h1>
        <select
          className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800"
          value={selectedKeyword}
          onChange={(e) => {
            setSelectedKeyword(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">كل الكلمات المفتاحية</option>
          {keywords.map((keyword) => (
            <option key={keyword} value={keyword}>
              {keyword}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {paginatedAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-lg">{announcement.header}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(announcement.publishDate).toLocaleDateString('ar')}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {announcement.matchedKeyword}
                </span>
              </div>
            </div>
            {announcement.body && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {announcement.body}
              </p>
            )}
            <a
              href={announcement.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-sm text-primary hover:underline"
            >
              عرض التفاصيل
              <svg 
                className="w-4 h-4 mr-1 rotate-180" 
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </a>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            التالي
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
            {currentPage} من {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            السابق
          </button>
        </div>
      )}
    </div>
  );
}
