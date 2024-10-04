import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { decrypt } from "@/lib/session";
import UserProfileEditForm from "@/components/UserProfileEditForm";
import { cookies } from "next/headers";
import { getCanonicalUrl } from "@/utils";
import Link from "next/link";
import { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

interface UserProfile {
  user_id: number;
  username: string;
  email: string | null;
  phone_number: string | null;
  firstname: string | null;
  lastname: string | null;
}

export const metadata: Metadata = {
  title: "Edit Profile | MyFlix",
  description: "Edit your MyFlix profile",
};

export default async function UserProfilePage() {
  const session = await getServerSession(options);
  const sessionCookie = cookies().get("session");
  const user =
    session?.user ||
    (sessionCookie ? await decrypt(sessionCookie.value) : null);

  if (!user) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          You are not authenticated. Please{" "}
          <Link
            href="/login"
            className="font-medium underline underline-offset-4"
          >
            log in
          </Link>{" "}
          to view this page.
        </AlertDescription>
      </Alert>
    );
  }

  const response = await fetch(
    `${getCanonicalUrl()}/api/user?email=${user.email}`
  );
  let userProfile: UserProfile | null = null;

  if (!response.ok) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch user profile. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  userProfile = await response.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile && <UserProfileEditForm userProfile={userProfile} />}
          <div className="mt-6 flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/content">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Content
              </Link>
            </Button>
            {user.role == "admin" && (
              <Button variant="outline" asChild>
                <Link href="/content/update"> Update & create content</Link>
              </Button>
            )}
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
