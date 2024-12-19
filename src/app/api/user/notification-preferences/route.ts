import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prisma";
import { z } from "zod";

const notificationPreferenceSchema = z.object({
  emailEnabled: z.boolean(),
  emailFrequency: z.enum(["IMMEDIATE", "DAILY", "WEEKLY"]),
  emailDigestDay: z.string().nullable(),
  emailDigestTime: z.string().nullable(),
}).refine((data) => {
  if (data.emailFrequency === "WEEKLY") {
    return data.emailDigestDay !== null;
  }
  return true;
}, {
  message: "Email digest day is required for weekly notifications",
  path: ["emailDigestDay"],
}).refine((data) => {
  if (data.emailFrequency !== "IMMEDIATE") {
    return data.emailDigestTime !== null;
  }
  return true;
}, {
  message: "Email digest time is required for daily and weekly notifications",
  path: ["emailDigestTime"],
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }), 
        { status: 404 }
      );
    }

    const body = await req.json();
    
    try {
      const validatedData = notificationPreferenceSchema.parse(body);

      const updatedPreference = await prisma.notificationPreference.upsert({
        where: {
          userId: user.id,
        },
        create: {
          userId: user.id,
          ...validatedData,
        },
        update: validatedData,
      });

      return NextResponse.json(updatedPreference);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({
            message: "Invalid request data",
            errors: validationError.errors,
          }),
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized" }), 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { notificationPreference: true },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found" }), 
        { status: 404 }
      );
    }

    return NextResponse.json(user.notificationPreference || {
      emailEnabled: true,
      emailFrequency: "IMMEDIATE",
      emailDigestDay: null,
      emailDigestTime: null,
    });
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
}
