"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

interface SearchResult {
  id: number;
  title: string;
  content_type: string;
}

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user info on mount
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    fetchUserInfo();
  }, []);

  // Close search dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle filtering by content type or rating
  const handleFilter = (filterType: string, value: string) => {
    const params = new URLSearchParams();
    params.set(filterType, value);
    router.push(`/content?${params.toString()}`);
  };

  // Debounced search function to limit API calls
  const debouncedSearch = debounce(async (value: string) => {
    if (value.length > 2) {
      try {
        // Fetch movies matching the search query
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(value)}&content_type=movie`
        );
        const data = await response.json();
        setSearchResults(data.content);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  }, 300);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle search result click and redirect
  const handleResultClick = (result: SearchResult) => {
    router.push(`/content/${result.id}`);
    setSearchQuery(result.title);
    setIsDropdownVisible(false);
  };

  return (
    <div className="mt-1 mb-3 w-full mx-auto sm:mx-2 flex justify-between items-center z-10">
      <div className="flex items-center lg:justify-between gap-4 w-[80%]">
        <div className="text-white text-2xl font-bold ms-3">MYFLIX</div>

        <div className="hidden lg:flex items-center gap-12">
          <nav>
            <ul className="flex space-x-6 text-white">
              <Link href="/">Home</Link>
              <li
                className="cursor-pointer"
                onClick={() => handleFilter("content_type", "movie")}
              >
                Movies
              </li>
              <li
                className="cursor-pointer"
                onClick={() => handleFilter("content_type", "tv_show")}
              >
                TV Shows
              </li>
              <li
                className="cursor-pointer"
                onClick={() => handleFilter("sort", "top_rated")}
              >
                Top IMDB
              </li>
            </ul>
          </nav>

          {/* Search Input */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search for movies..."
              className="px-4 py-1 rounded-md w-64 text-black"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {isDropdownVisible && searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-64 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-50">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {result.content_type}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* User Profile and Logout Button */}
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-white">Welcome, {user.username}</span>
          <button
            className="bg-white text-blue-900 px-4 py-1 rounded-xl me-3"
            onClick={() => console.log("Logout")}
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-white text-blue-900 px-4 py-1 rounded-xl me-3">
            Login
          </button>
        </Link>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-90 z-20 p-4 md:hidden">
          <button className="text-white mb-4" onClick={() => setIsOpen(false)}>
            Close
          </button>
          <nav>
            <ul className="flex flex-col items-center space-y-4 text-white">
              <Link href="/" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <li onClick={() => handleFilter("content_type", "movie")}>
                Movies
              </li>
              <li onClick={() => handleFilter("content_type", "tv_show")}>
                TV Shows
              </li>
              <li onClick={() => handleFilter("sort", "top_rated")}>
                Top IMDB
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
