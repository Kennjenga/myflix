import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { decrypt } from "@/app/lib/session";
import UserProfileEditForm from "@/components/UserProfileEditForm";
import { cookies } from "next/headers";
import { getCanonicalUrl } from "@/utils";

interface UserProfile {
  user_id: number;
  username: string;
  email: string | null;
  phone_number: string | null;
  firstname: string | null;
  lastname: string | null;
}

const UserProfilePage = async () => {
  const session = await getServerSession(options);
  const sessionCookie = cookies().get("session");
  const user =
    session?.user ||
    (sessionCookie ? await decrypt(sessionCookie.value) : null);

  if (!user) {
    return <div className="text-red-500">User not authenticated</div>; // Handle unauthenticated case
  }

  console.log(user);
  // Fetch user data from API using email
  const response = await fetch(
    `${getCanonicalUrl()}/api/user?email=${user.email}`
  );
  let userProfile: UserProfile = await response.json();
  console.log(userProfile);

  if (!response.ok) {
    return <div className="text-red-500">Error: User not found</div>;
  }

  return (
    <div className="w-[65%] mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Edit Profile for {userProfile?.username || "User"}
      </h1>
      <UserProfileEditForm userProfile={userProfile} />
    </div>
  );
};

export default UserProfilePage;
