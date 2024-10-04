"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContentManagementPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [release_date, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [content_type, setContentType] = useState("movie");
  const [duration, setDuration] = useState<string | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
  const [image_url, setImage_url] = useState(""); // New state for image URL
  const [contentList, setContentList] = useState<any[]>([]);
  const [selectedContent, setSelectedContent] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const response = await fetch("/api/content");
    const data = await response.json();
    setContentList(data.content);
  }

  const handleCreateContent = async () => {
    if (window.confirm("Are you sure you want to create this content?")) {
      const newContent = {
        title,
        description,
        release_date: new Date(release_date).toISOString(), // Use the input date
        genre,
        rating: Number(rating),
        content_type,
        duration: content_type === "movie" ? duration : null,
        episodes: content_type === "tv_show" ? episodes : null,
        image_url, // Include image URL
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
        image_url, // Include image URL
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
    setImage_url(content.image_url); // Set image URL for update
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
    setImage_url(""); // Reset image URL
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Content Management</h1>

      <form className="mb-8 space-y-4">
        <h2 className="text-xl font-bold">
          {selectedContent ? "Update" : "Create"} Content
        </h2>

        {/* Title */}
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded text-black"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Release Date */}
        <div>
          <label className="block font-medium">Release Date</label>
          <input
            type="date"
            className="w-full px-4 py-2 border rounded text-black"
            value={release_date}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>

        {/* Genre */}
        <div>
          <label className="block font-medium">Genre</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block font-medium">Rating</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded text-black"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            min="0"
            max="10"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block font-medium">Image URL</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded text-black"
            value={image_url} // Image URL input
            onChange={(e) => setImage_url(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>

        {/* Type (Movie or TV Show) */}
        <div>
          <label className="block font-medium">Content Type</label>
          <select
            className="w-full px-4 py-2 border rounded text-black"
            value={content_type}
            onChange={(e) => setContentType(e.target.value)}
          >
            <option value="movie">Movie</option>
            <option value="tv_show">TV Show</option>
          </select>
        </div>

        {/* Duration or Episodes */}
        {content_type === "movie" ? (
          <div>
            <label className="block font-medium">Duration</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded text-black"
              value={duration || ""}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        ) : (
          <div>
            <label className="block font-medium">Episodes</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded text-black"
              value={episodes || ""}
              onChange={(e) => setEpisodes(Number(e.target.value))}
            />
          </div>
        )}

        <button
          type="button"
          onClick={selectedContent ? handleUpdateContent : handleCreateContent}
          className={`${
            selectedContent ? "bg-yellow-500" : "bg-blue-500"
          } text-white px-4 py-2`}
        >
          {selectedContent ? "Update Content" : "Create Content"}
        </button>
        {selectedContent && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-4 bg-gray-500 text-white px-4 py-2"
          >
            Cancel
          </button>
        )}
        <Button variant="outline" asChild className="w-full text-black">
          <Link href="/user">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profile
          </Link>
        </Button>
      </form>

      <h2 className="text-xl font-bold mb-4">Existing Content</h2>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentList.map((content) => (
            <tr key={content.id}>
              <td>{content.title}</td>
              <td>{content.content_type}</td>
              <td>{content.rating}</td>
              <td>
                <button
                  onClick={() => selectContentForUpdate(content)}
                  className="bg-yellow-500 text-white px-4 py-2 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteContent(content.content_id)}
                  className="bg-red-500 text-white px-4 py-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
