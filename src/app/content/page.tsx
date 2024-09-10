"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import Card from "@/components/card";
import Footer from "@/components/Footer";
import Header from "@/components/header";

interface Content {
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

const Page = () => {
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

  const handleSearchChange = debounce((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("search", value);
    router.push(`/content?${params.toString()}`);
  }, 500);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <Header />
      <div className="container my-3 mx-2 grid grid-cols-1 card-range sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
              imageUrl={`/assets/${item.title}.jfif`}
            />
          ))
        ) : (
          <p>No content found for the search query.</p>
        )}
      </div>
      <div className="flex justify-center my-4">
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span className="mx-2">{page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
