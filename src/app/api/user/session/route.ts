import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

export async function GET(req: NextRequest) {
    // Get the session using getServerSession
    const session = await getServerSession(options);

    // Access cookies directly from the request
    const sessionCookie = req.cookies.get("session"); // Access the session cookie from req.cookies
    const user =
        session?.user ||
        (sessionCookie ? await decrypt(sessionCookie.value) : null); // Decrypt the cookie if it exists

    return NextResponse.json(user, { status: 200 });
}
