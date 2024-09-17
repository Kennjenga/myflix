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

export function ContentDetails({ content }: { content: Content }) {
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
