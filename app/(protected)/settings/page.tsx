"use client";

import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = async () => {
    await logout();
  };

  return (
    <div className="bg-white p-10 rounded-xl w-[600px]">
      <p>Settings Page</p>
      <div className="flex flex-wrap py-5">{JSON.stringify(user, null, 2)}</div>
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;
