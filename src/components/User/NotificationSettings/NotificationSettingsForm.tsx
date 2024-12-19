"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Switch } from "@headlessui/react";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

type NotificationPreference = {
  id?: string;
  userId?: string;
  emailEnabled: boolean;
  emailFrequency: "IMMEDIATE" | "DAILY" | "WEEKLY";
  emailDigestDay: string | null;
  emailDigestTime: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

interface NotificationSettingsFormProps {
  preferences: NotificationPreference | null;
}

const DAYS_OF_WEEK = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const DEFAULT_PREFERENCES: NotificationPreference = {
  emailEnabled: true,
  emailFrequency: "IMMEDIATE",
  emailDigestDay: null,
  emailDigestTime: null,
};

export default function NotificationSettingsForm({
  preferences,
}: NotificationSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<NotificationPreference>(
    preferences || DEFAULT_PREFERENCES
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/notification-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      toast.success("Notification preferences saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Email Toggle Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              Email Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Receive notifications about new bankruptcy announcements via email
            </p>
          </div>
          <Switch
            checked={formData.emailEnabled}
            onChange={(checked) =>
              setFormData({
                ...formData,
                emailEnabled: checked,
              })
            }
            className={`${
              formData.emailEnabled ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
          >
            <span
              className={`${
                formData.emailEnabled ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      {formData.emailEnabled && (
        <div className="space-y-8">
          {/* Frequency Selection */}
          <div className="bg-white dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <label className="block">
              <div className="flex items-center space-x-2 mb-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Notification Frequency
                </span>
              </div>
              <select
                value={formData.emailFrequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emailFrequency: e.target.value as "IMMEDIATE" | "DAILY" | "WEEKLY",
                    emailDigestDay:
                      e.target.value === "WEEKLY"
                        ? formData.emailDigestDay || "MONDAY"
                        : null,
                    emailDigestTime:
                      e.target.value !== "IMMEDIATE"
                        ? formData.emailDigestTime || "09:00"
                        : null,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm"
              >
                <option value="IMMEDIATE">Send Immediately</option>
                <option value="DAILY">Daily Digest</option>
                <option value="WEEKLY">Weekly Digest</option>
              </select>
            </label>
          </div>

          {/* Digest Settings */}
          {formData.emailFrequency !== "IMMEDIATE" && (
            <div className="bg-white dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-6">
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Digest Settings
                </span>
              </div>

              <div className="space-y-6">
                {formData.emailFrequency === "WEEKLY" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Day of Week
                    </label>
                    <select
                      value={formData.emailDigestDay || "MONDAY"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emailDigestDay: e.target.value,
                        })
                      }
                      className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm"
                    >
                      {DAYS_OF_WEEK.map((day) => (
                        <option key={day} value={day}>
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Time of Day
                  </label>
                  <input
                    type="time"
                    value={formData.emailDigestTime || "09:00"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emailDigestTime: e.target.value,
                      })
                    }
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-base focus:border-primary focus:outline-none focus:ring-primary dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}
