import Header from "@/components/header";
import Image from "next/image";
import { CalendarDays, Clock, Film, Tv, Play } from "lucide-react";

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
    const res = await fetch(`http://localhost:3000/api/content/${id}`);
    if (!res.ok) throw new Error("Failed to fetch content");
    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

function ContentDetails({ content }: { content: Content }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="col-span-2">
        <p className="text-gray-300">{content.description}</p>
      </div>
      <div>
        {[
          {
            label: "Content Type",
            value: content.content_type.replace("_", " "),
            capitalize: true,
          },
          { label: "Release Date", value: content.release_date },
          { label: "Duration", value: content.duration },
          ...(content.content_type === "tv_show"
            ? [{ label: "Episodes", value: content.episodes }]
            : []),
        ].map(({ label, value, capitalize }) => (
          <div key={label} className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-gray-400">{label}</h3>
            <p className={`text-gray-300 ${capitalize ? "capitalize" : ""}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EpisodeList({ episodes }: { episodes: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: episodes }, (_, i) => (
        <div
          key={i + 1}
          className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg"
        >
          <div className="w-16 h-16 bg-gray-800 flex items-center justify-center rounded">
            <span className="text-2xl font-bold">{i + 1}</span>
          </div>
          <div>
            <h3 className="font-semibold">Episode {i + 1}</h3>
            <p className="text-sm text-gray-400">
              Episode description not available
            </p>
          </div>
          <button className="ml-auto">
            <Play className="w-8 h-8" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default async function Page({ params }: { params: { id: string } }) {
  const content = await fetchContent(Number(params.id));

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
      <Header />
      <div
        className="relative w-full"
        style={{ height: "56.25vw", maxHeight: "80vh" }}
      >
        <Image
          src={`/assets/${content.title}.jfif`}
          alt={content.title}
          layout="fill"
          objectFit="cover"
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
