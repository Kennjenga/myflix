"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Card from "./card";

interface Content {
  image_url: any;
  content_id: number;
  title: string;
  release_date: string;
  content_type: string;
  rating: string;
}
interface ContentResponse {
  content: Content[];
  totalPages: number;
}

export const ContentList = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const contentType = searchParams.get("content_type") || "";
  const sort = searchParams.get("sort") || "";

  const fetchContent = useCallback(async (): Promise<ContentResponse> => {
    const res = await fetch(
      `/api/content?${new URLSearchParams({
        search,
        content_type: contentType,
        sort,
        page: page.toString(),
        limit: "15", // Adjust this value as needed for pagination
      })}`
    );
    if (!res.ok) throw new Error("Failed to fetch content");
    return res.json();
  }, [search, contentType, sort, page]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const res = await fetchContent();
        setContent(res.content);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [fetchContent]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <>
      <div className="w-9/10 my-3 grid grid-cols-2 card-range sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {loading ? (
          <p>Loading...</p>
        ) : content.length > 0 ? (
          content.map((item) => (
            <Card
              key={item.content_id}
              id={item.content_id}
              title={item.title}
              contentType={item.content_type}
              releaseYear={new Date(item.release_date).getFullYear()}
              rating={item.rating}
              imageUrl={
                item.image_url
                  ? item.image_url
                  : `/assets/${encodeURIComponent(item.title)}.webp`
              }
            />
          ))
        ) : (
          <p>No content found for the search query.</p>
        )}
      </div>
      <div className="flex justify-center my-4">
        <button
          className="me-2 shadow-md bg-violet-500/40 hover:bg-violet-700 px-1 py-0.5 rounded-lg"
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="mx-2">{page}</span>
        <button
          className="ms-2 shadow-md bg-violet-500/40 hover:bg-violet-700 px-1 py-0.5 rounded-lg"
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};
