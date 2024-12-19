import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import prisma from "@/libs/prisma";
import NotificationSettingsForm from "@/components/User/NotificationSettings/NotificationSettingsForm";
import { BellIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Notification Settings - Bankruptcy Monitor",
  description: "Manage your notification preferences",
};

export default async function NotificationSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    },
    include: {
      notificationPreference: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BellIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notification Settings
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Customize how and when you receive notifications about bankruptcy announcements
              </p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="max-w-2xl">
            <NotificationSettingsForm
              preferences={user.notificationPreference}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
