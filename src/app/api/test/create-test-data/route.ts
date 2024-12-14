import { NextResponse } from "next/server";
import { db } from "@/libs/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create test announcements with proper Arabic encoding
    const testAnnouncements = [
      {
        title: "إعلان إفلاس شركة التقنية المتقدمة",
        description: "تعلن لجنة الإفلاس عن إفلاس شركة التقنية المتقدمة وتصفية أصولها",
        url: "https://bankruptcy.gov.sa/123"
      },
      {
        title: "دعوة الدائنين لشركة الابتكارات الإلكترونية",
        description: "دعوة جميع الدائنين لتقديم مطالباتهم المالية",
        url: "https://bankruptcy.gov.sa/456"
      },
      {
        title: "تصفية شركة المستقبل للتجارة",
        description: "قرار لجنة الإفلاس بتصفية شركة المستقبل للتجارة وتعيين أمين تصفية",
        url: "https://bankruptcy.gov.sa/789"
      }
    ];

    const createdAnnouncements = [];

    // Create announcements
    for (const ann of testAnnouncements) {
      const announcement = await db.announcement.create({
        data: {
          annId: Math.floor(Math.random() * 1000000).toString(),
          title: ann.title,
          description: ann.description,
          announcementUrl: ann.url,
          publishDate: new Date()
        }
      });
      createdAnnouncements.push(announcement);
    }

    // Create test keywords if they don't exist
    const testKeywords = [
      "إفلاس",
      "تصفية",
      "دائن",
      "مدين"
    ];

    const createdKeywords = [];

    for (const term of testKeywords) {
      const existingKeyword = await db.keyword.findFirst({
        where: {
          userId: user.id,
          term
        }
      });

      if (!existingKeyword) {
        const keyword = await db.keyword.create({
          data: {
            term,
            userId: user.id
          }
        });
        createdKeywords.push(keyword);
      }
    }

    // Create matches
    const matches = [];
    const keywords = await db.keyword.findMany({
      where: {
        userId: user.id
      }
    });

    for (const announcement of createdAnnouncements) {
      for (const keyword of keywords) {
        if (
          announcement.title.includes(keyword.term) ||
          announcement.description.includes(keyword.term)
        ) {
          const match = await db.match.create({
            data: {
              keywordId: keyword.id,
              announcementId: announcement.id
            }
          });
          matches.push(match);
        }
      }
    }

    return NextResponse.json({
      message: "Test data created successfully",
      announcements: createdAnnouncements,
      keywords: createdKeywords,
      matches
    });
  } catch (error) {
    console.error("Error creating test data:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
