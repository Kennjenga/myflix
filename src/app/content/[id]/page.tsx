import Header from "@/components/header";
import Image from "next/image";
import { CalendarDays, Clock, Film, Tv, Play } from "lucide-react";
import { getCanonicalUrl } from "@/utils";
import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { ContentDetails } from "@/components/contentDetails";

interface Content {
  duration: string;
  episodes: number;
  content_id: number;
  title: string;
  description: string;
  release_date: string;
  content_type: string;
  rating: string;
}

async function fetchContent(id: number): Promise<Content | null> {
  try {
    const res = await fetch(`${getCanonicalUrl()}/api/content/${id}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const content = await fetchContent(Number(params.id));
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

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!content.title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        Error: Content title is missing
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center bg-black text-white">
      <Header user={user} />
      <div
        className="relative w-full"
        style={{ height: "56.25vw", maxHeight: "80vh" }}
      >
        <Image
          src={`/assets/${content.title}.jfif`}
          alt={content.title}
          fill
          style={{ objectFit: "cover" }}
          priority={true}
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            {content.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center">
              <CalendarDays className="w-4 h-4 mr-1" />
              {content.release_date}
            </span>
            <span className="flex items-center">
              {content.content_type === "tv_show" ? (
                <>
                  <Tv className="w-4 h-4 mr-1" />
                  {content.episodes} Episodes
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 mr-1" />
                  {content.duration}
                </>
              )}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {content.duration}
            </span>
            <span className="text-green-500 font-semibold">
              {content.rating} Rating
            </span>
          </div>
          <p className="text-lg text-gray-300 line-clamp-3">
            {content.description}
          </p>
          <button className="flex items-center justify-center bg-white text-black py-2 px-6 rounded hover:bg-opacity-80 transition-colors">
            <Play className="w-5 h-5 mr-2" />
            Play
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl px-4 mt-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">About {content.title}</h2>
          <ContentDetails content={content} />
        </section>

        {/* {content.content_type === "tv_show" && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
            <EpisodeList episodes={content.episodes} />
          </section>
        )} */}
      </div>
    </div>
  );
}
