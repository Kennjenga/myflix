import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

export default async function userService(){
    const session = await getServerSession(options);
  const sessionCookie = cookies().get("session");
  const user =
    session?.user ||
    (sessionCookie ? await decrypt(sessionCookie.value) : null);

    return user;
}