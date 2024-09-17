import { Play } from "lucide-react";

export function EpisodeList({ episodes }: { episodes: number }) {
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
