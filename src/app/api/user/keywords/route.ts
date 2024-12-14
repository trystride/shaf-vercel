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

    // Get the current user's keywords
    const keywords = await db.keyword.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(keywords);
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
