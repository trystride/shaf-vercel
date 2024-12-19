import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import NotificationHistoryTable from "@/components/User/NotificationHistory/NotificationHistoryTable";

export const metadata: Metadata = {
  title: "Notification History - Bankruptcy Monitor",
  description: "View your notification history",
};

export default async function NotificationHistoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const notifications = await prisma.notificationHistory.findMany({
    where: { userId: user.id },
    include: {
      matches: {
        include: {
          announcement: true,
          keyword: true,
        },
      },
    },
    orderBy: {
      sentAt: "desc",
    },
    take: 50, // Limit to last 50 notifications
  });

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Notification History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View your recent notifications and their status
          </p>
        </div>
        <div className="p-6.5">
          <NotificationHistoryTable notifications={notifications} />
        </div>
      </div>
    </>
  );
}
