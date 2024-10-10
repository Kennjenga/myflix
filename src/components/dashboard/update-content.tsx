"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ContentManagementPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [content_type, setContentType] = useState("movie");
  const [duration, setDuration] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const [image_url, setImage_url] = useState("");
  const [contentList, setContentList] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const fetchContent = useCallback(async () => {
    const response = await fetch(
      `/api/content?page=${currentPage}&limit=${itemsPerPage}`
    );
    const data = await response.json();
    console.log(data);
    setContentList(data.content);
    setTotalPages(Math.ceil(data.totalPages));
  }, [currentPage]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleCreateContent = async () => {
    if (window.confirm("Are you sure you want to create this content?")) {
      const newContent = {
        title,
        description,
        release_date: new Date(release_date).toISOString(),
        genre,
        rating: Number(rating),
        content_type,
        duration: content_type === "movie" ? duration : null,
        episodes: content_type === "tv_show" ? episodes : null,
        image_url,
      };

      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      });

      if (response.ok) {
        alert("Content created successfully!");
        fetchContent();
        resetForm();
      } else {
        alert("Error creating content");
      }
    }
  };

  const handleUpdateContent = async () => {
    if (!selectedContent) return alert("Please select content to update");

    if (window.confirm("Are you sure you want to update this content?")) {
      const updatedContent = {
        title,
        description,
        release_date: new Date(release_date).toISOString(),
        genre,
        rating,
        content_type,
        duration: content_type === "movie" ? duration : null,
        episodes: content_type === "tv_show" ? episodes : null,
        image_url,
      };

      const response = await fetch(
        `/api/content/${selectedContent.content_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedContent),
        }
      );

      if (response.ok) {
        alert("Content updated successfully!");
        fetchContent();
        resetForm();
      } else {
        alert("Error updating content");
      }
    }
  };

  const handleDeleteContent = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Content deleted successfully!");
        fetchContent();
      } else {
        alert("Error deleting content");
      }
    }
  };

  const selectContentForUpdate = (content: any) => {
    setSelectedContent(content);
    setTitle(content.title);
    setDescription(content.description);
    setReleaseDate(content.release_date.split("T")[0]);
    setGenre(content.genre);
    setRating(content.rating);
    setContentType(content.content_type);
    setDuration(content.duration);
    setEpisodes(content.episodes);
    setImage_url(content.image_url);
  };

  const resetForm = () => {
    setSelectedContent(null);
    setTitle("");
    setDescription("");
    setReleaseDate("");
    setGenre("");
    setRating(0);
    setContentType("movie");
    setDuration(null);
    setEpisodes(null);
    setImage_url("");
  };

  console.log("pages", totalPages);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Content Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedContent ? "Update" : "Create"} Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Release Date</label>
                <Input
                  type="date"
                  value={release_date}
                  onChange={(e) => setReleaseDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Genre</label>
                <Input
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Rating</label>
                <Input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  min="0"
                  max="10"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Image URL</label>
                <Input
                  value={image_url}
                  onChange={(e) => setImage_url(e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Content Type</label>
                <Select
                  value={content_type}
                  onValueChange={(value) => setContentType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="movie">Movie</SelectItem>
                    <SelectItem value="tv_show">TV Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {content_type === "movie" ? (
                <div>
                  <label className="block font-medium mb-1">Duration</label>
                  <Input
                    value={duration || ""}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-medium mb-1">Episodes</label>
                  <Input
                    type="number"
                    value={episodes || ""}
                    onChange={(e) => setEpisodes(Number(e.target.value))}
                  />
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={
                selectedContent ? handleUpdateContent : handleCreateContent
              }
            >
              {selectedContent ? "Update Content" : "Create Content"}
            </Button>
            {selectedContent && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Existing Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentList.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>{content.title}</TableCell>
                    <TableCell>{content.content_type}</TableCell>
                    <TableCell>{content.rating}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => selectContentForUpdate(content)}
                        className="mr-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteContent(content.content_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            {totalPages > 0 ? (
              <Pagination>
                {currentPage > 1 && (
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </PaginationPrevious>
                )}
                <PaginationContent>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                {currentPage < totalPages && (
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                  >
                    Next
                  </PaginationNext>
                )}
              </Pagination>
            ) : (
              <p>No pages available.</p>
            )}
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 text-gray-700">
        <Button variant="outline" asChild>
          <Link href="/user">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
