// used in content/[id]
import Image from "next/image";
import { Button } from "./ui/button";
import { Play } from "lucide-react";
import ContentMeta from "./contentMeta";

export default function ContentHero({ content }: { content: Content }) {
  return (
    <div
      className="relative w-full"
      style={{ height: "70vh", minHeight: "400px" }}
    >
      <Image
        src={
          content.image_url ||
          `/assets/${encodeURIComponent(content.title)}.webp`
        }
        alt={content.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-12 w-full space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
          {content.title}
        </h1>
        <ContentMeta content={content} />
        <p className="text-sm sm:text-base md:text-lg text-gray-300 line-clamp-3 max-w-prose">
          {content.description}
        </p>
        <div className="flex space-x-4 text-gray-800">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button size="lg" variant="outline">
            More Info
          </Button>
        </div>
      </div>
    </div>
  );
}
