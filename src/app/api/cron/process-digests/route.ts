import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { sendEmail } from "@/libs/email";
import { headers } from "next/headers";

// Vercel cron authentication
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  try {
    const headersList = headers();
    const authHeader = headersList.get("authorization");

    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    
    // Find all pending digests that are due
    const pendingDigests = await prisma.digestQueue.findMany({
      where: {
        sent: false,
        scheduledFor: {
          lte: now,
        },
      },
      include: {
        user: true,
        matches: {
          include: {
            announcement: true,
            keyword: true,
          },
        },
      },
    });

    for (const digest of pendingDigests) {
      if (!digest.user.email) continue;

      // Generate and send digest email
      const emailContent = generateDigestEmailContent(digest);
      await sendEmail({
        to: digest.user.email,
        subject: `Your ${digest.frequency.toLowerCase()} Bankruptcy Announcements Digest`,
        html: emailContent,
      });

      // Mark digest as sent
      await prisma.digestQueue.update({
        where: { id: digest.id },
        data: { sent: true },
      });
    }

    return NextResponse.json({
      success: true,
      processedCount: pendingDigests.length,
    });
  } catch (error) {
    console.error("Error processing digest notifications:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function generateDigestEmailContent(digest: any): string {
  const groupedAnnouncements = digest.matches.reduce((acc: any, match: any) => {
    const keyword = match.keyword.term;
    if (!acc[keyword]) {
      acc[keyword] = [];
    }
    acc[keyword].push(match.announcement);
    return acc;
  }, {});

  return `
    <h1>${digest.frequency.charAt(0) + digest.frequency.slice(1).toLowerCase()} Bankruptcy Announcements Digest</h1>
    <p>Here are the bankruptcy announcements that match your keywords:</p>
    ${Object.entries(groupedAnnouncements)
      .map(
        ([keyword, announcements]: [string, any[]]) => `
          <div style="margin-bottom: 30px;">
            <h2>Matches for keyword: ${keyword}</h2>
            ${announcements
              .map(
                (announcement) => `
                  <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #eee;">
                    <h3>${announcement.title}</h3>
                    <p>${announcement.description}</p>
                    <p>Date: ${new Date(announcement.date).toLocaleDateString()}</p>
                    ${
                      announcement.url
                        ? `<p><a href="${announcement.url}">View Full Announcement</a></p>`
                        : ""
                    }
                  </div>
                `
              )
              .join("")}
          </div>
        `
      )
      .join("")}
    <p style="margin-top: 30px; color: #666;">
      You can manage your notification preferences in your account settings.
    </p>
  `;
}
