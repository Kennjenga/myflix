"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContentManagementPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [type, setType] = useState("movie");
  const [duration, setDuration] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<number | null>(null);
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
        releaseDate,
        genre,
        rating,
        type,
        duration: type === "movie" ? duration : null,
        episodes: type === "tv_show" ? episodes : null,
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
        id: selectedContent.id,
        title,
        description,
        releaseDate,
        genre,
        rating,
        type,
        duration: type === "movie" ? duration : null,
        episodes: type === "tv_show" ? episodes : null,
      };

      const response = await fetch(`/api/content/${selectedContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContent),
      });

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
    setReleaseDate(content.release_date.split('T')[0]);
    setGenre(content.genre);
    setRating(content.rating);
    setType(content.content_type);
    setDuration(content.duration);
    setEpisodes(content.episodes);
  };

  const resetForm = () => {
    setSelectedContent(null);
    setTitle("");
    setDescription("");
    setReleaseDate("");
    setGenre("");
    setRating(0);
    setType("movie");
    setDuration(null);
    setEpisodes(null);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Content Management</h1>

      <form className="mb-8">
        <h2 className="text-xl font-bold">{selectedContent ? "Update" : "Create"} Content</h2>

        {/* Form fields */}
        {/* ... (include all form fields here) ... */}

        <button
          type="button"
          onClick={selectedContent ? handleUpdateContent : handleCreateContent}
          className="bg-blue-500 text-white px-4 py-2"
        >
          {selectedContent ? "Update Content" : "Create Content"}
        </button>
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
                  onClick={() => handleDeleteContent(content.id)}
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