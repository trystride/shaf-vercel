import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/libs/db";
import { authOptions } from "@/libs/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's keywords first
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        keywords: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all matches for the user's keywords
    const matches = await db.match.findMany({
      where: {
        keyword: {
          userId: user.id
        }
      },
      include: {
        announcement: true,
        keyword: true
      },
      orderBy: {
        announcement: {
          publishDate: 'desc'
        }
      }
    });

    const announcements = matches.map(match => ({
      Id: match.announcement.id,
      AnnId: match.announcement.id,
      ActionType: match.announcement.actionType || "",
      ActionTypeID: match.announcement.actionTypeId || 0,
      ActionTypeEn: match.announcement.actionTypeEn || "",
      CourtType: match.announcement.courtType || "",
      AnnouncementType: match.announcement.type || "",
      Status: match.announcement.status,
      RequestId: match.announcement.id,
      StatusId: match.announcement.statusId || 0,
      Header: match.announcement.title,
      Comment: match.announcement.description,
      Body: match.announcement.body,
      PublishDate: match.announcement.publishDate,
      debtorName: match.announcement.debtorName || "",
      ActionDate: match.announcement.actionDate,
      url: match.announcement.id,
      AnnCreatedDate: match.announcement.createdAt?.toISOString() || null,
      PageItems: null,
      debtorIdentifier: match.announcement.debtorIdentifier || "",
      matchedKeyword: match.keyword.term
    }));

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
