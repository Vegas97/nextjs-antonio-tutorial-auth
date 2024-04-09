import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();
  return (
    <div className="bg-white p-10 rounded-xl w-[600px]">
      <p>Server Page</p>
      <div className="flex flex-wrap py-5">{JSON.stringify(user, null, 2)}</div>
    </div>
  );
};

export default ServerPage;
