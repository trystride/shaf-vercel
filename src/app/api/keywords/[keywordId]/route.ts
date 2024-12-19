import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

// PATCH /api/keywords/[keywordId] - Update a keyword
export async function PATCH(
  req: Request,
  { params }: { params: { keywordId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { enabled, term } = body;

    if (enabled === undefined && !term) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "",
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify keyword belongs to user
    const existingKeyword = await prisma.keyword.findFirst({
      where: {
        id: params.keywordId,
        userId: user.id,
      },
    });

    if (!existingKeyword) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If updating term, check for duplicates
    if (term) {
      const duplicateKeyword = await prisma.keyword.findFirst({
        where: {
          term: term.trim(),
          userId: user.id,
          id: { not: params.keywordId }, // Exclude current keyword
        },
      });

      if (duplicateKeyword) {
        return new NextResponse("Keyword already exists", { status: 400 });
      }
    }

    const keyword = await prisma.keyword.update({
      where: {
        id: params.keywordId,
      },
      data: {
        ...(enabled !== undefined && { enabled }),
        ...(term && { term: term.trim() }),
      },
    });

    return NextResponse.json(keyword);
  } catch (error) {
    console.error("[KEYWORD_PATCH]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE /api/keywords/[keywordId] - Delete a keyword
export async function DELETE(
  req: Request,
  { params }: { params: { keywordId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user?.email || "",
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Verify keyword belongs to user
    const existingKeyword = await prisma.keyword.findFirst({
      where: {
        id: params.keywordId,
        userId: user.id,
      },
    });

    if (!existingKeyword) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.keyword.delete({
      where: {
        id: params.keywordId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[KEYWORD_DELETE]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
