import { ContentDetails } from "./contentDetails";
import { Card, CardContent } from "./ui/card";

export default function ContentAbout({ content }: { content: Content }) {
  return (
    <Card className="w-full max-w-full mx-auto mt-8 bg-gray-800/50 backdrop-blur-md border-gray-700">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-primary">
          About {content.title}
        </h2>
        <ContentDetails content={content} />
      </CardContent>
    </Card>
  );
}
