import Header from "@/components/header";
import Image from "next/image";
import { CalendarDays, Clock, Film, Tv, Play, Star } from "lucide-react";
import { ContentDetails } from "@/components/contentDetails";
import { getCanonicalUrl } from "@/utils";
import userService from "@/lib/user";
import ContentHero from "@/components/contentHero";
import ContentAbout from "@/components/contentAbout";

async function fetchContent(id: number): Promise<Content | null> {
  try {
    const res = await fetch(`${getCanonicalUrl()}/api/content/${id}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    return await res.json();
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export default async function Page({ params }: { params: { id: number } }) {
  const contentId = params.id;
  let user = await userService();
  const content = await fetchContent(contentId);
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white text-2xl">
        Error: Content not found
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center bg-gradient-to-br from-gray-900 to-black text-white">
      <Header user={user} />
      <ContentHero content={content} />
      <ContentAbout content={content} />
    </div>
  );
}
