import { CalendarDays, Clock, Star, Tv } from "lucide-react";
import { Badge } from "./ui/badge";

// used in contentHEro
export default function ContentMeta({ content }: { content: Content }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
      <Badge
        variant="secondary"
        className="text-primary-foreground bg-primary/20 backdrop-blur-sm"
      >
        {content.content_type === "tv_show" ? "TV Series" : "Movie"}
      </Badge>
      <span className="flex items-center">
        <CalendarDays className="w-4 h-4 mr-2 text-primary" />
        {content.release_date}
      </span>
      <span className="flex items-center">
        {content.content_type === "tv_show" ? (
          <>
            <Tv className="w-4 h-4 mr-2 text-primary" />
            {content.episodes} Episodes
          </>
        ) : (
          <>
            <Clock className="w-4 h-4 mr-2 text-primary" />
            {content.duration}
          </>
        )}
      </span>
      <span className="flex items-center text-yellow-400">
        <Star className="w-4 h-4 mr-1 fill-current" />
        {content.rating} Rating
      </span>
    </div>
  );
}
