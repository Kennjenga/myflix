import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Footer from "@/components/Footer";
import Header from "@/components/header";
import { ContentList } from "@/components/contentList";
import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";

const Page = async () => {
  const session = await getServerSession(options);

  let user;

  if (session) {
    // If session exists, use the user from the session
    user = session.user;
  } else {
    // If no session, check the cookies for a session token
    const sessionCookie = cookies().get("session");
    if (sessionCookie) {
      // Decrypt the session cookie to get user information
      const decryptedSession = await decrypt(sessionCookie.value);
      user = decryptedSession; // Assuming decryptedSession contains user info
    }
  }
  console.log(session);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header user={user} />

      <div className="flex flex-col w-9/10">
        <h1 className="text-3xl font-bold mb-4">Trending Shows</h1>
      </div>
      <ContentList />
      <Footer />
    </div>
  );
};

export default Page;
