// dashboard/settings/page.js

'use client';  // A komponens Client Component-ként fog működni

import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in.</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.short_name}!</p>
    </div>
  );
};

export default SettingsPage;
