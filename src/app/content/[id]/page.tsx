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

const fetchContent = async (id: number): Promise<Content | null> => {
  try {
    const res = await fetch(`http://localhost:3000/api/content/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch content");
    }
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};

const Page = async ({ params }: { params: { id: string } }) => {
  const content: Content | null = await fetchContent(Number(params.id));

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <p className="text-gray-300">{content.description}</p>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-400">
                  Content Type
                </h3>
                <p className="text-gray-300 capitalize">
                  {content.content_type.replace("_", " ")}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-400">
                  Release Date
                </h3>
                <p className="text-gray-300">{content.release_date}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2 text-gray-400">
                  Duration
                </h3>
                <p className="text-gray-300">{content.duration}</p>
              </div>
              {content.content_type === "tv_show" && (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-400">
                    Episodes
                  </h3>
                  <p className="text-gray-300">{content.episodes}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {content.content_type === "tv_show" && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
            <div className="space-y-4">
              {Array.from({ length: content.episodes }, (_, i) => i + 1).map(
                (episode) => (
                  <div
                    key={episode}
                    className="flex items-center space-x-4 bg-gray-900 p-4 rounded-lg"
                  >
                    <div className="w-16 h-16 bg-gray-800 flex items-center justify-center rounded">
                      <span className="text-2xl font-bold">{episode}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Episode {episode}</h3>
                      <p className="text-sm text-gray-400">
                        Episode description not available
                      </p>
                    </div>
                    <button className="ml-auto">
                      <Play className="w-8 h-8" />
                    </button>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
