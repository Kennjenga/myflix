// app/page.tsx

import { Suspense } from "react";
import Card from "@/components/card"; // Adjust path as necessary
import Footer from "@/components/Footer";
import Header from "@/components/header";

export const revalidate = 0;

interface Content {
  content_id: number;
  title: string;
  release_date: string;
  content_type: string;
  rating: string;
}

const fetchContent = async (): Promise<Content[]> => {
  const res = await fetch("http://localhost:3000/api/content"); // Adjust URL as needed
  if (!res.ok) {
    throw new Error("Failed to fetch content");
  }
  return res.json();
};

const Page = async () => {
  const content = await fetchContent();

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header />
      <div className="container my-3 mx-2 grid grid-cols-1 card-range sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ">
        {content.map((item) => (
          <Card
            key={item.content_id}
            id={item.content_id}
            title={item.title}
            contentType={item.content_type}
            releaseYear={new Date(item.release_date).getFullYear()}
            rating={item.rating}
            imageUrl={`/assets/${item.title}.jfif`} // Placeholder image URL
          />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Page;
