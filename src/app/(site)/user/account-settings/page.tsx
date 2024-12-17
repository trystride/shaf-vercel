import React from "react";
import Breadcrumb from "@/components/Common/Dashboard/Breadcrumb";
import AccountSettings from "@/components/User/AccountSettings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Account Settings - ${process.env.SITE_NAME}`,
  description: `Manage your account settings on ${process.env.SITE_NAME}`,
};

const AccountSettingsPage = () => {
  return (
    <>
      <Breadcrumb pageTitle="Account Settings" />
      <AccountSettings />
    </>
  );
};

export default AccountSettingsPage;
