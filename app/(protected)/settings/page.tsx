import { auth } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      <p>Settings Page</p>
      <div>{JSON.stringify(session)}</div>
    </div>
  );
};

export default SettingsPage;
